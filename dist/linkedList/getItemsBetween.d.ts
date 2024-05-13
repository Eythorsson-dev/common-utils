import { Item } from './item';

export declare function getItemsBetween<T extends Item<T>>(start: T | undefined, end: T): T[];
