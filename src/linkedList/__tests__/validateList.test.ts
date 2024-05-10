import { test, expect } from "vitest";

import { validateList } from "../validateList";
import { ItemData } from "../item";

test("Validates Valid List", () => {
    // 0
    // 1
    //  2
    //   3
    //  4
    //  5
    // 6

    const data0: ItemData = { id: "Item0" }
    const data1: ItemData = { id: "Item1", previousId: data0.id }
    const data2: ItemData = { id: "Item2", parentId: data1.id }
    const data3: ItemData = { id: "Item3", parentId: data2.id }
    const data4: ItemData = { id: "Item4", parentId: data1.id, previousId: data2.id }
    const data5: ItemData = { id: "Item5", parentId: data1.id, previousId: data4.id }
    const data6: ItemData = { id: "Item6", previousId: data1.id }

    expect(() => validateList([data0, data1, data2, data3, data4, data5, data6])).not.toThrow()
})

test("Multiple roots -> Throws", () => {

    const data0: ItemData = { id: "Item0" }
    const data1: ItemData = { id: "Item1" }

    expect(() => validateList([data0, data1])).toThrow()
})

test("No roots -> Throws", () => {

    const data0: ItemData = { id: "Item0", previousId: "NO_ITEM_1" }
    const data1: ItemData = { id: "Item1", parentId: "NO_ITEM_2" }

    expect(() => validateList([data0, data1])).toThrow()
})

test("Multiple on same previous node -> Throws", () => {

    const data0: ItemData = { id: "Item0" }
    const data1: ItemData = { id: "Item1", previousId: data0.id }
    const data2: ItemData = { id: "Item2", previousId: data0.id }

    expect(() => validateList([data0, data1, data2])).toThrow()
})

test("Multiple on same parent node -> Throws", () => {

    const data0: ItemData = { id: "Item0" }
    const data1: ItemData = { id: "Item1", parentId: data0.id }
    const data2: ItemData = { id: "Item2", parentId: data0.id }

    expect(() => validateList([data0, data1, data2])).toThrow()
})

test("unlined parent list -> Throws", () => {

    const data0: ItemData = { id: "Item0" }
    const data1: ItemData = { id: "Item1", parentId: "NO_ITEM"  }

    expect(() => validateList([data0, data1])).toThrow()
})

test("unlined previous list -> Throws", () => {

    const data0: ItemData = { id: "Item0" }
    const data1: ItemData = { id: "Item1", previousId: "NO_ITEM"  }

    expect(() => validateList([data0, data1])).toThrow()
})