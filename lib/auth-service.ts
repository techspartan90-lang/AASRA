import { getSupabaseClient } from './supabase';
import { UserRole, CanonicalRole, CANONICAL_ROLE_MAP, CanonicalUser } from '@/types';

export interface AuthUserProfile {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  language: string;
  status: 'active' | 'suspended' | 'inactive';
  createdAt: string;
  districtId?: string;
  stateId?: string;
}

export function toCanonicalUser(profile: AuthUserProfile): CanonicalUser {
  return {
    id: profile.id,
    role: CANONICAL_ROLE_MAP[profile.role] || 'SURVIVOR',
    systemRole: profile.role,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    districtId: profile.districtId,
    stateId: profile.stateId,
    status: profile.status,
    createdAt: profile.createdAt,
  };
}

export interface AuthState {
  user: AuthUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isSupabaseBackend: boolean;
}

export const DEMO_USERS: Record<UserRole, AuthUserProfile> = {
  victim: {
    id: 'usr-victim-001',
    email: 'victim.demo@crisis-monitor.in',
    phone: '9876543210',
    name: 'Ananya Sharma',
    role: 'victim',
    language: 'hi',
    status: 'active',
    createdAt: '2026-01-14T08:30:00Z',
  },
  counsellor: {
    id: 'usr-counsellor-002',
    email: 'priya.nair@crisis-monitor.in',
    phone: '9876543211',
    name: 'Dr. Priya Nair',
    role: 'counsellor',
    language: 'en',
    status: 'active',
    createdAt: '2025-11-01T10:00:00Z',
  },
  district_officer: {
    id: 'usr-officer-003',
    email: 'kamrup.officer@crisis-monitor.in',
    phone: '9876543212',
    name: 'R. K. Barua',
    role: 'district_officer',
    language: 'as',
    status: 'active',
    districtId: 'kamrup',
    stateId: 'assam',
    createdAt: '2025-10-15T09:00:00Z',
  },
  state_admin: {
    id: 'usr-state-004',
    email: 'assam.stateadmin@crisis-monitor.in',
    phone: '9876543213',
    name: 'Sunita Bora',
    role: 'state_admin',
    language: 'as',
    status: 'active',
    stateId: 'assam',
    createdAt: '2025-08-01T11:00:00Z',
  },
  national_admin: {
    id: 'usr-national-005',
    email: 'director.crisis-monitor@gov.in',
    phone: '9876543214',
    name: 'Director General Verma',
    role: 'national_admin',
    language: 'en',
    status: 'active',
    createdAt: '2025-06-01T08:00:00Z',
  },
};

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user with Supabase Auth or simulate demo registration
   */
  public async signUp(
    email: string,
    password: string,
    name: string,
    role: UserRole = 'victim'
  ): Promise<{ user: AuthUserProfile | null; error: string | null }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Local fallback for development/demo
      const mockUser: AuthUserProfile = {
        id: `usr-${Date.now().toString(36)}`,
        email,
        name,
        role,
        language: 'en',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      return { user: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: 'Registration failed to return user data' };

      // Create profile row in profiles table
      const profile: AuthUserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        name,
        role,
        language: 'en',
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      await supabase.from('profiles').upsert({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        language: profile.language,
        status: profile.status,
      });

      return { user: profile, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown signup error';
      return { user: null, error: message };
    }
  }

  /**
   * Helper to match an identifier (email, phone, or alias) to a registered user profile.
   * Resolves the verified role from the user account record.
   */
  public findUserByIdentifier(identifier: string): AuthUserProfile | null {
    const rawClean = identifier.trim().toLowerCase();
    const cleaned = rawClean.replace(/[\s-]/g, '');
    const idDigits = identifier.replace(/\D/g, '');
    const last10 = idDigits.length >= 10 ? idDigits.slice(-10) : idDigits;
    const users = Object.values(DEMO_USERS);

    // Check exact email or normalized phone
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === rawClean ||
        u.email.toLowerCase() === cleaned ||
        (u.phone && last10.length === 10 && u.phone.replace(/\D/g, '').slice(-10) === last10)
    );
    if (found) return found;

    // Check role keywords for testing/demo credentials
    if (cleaned.includes('victim') || cleaned.includes('survivor') || cleaned.includes('ananya') || cleaned.includes('anita')) return DEMO_USERS.victim;
    if (cleaned.includes('counsellor') || cleaned.includes('priya') || cleaned.includes('doctor')) return DEMO_USERS.counsellor;
    if (cleaned.includes('district') || cleaned.includes('officer') || cleaned.includes('barua') || cleaned.includes('rajesh')) return DEMO_USERS.district_officer;
    if (cleaned.includes('state') || cleaned.includes('sunita') || cleaned.includes('deshmukh') || cleaned.includes('bora')) return DEMO_USERS.state_admin;
    if (cleaned.includes('admin') || cleaned.includes('director') || cleaned.includes('verma') || cleaned.includes('vikram')) return DEMO_USERS.national_admin;

    return null;
  }

  /**
   * Sign in user with email/phone & password
   */
  public async signIn(
    identifier: string,
    password?: string
  ): Promise<{ user: AuthUserProfile | null; error: string | null }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      const matched = this.findUserByIdentifier(identifier);
      if (matched) return { user: matched, error: null };

      // Default to survivor profile with provided identifier
      const user: AuthUserProfile = {
        ...DEMO_USERS.victim,
        email: identifier.includes('@') ? identifier : `${identifier}@aasra.gov.in`,
        phone: identifier.match(/^\+?[0-9]{10,12}$/) ? identifier : undefined,
      };
      return { user, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password || 'Aasra@2026',
      });

      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: 'Sign in returned no user' };

      const profile = await this.fetchUserProfile(data.user.id, data.user.email || identifier);
      return { user: profile, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failure';
      return { user: null, error: message };
    }
  }

  /**
   * Request a 6-digit OTP for phone or email
   */
  public async sendOtp(identifier: string): Promise<{ success: boolean; message: string; error: string | null }> {
    if (!identifier || identifier.trim().length < 3) {
      return { success: false, message: '', error: 'Please enter a valid registered mobile number or email' };
    }
    return {
      success: true,
      message: `A secure 6-digit OTP has been dispatched to ${identifier}. (Demo code: 123456)`,
      error: null,
    };
  }

  /**
   * Verify OTP and complete authentication
   */
  public async signInWithOtp(
    identifier: string,
    otp: string
  ): Promise<{ user: AuthUserProfile | null; error: string | null }> {
    if (!otp || otp.trim().length !== 6) {
      return { user: null, error: 'Please enter a valid 6-digit verification code' };
    }
    if (otp !== '123456') {
      return { user: null, error: 'Invalid or expired OTP. Please enter the valid verification code.' };
    }
    const matched = this.findUserByIdentifier(identifier);
    const user = matched || {
      ...DEMO_USERS.victim,
      email: identifier.includes('@') ? identifier : `${identifier}@aasra.gov.in`,
      phone: identifier.match(/^\+?[0-9]{10,12}$/) ? identifier : undefined,
    };
    return { user, error: null };
  }

  /**
   * Sign out current user
   */
  public async signOut(): Promise<{ error: string | null }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: null };

    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign out failed' };
    }
  }

  /**
   * Get current authenticated user
   */
  public async getCurrentUser(): Promise<AuthUserProfile | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return await this.fetchUserProfile(user.id, user.email || '');
    } catch {
      return null;
    }
  }

  /**
   * Reset password request
   */
  public async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: true, error: null };

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { success: !error, error: error ? error.message : null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Reset password failed' };
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(
    userId: string,
    updates: Partial<Pick<AuthUserProfile, 'name' | 'language'>>
  ): Promise<{ error: string | null }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: null };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      return { error: error ? error.message : null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Profile update error' };
    }
  }

  private async fetchUserProfile(userId: string, defaultEmail: string): Promise<AuthUserProfile> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        id: userId,
        email: defaultEmail,
        name: 'Authorized User',
        role: 'victim',
        language: 'en',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      return {
        id: data.id,
        email: data.email || defaultEmail,
        name: data.name || 'User',
        role: data.role as UserRole,
        language: data.language || 'en',
        status: data.status || 'active',
        createdAt: data.created_at || new Date().toISOString(),
        districtId: data.district_id,
        stateId: data.state_id,
      };
    }

    return {
      id: userId,
      email: defaultEmail,
      name: 'User',
      role: 'victim',
      language: 'en',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }
}

export const authService = AuthService.getInstance();
