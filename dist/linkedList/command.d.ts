import { IconElement } from '../icon';

export declare abstract class Command<TContext, TId> {
    #private;
    abstract get id(): TId;
    abstract get name(): string;
    abstract get icon(): IconElement;
    get context(): TContext;
    abstract get active(): boolean;
    constructor(context: TContext);
    abstract execute(): void;
}
