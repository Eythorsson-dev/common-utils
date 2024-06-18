import { UndoAPI } from '../undoManager';

export type SaveAction = "Insert" | "Update" | "Delete";
export type SaveData<Data extends object> = {
    Action: SaveAction;
    Data: Data;
};
export interface SaveOptionsData<Data extends object> {
    items: SaveData<Data>[];
}
export interface SaveOptions<Data extends object, TSaveOptionsData extends SaveOptionsData<Data> = SaveOptionsData<Data>> {
    UndoData: TSaveOptionsData;
    Data: TSaveOptionsData;
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
export declare class SaveManager<Data extends object, TSaveOptionsData extends SaveOptionsData<Data> = SaveOptionsData<Data>, TSaveOptions extends SaveOptions<Data, TSaveOptionsData> = SaveOptions<Data, TSaveOptionsData>, TSaveManagerOptions extends SaveManagerOptions<Data, TSaveOptionsData> = SaveManagerOptions<Data, TSaveOptionsData>> implements SaveAPI<Data> {
    private UndoAPI;
    private BeforeChanged;
    private OnChanged;
    private Insert;
    private Update;
    private Delete;
    constructor(options: TSaveManagerOptions);
    CanUndo(): boolean;
    Undo(): void;
    CanRedo(): boolean;
    Redo(): void;
    get HistoryIndex(): number;
    Save(data: TSaveOptions): void;
    private Execute;
}
