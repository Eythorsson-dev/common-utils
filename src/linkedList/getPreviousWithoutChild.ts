import { getLastChild } from "./getLastChild";
import { Item } from "./item";


export function getPreviousWithoutChild<T extends Item<T, any>>(item: T): T | undefined {

    function _getParentPrevious(item: T): T | undefined {
        if (item.previousItem && item.previousItem.firstChildItem) return getLastChild(item.previousItem) ?? item.previousItem;
        if (item.parentItem) return _getParentPrevious(item.parentItem);
        return undefined;
    }

    return _getParentPrevious(item);
}