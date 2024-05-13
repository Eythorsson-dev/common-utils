import { Item } from "./item";

function searchItems<T extends Item<T>>(item: T, end: T, ignoreChildren: boolean = false): T[] {
    if (item == undefined) return [];
    if (item.id == end.id) return [end];

    const children = ignoreChildren ? [] : searchItems<T>(item.firstChildItem! as T, end);
    if (children.slice(-1)[0]?.id == end.id) return [item, ...children];

    if (item.nextItem) return [item, ...children, ...searchItems<T>(item.nextItem as T, end)];
    if (item.parentItem) return [item, ...children, ...searchItems<T>(item.parentItem as T, end, true) as T[]].filter(x => x.id != item.parentItem!.id);

    throw Error("Something went wrong. Please make sure that the start, and the end has a common parent")

}


export function getItemsBetween<T extends Item<T>>(start: T | undefined, end: T): T[] {
    return searchItems(start!, end);
}