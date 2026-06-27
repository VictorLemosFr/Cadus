import type { ControllerError } from "./ControllerError";

export class ServerError extends Error implements ControllerError {
    constructor (reason: string) {
        super(`Server error: ` + reason + `.`);
    }
}