/**
 * Lesson Plan API Service
 * Handles CRUD operations for lesson plans in Astro
 */

export interface LessonPlan {
  id: string;
  classId: string;
  periodType: 'yearly' | 'monthly' | 'weekly' | 'daily';
  title: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonPlanInput {
  classId: string;
  periodType: 'yearly' | 'monthly' | 'weekly' | 'daily';
  title: string;
  data?: Record<string, any>;
}

export interface UpdateLessonPlanInput {
  id: string;
  title?: string;
  data?: Record<string, any>;
}

// In-memory storage (replace with actual API calls in production)
const lessonPlansStore: Map<string, LessonPlan> = new Map();

// LocalStorage key
const STORAGE_KEY = 'classabc_lesson_plans';

/**
 * Initialize storage from localStorage
 */
function initStorage(): void {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const plans = JSON.parse(stored);
        plans.forEach((plan: LessonPlan) => {
          lessonPlansStore.set(plan.id, plan);
        });
      } catch (e) {
        console.error('Failed to load lesson plans from storage:', e);
      }
    }
  }
}

/**
 * Save storage to localStorage
 */
function persistStorage(): void {
  if (typeof localStorage !== 'undefined') {
    const plans = Array.from(lessonPlansStore.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initStorage();
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all lesson plans for a class
 */
export async function getLessonPlans(classId: string): Promise<LessonPlan[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const plans = Array.from(lessonPlansStore.values())
    .filter(plan => plan.classId === classId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  return plans;
}

/**
 * Get a single lesson plan by ID
 */
export async function getLessonPlan(id: string): Promise<LessonPlan | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return lessonPlansStore.get(id) || null;
}

/**
 * Create a new lesson plan
 */
export async function createLessonPlan(input: CreateLessonPlanInput): Promise<LessonPlan> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const now = new Date().toISOString();
  const plan: LessonPlan = {
    id: generateId(),
    classId: input.classId,
    periodType: input.periodType,
    title: input.title,
    data: input.data || {},
    createdAt: now,
    updatedAt: now
  };
  
  lessonPlansStore.set(plan.id, plan);
  persistStorage();
  
  return plan;
}

/**
 * Update an existing lesson plan
 */
export async function updateLessonPlan(input: UpdateLessonPlanInput): Promise<LessonPlan | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const existing = lessonPlansStore.get(input.id);
  if (!existing) {
    return null;
  }
  
  const updated: LessonPlan = {
    ...existing,
    title: input.title !== undefined ? input.title : existing.title,
    data: input.data !== undefined ? input.data : existing.data,
    updatedAt: new Date().toISOString()
  };
  
  lessonPlansStore.set(input.id, updated);
  persistStorage();
  
  return updated;
}

/**
 * Delete a lesson plan
 */
export async function deleteLessonPlan(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const deleted = lessonPlansStore.delete(id);
  if (deleted) {
    persistStorage();
  }
  
  return deleted;
}

/**
 * Search lesson plans by title
 */
export async function searchLessonPlans(classId: string, query: string): Promise<LessonPlan[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const plans = await getLessonPlans(classId);
  
  if (!query.trim()) {
    return plans;
  }
  
  const lowerQuery = query.toLowerCase();
  return plans.filter(plan => 
    plan.title.toLowerCase().includes(lowerQuery) ||
    plan.periodType.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Export lesson plan data
 */
export function exportLessonPlan(plan: LessonPlan, format: 'json' | 'csv' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(plan, null, 2);
  }
  
  // CSV export for tabular data
  if (format === 'csv') {
    const rows: string[] = [];
    rows.push('Field,Value');
    rows.push(`Title,"${plan.title}"`);
    rows.push(`Period Type,${plan.periodType}`);
    rows.push(`Created,${plan.createdAt}`);
    rows.push(`Updated,${plan.updatedAt}`);
    
    // Add data fields
    Object.entries(plan.data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        rows.push(`${key},"${value.replace(/"/g, '""')}"`);
      } else {
        rows.push(`${key},"${JSON.stringify(value)}"`);
      }
    });
    
    return rows.join('\n');
  }
  
  return '';
}
