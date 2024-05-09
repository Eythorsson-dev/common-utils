import { Item } from './item';

export declare function getNextOrChildById<T extends Item>(root: T, id: string): T | undefined;
