import { Command } from "./command";
import { getChildAndNextSiblingData } from "./getChildAndNextSiblingData";
import { getNextItem } from "./getNextItem";
import { getNextOrChildById } from "./getNextOrChildById";
import { getNextOrChildByTarget } from "./getNextOrChildByTarget";
import { ItemData, ItemElement } from "./item";
import { sortList } from "./sortList";
import { upsertAndReturnRoot } from "./upsertAndReturnRoot";
import { validateList } from "./validateList";

export abstract class ItemContainerElement<
    TItem extends ItemElement<any, TItem>,
    TCommandId
> {
    #target: HTMLElement;
    #rootItem: TItem | undefined;
    get rootItem(): TItem { return this.#rootItem! }
    protected set rootItem(item: TItem) { this.#rootItem = item }

    get activeItem(): TItem | undefined {
        if (document.activeElement == undefined) return undefined;
        return getNextOrChildByTarget(this.#rootItem!, document.activeElement)
    }

    abstract get commands(): Command<ItemContainerElement<TItem, TCommandId>, TCommandId>[]

    constructor(target: HTMLElement) {
        this.#target = target;
    }

    get value(): ItemData<any>[] {
        return getChildAndNextSiblingData(this.#rootItem!);
    }

    set value(items: ItemData<any>[]) {
        validateList(items);

        const sortedList = sortList(items);
        if (sortedList.length != items.length)
            throw new Error("Cannot set value, invalid linked list");

        const oldRoot = this.#rootItem;
        items.forEach((item, index) => {
            this.upsert(item);

            if (index == 0) {
                this.#target.replaceChildren(this.#rootItem!.target);
                oldRoot?.remove();
            }
        })
    }

    upsert<T extends ItemData<any>>(data: T): void {
        this.#rootItem = upsertAndReturnRoot(data, this.#rootItem, () => this.createItem(data.type, data.id, data.data))
    }

    getItemById(id: string): TItem | undefined {
        return getNextOrChildById(this.#rootItem!, id);
    }

    deleteItemById(id: string): void {
        if (id == this.#rootItem!.id) {
            const newRootItem = getNextItem(this.rootItem);

            this.getItemById(id)
                ?.remove();

            this.#rootItem = newRootItem;
        }
        else {
            this.getItemById(id)
                ?.remove();
        }
    }

    abstract createItem<T>(type: string, id: string, data?: T): TItem;
}
