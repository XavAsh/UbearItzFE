export async function simulateNetwork<T>(data: T, delayMs = 350): Promise<T> {
  await new Promise((r) => setTimeout(r, delayMs));
  return structuredClone(data);
}

export function notFound(message = "Not found"): never {
  throw new Error(message);
}
