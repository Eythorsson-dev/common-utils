export interface Item<T> {
    get id(): string;
    get parentItem(): T | undefined;
    get firstChildItem(): T | undefined;
    get nextItem(): T | undefined;
    get previousItem(): T | undefined;
}
export interface ItemData {
    id: string;
    parentId?: string;
    firstChildId?: string;
    nextId?: string;
    previousId?: string;
}
export interface ActionableItem<TData> extends Item<ActionableItem<TData>> {
    update(data: TData): void;
    remove(): void;
    /**
    * Inserts the item after the last child
    */
    append(item: ActionableItem<TData>): void;
    /**
     * Inserts the item just before this item
     */
    before(item: ActionableItem<TData>): void;
    /**
     * Inserts the item just after this item
     */
    after(item: ActionableItem<TData>): void;
}
/** @internal */
export declare function render(...items: ItemData[]): Item<any>[];
export declare abstract class ItemElement<TData extends {
    id: string;
}, TItem extends ItemElement<TData, TItem>> implements ActionableItem<TData> {
    #private;
    get id(): string;
    get parentItem(): TItem | undefined;
    set parentItem(item: TItem | undefined);
    get firstChildItem(): TItem | undefined;
    set firstChildItem(item: TItem | undefined);
    get nextItem(): TItem | undefined;
    set nextItem(item: TItem | undefined);
    get previousItem(): TItem | undefined;
    set previousItem(item: TItem | undefined);
    abstract update(data: TData): void;
    abstract render(data: TData): HTMLElement;
    get target(): HTMLElement;
    remove(): void;
    append(item: TItem): void;
    before(item: TItem): void;
    after(item: TItem): void;
    constructor(data: TData);
}
