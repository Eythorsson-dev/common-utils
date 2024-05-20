import { expect, test } from "vitest"
import { getItemsBetween } from "../getItemsBetween"
import { generateUId } from "../../utils"
import { ItemData, render } from "../item"



test("First has children (0-3)", () => {
    // 0
    //  1
    //  2
    // 3
    // 4

    const data0: ItemData<string> = { id: "Item0", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", parentId: data0.id, previousId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Item3", parentId: undefined, previousId: data0.id, data: generateUId() }
    const data4: ItemData<string> = { id: "Item4", parentId: undefined, previousId: data3.id, data: generateUId() }

    const items = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const response = getItemsBetween(items[0], items[3]);

    expect(response.map(x => x.id)).toMatchObject([
        items[0].id,
        items[1].id,
        items[2].id,
        items[3].id,
    ])
})


test("First has nested children (0-3)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const data0: ItemData<any> = { id: "Item0", parentId: undefined, data: generateUId() };
    const data1: ItemData<any> = { id: "Item1", parentId: data0.id, data: generateUId() };
    const data2: ItemData<any> = { id: "Item2", parentId: data1.id, data: generateUId() };
    const data3: ItemData<any> = { id: "Item3", parentId: undefined, previousId: data0.id, data: generateUId() };
    const data4: ItemData<any> = { id: "Item4", parentId: undefined, previousId: data3.id, data: generateUId() };

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const items = getItemsBetween(blocks[0], blocks[3]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[0].id,
        blocks[1].id,
        blocks[2].id,
        blocks[3].id,
    ])
})

test("Start is child (1-3)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const data0: ItemData<any> = { id: "Item0", parentId: undefined, data: generateUId() };
    const data1: ItemData<any> = { id: "Item1", parentId: data0.id, data: generateUId() };
    const data2: ItemData<any> = { id: "Item2", parentId: data1.id, data: generateUId() };
    const data3: ItemData<any> = { id: "Item3", parentId: undefined, previousId: data0.id, data: generateUId() };
    const data4: ItemData<any> = { id: "Item4", parentId: undefined, previousId: data3.id, data: generateUId() };

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const items = getItemsBetween(blocks[1], blocks[3]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[1].id,
        blocks[2].id,
        blocks[3].id,
    ])
})

test("Start is child (2-3)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const data0: ItemData<any> = { id: "Item0", parentId: undefined, data: generateUId() };
    const data1: ItemData<any> = { id: "Item1", parentId: data0.id, data: generateUId() };
    const data2: ItemData<any> = { id: "Item2", parentId: data1.id, data: generateUId() };
    const data3: ItemData<any> = { id: "Item3", parentId: undefined, previousId: data0.id, data: generateUId() };
    const data4: ItemData<any> = { id: "Item4", parentId: undefined, previousId: data3.id, data: generateUId() };

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const items = getItemsBetween(blocks[2], blocks[3]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[2].id,
        blocks[3].id,
    ])
})

test("End is child (0-2)", () => {
    // 0
    // 1
    //  2
    //   3
    // 4

    const data0: ItemData<any> = { id: "Item0", parentId: undefined, data: generateUId() };
    const data1: ItemData<any> = { id: "Item1", parentId: undefined, previousId: data0.id, data: generateUId() };
    const data2: ItemData<any> = { id: "Item2", parentId: data1.id, data: generateUId() };
    const data3: ItemData<any> = { id: "Item3", parentId: data2.id, data: generateUId() };
    const data4: ItemData<any> = { id: "Item4", parentId: undefined, previousId: data1.id, data: generateUId() };

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const items = getItemsBetween(blocks[0], blocks[2]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[0].id,
        blocks[1].id,
        blocks[2].id,
    ])
})

test("End is child (0-2)", () => {
    // 0
    // 1
    //  2
    //   3
    // 4

    const data0: ItemData<any> = { id: "Item0", parentId: undefined, data: generateUId() };
    const data1: ItemData<any> = { id: "Item1", parentId: undefined, previousId: data0.id, data: generateUId() };
    const data2: ItemData<any> = { id: "Item2", parentId: data1.id, data: generateUId() };
    const data3: ItemData<any> = { id: "Item3", parentId: data2.id, data: generateUId() };
    const data4: ItemData<any> = { id: "Item4", parentId: undefined, previousId: data1.id, data: generateUId() };

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const items = getItemsBetween(blocks[0], blocks[2]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[0].id,
        blocks[1].id,
        blocks[2].id,
    ])
})

test("Start and end is child (1-3)", () => {
    // 0
    //  1
    // 2
    //  3
    // 4

    const data0: ItemData<any> = { id: "Item0", parentId: undefined, data: generateUId() };
    const data1: ItemData<any> = { id: "Item1", parentId: undefined, previousId: data0.id, data: generateUId() };
    const data2: ItemData<any> = { id: "Item2", parentId: data1.id, data: generateUId() };
    const data3: ItemData<any> = { id: "Item3", parentId: data2.id, data: generateUId() };
    const data4: ItemData<any> = { id: "Item4", parentId: undefined, previousId: data1.id, data: generateUId() };

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const items = getItemsBetween(blocks[1], blocks[3]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[1].id,
        blocks[2].id,
        blocks[3].id,
    ])
})