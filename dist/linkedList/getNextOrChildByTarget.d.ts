import { ItemElement } from './item';

export declare function getNextOrChildByTarget<T extends ItemElement<any, T>>(root: T, target: Node): T | undefined;
