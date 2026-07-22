import { Database } from "@/lib/supabase/database.types";
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

let clientInstance: SupabaseClient<Database>;

export const getSupabaseBrowserClient = () => {
   if (!clientInstance) {
      clientInstance = createBrowserClient<Database>(
         supabaseUrl,
         supabaseAnonKey
      );
   }
   return clientInstance;
};
