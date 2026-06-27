export type Either<L, R> = Failure<L, R> | Success<L, R>;

export class Failure<L, R> {
    readonly value: L;

    constructor(value: L){
        this.value = value;
    }

    isError(): this is Failure<L, R> {
        return true;
    }

    isSuccess(): this is Success<L, R> {
        return false;
    }
}

export class Success<L, R> {
    readonly value: R;

    constructor(value: R){
        this.value = value;
    }

    isError(): this is Failure<L, R> {
        return false;
    }

    isSuccess(): this is Success<L, R> {
        return true;
    }
}


export const failure = <L, R = any>(l: L): Either<L, R> => {
  return new Failure<L, R>(l)
}

export const success = <L, R>(r: R): Either<L, R> => {
  return new Success<L, R>(r)
}