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
    OnAction?: (() => void)
}

export function UndoManager(options?: UndoOptions): UndoAPI {
    const history: {
        Undo(): void,
        BeforeUndo?(): void,
        OnUndo?(): void,

        Redo(): void,
        BeforeRedo?(): void,
        OnRedo?(): void
    }[] = [];
    var historyIndex: number = -1;

    const OnAction = options?.OnAction ?? (() => { })

    function Undo(): void {
        if (!CanUndo()) return;

        const state = history[historyIndex];
        historyIndex--;

        state.BeforeRedo?.()
        state.Undo()
        state.OnUndo?.()
        OnAction();
    }

    function Redo(): void {
        if (!CanRedo()) return;

        historyIndex++;
        var state = history[historyIndex];

        state.BeforeRedo?.()
        state.Redo()
        state.OnRedo?.()
        OnAction();
    }

    function Execute(state: ExecuteState): void {
        if (historyIndex < history.length - 1)
            history.splice(historyIndex, history.length - historyIndex);

        history.push({
            Undo: () => state.Undo(),
            BeforeUndo: () => state.BeforeUndo?.(),
            OnUndo: () => state.OnUndo?.(),

            Redo: () => state.Action(),
            BeforeRedo: () => state.BeforeAction?.(),
            OnRedo: () => state.OnAction?.(),
        });

        historyIndex = history.length - 1;
        state.BeforeAction?.();
        state.Action();
        state.OnAction?.();
        OnAction();
    }

    function CanRedo(): boolean {
        return historyIndex < history.length - 1
    }
    function CanUndo(): boolean {
        return historyIndex >= 0
    }


    return {
        get HistoryIndex(): number { return historyIndex },
        //AddHistory,
        Execute,
        Undo,
        Redo,
        CanUndo,
        CanRedo
    }
}