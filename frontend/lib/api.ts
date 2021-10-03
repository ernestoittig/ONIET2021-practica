import { User, UserPayload } from '@lib/payloads';

// TODO: Implementar funciones de API

export function getUser(): Promise<User | null> {
  const apiResult: UserPayload = {
    name: 'John',
    surname: 'Doe',
    email: 'example@example.com',
    country: { countryCode: 'ar', countryName: 'Argentina' },
    lastAccess: '2021-10-03T20:09:31.773Z',
  };
  const transformed: User = { ...apiResult } as unknown as User;
  transformed.lastAccess = new Date(apiResult.lastAccess);
  return Promise.resolve(transformed);
}

export function logIn(email: string, password: string): Promise<User> {
  return getUser().then((v) => v!);
}

export function logOut(): Promise<void> {
  return Promise.resolve();
}
