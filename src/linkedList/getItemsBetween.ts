import { Item } from "./item";

function searchItems(block: Item, end: Item, ignoreChildren: boolean = false): Item[] {
    if (block == undefined) return [];
    if (block.id == end.id) return [end];

    const children = ignoreChildren ? [] : searchItems(block.firstChild!, end);
    if (children.slice(-1)[0]?.id == end.id) return [block, ...children];

    if (block.next) return [block, ...children, ...searchItems(block.next, end)];
    if (block.parent) return [block, ...children, ...searchItems(block.parent, end, true)].filter(x => x.id != block.parent!.id);

    throw Error("Something went wrong. Please make sure that the start, and the end has a common parent")

}


export function getItemsBetween(start: Item | undefined, end: Item): Item[] {
    return searchItems(start!, end);
}