import { expect, test } from "vitest"
import { getChildItems } from "../getChildItems"
import { ItemData, render } from "../item"
import { generateUId } from "../../utils"


test("Has no children (1)", () => {
    // 0
    // 1
    // 2

    const data0: ItemData<string> = { id: "Item0", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", parentId: undefined, previousId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", parentId: undefined, previousId: data1.id, data: generateUId() }

    const blocks = render(
        data0,
        data1,
        data2,
    );

    const items = getChildItems(blocks[1]);

    expect(items.map(x => x.id)).toMatchObject([])
})

test("First has flat children (0)", () => {
    // 0
    //  1
    //  2
    // 3

    const data0: ItemData<string> = { id: "Item0", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", parentId: data0.id, previousId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Item3", parentId: undefined, previousId: data0.id, data: generateUId() }

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
    );
    const items = getChildItems(blocks[0]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[1].id,
        blocks[2].id,
    ])
})


test("First has nested children (0)", () => {
    // 0
    //  1
    //   2
    // 3

    const data0: ItemData<string> = { id: "Item0", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", parentId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Item3", parentId: undefined, previousId: data0.id, data: generateUId() }

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
    );

    const items = getChildItems(blocks[0]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[1].id,
        blocks[2].id,
    ])
})