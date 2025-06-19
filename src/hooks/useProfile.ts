import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
}

/**
 * Lightweight profile hook that reads data directly from Supabase auth.
 * If you have a dedicated `profiles` table you can extend this hook later.
 */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (user) {
          let username = user.user_metadata?.username as string | undefined;
          let fullName = (user.user_metadata?.full_name || user.user_metadata?.name) as string | undefined;

          // Fallback: look in public.users table for profile data
          if (!username || !fullName) {
            const { data: rows } = await supabase
              .from('users')
              .select('username, first_name, last_name')
              .eq('id', user.id)
              .maybeSingle();

            if (rows) {
              if (!username && rows.username) {
                username = rows.username as string;
              }
              if (!fullName) {
                fullName = [rows.first_name, rows.last_name].filter(Boolean).join(' ') || undefined;
              }
            }
          }

          setProfile({
            id: user.id,
            email: user.email ?? '',
            username,
            fullName
          });
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error loading profile from Supabase:', err);
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { profile, loading, error };
} 