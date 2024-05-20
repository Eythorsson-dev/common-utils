import { beforeEach, expect, test, vi } from "vitest";
import { SaveManager } from "../saveManager";


var remove = vi.fn();
var create = vi.fn();
var update = vi.fn();
var changed = vi.fn();
var beforeChanged = vi.fn();

interface Data {
    Id: number
}

var saveManager: SaveManager<Data>;

beforeEach(() => {
    remove = vi.fn();
    create = vi.fn();
    update = vi.fn();
    changed = vi.fn();
    beforeChanged = vi.fn();

    saveManager = new SaveManager<Data>({
        Delete: remove,
        Insert: create,
        Update: update,
        OnChanged: changed,
        BeforeChanged: beforeChanged
    })
})

test('Initial State Valid', () => {
    expect(saveManager.CanUndo()).toBe(false);
    expect(saveManager.CanRedo()).toBe(false);

    expect(saveManager.HistoryIndex).toBe(-1);

    expect(create.mock.calls.length).toBe(0);
    expect(update.mock.calls.length).toBe(0);
    expect(remove.mock.calls.length).toBe(0);
    expect(changed.mock.calls.length).toBe(0);
    expect(beforeChanged.mock.calls.length).toBe(0);
})

test('Can Insert', () => {
    saveManager.Save({
        Data: { items: [{ Action: "insert", Data: { Id: 1 } }] },
        UndoData: { items: [{ Action: "delete", Data: { Id: 2 } }] }
    });

    expect(saveManager.HistoryIndex).toBe(0);
    expect(saveManager.CanUndo()).toBe(true);
    expect(saveManager.CanRedo()).toBe(false);

    expect(create.mock.calls.length).toBe(1);
    expect(update.mock.calls.length).toBe(0);
    expect(remove.mock.calls.length).toBe(0);
    expect(changed.mock.calls.length).toBe(1);
    expect(beforeChanged.mock.calls.length).toBe(1);
})

test('Can Undo Insert', () => {
    saveManager.Save({
        Data: { items: [{ Action: "insert", Data: { Id: 1 } }] },
        UndoData: { items: [{ Action: "delete", Data: { Id: 2 } }] }
    });

    expect(saveManager.HistoryIndex).toBe(0);
    expect(saveManager.CanUndo()).toBe(true);
    expect(saveManager.CanRedo()).toBe(false);

    saveManager.Undo();

    expect(saveManager.HistoryIndex).toBe(-1);
    expect(saveManager.CanUndo()).toBe(false);
    expect(saveManager.CanRedo()).toBe(true);


    expect(create.mock.calls.length).toBe(1);
    expect(update.mock.calls.length).toBe(0);
    expect(remove.mock.calls.length).toBe(1);
    expect(changed.mock.calls.length).toBe(2);
    expect(beforeChanged.mock.calls.length).toBe(2);
})

test('Can Update', () => {
    saveManager.Save({
        Data: { items: [{ Action: "update", Data: { Id: 1 } }] },
        UndoData: { items: [{ Action: "delete", Data: { Id: 2 } }] }
    });

    expect(saveManager.HistoryIndex).toBe(0);
    expect(saveManager.CanUndo()).toBe(true);
    expect(saveManager.CanRedo()).toBe(false);

    expect(create.mock.calls.length).toBe(0);
    expect(update.mock.calls.length).toBe(1);
    expect(remove.mock.calls.length).toBe(0);
    expect(changed.mock.calls.length).toBe(1);
    expect(beforeChanged.mock.calls.length).toBe(1);
})

test('Can Undo Update', () => {
    saveManager.Save({
        Data: { items: [{ Action: "update", Data: { Id: 1 } }] },
        UndoData: { items: [{ Action: "delete", Data: { Id: 2 } }] }
    });

    expect(saveManager.HistoryIndex).toBe(0);
    expect(saveManager.CanUndo()).toBe(true);
    expect(saveManager.CanRedo()).toBe(false);

    saveManager.Undo();

    expect(saveManager.HistoryIndex).toBe(-1);
    expect(saveManager.CanUndo()).toBe(false);
    expect(saveManager.CanRedo()).toBe(true);


    expect(create.mock.calls.length).toBe(0);
    expect(update.mock.calls.length).toBe(1);
    expect(remove.mock.calls.length).toBe(1);
    expect(changed.mock.calls.length).toBe(2);
    expect(beforeChanged.mock.calls.length).toBe(2);
})
