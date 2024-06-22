import { getDistinctShortcuts } from "./getDistinctShortcuts";
import { getShortcutString } from "./getShortcutString";

export interface ShortcutOption {
    get disabled(): boolean
    get target(): HTMLElement
    get shortcut(): string
    action: () => void
}

export type ShortcutCombination = {
    key: string,
    ctrl?: boolean,
    shift?: boolean,
    alt?: boolean,
}


export class KeyboardShortcut {
    #shortcuts: ShortcutOption[] = []
    #timeoutMs: number;

    constructor(timeoutMs: number = 1000) {
        this.#timeoutMs = timeoutMs;
    }

    registerShortcut(target: HTMLElement, shortcut: ShortcutCombination | ShortcutCombination[], action: () => void, disabled?: () => boolean) {
        this.#shortcuts.push({
            target,
            shortcut: getShortcutString(shortcut),
            action,
            get disabled() {
                return (disabled?.() ?? false)
            }
        });
    }

    #clearKeyStroke() {
        clearTimeout(this.#currentTimeout);
        this.#currentKeyStrokes = [];
    }

    #currentKeyStrokes: string[] = [];
    #currentTimeout: NodeJS.Timeout | undefined;
    handleKeystroke(target: HTMLElement, shortcut: ShortcutCombination): void {
        this.#currentKeyStrokes.push(getShortcutString(shortcut));
        const currentKeyStrokes = this.#currentKeyStrokes.join(",");

        let matchingShortcuts = getDistinctShortcuts(
            this.#shortcuts.filter(x =>
                x.shortcut.startsWith(currentKeyStrokes)
                && x.disabled == false
                && x.target.contains(target)
            )
        );


        clearTimeout(this.#currentTimeout);

        if (matchingShortcuts.length == 0) {
            this.#clearKeyStroke();
            return;
        }


        if (matchingShortcuts.length == 1) {
            this.#clearKeyStroke();
            matchingShortcuts[0].action();
        }
        else {
            this.#currentTimeout = setTimeout(() => {
                matchingShortcuts = matchingShortcuts.filter(x => x.shortcut == currentKeyStrokes);
                this.#clearKeyStroke();

                if (matchingShortcuts.length == 1)
                    matchingShortcuts[0].action();

            }, this.#timeoutMs)
        }
    }
}