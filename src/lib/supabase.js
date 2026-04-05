import { createClient } from '@supabase/supabase-js';

// 이 클라이언트는 어드민 권한(Service Role Key)을 사용하므로, 
// **절대 클라이언트 뷰(컴포넌트)로 유출되어서는 안 되며 서버 API에서만 사용**해야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
