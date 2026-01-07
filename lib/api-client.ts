// API client for communicating with backend
// Ready for integration with your backend endpoints

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

export const authApi = {
  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  activateAccount: (token: string) =>
    apiCall("/auth/activate", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  getMe: () => apiCall("/auth/me"),
}

export const botApi = {
  list: () => apiCall("/bots"),

  create: (data: any) =>
    apiCall("/bots", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  get: (id: string) => apiCall(`/bots/${id}`),

  update: (id: string, data: any) =>
    apiCall(`/bots/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/bots/${id}`, {
      method: "DELETE",
    }),

  toggle: (id: string, active: boolean) =>
    apiCall(`/bots/${id}/toggle`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    }),
}

export const planApi = {
  list: () => apiCall("/plans"),
  select: (planId: string) =>
    apiCall("/plans/select", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),
}
