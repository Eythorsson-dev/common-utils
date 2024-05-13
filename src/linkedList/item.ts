import { getNextSiblings } from "./getNextSiblings";


export interface Item<T> {
    get id(): string,
    get parentItem(): T | undefined,
    get firstChildItem(): T | undefined
    get nextItem(): T | undefined,
    get previousItem(): T | undefined
}

export interface ItemData {
    id: string,
    parentId?: string,
    firstChildId?: string,
    nextId?: string,
    previousId?: string,
}

export interface ActionableItem<TData> extends Item<ActionableItem<TData>> {
    update(data: TData): void;
    remove(): void;

    /**
    * Inserts the item after the last child
    */
    append(item: ActionableItem<TData>): void;

    /**
     * Inserts the item just before this item
     */
    before(item: ActionableItem<TData>): void;

    /**
     * Inserts the item just after this item
     */
    after(item: ActionableItem<TData>): void;
}

/** @internal */
export function render(...items: ItemData[]): Item<any>[] {
    const itemById = items.reduce((obj, curr) => {
        obj[curr.id] = {
            ...curr,
            get parentItem() { return obj[curr.parentId!] },
            get nextItem() { return obj[curr.nextId ?? items.find(x => x.previousId == curr.id)?.id!] },
            get previousItem() { return obj[curr.previousId ?? items.find(x => x.nextId == curr.id)?.id!] },
            get firstChildItem() { return obj[curr.firstChildId ?? items.find(x => x.parentId == curr.id && x.previousId == undefined)?.id!] },
        };

        return obj
    }, {} as { [key: string]: Item<any> })

    return items.map(x => itemById[x.id]);
}

export abstract class ItemElement<TData extends { id: string }, TItem extends ItemElement<TData, TItem>>
    implements ActionableItem<TData> {

    #id: string;
    get id(): string { return this.#id; }

    #parent: TItem | undefined;
    get parentItem(): TItem | undefined { return this.#parent }
    set parentItem(item: TItem | undefined) { this.#parent = item; }

    #firstChild: TItem | undefined;
    get firstChildItem(): TItem | undefined { return this.#firstChild }
    set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }

    #next: TItem | undefined;
    get nextItem(): TItem | undefined { return this.#next }
    set nextItem(item: TItem | undefined) { this.#next = item; }

    #previous: TItem | undefined;
    get previousItem(): TItem | undefined { return this.#previous }
    set previousItem(item: TItem | undefined) { this.#previous = item; }

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

    append(item: TItem): void {
        if (item.id == this.id)
            throw new Error("Cannot append item before itself");

        item.remove();

        const children = this.firstChildItem && [this.firstChildItem, ...getNextSiblings(this.firstChildItem)];
        const lastChild = children?.slice(-1)[0];

        if (lastChild) {
            lastChild.after(item);
        }
        else {
            this.firstChildItem = item;
            item.parentItem = this as unknown as TItem;
            this.target.append(item.target);
        }

    }

    before(item: TItem): void {
        if (item.id == this.id)
            throw new Error("Cannot append item before itself");

        item.remove();

        item.previousItem = this.previousItem
        if (this.previousItem) this.previousItem.nextItem = item;
        else if (this.parentItem) this.parentItem.firstChildItem = item;

        item.parentItem = this.parentItem;
        item.nextItem = this as unknown as TItem
        this.previousItem = item;

        this.target.before(item.target);
    }

    after(item: TItem): void {
        if (item.id == this.id)
            throw new Error("Cannot append item before itself");

        item.remove();

        item.nextItem = this.nextItem;
        if (this.nextItem) this.nextItem.previousItem = item;

        item.parentItem = this.parentItem;
        item.previousItem = this as unknown as TItem;
        this.nextItem = item;

        this.target.after(item.target);
    }

    constructor(data: TData) {
        if (data.id.trim().length == 0) throw new Error("id is not valid");

        this.#id = data.id

        this.#target = this.render(data);
    }
}