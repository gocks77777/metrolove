export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string
          bio: string | null
          avatar_url: string | null
          gender: string | null
          age: number | null
          created_at: string
        }
        Insert: {
          id: string
          nickname: string
          bio?: string | null
          avatar_url?: string | null
          gender?: string | null
          age?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          nickname?: string
          bio?: string | null
          avatar_url?: string | null
          gender?: string | null
          age?: number | null
          created_at?: string
        }
        Relationships: []
      }
      wifi_sessions: {
        Row: {
          id: string
          user_id: string
          ssid: string
          line: number | null
          station: string | null
          connected_at: string
          disconnected_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          ssid: string
          line?: number | null
          station?: string | null
          connected_at?: string
          disconnected_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          ssid?: string
          line?: number | null
          station?: string | null
          connected_at?: string
          disconnected_at?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          user_a: string
          user_b: string
          status: string
          created_at: string
          expires_at: string | null
          extended_by: string[]
        }
        Insert: {
          id?: string
          user_a: string
          user_b: string
          status?: string
          created_at?: string
          expires_at?: string | null
          extended_by?: string[]
        }
        Update: {
          id?: string
          user_a?: string
          user_b?: string
          status?: string
          created_at?: string
          expires_at?: string | null
          extended_by?: string[]
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          read_at?: string | null
        }
        Relationships: []
      }
      swipes: {
        Row: {
          id: string
          swiper_id: string
          swiped_id: string
          direction: string
          created_at: string
        }
        Insert: {
          id?: string
          swiper_id: string
          swiped_id: string
          direction: string
          created_at?: string
        }
        Update: {
          id?: string
          swiper_id?: string
          swiped_id?: string
          direction?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type WifiSession = Database['public']['Tables']['wifi_sessions']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Swipe = Database['public']['Tables']['swipes']['Row']
