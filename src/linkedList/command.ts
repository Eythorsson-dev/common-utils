

export abstract class Command<TContext> {
    abstract get id(): string

    #context: TContext
    get context(): TContext { return this.#context }

    abstract get active(): boolean

    constructor(context: TContext) {
        this.#context = context;
    }

    abstract execute(): void
}