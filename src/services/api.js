// api.js
const base = (() => {
  // In development, use /api (will be proxied by Vite)
  console.log('🔍 DEV mode check:', import.meta.env.DEV, import.meta.env.MODE);
  if (import.meta.env.DEV) {
    console.log('🔍 Using dev API: /api');
    return '/api';
  }
  // In production, use main domain
  console.log('🔍 Using prod API: https://klasiz.fun/api');
  return 'https://klasiz.fun/api';
})();

// Safe JSON parser that returns a fallback on error - prevents app crashes from corrupted data
function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// Get auth token from localStorage
function getToken() {
  return localStorage.getItem('classABC_pb_token') || null;
}

// PocketBase uses an internal collection id for auth users. Use the id to avoid
// name-based routing mismatches between PocketBase versions.
const AUTH_COLL = '_pb_users_auth_';
const ARCHIVE_MAP_KEY_PREFIX = 'classABC_archived_map_';

function getArchiveMap(email) {
  if (!email || typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(`${ARCHIVE_MAP_KEY_PREFIX}${email}`);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveArchiveMap(email, map) {
  if (!email || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(`${ARCHIVE_MAP_KEY_PREFIX}${email}`, JSON.stringify(map || {}));
  } catch {
    // ignore local persistence errors
  }
}

/** Same window name / sizing as the PocketBase SDK; used with urlCallback so we can .close() after OAuth. */
function openPocketBaseOAuthPopup(url) {
  if (typeof window === 'undefined' || !window.open) return null;
  const maxW = 1024;
  const maxH = 768;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const w = maxW > iw ? iw : maxW;
  const h = maxH > ih ? ih : maxH;
  const top = ih / 2 - h / 2;
  const left = iw / 2 - w / 2;
  return window.open(
    url,
    'popup_window',
    `width=${w},height=${h},top=${top},left=${left},resizable,menubar=no`
  );
}

async function pbRequest(path, opts = {}) {
  // / Ensure we don't double up on /api
  const cleanPath = path.startsWith('/api') ? path.replace('/api', '') : path;
  const url = `${base}${cleanPath}`;
  // const url = `${base.replace(/\/$/, '')}${path}`;
  const { silent = false, ...requestOpts } = opts;
  const headers = requestOpts.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = token;
  requestOpts.headers = { 'Content-Type': 'application/json', ...headers };
  const res = await fetch(url, requestOpts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Only log if not silent mode
    if (!silent) {
      try {

      } catch { /* ignore logging errors */ }
    }
    // Provide user-friendly error messages for common auth errors
    let errorMessage = data.message || `request-failed:${res.status}`;
    if (errorMessage === 'Failed to authenticate.') {
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (errorMessage === 'The request data is invalid.') {
      errorMessage = 'Please check your email and password and try again.';
    } else if (data?.data?.email?.code === 'validation_email_invalid') {
      errorMessage = 'Invalid email address. Please enter a valid email.';
    } else if (data?.data?.email?.code === 'validation_not_unique') {
      errorMessage = 'This email is already registered. Please log in instead.';
    } else if (data?.data?.password?.code === 'validation_length_too_short') {
      errorMessage = 'Password is too short. Please use at least 8 characters.';
    } else if (errorMessage.includes('create') && res.status === 400) {
      // Generic creation error - provide a more helpful message
      errorMessage = 'Unable to create account. Please check your information and try again.';
    }
    const err = new Error(errorMessage);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

// --- EXPORT DEFAULT OBJECT ---
export default {
  pbRequest, // <--- ADD THIS LINE

  async ping() {
    try {
      return await pbRequest('/health');
    } catch {
      return { ok: false };
    }
  },
  async getStudentByParentCode(code) {
    try {
      // Fetch all classes from the database
      const response = await pbRequest('/collections/classes/records');
      const classes = response.items || [];

      for (const cls of classes) {
        const accessCodes = typeof cls.Access_Codes === 'string' ? safeParse(cls.Access_Codes, {}) : (cls.Access_Codes || {});

        if (accessCodes) {
          // Find the student ID that has this parent code
          const studentId = Object.keys(accessCodes).find(id => accessCodes[id].parentCode === code);

          if (studentId) {
            const students = typeof cls.students === 'string' ? safeParse(cls.students, []) : (cls.students || []);
            const student = students.find(s => s.id.toString() === studentId.toString());

            return {
              studentId: studentId,
              studentName: student?.name,
              classData: cls
            };
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  },
  // Inside export default { ... } in api.js

  async getStudentByCode(code, type) {
    const fieldName = type === 'parent' ? 'parentCode' : 'studentCode';
    try {
      // 1. Fetch all classes from the database (with pagination support)
      let classes = [];
      let page = 1;
      while (true) {
        const res = await pbRequest(`/collections/classes/records?page=${page}&perPage=500`);
        classes = classes.concat(res.items || []);
        if (res.items.length < 500) break;
        page++;
      }

      for (const cls of classes) {
        // 2. Parse the Access_Codes JSON
        const accessCodes = typeof cls.Access_Codes === 'string'
          ? safeParse(cls.Access_Codes || '{}', {})
          : (cls.Access_Codes || {});

        // 3. Look for a student ID that matches the 5-digit code
        const studentId = Object.keys(accessCodes).find(id => accessCodes[id][fieldName] === code);

        if (studentId) {
          // 4. If found, get the student details and return the data
          const students = typeof cls.students === 'string'
            ? safeParse(cls.students || '[]', [])
            : (cls.students || []);

          const student = students.find(s => s.id.toString() === studentId.toString());

          return {
            studentId: studentId,
            studentName: student?.name || 'Student',
            classData: {
              ...cls,
              students: students,
              tasks: typeof cls.tasks === 'string' ? safeParse(cls.tasks || '[]', []) : (cls.tasks || []),
              Access_Codes: accessCodes
            }
          };
        }
      }
      // Return null if no match found
      return null;
    } catch (err) {
      throw err;
    }
  },
  async register({ email, password, name, title }) {
    const user = await pbRequest(`/collections/${AUTH_COLL}/records`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        passwordConfirm: password,
        name: name || email,
        title: title || ''
      })
    });

    // Request email verification
    try {
      await pbRequest(`/collections/${AUTH_COLL}/request-verification`, {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    } catch {
      // ...existing code...
    }

    return {
      user: { email: user.email, name: user.name, id: user.id },
      message: 'Account created! Please check your email to verify your account.'
    };
  },

  async login({ email, password }) {
    const auth = await pbRequest(`/collections/${AUTH_COLL}/auth-with-password`, {
      method: 'POST',
      body: JSON.stringify({ identity: email, password }),
      silent: true // Don't log detailed error for login failures
    });

    // Enforce email verification: prevent teacher (and other) logins
    // if the account hasn't been verified via email.
    // PocketBase provides a boolean `verified` on the auth record.
    if (!auth.record?.verified) {
      const err = new Error('Please verify your email before logging in. Check your inbox for the verification link.');
      err.status = 403;
      err.body = { message: 'Email not verified' };
      throw err;
    }

    if (auth.token) {
      localStorage.setItem('classABC_pb_token', auth.token);
    }
    return { user: { email: auth.record.email, name: auth.record.name, id: auth.record.id, title: auth.record.title }, token: auth.token };
  },

  async forgotPassword(email) {
    return await pbRequest(`/collections/${AUTH_COLL}/request-password-reset`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(token, password, passwordConfirm) {
    return await pbRequest(`/collections/${AUTH_COLL}/confirm-password-reset`, {
      method: 'POST',
      body: JSON.stringify({ token, password, passwordConfirm })
    });
  },

  async verifyEmail(token) {
    return await pbRequest(`/collections/${AUTH_COLL}/confirm-verification`, {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },

  async requestVerification(email) {
    return await pbRequest(`/collections/${AUTH_COLL}/request-verification`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async updateProfile({ id, title, name, avatar, password, oldPassword }) {
    const token = getToken();
    if (!token) throw new Error('not_authenticated');
    if (!id) throw new Error('user_id_missing');

    // Use FormData for file uploads (avatar is a file field in PocketBase)
    const formData = new FormData();

    if (title && title.trim()) {
      formData.append('title', title.trim());
    }

    if (name && name.trim()) {
      formData.append('name', name.trim());
    }

    // Handle avatar file upload
    if (avatar) {
      // Check if avatar is a base64 data URL (uploaded image)
      if (avatar.startsWith('data:image')) {
        // Convert data URL to Blob
        try {
          const response = await fetch(avatar);
          const blob = await response.blob();

          // Check file size
          if (blob.size > 5 * 1024 * 1024) {
            throw new Error('Image is too large (max 5MB)');
          }

          // Append as file
          formData.append('avatar', blob, 'avatar.png');
        } catch (err) {
          console.warn('[API] Could not process avatar:', err.message);
          // Continue without avatar update
        }
      } else {
        // Handle character avatars (URLs) - send as regular field
        formData.append('avatar', avatar);
      }
    }

    // Handle password change
    if (password && password.trim() && oldPassword && oldPassword.trim()) {
      formData.append('password', password.trim());
      formData.append('passwordConfirm', password.trim());
      formData.append('oldPassword', oldPassword.trim());
    } else if (password && password.trim() && !oldPassword) {
      throw new Error('Current password required to change password');
    }

    // ...existing code...

    // Update user with FormData (for file upload support)
    try {
      const url = `${base.replace(/\/$/, '')}/collections/${AUTH_COLL}/records/${id}`;
      const requestToken = getToken();
      const headers = {};
      if (requestToken) headers['Authorization'] = requestToken;

      const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: formData
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const err = new Error(data.message || `request-failed:${res.status}`);
        err.status = res.status;
        err.body = data;
        throw err;
      }

      // Construct proper avatar URL if it's a filename
      let avatarUrl = data.avatar;
      if (data.avatar && !data.avatar.startsWith('http') && !data.avatar.startsWith('data:')) {
        // It's a filename, construct the full URL using the auth collection id
        const baseUrl = base.replace(/\/api$/, '');
        // Add a timestamp (?t=...) to bypass browser cache so the new image shows immediately
        avatarUrl = `${baseUrl}/api/files/${AUTH_COLL}/${data.id}/${data.avatar}?t=${Date.now()}`;
      }

      // ...existing code...
      return {
        user: {
          email: data.email,
          name: data.name,
          avatar: avatarUrl,
          id: data.id,
          title: data.title ?? ''
        }
      };
    } catch (err) {
      throw err;
    }
  },

  // --- Class order (cross-device persistence) ---
  async saveClassOrder(userId, order) {
    if (!userId || !Array.isArray(order)) return;
    try {
      await pbRequest(`/collections/${AUTH_COLL}/records/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ class_order: JSON.stringify(order) })
      });
    } catch {
      // Silent – localStorage is the fallback
    }
  },

  async getClassOrder(userId) {
    if (!userId) return null;
    try {
      const res = await pbRequest(`/collections/${AUTH_COLL}/records/${userId}?fields=class_order`);
      if (res?.class_order) {
        try { return JSON.parse(res.class_order); } catch { return null; }
      }
      return null;
    } catch {
      return null;
    }
  },

  // --- Behaviors (Select Multiple Support) ---
  async getBehaviors(classId = null, userEmail = null) {
    let behaviors = [];
    let page = 1;
    const filters = [];
    if (userEmail) filters.push(`(owner="${userEmail}" || owner="")`);
    
    // IMPORTANT:
    // - if a classId is provided, return class-specific behaviors + global defaults
    // - if a classId is NOT provided, only return global behaviors (class="")
    // This prevents mixing behaviors across classes and causing "disappearing" updates.
    const classIdStr = classId && typeof classId !== 'number' ? String(classId) : null;
    if (classIdStr) {
      filters.push(`(class="${classIdStr}" || class="")`);
    } else {
      filters.push(`class=""`);
    }

    while (true) {
      let query = `/collections/behaviors/records?page=${page}&perPage=500`;
      if (filters.length > 0) {
        query += `&filter=${encodeURIComponent(filters.join(' && '))}`;
      }
      const res = await pbRequest(query);
      behaviors = behaviors.concat(res.items || []);
      if (res.items.length < 500) break;
      page++;
    }
    let items = behaviors;

    // De-dupe by label:
    // Prefer the class-specific record when both global (class="") and classId exist.
    if (classIdStr) {
      const getItemClassId = (item) => {
        const v = item?.class;
        if (typeof v === 'string') return v;
        if (v && typeof v === 'object' && v.id) return String(v.id);
        return '';
      };

      const byLabel = new Map();
      for (const item of items) {
        const label = String(item?.label || '').trim().toLowerCase();
        if (!label) continue;
        const existing = byLabel.get(label);
        if (!existing) {
          byLabel.set(label, item);
          continue;
        }
        const existingIsSpecific = getItemClassId(existing) === classIdStr;
        const itemIsSpecific = getItemClassId(item) === classIdStr;
        if (itemIsSpecific && !existingIsSpecific) {
          byLabel.set(label, item);
        }
      }
      items = Array.from(byLabel.values());
    }

    return items.map(b => ({
      ...b,
      // Keep as array for frontend consistency if needed
      type: Array.isArray(b.type) ? b.type : [b.type]
    }));
  },

  async saveBehaviors(behaviors, _classId = null, userEmail = null) {
    // Safety check: ensure behaviors is an array
    if (!Array.isArray(behaviors)) {
      console.warn('[BEHAVIORS] saveBehaviors called with non-array:', behaviors);
      return [];
    }

    try {
      const classIdStr = _classId && typeof _classId !== 'number' ? String(_classId) : null;

      let fetchUrl = `/collections/behaviors/records?page=1&perPage=500`;
      const filters = [];
      if (userEmail) filters.push(`(owner="${userEmail}" || owner="")`);
      if (filters.length > 0) {
        fetchUrl += `&filter=${encodeURIComponent(filters.join(' && '))}`;
      }
      
      let existingBehaviors = [];
      let page = 1;
      while (true) {
        const res = await pbRequest(fetchUrl.replace('page=1', `page=${page}`));
        existingBehaviors = existingBehaviors.concat(res.items || []);
        if (res.items.length < 500) break;
        page++;
      }

      // Scope writes to exactly one class bucket:
      // - class-specific writes when classIdStr exists
      // - global writes when classIdStr is null
      if (classIdStr) filters.push(`class="${classIdStr}"`);
      else filters.push(`class=""`);

      if (filters.length) {
        fetchUrl += `&filter=${encodeURIComponent(filters.join(' && '))}`;
      }

      const existingById = new Map(existingBehaviors.map(i => [String(i.id), i]));
      const existingByLabel = new Map(existingBehaviors.map(i => [String(i.label || '').trim().toLowerCase(), i]));

      const tasks = behaviors.map(async (behavior) => {
        // Always send type as a string (first value if array, or fallback to 'wow')
        const behaviorType = Array.isArray(behavior.type) ? (behavior.type[0] || 'wow') : (behavior.type || 'wow');

        const payload = {
          label: behavior.label,
          pts: Number(behavior.pts) || 0,
          type: behaviorType,
          icon: behavior.icon,
          stickerId: behavior.stickerId || null,
          audio: behavior.audio || null,
          audioData: behavior.audioData || null,
          owner: userEmail || null,
          // Persist the relation so behaviors don't get mixed across classes.
          class: classIdStr || ''
        };
        const behaviorId = behavior?.id != null ? String(behavior.id) : '';
        const existing = (behaviorId && existingById.get(behaviorId))
          || existingByLabel.get(String(behavior.label || '').trim().toLowerCase());
        // Only send string for type, never array
        if (existing) {
          try {
            return await pbRequest(`/collections/behaviors/records/${existing.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
          } catch (e) {
            console.warn('[BEHAVIORS] Failed to update behavior:', behavior.label, e);
            // Try to create instead if update fails
            try {
              return await pbRequest('/collections/behaviors/records', { method: 'POST', body: JSON.stringify(payload) });
            } catch (createError) {
              console.error('[BEHAVIORS] Failed to create behavior:', createError);
              return null;
            }
          }
        } else {
          try {
            return await pbRequest('/collections/behaviors/records', { method: 'POST', body: JSON.stringify(payload) });
          } catch (e) {
            console.error('[BEHAVIORS] Failed to create new behavior:', e);
            return null;
          }
        }
      });
      const settled = await Promise.all(tasks);
      return settled.filter(Boolean);
    } catch (e) {
      console.error('[BEHAVIORS] saveBehaviors error:', e);
      // Return empty array to avoid breaking UI
      return [];
    }
  },

  async deleteBehavior(id) {
    try {
      await pbRequest(`/collections/behaviors/records/${id}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      throw e;
    }
  },

  // Save custom audio data to a placeholder behavior for persistence
  async saveCustomAudio(audioId, name, base64Data) {
    try {
      const payload = {
        label: `Custom Audio: ${name}`,
        pts: 0,
        type: 'wow',
        icon: null,
        stickerId: null,
        audio: audioId,
        audioData: base64Data,
        owner: null,
        class: ''
      };
      
      // Check if this audio ID already exists
      const existingRes = await pbRequest(`/collections/behaviors/records?filter=(audio="${audioId}")`);
      const existing = existingRes.items?.[0];
      
      if (existing) {
        return await pbRequest(`/collections/behaviors/records/${existing.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(payload) 
        });
      } else {
        return await pbRequest('/collections/behaviors/records', { 
          method: 'POST', 
          body: JSON.stringify(payload) 
        });
      }
    } catch (e) {
      console.error('[API] Failed to save custom audio:', e);
      throw e;
    }
  },

  // Delete custom audio data
  async deleteCustomAudio(audioId) {
    try {
      const existingRes = await pbRequest(`/collections/behaviors/records?filter=(audio="${audioId}")`);
      const existing = existingRes.items?.[0];
      
      if (existing) {
        await pbRequest(`/collections/behaviors/records/${existing.id}`, { method: 'DELETE' });
      }
      return true;
    } catch (e) {
      console.error('[API] Failed to delete custom audio:', e);
      throw e;
    }
  },

  // --- MINIMAL: Fast classes list loading (only essential data) ---
  async getClassesMinimal(email) {
    try {
      // Only load what's needed for classes panel
      const minimalFields = [
        'id',
        'name', 
        'teacher',
        'avatar',
        'avatar_seed',
        'avatar_character',
        'background_color',
        'grade',
        'archived',
        'archivedAt',
        'archivedReason',
        'lastInteractionAt',
        'lastActivityAt',
        'students', // Basic student data for panel
        'Access_Codes'
      ].join(',');

      let classes = [];
      let page = 1;
      while (true) {
        const res = await pbRequest(
          `/collections/classes/records?page=${page}&perPage=500&fields=${encodeURIComponent(minimalFields)}&filter=teacher="${email}"`
        );
        classes = classes.concat(res.items || []);
        if (res.items.length < 500) break;
        page++;
      }

      const archiveMap = getArchiveMap(email);

      return classes.map(c => ({
        ...c,
        archived: Boolean(
          c.archived ??
          archiveMap?.[String(c.id)]?.archived ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archived
        ),
        archivedAt:
          c.archivedAt ??
          archiveMap?.[String(c.id)]?.archivedAt ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archivedAt ??
          null,
        archivedReason:
          c.archivedReason ??
          archiveMap?.[String(c.id)]?.archivedReason ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archivedReason ??
          null,
        lastInteractionAt:
          c.lastInteractionAt ??
          archiveMap?.[String(c.id)]?.lastInteractionAt ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.lastInteractionAt ??
          null,
        students: Array.isArray(c.students) ? c.students : safeParse(c.students, []),
        // Empty arrays for heavy data (will be loaded when needed)
        tasks: [],
        assignments: [],
        submissions: [],
        studentAssignments: [],
        student_submissions: [],
        sticky_note: c.sticky_note || null
      }));
    } catch (error) {
      console.error('Error in getClassesMinimal:', error);
      return [];
    }
  },

  // --- HANDLES 'classes' COLLECTION (students & tasks) ---
  async getClasses(email) {
    try {
      const listFields = [
        'id',
        'name',
        'teacher',
        'avatar',
        'avatar_seed',
        'avatar_character',
        'background_color',
        'grade',
        'archived',
        'archivedAt',
        'archivedReason',
        'lastInteractionAt',
        'lastActivityAt',
        'students',
        'tasks',
        'assignments',
        'submissions',
        'studentAssignments',
        'student_submissions',
        'Access_Codes',
        'sticky_note'
      ].join(',');

      // Server-side filter: only fetch this user's classes (avoids fetching all users' data)
      let classes = [];
      let page = 1;
      while (true) {
        const res = await pbRequest(
          `/collections/classes/records?page=${page}&perPage=500&fields=${encodeURIComponent(listFields)}&filter=teacher="${email}"`
        );
        classes = classes.concat(res.items || []);
        if (res.items.length < 500) break;
        page++;
      }
      const archiveMap = getArchiveMap(email);

      return classes.map(c => ({
        ...c,
        archived: Boolean(
          c.archived ??
          archiveMap?.[String(c.id)]?.archived ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archived
        ),
        archivedAt:
          c.archivedAt ??
          archiveMap?.[String(c.id)]?.archivedAt ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archivedAt ??
          null,
        archivedReason:
          c.archivedReason ??
          archiveMap?.[String(c.id)]?.archivedReason ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archivedReason ??
          null,
        lastInteractionAt:
          c.lastInteractionAt ??
          archiveMap?.[String(c.id)]?.lastInteractionAt ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.lastInteractionAt ??
          null,
        students: Array.isArray(c.students) ? c.students : safeParse(c.students, []),
        tasks: Array.isArray(c.tasks) ? c.tasks : safeParse(c.tasks, []),
        assignments: Array.isArray(c.assignments) ? c.assignments : safeParse(c.assignments, []),
        submissions: Array.isArray(c.submissions) ? c.submissions : safeParse(c.submissions, []),
        studentAssignments: Array.isArray(c.studentAssignments) ? c.studentAssignments : safeParse(c.studentAssignments, []),
        student_submissions: Array.isArray(c.student_submissions) ? c.student_submissions : safeParse(c.student_submissions, []),
        Access_Codes: typeof c.Access_Codes === 'object' ? c.Access_Codes : safeParse(c.Access_Codes, {}),
        sticky_note:
          typeof c.sticky_note === 'object' && c.sticky_note !== null
            ? c.sticky_note
            : safeParse(c.sticky_note, {})
      }));
    } catch (err) {
      throw err;
    }
  },

  // Load full class data on-demand when class is selected (reserved for future use)
  async loadClassFullData(classId, email) {
    try {
      const detailFields = [
        'id', 'name', 'teacher', 'avatar', 'avatar_seed', 'avatar_character',
        'background_color', 'grade', 'archived', 'archivedAt', 'archivedReason',
        'lastInteractionAt', 'lastActivityAt', 'students', 'tasks', 
        'assignments', 'submissions', 'studentAssignments', 'student_submissions',
        'Access_Codes', 'sticky_note'
      ].join(',');

      const res = await pbRequest(
        `/collections/classes/records?perPage=1&fields=${encodeURIComponent(detailFields)}&filter=id="${classId}"&&teacher="${email}"`
      );
      
      if (!res.items || res.items.length === 0) return null;
      
      const cls = res.items[0];
      const archiveMap = getArchiveMap(email);
      
      return {
        ...cls,
        archived: Boolean(
          cls.archived ?? archiveMap?.[String(cls.id)]?.archived ?? 
          archiveMap?.[`name:${String(cls.name || '').toLowerCase()}`]?.archived
        ),
        archivedAt: cls.archivedAt ?? archiveMap?.[String(cls.id)]?.archivedAt ?? 
                   archiveMap?.[`name:${String(cls.name || '').toLowerCase()}`]?.archivedAt ?? null,
        archivedReason: cls.archivedReason ?? archiveMap?.[String(cls.id)]?.archivedReason ?? 
                       archiveMap?.[`name:${String(cls.name || '').toLowerCase()}`]?.archivedReason ?? null,
        lastInteractionAt: cls.lastInteractionAt ?? archiveMap?.[String(cls.id)]?.lastInteractionAt ?? 
                          archiveMap?.[`name:${String(cls.name || '').toLowerCase()}`]?.lastInteractionAt ?? null,
        students: Array.isArray(cls.students) ? cls.students : safeParse(cls.students, []),
        tasks: Array.isArray(cls.tasks) ? cls.tasks : safeParse(cls.tasks, []),
        assignments: Array.isArray(cls.assignments) ? cls.assignments : safeParse(cls.assignments, []),
        submissions: Array.isArray(cls.submissions) ? cls.submissions : safeParse(cls.submissions, []),
        studentAssignments: Array.isArray(cls.studentAssignments) ? cls.studentAssignments : safeParse(cls.studentAssignments, []),
        student_submissions: Array.isArray(cls.student_submissions) ? cls.student_submissions : safeParse(cls.student_submissions, []),
        Access_Codes: typeof cls.Access_Codes === 'object' ? cls.Access_Codes : safeParse(cls.Access_Codes, {}),
        sticky_note: typeof cls.sticky_note === 'object' && cls.sticky_note !== null ? cls.sticky_note : safeParse(cls.sticky_note, {})
      };
    } catch (err) {
      console.error('[API] Failed to load full class data:', err);
      throw err;
    }
  },

  // Fetch full details for one class (includes heavy JSON fields).
  async getClassDetails(classId, email = null) {
    try {
      if (!classId) return null;
      if (typeof classId === 'number') return null; // not yet persisted to PocketBase

      const idStr = String(classId);
      if (idStr === 'demo-class') return null;

      const detailFields = [
        'id',
        'name',
        'teacher',
        'avatar',
        'avatar_seed',
        'avatar_character',
        'background_color',
        'archived',
        'archivedAt',
        'archivedReason',
        'lastInteractionAt',
        'lastActivityAt',
        'students',
        'tasks',
        'assignments',
        'submissions',
        'studentAssignments',
        'student_submissions',
        'Access_Codes',
        'sticky_note'
      ].join(',');

      const cls = await pbRequest(
        `/collections/classes/records/${encodeURIComponent(idStr)}?fields=${encodeURIComponent(detailFields)}`
      );

      const archiveMap = email ? getArchiveMap(email) : {};

      return {
        ...cls,
        archived: Boolean(
          cls.archived ??
          archiveMap?.[String(cls.id)]?.archived ??
          archiveMap?.[`name:${String(cls.name || '').toLowerCase()}`]?.archived
        ),
        archivedAt:
          cls.archivedAt ??
          archiveMap?.[String(cls.id)]?.archivedAt ??
          archiveMap?.[`name:${String(cls.name || '').toLowerCase()}`]?.archivedAt ??
          null,
        archivedReason:
          cls.archivedReason ??
          archiveMap?.[String(cls.id)]?.archivedReason ??
          archiveMap?.[`name:${String(cls.name || '').toLowerCase()}`]?.archivedReason ??
          null,
        lastInteractionAt:
          cls.lastInteractionAt ??
          archiveMap?.[String(cls.id)]?.lastInteractionAt ??
          archiveMap?.[`name:${String(cls.name || '').toLowerCase()}`]?.lastInteractionAt ??
          null,

        students: Array.isArray(cls.students) ? cls.students : safeParse(cls.students, []),
        tasks: Array.isArray(cls.tasks) ? cls.tasks : safeParse(cls.tasks, []),
        assignments: Array.isArray(cls.assignments) ? cls.assignments : safeParse(cls.assignments, []),
        submissions: Array.isArray(cls.submissions) ? cls.submissions : safeParse(cls.submissions, []),
        studentAssignments: Array.isArray(cls.studentAssignments) ? cls.studentAssignments : safeParse(cls.studentAssignments, []),
        student_submissions: Array.isArray(cls.student_submissions) ? cls.student_submissions : safeParse(cls.student_submissions, []),
        Access_Codes: typeof cls.Access_Codes === 'object' ? cls.Access_Codes : safeParse(cls.Access_Codes, {}),
        sticky_note:
          typeof cls.sticky_note === 'object' && cls.sticky_note !== null
            ? cls.sticky_note
            : safeParse(cls.sticky_note, {})
      };
    } catch {
      return null;
    }
  },

  // --- MODIFIED: Saves class data, including students and tasks (from behaviors) ---
  // 'behaviorsForTasks' should be passed from the calling component (e.g., App.jsx)
  // 'deletedIds' is optional array of class IDs that were deleted
  async saveClasses(email, arr, behaviorsForTasks = [], deletedIds = []) {
    try {
      // UPDATED SAFETY CHECK:
      // Only block if the array is empty AND no deletions were requested.
      if (arr.length === 0 && (!deletedIds || deletedIds.length === 0)) {
        console.warn('[API] Skipping save - no data and no deletions provided.');
        return null;
      }

      // Get existing classes for this teacher
      let existing = [];
      let page = 1;
      while (true) {
        const res = await pbRequest(`/collections/classes/records?page=${page}&perPage=500`);
        const pageItems = res.items || [];
        existing = existing.concat(pageItems);
        if (pageItems.length < 500) break;
        page++;
      }
      const userClasses = existing.filter(c => c.teacher === email);

      // Create maps by both ID and name for matching
      const byId = new Map(userClasses.map(c => [c.id, c]));
      const byName = new Map(userClasses.map(c => [c.name, c]));

      const processedIds = new Set();
      const idMappings = new Map(); // Maps temporary IDs to PocketBase IDs
      const nextArchiveMap = {};

      // Helper to check JSON size (PocketBase limit is 1MB = 1048576 bytes)
      function isTooLarge(obj) {
        try {
          return JSON.stringify(obj).length > 900000; // Use 900KB for safety
        } catch {
          return false;
        }
      }

      // Process each incoming class
      for (const cls of arr) {
        // Trim assignments/students if too large
        let assignments = Array.isArray(cls.assignments) ? [...cls.assignments] : [];
        let students = Array.isArray(cls.students) ? [...cls.students] : [];
        // Remove large fields from assignments if needed
        if (isTooLarge(assignments)) {
          console.warn(`[API] Truncating ${assignments.length} assignments to 100 for class "${cls.name}"`);
          assignments = assignments.slice(0, 100); // Only keep first 100
        }
        if (isTooLarge(students)) {
          // Base64 avatars are the most common cause — strip them first
          const stripped = students.map(s =>
            s.avatar && typeof s.avatar === 'string' && s.avatar.startsWith('data:')
              ? { ...s, avatar: null }
              : s
          );
          if (!isTooLarge(stripped)) {
            students = stripped;
          } else {
            // Still too large even without avatars — truncate as last resort
            students = stripped.slice(0, 200);
            console.warn(`[API] Class "${cls.name}": payload still too large after stripping avatars (${students.length} students kept)`);
          }
        }

        const updatePayload = {
          name: cls.name,
          teacher: email,
          avatar: cls.avatar || null,
          avatar_character: cls.avatar_character || null,
          avatar_seed: cls.avatar_seed || null,
          background_color: cls.background_color || null,
          grade: cls.grade || null,
          students: students,
          tasks: behaviorsForTasks,
          assignments: assignments,
          submissions: cls.submissions || [],
          studentAssignments: cls.studentAssignments || [],
          student_submissions: cls.student_submissions || [],
          Access_Codes: cls.Access_Codes || {},
          // PocketBase: add JSON field `sticky_note` on collection `classes` (per-class notes, images as data URLs — keep small).
          sticky_note:
            typeof cls.sticky_note === 'object' && cls.sticky_note !== null
              ? cls.sticky_note
              : safeParse(cls.sticky_note, {}),
          // PocketBase `classes` collection — persist archive + activity (admin UI / multi-device).
          archived: Boolean(cls.archived),
          archivedAt: cls.archivedAt || null,
          archivedReason: cls.archivedReason || null,
          lastInteractionAt: cls.lastInteractionAt || null
        };
        try {
          const sn = updatePayload.sticky_note;
          if (sn && typeof sn === 'object' && JSON.stringify(sn).length > 900_000) {
            const trimmed = { ...sn, images: [] };
            if (JSON.stringify(trimmed).length > 900_000) {
              trimmed.body = String(trimmed.body || '').slice(0, 400_000);
            }
            updatePayload.sticky_note = trimmed;
            console.warn(`[API] Trimmed sticky_note for class "${cls.name}" (near record size limit)`);
          }
        } catch {
          updatePayload.sticky_note = {};
        }
        const payloadJson = JSON.stringify(updatePayload);
        const archiveEntry = {
          archived: Boolean(cls.archived),
          archivedAt: cls.archivedAt || null,
          archivedReason: cls.archivedReason || null,
          lastInteractionAt: cls.lastInteractionAt || null
        };
        if (cls.id != null) nextArchiveMap[String(cls.id)] = archiveEntry;
        nextArchiveMap[`name:${String(cls.name || '').toLowerCase()}`] = archiveEntry;

        // Try to match by PocketBase ID first, then by name
        let serverRecord = null;
        let pbId = null;

        // Check if ID is a temporary numeric ID (Date.now()) or a real PocketBase string ID
        const isTempId = typeof cls.id === 'number';

        if (cls.id && !isTempId && byId.has(cls.id)) {
          // Real PocketBase ID found - use it directly
          serverRecord = byId.get(cls.id);
          pbId = cls.id;
        } else if (byName.has(cls.name)) {
          // Either no ID, or temp ID, or ID not found - match by name instead
          serverRecord = byName.get(cls.name);
          pbId = serverRecord.id;
        }

        if (serverRecord && pbId) {
          processedIds.add(pbId);
          try {
            await pbRequest(`/collections/classes/records/${pbId}`, {
              method: 'PATCH',
              body: payloadJson,
              silent: true // Silence 404 errors since we handle them below
            });
          } catch (e) {
            // If 404, the record was deleted - try creating it instead
            if (e.status === 404) {
              try {
                const created = await pbRequest('/collections/classes/records', {
                  method: 'POST',
                  body: payloadJson
                });
                processedIds.add(created.id);
                if (cls.id && cls.id !== created.id) {
                  idMappings.set(cls.id, created.id);
                }
              } catch {
              }
            } else {
            }
          }
        } else {
          try {
            const created = await pbRequest('/collections/classes/records', {
              method: 'POST',
              body: payloadJson
            });
            processedIds.add(created.id);
            // Store mapping from temporary ID to real PocketBase ID
            if (cls.id && cls.id !== created.id) {
              idMappings.set(cls.id, created.id);
            }
          } catch {
          }
        }
      }

      // LocalStorage mirror (offline / migration); archive fields also go to PocketBase in updatePayload.
      saveArchiveMap(email, nextArchiveMap);

      // Delete records that are not in the incoming array
      // Allow deletion even if incoming array is empty (for deleting the last class)
      for (const [id] of byId) {
        if (!processedIds.has(id)) {
          try {
            await pbRequest(`/collections/classes/records/${id}`, { method: 'DELETE' });
            console.warn('[API] Deleted class not in incoming array:', id);
          } catch {
          }
        }
      }

      // Return the same classes passed in, but with real PocketBase IDs
      // This prevents the infinite loop caused by fetching fresh data
      return arr.map(cls => {
        const realId = cls.id && idMappings.has(cls.id) ? idMappings.get(cls.id) : cls.id;
        const existing = byId.get(realId) || byName.get(cls.name);
        const serverRecord = existing || {
          ...cls,
          id: realId
        };
        return {
          ...serverRecord,
          id: realId,
          archived: Boolean(cls.archived),
          archivedAt: cls.archivedAt ?? serverRecord.archivedAt ?? null,
          archivedReason: cls.archivedReason ?? serverRecord.archivedReason ?? null,
          lastInteractionAt: cls.lastInteractionAt ?? serverRecord.lastInteractionAt ?? null,
          students: Array.isArray(serverRecord.students) ? serverRecord.students : safeParse(serverRecord.students, []),
          tasks: Array.isArray(serverRecord.tasks) ? serverRecord.tasks : safeParse(serverRecord.tasks, []),
          assignments: Array.isArray(serverRecord.assignments) ? serverRecord.assignments : safeParse(serverRecord.assignments, []),
          submissions: Array.isArray(serverRecord.submissions) ? serverRecord.submissions : safeParse(serverRecord.submissions, []),
          studentAssignments: Array.isArray(serverRecord.studentAssignments) ? serverRecord.studentAssignments : safeParse(serverRecord.studentAssignments, []),
          student_submissions: Array.isArray(serverRecord.student_submissions) ? serverRecord.student_submissions : safeParse(serverRecord.student_submissions, []),
          Access_Codes: typeof serverRecord.Access_Codes === 'object' ? serverRecord.Access_Codes : safeParse(serverRecord.Access_Codes, {}),
          sticky_note:
            typeof serverRecord.sticky_note === 'object' && serverRecord.sticky_note !== null
              ? serverRecord.sticky_note
              : safeParse(serverRecord.sticky_note, {})
        };
      });
    } catch (err) {
      throw err;
    }
  },

  // Get the latest classes from PocketBase with real IDs
  async getClassesSynced(email) {
    try {
      const listFields = [
        'id',
        'name',
        'teacher',
        'avatar',
        'avatar_seed',
        'avatar_character',
        'background_color',
        'grade',
        'archived',
        'archivedAt',
        'archivedReason',
        'lastInteractionAt',
        'lastActivityAt',
        'students'
      ].join(',');

      let classes = [];
      let page = 1;
      while (true) {
        const res = await pbRequest(
          `/collections/classes/records?page=${page}&perPage=500&fields=${encodeURIComponent(listFields)}`
        );
        const pageItems = res.items || [];
        classes = classes.concat(pageItems.filter(c => c.teacher === email));
        if (pageItems.length < 500) break;
        page++;
      }
      const archiveMap = getArchiveMap(email);

      return classes.map(c => ({
        ...c,
        archived: Boolean(
          c.archived ??
          archiveMap?.[String(c.id)]?.archived ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archived
        ),
        archivedAt:
          c.archivedAt ??
          archiveMap?.[String(c.id)]?.archivedAt ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archivedAt ??
          null,
        archivedReason:
          c.archivedReason ??
          archiveMap?.[String(c.id)]?.archivedReason ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.archivedReason ??
          null,
        lastInteractionAt:
          c.lastInteractionAt ??
          archiveMap?.[String(c.id)]?.lastInteractionAt ??
          archiveMap?.[`name:${String(c.name || '').toLowerCase()}`]?.lastInteractionAt ??
          null,
        students: Array.isArray(c.students) ? c.students : safeParse(c.students, []),
        tasks: Array.isArray(c.tasks) ? c.tasks : safeParse(c.tasks, []),
        assignments: Array.isArray(c.assignments) ? c.assignments : safeParse(c.assignments, []),
        submissions: Array.isArray(c.submissions) ? c.submissions : safeParse(c.submissions, []),
        studentAssignments: Array.isArray(c.studentAssignments) ? c.studentAssignments : safeParse(c.studentAssignments, []),
        student_submissions: Array.isArray(c.student_submissions) ? c.student_submissions : safeParse(c.student_submissions, []),
        Access_Codes: typeof c.Access_Codes === 'object' ? c.Access_Codes : safeParse(c.Access_Codes, {}),
        sticky_note:
          typeof c.sticky_note === 'object' && c.sticky_note !== null
            ? c.sticky_note
            : safeParse(c.sticky_note, {})
      }));
    } catch (err) {
      throw err;
    }
  },

  async deleteNewCards() {
    try {
      let deleted = 0;
      let page = 1;
      const perPage = 500;

      // Loop through all pages of "New Card" entries and delete them
      while (true) {
        const response = await pbRequest(
          `/collections/behaviors/records?filter=label="New Card"&perPage=${perPage}&page=${page}`
        );
        const items = response.items || [];

        if (items.length === 0) break; // No more items

        // Delete each one
        for (const item of items) {
          try {
            await pbRequest(`/collections/behaviors/records/${item.id}`, { method: 'DELETE' });
            deleted++;
          } catch (e) {
            console.warn('Failed to delete card:', item.id, e.message);
          }
        }

        page++;
      }

      return deleted;
    } catch (err) {
      throw err;
    }
  },

  async deleteAllCards(userEmail = null) {
    try {
      const token = getToken();
      if (!token) throw new Error('not_authenticated');

      let deleted = 0;
      let page = 1;
      const perPage = 500;

      while (true) {
        let url = `/collections/behaviors/records?page=${page}&perPage=${perPage}`;
        if (userEmail) {
          url += `&filter=${encodeURIComponent(`owner="${userEmail}"`)}`;
        }
        const res = await pbRequest(url);
        const items = res.items || [];

        if (items.length === 0) break;

        const deleteResults = await Promise.allSettled(
          items.map((item) => pbRequest(`/collections/behaviors/records/${item.id}`, { method: 'DELETE' }))
        );
        deleted += deleteResults.filter((r) => r.status === 'fulfilled').length;
        deleteResults
          .filter((r) => r.status === 'rejected')
          .forEach((r) => console.warn('Failed to delete card:', r.reason?.message || r.reason));

        page++;
      }

      return deleted;
    } catch (err) {
      throw err;
    }
  },

  async replaceBehaviorsForOwner(nextBehaviors = [], userEmail = null) {
    if (!userEmail) {
      return this.saveBehaviors(nextBehaviors, null, userEmail);
    }

    const safeNext = Array.isArray(nextBehaviors) ? nextBehaviors : [];
    const existingRes = await pbRequest(
      `/collections/behaviors/records?perPage=500&filter=${encodeURIComponent(`owner="${userEmail}"`)}`
    );
    const existing = existingRes.items || [];
    const keepIds = new Set(
      safeNext
        .map((b) => b?.id)
        .filter((id) => typeof id === 'string' && id.length > 0)
    );
    const nextLabels = new Set(
      safeNext.map((b) => String(b?.label || '').trim().toLowerCase()).filter(Boolean)
    );

    const toDelete = existing.filter((item) => {
      if (keepIds.has(item.id)) return false;
      const labelKey = String(item.label || '').trim().toLowerCase();
      return !nextLabels.has(labelKey);
    });

    if (toDelete.length) {
      await Promise.allSettled(
        toDelete.map((item) => pbRequest(`/collections/behaviors/records/${item.id}`, { method: 'DELETE' }))
      );
    }

    return this.saveBehaviors(safeNext, null, userEmail);
  },

  setToken(token) {
    if (token) localStorage.setItem('classABC_pb_token', token);
    else localStorage.removeItem('classABC_pb_token');
  },

  /**
   * Sign in with Google (OAuth2) via PocketBase.
   * Uses the PocketBase SDK popup flow; requires Google OAuth to be configured in PocketBase admin
   * and redirect URI set to https://your-pb-domain/api/oauth2-redirect.
   * @returns {Promise<{ user: { email, name, id, title }, token: string }>}
   */
  // --- Lesson Plans ---
  async getLessonPlans(teacherEmail, filters = {}) {
    const token = getToken();
    if (!token) throw new Error('not_authenticated');
    const res = await pbRequest('/collections/lesson_plans/records?page=1&perPage=500');
    let items = [];
    let page = 1;
    while (true) {
      const pageRes = await pbRequest(`/collections/lesson_plans/records?page=${page}&perPage=500`);
      const pageItems = pageRes.items || [];
      items = items.concat(pageItems.filter((lp) => lp.teacher === teacherEmail));
      if (pageItems.length < 500) break;
      page++;
    }
    if (filters.classId) items = items.filter((lp) => lp.class_id === filters.classId);
    if (filters.period) items = items.filter((lp) => lp.period === filters.period);
    return items;
  },

  async getLessonPlan(id) {
    const token = getToken();
    if (!token) throw new Error('not_authenticated');
    return pbRequest(`/collections/lesson_plans/records/${id}`);
  },

  async createLessonPlan({ teacher, class_id, period, title, date, data }) {
    const token = getToken();
    if (!token) throw new Error('not_authenticated');
    if (!period || !class_id || !teacher) throw new Error('period, class_id, and teacher are required');
    return pbRequest('/collections/lesson_plans/records', {
      method: 'POST',
      body: JSON.stringify({
        teacher,
        class_id: String(class_id),
        period,
        title: title || '',
        date: date || null,
        data: data || {}
      })
    });
  },

  async updateLessonPlan(id, { title, date, data }) {
    const token = getToken();
    if (!token) throw new Error('not_authenticated');
    return pbRequest(`/collections/lesson_plans/records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: title ?? undefined, date: date ?? undefined, data: data ?? undefined })
    });
  },

  async deleteLessonPlan(id) {
    const token = getToken();
    if (!token) throw new Error('not_authenticated');
    return pbRequest(`/collections/lesson_plans/records/${id}`, { method: 'DELETE' });
  },

  async loginWithGoogle() {
    const { default: PocketBase } = await import('pocketbase');
    // Get the root domain (https://klasiz.fun) by removing /api from your base
    const pbOrigin = base.startsWith('http')
      ? base.replace(/\/api\/?$/, '')
      : window.location.origin;
    const pb = new PocketBase(pbOrigin);

    let popupRef = null;
    try {
      const authData = await pb.collection(AUTH_COLL).authWithOAuth2({
        provider: 'google',
        url: `${pbOrigin}/api/oauth2-redirect`,
        urlCallback: (authUrl) => {
          popupRef = openPocketBaseOAuthPopup(authUrl);
          if (!popupRef) {
            throw new Error('Popup was blocked. Please allow popups for this site and try again.');
          }
        }
      });

      if (!authData?.token || !authData?.record) {
        throw new Error('Google sign-in did not return auth data.');
      }
      if (authData.token) {
        localStorage.setItem('classABC_pb_token', authData.token);
      }
      const record = authData.record;
      const user = {
        email: record.email,
        name: record.name ?? record.email,
        id: record.id,
        title: record.title ?? ''
      };
      localStorage.setItem('classABC_logged_in', JSON.stringify(user));
      return {
        user,
        token: authData.token
      };
    } catch (err) {
      const status =
        err?.status ||
        err?.originalError?.status ||
        err?.response?.status;

      if (status === 521 || String(err?.message || '').includes('521')) {
        throw new Error('Google sign-in failed: backend unreachable (521). Please try again shortly.');
      }

      if (err?.message?.includes('popup') || err?.message?.includes('blocked')) {
        throw new Error('Popup was blocked. Please allow popups for this site and try again.');
      }
      throw err?.message ? new Error(err.message) : err;
    } finally {
      try {
        if (popupRef && !popupRef.closed) popupRef.close();
      } catch {
        /* ignore */
      }
    }
  },
  // login with microsoft
  async loginWithMicrosoft() {
    const { default: PocketBase } = await import('pocketbase');
    const pbOrigin = base.startsWith('http')
      ? base.replace(/\/api\/?$/, '')
      : window.location.origin;
    const pb = new PocketBase(pbOrigin);

    let popupRef = null;
    try {
      const authData = await pb.collection(AUTH_COLL).authWithOAuth2({
        provider: 'microsoft',
        url: `${pbOrigin}/api/oauth2-redirect`,
        urlCallback: (authUrl) => {
          popupRef = openPocketBaseOAuthPopup(authUrl);
          if (!popupRef) {
            throw new Error('Popup was blocked. Please allow popups for Microsoft login.');
          }
        }
      });

      if (!authData?.token || !authData?.record) {
        throw new Error('Microsoft sign-in did not return auth data.');
      }

      localStorage.setItem('classABC_pb_token', authData.token);

      const record = authData.record;
      const user = {
        email: record.email,
        name: record.name || record.email,
        id: record.id,
        title: record.title || ''
      };

      localStorage.setItem('classABC_logged_in', JSON.stringify(user));

      return { user, token: authData.token };
    } catch (err) {
      console.error('Microsoft Login Error:', err);
      if (err?.message?.includes('popup') || err?.message?.includes('blocked')) {
        throw new Error('Popup was blocked. Please allow popups for Microsoft login.');
      }
      throw err?.message ? new Error(err.message) : err;
    } finally {
      try {
        if (popupRef && !popupRef.closed) popupRef.close();
      } catch {
        /* ignore */
      }
    }
  },

  // Efficiently update a single student's data without re-saving entire class
  async updateStudent(classId, studentId, updates) {
    try {
      // Check if classId is a temporary numeric ID - if so, we can't update on server yet
      if (typeof classId === 'number') {
        return null;
      }

      const response = await pbRequest(`/collections/classes/records/${classId}`);
      const cls = response;

      // Find and update the specific student
      const students = Array.isArray(cls.students) ? cls.students : safeParse(cls.students, []);
      const studentIndex = students.findIndex(s => s.id === studentId || s.id === String(studentId));

      if (studentIndex === -1) {
        throw new Error('Student not found');
      }

      // Update only the changed fields
      students[studentIndex] = {
        ...students[studentIndex],
        ...updates
      };

      // Send back only the updated students array
      await pbRequest(`/collections/classes/records/${classId}`, {
        method: 'PATCH',
        body: JSON.stringify({ students })
      });

      return students[studentIndex];
    } catch (err) {
      throw err;
    }
  },

  // Efficiently update multiple students at once
  async updateStudents(classId, studentUpdates) {
    // studentUpdates: [{ id: studentId, updates: {...} }, ...]
    try {
      // Check if classId is a temporary numeric ID - if so, we can't update on server yet
      if (typeof classId === 'number') {
        return null;
      }

      const response = await pbRequest(`/collections/classes/records/${classId}`);
      const cls = response;

      const students = Array.isArray(cls.students) ? cls.students : safeParse(cls.students, []);

      // Update each student
      const updatedStudents = students.map(student => {
        const updateEntry = studentUpdates.find(
          u => u.id === student.id || u.id === String(student.id)
        );
        if (updateEntry) {
          return {
            ...student,
            ...updateEntry.updates
          };
        }
        return student;
      });

      // Send back the updated students array
      await pbRequest(`/collections/classes/records/${classId}`, {
        method: 'PATCH',
        body: JSON.stringify({ students: updatedStudents })
      });

      return updatedStudents;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Attempts to restore the authenticated PocketBase user on app load.
   * This helps when OAuth popup messaging fails and the app lands back on the landing page.
   *
   * It updates:
   * - `classABC_pb_token`
   * - `classABC_logged_in`
   *
   * @returns {Promise<{user: {email: string, name: string, id: string, title?: string}, token: string} | null>}
   */
  async restorePocketBaseAuth() {
    if (typeof window === 'undefined') return null;

    const token = getToken();
    const pbOrigin = base.startsWith('http')
      ? base.replace(/\/api\/?$/, '')
      : window.location.origin;

    // Skip authRefresh if we're on OAuth redirect URL (popup window case)
    // The popup will close and pass auth data back to the main window
    if (typeof window !== 'undefined' && window.location.pathname === '/api/oauth2-redirect') {
      return null;
    }

    // If we already have a PocketBase JWT token saved locally, we can decode it
    // and restore the minimal `user` UI state without calling the backend.
    // This is useful when OAuth just finished but the follow-up network call fails.
    const decodeJwtPayload = (jwt) => {
      try {
        const parts = String(jwt).split('.');
        if (parts.length < 2) return null;
        const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = payloadB64 + '==='.slice((payloadB64.length + 3) % 4);
        const json = atob(padded);
        return safeParse(json, null);
      } catch {
        return null;
      }
    };

    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload) {
        const email = payload.email || payload.sub || payload.user || payload?.record?.email;
        const id = payload.sub || payload.id || payload?.record?.id;
        const name =
          payload.name ||
          payload?.record?.name ||
          (typeof email === 'string' ? email : '');

        if (email && id) {
          const user = { email, name: name || email, id: String(id), title: payload.title ?? '' };
          localStorage.setItem('classABC_pb_token', token);
          localStorage.setItem('classABC_logged_in', JSON.stringify(user));
          return { user, token };
        }
      }
    }

    try {
      const { default: PocketBase } = await import('pocketbase');
      const pb = new PocketBase(pbOrigin);
      
      // Prefer our stored token first.
      if (token) {
        pb.authStore.save(token);
      } else {
        // Fallback: try to load from cookie (if the hosting allows access).
        try {
          pb.authStore.loadFromCookie(document.cookie, 'pb_auth');
        } catch {
          // ignore
        }
      }

      // Even if `pb.authStore.isValid` is false (e.g., auth is stored in an
      // HTTP-only cookie and can't be read via `document.cookie`), we can still
      // attempt refresh: PocketBase can authenticate the request using cookies.
      let auth;
      try {
        auth = await pb.collection(AUTH_COLL).authRefresh();
      } catch (e) {
        const message = String(e?.message || '');
        const isUnauthorized =
          e?.status === 401 ||
          /unauthorized|valid record authorization token|auth/i.test(message);

        // Expected when stored token is stale/expired in dev; clear local auth and continue logged out.
        if (isUnauthorized) {
          localStorage.removeItem('classABC_pb_token');
          localStorage.removeItem('classABC_token');
          localStorage.removeItem('classABC_logged_in');
          return null;
        }
        throw e;
      }
      const authToken = auth?.token || pb.authStore.token;
      const record = auth?.record || pb.authStore.record;

      if (!authToken || !record) return null;

      const user = {
        email: record.email,
        name: record.name ?? record.email,
        id: record.id,
        title: record.title ?? ''
      };

      localStorage.setItem('classABC_pb_token', authToken);
      localStorage.setItem('classABC_logged_in', JSON.stringify(user));
      return { user, token: authToken };
    } catch {
      // If restore fails, do not break the app.
      return null;
    }
  }
};