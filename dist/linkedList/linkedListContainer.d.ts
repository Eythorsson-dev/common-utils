import { ItemData, ItemElement } from './item';

export declare abstract class LinkedListContainer<TItem extends ItemElement<any, TItem>> {
    #private;
    get rootItem(): TItem;
    constructor(target: HTMLElement);
    get value(): ItemData<any>[];
    set value(items: ItemData<any>[]);
    upsert<T extends ItemData<any>>(data: T): void;
    getItemById(id: string): TItem | undefined;
    deleteItemById(id: string): void;
    abstract createItem<T>(id: string, data?: T): TItem;
}
