import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Case = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  organization: string;
  individuals: string;
  status: 'new' | 'investigating' | 'in-progress' | 'resolved' | 'closed';
  votes: number;
  comments: number;
  views: number;
  progress: number;
  created_at: string;
  updated_at: string;
}; 