import { Item } from "./item";

/** The next block can either be the first child, the next sibling or the next sibling of a parent */
export function getNextBlock<T extends Item>(item: T): T | undefined {

    if (item.firstChild) return item.firstChild as T;
    if (item.next) return item.next as T;

    function getParentNext(block: T): T | undefined {
        if (block.next) return block.next as T;
        if (block.parent) return getParentNext(block.parent as T);
        return undefined;
    }

    return getParentNext(item)
}