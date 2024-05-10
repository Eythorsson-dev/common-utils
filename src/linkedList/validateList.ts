import { ItemData } from "./item";
import { sortList } from "./sortList";


export function validateList<T extends ItemData>(items: T[]): void {
    const rootBlocks = items.filter(x => x.parentId == undefined && x.previousId == undefined);

    if (rootBlocks.length != 1 && items.length > 0)
        throw new Error("Cannot set value, failed to determine the start of the linked list");

    const ids = items.map(x => x.id);
    const idDuplicated = ids.some((x, i, a) => a.indexOf(x) != i);
    if (idDuplicated)
        throw new Error("Cannot set value, found duplicated instances of ids");

    const prevIds = items.map(x => x.previousId + "_" + x.parentId);
    const prevIdDuplicated = prevIds.some((x, i, a) => a.indexOf(x) != i);
    if (prevIdDuplicated)
        throw new Error("Cannot set value, some of the blocks have the same prevId");

    const sortedList = sortList(items, undefined, undefined);
    if (sortedList.length != items.length){
        throw new Error("Linked list is not valid")
    }
}
