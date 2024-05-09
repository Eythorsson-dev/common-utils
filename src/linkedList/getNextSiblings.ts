import { Item } from "./item";

export function getNextSiblings<T extends Item>(item: T): T[] {
    if (item.next) return [item.next as T, ...getNextSiblings(item.next) as T[]];
    else return [];
}