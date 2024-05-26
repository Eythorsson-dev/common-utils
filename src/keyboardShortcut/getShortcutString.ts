

export function getShortcutString(ctrl: boolean, shift: boolean, alt: boolean, key: string) {
    return [
        ctrl && "ctrl",
        shift && "shift",
        alt && "alt",
        key
    ]
        .filter(x => x)
        .join("+");
}
