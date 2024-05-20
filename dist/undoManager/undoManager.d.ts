export interface ExecuteState {
    Undo(): void;
    BeforeUndo?(): void;
    OnUndo?(): void;
    Action(): void;
    BeforeAction?(): void;
    OnAction?(): void;
}
export interface UndoAPI {
    get HistoryIndex(): number;
    Execute(state: ExecuteState): void;
    CanUndo(): boolean;
    Undo(): void;
    CanRedo(): boolean;
    Redo(): void;
}
export interface UndoOptions {
    OnAction?: (() => void);
}
export declare function UndoManager(options?: UndoOptions): UndoAPI;
