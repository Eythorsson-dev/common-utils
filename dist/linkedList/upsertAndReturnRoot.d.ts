import { ActionableItem, ItemData } from './item';

export declare function upsertAndReturnRoot<TData, TItemData extends ItemData<TData>, TItem extends ActionableItem<TData, TItem>>(data: TItemData, root: TItem | undefined, createItem: (data: TItemData) => TItem): TItem;
