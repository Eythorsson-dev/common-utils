
import { expect, test, vi } from 'vitest'
import { UndoManager, UndoAPI } from '../undoManager'



test('Initial state Valid', () => {
  var undoAPI = UndoManager();

  expect(undoAPI.CanUndo()).toBe(false)
  expect(undoAPI.CanRedo()).toBe(false)
})

test('Performs Action', () => {
  var undoAPI = UndoManager();

  var history = AddActions(undoAPI, 1);

  expect(undoAPI.HistoryIndex).toBe(0);
  expect(history[0].action.mock.calls.length).toBe(1);
  expect(history[0].undo.mock.calls.length).toBe(0);
})

test('Can Undo: Action+Undo', () => {
  var undoAPI = UndoManager();
  var history = AddActions(undoAPI, 1);

  expect(undoAPI.CanUndo()).toBe(true);

  undoAPI.Undo();

  expect(undoAPI.CanUndo()).toBe(false);

  expect(undoAPI.HistoryIndex).toBe(-1);

  expect(history[0].action.mock.calls.length).toBe(1);
  expect(history[0].undo.mock.calls.length).toBe(1);
})

test('Can Redo: Action+Undo+Redo', () => {
  var undoAPI = UndoManager();
  var history = AddActions(undoAPI, 1);

  undoAPI.Undo();
  undoAPI.Redo();

  expect(undoAPI.CanUndo()).toBe(true);
  expect(undoAPI.CanRedo()).toBe(false);

  expect(undoAPI.HistoryIndex).toBe(0);

  expect(history[0].action.mock.calls.length).toBe(2);
  expect(history[0].undo.mock.calls.length).toBe(1);
})

test('Pops Stack: Action+Undo+Action', () => {
  var undoAPI = UndoManager();
  var history = AddActions(undoAPI, 1);

  expect(undoAPI.CanUndo()).toBe(true);
  expect(undoAPI.CanRedo()).toBe(false);

  undoAPI.Undo();

  expect(undoAPI.CanUndo()).toBe(false);
  expect(undoAPI.CanRedo()).toBe(true);

  history = history.concat(AddActions(undoAPI, 1));
  expect(undoAPI.CanUndo()).toBe(true);
  expect(undoAPI.CanRedo()).toBe(false);

  expect(history[0].action.mock.calls.length).toBe(1);
  expect(history[0].undo.mock.calls.length).toBe(1);
  expect(history[1].action.mock.calls.length).toBe(1);
  expect(history[1].undo.mock.calls.length).toBe(0);

  expect(undoAPI.HistoryIndex).toBe(0);
})

test('Restores Poped Stack: Action+Undo+Redo+Action', () => {
  var undoAPI = UndoManager();
  var history = AddActions(undoAPI, 1);

  expect(undoAPI.CanUndo()).toBe(true);
  expect(undoAPI.CanRedo()).toBe(false);

  undoAPI.Undo();

  expect(undoAPI.CanUndo()).toBe(false);
  expect(undoAPI.CanRedo()).toBe(true);

  undoAPI.Redo();

  history = history.concat(AddActions(undoAPI, 1));

  expect(undoAPI.CanUndo()).toBe(true);
  expect(undoAPI.CanRedo()).toBe(false);

  expect(history[0].action.mock.calls.length).toBe(2);
  expect(history[0].undo.mock.calls.length).toBe(1);
  expect(history[1].action.mock.calls.length).toBe(1);
  expect(history[1].undo.mock.calls.length).toBe(0);

  expect(undoAPI.HistoryIndex).toBe(1);
})



function AddActions(undoManager: UndoAPI, i: number) {

  var history = Array(i).fill(null).map(_ => ({
    action: vi.fn(),
    undo: vi.fn()
  }));

  history.forEach(item => undoManager.Execute({
    Action: item.action,
    Undo: item.undo
  }));

  return history;
}