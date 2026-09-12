import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read public credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Check whether Supabase environment variables are configured.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceRoleKey));
}

let browserClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

/**
 * Get or initialize the public browser Supabase client (using anon key).
 * Returns null if Supabase credentials are not configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
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
  const keyToUse = supabaseServiceRoleKey || supabaseAnonKey;
  if (!supabaseUrl || !keyToUse) {
    return null;
  }
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, keyToUse, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminClient;
}

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
