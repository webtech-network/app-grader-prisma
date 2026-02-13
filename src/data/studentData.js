// Mock data for student activities and classes
// Requirements: 5.1, 5.2, 5.3, 5.4, 5.5

export const mockActivities = [
  {
    id: 'two-sum',
    name: 'Two Sum',
    classId: 'cs101',
    status: 'Concluída',
    grade: 95,
    lastSubmission: new Date('2024-01-15T14:30:00')
  },
  {
    id: 'reverse-string',
    name: 'Reverse String',
    classId: 'cs101',
    status: 'Em andamento',
    grade: 72,
    lastSubmission: new Date('2024-01-18T10:15:00')
  },
  {
    id: 'palindrome',
    name: 'Valid Palindrome',
    classId: 'cs101',
    status: 'Pendente',
    grade: null,
    lastSubmission: null
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Sequence',
    classId: 'cs102',
    status: 'Concluída',
    grade: 88,
    lastSubmission: new Date('2024-01-12T16:45:00')
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    classId: 'cs102',
    status: 'Em andamento',
    grade: null,
    lastSubmission: new Date('2024-01-19T09:20:00')
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    classId: 'cs201',
    status: 'Concluída',
    grade: 92,
    lastSubmission: new Date('2024-01-20T11:00:00')
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    classId: 'cs201',
    status: 'Pendente',
    grade: null,
    lastSubmission: null
  }
]

export const mockClasses = [
  {
    id: 'cs101',
    name: 'Algoritmos e Estruturas de Dados',
    description: 'Fundamentos de algoritmos e estruturas de dados básicas'
  },
  {
    id: 'cs102',
    name: 'Programação Orientada a Objetos',
    description: 'Conceitos e práticas de POO'
  },
  {
    id: 'cs201',
    name: 'Análise de Algoritmos',
    description: 'Análise de complexidade e otimização de algoritmos'
  }
]
