import { Item } from './item';

/** The next block can either be the first child, the next sibling or the next sibling of a parent */
export declare function getLastChild<T extends Item<T, any>>(item: T): T | undefined;
