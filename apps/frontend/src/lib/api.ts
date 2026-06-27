/**
 * Clientes HTTP dos microsserviços.
 *
 * Em produção (atrás do nginx do CIn), o browser só enxerga a porta 80 do
 * domínio. Então as chamadas vão por path relativo:
 *   /fonoaudiologia/api/auth/...
 *   /fonoaudiologia/api/register/...
 *   /fonoaudiologia/api/historico/...
 * e o nginx faz o proxy_pass pro container certo.
 *
 * As VITE_* permitem sobrescrever isso em dev local se você quiser apontar
 * direto pras portas; o fallback é o path de produção.
 */
const AUTH_URL      = import.meta.env.VITE_AUTH_URL      ?? "/fonoaudiologia/api/auth";
const REGISTER_URL  = import.meta.env.VITE_REGISTER_URL  ?? "/fonoaudiologia/api/register";
const HISTORICO_URL = import.meta.env.VITE_HISTORICO_URL ?? "/fonoaudiologia/api/historico";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("cadus-auth");
    if (!raw) return null;
    return (JSON.parse(raw) as { state?: { token?: string } }).state?.token ?? null;
  } catch {
    return null;
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: unknown;
  public?: boolean;
}

async function request<T>(
  baseUrl: string,
  method: HttpMethod,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (!options.public) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const json = await res.json();
      message = json.erro ?? json.error ?? json.message ?? message;
    } catch { /* sem body */ }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function makeClient(baseUrl: string) {
  return {
    get:    <T>(path: string, opts?: RequestOptions) => request<T>(baseUrl, "GET", path, opts),
    post:   <T>(path: string, body: unknown, opts?: RequestOptions) => request<T>(baseUrl, "POST", path, { ...opts, body }),
    patch:  <T>(path: string, body: unknown, opts?: RequestOptions) => request<T>(baseUrl, "PATCH", path, { ...opts, body }),
    delete: <T>(path: string, opts?: RequestOptions) => request<T>(baseUrl, "DELETE", path, opts),
  };
}

export const authApi      = makeClient(AUTH_URL);
export const registerApi  = makeClient(REGISTER_URL);
export const historicoApi = makeClient(HISTORICO_URL);