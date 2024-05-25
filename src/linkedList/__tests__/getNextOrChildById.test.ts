import { getNextOrChildById } from "../getNextOrChildById"
import { ItemData, render } from "../item"
import { expect, test } from "vitest"
import { generateUId } from "../../utils"



test("Can get root (0)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const data0: ItemData<string> = { id: "Item0",  type: "test", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Item1",  type: "test", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2",  type: "test", parentId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Item3",  type: "test", parentId: undefined, previousId: data0.id, data: generateUId() }
    const data4: ItemData<string> = { id: "Item4",  type: "test", parentId: undefined, previousId: data3.id, data: generateUId() }

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

    const data0: ItemData<string> = { id: "Item0",  type: "test", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Item1",  type: "test", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2",  type: "test", parentId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Item3",  type: "test", parentId: undefined, previousId: data0.id, data: generateUId() }
    const data4: ItemData<string> = { id: "Item4",  type: "test", parentId: undefined, previousId: data3.id, data: generateUId() }

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

    const data0: ItemData<string> = { id: "Item0",  type: "test", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Item1",  type: "test", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2",  type: "test", parentId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Item3",  type: "test", parentId: data1.id, previousId: data2.id, data: generateUId() }
    const data4: ItemData<string> = { id: "Item4",  type: "test", parentId: undefined, previousId: data0.id, data: generateUId() }

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

    const data0: ItemData<string> = { id: "Item0",  type: "test", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Item1",  type: "test", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2",  type: "test", parentId: data0.id, previousId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Item3",  type: "test", parentId: undefined, previousId: data0.id, data: generateUId() }
    const data4: ItemData<string> = { id: "Item4",  type: "test", parentId: undefined, previousId: data3.id, data: generateUId() }

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