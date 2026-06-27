export interface HttpResponse {
    statusCode: number;
    body: any;
}

export interface HttpRequest {
    body?: any;
    params?: Record<string, string>;
    query?: Record<string, string>;
}