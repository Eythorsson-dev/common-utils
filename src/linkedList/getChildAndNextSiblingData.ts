import { ItemData, ItemElement } from "./item";

export function getChildAndNextSiblingData<TData, T extends ItemElement<TData, T>>(item: T): ItemData<TData>[] {
    if (!item) return [];

    const response = [
        item.getDetails()
    ];

    if (item.firstChildItem) response.push(...getChildAndNextSiblingData<TData, T>(item.firstChildItem));
    if (item.nextItem) response.push(...getChildAndNextSiblingData<TData, T>(item.nextItem));

    return response;
}