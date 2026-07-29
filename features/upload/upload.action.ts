import { authenticate } from "@/features/auth/auth.helper";
import { ProfileActionDTO } from "@/features/profile/profile.dto";
import { AppResponse, MakeError } from "@/lib/api/response";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
