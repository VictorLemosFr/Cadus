import type { Request, Response } from "express";
import type { HttpRequest, HttpResponse } from "../../presentation/protocol-interfaces/Http";
import type { BaseController } from "../../presentation/controllers/BaseController";

export const adaptRoute = (controller: BaseController) => {
    return async (req: Request, res: Response): Promise<void> => {
        const httpRequest: HttpRequest = {
            body: req.body,
            params: req.params as Record<string, string>,
            query: req.query as Record<string, string>,
        };
        const httpResponse: HttpResponse = await controller.handle(httpRequest);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    };
};