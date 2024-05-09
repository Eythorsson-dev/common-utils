import { ItemData } from "./item";

export function sortList<T extends ItemData>(blocks: T[], parentId: string | undefined, previousId: string | undefined): T[] {
    const block = blocks.find(x => x.parentId == parentId && x.previousId == previousId);
    if (!block) return [];

    blocks = blocks.filter(x => x.id != block.id);

    return [
        block,
        ...sortList(blocks, block.id, undefined),
        ...sortList(blocks, parentId, block.id)
    ];
}


