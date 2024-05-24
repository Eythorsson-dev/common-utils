import { getNextSiblings } from "./getNextSiblings";


export interface Item<TItem, TData> {
    get id(): string,
    get parentItem(): TItem | undefined,
    get firstChildItem(): TItem | undefined
    get nextItem(): TItem | undefined,
    get previousItem(): TItem | undefined
    get data(): TData | undefined
}

export interface ItemData<TData> {
    id: string,
    parentId?: string,
    previousId?: string,
    data: TData
}

export interface ActionableItem<TData, TItem extends ActionableItem<TData, TItem>> extends Item<TItem, TData> {
    update(data: TData): void;

    /**
     * Removes the item and all its children from both the linked list, and the doom render
     */
    remove(): void;

    /**
    * Inserts the item after the last child
    */
    append(item: TItem): void;

    /**
     * Inserts the item just before this item
     */
    before(item: TItem): void;

    /**
     * Inserts the item just after this item
     */
    after(item: TItem): void;
}

/** @internal */
export function render(...items: ItemData<any>[]): Item<any, any>[] {
    const itemById = items.reduce((obj, curr) => {
        obj[curr.id] = {
            ...curr,
            get parentItem() { return obj[curr.parentId!] },
            get nextItem() { return obj[items.find(x => x.previousId == curr.id)?.id!] },
            get previousItem() { return obj[curr.previousId!] },
            get firstChildItem() { return obj[items.find(x => x.parentId == curr.id && x.previousId == undefined)?.id!] },
            get data() { return curr.data },
        };

        return obj
    }, {} as { [key: string]: Item<any, any> })

    return items.map(x => itemById[x.id]);
}

export abstract class ItemElement<TData, TItem extends ItemElement<TData, TItem>>
    implements ActionableItem<TData, TItem> {

    #id: string;
    get id(): string { return this.#id; }

    #parent: TItem | undefined;
    get parentItem(): TItem | undefined { return this.#parent }
    // set parentItem(item: TItem | undefined) { this.#parent = item; }

    #firstChild: TItem | undefined;
    get firstChildItem(): TItem | undefined { return this.#firstChild }
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }

    #next: TItem | undefined;
    get nextItem(): TItem | undefined { return this.#next }
    // set nextItem(item: TItem | undefined) { this.#next = item; }

    #previous: TItem | undefined;
    get previousItem(): TItem | undefined { return this.#previous }
    // set previousItem(item: TItem | undefined) { this.#previous = item; }

    abstract get data(): TData

    abstract update(data: TData): void;
    abstract render(data: TData): HTMLElement;

    #target: HTMLElement | undefined
    get target(): HTMLElement {
        if (!this.#target)
            throw new Error("Failed to get target. Please call the .initialized(data) method before fetching the target");

        return this.#target;
    }

    init(data: TData): void {
        if (this.#target)
            throw new Error("The target has already been initialized");

        this.#target = this.render(data);
    }

    getDetails(): ItemData<TData> {
        return {
            id: this.id,
            parentId: this.parentItem?.id,
            previousId: this.previousItem?.id,
            data: this.data
        }
    }

    remove(): void {
        if (this.parentItem?.firstChildItem?.id == this.id) {
            this.parentItem.#firstChild = this.#next
        }

        if (this.previousItem) {
            this.previousItem.#next = this.#next;
        }
        if (this.nextItem) {
            this.nextItem.#previous = this.#previous;
        }

        this.#parent = undefined;
        this.#next = undefined;
        this.#previous = undefined;

        this.#target?.remove();
    }

    append(item: TItem): void {
        if (item.id == this.id)
            throw new Error("Cannot append item before itself");

        item.remove();

        const children = this.firstChildItem && [this.firstChildItem, ...getNextSiblings(this.firstChildItem)];
        const lastChild = children?.slice(-1)[0];

        item.#parent = this as unknown as TItem;

        if (lastChild) {
            lastChild.after(item);
        }
        else {
            this.#firstChild = item;
            this.target.append(item.target);
        }
    }

    before(item: TItem): void {
        if (item.id == this.id)
            throw new Error("Cannot append item before itself");

        item.remove();

        item.#previous = this.previousItem
        if (this.previousItem) this.previousItem.#next = item;
        else if (this.parentItem) this.parentItem.#firstChild = item;

        item.#parent = this.parentItem;
        item.#next = this as unknown as TItem
        this.#previous = item;

        this.target.before(item.target);
    }

    after(item: TItem): void {
        if (item.id == this.id)
            throw new Error("Cannot append item before itself");

        item.remove();

        item.#next = this.nextItem;
        if (this.nextItem) this.nextItem.#previous = item;

        item.#parent = this.parentItem;
        item.#previous = this as unknown as TItem;
        this.#next = item;

        this.target.after(item.target);
    }

    constructor(id: string) {
        if ((id?.trim() ?? "").length == 0) throw new Error("id is not valid");

        this.#id = id
    }
}