import { test, expect } from "vitest";

import { validateList } from "../validateList";
import { ItemData } from "../item";
import { generateUId } from "../../utils";

test("Validates Valid List", () => {
    // 0
    // 1
    //  2
    //   3
    //  4
    //  5
    // 6

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", previousId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", type: "test", parentId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Item3", type: "test", parentId: data2.id, data: generateUId() }
    const data4: ItemData<string> = { id: "Item4", type: "test", parentId: data1.id, previousId: data2.id, data: generateUId() }
    const data5: ItemData<string> = { id: "Item5", type: "test", parentId: data1.id, previousId: data4.id, data: generateUId() }
    const data6: ItemData<string> = { id: "Item6", type: "test", previousId: data1.id, data: generateUId() }

    expect(() => validateList([data0, data1, data2, data3, data4, data5, data6])).not.toThrow()
})

test("Multiple roots -> Throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", data: generateUId() }

    expect(() => validateList([data0, data1])).toThrow()
})

test("No roots -> Throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", previousId: "NO_ITEM_1", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", parentId: "NO_ITEM_2", data: generateUId() }

    expect(() => validateList([data0, data1])).toThrow()
})

test("Multiple on same previous -> Throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", previousId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", type: "test", previousId: data0.id, data: generateUId() }

    expect(() => validateList([data0, data1, data2])).toThrow()
})

test("Multiple on same parent -> Throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", type: "test", parentId: data0.id, data: generateUId() }

    expect(() => validateList([data0, data1, data2])).toThrow()
})

test("Missing dependency (parent) -> Throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", parentId: "NO_ITEM", data: generateUId() }

    expect(() => validateList([data0, data1])).toThrow()
})

test("Missing dependency (previous) -> Throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", previousId: "NO_ITEM", data: generateUId() }

    expect(() => validateList([data0, data1])).toThrow()
})

test("Circular dependency (parent) -> throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", parentId: "Item2", data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", type: "test", parentId: "Item1", data: generateUId() }

    expect(() => validateList([data0, data1, data2]))
        .toThrow();
})

test("Circular dependency (previous) -> throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", previousId: "Item2", data: generateUId() }
    const data2: ItemData<string> = { id: "Item2", type: "test", previousId: "Item1", data: generateUId() }

    expect(() => validateList([data0, data1, data2]))
        .toThrow();
})

test("Duplicates -> throws", () => {

    const data0: ItemData<string> = { id: "Item0", type: "test", data: generateUId() }
    const data1: ItemData<string> = { id: "Item1", type: "test", previousId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Item1", type: "test", previousId: data0.id, data: generateUId() }

    expect(() => validateList([data0, data1, data2]))
        .toThrow();
})