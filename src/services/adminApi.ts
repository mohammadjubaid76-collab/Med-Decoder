import { auth } from '../firebase/firebase';

async function getBearerToken(forceRefresh = true): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken(forceRefresh);
}

export async function adminApiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = await getBearerToken(true);
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, { ...init, headers });
  let body: any = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(body?.error || `Admin request failed (${response.status})`);
  }
  return body as T;
}
