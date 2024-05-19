import { ItemData, ItemElement } from "./item";

export function getChildAndNextSiblingData<TData extends ItemData<any>, T extends ItemElement<any, T>>(item: T): TData[] {
    if (!item) return [];

    const response = [
        item.getDetails() as TData
    ];

    if (item.firstChildItem) response.push(...getChildAndNextSiblingData<TData, T>(item.firstChildItem));
    if (item.nextItem) response.push(...getChildAndNextSiblingData<TData, T>(item.nextItem));

    return response;
}