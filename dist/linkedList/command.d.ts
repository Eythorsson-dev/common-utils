export interface Command {
    get id(): string;
    get active(): boolean;
    execute(): void;
}
