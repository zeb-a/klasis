/**
 * Export utilities for lesson plans
 * Supports PDF and DOCX export formats
 */

import type { LessonPlan } from '../services/lessonPlanApi';

/**
 * Convert lesson plan to HTML for export
 */
export function planToHtml(plan: LessonPlan): string {
  const { title, periodType, data, createdAt, updatedAt } = plan;
  
  let contentHtml = '';
  
  // Render based on period type
  if (periodType === 'daily' && data.stages) {
    contentHtml += `
      <div style="margin-bottom: 20px;">
        <strong>Objective:</strong> ${data.objective || ''}
      </div>
      <div style="margin-bottom: 20px;">
        <strong>Materials:</strong> ${data.materials || ''}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Stage</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Method</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Teacher Actions</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Student Actions</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Assessment</th>
          </tr>
        </thead>
        <tbody>
          ${data.stages.map((stage: any) => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${stage.stage || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${stage.method || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${stage.teacherActions || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${stage.studentActions || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${stage.assessment || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (periodType === 'weekly' && data.days) {
    contentHtml += `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Day</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Focus</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Language Target</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Assessment</th>
          </tr>
        </thead>
        <tbody>
          ${data.days.map((day: any) => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${day.day || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${day.focus || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${day.languageTarget || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${day.assessment || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (periodType === 'monthly' && data.phases) {
    contentHtml += `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Phase</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Focus</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Language Target</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Assessment</th>
          </tr>
        </thead>
        <tbody>
          ${data.phases.map((phase: any) => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${phase.phase || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${phase.focus || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${phase.languageTarget || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${phase.assessment || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (periodType === 'yearly' && data.sections) {
    contentHtml += `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Section</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Focus</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Language Target</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Assessment</th>
          </tr>
        </thead>
        <tbody>
          ${data.sections.map((section: any) => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${section.section || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${section.focus || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${section.languageTarget || ''}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${section.assessment || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  if (data.notes) {
    contentHtml += `
      <div style="margin-top: 20px;">
        <strong>Notes:</strong><br/>
        ${data.notes}
      </div>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title} - Lesson Plan</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1f2937; margin-bottom: 10px; }
          .meta { color: #6b7280; font-size: 14px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #d1d5db; padding: 8px; }
          th { background-color: #f3f4f6; text-align: left; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">
          <div>Type: ${periodType.toUpperCase()}</div>
          <div>Created: ${new Date(createdAt).toLocaleDateString()}</div>
          <div>Updated: ${new Date(updatedAt).toLocaleDateString()}</div>
        </div>
        ${contentHtml}
      </body>
    </html>
  `;
}

/**
 * Export lesson plan as downloadable HTML file
 */
export function downloadAsHtml(plan: LessonPlan, filename?: string): void {
  if (typeof window === 'undefined') return;
  
  const html = planToHtml(plan);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${plan.title.replace(/[^a-z0-9]/gi, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export lesson plan as PDF (using browser print)
 * Note: For production, consider using a library like jsPDF or pdfmake
 */
export function exportAsPdf(plan: LessonPlan): void {
  if (typeof window === 'undefined') return;
  
  const html = planToHtml(plan);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}

/**
 * Create simple DOCX-like structure (actually HTML with .doc extension)
 * This is a simplified approach - for full DOCX support, use a library like docx
 */
export function exportAsDocx(plan: LessonPlan): void {
  if (typeof window === 'undefined') return;
  
  const html = planToHtml(plan);
  const blob = new Blob([html], { 
    type: 'application/msword' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.title.replace(/[^a-z0-9]/gi, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Print lesson plan
 */
export function printPlan(plan: LessonPlan): void {
  if (typeof window === 'undefined') return;
  
  const html = planToHtml(plan);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}
