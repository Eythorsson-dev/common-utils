

export interface Item {
    get id(): string,
    get parent(): Item | undefined,
    get firstChild(): Item | undefined
    get next(): Item | undefined,
    get previous(): Item | undefined
}

export interface ItemData {
    id: string,
    parentId?: string,
    firstChildId?: string,
    nextId?: string,
    previousId?: string,
}

/** @internal */
export function render(...items: ItemData[]): Item[] {
    const itemById = items.reduce((obj, curr) => {
        obj[curr.id] = {
            ...curr,
            get parent() { return obj[curr.parentId!] },
            get next() { return obj[curr.nextId ?? items.find(x => x.previousId == curr.id)?.id!] },
            get previous() { return obj[curr.previousId ?? items.find(x => x.nextId == curr.id)?.id!] },
            get firstChild() { return obj[curr.firstChildId ?? items.find(x => x.parentId == curr.id && x.previousId == undefined)?.id!] },
        };

        return obj
    }, {} as { [key: string]: Item })

    return items.map(x => itemById[x.id]);
}