export declare abstract class Command<TContext> {
    #private;
    abstract get id(): string;
    get context(): TContext;
    abstract get active(): boolean;
    constructor(context: TContext);
    abstract execute(): void;
}
