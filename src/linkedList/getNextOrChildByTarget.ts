import { ItemElement } from "./item";


/**
 * Gets the linked list item that contains the item, by searching each child and next item.
 * @param root the root item to search from
 * @param target the target to search for
 * @returns the linked list item that contains the target
 */
export function getNextOrChildByTarget<T extends ItemElement<any, T>>(root: T, target: Node): T | undefined {
    if (target.contains(root.target)) return undefined;

    function search(item: T): T | undefined {
        
        let response: T | undefined;
        if (item.firstChildItem) response ||= search(item.firstChildItem);
        if (item.nextItem) response ||= search(item.nextItem);
        if (item.target.contains(target)) response ||= item;

        return response;
    }
    
    return search(root)
}
