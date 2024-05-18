import { test, expect, describe, vi, beforeEach, Mock } from "vitest";
import { upsertAndReturnRoot } from "../upsertAndReturnRoot"
import { ActionableItem, Item, ItemData, ItemElement } from "../item";
import { generateUId } from "./utils";
import { validateList } from "../validateList"
import { getNextOrChildById } from "../getNextOrChildById";

interface TestItemData {
    foo?: string,
    bar?: string,
    baz?: string
}

const appendMock = vi.fn();
const beforeMock = vi.fn();
const afterMock = vi.fn();
const updateMock = vi.fn();
const removeMock = vi.fn();


function createItem(item: ItemData<TestItemData>): ActionableItem<TestItemData, any> {
    return {
        id: item.id,
        parentItem: item.parentId && { id: item.parentId! } as any,
        nextItem: item.nextId && { id: item.nextId! } as any,
        previousItem: item.previousId && { id: item.previousId! } as any,
        firstChildItem: item.firstChildId && { id: item.firstChildId! } as any,
        data: item.data,
        append: appendMock,
        before: beforeMock,
        after: afterMock,
        update: updateMock,
        remove: removeMock
    };
}


export function renderActionable<TItem extends ItemData<TestItemData>>(...items: TItem[]): ActionableItem<TestItemData, any>[] {
    validateList(items);

    const itemById = items.reduce((obj, curr) => {
        obj[curr.id] = {
            ...curr,
            append: vi.fn(),
            before: vi.fn(),
            after: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),

            get data(): TestItemData { return curr.data },
            get parentItem() { return obj[curr.parentId!] },
            get nextItem() { return obj[curr.nextId ?? items.find(x => x.previousId == curr.id)?.id!] },
            get previousItem() { return obj[curr.previousId ?? items.find(x => x.nextId == curr.id)?.id!] },
            get firstChildItem() { return obj[curr.firstChildId ?? items.find(x => x.parentId == curr.id && x.previousId == undefined)?.id!] },
        };

        return obj
    }, {} as { [key: string]: ActionableItem<TestItemData, any> })

    return items.map(x => itemById[x.id]);
}

function getData<T extends ActionableItem<any, T>>(item: T): ItemData<any> {
    const { append, before, after, update: update, remove, firstChildItem, parentItem, nextItem, previousItem, ...data } = item;

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
    const data0: ItemData<TestItemData> = { id: "Item0", parentId: "Item1", data: {} };

    expect(() => upsertAndReturnRoot(data0, undefined, createItem)).toThrow()
})

test("no root + data(prev) throws", () => {
    const data0: ItemData<TestItemData> = { id: "Item0", previousId: "Item1", data: {} };

    expect(() => upsertAndReturnRoot(data0, undefined, createItem)).toThrow()
})

test("can create root", () => {
    const data0: ItemData<TestItemData> = { id: "Item0", data: {} };

    expect(upsertAndReturnRoot(data0, undefined, createItem)?.id).toBe(data0.id);
})

test("can update root", () => {
    const data0: ItemData<TestItemData> = { id: "Item0", data: { foo: generateUId() } };

    const items = renderActionable(data0);

    data0.data.foo = generateUId();
    data0.data.bar = generateUId();
    data0.data.baz = generateUId();

    const response = upsertAndReturnRoot(data0, items[0], createItem);

    expect(response!.id).toBe(data0.id);
    expect(response?.append).not.toHaveBeenCalledOnce();
    expect(response?.before).not.toHaveBeenCalledOnce();
    expect(response?.after).not.toHaveBeenCalledOnce();
    expect(response?.update).toHaveBeenCalledOnce();
    expect(response?.update).toHaveBeenCalledWith(data0.data);
})

