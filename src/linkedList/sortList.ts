import { ItemData } from "./item";
import { validateList } from "./validateList";


function sort<T extends ItemData<any>>(items: T[], parentId: string | undefined, previousId: string | undefined) : T[]{
    const item = items.find(x => x.parentId == parentId && x.previousId == previousId);
    if (!item) return [];

    items = items.filter(x => x.id != item.id);

    return [
        item,
        ...sort(items, item.id, undefined),
        ...sort(items, parentId, item.id)
    ];
}

export function sortList<T extends ItemData<any>>(items: T[]): T[] {
    validateList(items);
    return sort(items, undefined, undefined)
}


