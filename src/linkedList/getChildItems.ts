import { getNextSiblings } from "./getNextSiblings";
import { Item } from "./item";


export function getChildItems<T extends Item<T, any>>(item: T): T[] {
    if (!item.firstChildItem) return [];
    return [
        item.firstChildItem as T,
        ...getChildItems(item.firstChildItem) as T[],
        ...getNextSiblings(item.firstChildItem).flatMap(x => [x as T, ...getChildItems<T>(x as T)])
    ]
}