test("can insert sibling", () => {
    const data0: ItemData<TestItemData> = { id: "Item0", data: {} };
    const data1: ItemData<TestItemData> = { id: "Item1", previousId: data0.id, data: {} };
    const data2: ItemData<TestItemData> = { id: "Item2", previousId: data0.id, data: {} };

    const items = renderActionable(data0, data2);

    const response = upsertAndReturnRoot(data1, items[0], createItem);

    expect(response!.id).toBe(data0.id);

    expect(updateMock).toHaveBeenCalledOnce();
    expect(updateMock).toHaveBeenCalledWith(data1.data);
    expect(items[0].append).not.toHaveBeenCalledOnce();
    expect(items[0].before).not.toHaveBeenCalledOnce();
    expect(items[0].after).toHaveBeenCalledOnce();
    const [afterItem] = (items[0].after as Mock).mock.calls[0]
    expect(getData(afterItem)).toMatchObject({ ...emptyObject, ...data1 });
})

test("can update sibling", () => {
    const data0: ItemData<TestItemData> = { id: "Item0", data: {} };
    const data1: ItemData<TestItemData> = { id: "Item1", previousId: data0.id, data: {} };
    const data2: ItemData<TestItemData> = { id: "Item2", previousId: data1.id, data: {} };

    const items = renderActionable(data0, data1, data2);

    data1.data.foo = generateUId();
    data1.data.bar = generateUId();
    data1.data.baz = generateUId();

    const response = upsertAndReturnRoot(data1, items[0], createItem);

    expect(response!.id).toBe(data0.id);

    expect(items[1].update).toHaveBeenCalledOnce();
    expect(items[1].update).toHaveBeenCalledWith(data1.data);
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

    const data0: ItemData<TestItemData> = { id: "Item0", data: {} };
    const data1: ItemData<TestItemData> = { id: "Item1", parentId: data0.id, data: {} };
    const data2: ItemData<TestItemData> = { id: "Item2", parentId: data1.id, data: {} };
    const data3: ItemData<TestItemData> = { id: "Item3", parentId: data1.id, previousId: data2.id, data: {} };
    const data4: ItemData<TestItemData> = { id: "Item4", parentId: data1.id, previousId: data2.id, data: {} };

    const items = renderActionable(data0, data1, data2, data4);

    const response = upsertAndReturnRoot(data3, items[0], createItem);

    expect(response!.id).toBe(data0.id);

    expect(updateMock).toHaveBeenCalledOnce();
    expect(updateMock).toHaveBeenCalledWith(data3.data);

    expect(items[2].append).not.toHaveBeenCalledOnce();
    expect(items[2].before).not.toHaveBeenCalledOnce();
    expect(items[2].after).toHaveBeenCalledOnce();
    const [afterItem] = (items[2].after as Mock).mock.calls[0]
    expect(getData(afterItem)).toMatchObject({ ...emptyObject, ...data3 });
})

test("can update child (3)", () => {
    // 0
    //  1
    //   2
    //   3
    //   4

    const data0: ItemData<TestItemData> = { id: "Item0", data: {} };
    const data1: ItemData<TestItemData> = { id: "Item1", parentId: data0.id, data: {} };
    const data2: ItemData<TestItemData> = { id: "Item2", parentId: data1.id, data: {} };
    const data3: ItemData<TestItemData> = { id: "Item3", parentId: data1.id, previousId: data2.id, data: {} };
    const data4: ItemData<TestItemData> = { id: "Item4", parentId: data1.id, previousId: data3.id, data: {} };

    const items = renderActionable(data0, data1, data2, data3, data4);

    data3.data.foo = generateUId();
    data3.data.bar = generateUId();
    data3.data.baz = generateUId();

    const response = upsertAndReturnRoot(data3, items[0], createItem);

    expect(response!.id).toBe(data0.id);

    expect(items[3].update).toHaveBeenCalledOnce();
    expect(items[3].update).toHaveBeenCalledWith(data3.data);
    expect(appendMock).not.toHaveBeenCalledOnce();
    expect(beforeMock).not.toHaveBeenCalledOnce();
    expect(afterMock).not.toHaveBeenCalledOnce();
})



