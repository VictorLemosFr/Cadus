import { describe, test } from "vitest";
import { type Either, failure, success } from "./Either";


describe("EitherUtils", () => {
    test("should create an error Either", () => {
        const errorEither: Either<string, number> = failure("This is an error");
    });
    test("should create a success Either", () => {
        const successEither: Either<string, number> = success(42);
    });
});