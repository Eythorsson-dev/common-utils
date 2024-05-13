import { Item } from './item';

export declare function getNextOrChildById<T extends Item<T>>(root: T, id: string): T | undefined;
