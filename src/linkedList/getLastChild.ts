import { Item } from "./item";

/** The next block can either be the first child, the next sibling or the next sibling of a parent */
export function getLastChild<T extends Item<T, any>>(item: T): T | undefined {

    function _getLastChild(item: T | undefined): T | undefined {
        if (item?.nextItem) return _getLastChild(item.nextItem);
        if (item?.firstChildItem) return _getLastChild(item.firstChildItem);
        return item;
    }

    return _getLastChild(item?.firstChildItem)
}