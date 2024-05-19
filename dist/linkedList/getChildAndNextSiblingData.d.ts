import { ItemData, ItemElement } from './item';

export declare function getChildAndNextSiblingData<TData extends ItemData<any>, T extends ItemElement<any, T>>(item: T): TData[];
