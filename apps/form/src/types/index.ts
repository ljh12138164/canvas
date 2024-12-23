import type { Session, User } from '@supabase/supabase-js'

export interface UserMeta {
  email?: string
  email_verified?: boolean
  image?: string
  name?: string
  phone_verified?: boolean
  sub?: string
}
export type Sessions = {
  user: User & {
    user_metadata: UserMeta
  }
  session: Session
}

export interface Profiles {
  id: string
  name: string
  image: string
  email: string
}

export interface Form {
  id: string
  name: string
  description: string
  userId: string
  created_at: string
  update_at: string
  schema: string
}
