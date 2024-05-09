// 0
//  1
//  2
//   3
// 4

import { describe, expect, test } from "vitest"
import { getNextBlock } from "../getNextBlock"
import { ItemData, render } from "../item"

const data0: ItemData = { id: "Block0", parentId: undefined }
const data1: ItemData = { id: "Block1", parentId: data0.id }
const data2: ItemData = { id: "Block2", parentId: data0.id, previousId: data1.id }
const data3: ItemData = { id: "Block3", parentId: data2.id }
const data4: ItemData = { id: "Block4", parentId: undefined, previousId: data0.id }

const [
    block0,
    block1,
    block2,
    block3,
    block4
] = render(
    data0,
    data1,
    data2,
    data3,
    data4,
);


describe("getNextBlock", () => {

    test("First Child (0 -> 1)", () => {
        const next = getNextBlock(block0);
        expect(next!.id).toBe(block1.id)
    })

    test("Next Sibling (1 -> 2)", () => {
        const next = getNextBlock(block1);
        expect(next!.id).toBe(block2.id)
    })

    test("Parent Sibling (3 -> 4)", () => {
        const next = getNextBlock(block3);
        expect(next!.id).toBe(block4.id)
    })

    test("Last Child (4 -> Undefined)", () => {
        const next = getNextBlock(block4);
        expect(next).toBe(undefined)
    })
})