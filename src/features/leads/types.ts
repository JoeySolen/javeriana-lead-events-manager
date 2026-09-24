export interface Lead {
  id: string
  fullName: string
  email: string
  programId: string
  createdAt: string
}

export type LeadInput = Pick<Lead, 'fullName' | 'email' | 'programId'>
