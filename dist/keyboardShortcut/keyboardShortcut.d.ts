export interface ShortcutOption {
    get disabled(): boolean;
    get target(): HTMLElement;
    get shortcut(): string;
    action: () => void;
}
export type ShortcutCombination = {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
};
export declare class KeyboardShortcut {
    #private;
    constructor(timeoutMs?: number);
    registerShortcut(target: HTMLElement, shortcut: ShortcutCombination | ShortcutCombination[], action: () => void, disabled?: () => boolean): void;
    handleKeystroke(target: HTMLElement, shortcut: ShortcutCombination): void;
}
