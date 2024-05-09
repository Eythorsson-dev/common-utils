import { getNextOrChildById } from "../getNextOrChildById"
import { ItemData, render } from "../item"
import { expect, test } from "vitest"



test("Can get root (0)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const data0: ItemData = { id: "Item0", parentId: undefined }
    const data1: ItemData = { id: "Item1", parentId: data0.id }
    const data2: ItemData = { id: "Item2", parentId: data1.id }
    const data3: ItemData = { id: "Item3", parentId: undefined, previousId: data0.id }
    const data4: ItemData = { id: "Item4", parentId: undefined, previousId: data3.id }

    const items = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const response = getNextOrChildById(items[0], items[0].id);

    expect(response).toMatchObject(items[0])
})


test("Can get nested child (2)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const data0: ItemData = { id: "Item0", parentId: undefined }
    const data1: ItemData = { id: "Item1", parentId: data0.id }
    const data2: ItemData = { id: "Item2", parentId: data1.id }
    const data3: ItemData = { id: "Item3", parentId: undefined, previousId: data0.id }
    const data4: ItemData = { id: "Item4", parentId: undefined, previousId: data3.id }

    const items = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const response = getNextOrChildById(items[0], items[2].id);

    expect(response).toMatchObject(items[2])
})

test("Can get nested child sibling (3)", () => {
    // 0
    //  1
    //   2
    //   3
    // 4

    const data0: ItemData = { id: "Item0", parentId: undefined }
    const data1: ItemData = { id: "Item1", parentId: data0.id }
    const data2: ItemData = { id: "Item2", parentId: data1.id }
    const data3: ItemData = { id: "Item3", parentId: data1.id, previousId: data2.id }
    const data4: ItemData = { id: "Item4", parentId: undefined, previousId: data0.id }

    const items = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const response = getNextOrChildById(items[0], items[3].id);

    expect(response).toMatchObject(items[3])
})


test("Can get last (0-3)", () => {
    // 0
    //  1
    //  2
    // 3
    // 4

    const data0: ItemData = { id: "Item0", parentId: undefined }
    const data1: ItemData = { id: "Item1", parentId: data0.id }
    const data2: ItemData = { id: "Item2", parentId: data0.id, previousId: data1.id }
    const data3: ItemData = { id: "Item3", parentId: undefined, previousId: data0.id }
    const data4: ItemData = { id: "Item4", parentId: undefined, previousId: data3.id }

    const items = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const response = getNextOrChildById(items[0], items[4].id);

    expect(response).toMatchObject(items[4])
})