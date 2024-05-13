import { test, expect, vi, beforeEach, Mock } from "vitest";
import { upsertAndReturnRoot } from "../upsertAndReturnRoot"
import { ActionableItem, ItemData } from "../item";
import { generateUId } from "./utils";
import { validateList } from "../validateList"

interface TestItemData extends ItemData {
    foo?: string,
    bar?: string,
    baz?: string
}

const appendMock = vi.fn();
const beforeMock = vi.fn();
const afterMock = vi.fn();
const updateMock = vi.fn();
const removeMock = vi.fn();


function createItem(data: ItemData): ActionableItem<any, any> {
    return {
        id: data.id,
        parentItem: data.parentId && { id: data.parentId! } as any,
        nextItem: data.nextId && { id: data.nextId! } as any,
        previousItem: data.previousId && { id: data.previousId! } as any,
        firstChildItem: data.firstChildId && { id: data.firstChildId! }as any,
        append: appendMock,
        before: beforeMock,
        after: afterMock,
        update: updateMock,
        remove: removeMock
    };
}


export function renderActionable<T extends ItemData>(...items: ItemData[]): ActionableItem<T, any>[] {
    validateList(items);

    const itemById = items.reduce((obj, curr) => {
        obj[curr.id] = {
            ...curr,
            append: vi.fn(),
            before: vi.fn(),
            after: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),

            get parentItem() { return obj[curr.parentId!] },
            get nextItem() { return obj[curr.nextId ?? items.find(x => x.previousId == curr.id)?.id!] },
            get previousItem() { return obj[curr.previousId ?? items.find(x => x.nextId == curr.id)?.id!] },
            get firstChildItem() { return obj[curr.firstChildId ?? items.find(x => x.parentId == curr.id && x.previousId == undefined)?.id!] },
        };

        return obj
    }, {} as { [key: string]: ActionableItem<T, any> })

    return items.map(x => itemById[x.id]);
}

function getData<T extends ActionableItem<any, T>>(item: T): ItemData {
    const { append, before, after, update, remove, firstChildItem, parentItem, nextItem, previousItem, ...data } = item;

    return {
        ...data,
        parentId: item.parentItem?.id,
        firstChildId: item.firstChildItem?.id,
        nextId: item.nextItem?.id,
        previousId: item.previousItem?.id
    }
}

const emptyObject = getData({} as ActionableItem<any, any>);


beforeEach(() => {
    appendMock.mockClear();
    beforeMock.mockClear();
    afterMock.mockClear();
    updateMock.mockClear();
    removeMock.mockClear();
})

test("no root + data(parent) throws", () => {
    const data0: ItemData = { id: "Item0", parentId: "Item1" };

    expect(() => upsertAndReturnRoot(data0, undefined, createItem)).toThrow()
})

test("no root + data(prev) throws", () => {
    const data0: ItemData = { id: "Item0", previousId: "Item1" };

    expect(() => upsertAndReturnRoot(data0, undefined, createItem)).toThrow()
})

test("can create root", () => {
    const data0: ItemData = { id: "Item0" };

    expect(upsertAndReturnRoot(data0, undefined, createItem)?.id).toBe(data0.id);
})

test("can update root", () => {
    const data0: TestItemData = { id: "Item0" };

    const items = renderActionable(data0);

    data0.foo = generateUId();
    data0.bar = generateUId();
    data0.baz = generateUId();

    const response = upsertAndReturnRoot(data0, items[0], createItem);

    expect(response!.id).toBe(data0.id);
    expect(response?.append).not.toHaveBeenCalledOnce();
    expect(response?.before).not.toHaveBeenCalledOnce();
    expect(response?.after).not.toHaveBeenCalledOnce();
    expect(response?.update).toHaveBeenCalledOnce();
    expect(response?.update).toHaveBeenCalledWith(data0);
})

