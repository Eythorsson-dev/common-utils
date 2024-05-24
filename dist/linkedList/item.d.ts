export interface Item<TItem, TData> {
    get id(): string;
    get parentItem(): TItem | undefined;
    get firstChildItem(): TItem | undefined;
    get nextItem(): TItem | undefined;
    get previousItem(): TItem | undefined;
    get data(): TData | undefined;
}
export interface ItemData<TData> {
    id: string;
    parentId?: string;
    previousId?: string;
    data: TData;
}
export interface ActionableItem<TData, TItem extends ActionableItem<TData, TItem>> extends Item<TItem, TData> {
    update(data: TData): void;
    /**
     * Removes the item and all its children from both the linked list, and the doom render
     */
    remove(): void;
    /**
    * Inserts the item after the last child
    */
    append(item: TItem): void;
    /**
     * Inserts the item just before this item
     */
    before(item: TItem): void;
    /**
     * Inserts the item just after this item
     */
    after(item: TItem): void;
}
/** @internal */
export declare function render(...items: ItemData<any>[]): Item<any, any>[];
export declare abstract class ItemElement<TData, TItem extends ItemElement<TData, TItem>> implements ActionableItem<TData, TItem> {
    #private;
    get id(): string;
    get parentItem(): TItem | undefined;
    get firstChildItem(): TItem | undefined;
    get nextItem(): TItem | undefined;
    get previousItem(): TItem | undefined;
    abstract get data(): TData;
    abstract update(data: TData): void;
    abstract render(data: TData): HTMLElement;
    get target(): HTMLElement;
    init(data: TData): void;
    getDetails(): ItemData<TData>;
    remove(): void;
    append(item: TItem): void;
    before(item: TItem): void;
    after(item: TItem): void;
    constructor(id: string);
}
