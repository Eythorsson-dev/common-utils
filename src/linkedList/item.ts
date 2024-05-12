import { getNextSiblings } from "./getNextSiblings";


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


export abstract class ItemElement<TData extends { id: string }>
    implements ActionableItem<TData> {

    #id: string;
    get id(): string { return this.#id; }

    #parent: ItemElement<any> | undefined;
    get parentItem(): ItemElement<any> | undefined { return this.#parent }
    set parentItem(item: ItemElement<any> | undefined) { this.#parent = item; }

    #firstChild: ItemElement<any> | undefined;
    get firstChildItem(): ItemElement<any> | undefined { return this.#firstChild }
    set firstChildItem(item: ItemElement<any> | undefined) { this.#firstChild = item; }

    #next: ItemElement<any> | undefined;
    get nextItem(): ItemElement<any> | undefined { return this.#next }
    set nextItem(item: ItemElement<any> | undefined) { this.#next = item; }

    #previous: ItemElement<any> | undefined;
    get previousItem(): ItemElement<any> | undefined { return this.#previous }
    set previousItem(item: ItemElement<any> | undefined) { this.#previous = item; }

    abstract update(data: TData): void;
    abstract render(data: TData): HTMLElement;

    #target: HTMLElement
    get target(): HTMLElement { return this.#target }

    remove(): void {
        if (this.parentItem?.firstChildItem?.id == this.id) {
            this.parentItem.firstChildItem = this.nextItem
        }
        if (this.firstChildItem) {  
            const children = [this.firstChildItem, ...getNextSiblings(this.firstChildItem)];
            const childElements = children.map(x => x.target);
            const lastChild = children.slice(-1)[0]

            if (this.previousItem) {
                children.forEach(child => child.parentItem = this.previousItem);

                const lastChildOfPrevious = this.previousItem.firstChildItem
                    && getNextSiblings(this.previousItem.firstChildItem)
                        .slice(-1)[0];

                if (lastChildOfPrevious) {
                    lastChildOfPrevious.nextItem = this.firstChildItem;
                    this.firstChildItem.previousItem = lastChildOfPrevious;
                }

                this.previousItem.target.append(...childElements)
            }
            else {

                children.forEach(child => child.parentItem = this.parentItem);
                this.target.replaceWith(...childElements);

                if (children[0]) children[0].previousItem = this.previousItem
                if (lastChild) lastChild.nextItem = this.nextItem;
                if (this.nextItem) this.nextItem.previousItem = children[0];
            }
        }
        if (this.previousItem) {
            this.previousItem.nextItem = this.nextItem;
        }
        if (this.nextItem) {
            this.nextItem.#previous = this.#previous;
        }


        this.parentItem = undefined;
        this.firstChildItem = undefined;
        this.nextItem = undefined;
        this.previousItem = undefined;

        this.#target.remove();
    }

    insert(parentItem: ItemElement<any> | undefined, previousItem: ItemElement<any> | undefined, nextItem: ItemElement<any> | undefined): void {

        if (previousItem && previousItem.parentItem?.id != parentItem?.id)
            throw new Error("Invalid previous.parentId");

        if (nextItem && nextItem.parentItem?.id != parentItem?.id)
            throw new Error("Invalid next.parentId");

        if (!parentItem && !previousItem && !nextItem)
            throw new Error("All of parent, previous and next cannot be null");

        if (parentItem?.firstChildItem && !previousItem && !nextItem)
            throw new Error("The parent contains a child. Please specify where to insert the item")

        this.remove();

        if (previousItem) {
            previousItem.nextItem = this;
            if (nextItem) nextItem.previousItem = this;

            previousItem.target.after(this.target);
        }
        else if (nextItem) {
            nextItem.previousItem = this;
            nextItem.target.before(this.target)
        }
        else if (parentItem) {
            parentItem.firstChildItem = this;
            parentItem.target.append(this.target);
        }

        this.parentItem = parentItem;
        this.previousItem = previousItem;
        this.nextItem = nextItem;
    }

    constructor(data: TData) {
        if (data.id.trim().length == 0) throw new Error("id is not valid");

        this.#id = data.id

        this.#target = this.render(data);
    }
}