import { ActionableItem, ItemData } from './item';

type Data<T extends ItemData> = Omit<T, "id" | "previousId" | "parentId" | "firstChildId" | "nextId">;
export declare function upsertAndReturnRoot<TData extends {
    id: string;
    previousId?: string;
    parentId?: string;
    data?: any;
}, TItem extends ActionableItem<Data<TData>, TItem>>(data: TData, root: TItem | undefined, createItem: (data: TData) => TItem): TItem;
export {};
