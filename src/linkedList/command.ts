

export abstract class Command {
    #id: string
    get id(): string { return this.#id }
    abstract get active(): boolean

    constructor(id: string) {
        this.#id = id;
    }
    
    abstract execute(): void
}