export interface Country {
  countryCode: string;
  countryName: string;
}

export interface UserPayload {
  name: string;
  surname: string;
  email: string;
  country: Country;
  lastAccess: string; // Date
}

export type User = Omit<UserPayload, 'lastAccess'> & { lastAccess: Date };

export type ApiError = Record<string, unknown>;

export type ApiResult<T> = { data: T } | { error: ApiError };
