// 0
//  1
//  2
//   3
// 4

import { describe, expect, test } from "vitest"
import { getNextItem } from "../getNextItem"
import { ItemData, render } from "../item"
import { generateUId } from "../../utils"

const data0: ItemData<string> = { id: "Block0", type: "test", parentId: undefined, data: generateUId() }
const data1: ItemData<string> = { id: "Block1", type: "test", parentId: data0.id, data: generateUId() }
const data2: ItemData<string> = { id: "Block2", type: "test", parentId: data0.id, previousId: data1.id, data: generateUId() }
const data3: ItemData<string> = { id: "Block3", type: "test", parentId: data2.id, data: generateUId() }
const data4: ItemData<string> = { id: "Block4", type: "test", parentId: undefined, previousId: data0.id, data: generateUId() }

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
        const next = getNextItem(block0);
        expect(next!.id).toBe(block1.id)
    })

    test("Next Sibling (1 -> 2)", () => {
        const next = getNextItem(block1);
        expect(next!.id).toBe(block2.id)
    })

    test("Parent Sibling (3 -> 4)", () => {
        const next = getNextItem(block3);
        expect(next!.id).toBe(block4.id)
    })

    test("Last Child (4 -> Undefined)", () => {
        const next = getNextItem(block4);
        expect(next).toBe(undefined)
    })
})

describe("getNextBlock - Ignore children", () => {

    test("Current has child (0 -> 4)", () => {
        const next = getNextItem(block0, { ignoreChildren: true });
        expect(next!.id).toBe(block4.id)
    })

    test("Current has not children (1 -> 2)", () => {
        const next = getNextItem(block1, { ignoreChildren: true });
        expect(next!.id).toBe(block2.id)
    })

    test("Parent Sibling (3 -> 4)", () => {
        const next = getNextItem(block3, { ignoreChildren: true });
        expect(next!.id).toBe(block4.id)
    })

    test("Last Child (4 -> Undefined)", () => {
        const next = getNextItem(block4, { ignoreChildren: true });
        expect(next).toBe(undefined)
    })
})