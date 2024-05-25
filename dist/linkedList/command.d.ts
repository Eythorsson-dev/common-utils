export declare abstract class Command {
    #private;
    get id(): string;
    abstract get active(): boolean;
    constructor(id: string);
    abstract execute(): void;
}
