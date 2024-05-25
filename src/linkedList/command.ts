

export abstract class Command<TContext> {
    #id: string
    get id(): string { return this.#id }

    #context: TContext
    get context(): TContext { return this.#context }

    abstract get active(): boolean

    constructor(id: string, context: TContext) {
        this.#id = id;
        this.#context = context;
    }

    abstract execute(): void
}