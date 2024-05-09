import { expect, test } from "vitest"
import { getNextSiblings } from "../getNextSiblings"
import { ItemData, render } from "../item"



test("Has children (0)", () => {
    // 0
    //  1
    //  2
    // 3
    // 4

    const data0: ItemData = { id: "Block0", parentId: undefined }
    const data1: ItemData = { id: "Block1", parentId: data0.id }
    const data2: ItemData = { id: "Block2", parentId: data0.id, previousId: data1.id }
    const data3: ItemData = { id: "Block3", parentId: undefined, previousId: data0.id }
    const data4: ItemData = { id: "Block4", parentId: undefined, previousId: data3.id }

    const items = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const response = getNextSiblings(items[0]);

    expect(response.map(x => x.id)).toMatchObject([
        items[3].id,
        items[4].id,
    ])
})


test("Has nested children (0)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const data0: ItemData = { id: "Block0", parentId: undefined }
    const data1: ItemData = { id: "Block1", parentId: data0.id }
    const data2: ItemData = { id: "Block2", parentId: data1.id }
    const data3: ItemData = { id: "Block3", parentId: undefined, previousId: data0.id }
    const data4: ItemData = { id: "Block4", parentId: undefined, previousId: data3.id }

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const items = getNextSiblings(blocks[0]);

    expect(items.map(x => x.id)).toMatchObject([
        blocks[3].id,
        blocks[4].id,
    ])
})

test("Is child (1)", () => {
    // 0
    //  1
    //   2
    //  3
    // 4

    const data0: ItemData = { id: "Block0", parentId: undefined }
    const data1: ItemData = { id: "Block1", parentId: data0.id }
    const data2: ItemData = { id: "Block2", parentId: data1.id }
    const data3: ItemData = { id: "Block3", parentId: data0.id, previousId: data1.id }
    const data4: ItemData = { id: "Block4", parentId: undefined, previousId: data0.id }

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const items = getNextSiblings(blocks[1]);

    expect(items.map(x => x.id)).toMatchObject([
        data3.id
    ])
})