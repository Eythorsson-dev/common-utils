import { ItemElement } from './item';

/**
 * Gets the linked list item that contains the item, by searching each child and next item.
 * @param root the root item to search from
 * @param target the target to search for
 * @returns the linked list item that contains the target
 */
export declare function getNextOrChildByTarget<T extends ItemElement<any, T>>(root: T, target: Node): T | undefined;
