import { ShortcutCombination } from "./keyboardShortcut";


export function getShortcutString(combo: ShortcutCombination | ShortcutCombination[]): string {
    return [combo].flat().map(
        x => [
            x.ctrl && "ctrl",
            x.shift && "shift",
            x.alt && "alt",
            x.key
        ]
            .filter(x => x)
            .join("+")
    ).join(",");
}
