import { getNextOrChildById } from "./getNextOrChildById";
import { ActionableItem, ItemData } from "./item";


export function upsertAndReturnRoot<
    TData,
    TItemData extends ItemData<TData>,
    TItem extends ActionableItem<TData, TItem>,
>(
    data: TItemData,
    root: TItem | undefined,
    createItem: (data: TItemData) => TItem
): TItem {
    if (root == undefined && (data.parentId || data.previousId)) {
        throw new Error("the initial upsert must be the root window");
    }

    type AItem = ActionableItem<TData, AItem>;
    let item = root && getNextOrChildById(<AItem>root, data.id);

    if (item == undefined
        || item.parentItem?.id != data.parentId
        || item.previousItem?.id != data.previousId
    ) {
        if (root && item && root.id == item.id) {
            if (item!.firstChildItem) {
                root = <TItem>item!.firstChildItem;
            }
            else if (item!.nextItem) root = <TItem>item!.nextItem;
            else throw new Error("Failed to render block, a new rootBlock could not be determined");
        }

        if (item == undefined) item = createItem(data)
        item?.remove();


        if (root == undefined) {
            root = <TItem>item;
        }
        else if (data.previousId) {
            const previous = getNextOrChildById(<AItem>root, data.previousId);
            if (!previous) throw new Error("Failed to render item, previous item is not rendered");

            previous.after(item)
        }
        else if (data.parentId) {
            const parent = getNextOrChildById(<AItem>root, data.parentId);
            if (!parent) throw new Error("Failed to render item, parent item is not rendered");

            parent.append(item)
        }
        else {
            throw new Error(`Failed to render item (${item?.id})`)
        }
    }

    item.update(data.data);

    return root!;
}