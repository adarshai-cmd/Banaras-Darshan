import { createClient, SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js";

// Runtime config cache (can be augmented dynamically from SiteSetting if configured via Admin)
let runtimeSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
let runtimeSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "";
let runtimeSupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

export function setRuntimeSupabaseCredentials(url: string, anonKey: string, serviceKey?: string) {
  runtimeSupabaseUrl = url.trim();
  runtimeSupabaseAnonKey = anonKey.trim();
  if (serviceKey !== undefined) {
    runtimeSupabaseServiceKey = serviceKey.trim();
  }
  // Reset cached clients
  browserClient = null;
  adminClient = null;
}

export function getSupabaseConfig() {
  const url = runtimeSupabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const anonKey = runtimeSupabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  const serviceRoleKey = runtimeSupabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";
  return {
    url,
    anonKey,
    serviceRoleKey,
    isConfigured: Boolean(url && (anonKey || serviceRoleKey)),
  };
}

/**
 * Check whether Supabase environment variables or runtime keys are configured.
 */
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

let browserClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

/**
 * Get or initialize the public browser Supabase client (using anon key).
 * Returns null if Supabase credentials are not configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }
  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return browserClient;
}

/**
 * Get or initialize the privileged server-side Supabase client (using Service Role Key).
 * CAUTION: Only invoke this on the server (API routes / server actions).
 * NEVER expose the service role client or key to client components.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const { url, serviceRoleKey, anonKey } = getSupabaseConfig();
  const keyToUse = serviceRoleKey || anonKey;
  if (!url || !keyToUse) {
    return null;
  }
  if (!adminClient) {
    adminClient = createClient(url, keyToUse, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminClient;
}

// ----------------------------------------------------
// Supabase Authentication Operations
// ----------------------------------------------------

export interface SupabaseAuthResult {
  success: boolean;
  user?: SupabaseUser | null;
  error?: string;
  session?: any;
}

/**
 * Sign up a new user directly in Supabase Auth.
 * Uses admin API if service role key is present to auto-confirm email for immediate login.
 */
export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata?: { name?: string; role?: string; avatar?: string }
): Promise<SupabaseAuthResult> {
  const admin = getSupabaseAdminClient();
  if (admin && (runtimeSupabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata || {},
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to create Supabase user" };
    }
  }

  // Fallback to public client
  const client = getSupabaseClient() || admin;
  if (!client) {
    return { success: false, error: "Supabase client not configured" };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
      },
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err?.message || "Supabase sign up error" };
  }
}

/**
 * Sign in existing user with Supabase Auth using email & password.
 */
export async function signInWithSupabase(
  email: string,
  password: string
): Promise<SupabaseAuthResult> {
  const client = getSupabaseClient() || getSupabaseAdminClient();
  if (!client) {
    return { success: false, error: "Supabase client not configured" };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err?.message || "Supabase login error" };
  }
}

/**
 * Admin: Create a new user with pre-confirmed email and custom attributes.
 */
export async function adminCreateSupabaseUser(
  email: string,
  password: string,
  metadata?: { name?: string; role?: string; avatar?: string; badge?: string }
): Promise<SupabaseAuthResult> {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return { success: false, error: "Supabase admin client not configured" };
  }

  try {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata || {},
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err?.message || "Admin user creation failed" };
  }
}

/**
 * Admin: Update user password or metadata in Supabase Auth.
 */
export async function adminUpdateSupabaseUser(
  userId: string,
  updates: { password?: string; email?: string; user_metadata?: Record<string, any> }
): Promise<{ success: boolean; error?: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return { success: false, error: "Supabase admin client not configured" };
  }

  try {
    const { error } = await admin.auth.admin.updateUserById(userId, updates);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Admin user update failed" };
  }
}

/**
 * Admin: Delete a user from Supabase Auth.
 */
export async function adminDeleteSupabaseUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return { success: false, error: "Supabase admin client not configured" };
  }

  try {
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Admin delete user failed" };
  }
}

