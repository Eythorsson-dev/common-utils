import { Item } from "./item";

/** The next block can either be the first child, the next sibling or the next sibling of a parent */
export function getNextItem<T extends Item<T, any>>(item: T, options?: { ignoreChildren: boolean }): T | undefined {

    if (item.firstChildItem && options?.ignoreChildren != true) return item.firstChildItem as T;
    if (item.nextItem) return item.nextItem as T;

    function getParentNext(block: T): T | undefined {
        if (block.nextItem) return block.nextItem as T;
        if (block.parentItem) return getParentNext(block.parentItem as T);
        return undefined;
    }

    return getParentNext(item)
}