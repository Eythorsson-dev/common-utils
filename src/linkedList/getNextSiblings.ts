import { Item } from "./item";

export function getNextSiblings<T extends Item<T, any>>(item: T): T[] {
    if (item.nextItem) return [item.nextItem as T, ...getNextSiblings(item.nextItem) as T[]];
    else return [];
}