import { getNextSiblings } from "./getNextSiblings";
import { Item } from "./item";


export function getChildItems<T extends Item>(item: T): T[] {
    if (!item.firstChild) return [];
    return [
        item.firstChild as T,
        ...getChildItems(item.firstChild) as T[],
        ...getNextSiblings(item.firstChild).flatMap(x => [x as T, ...getChildItems<T>(x as T)])
    ]
}