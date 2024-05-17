import { Item } from './item';

export declare function getNextOrChildById<T extends Item<T, any>>(root: T, id: string): T | undefined;
