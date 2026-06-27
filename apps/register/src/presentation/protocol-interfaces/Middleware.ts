import type { HttpResponse } from './Http';

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>
}