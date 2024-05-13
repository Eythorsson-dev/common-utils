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
}> implements ActionableItem<TData> {
    #private;
    get id(): string;
    get parentItem(): ItemElement<any> | undefined;
    set parentItem(item: ItemElement<any> | undefined);
    get firstChildItem(): ItemElement<any> | undefined;
    set firstChildItem(item: ItemElement<any> | undefined);
    get nextItem(): ItemElement<any> | undefined;
    set nextItem(item: ItemElement<any> | undefined);
    get previousItem(): ItemElement<any> | undefined;
    set previousItem(item: ItemElement<any> | undefined);
    abstract update(data: TData): void;
    abstract render(data: TData): HTMLElement;
    get target(): HTMLElement;
    remove(): void;
    append(item: ItemElement<any>): void;
    before(item: ItemElement<any>): void;
    after(item: ItemElement<any>): void;
    constructor(data: TData);
}
