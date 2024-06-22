import { Command } from './command';
import { ItemData, ItemElement } from './item';

export declare abstract class ItemContainerElement<TItem extends ItemElement<any, TItem>, TCommandId> {
    #private;
    get rootItem(): TItem;
    protected set rootItem(item: TItem);
    get activeItem(): TItem | undefined;
    abstract get commands(): Command<ItemContainerElement<TItem, TCommandId>, TCommandId>[];
    constructor(target: HTMLElement);
    get value(): ItemData<any>[];
    set value(items: ItemData<any>[]);
    upsert<T extends ItemData<any>>(data: T): void;
    getItemById(id: string): TItem | undefined;
    deleteItemById(id: string): void;
    abstract createItem<T>(type: string, id: string, data?: T): TItem;
}
