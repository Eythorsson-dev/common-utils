import { IconElement } from "../icon";


export abstract class Command<TContext, TId> {
    abstract get id(): TId

    abstract get name(): string

    abstract get icon(): IconElement

    #context: TContext
    get context(): TContext { return this.#context }

    abstract get active(): boolean

    constructor(context: TContext) {
        this.#context = context;
    }

    abstract execute(): void
}