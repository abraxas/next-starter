export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K | K[],
): Omit<T, K> {
  const keysArray = Array.isArray(keys) ? keys : [keys]; // Normalize keys to an array
  const result = {} as Omit<T, K>;
  Object.keys(obj).forEach((key) => {
    if (!keysArray.includes(key as K)) {
      (result as T)[key as keyof T] = obj[key as keyof T];
    }
  });
  return result as Omit<T, K>;
}
