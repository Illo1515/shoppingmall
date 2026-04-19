const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Super lightweight Supabase Fetch helper
 * @param {string} table - Table name
 * @param {object} options - { method, query, body, isAdmin, count }
 */
export async function supabaseFetch(table, { method = 'GET', query = '', body = null, isAdmin = false, count = null } = {}) {
  const key = isAdmin ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY;
  let url = `${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`;
  
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  };

  if (count) {
    headers['Prefer'] = `count=${count}`;
  }

  if (method !== 'GET') {
    const prefer = headers['Prefer'] ? `${headers['Prefer']},return=representation` : 'return=representation';
    headers['Prefer'] = prefer;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    cache: 'no-store'
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`Supabase Fetch Error (${table}):`, error);
    return { data: null, error };
  }

  const data = await response.json();
  let totalCount = null;
  if (count) {
    const range = response.headers.get('content-range');
    if (range) {
      totalCount = parseInt(range.split('/')[1]);
    }
  }

  return { data, error: null, count: totalCount };
}
