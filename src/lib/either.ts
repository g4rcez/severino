type Left<L> = { left: L; right?: never };

type Right<R> = { left?: never; right: R };

type Either<L, R> = NonNullable<Left<L> | Right<R>>;

class EitherError extends Error {}

export const Either = <L, R>({ left, right }: Either<L, R>): NonNullable<L | R> => {
    if (right !== undefined && left !== undefined) {
        throw new EitherError(
            `Received both left and right values at runtime when opening an Either\nLeft: ${JSON.stringify(
                left,
            )}\nRight: ${JSON.stringify(right)}`,
        );
    }
    if (left !== undefined) {
        return left as NonNullable<L>;
    }
    if (right !== undefined) {
        return right as NonNullable<R>;
    }
    throw new EitherError(`Received no left or right values at runtime when opening Either`);
};

Either.isLeft = <L, R>(e: Either<L, R>): e is Left<L> => e.left !== undefined;

Either.isRight = <L, R>(e: Either<L, R>): e is Right<R> => e.right !== undefined;

Either.left = <L>(left: L): Left<L> => ({ left });

Either.right = <R>(right: R): Right<R> => ({ right });
