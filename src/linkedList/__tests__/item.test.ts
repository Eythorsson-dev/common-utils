/**
 * @vitest-environment jsdom
 */


import { describe, test, expect } from "vitest"
import { ItemElement } from "../item";
import { generateUId } from "./utils";


interface Data {
    id: string
    foo: string,
    bar: string
}

class TestElement extends ItemElement<Data> {

    #data: Data = { id: "", foo: "", bar: "" }

    update(data: Data): void {
        throw new Error("Method not implemented.");
    }
    render(data: Data): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.append(data.id)
        return wrapper;
    }

}

const emptyObject = { parentId: undefined, firstChildId: undefined, previousId: undefined, nextId: undefined };
function getIds(item: TestElement) {
    return {
        id: item.id,
        parentId: item.parentItem?.id,
        firstChildId: item.firstChildItem?.id,
        previousId: item.previousItem?.id,
        nextId: item.nextItem?.id
    }
}

test("Can initialize", () => {
    new TestElement({
        id: generateUId(),
        foo: generateUId(),
        bar: generateUId()
    })
})

describe("Initialize -> Throws on invalid", () => {
    test.each([null, "", " ", "  "])(
        "data.id -> %j",
        (id) => {
            expect(() => new TestElement({ id: id!, foo: generateUId(), bar: generateUId() })).toThrow();
        }
    )
})

describe("Can insert and move", () => {

    test("After Sibling", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item1.target);

        item0.insert(undefined, item1, undefined);
        item1.insert(undefined, item0, undefined);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target]);
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target]);
        expect(item0.target.children.length).toBe(0);
        expect(item1.target.children.length).toBe(0);
    })

    test("Before Sibling", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item1.insert(undefined, undefined, item0);
        item0.insert(undefined, undefined, item1);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target]);
        expect(item0.target.children.length).toBe(0);
        expect(item1.target.children.length).toBe(0);
    })

    test("Between Siblings", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement({ id: "Item2", foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item2.insert(undefined, item0, undefined);
        item1.insert(undefined, item0, item2);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, previousId: item1.id });

        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target, item2.target]);
        expect(item0.target.children.length).toBe(0);
        expect(item1.target.children.length).toBe(0);
        expect(item2.target.children.length).toBe(0);
    })

    test("Swap Parent", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })
    
        const wrapper = document.createElement("div")
        wrapper.append(item1.target);
    
        item0.insert(item1, undefined, undefined);
        item1.insert(item0, undefined, undefined);
    
        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, firstChildId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, parentId: item0.id });

        expect([...wrapper.children]).toStrictEqual([item0.target]);
        expect([...item0.target.children]).toStrictEqual([item1.target]);
        expect(item1.target.children.length).toBe(0);
    })
})

describe("Can remove", () => {

    test("After Sibling", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item1.insert(undefined, item0, undefined);

        item1.remove();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id });
        expect(item1.target.previousElementSibling).toBe(null);
        expect(item0.target.nextElementSibling).toBe(null);
    })


    test("Before Sibling", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item1.target);

        item0.insert(undefined, undefined, item1);

        item0.remove();

        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id });
        expect(item0.target.nextElementSibling).toBe(null);
        expect(item1.target.previousElementSibling).toBe(null);
    })


    test("Between Siblings", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement({ id: "Item2", foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item2.insert(undefined, item0, undefined);
        item1.insert(undefined, item0, item2);

        item1.remove();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, previousId: item0.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id });

        expect(item0.target.nextElementSibling).toBe(item2.target);
        expect(item2.target.previousElementSibling).toBe(item0.target);
        expect(item1.target.previousElementSibling).toBe(null);
        expect(item1.target.nextElementSibling).toBe(null);
    })



    test("Child", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement({ id: "Item2", foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item1.insert(item0, undefined, undefined);
        item2.insert(item0, item1, undefined);

        item1.remove();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, firstChildId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, parentId: item0.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id });

        expect(item0.target.firstElementChild).toBe(item2.target);
        expect(item2.target.parentElement).toBe(item0.target);
    })

    test("Parent", () => {

        const item0 = new TestElement({ id: "Item0", foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement({ id: "Item1", foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement({ id: "Item2", foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item1.insert(item0, undefined, undefined);
        item2.insert(item0, item1, undefined);

        item0.remove();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, previousId: item1.id });

        expect(item1.target.parentElement).toBe(wrapper);
        expect(item1.target.nextElementSibling).toBe(item2.target);
        expect(item2.target.previousElementSibling).toBe(item1.target);
        expect(item2.target.parentElement).toBe(wrapper);
    })
})
