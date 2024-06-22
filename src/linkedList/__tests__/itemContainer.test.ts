/**
 * @vitest-environment jsdom
 */

import { describe, expect, test } from "vitest";
import { ItemData, ItemElement } from "../item";
import { generateUId } from "../../utils";
import { ItemContainerElement } from "../itemContainer";
import { Command } from "../command";

class TestElement extends ItemElement<string, TestElement> {
    #data: string;
    constructor(id: string, type: string, data: string) {
        super(id, type)
        this.#data = data;

        this.init(data)
    }

    get data(): string { return this.#data }
    update(data: string): void { this.#data = data; }
    render(data: string): HTMLElement {
        this.#data = data;
        const wrapper = document.createElement("div");
        wrapper.append(this.id);
        return wrapper;
    }

}

class TestContainer extends ItemContainerElement<TestElement, string> {
    get commands(): Command<ItemContainerElement<any, string>, string>[] {
        throw new Error("Method not implemented.");
    }
    createItem<T>(type: string, id: string, data?: T | undefined) {
        return new TestElement(id, type, data as string);
    }

}


describe("Delete Block", () => {

    test.each([
        { blockId: "Root" },
        { blockId: "Sibling" },
        { blockId: "With_Child" },
        { blockId: "Child_First" },
        { blockId: "Child_Sibling" },
        { blockId: "Last" },
    ])("Can delete valid block -> $blockId", ({ blockId }) => {
        // 1
        // 2
        // 3
        //  4
        //  5
        // 6

        const block1: ItemData<string> = { type: "text", id: "Root", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "Sibling", parentId: undefined, previousId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "With_Child", parentId: undefined, previousId: block2.id, data: generateUId() }
        const block4: ItemData<string> = { type: "text", id: "Child_First", parentId: block3.id, data: generateUId() }
        const block5: ItemData<string> = { type: "text", id: "Child_Sibling", parentId: block3.id, previousId: block4.id, data: generateUId() }
        const block6: ItemData<string> = { type: "text", id: "Last", parentId: undefined, previousId: block3.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
            block4,
            block5,
            block6,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = items;

        const wrapper = document.createElement("div");
        wrapper.append(target);

        const block = editor.getItemById(blockId)!;

        // ACT
        editor.deleteItemById(items.find(x => x.id == blockId)!.id);

        // ASSERT
        expect(wrapper.contains(block.target)).toBeFalsy();
        expect(editor.getItemById(blockId)).toBeUndefined()
    })
})



describe("Set Value", () => {
    test("Renders Blocks", () => {

        // 1
        // 2
        // 3
        //  4
        //  5
        // 6

        const block1: ItemData<string> = { type: "text", id: "Root", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "Sibling", parentId: undefined, previousId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "With_Child", parentId: undefined, previousId: block2.id, data: generateUId() }
        const block4: ItemData<string> = { type: "text", id: "Child_First", parentId: block3.id, data: generateUId() }
        const block5: ItemData<string> = { type: "text", id: "Child_Sibling", parentId: block3.id, previousId: block4.id, data: generateUId() }
        const block6: ItemData<string> = { type: "text", id: "Last", parentId: undefined, previousId: block3.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
            block4,
            block5,
            block6,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = items;

        expect(editor.value.length).toEqual(items.length)
        expect(editor.value).toMatchObject(items)

        items.forEach(item => {
            const block = editor.getItemById(item.id);
            expect(target.contains(block!.target)).toBeTruthy()
        })
    })

    test("Prevent multiple root blocks", () => {
        const block1: ItemData<string> = { type: "text", id: "Block1", data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "Block2", data: generateUId() }

        const items = [
            block1,
            block2,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        expect(() => editor.value = items).toThrow("Failed to determine the start of the linked list")
    })

    test("Prevent same PrevId", () => {

        const block1: ItemData<string> = { type: "text", id: "Block1", data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "Block2", previousId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "Block3", previousId: block1.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        expect(() => editor.value = items).toThrow("Some of the items have the same previousId")
    })

    test("Prevent duplicated blockId", () => {

        const block1: ItemData<string> = { type: "text", id: "Block1", data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "Block1", previousId: block1.id, data: generateUId() }

        const items = [
            block1,
            block2,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        expect(() => editor.value = items).toThrow("Found duplicated instances of ids")
    })
})


describe("getBlockById", () => {

    test.each([
        { blockId: "Root" },
        { blockId: "Sibling" },
        { blockId: "Child" },
        { blockId: "Nested_Child" },
        { blockId: "Nested_Child_Sibling" },
        { blockId: "Last" },
    ])("Can Get By Valid Id-> $blockId", ({ blockId }) => {

        const block1: ItemData<string> = { type: "text", id: "Root", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "Sibling", parentId: undefined, previousId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "Child", parentId: block2.id, data: generateUId() }
        const block4: ItemData<string> = { type: "text", id: "Nested_Child", parentId: block2.id, previousId: block3.id, data: generateUId() }
        const block5: ItemData<string> = { type: "text", id: "Block5", parentId: block2.id, previousId: block4.id, data: generateUId() }
        const block6: ItemData<string> = { type: "text", id: "Nested_Child_Sibling", parentId: block2.id, previousId: block5.id, data: generateUId() }
        const block7: ItemData<string> = { type: "text", id: "Last", parentId: undefined, previousId: block2.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
            block4,
            block5,
            block6,
            block7
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = items;

        const block = editor.getItemById(blockId)!;
        const expectedData = items.find(x => x.id == blockId)!;

        expect(block.getDetails()).toMatchObject(expectedData)
    })


    test.each([
        { blockId: "block1" },
        { blockId: "BLOCK2" },
        { blockId: "" },
        { blockId: null },
        { blockId: undefined },
    ])("Can't Get By Invalid Id -> $blockId", ({ blockId }) => {

        const block1: ItemData<string> = { type: "text", id: "Block1", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "Block2", parentId: undefined, previousId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "Block3", parentId: block2.id, data: generateUId() }
        const block4: ItemData<string> = { type: "text", id: "Block4", parentId: block2.id, previousId: block3.id, data: generateUId() }
        const block5: ItemData<string> = { type: "text", id: "Block5", parentId: undefined, previousId: block2.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
            block4,
            block5
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)


        editor.value = items;

        const block = editor.getItemById(blockId!);

        expect(block).toBeUndefined()
    })

})

describe("Update Block", () => {

    test("Can Update -> Data", () => {
        const block: ItemData<string> = { type: "text", id: "block1", parentId: undefined, data: generateUId() }

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = [block];

        const newData = "Hello World " + generateUId();
        editor.upsert({
            ...block,
            data: newData
        })

        expect(editor.value).toMatchObject([
            { ...block, data: newData },
        ])
    });


    test("Can't Move -> parent into itself", () => {
        // first child becomes new the root block

        // 1       2
        //  2  ->  3
        //  3      1

        const block1: ItemData<string> = { type: "text", id: "block1", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "block2", parentId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "block3", parentId: block1.id, previousId: block2.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = items;

        expect(() => editor.upsert({
            ...block1,
            previousId: block3.id,
            parentId: undefined
        })).toThrow()

        expect(editor.value).toMatchObject([
            block1,
            block2,
            block3,
        ])
    })

    test("Can Move -> Previous block (with children)", () => {
        // becomes the new parent, last child in previous becomes the prev of the first child

        // 1       1
        //  2       2
        // 3   ->  5
        //  4      3
        // 5        4

        const block1: ItemData<string> = { type: "text", id: "block1", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "block2", parentId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "block3", parentId: undefined, previousId: block1.id, data: generateUId() }
        const block4: ItemData<string> = { type: "text", id: "block4", parentId: block3.id, data: generateUId() }
        const block5: ItemData<string> = { type: "text", id: "block5", parentId: undefined, previousId: block3.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
            block4,
            block5,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = items;

        editor.upsert({
            ...block3,
            previousId: block5.id,
            parentId: undefined
        })

        const movedBlock = editor.getItemById(block3.id)!;
        const prevBlock = editor.getItemById(block5.id)!;

        expect(movedBlock.previousItem!.target).toBe(prevBlock.target);

        expect(editor.value).toMatchObject([
            { ...block1, parentId: undefined, previousId: undefined },
            { ...block2, parentId: block1.id, previousId: undefined },
            { ...block5, parentId: undefined, previousId: block1.id },
            { ...block3, parentId: undefined, previousId: block5.id },
            { ...block4, parentId: block3.id, previousId: undefined },
        ])
    })

    test("Can Move -> Current has children, moved after next", () => {
        const block1: ItemData<string> = { type: "text", id: "block1", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "block2", parentId: undefined, previousId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "block3", parentId: block2.id, data: generateUId() }
        const block4: ItemData<string> = { type: "text", id: "block4", parentId: block2.id, previousId: block3.id, data: generateUId() }
        const block5: ItemData<string> = { type: "text", id: "block5", parentId: undefined, previousId: block2.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
            block4,
            block5,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = items;

        editor.upsert({
            ...block2,
            previousId: block5.id,
            parentId: undefined
        })

        const movedBlock = editor.getItemById(block2.id)!;
        const prevBlock = editor.getItemById(block5.id)!;

        expect(movedBlock.previousItem!.target).toBe(prevBlock.target);

        expect(editor.value).toMatchObject([
            { ...block1, parentId: undefined, previousId: undefined },
            { ...block5, parentId: undefined, previousId: block1.id },
            { ...block2, parentId: undefined, previousId: block5.id },
            { ...block3 },
            { ...block4 },
        ])

    })

    test("Can Move -> Previous is root block, current has children", () => {
        // children should be moved to the root block, and the current should become the new root

        // 1   -> 2
        // 2   ->  3
        //  3  ->  4
        //  4  -> 1

        const block1: ItemData<string> = { type: "text", id: "block1", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "block2", parentId: undefined, previousId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "block3", parentId: block2.id, data: generateUId() }
        const block4: ItemData<string> = { type: "text", id: "block4", parentId: block2.id, previousId: block3.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
            block4,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = items;

        editor.upsert({
            ...block2,
            previousId: undefined,
            parentId: undefined
        })

        const movedBlock = editor.getItemById(block2.id)!;
        const nextBlock = editor.getItemById(block1.id)!;

        expect(movedBlock.nextItem!.target).toBe(nextBlock.target);

        expect(editor.value).toMatchObject([
            { ...block2, parentId: undefined, previousId: undefined },
            { ...block3, parentId: block2.id, previousId: undefined },
            { ...block4, parentId: block2.id, previousId: block3.id },
            { ...block1, parentId: undefined, previousId: block2.id },
        ])
    })

    test.each([
        { description: "Root after sibling", blockId: "block1", previousId: "block2" },
        { description: "Root to nested child of sibling", blockId: "block1", previousId: "block4" },
        { description: "Parent to sibling of nested child", blockId: "block2", previousId: "block4" },
        { description: "Child to new Parent", blockId: "block3", previousId: "block6" },
    ])("Can Move: $description", ({ blockId, previousId }) => {
        const block1: ItemData<string> = { type: "text", id: "block1", parentId: undefined, data: generateUId() }
        const block2: ItemData<string> = { type: "text", id: "block2", parentId: undefined, previousId: block1.id, data: generateUId() }
        const block3: ItemData<string> = { type: "text", id: "block3", parentId: undefined, previousId: block2.id, data: generateUId() }
        const block4: ItemData<string> = { type: "text", id: "block4", parentId: block3.id, data: generateUId() }
        const block5: ItemData<string> = { type: "text", id: "block5", parentId: block3.id, previousId: block4.id, data: generateUId() }
        const block6: ItemData<string> = { type: "text", id: "block6", parentId: undefined, previousId: block3.id, data: generateUId() }

        const items = [
            block1,
            block2,
            block3,
            block4,
            block5,
            block6,
        ];

        const target = document.createElement("div");
        const editor = new TestContainer(target)

        editor.value = items;

        const blockDataToMove = items.find(x => x.id == blockId)!;
        const prevBlockData = items.find(x => x.id == previousId)!;

        editor.upsert({
            ...blockDataToMove,
            previousId: prevBlockData.id,
            parentId: prevBlockData.id
        })

        const currBlock = editor.getItemById(blockDataToMove.id);
        const prevBlock = editor.getItemById(prevBlockData.id);

        expect(currBlock?.id).toBe(prevBlock!.nextItem!.id)
        expect(currBlock?.target).toBe(prevBlock!.nextItem!.target)
    });
})