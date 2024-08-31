export function Singleton<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  return class extends constructor {
    private static _instance: T;

    static get instance(): T {
      if (!this._instance) {
        this._instance = new constructor() as T;
      }
      return this._instance;
    }
  };
}

export function Transient<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  return class extends constructor {
    private static _instance: T;

    static get instance(): T {
      return new constructor() as T;
    }
  };
}
