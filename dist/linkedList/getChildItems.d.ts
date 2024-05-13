import { Item } from './item';

export declare function getChildItems<T extends Item<T>>(item: T): T[];
