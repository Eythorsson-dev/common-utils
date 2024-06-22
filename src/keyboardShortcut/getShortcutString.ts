import { Shortcut } from "./keyboardShortcut";


export function getShortcutString(combo: Shortcut | Shortcut[]): string {
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
