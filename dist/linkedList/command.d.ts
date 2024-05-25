export declare abstract class Command<TContext> {
    #private;
    get id(): string;
    get context(): TContext;
    abstract get active(): boolean;
    constructor(id: string, context: TContext);
    abstract execute(): void;
}
