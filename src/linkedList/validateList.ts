import { ItemData } from "./item";

function getLength(data: ItemData<any>[], parentId?: string, previousId?: string): number {
    const block = data.find(x => x.parentId == parentId && x.previousId == previousId);
    if (!block) return 0;

    data = data.filter(x => x.id != block.id);

    return 1
        + getLength(data, block.id, undefined)
        + getLength(data, parentId, block.id)
}


export function validateList<T extends ItemData<any>>(items: T[]): void {
    const rootBlocks = items.filter(x => x.parentId == undefined && x.previousId == undefined);

    if (rootBlocks.length != 1 && items.length > 0)
        throw new Error("Failed to determine the start of the linked list");

    const ids = items.map(x => x.id);
    const idDuplicated = ids.some((x, i, a) => a.indexOf(x) != i);
    if (idDuplicated)
        throw new Error("Found duplicated instances of ids");

    const prevIds = items.map(x => x.previousId + "_" + x.parentId);
    const prevIdDuplicated = prevIds.some((x, i, a) => a.indexOf(x) != i);
    if (prevIdDuplicated)
        throw new Error("Some of the items have the same previousId");


    if (getLength(items) != items.length) 
        throw new Error("Linked list is not valid")
}
