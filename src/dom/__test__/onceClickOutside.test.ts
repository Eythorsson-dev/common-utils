/**
 * @vitest-environment jsdom
 */

import { expect, test, vi } from "vitest";
import { onceClickOutside } from "../onceClickOutside";

test("Handles only once", () => {
    const parent = document.createElement("div");
    const target = document.createElement("div");

    document.body.append(parent);
    parent.append(target);
    
    const callback = vi.fn();
    onceClickOutside(target, callback);

    parent.click();

    expect(callback).toHaveBeenCalledOnce();
})

test("Ignores internal clicks", () => {
    const parent = document.createElement("div");
    const target = document.createElement("div");
    const child = document.createElement("div");

    document.body.append(parent);
    parent.append(target);
    target.append(child);
    
    const callback = vi.fn();
    onceClickOutside(target, callback);

    target.click();
    child.click();

    expect(callback).not.toHaveBeenCalledOnce();
})