/**
 * Admin: List all users from Supabase Auth.
 */
export async function adminListSupabaseUsers(): Promise<{ success: boolean; users: SupabaseUser[]; error?: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return { success: false, users: [], error: "Supabase admin client not configured" };
  }

  try {
    const { data, error } = await admin.auth.admin.listUsers();
    if (error) {
      return { success: false, users: [], error: error.message };
    }
    return { success: true, users: data.users || [] };
  } catch (err: any) {
    return { success: false, users: [], error: err?.message || "Failed to list Supabase users" };
  }
}

/**
 * Test connectivity to Supabase project.
 */
export async function testSupabaseConnectivity(): Promise<{
  connected: boolean;
  url: string;
  hasAnonKey: boolean;
  hasServiceRoleKey: boolean;
  authWorking: boolean;
  message: string;
  latencyMs?: number;
}> {
  const config = getSupabaseConfig();
  if (!config.url) {
    return {
      connected: false,
      url: "",
      hasAnonKey: false,
      hasServiceRoleKey: false,
      authWorking: false,
      message: "Supabase URL is not configured.",
    };
  }

  const startTime = Date.now();
  try {
    const healthUrl = `${config.url.replace(/\/$/, "")}/rest/v1/`;
    const res = await fetch(healthUrl, {
      headers: {
        apikey: config.anonKey || config.serviceRoleKey || "",
        Authorization: `Bearer ${config.serviceRoleKey || config.anonKey || ""}`,
      },
    });

    const latencyMs = Date.now() - startTime;
    const connected = res.ok || res.status === 401 || res.status === 404 || res.status === 200;

    let authWorking = false;
    const admin = getSupabaseAdminClient();
    if (admin) {
      try {
        const { error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
        authWorking = !error;
      } catch {
        authWorking = false;
      }
    }

    return {
      connected: res.status !== 502 && res.status !== 503,
      url: config.url,
      hasAnonKey: Boolean(config.anonKey),
      hasServiceRoleKey: Boolean(config.serviceRoleKey),
      authWorking,
      message: connected
        ? `Successfully connected to Supabase (${latencyMs}ms).`
        : `Supabase host responded with status ${res.status}.`,
      latencyMs,
    };
  } catch (err: any) {
    return {
      connected: false,
      url: config.url,
      hasAnonKey: Boolean(config.anonKey),
      hasServiceRoleKey: Boolean(config.serviceRoleKey),
      authWorking: false,
      message: `Failed to connect to Supabase: ${err?.message || "Network unreachable"}`,
      latencyMs: Date.now() - startTime,
    };
  }
}

// ----------------------------------------------------
// Storage Helpers
// ----------------------------------------------------

export interface StorageUploadOptions {
  bucket?: string;
  path: string;
  fileBuffer: Buffer | Uint8Array;
  contentType: string;
  upsert?: boolean;
}

/**
 * Upload a binary image or asset to Supabase Storage.
 * Returns the public URL of the uploaded asset, or null if Supabase is not configured.
 */
export async function uploadToSupabaseStorage({
  bucket = "places",
  path,
  fileBuffer,
  contentType,
  upsert = true,
}: StorageUploadOptions): Promise<string | null> {
  const client = getSupabaseAdminClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert,
    });

  if (error) {
    console.error(`Supabase Storage upload error in bucket '${bucket}':`, error);
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Retrieve public CDN URL
  const { data: publicUrlData } = client.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * Delete an asset from Supabase Storage by bucket and path.
 */
export async function deleteFromSupabaseStorage(
  bucket: string,
  path: string
): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client) {
    return false;
  }

  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`Supabase Storage delete error in bucket '${bucket}':`, error);
    return false;
  }
  return true;
}

/**
 * Get public URL for a given bucket and path.
 */
export function getSupabaseStoragePublicUrl(
  bucket: string,
  path: string
): string | null {
  const client = getSupabaseAdminClient() || getSupabaseClient();
  if (!client) return null;

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
