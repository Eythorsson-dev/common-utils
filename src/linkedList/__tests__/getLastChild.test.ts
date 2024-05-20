// 0
//  1
//  2
//   3
// 4
//  5

import { describe, expect, test } from "vitest"
import { getLastChild } from "../getLastChild"
import { ItemData, render } from "../item"
import { generateUId } from "../../utils"

const data0: ItemData<string> = { id: "Block0", parentId: undefined, data: generateUId() }
const data1: ItemData<string> = { id: "Block1", parentId: data0.id, data: generateUId() }
const data2: ItemData<string> = { id: "Block2", parentId: data0.id, previousId: data1.id, data: generateUId() }
const data3: ItemData<string> = { id: "Block3", parentId: data2.id, data: generateUId() }
const data4: ItemData<string> = { id: "Block4", parentId: undefined, previousId: data0.id, data: generateUId() }
const data5: ItemData<string> = { id: "Block5", parentId: data4.id, data: generateUId() }

const [
    block0,
    block1,
    block2,
    block3,
    block4,
    block5
] = render(
    data0,
    data1,
    data2,
    data3,
    data4,
    data5
);


describe("getPreviousBlock", () => {

    test("Parent (0 -> 3)", () => {
        const lastChild = getLastChild(block0);
        expect(lastChild!.id).toBe(block3.id)
    })

    test("Child without child (1 -> undefined)", () => {
        const lastChild = getLastChild(block1);
        expect(lastChild).toBeUndefined();
    })

    test("Child With Child (2 -> 3)", () => {
        const lastChild = getLastChild(block2);
        expect(lastChild!.id).toBe(block3.id)
    })

    test("Root without children (4 -> 5)", () => {
        const lastChild = getLastChild(block4);
        expect(lastChild!.id).toBe(block5.id);
    })
})