test("can insert sibling", () => {
    const data0: TestItemData = { id: "Item0" };
    const data1: TestItemData = { id: "Item1", previousId: data0.id };
    const data2: TestItemData = { id: "Item2", previousId: data0.id };

    const items = renderActionable(data0, data2);

    const response = upsertAndReturnRoot(data1, items[0], createItem);

    expect(response!.id).toBe(data0.id);

    expect(updateMock).toHaveBeenCalledOnce();
    expect(updateMock).toHaveBeenCalledWith(data1);
    expect(items[0].append).not.toHaveBeenCalledOnce();
    expect(items[0].before).not.toHaveBeenCalledOnce();
    expect(items[0].after).toHaveBeenCalledOnce();
    const [afterItem] = (items[0].after as Mock).mock.calls[0]
    expect(getData(afterItem)).toMatchObject({ ...emptyObject, ...data1 });
})

test("can update sibling", () => {
    const data0: TestItemData = { id: "Item0" };
    const data1: TestItemData = { id: "Item1", previousId: data0.id };
    const data2: TestItemData = { id: "Item2", previousId: data1.id };

    const items = renderActionable(data0, data1, data2);

    data1.foo = generateUId();
    data1.bar = generateUId();
    data1.baz = generateUId();

    const response = upsertAndReturnRoot(data1, items[0], createItem);

    expect(response!.id).toBe(data0.id);

    expect(items[1].update).toHaveBeenCalledOnce();
    expect(items[1].update).toHaveBeenCalledWith(data1);
    expect(items[0].append).not.toHaveBeenCalledOnce();
    expect(items[0].before).not.toHaveBeenCalledOnce();
    expect(items[0].after).not.toHaveBeenCalledOnce();
})


test("can insert child (3)", () => {
    // 0   | 0
    //  1  |  1
    //   2 |   2
    //   4 |   3
    //     |   4

    const data0: TestItemData = { id: "Item0" };
    const data1: TestItemData = { id: "Item1", parentId: data0.id };
    const data2: TestItemData = { id: "Item2", parentId: data1.id };
    const data3: TestItemData = { id: "Item3", parentId: data1.id, previousId: data2.id };
    const data4: TestItemData = { id: "Item4", parentId: data1.id, previousId: data2.id };

    const items = renderActionable(data0, data1, data2, data4);

    const response = upsertAndReturnRoot(data3, items[0], createItem);

    expect(response!.id).toBe(data0.id);

    expect(updateMock).toHaveBeenCalledOnce();
    expect(updateMock).toHaveBeenCalledWith(data3);

    expect(items[2].append).not.toHaveBeenCalledOnce();
    expect(items[2].before).not.toHaveBeenCalledOnce();
    expect(items[2].after).toHaveBeenCalledOnce();
    const [afterItem] = (items[2].after as Mock).mock.calls[0]
    expect(getData(afterItem)).toMatchObject({...emptyObject, ...data3});
})

test("can update child (3)", () => {
    // 0
    //  1
    //   2
    //   3
    //   4

    const data0: TestItemData = { id: "Item0" };
    const data1: TestItemData = { id: "Item1", parentId: data0.id };
    const data2: TestItemData = { id: "Item2", parentId: data1.id };
    const data3: TestItemData = { id: "Item3", parentId: data1.id, previousId: data2.id };
    const data4: TestItemData = { id: "Item4", parentId: data1.id, previousId: data3.id };

    const items = renderActionable(data0, data1, data2, data3, data4);

    data3.foo = generateUId();
    data3.bar = generateUId();
    data3.baz = generateUId();

    const response = upsertAndReturnRoot(data3, items[0], createItem);

    expect(response!.id).toBe(data0.id);

    expect(items[3].update).toHaveBeenCalledOnce();
    expect(items[3].update).toHaveBeenCalledWith(data3);
    expect(appendMock).not.toHaveBeenCalledOnce();
    expect(beforeMock).not.toHaveBeenCalledOnce();
    expect(afterMock).not.toHaveBeenCalledOnce();
})

