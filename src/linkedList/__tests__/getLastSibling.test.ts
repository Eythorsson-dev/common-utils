import { expect, test } from "vitest"
import { getLastSibling } from "../getLastSibling"
import { ItemData, render } from "../item"
import { generateUId } from "../../utils"



test("Has children (0)", () => {
    // 0
    //  1
    //  2
    // 3
    // 4

    const data0: ItemData<string> = { id: "Block0", type: "test", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Block1", type: "test", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Block2", type: "test", parentId: data0.id, previousId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Block3", type: "test", parentId: undefined, previousId: data0.id, data: generateUId() }
    const data4: ItemData<string> = { id: "Block4", type: "test", parentId: undefined, previousId: data3.id, data: generateUId() }

    const items = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const response = getLastSibling(items[0]);
    expect(response!.id).toBe(data4.id);
})


test("Only child (0)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const data0: ItemData<string> = { id: "Block0", type: "test", parentId: undefined, data: generateUId() }
    const data1: ItemData<string> = { id: "Block1", type: "test", parentId: data0.id, data: generateUId() }
    const data2: ItemData<string> = { id: "Block2", type: "test", parentId: data1.id, data: generateUId() }
    const data3: ItemData<string> = { id: "Block3", type: "test", parentId: undefined, previousId: data0.id, data: generateUId() }
    const data4: ItemData<string> = { id: "Block4", type: "test", parentId: undefined, previousId: data3.id, data: generateUId() }

    const blocks = render(
        data0,
        data1,
        data2,
        data3,
        data4,
    );

    const response = getLastSibling(blocks[1]);

    expect(response.id).toBe(blocks[1].id)
})