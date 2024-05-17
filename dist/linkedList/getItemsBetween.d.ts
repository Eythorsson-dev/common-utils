import { Item } from './item';

export declare function getItemsBetween<T extends Item<T, any>>(start: T | undefined, end: T): T[];
