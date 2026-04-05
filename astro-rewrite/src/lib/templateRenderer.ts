/**
 * Template Renderer for Lesson Planner
 * Client-side utility to render Astro templates dynamically
 */

import type { PeriodType } from '../lib/lessonTemplates';
import { DAILY_STAGES, WEEKLY_DAY_LABELS, MONTHLY_PHASE_LABELS, YEARLY_SECTION_LABELS, PLACEHOLDERS } from '../lib/lessonTemplates';
import { t } from '../lib/i18n';

export interface TemplateRendererOptions {
  container: HTMLElement;
  periodType: PeriodType;
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

/**
 * Render the appropriate template based on period type
 */
export function renderTemplate(options: TemplateRendererOptions): void {
  const { container, periodType, data, onChange } = options;
  
  // Clear container
  container.innerHTML = '';
  
  switch (periodType) {
    case 'daily':
      renderDailyTemplate(container, data, onChange);
      break;
    case 'weekly':
      renderWeeklyTemplate(container, data, onChange);
      break;
    case 'monthly':
      renderMonthlyTemplate(container, data, onChange);
      break;
    case 'yearly':
      renderYearlyTemplate(container, data, onChange);
      break;
  }
}

/**
 * Render Daily Template
 */
function renderDailyTemplate(
  container: HTMLElement,
  data: Record<string, any>,
  onChange: (data: Record<string, any>) => void
): void {
  const d = data || {};
  const stages = d.stages || DAILY_STAGES.map((s) => ({
    stage: s.stage,
    method: s.method,
    teacherActions: '',
    studentActions: '',
    assessment: ''
  }));
  
  const ph = PLACEHOLDERS.daily;
  
  container.innerHTML = `
    <div class="daily-template space-y-6">
      <!-- Objective -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('lesson_planner.objective')}</label>
        <textarea
          rows="2"
          class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="${ph.objective}"
          data-field="objective"
        >${d.objective || ''}</textarea>
      </div>

      <!-- Materials -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('lesson_planner.materials')}</label>
        <input
          type="text"
          class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="${ph.materials}"
          data-field="materials"
          value="${d.materials || ''}"
        />
      </div>

      <!-- Stages Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-gray-100 border-b-2 border-gray-200">
              <th class="p-3 text-left">${t('lesson_planner.stage')}</th>
              <th class="p-3 text-left">${t('lesson_planner.method')}</th>
              <th class="p-3 text-left">${t('lesson_planner.teacher_actions')}</th>
              <th class="p-3 text-left">${t('lesson_planner.student_actions')}</th>
              <th class="p-3 text-left">${t('lesson_planner.assessment')}</th>
            </tr>
          </thead>
          <tbody>
            ${DAILY_STAGES.map((s, i) => `
              <tr class="border-b border-gray-200">
                <td class="p-3 font-semibold align-top">${s.stage}</td>
                <td class="p-3 text-gray-500 align-top">${s.method}</td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${s.teacherActionsPlaceholder}"
                    data-stage-index="${i}"
                    data-stage-field="teacherActions"
                  >${stages[i]?.teacherActions || ''}</textarea>
                </td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${s.studentActionsPlaceholder}"
                    data-stage-index="${i}"
                    data-stage-field="studentActions"
                  >${stages[i]?.studentActions || ''}</textarea>
                </td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${s.assessmentPlaceholder}"
                    data-stage-index="${i}"
                    data-stage-field="assessment"
                  >${stages[i]?.assessment || ''}</textarea>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('lesson_planner.notes')}</label>
        <textarea
          rows="2"
          class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="${ph.notes}"
          data-field="notes"
        >${d.notes || ''}</textarea>
      </div>
    </div>
  `;
  
  // Add event listeners
  attachDailyListeners(container, data, onChange, stages);
}

function attachDailyListeners(
  container: HTMLElement,
  data: Record<string, any>,
  onChange: (data: Record<string, any>) => void,
  stages: any[]
): void {
  // Objective and materials
  const objectiveEl = container.querySelector('[data-field="objective"]') as HTMLTextAreaElement;
  const materialsEl = container.querySelector('[data-field="materials"]') as HTMLInputElement;
  const notesEl = container.querySelector('[data-field="notes"]') as HTMLTextAreaElement;
  
  if (objectiveEl) {
    objectiveEl.addEventListener('input', (e) => {
      onChange({ ...data, objective: (e.target as HTMLTextAreaElement).value });
    });
  }
  
  if (materialsEl) {
    materialsEl.addEventListener('input', (e) => {
      onChange({ ...data, materials: (e.target as HTMLInputElement).value });
    });
  }
  
  if (notesEl) {
    notesEl.addEventListener('input', (e) => {
      onChange({ ...data, notes: (e.target as HTMLTextAreaElement).value });
    });
  }
  
  // Stage fields
  container.querySelectorAll('[data-stage-index]').forEach(el => {
    const index = parseInt((el as HTMLElement).dataset.stageIndex || '0');
    const field = (el as HTMLElement).dataset.stageField || '';
    
    el.addEventListener('input', (e) => {
      const next = [...stages];
      if (!next[index]) {
        next[index] = { ...DAILY_STAGES[index], teacherActions: '', studentActions: '', assessment: '' };
      }
      next[index] = { ...next[index], [field]: (e.target as HTMLTextAreaElement).value };
      onChange({ ...data, stages: next });
    });
  });
}

/**
 * Render Weekly Template
 */
function renderWeeklyTemplate(
  container: HTMLElement,
  data: Record<string, any>,
  onChange: (data: Record<string, any>) => void
): void {
  const days = data.days || WEEKLY_DAY_LABELS.map(day => ({
    day,
    focus: '',
    languageTarget: '',
    assessment: ''
  }));
  
  container.innerHTML = `
    <div class="weekly-template space-y-6">
      <!-- Focus -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('lesson_planner.focus')}</label>
        <textarea
          rows="2"
          class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="${PLACEHOLDERS.weekly.focus}"
          data-field="focus"
        >${data.focus || ''}</textarea>
      </div>

      <!-- Days Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-gray-100 border-b-2 border-gray-200">
              <th class="p-3 text-left">${t('lesson_planner.day')}</th>
              <th class="p-3 text-left">${t('lesson_planner.focus')}</th>
              <th class="p-3 text-left">${t('lesson_planner.language_target')}</th>
              <th class="p-3 text-left">${t('lesson_planner.assessment')}</th>
            </tr>
          </thead>
          <tbody>
            ${days.map((day: any, i: number) => `
              <tr class="border-b border-gray-200">
                <td class="p-3 font-semibold align-top">${day.day}</td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.weekly.focus}"
                    data-day-index="${i}"
                    data-day-field="focus"
                  >${day.focus || ''}</textarea>
                </td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.weekly.languageTarget}"
                    data-day-index="${i}"
                    data-day-field="languageTarget"
                  >${day.languageTarget || ''}</textarea>
                </td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.weekly.assessment}"
                    data-day-index="${i}"
                    data-day-field="assessment"
                  >${day.assessment || ''}</textarea>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('lesson_planner.notes')}</label>
        <textarea
          rows="2"
          class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="${PLACEHOLDERS.weekly.notes}"
          data-field="notes"
        >${data.notes || ''}</textarea>
      </div>
    </div>
  `;
  
  // Add event listeners
  attachWeeklyListeners(container, data, onChange, days);
}

function attachWeeklyListeners(
  container: HTMLElement,
  data: Record<string, any>,
  onChange: (data: Record<string, any>) => void,
  days: any[]
): void {
  const focusEl = container.querySelector('[data-field="focus"]') as HTMLTextAreaElement;
  const notesEl = container.querySelector('[data-field="notes"]') as HTMLTextAreaElement;
  
  if (focusEl) {
    focusEl.addEventListener('input', (e) => {
      onChange({ ...data, focus: (e.target as HTMLTextAreaElement).value });
    });
  }
  
  if (notesEl) {
    notesEl.addEventListener('input', (e) => {
      onChange({ ...data, notes: (e.target as HTMLTextAreaElement).value });
    });
  }
  
  container.querySelectorAll('[data-day-index]').forEach(el => {
    const index = parseInt((el as HTMLElement).dataset.dayIndex || '0');
    const field = (el as HTMLElement).dataset.dayField || '';
    
    el.addEventListener('input', (e) => {
      const next = [...days];
      if (!next[index]) {
        next[index] = { day: WEEKLY_DAY_LABELS[index], focus: '', languageTarget: '', assessment: '' };
      }
      next[index] = { ...next[index], [field]: (e.target as HTMLTextAreaElement).value };
      onChange({ ...data, days: next });
    });
  });
}

/**
 * Render Monthly Template
 */
function renderMonthlyTemplate(
  container: HTMLElement,
  data: Record<string, any>,
  onChange: (data: Record<string, any>) => void
): void {
  const phases = data.phases || MONTHLY_PHASE_LABELS.map(phase => ({
    phase,
    focus: '',
    languageTarget: '',
    assessment: ''
  }));
  
  container.innerHTML = `
    <div class="monthly-template space-y-6">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-gray-100 border-b-2 border-gray-200">
              <th class="p-3 text-left">${t('lesson_planner.phase')}</th>
              <th class="p-3 text-left">${t('lesson_planner.focus')}</th>
              <th class="p-3 text-left">${t('lesson_planner.language_target')}</th>
              <th class="p-3 text-left">${t('lesson_planner.assessment')}</th>
            </tr>
          </thead>
          <tbody>
            ${phases.map((phase: any, i: number) => `
              <tr class="border-b border-gray-200">
                <td class="p-3 font-semibold align-top">${phase.phase}</td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.monthly.focus}"
                    data-phase-index="${i}"
                    data-phase-field="focus"
                  >${phase.focus || ''}</textarea>
                </td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.monthly.languageTarget}"
                    data-phase-index="${i}"
                    data-phase-field="languageTarget"
                  >${phase.languageTarget || ''}</textarea>
                </td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.monthly.assessment}"
                    data-phase-index="${i}"
                    data-phase-field="assessment"
                  >${phase.assessment || ''}</textarea>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('lesson_planner.notes')}</label>
        <textarea
          rows="2"
          class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="${PLACEHOLDERS.monthly.notes}"
          data-field="notes"
        >${data.notes || ''}</textarea>
      </div>
    </div>
  `;
  
  attachMonthlyListeners(container, data, onChange, phases);
}

function attachMonthlyListeners(
  container: HTMLElement,
  data: Record<string, any>,
  onChange: (data: Record<string, any>) => void,
  phases: any[]
): void {
  const notesEl = container.querySelector('[data-field="notes"]') as HTMLTextAreaElement;
  
  if (notesEl) {
    notesEl.addEventListener('input', (e) => {
      onChange({ ...data, notes: (e.target as HTMLTextAreaElement).value });
    });
  }
  
  container.querySelectorAll('[data-phase-index]').forEach(el => {
    const index = parseInt((el as HTMLElement).dataset.phaseIndex || '0');
    const field = (el as HTMLElement).dataset.phaseField || '';
    
    el.addEventListener('input', (e) => {
      const next = [...phases];
      if (!next[index]) {
        next[index] = { phase: MONTHLY_PHASE_LABELS[index], focus: '', languageTarget: '', assessment: '' };
      }
      next[index] = { ...next[index], [field]: (e.target as HTMLTextAreaElement).value };
      onChange({ ...data, phases: next });
    });
  });
}

/**
 * Render Yearly Template
 */
function renderYearlyTemplate(
  container: HTMLElement,
  data: Record<string, any>,
  onChange: (data: Record<string, any>) => void
): void {
  const sections = data.sections || YEARLY_SECTION_LABELS.map(section => ({
    section,
    focus: '',
    languageTarget: '',
    assessment: ''
  }));
  
  container.innerHTML = `
    <div class="yearly-template space-y-6">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-gray-100 border-b-2 border-gray-200">
              <th class="p-3 text-left">${t('lesson_planner.section')}</th>
              <th class="p-3 text-left">${t('lesson_planner.focus')}</th>
              <th class="p-3 text-left">${t('lesson_planner.language_target')}</th>
              <th class="p-3 text-left">${t('lesson_planner.assessment')}</th>
            </tr>
          </thead>
          <tbody>
            ${sections.map((section: any, i: number) => `
              <tr class="border-b border-gray-200">
                <td class="p-3 font-semibold align-top">${section.section}</td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.yearly.desiredResults}"
                    data-section-index="${i}"
                    data-section-field="focus"
                  >${section.focus || ''}</textarea>
                </td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.yearly.assessmentEvidence}"
                    data-section-index="${i}"
                    data-section-field="languageTarget"
                  >${section.languageTarget || ''}</textarea>
                </td>
                <td class="p-3 align-top">
                  <textarea
                    rows="2"
                    class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[50px] m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="${PLACEHOLDERS.yearly.unitOverviewTable}"
                    data-section-index="${i}"
                    data-section-field="assessment"
                  >${section.assessment || ''}</textarea>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('lesson_planner.notes')}</label>
        <textarea
          rows="2"
          class="w-full p-3 rounded-lg border border-gray-300 text-sm bg-white min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="${PLACEHOLDERS.yearly.notes}"
          data-field="notes"
        >${data.notes || ''}</textarea>
      </div>
    </div>
  `;
  
  attachYearlyListeners(container, data, onChange, sections);
}

function attachYearlyListeners(
  container: HTMLElement,
  data: Record<string, any>,
  onChange: (data: Record<string, any>) => void,
  sections: any[]
): void {
  const notesEl = container.querySelector('[data-field="notes"]') as HTMLTextAreaElement;
  
  if (notesEl) {
    notesEl.addEventListener('input', (e) => {
      onChange({ ...data, notes: (e.target as HTMLTextAreaElement).value });
    });
  }
  
  container.querySelectorAll('[data-section-index]').forEach(el => {
    const index = parseInt((el as HTMLElement).dataset.sectionIndex || '0');
    const field = (el as HTMLElement).dataset.sectionField || '';
    
    el.addEventListener('input', (e) => {
      const next = [...sections];
      if (!next[index]) {
        next[index] = { section: YEARLY_SECTION_LABELS[index], focus: '', languageTarget: '', assessment: '' };
      }
      next[index] = { ...next[index], [field]: (e.target as HTMLTextAreaElement).value };
      onChange({ ...data, sections: next });
    });
  });
}
