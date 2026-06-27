import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";

export interface BaseController {
    handle (req: HttpRequest) : Promise<HttpResponse>;
}