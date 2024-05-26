/**
 * @vitest-environment jsdom
 */

import { expect, test, vi } from "vitest";
import { KeyboardShortcut, ShortcutOption } from "../keyboardShortcut";

test("Can Handle Nested", () => {
    // 0
    //  1
    //   2
    // 3

    const target0 = document.createElement("div");
    const target1 = document.createElement("div");
    const target2 = document.createElement("div");
    const target3 = document.createElement("div");

    const wrapper = document.createElement("wrapper");
    wrapper.append(target0, target3);
    target0.append(target1);
    target1.append(target2);



    const shortcuts: ShortcutOption[] = [
        { target: target0, shortcut: "ctrl+a", action: vi.fn(), disabled: false },
        { target: target1, shortcut: "ctrl+a", action: vi.fn(), disabled: false },
        { target: target3, shortcut: "ctrl+c", action: vi.fn(), disabled: false },
        { target: target1, shortcut: "ctrl+c", action: vi.fn(), disabled: false },
    ]

    const manager = new KeyboardShortcut();

    shortcuts.forEach(shortcut =>
        manager.registerShortcut(shortcut.target, shortcut.shortcut, shortcut.action, () => shortcut.disabled)
    );


    manager.handleKeystroke(target2, { ctrl: true, shift: false, alt: false, key: "a" });

    expect(shortcuts[0].action).not.toHaveBeenCalled();
    expect(shortcuts[1].action).toHaveBeenCalledOnce();
    expect(shortcuts[2].action).not.toHaveBeenCalled();
    expect(shortcuts[3].action).not.toHaveBeenCalled();
});

test("Can Handle Nested disabled", () => {
    // 0
    //  1
    //   2
    // 3

    const target0 = document.createElement("div");
    const target1 = document.createElement("div");
    const target2 = document.createElement("div");
    const target3 = document.createElement("div");

    const wrapper = document.createElement("wrapper");
    wrapper.append(target0, target3);
    target0.append(target1);
    target1.append(target2);



    const shortcuts: ShortcutOption[] = [
        { target: target0, shortcut: "ctrl+a", action: vi.fn(), disabled: false },
        { target: target1, shortcut: "ctrl+a", action: vi.fn(), disabled: true },
    ]

    const manager = new KeyboardShortcut();

    shortcuts.forEach(shortcut =>
        manager.registerShortcut(shortcut.target, shortcut.shortcut, shortcut.action, () => shortcut.disabled)
    );


    manager.handleKeystroke(target2, { ctrl: true, shift: false, alt: false, key: "a" });

    expect(shortcuts[0].action).toHaveBeenCalled();
    expect(shortcuts[1].action).not.toHaveBeenCalledOnce();
});

test("Can Handle partial match", async () => {
    // 0
    //  1
    //   2
    // 3

    const target0 = document.createElement("div");
    const target1 = document.createElement("div");
    const target2 = document.createElement("div");
    const target3 = document.createElement("div");

    const wrapper = document.createElement("wrapper");
    wrapper.append(target0, target3);
    target0.append(target1);
    target1.append(target2);



    const shortcuts: ShortcutOption[] = [
        { target: target0, shortcut: "ctrl+a", action: vi.fn(), disabled: false },
        { target: target1, shortcut: "ctrl+a,ctrl+b", action: vi.fn(), disabled: false },
    ]

    const timeout = 50
    const manager = new KeyboardShortcut(timeout);

    shortcuts.forEach(shortcut =>
        manager.registerShortcut(shortcut.target, shortcut.shortcut, shortcut.action, () => shortcut.disabled)
    );

    manager.handleKeystroke(target2, { ctrl: true, shift: false, alt: false, key: "a" });

    await new Promise(res => setTimeout(res, timeout + 10));

    manager.handleKeystroke(target2, { ctrl: true, shift: false, alt: false, key: "b" });


    expect(shortcuts[0].action).toHaveBeenCalled();
    expect(shortcuts[1].action).not.toHaveBeenCalledOnce();
});

test("Can Handle combination", () => {
    // 0
    //  1
    //   2
    // 3

    const target0 = document.createElement("div");
    const target1 = document.createElement("div");
    const target2 = document.createElement("div");
    const target3 = document.createElement("div");

    const wrapper = document.createElement("wrapper");
    wrapper.append(target0, target3);
    target0.append(target1);
    target1.append(target2);



    const shortcuts: ShortcutOption[] = [
        { target: target0, shortcut: "ctrl+a", action: vi.fn(), disabled: false },
        { target: target1, shortcut: "ctrl+a,ctrl+b", action: vi.fn(), disabled: false },
    ]

    const timeout = 50;
    const manager = new KeyboardShortcut(timeout);

    shortcuts.forEach(shortcut =>
        manager.registerShortcut(shortcut.target, shortcut.shortcut, shortcut.action, () => shortcut.disabled)
    );

    manager.handleKeystroke(target2, { ctrl: true, shift: false, alt: false, key: "a" });
    manager.handleKeystroke(target2, { ctrl: true, shift: false, alt: false, key: "b" });

    expect(shortcuts[0].action).not.toHaveBeenCalled();
    expect(shortcuts[1].action).toHaveBeenCalledOnce();
});

test("Can Handle invalid, then valid", () => {
    // 0
    //  1
    //   2
    // 3

    const target0 = document.createElement("div");
    const target1 = document.createElement("div");
    const target2 = document.createElement("div");
    const target3 = document.createElement("div");

    const wrapper = document.createElement("wrapper");
    wrapper.append(target0, target3);
    target0.append(target1);
    target1.append(target2);



    const shortcuts: ShortcutOption[] = [
        { target: target0, shortcut: "ctrl+a", action: vi.fn(), disabled: false },
    ]

    const timeout = 50;
    const manager = new KeyboardShortcut(timeout);

    shortcuts.forEach(shortcut =>
        manager.registerShortcut(shortcut.target, shortcut.shortcut, shortcut.action, () => shortcut.disabled)
    );

    manager.handleKeystroke(target2, { ctrl: true, shift: false, alt: false, key: "c" });
    manager.handleKeystroke(target2, { ctrl: true, shift: false, alt: false, key: "a" });

    expect(shortcuts[0].action).toHaveBeenCalled();
});
