import { expect, test } from "vitest";
import { getShortcutString } from "../getShortcutString";


test.each([
    { ctrl: true, shift: false, alt: false, key: "", expected: "ctrl" },
    { ctrl: false, shift: true, alt: false, key: "", expected: "shift" },
    { ctrl: false, shift: false, alt: true, key: "", expected: "alt" },
    { ctrl: false, shift: false, alt: false, key: "a", expected: "a" },

    { ctrl: true, shift: false, alt: false, key: "b", expected: "ctrl+b" },
    { ctrl: false, shift: true, alt: false, key: "c", expected: "shift+c" },
    { ctrl: false, shift: false, alt: true, key: "d", expected: "alt+d" },

    { ctrl: true, shift: false, alt: true, key: "e", expected: "ctrl+alt+e" },
    { ctrl: false, shift: true, alt: true, key: "f", expected: "shift+alt+f" },
    { ctrl: true, shift: true, alt: true, key: "g", expected: "ctrl+shift+alt+g" },
])("Can Get -> $expected", ({ ctrl, shift, alt, key, expected }) => {

    const response = getShortcutString(ctrl, shift, alt, key);

    expect(response).toBe(expected)
});
