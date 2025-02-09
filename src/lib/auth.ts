import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  username: string;
  avatar_url?: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    console.log('Getting current user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting auth user:', authError);
      return null;
    }

    if (!user) {
      console.log('No authenticated user found');
      return null;
    }

    console.log('Auth user found:', user);

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error getting user profile:', profileError);
      return null;
    }

    if (!profile) {
      console.log('No user profile found for:', user.id);
      return null;
    }

    console.log('User profile found:', profile);

    return {
      id: user.id,
      username: profile.username,
      avatar_url: profile.avatar_url,
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    console.log('Signing in user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    console.log('Sign in successful:', data);
    return data;
  } catch (error) {
    console.error('Error in signInWithEmail:', error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, password: string, username: string) {
  try {
    console.log('Signing up user:', { email, username });
    // 1. Sign up the user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      throw signUpError;
    }
    if (!user) {
      console.error('User not created');
      throw new Error('User not created');
    }

    console.log('Auth user created:', user);

    // 2. Create the user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          username,
          avatar_url: `https://ui-avatars.com/api/?name=${username}`,
        },
      ]);

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // If profile creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(user.id);
      throw profileError;
    }

    console.log('User profile created successfully');
    return user;
  } catch (error) {
    console.error('Error in signUpWithEmail:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    console.log('Signing out user...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    console.log('Sign out successful');
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    console.log('Auth state changed:', { event: _event, session });
    callback(session?.user ?? null);
  });
}
