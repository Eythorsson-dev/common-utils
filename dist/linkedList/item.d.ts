export interface Item {
    get id(): string;
    get parentItem(): Item | undefined;
    get firstChildItem(): Item | undefined;
    get nextItem(): Item | undefined;
    get previousItem(): Item | undefined;
}
export interface ItemData {
    id: string;
    parentId?: string;
    firstChildId?: string;
    nextId?: string;
    previousId?: string;
}
export interface ActionableItem<TData> extends Item {
    update(data: TData): void;
    remove(): void;
    /**
    * Inserts the item after the last child
    */
    append(item: Item): void;
    /**
     * Inserts the item just before this item
     */
    before(item: Item): void;
    /**
     * Inserts the item just after this item
     */
    after(item: Item): void;
}
/** @internal */
export declare function render(...items: ItemData[]): Item[];
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
