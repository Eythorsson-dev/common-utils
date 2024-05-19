import { ItemData, ItemElement } from './item';

export declare function getChildAndNextSiblingData<TData, T extends ItemElement<TData, T>>(item: T): ItemData<TData>[];
