export async function simulateNetwork<T>(data: T, delayMs = 350): Promise<T> {
  await new Promise((r) => setTimeout(r, delayMs));
  return structuredClone(data);
}

export function notFound(message = "Not found"): never {
  throw new Error(message);
}

export type ApiProblemDetails = {
  type: string;
  title: string;
  detail: string;
  status: number;
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function getBrowserCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean; token?: string } = {},
): Promise<T> {
  const { auth, token, headers, ...rest } = options;
  const finalHeaders = new Headers(headers);

  if (auth) {
    const t = token ?? getBrowserCookie("auth-token");
    if (t) finalHeaders.set("Authorization", `Bearer ${t}`);
  }

  if (!finalHeaders.has("Content-Type") && rest.body && typeof rest.body === "string") {
    finalHeaders.set("Content-Type", "application/json");
  }

  const base =
    typeof window === "undefined"
      ? (process.env.UBEARITZ_API_ORIGIN ?? process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://127.0.0.1:3001")
      : "";

  const url = typeof window === "undefined" ? `${base}${path}` : `/api${path}`;

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
  });

  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : undefined;

  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && body !== null && "detail" in body && typeof (body as any).detail === "string"
        ? (body as any).detail
        : res.statusText) || "Request failed";
    throw new ApiError(msg, res.status, body);
  }

  return body as T;
}
