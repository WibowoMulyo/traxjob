export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(message: string, status: number, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      (body && typeof body.error === "string" && body.error) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body?.details);
  }

  return body as T;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export const authApi = {
  me: () => apiRequest<{ user: AuthUser }>("/auth/me"),
  register: (data: RegisterInput) =>
    apiRequest<{ user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (email: string, password: string) =>
    apiRequest<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiRequest<null>("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    apiRequest<{ ok: true }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    apiRequest<{ ok: true }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
};
