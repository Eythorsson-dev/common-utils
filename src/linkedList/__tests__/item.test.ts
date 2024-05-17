/**
 * @vitest-environment jsdom
 */


import { describe, test, expect } from "vitest"
import { ItemElement } from "../item";
import { generateUId } from "./utils";


interface Data {
    foo: string,
    bar: string
}

class TestElement extends ItemElement<Data, TestElement> {
    private _data: Data| undefined;

    get data(): Data {
        return this._data!;
    }

    update(data:Data): void {
        this._data = data;
     }

    render(data: Data): HTMLElement {
        this._data = data;

        const wrapper = document.createElement("div");
        wrapper.append(this.id)
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
    new TestElement(
        generateUId(),
        {
            foo: generateUId(),
            bar: generateUId()
        }
    )
})

describe("Initialize -> Throws on invalid", () => {
    test.each([null, "", " ", "  "])(
        "data.id -> %j",
        (id) => {
            expect(() => new TestElement(id!, { foo: generateUId(), bar: generateUId() })).toThrow();
        }
    )
})

describe("Insert After", () => {

    test("Can move", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item1.target);

        item1.after(item0);
        item0.after(item1);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target]);
        expect(item0.target.children.length).toBe(0);
        expect(item1.target.children.length).toBe(0);
    })

    test("Can move -> To child", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.append(item1);
        item1.after(item2);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, firstChildId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, parentId: item0.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, parentId: item0.id, previousId: item1.id });
        expect([...wrapper.children]).toStrictEqual([item0.target]);
        expect([...item0.target.children]).toStrictEqual([item1.target, item2.target]);
        expect(item1.target.children.length).toBe(0);
        expect(item2.target.children.length).toBe(0);
    })

    test("Can move -> Between siblings", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.after(item2);
        item0.after(item1);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, previousId: item1.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target, item2.target]);
        expect(item0.target.children.length).toBe(0);
        expect(item1.target.children.length).toBe(0);
        expect(item2.target.children.length).toBe(0);
    })

    test("Cant move itself -> Throws", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.after(item1);
        expect(() => item1.after(item1)).toThrow();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target]);
    })
})

describe("Insert Before", () => {

    test("Can move", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.before(item1);
        item1.before(item0);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target]);
        expect(item0.target.children.length).toBe(0);
        expect(item1.target.children.length).toBe(0);
    })

    test("Can move -> To child", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.append(item2);
        item2.before(item1);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, firstChildId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, parentId: item0.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, parentId: item0.id, previousId: item1.id });
        expect([...wrapper.children]).toStrictEqual([item0.target]);
        expect([...item0.target.children]).toStrictEqual([item1.target, item2.target]);
        expect(item1.target.children.length).toBe(0);
        expect(item2.target.children.length).toBe(0);
    })

    test("Can move -> Between siblings", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item2.target);

        item2.before(item0);
        item2.before(item1);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, previousId: item1.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target, item2.target]);
        expect(item0.target.children.length).toBe(0);
        expect(item1.target.children.length).toBe(0);
        expect(item2.target.children.length).toBe(0);
    })

    test("Cant move itself -> Throws", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item1.target);

        item1.before(item0);
        expect(() => item1.before(item1)).toThrow();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target]);
    })
})

describe("Insert Append", () => {
    test("Can move", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.before(item2);
        item0.append(item1);
        item0.append(item2);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, firstChildId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, parentId: item0.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, parentId: item0.id, previousId: item1.id });
        expect([...wrapper.children]).toStrictEqual([item0.target]);
        expect([...item0.target.children]).toStrictEqual([item1.target, item2.target]);
        expect(item1.target.children.length).toBe(0);
        expect(item2.target.children.length).toBe(0);
    })

    test("Can move -> To child", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item2.target);

        item2.append(item0);
        item2.append(item1);
        item1.append(item2);

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, previousId: item0.id, firstChildId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, parentId: item1.id });
        expect([...wrapper.children]).toStrictEqual([item0.target, item1.target]);
        expect([...item1.target.children]).toStrictEqual([item2.target]);
        expect(item0.target.children.length).toBe(0);
    })

    test("Cant move itself -> Throws", () => {
        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.append(item1);
        expect(() => item1.append(item1)).toThrow();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, firstChildId: item1.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, parentId: item0.id });
        expect([...wrapper.children]).toStrictEqual([item0.target]);
        expect([...item0.target.children]).toStrictEqual([item1.target]);
    })
})

describe("Can remove", () => {

    test("After Sibling", () => {

        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.after(item1);

        item1.remove();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id });
        expect([...wrapper.children]).toStrictEqual([item0.target]);
        expect(item0.target.children.length).toBe(0);
    })


    test("Before Sibling", () => {

        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item1.target);

        item1.before(item0);

        item0.remove();

        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id });
        expect(item0.target.nextElementSibling).toBe(null);
        expect(item1.target.previousElementSibling).toBe(null);
    })


    test("Between Siblings", () => {

        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.after(item1);
        item1.after(item2);

        item1.remove();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, previousId: item0.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id });

        expect([...wrapper.children]).toStrictEqual([item0.target, item2.target]);
        expect(item0.target.children.length).toBe(0);
        expect(item2.target.children.length).toBe(0);
    })



    test("Child", () => {

        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.append(item1);
        item0.append(item2);

        item1.remove();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, firstChildId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, parentId: item0.id });
        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id });

        expect([...wrapper.children]).toStrictEqual([item0.target]);
        expect([...item0.target.children]).toStrictEqual([item2.target]);
        expect(item2.target.children.length).toBe(0);
    })

    test("Root Parent -> Children replaces parent", () => {

        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.append(item1);
        item0.append(item2);

        item0.remove();

        expect(getIds(item1)).toMatchObject({ ...emptyObject, id: item1.id, nextId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, previousId: item1.id });

        expect([...wrapper.children]).toStrictEqual([item1.target, item2.target]);
    })
    
    test("Parent -> Children is appended to previous", () => {

        const item0 = new TestElement("Item0", { foo: generateUId(), bar: generateUId() })
        const item1 = new TestElement("Item1", { foo: generateUId(), bar: generateUId() })
        const item2 = new TestElement("Item2", { foo: generateUId(), bar: generateUId() })
        const item3 = new TestElement("Item3", { foo: generateUId(), bar: generateUId() })

        const wrapper = document.createElement("div")
        wrapper.append(item0.target);

        item0.after(item1);
        item1.append(item2);
        item1.append(item3);

        item1.remove();

        expect(getIds(item0)).toMatchObject({ ...emptyObject, id: item0.id, firstChildId: item2.id });
        expect(getIds(item2)).toMatchObject({ ...emptyObject, id: item2.id, parentId: item0.id, nextId: item3.id});
        expect(getIds(item3)).toMatchObject({ ...emptyObject, id: item3.id, parentId: item0.id, previousId: item2.id });

        expect([...wrapper.children]).toStrictEqual([item0.target]);
        expect([...item0.target.children]).toStrictEqual([item2.target, item3.target]);
    })
})