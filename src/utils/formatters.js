/**
 * Format a date for display in pt-BR locale
 * @param {Date|null|undefined} date - The date to format
 * @returns {string} Formatted date string or "—" for null/undefined
 */
export function formatDate(date) {
  if (!date) {
    return '—'
  }
  
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

/**
 * Format a grade for display
 * @param {number|null|undefined} grade - The grade to format (0-100)
 * @returns {string} Formatted grade string or "—" for null/undefined
 */
export function formatGrade(grade) {
  if (grade === null || grade === undefined) {
    return '—'
  }
  
  return String(grade)
}
