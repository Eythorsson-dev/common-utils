// 0
//  1
//   2
//  3
//   4
//    5
//  6
// 7

import { describe, expect, test } from "vitest"
import { getPreviousWithoutChild } from "../getPreviousWithoutChild"
import { ItemData, render } from "../item"
import { generateUId } from "./utils"

const data0: ItemData<string> = { id: "Block0", parentId: undefined, data: generateUId() }
const data1: ItemData<string> = { id: "Block1", parentId: data0.id, data: generateUId() }
const data2: ItemData<string> = { id: "Block2", parentId: data1.id, data: generateUId() }
const data3: ItemData<string> = { id: "Block3", parentId: data0.id, previousId: data1.id, data: generateUId() }
const data4: ItemData<string> = { id: "Block4", parentId: data3.id, data: generateUId() }
const data5: ItemData<string> = { id: "Block5", parentId: data4.id, data: generateUId() }
const data6: ItemData<string> = { id: "Block6", parentId: data0.id, previousId: data3.id, data: generateUId() }
const data7: ItemData<string> = { id: "Block7", parentId: undefined, previousId: data0.id, data: generateUId() }

const [
    block0,
    block1,
    block2,
    block3,
    _,
    block5,
    block6,
    block7,
] = render(
    data0,
    data1,
    data2,
    data3,
    data4,
    data5,
    data6,
    data7,
);


describe("getNextBlock", () => {

    // 0
    //  1
    //   2
    //  3
    //   4
    //    5
    //  6
    // 7

    test("Root (0 -> undefined)", () => {
        const previous = getPreviousWithoutChild(block0);
        expect(previous).toBeUndefined()
    })

    test("first child of root (1 -> undefined)", () => {
        const previous = getPreviousWithoutChild(block1);
        expect(previous).toBeUndefined()
    })

    test("sibling of root first child (3 -> 2)", () => {
        const previous = getPreviousWithoutChild(block3);
        expect(previous!.id).toBe(block2.id)
    })
    test("nested child of sibling of root (5 -> 2)", () => {
        const previous = getPreviousWithoutChild(block5);
        expect(previous!.id).toBe(block2.id)
    })

    test("gets nested child (6 -> 5)", () => {
        const previous = getPreviousWithoutChild(block6);
        expect(previous!.id).toBe(block5.id)
    })

    test("Last Child (7 -> 6)", () => {
        const previous = getPreviousWithoutChild(block7);
        expect(previous!.id).toBe(block6.id)
    })
})