export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// Helper function to convert relative preview URL to full URL
export function getPreviewUrl(previewUrl: string | null | undefined): string | null {
  if (!previewUrl) return null
  // If already a full URL, return as is
  if (previewUrl.startsWith('http://') || previewUrl.startsWith('https://')) {
    return previewUrl
  }
  // If relative path, prepend API_URL
  return `${API_URL}${previewUrl.startsWith('/') ? '' : '/'}${previewUrl}`
}

const TOKEN_KEY = 'qb_token'
export function setToken(token: string) { localStorage.setItem(TOKEN_KEY, token) }
export function getToken(): string | null { return localStorage.getItem(TOKEN_KEY) }
export function clearToken() { localStorage.removeItem(TOKEN_KEY) }

export function getUserIdFromToken(): number | null {
  const token = getToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId ?? null
  } catch {
    return null
  }
}

function authHeaders() {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function apiGet(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers || {}) },
    ...init,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.message || `GET ${path} failed: ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function apiPost(path: string, body: unknown, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers || {}) },
    body: JSON.stringify(body),
    ...init,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.message || `POST ${path} failed: ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function apiPut(path: string, body: unknown, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers || {}) },
    body: JSON.stringify(body),
    ...init,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.message || `PUT ${path} failed: ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function apiDelete(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers || {}) },
    ...init,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.message || `DELETE ${path} failed: ${res.status}`
    throw new Error(msg)
  }
  return data
}


