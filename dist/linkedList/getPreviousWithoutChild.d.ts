import { Item } from './item';

export declare function getPreviousWithoutChild<T extends Item<T, any>>(item: T): T | undefined;
