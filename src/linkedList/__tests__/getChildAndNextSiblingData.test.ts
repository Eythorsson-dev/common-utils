import { expect, test } from "vitest";
import { ItemElement } from "../item";
import { generateUId } from "../../utils";
import { getChildAndNextSiblingData } from "../getChildAndNextSiblingData";


interface Data {
    foo: string,
    bar: string
}

class TestElement extends ItemElement<Data, TestElement> {
    private _data: Data | undefined;

    get data(): Data {
        return this._data!;
    }

    update(data: Data): void {
        this._data = data;
    }

    render(data: Data): HTMLElement {
        this._data = data;

        const wrapper = document.createElement("div");
        wrapper.append(this.id)
        return wrapper;
    }

}

// @vitest-environment jsdom
test("Can get", () => {
    // 0
    // 1
    //  2
    //   3
    //  4
    //  5
    // 6

    const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
    const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
    const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })
    const item3 = new TestElement("Item3", { foo: generateUId(), bar: generateUId() })
    const item4 = new TestElement("Item4", { foo: generateUId(), bar: generateUId() })
    const item5 = new TestElement("Item5", { foo: generateUId(), bar: generateUId() })
    const item6 = new TestElement("Item6", { foo: generateUId(), bar: generateUId() })

    const wrapper = document.createElement("div")
    wrapper.append(item0.target);

    item0.after(item1);
    item1.after(item6);
    item1.append(item2);
    item2.append(item3);
    item1.append(item4);
    item1.append(item5);

    expect(getChildAndNextSiblingData(item0)).toMatchObject([
        { id: "Item0", parentId: undefined, previousId: undefined, data: item0.data },
        { id: "Item1", parentId: undefined, previousId: item0.id, data: item1.data },
        { id: "Item2", parentId: item1.id, previousId: undefined, data: item2.data },
        { id: "Item3", parentId: item2.id, previousId: undefined, data: item3.data },
        { id: "Item4", parentId: item1.id, previousId: item2.id, data: item4.data },
        { id: "Item5", parentId: item1.id, previousId: item4.id, data: item5.data },
        { id: "Item6", parentId: undefined, previousId: item1.id, data: item6.data },
    ])
})