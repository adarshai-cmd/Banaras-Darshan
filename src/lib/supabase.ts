import { createClient, SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Runtime config cache (can be augmented dynamically from SiteSetting if configured via Admin)
let runtimeSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
let runtimeSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";
let runtimeSupabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

export function setRuntimeSupabaseCredentials(url: string, anonKey: string, serviceKey?: string) {
  runtimeSupabaseUrl = url.trim();
  runtimeSupabaseAnonKey = anonKey.trim();
  if (serviceKey !== undefined) {
    runtimeSupabaseServiceKey = serviceKey.trim();
  }
  cachedBrowserClient = null;
  cachedAdminClient = null;
}

export function getSupabaseConfig() {
  const url =
    runtimeSupabaseUrl ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const anonKey =
    runtimeSupabaseAnonKey ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";
  const serviceRoleKey =
    runtimeSupabaseServiceKey ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";
  return {
    url,
    anonKey,
    serviceRoleKey,
    isConfigured: Boolean(url && (anonKey || serviceRoleKey)),
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

let cachedBrowserClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }
  if (!cachedBrowserClient) {
    if (typeof window !== "undefined") {
      cachedBrowserClient = createBrowserClient(url, anonKey);
    } else {
      cachedBrowserClient = createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
  }
  return cachedBrowserClient;
}

export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server component read only
        }
      },
    },
  });
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  const { url, serviceRoleKey, anonKey } = getSupabaseConfig();
  const keyToUse = serviceRoleKey || anonKey;
  if (!url || !keyToUse) {
    return null;
  }
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(url, keyToUse, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedAdminClient;
}

export interface SupabaseAuthResult {
  success: boolean;
  user?: SupabaseUser | null;
  error?: string;
  code?: string;
  session?: any;
}

export interface SupabaseProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  role: string;
  badge?: string | null;
  reputation?: number;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata?: { name?: string; role?: string; avatar?: string }
): Promise<SupabaseAuthResult> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return { success: false, error: "Supabase is not configured", code: "not_configured" };
  }

  const admin = getSupabaseAdminClient();
  const hasServiceKey = Boolean(config.serviceRoleKey);

  if (admin && hasServiceKey) {
    try {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata || {},
      });
      if (error) {
        return { success: false, error: error.message, code: (error as any).code };
      }
      if (data.user) {
        await upsertSupabaseProfile({
          id: data.user.id,
          email: data.user.email || email,
          name: metadata?.name || email.split("@")[0],
          role: metadata?.role || "USER",
          badge: "New Explorer",
        });
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to create user in Supabase Auth" };
    }
  }

  const client = getSupabaseClient() || admin;
  if (!client) {
    return { success: false, error: "Supabase client unavailable" };
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
      return { success: false, error: error.message, code: (error as any).code };
    }
    if (data.user) {
      await upsertSupabaseProfile({
        id: data.user.id,
        email: data.user.email || email,
        name: metadata?.name || email.split("@")[0],
        role: metadata?.role || "USER",
        badge: "New Explorer",
      });
    }
    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err?.message || "Supabase sign up error" };
  }
}

export async function signInWithSupabase(
  email: string,
  password: string
): Promise<SupabaseAuthResult> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return { success: false, error: "Supabase client not configured", code: "not_configured" };
  }

  const client = getSupabaseClient() || getSupabaseAdminClient();
  if (!client) {
    return { success: false, error: "Supabase client not initialized", code: "not_initialized" };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      const msg = error.message.toLowerCase();
      let code = "invalid_credentials";
      if (msg.includes("confirm") || msg.includes("not confirmed")) {
        code = "email_not_confirmed";
      } else if (msg.includes("not found") || msg.includes("no user")) {
        code = "user_not_found";
      }
      return { success: false, error: error.message, code };
    }
    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err?.message || "Supabase login network error", code: "network_error" };
  }
}

export async function signOutWithSupabase(): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: true };
  try {
    const { error } = await client.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function fetchSupabaseProfile(userId: string): Promise<SupabaseProfile | null> {
  const client = getSupabaseAdminClient() || getSupabaseClient();
  if (!client) return null;

  try {
    const { data: profile, error: profileErr } = await client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!profileErr && profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name || profile.full_name || profile.email?.split("@")[0] || "Explorer",
        avatar_url: profile.avatar_url,
        role: profile.role || "USER",
        badge: profile.badge || "New Explorer",
        reputation: profile.reputation ?? 10,
        bio: profile.bio || null,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      };
    }

    const { data: userRow, error: userErr } = await client
      .from("User")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!userErr && userRow) {
      return {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name || userRow.email?.split("@")[0] || "Explorer",
        avatar_url: userRow.avatar,
        role: userRow.role || "USER",
        badge: userRow.badge || "New Explorer",
        reputation: userRow.reputation ?? 10,
        bio: userRow.bio || null,
        created_at: userRow.createdAt,
        updated_at: userRow.updatedAt,
      };
    }

    return null;
  } catch (err) {
    console.warn("Notice: fetchSupabaseProfile error:", err);
    return null;
  }
}

export async function upsertSupabaseProfile(profile: SupabaseProfile): Promise<boolean> {
  const client = getSupabaseAdminClient() || getSupabaseClient();
  if (!client) return false;

  try {
    await client.from("profiles").upsert(
      {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatar_url || null,
        role: profile.role || "USER",
        badge: profile.badge || "New Explorer",
        reputation: profile.reputation ?? 10,
        bio: profile.bio || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    return true;
  } catch (err) {
    console.warn("Notice: upsertSupabaseProfile error:", err);
    return false;
  }
}

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
    if (data.user) {
      await upsertSupabaseProfile({
        id: data.user.id,
        email: data.user.email || email,
        name: metadata?.name || email.split("@")[0],
        role: metadata?.role || "USER",
        badge: metadata?.badge || "New Explorer",
      });
    }
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err?.message || "Admin user creation failed" };
  }
}

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
    const healthUrl = config.url.replace(/\/$/, "") + "/rest/v1/";
    const res = await fetch(healthUrl, {
      headers: {
        apikey: config.anonKey || config.serviceRoleKey || "",
        Authorization: "Bearer " + (config.serviceRoleKey || config.anonKey || ""),
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
        ? "Successfully connected to Supabase (" + latencyMs + "ms)."
        : "Supabase host responded with status " + res.status + ".",
      latencyMs,
    };
  } catch (err: any) {
    return {
      connected: false,
      url: config.url,
      hasAnonKey: Boolean(config.anonKey),
      hasServiceRoleKey: Boolean(config.serviceRoleKey),
      authWorking: false,
      message: "Failed to connect to Supabase: " + (err?.message || "Network unreachable"),
      latencyMs: Date.now() - startTime,
    };
  }
}

export interface StorageUploadOptions {
  bucket?: string;
  path: string;
  fileBuffer: Buffer | Uint8Array;
  contentType: string;
  upsert?: boolean;
}

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
    console.error("Supabase Storage upload error in bucket: " + bucket, error);
    throw new Error("Storage upload failed: " + error.message);
  }

  const { data: publicUrlData } = client.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

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
    console.error("Supabase Storage delete error in bucket: " + bucket, error);
    return false;
  }
  return true;
}

export function getSupabaseStoragePublicUrl(
  bucket: string,
  path: string
): string | null {
  const client = getSupabaseAdminClient() || getSupabaseClient();
  if (!client) return null;

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
