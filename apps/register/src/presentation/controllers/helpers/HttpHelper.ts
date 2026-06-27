import type { HttpResponse } from "../../protocol-interfaces/Http";
import { ServerError } from "../errors/ServerError";

// Responses 2XX
export const created = (data: any): HttpResponse => ({
    statusCode: 201,
    body: data,
});

export const ok = (data: any): HttpResponse => ({
    statusCode: 200,
    body: data,
});

export const noContent = (): HttpResponse => ({
    statusCode: 204,
    body: null,
});

// Responses 4XX
export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error.message,
});

export const notFound = (error: Error): HttpResponse => ({
    statusCode: 404,
    body: error.message,
});

export const forbidden = (error: Error): HttpResponse => ({
    statusCode: 403,
    body: error,
});

export const conflict = (error: Error): HttpResponse => ({
    statusCode: 409,
    body: { message: error.message },
});

// Responses 5XX
export const serverError = (reason: string): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(reason),
});