import { getNextOrChildById } from "./getNextOrChildById";
import { ActionableItem, ItemData } from "./item";

type Data<T extends ItemData> = Omit<T, "id" | "previousId" | "parentId" | "firstChildId" | "nextId">;


export function upsertAndReturnRoot<
    TData extends ItemData,
    TItem extends ActionableItem<Data<TData>>
>(
    data: TData,
    root: TItem | undefined,
    createItem: (data: TData) => TItem
) {
    if (root == undefined && (data.parentId || data.previousId)) {
        throw new Error("the initial upsert must be the root window");
    }

    let item = root && getNextOrChildById(root, data.id);

    if (item == undefined
        || item.parentItem?.id != data.parentId
        || item.previousItem?.id != data.previousId
    ) {
        item?.remove();
        if (item == undefined) item = createItem(data)

        if (root == undefined) {
            root = item;
        }
        else if (data.previousId) {
            const previous = getNextOrChildById(root, data.previousId);
            if (!previous) throw new Error("Failed to render item, previous item is not rendered");

            item.insert(previous.parentItem, previous, previous.nextItem);
        }
        else if (data.parentId) {
            const parent = getNextOrChildById(root, data.parentId);
            if (!parent) throw new Error("Failed to render item, parent item is not rendered");

            item.insert(parent.parentItem, undefined, parent);
        }
        else {
            item.insert(undefined, undefined, root);
            root = item;
        }
    }
    item.update(data)

    return root;
}