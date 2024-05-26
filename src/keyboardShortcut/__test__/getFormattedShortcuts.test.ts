import { expect, test } from "vitest";
import { getFormattedShortcut } from "../getFormattedShortcuts";


test("can format -> ' ctrl + Shift+ALT+a'", () => {
    const response = getFormattedShortcut("ctrl + Shift+ALT+a");

    expect(response).toBe("ctrl+shift+alt+a")
});
test("can format -> ' ctrl + Shift+ALT+a , ctrl+b'", () => {
    const response = getFormattedShortcut("ctrl + Shift+ALT+a , ctrl+b");

    expect(response).toBe("ctrl+shift+alt+a,ctrl+b")
});

test("can't format -> Throws -> 'randomstring'", () => {
    expect(()=>getFormattedShortcut("randomstring")).toThrow()
});

test("can't format -> Throws -> 'ctrl+randomstring+a'", () => {
    expect(()=>getFormattedShortcut("ctrl+randomstring+a")).toThrow()
});

test("can't format -> Throws -> 'ctrl1+a'", () => {
    expect(()=>getFormattedShortcut("ctrl1+a")).toThrow()
});

test("can't format -> Throws -> 'a+b'", () => {

    expect(() => getFormattedShortcut("a+b")).toThrow()
});
