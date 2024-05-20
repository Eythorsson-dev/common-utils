import { UndoManager, type UndoAPI } from "../undoManager";

export type SaveAction = "insert" | "update" | "delete";

export type SaveData<Data extends object> = {
    Action: SaveAction;
    Data: Data;
};

export interface SaveOptionsData<Data extends object> {
    items: SaveData<Data>[]
}

export interface SaveOptions<Data extends object, TSaveOptionsData extends SaveOptionsData<Data> = SaveOptionsData<Data>> {
    UndoData: TSaveOptionsData,
    Data: TSaveOptionsData,
}

export interface SaveAPI<Data extends object, TSaveOptions extends SaveOptions<Data> = SaveOptions<Data>> extends Omit<UndoAPI, "Execute"> {
    Save(data: TSaveOptions): void;
}

export interface SaveManagerOptions<Data extends object, TSaveOptionsData extends SaveOptionsData<Data> = SaveOptionsData<Data>> {
    BeforeChanged?(data: TSaveOptionsData): void;
    OnChanged(data: TSaveOptionsData): void;

    Insert(data: Data): void;
    Update(data: Data): void;
    Delete(data: Data): void;
}

export class SaveManager<
    Data extends object,
    TSaveOptionsData extends SaveOptionsData<Data> = SaveOptionsData<Data>,
    TSaveOptions extends SaveOptions<Data, TSaveOptionsData> = SaveOptions<Data, TSaveOptionsData>,
    TSaveManagerOptions extends SaveManagerOptions<Data, TSaveOptionsData> = SaveManagerOptions<Data, TSaveOptionsData>
> implements SaveAPI<Data> {

    private UndoAPI: UndoAPI;
    private BeforeChanged: ((data: TSaveOptionsData) => void);
    private OnChanged: ((data: TSaveOptionsData) => void);
    private Insert: ((data: Data) => void);
    private Update: ((data: Data) => void);
    private Delete: ((data: Data) => void);

    constructor(options: TSaveManagerOptions) {
        this.UndoAPI = UndoManager();
        this.BeforeChanged = options.BeforeChanged ?? (() => { });
        this.OnChanged = options.OnChanged;
        this.Insert = options.Insert;
        this.Update = options.Update;
        this.Delete = options.Delete;
    }

    CanUndo(): boolean { return this.UndoAPI.CanUndo(); }
    Undo(): void { this.UndoAPI.Undo(); }

    CanRedo(): boolean { return this.UndoAPI.CanRedo(); }
    Redo(): void { this.UndoAPI.Redo(); }

    get HistoryIndex(): number  { return this.UndoAPI.HistoryIndex; }


    Save(data: TSaveOptions): void {
        if (!data?.Data || !data?.UndoData) throw new Error("Invalid data or undoData");

        this.UndoAPI.Execute({
            Undo: () => { this.Execute(data.UndoData); },
            BeforeUndo: () => { this.BeforeChanged(data.UndoData) },
            OnUndo: () => { this.OnChanged(data.UndoData) },

            Action: () => { this.Execute(data.Data); },
            BeforeAction: () => { this.BeforeChanged(data.Data) },
            OnAction: () => { this.OnChanged(data.Data) }
        });
    }

    private Execute(data: SaveOptionsData<Data>): void {

        data.items.forEach(x => ({ "insert": this.Insert, "update": this.Update, "delete": this.Delete, })[x.Action](x.Data))
    }
}
