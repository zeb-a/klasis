import express from 'express';
import Database from 'better-sqlite3';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Initialize SQLite database
const db = new Database('klasiz.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'teacher',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    subject TEXT,
    grade TEXT,
    background_color TEXT DEFAULT '#F4F1EA',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT '👦',
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes (id)
  );

  CREATE TABLE IF NOT EXISTS behaviors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    label TEXT NOT NULL,
    points INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'wow',
    icon TEXT DEFAULT '⭐',
    audio TEXT DEFAULT 'none',
    sticker_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes (id)
  );

  CREATE TABLE IF NOT EXISTS points_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    behavior_id INTEGER,
    points INTEGER NOT NULL,
    label TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students (id),
    FOREIGN KEY (behavior_id) REFERENCES behaviors (id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4322');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    if (now > expiresAt) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(session.user_id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Helper function to generate session token
function generateSessionToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// AUTH ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password, role = 'teacher' } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password required' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user (in production, hash password!)
    const stmt = db.prepare('INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(email, name, password, role);

    // Create session
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(token, result.lastInsertRowid, expiresAt.toISOString());

    res.json({
      token,
      user: {
        id: result.lastInsertRowid,
        email,
        name,
        role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user (in production, verify hashed password!)
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(token, user.id, expiresAt.toISOString());

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    db.prepare('DELETE FROM sessions WHERE id = ?').run(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// CLASSES ROUTES

// Get all classes for a teacher
app.get('/api/classes', authenticateToken, (req, res) => {
  try {
    const classes = db.prepare('SELECT * FROM classes WHERE teacher_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create class
app.post('/api/classes', authenticateToken, (req, res) => {
  try {
    const { name, subject, grade, backgroundColor } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Class name required' });
    }

    const stmt = db.prepare('INSERT INTO classes (teacher_id, name, subject, grade, background_color) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(req.user.id, name, subject, grade, backgroundColor || '#F4F1EA');

    const newClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(result.lastInsertRowid);
    res.json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get class details with students
app.get('/api/classes/:id', authenticateToken, (req, res) => {
  try {
    const classId = req.params.id;
    
    // Check if user owns this class
    const classData = db.prepare('SELECT * FROM classes WHERE id = ? AND teacher_id = ?').get(classId, req.user.id);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Get students
    const students = db.prepare('SELECT * FROM students WHERE class_id = ? ORDER BY name').all(classId);
    
    // Get behaviors
    const behaviors = db.prepare('SELECT * FROM behaviors WHERE class_id = ? ORDER BY created_at').all(classId);

    res.json({
      ...classData,
      students,
      behaviors
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STUDENTS ROUTES

// Add student
app.post('/api/students', authenticateToken, (req, res) => {
  try {
    const { classId, name, avatar } = req.body;
    
    if (!classId || !name) {
      return res.status(400).json({ error: 'Class ID and name required' });
    }

    // Verify class ownership
    const classData = db.prepare('SELECT id FROM classes WHERE id = ? AND teacher_id = ?').get(classId, req.user.id);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const stmt = db.prepare('INSERT INTO students (class_id, name, avatar) VALUES (?, ?, ?)');
    const result = stmt.run(classId, name, avatar || '👦');

    const newStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid);
    res.json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
app.put('/api/students/:id', authenticateToken, (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, avatar } = req.body;

    // Verify student belongs to teacher's class
    const student = db.prepare(`
      SELECT s.* FROM students s 
      JOIN classes c ON s.class_id = c.id 
      WHERE s.id = ? AND c.teacher_id = ?
    `).get(studentId, req.user.id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const stmt = db.prepare('UPDATE students SET name = ?, avatar = ? WHERE id = ?');
    stmt.run(name || student.name, avatar || student.avatar, studentId);

    const updatedStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
app.delete('/api/students/:id', authenticateToken, (req, res) => {
  try {
    const studentId = req.params.id;

    // Verify student belongs to teacher's class
    const student = db.prepare(`
      SELECT s.* FROM students s 
      JOIN classes c ON s.class_id = c.id 
      WHERE s.id = ? AND c.teacher_id = ?
    `).get(studentId, req.user.id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    db.prepare('DELETE FROM students WHERE id = ?').run(studentId);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BEHAVIORS ROUTES

// Get behaviors for class
app.get('/api/behaviors/:classId', authenticateToken, (req, res) => {
  try {
    const classId = req.params.classId;
    
    // Verify class ownership
    const classData = db.prepare('SELECT id FROM classes WHERE id = ? AND teacher_id = ?').get(classId, req.user.id);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const behaviors = db.prepare('SELECT * FROM behaviors WHERE class_id = ? ORDER BY created_at').all(classId);
    res.json(behaviors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add behavior
app.post('/api/behaviors', authenticateToken, (req, res) => {
  try {
    const { classId, label, points, type, icon, audio } = req.body;
    
    if (!classId || !label) {
      return res.status(400).json({ error: 'Class ID and label required' });
    }

    // Verify class ownership
    const classData = db.prepare('SELECT id FROM classes WHERE id = ? AND teacher_id = ?').get(classId, req.user.id);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const stmt = db.prepare('INSERT INTO behaviors (class_id, label, points, type, icon, audio) VALUES (?, ?, ?, ?, ?, ?)');
    const result = stmt.run(classId, label, points || 0, type || 'wow', icon || '⭐', audio || 'none');

    const newBehavior = db.prepare('SELECT * FROM behaviors WHERE id = ?').get(result.lastInsertRowid);
    res.json(newBehavior);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POINTS ROUTES

// Give points to student
app.post('/api/points', authenticateToken, (req, res) => {
  try {
    const { studentId, behaviorId, points, label } = req.body;
    
    if (!studentId || !points || !label) {
      return res.status(400).json({ error: 'Student ID, points, and label required' });
    }

    // Verify student belongs to teacher's class
    const student = db.prepare(`
      SELECT s.* FROM students s 
      JOIN classes c ON s.class_id = c.id 
      WHERE s.id = ? AND c.teacher_id = ?
    `).get(studentId, req.user.id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update student points
    const newPoints = student.points + points;
    db.prepare('UPDATE students SET points = ? WHERE id = ?').run(newPoints, studentId);

    // Update level based on points
    const newLevel = Math.floor(newPoints / 25) + 1;
    db.prepare('UPDATE students SET level = ? WHERE id = ?').run(newLevel, studentId);

    // Update streak
    const newStreak = points > 0 ? student.streak + 1 : Math.max(0, student.streak - 1);
    db.prepare('UPDATE students SET streak = ? WHERE id = ?').run(newStreak, studentId);

    // Add to history
    db.prepare('INSERT INTO points_history (student_id, behavior_id, points, label) VALUES (?, ?, ?, ?)')
      .run(studentId, behaviorId, points, label);

    const updatedStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get points history for student
app.get('/api/points/:studentId', authenticateToken, (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    // Verify student belongs to teacher's class
    const student = db.prepare(`
      SELECT s.* FROM students s 
      JOIN classes c ON s.class_id = c.id 
      WHERE s.id = ? AND c.teacher_id = ?
    `).get(studentId, req.user.id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const history = db.prepare(`
      SELECT ph.*, b.label as behavior_label 
      FROM points_history ph 
      LEFT JOIN behaviors b ON ph.behavior_id = b.id 
      WHERE ph.student_id = ? 
      ORDER BY ph.timestamp DESC
    `).all(studentId);

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed data for development
app.post('/api/seed', (req, res) => {
  try {
    // Create sample teacher
    const teacherStmt = db.prepare('INSERT OR IGNORE INTO users (email, name, password, role) VALUES (?, ?, ?, ?)');
    const teacherResult = teacherStmt.run('teacher@klasiz.fun', 'Demo Teacher', 'password123', 'teacher');

    // Create sample class
    const classStmt = db.prepare('INSERT OR IGNORE INTO classes (teacher_id, name, subject, grade) VALUES (?, ?, ?, ?)');
    const classResult = classStmt.run(teacherResult.lastInsertRowid, 'Class 3A Mathematics', 'Mathematics', '3rd Grade');

    // Create sample students
    const students = [
      { name: 'Emma Johnson', avatar: '👧' },
      { name: 'Liam Smith', avatar: '👦' },
      { name: 'Olivia Brown', avatar: '👧' },
      { name: 'Noah Davis', avatar: '👦' },
      { name: 'Ava Wilson', avatar: '👧' },
      { name: 'Elijah Moore', avatar: '👦' }
    ];

    const studentStmt = db.prepare('INSERT OR IGNORE INTO students (class_id, name, avatar) VALUES (?, ?, ?)');
    students.forEach(student => {
      studentStmt.run(classResult.lastInsertRowid, student.name, student.avatar);
    });

    // Create sample behaviors
    const behaviors = [
      { label: 'Great Work', points: 2, type: 'wow', icon: '⭐' },
      { label: 'Helped Friend', points: 1, type: 'wow', icon: '🤝' },
      { label: 'On Task', points: 1, type: 'wow', icon: '📚' },
      { label: 'Noisy', points: -1, type: 'nono', icon: '🔇' },
      { label: 'Disruptive', points: -2, type: 'nono', icon: '⚠️' }
    ];

    const behaviorStmt = db.prepare('INSERT OR IGNORE INTO behaviors (class_id, label, points, type, icon) VALUES (?, ?, ?, ?, ?)');
    behaviors.forEach(behavior => {
      behaviorStmt.run(classResult.lastInsertRowid, behavior.label, behavior.points, behavior.type, behavior.icon);
    });

    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📊 Database: klasiz.db');
  console.log('🔐 API endpoints ready');
});
