import { describe, it, expect } from 'vitest'
import { formatDate, formatGrade } from '../../src/utils/formatters.js'

describe('formatDate', () => {
  it('should format a valid date in pt-BR locale', () => {
    const date = new Date('2024-01-15')
    const formatted = formatDate(date)
    // pt-BR format is DD/MM/YYYY
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('should return "—" for null date', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('should return "—" for undefined date', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('should return "—" for falsy values', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
  })
})

describe('formatGrade', () => {
  it('should format a valid grade as string', () => {
    expect(formatGrade(95)).toBe('95')
    expect(formatGrade(0)).toBe('0')
    expect(formatGrade(100)).toBe('100')
  })

  it('should return "—" for null grade', () => {
    expect(formatGrade(null)).toBe('—')
  })

  it('should return "—" for undefined grade', () => {
    expect(formatGrade(undefined)).toBe('—')
  })
})
