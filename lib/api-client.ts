export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
let inMemoryAuthToken: string | null = null;

export function setAuthToken(token: string | null) {
  inMemoryAuthToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") ?? inMemoryAuthToken;
  }
  return inMemoryAuthToken;
}

export function clearAuthToken() {
  setAuthToken(null);
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const auth = getAuthToken();
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (auth) defaultHeaders["Authorization"] = `Bearer ${auth}`;
  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...((options && (options.headers as Record<string, string>)) || {}),
    },
    ...options,
  });

  try {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      const finalHeaders = {
        ...defaultHeaders,
        ...((options && (options.headers as Record<string, string>)) || {}),
      };
    }
  } catch (e) {
    console.error(e);
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

function extractTokenFromResponse(res: any): string | null {
  if (!res) return null;
  return (
    res.token ||
    res.accessToken ||
    res.data?.token ||
    res.data?.accessToken ||
    null
  );
}

export const authApi = {
  login: (email: string, password: string) =>
    (async (email: string, password: string) => {
      const res: any = await apiCall("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const token = extractTokenFromResponse(res);
      if (token) setAuthToken(token);
      return res;
    })(email, password),

  register: (
    name: string,
    email: string,
    phone: string,
    country: string,
    city: string,
    gender: string,
    termsAccepted: boolean,
    password: string,
  ) =>
    apiCall("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        phone,
        country,
        city,
        gender,
        termsAccepted,
        password,
      }),
    }),

  activateAccount: (email: string, code: string) =>
    (async (email: string, code: string) => {
      const res: any = await apiCall("/auth/activate", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      const token = extractTokenFromResponse(res);
      if (token) setAuthToken(token);
      return res;
    })(email, code),

  resendActivation: (email: string) =>
    apiCall("/auth/resend", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  getMe: () => apiCall("/auth/me"),

  updateMe: (name: string, email: string) =>
    apiCall("/auth/me", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    }),

  updatePlan: (plan: string) =>
    apiCall("/auth/me/plan", {
      method: "PUT",
      body: JSON.stringify({ plan }),
    }),
};

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

  toggle: (id: string) =>
    apiCall(`/bots/${id}/toggle`, {
      method: "PATCH",
    }),
};

export const planApi = {
  list: () => apiCall("/plans"),
  select: (planName: string, status?: string) =>
    apiCall("/plans/select", {
      method: "POST",
      body: JSON.stringify({ planName, status }),
    }),
};
