const BASE = import.meta.env.VITE_API_BASE ?? "";

export type ApiErrorBody = {
  success: false;
  error: { code?: string; message: string; details?: unknown };
};

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  const h = new Headers(headers);
  h.set("Content-Type", "application/json");
  if (token) h.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE}${path}`, { ...rest, headers: h });
  if (res.status === 204) {
    return {} as T;
  }
  const body = (await parseJson(res)) as T | ApiErrorBody;

  if (!res.ok) {
    const err = body as ApiErrorBody;
    const msg =
      err && typeof err === "object" && "error" in err && err.error?.message
        ? err.error.message
        : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return body as T;
}
