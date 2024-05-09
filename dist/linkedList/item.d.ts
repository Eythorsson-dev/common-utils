export interface Item {
    get id(): string;
    get parent(): Item | undefined;
    get firstChild(): Item | undefined;
    get next(): Item | undefined;
    get previous(): Item | undefined;
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
