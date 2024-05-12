import { test, expect, vi, beforeEach, type Mock} from "vitest";

import { sortList } from "../sortList";
import { ItemData } from "../item";
import { validateList } from "../validateList";

vi.mock("../validateList");

beforeEach(()=>{
    (validateList as Mock<any>).mockClear();
})

test("Can sort list", () => {
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

    expect(
        sortList(
            [
                data1,
                data5,
                data3,
                data6,
                data4,
                data0,
                data2
            ]
        ).map(x => x.id)
    ).toMatchObject([
        data0.id,
        data1.id,
        data2.id,
        data3.id,
        data4.id,
        data5.id,
        data6.id,
    ])
})

test("Validates List", () => {
    const data0: ItemData = { id: "Item0" }
    const data1: ItemData = { id: "Item1", previousId: data0.id }

    const items = [data1, data0];
    sortList(items);

    expect(validateList).toHaveBeenCalledOnce();
    expect(validateList).toBeCalledWith(items);
})