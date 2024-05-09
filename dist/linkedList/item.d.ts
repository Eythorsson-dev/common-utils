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
/** @internal */
export declare function render(...items: ItemData[]): Item[];
