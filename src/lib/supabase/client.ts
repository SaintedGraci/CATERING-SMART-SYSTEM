import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    console.error('Please add to .env.local:');
    console.error('  NEXT_PUBLIC_SUPABASE_URL=your-url');
    console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key');
    
    // Return a dummy client for build time
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
