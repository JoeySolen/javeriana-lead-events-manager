export const PROGRAM_CATEGORIES = [
  'Pregrado',
  'Posgrado',
  'Educación Continua',
] as const

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number]

export interface Program {
  id: string
  name: string
  category: ProgramCategory
  description: string
}
