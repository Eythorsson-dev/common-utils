

export interface Item {
    get id(): string,
    get parentItem(): Item | undefined,
    get firstChildItem(): Item | undefined
    get nextItem(): Item | undefined,
    get previousItem(): Item | undefined
}

export interface ItemData {
    id: string,
    parentId?: string,
    firstChildId?: string,
    nextId?: string,
    previousId?: string,
}

export interface ActionableItem<TData> extends Item {
    update(data: TData): void;

    remove(): void;
    insert(
        parentItem: Item | undefined,
        previousItem: Item | undefined,
        nextItem: Item | undefined
    ): void;
}


/** @internal */
export function render(...items: ItemData[]): Item[] {
    const itemById = items.reduce((obj, curr) => {
        obj[curr.id] = {
            ...curr,
            get parentItem() { return obj[curr.parentId!] },
            get nextItem() { return obj[curr.nextId ?? items.find(x => x.previousId == curr.id)?.id!] },
            get previousItem() { return obj[curr.previousId ?? items.find(x => x.nextId == curr.id)?.id!] },
            get firstChildItem() { return obj[curr.firstChildId ?? items.find(x => x.parentId == curr.id && x.previousId == undefined)?.id!] },
        };

        return obj
    }, {} as { [key: string]: Item })

    return items.map(x => itemById[x.id]);
}