import { Item } from "./item";

export function getNextOrChildById<T extends Item>(root: T, id: string): T | undefined {

    function search(item: T): T | undefined {
        if (item.id == id) return item;

        let response: T | undefined;
        if (item.firstChildItem) response ||= search(item.firstChildItem as T);
        if (item.nextItem) response ||= search(item.nextItem as T);

        return response;
    }

    return search(root)
}