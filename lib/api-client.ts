export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;
let inMemoryAuthToken: string | null = null;

export type BotType = "personal" | "business";

export interface BotInput {
  name: string;
  type: BotType;
  description: string;
  phoneNumber: string;
  language: string;
}

export type BotData = Partial<BotInput> & Pick<BotInput, "name">;

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
  const isFormData =
    typeof FormData !== "undefined" && options?.body instanceof FormData;
  const defaultHeaders: Record<string, string> = isFormData
    ? {}
    : {
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
      void finalHeaders;
    }
  } catch (e) {
    console.error(e);
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error [${response.status}]: ${url}`, errorText);

    let errorMessage = "Erro na comunicação com o servidor";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // For non-JSON, we use the generic message but log the status
    }
    throw new Error(errorMessage);
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
  login: (identifier: string, password: string) =>
    (async (identifier: string, password: string) => {
      const res: any = await apiCall("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });
      const token = extractTokenFromResponse(res);
      if (token) setAuthToken(token);
      return res;
    })(identifier, password),

  googleLogin: (
    idToken: string,
    intent: "login" | "register",
    termsAccepted = false,
  ) =>
    (async (
      idToken: string,
      intent: "login" | "register",
      termsAccepted: boolean,
    ) => {
      const res: any = await apiCall("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken, intent, termsAccepted }),
      });
      const token = extractTokenFromResponse(res);
      if (!token) {
        throw new Error("O servidor não retornou um token de autenticação.");
      }
      setAuthToken(token);
      return res;
    })(idToken, intent, termsAccepted),
  register: (data: {
    name: string;
    email: string;
    gender: "male" | "female" | "other";
    termsAccepted: boolean;
    password: string;
  }) =>
    apiCall("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  activateAccount: (email: string, code: string) =>
    (async (email: string, code: string) => {
      const res: any = await apiCall("/auth/activate", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      const token = extractTokenFromResponse(res);
      if (!token) {
        throw new Error("A conta foi ativada, mas não foi possível autenticar. Faça login para continuar.");
      }
      setAuthToken(token);
      return res;
    })(email, code),

  resendActivation: (email: string) =>
    apiCall("/auth/resend-activation", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  requestPasswordReset: (email: string) =>
    apiCall<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyPasswordResetCode: (email: string, code: string) =>
    apiCall<{ resetToken: string }>("/auth/verify-reset-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    }),

  resetPassword: (resetToken: string, password: string) =>
    apiCall<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ resetToken, password }),
    }),

  getMe: async () => {
    const res: any = await apiCall("/auth/me");
    return res?.user ?? res;
  },

  updateMe: async (data: {
    name: string;
    email: string;
    gender: "male" | "female" | "other";
  }) => {
    const res: any = await apiCall("/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.user ?? res;
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    apiCall<{ message: string }>("/auth/me/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  deleteAccount: (confirmation: string) =>
    apiCall<{ message: string }>("/auth/me", {
      method: "DELETE",
      body: JSON.stringify({ confirmation }),
    }),

  updatePlan: (plan: string) =>
    apiCall("/auth/me/plan", {
      method: "PUT",
      body: JSON.stringify({ plan }),
    }),
};

export const botApi = {
  list: () => apiCall("/bots"),

  create: (data: BotInput) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiCall("/bots", {
      method: "POST",
      body,
    });
  },

  get: (id: string) => apiCall<{ status: string; bot: BotData }>(`/bots/${id}`),

  update: (id: string, data: BotInput) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiCall(`/bots/${id}`, {
      method: "PUT",
      body,
    });
  },

  delete: (id: string) =>
    apiCall(`/bots/${id}`, {
      method: "DELETE",
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

export const productApi = {
  list: () => apiCall("/products"),

  create: (data: any) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiCall("/products", {
      method: "POST",
      body,
    });
  },

  get: (id: string) => apiCall(`/products/${id}`),

  update: (id: string, data: any) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiCall(`/products/${id}`, {
      method: "PUT",
      body,
    });
  },

  delete: (id: string) =>
    apiCall(`/products/${id}`, {
      method: "DELETE",
    }),
};
