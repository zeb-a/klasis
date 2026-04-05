/**
 * Translation utilities for Astro
 * Replaces React i18n context with simple utility functions
 */

// Simple translations cache - English default
const translations: Record<string, string> = {
  // Lesson Planner translations
  'lesson_planner.title': 'Lesson Plans',
  'lesson_planner.back': 'Back',
  'lesson_planner.class': 'Class',
  'lesson_planner.select_class': 'Select class',
  'lesson_planner.search_plans': 'Search plans...',
  'lesson_planner.new_plan': 'New Plan',
  'lesson_planner.no_plans': 'No plans yet. Create one.',
  'lesson_planner.import': 'Import',
  'lesson_planner.export': 'Export',
  'lesson_planner.period': 'Period',
  'lesson_planner.select_period': 'Select period',
  'lesson_planner.yearly': 'Yearly',
  'lesson_planner.monthly': 'Monthly',
  'lesson_planner.weekly': 'Weekly',
  'lesson_planner.daily': 'Daily',
  'lesson_planner.date': 'Date',
  'lesson_planner.from': 'From',
  'lesson_planner.to': 'To',
  'lesson_planner.month_year': 'Month & Year',
  'lesson_planner.year': 'Year',
  'lesson_planner.title_label': 'Title',
  'lesson_planner.lesson_plan_title': 'Lesson plan title',
  'lesson_planner.save': 'Save',
  'lesson_planner.saved': 'Saved',
  'lesson_planner.paste_table': 'Paste Table',
  'lesson_planner.export_pdf': 'Export PDF',
  'lesson_planner.export_docx': 'Export Word',
  'lesson_planner.export_to_class': 'Copy to Class',
  'lesson_planner.delete': 'Delete',
  'lesson_planner.edit': 'Edit',
  'lesson_planner.loading': 'Loading...',
  'lesson_planner.saving': 'Saving...',
  'lesson_planner.saved_at': 'Saved at',
  'lesson_planner.auto_save': 'Auto-save enabled',
  'lesson_planner.confirm_delete': 'Are you sure you want to delete this plan?',
  'lesson_planner.empty_cells_warning': 'Some cells are empty. Do you want to save anyway?',
  'lesson_planner.stage': 'Stage',
  'lesson_planner.method': 'Method',
  'lesson_planner.teacher_actions': 'Teacher Actions',
  'lesson_planner.student_actions': 'Student Actions',
  'lesson_planner.assessment': 'Assessment',
  'lesson_planner.objective': 'Objective',
  'lesson_planner.materials': 'Materials',
  'lesson_planner.notes': 'Notes',
  'lesson_planner.focus': 'Focus',
  'lesson_planner.language_target': 'Language Target',
  'lesson_planner.section': 'Section',
  'lesson_planner.day': 'Day',
  'lesson_planner.phase': 'Phase',
  
  // Common UI
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.close': 'Close',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success'
};

// Language-specific overrides
const languageTranslations: Record<string, Record<string, string>> = {
  es: {
    'lesson_planner.title': 'Planes de Lección',
    'lesson_planner.back': 'Volver',
    'lesson_planner.class': 'Clase',
    'lesson_planner.select_class': 'Seleccionar clase',
    'lesson_planner.new_plan': 'Nuevo Plan',
    'lesson_planner.save': 'Guardar',
    'lesson_planner.daily': 'Diario',
    'lesson_planner.weekly': 'Semanal',
    'lesson_planner.monthly': 'Mensual',
    'lesson_planner.yearly': 'Anual',
    'lesson_planner.objective': 'Objetivo',
    'lesson_planner.materials': 'Materiales',
    'lesson_planner.notes': 'Notas',
    'lesson_planner.stage': 'Etapa',
    'lesson_planner.teacher_actions': 'Acciones del Docente',
    'lesson_planner.student_actions': 'Acciones del Estudiante',
    'lesson_planner.assessment': 'Evaluación'
  },
  fr: {
    'lesson_planner.title': 'Plans de Cours',
    'lesson_planner.back': 'Retour',
    'lesson_planner.class': 'Classe',
    'lesson_planner.select_class': 'Sélectionner une classe',
    'lesson_planner.new_plan': 'Nouveau Plan',
    'lesson_planner.save': 'Enregistrer',
    'lesson_planner.daily': 'Quotidien',
    'lesson_planner.weekly': 'Hebdomadaire',
    'lesson_planner.monthly': 'Mensuel',
    'lesson_planner.yearly': 'Annuel',
    'lesson_planner.objective': 'Objectif',
    'lesson_planner.materials': 'Matériel',
    'lesson_planner.notes': 'Notes',
    'lesson_planner.stage': 'Étape',
    'lesson_planner.teacher_actions': 'Actions de l\'Enseignant',
    'lesson_planner.student_actions': 'Actions de l\'Élève',
    'lesson_planner.assessment': 'Évaluation'
  },
  zh: {
    'lesson_planner.title': '课程计划',
    'lesson_planner.back': '返回',
    'lesson_planner.class': '班级',
    'lesson_planner.select_class': '选择班级',
    'lesson_planner.new_plan': '新计划',
    'lesson_planner.save': '保存',
    'lesson_planner.daily': '每日',
    'lesson_planner.weekly': '每周',
    'lesson_planner.monthly': '每月',
    'lesson_planner.yearly': '每年',
    'lesson_planner.objective': '目标',
    'lesson_planner.materials': '材料',
    'lesson_planner.notes': '备注',
    'lesson_planner.stage': '阶段',
    'lesson_planner.teacher_actions': '教师活动',
    'lesson_planner.student_actions': '学生活动',
    'lesson_planner.assessment': '评估'
  }
};

export function t(key: string, lang: string = 'en'): string {
  // Get current language from localStorage or default to English
  const currentLang = lang || (typeof localStorage !== 'undefined' ? localStorage.getItem('classABC_lang') || 'en' : 'en');
  
  // Check if translation exists in language-specific overrides
  if (languageTranslations[currentLang] && languageTranslations[currentLang][key]) {
    return languageTranslations[currentLang][key];
  }
  
  // Fall back to English
  return translations[key] || key;
}

export function getCurrentLang(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('classABC_lang') || 'en';
  }
  return 'en';
}

export function setLang(lang: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('classABC_lang', lang);
  }
}
