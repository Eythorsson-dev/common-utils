/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest";
import { ItemElement } from "../item";
import { generateUId } from "../../utils";
import { getNextOrChildByTarget } from "../getNextOrChildByTarget";

class TestElement extends ItemElement<string, TestElement> {
    #data: string | undefined;

    constructor(id: string, data: string) {
        super(id, "test")
        this.init(data);
    }

    get data(): string {
        return this.#data!;
    }

    update(data: string): void {
        this.#data = data;
    }

    render(data: string): HTMLElement {
        this.#data = data;

        const wrapper = document.createElement("div");
        wrapper.append(this.id)
        return wrapper;
    }


}

test("linked list does not contain target -> undefined", () => {
    const item0 = new TestElement("Item0", generateUId())
    const item1 = new TestElement("Item1", generateUId())

    const wrapper = document.createElement("div")
    wrapper.append(item0.target);

    item0.after(item1);

    expect(getNextOrChildByTarget(item0, document.createElement("div"))).toBeUndefined();
})

test("target is parent -> undefined", () => {
    const item0 = new TestElement("Item0", generateUId())
    const item1 = new TestElement("Item1", generateUId())

    const wrapper = document.createElement("div")
    wrapper.append(item0.target);

    item0.append(item1);

    expect(getNextOrChildByTarget(item1, item0.target)).toBeUndefined();
})

test("Can get root (0)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const item0 = new TestElement("Item0", generateUId())
    const item1 = new TestElement("Item1", generateUId())
    const item2 = new TestElement("Item2", generateUId())
    const item3 = new TestElement("Item3", generateUId())
    const item4 = new TestElement("Item4", generateUId())

    const wrapper = document.createElement("div")
    wrapper.append(item0.target);

    item0.append(item1);
    item1.append(item2);
    item0.after(item3);
    item3.after(item4);

    const response = getNextOrChildByTarget(item0, item0.target.firstChild!);

    expect(response!.id).toBe(item0.id);
})


test("Can get nested child (2)", () => {
    // 0
    //  1
    //   2
    // 3
    // 4

    const item0 = new TestElement("Item0", generateUId())
    const item1 = new TestElement("Item1", generateUId())
    const item2 = new TestElement("Item2", generateUId())
    const item3 = new TestElement("Item3", generateUId())
    const item4 = new TestElement("Item4", generateUId())

    const wrapper = document.createElement("div")
    wrapper.append(item0.target);

    item0.append(item1);
    item1.append(item2);
    item0.after(item3);
    item3.after(item4);

    const response = getNextOrChildByTarget(item0, item2.target.firstChild!);

    expect(response!.id).toBe(item2.id);
})

test("Can get nested child sibling (3)", () => {
    // 0
    //  1
    //   2
    //   3
    // 4

    const item0 = new TestElement("Item0", generateUId())
    const item1 = new TestElement("Item1", generateUId())
    const item2 = new TestElement("Item2", generateUId())
    const item3 = new TestElement("Item3", generateUId())
    const item4 = new TestElement("Item4", generateUId())

    const wrapper = document.createElement("div")
    wrapper.append(item0.target);

    item0.append(item1);
    item1.append(item2);
    item2.after(item3);
    item0.after(item4);

    const response = getNextOrChildByTarget(item0, item3.target.firstChild!);

    expect(response!.id).toBe(item3.id);
})


test("Can get last (0-3)", () => {
    // 0
    //  1
    //  2
    // 3
    // 4

    const item0 = new TestElement("Item0", generateUId())
    const item1 = new TestElement("Item1", generateUId())
    const item2 = new TestElement("Item2", generateUId())
    const item3 = new TestElement("Item3", generateUId())
    const item4 = new TestElement("Item4", generateUId())

    const wrapper = document.createElement("div")
    wrapper.append(item0.target);

    item0.append(item1);
    item1.after(item2);
    item0.after(item3);
    item0.after(item4);

    const response = getNextOrChildByTarget(item0, item4.target.firstChild!);

    expect(response!.id).toBe(item4.id);
})