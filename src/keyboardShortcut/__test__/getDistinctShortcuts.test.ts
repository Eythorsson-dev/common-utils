/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest";
import { getDistinctShortcuts } from "../getDistinctShortcuts";
import { ShortcutOption as BaseShortcut } from "../keyboardShortcut";


type Shortcut = BaseShortcut & { id: string }

test("Can get distinct", () => {
    // 0: b(ctrl+a)
    //  1: a(ctrl+a)
    //   2: c(ctrl+c)
    // 3: d(ctrl+c)

    const target0 = document.createElement("div");
    const target1 = document.createElement("div");
    const target2 = document.createElement("div");
    const target3 = document.createElement("div");

    const wrapper = document.createElement("wrapper");
    wrapper.append(target0, target3);
    target0.append(target1);
    target1.append(target2);

    const shortcuts: Shortcut[] = [
        { id: "a", target: target1, shortcut: "ctrl+a", action() { }, disabled: false },
        { id: "b", target: target0, shortcut: "ctrl+a", action() { }, disabled: false },
        { id: "c", target: target2, shortcut: "ctrl+c", action() { }, disabled: false },
        { id: "d", target: target3, shortcut: "ctrl+c", action() { }, disabled: false },
    ]

    const response = getDistinctShortcuts(shortcuts);

    expect(response.map(x => x.id)).toMatchObject(["a", "c", "d"])
})

test("Can get distinct", () => {
    // 0: a(ctrl+a)
    //  1: b(ctrl+a)
    //   2: c(ctrl+c)
    // 3: d(ctrl+c)


    const target0 = document.createElement("div");
    const target1 = document.createElement("div");
    const target2 = document.createElement("div");
    const target3 = document.createElement("div");

    const wrapper = document.createElement("wrapper");
    wrapper.append(target0, target3);
    target0.append(target1);
    target1.append(target2);


    const shortcuts: Shortcut[] = [
        { id: "a", target: target0, shortcut: "ctrl+a", action() { }, disabled: false },
        { id: "b", target: target1, shortcut: "ctrl+a", action() { }, disabled: false },
        { id: "c", target: target3, shortcut: "ctrl+c", action() { }, disabled: false },
        { id: "d", target: target1, shortcut: "ctrl+c", action() { }, disabled: false },
    ]

    const response = getDistinctShortcuts(shortcuts);

    expect(response.map(x => x.id)).toMatchObject(["b", "c", "d"])
})