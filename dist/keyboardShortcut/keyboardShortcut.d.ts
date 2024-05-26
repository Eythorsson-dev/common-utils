export interface ShortcutOption {
    get disabled(): boolean;
    get target(): HTMLElement;
    get shortcut(): string;
    action: () => void;
}
export type Shortcut = {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    key: string;
};
export declare class KeyboardShortcut {
    #private;
    constructor(timeoutMs?: number);
    registerShortcut(target: HTMLElement, shortcut: string, action: () => void, disabled?: () => boolean): void;
    handleKeystroke(target: HTMLElement, shortcut: Shortcut): void;
}
