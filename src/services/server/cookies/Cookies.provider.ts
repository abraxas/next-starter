import { cookies } from "next/headers";

export type ICookiesProvider =
  | {
      get: (key: string) => string | undefined;
      canSet: false;
    }
  | {
      get: (key: string) => string | undefined;
      set: (key: string, value: string) => void;
      canSet: true;
    };

export class ReadonlyCookiesProvider {
  protected cookies: ReturnType<typeof cookies>;
  constructor() {
    this.cookies = cookies();
  }
  get(key: string): string | undefined {
    const result = this.cookies.get(key);
    return result?.value;
  }

  get canSet() {
    return false;
  }
}

export class CookiesProvider extends ReadonlyCookiesProvider {
  set(key: string, value: string) {
    this.cookies.set(key, value);
  }

  get canSet() {
    return true;
  }
}

export const cookiesProvider = new CookiesProvider() as ICookiesProvider;
export const readonlyCookiesProvider =
  new ReadonlyCookiesProvider() as ICookiesProvider;
