export declare abstract class Command<TContext, TId> {
    #private;
    abstract get id(): TId;
    get context(): TContext;
    abstract get active(): boolean;
    constructor(context: TContext);
    abstract execute(): void;
}
