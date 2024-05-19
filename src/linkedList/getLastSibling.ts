import { Item } from "./item";

export function getLastSibling<T extends Item<T, any>>(item: T): T {
    if (item.nextItem) return getLastSibling(item.nextItem);
    else return item;
}