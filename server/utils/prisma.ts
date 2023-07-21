import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient;

export function usePrisma() {
  if (!_prisma) {
    _prisma = new PrismaClient();
  }
  return _prisma;
}

export function excludeFields<
  T extends { [s: string]: unknown } | ArrayLike<unknown>,
  Key extends keyof T
>(data: T, keys: Key[]): Omit<T, Key> {
  return Object.fromEntries(
    Object.entries(data).filter(([key]: any) => !keys.includes(key))
  ) as Omit<T, Key>;
}