class TestItemElement extends ItemElement<any, any> {
    private _data: any
    get data(): any { return this._data }
    update(data: any): void {
        this._data = data;
    }
    render(data: any): HTMLElement {
        this._data = data;
        const div = document.createElement("div");
        div.append(this.id);
        return div;
    }

}

describe("IntegrationTest", () => {

    function getData<T extends Item<T, any>>(block: T): ItemData<any>[] {
        if (!block) return [];

        const response: ItemData<any>[] = [{
            id: block.id,
            parentId: block.parentItem?.id,
            previousId: block.previousItem?.id,
            data: block.data
        }];

        if (block.firstChildItem) response.push(...getData(block.firstChildItem));
        if (block.nextItem) response.push(...getData(block.nextItem));

        return response;
    }

    // @vitest-environment jsdom
    test.each([
        { description: "Root after sibling", itemId: "item0", previousId: "item1" },
        { description: "Root to nested child of sibling", itemId: "item0", previousId: "item3" },
        { description: "Parent to sibling of nested child", itemId: "item1", previousId: "item3" },
        { description: "Child to new Parent", itemId: "item2", previousId: "item5" },
    ])("Can Move: $description", ({ itemId, previousId }) => {
        const data0: ItemData<TestItemData> = { id: "item0", parentId: undefined, data: {} }
        const data1: ItemData<TestItemData> = { id: "item1", parentId: undefined, previousId: data0.id, data: {} }
        const data2: ItemData<TestItemData> = { id: "item2", parentId: undefined, previousId: data1.id, data: {} }
        const data3: ItemData<TestItemData> = { id: "item3", parentId: data2.id, data: {} }
        const data4: ItemData<TestItemData> = { id: "item4", parentId: data2.id, previousId: data3.id, data: {} }
        const data5: ItemData<TestItemData> = { id: "item5", parentId: undefined, previousId: data2.id, data: {} }

        let root: TestItemElement | undefined = undefined;
        const data = [data0, data1, data2, data3, data4, data5];
        data.forEach(data => root = upsertAndReturnRoot(data, root, x => new TestItemElement(x.id, undefined)))

        const itemDataToMove = data.find(x => x.id == itemId)!;
        const prevBlockData = data.find(x => x.id == previousId)!;

        const response = upsertAndReturnRoot({
            ...itemDataToMove,
            previousId: prevBlockData.id,
            parentId: prevBlockData.id
        }, root, x => new TestItemElement(x.id, undefined));

        const currBlock = getNextOrChildById(response, itemDataToMove.id);
        const prevBlock = getNextOrChildById(response, prevBlockData.id);

        console.log(itemId, previousId)
        expect(currBlock?.id).toBe(itemId)
        expect(prevBlock!.id).toBe(previousId)
        expect(currBlock?.id).toBe(prevBlock!.nextItem!.id)
    });

    // @vitest-environment jsdom
    test("Can Move -> Previous is root block, current has children", () => {

        // 0   ->  1
        // 1   ->   2
        //  2  ->   3
        //  3  ->  0



        const data0: ItemData<TestItemData> = { data: { }, id: "item0", parentId: undefined, }
        const data1: ItemData<TestItemData> = { data: { }, id: "item1", parentId: undefined, previousId: data0.id }
        const data2: ItemData<TestItemData> = { data: { }, id: "item2", parentId: data1.id }
        const data3: ItemData<TestItemData> = { data: { }, id: "item3", parentId: data1.id, previousId: data2.id }

        let root: TestItemElement | undefined = undefined;
        const data = [data0, data1, data2, data3];
        data.forEach(data => root = upsertAndReturnRoot(data, root, x => new TestItemElement(x.id, undefined)))

        const response = upsertAndReturnRoot({
            ...data1,
            previousId: undefined,
            parentId: undefined
        }, root, x => new TestItemElement(x.id, undefined));


        const movedBlock = getNextOrChildById(response, data1.id)!;
        const nextBlock = getNextOrChildById(response, data0.id)!;

        expect(movedBlock.nextItem!.target).toBe(nextBlock.target);

        expect(getData(response)).toMatchObject([
            { ...data1, parentId: undefined, previousId: undefined },
            { ...data2 },
            { ...data3 },
            { ...data0, parentId: undefined, previousId: data1.id },
        ])
    })
    
    // @vitest-environment jsdom
    test("Can Move -> Previous block (with children)", () => {
        // 0       0
        //  1       1
        // 2   ->  4
        //  3      2
        // 4        3

        const data0: ItemData<TestItemData> = { data: { }, id: "block0", parentId: undefined, }
        const data1: ItemData<TestItemData> = { data: { }, id: "block1", parentId: data0.id }
        const data2: ItemData<TestItemData> = { data: { }, id: "block2", parentId: undefined, previousId: data0.id }
        const data3: ItemData<TestItemData> = { data: { }, id: "block3", parentId: data2.id }
        const data4: ItemData<TestItemData> = { data: { }, id: "block4", parentId: undefined, previousId: data2.id }

        let root: TestItemElement | undefined = undefined;
        const data = [data0, data1, data2, data3, data4 ];
        data.forEach(data => root = upsertAndReturnRoot(data, root, x => new TestItemElement(x.id, undefined)))

        const response = upsertAndReturnRoot({
            ...data2,
            previousId: data4.id,
            parentId: undefined
        }, root, x => new TestItemElement(x.id, undefined));


        const movedBlock = getNextOrChildById(response, data2.id)!;
        const prevBlock = getNextOrChildById(response, data4.id)!;

        expect(movedBlock.previousItem!.target).toBe(prevBlock.target);

        expect(getData(response)).toMatchObject([
            { ...data0, parentId: undefined, previousId: undefined },
            { ...data1, parentId: data0.id, previousId: undefined },
            { ...data4, parentId: undefined, previousId: data0.id },
            { ...data2, parentId: undefined, previousId: data4.id },
            { ...data3 },
        ])
    })
    
    // @vitest-environment jsdom
    test("Can Move -> Current has children, moved after next", () => {
        // 0       0  
        // 1       4  
        //  2  ->  1  
        //  3       2 
        // 4        3 
 
        const data0: ItemData<TestItemData> = { data: {}, id: "item0", parentId: undefined, }
        const data1: ItemData<TestItemData> = { data: {}, id: "item1", parentId: undefined, previousId: data0.id }
        const data2: ItemData<TestItemData> = { data: {}, id: "item2", parentId: data1.id }
        const data3: ItemData<TestItemData> = { data: {}, id: "item3", parentId: data1.id, previousId: data2.id }
        const data4: ItemData<TestItemData> = { data: {}, id: "item4", parentId: undefined, previousId: data1.id }

        let root: TestItemElement | undefined = undefined;
        const data = [data0, data1, data2, data3, data4];
        data.forEach(data => root = upsertAndReturnRoot(data, root, x => new TestItemElement(x.id, undefined)))


        const response = upsertAndReturnRoot({
            ...data1,
            previousId: data4.id,
            parentId: undefined
        }, root, x => new TestItemElement(x.id, undefined));


        const movedBlock = getNextOrChildById(response, data1.id)!;
        const prevBlock = getNextOrChildById(response, data4.id)!;

        expect(movedBlock.previousItem!.target).toBe(prevBlock.target);
        
        expect(getData(response)).toMatchObject([
            { ...data0, parentId: undefined, previousId: undefined },
            { ...data4, parentId: undefined, previousId: data0.id },
            { ...data1, parentId: undefined, previousId: data4.id },
            { ...data2 },
            { ...data3 },
        ])
    })
})
