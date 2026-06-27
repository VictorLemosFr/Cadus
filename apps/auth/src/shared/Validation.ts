import { type Either, failure, success } from "./Either";

export class Validation {
    static combine(toValidate: Record<string, Either<Error,any>>): Either<Error[], any>{
        const errors: Error[] = [];
        let result: any = {};

        for (let [key, value] of Object.entries(toValidate)) {
            if (value.isError()) {
                errors.push(value.value);
            } else {
                result = {...result,[key]: value.value}
            }
        }

        return errors.length > 0 ? failure(errors) : success(result);
    }
}