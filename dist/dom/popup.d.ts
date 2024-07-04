export declare enum PopupDirection {
    TOP = "top",
    BOTTOM = "bottom"
}
export declare enum PopupAlign {
    START = "start",
    CENTER = "center",
    END = "end"
}
export interface PopupOptions {
    direction?: PopupDirection;
    align?: PopupAlign;
    useMinWidth?: boolean;
    autoReposition?: boolean;
    popOver?: boolean;
    useBacksplash?: boolean;
    backskpachClassName?: string;
    onBacksplashClick?(): void;
    closeOnEsc?: boolean;
}
/**
 *
 * @param element The element to position
 * @param target The target of which we wish to position our {element}
 */
export declare function popupRelative(element: HTMLElement, target: HTMLElement, options?: PopupOptions): {
    element: HTMLElement;
    backsplash: HTMLElement | undefined;
};
export declare function popupPosition(element: HTMLElement, x: number, y: number, options?: PopupOptions): {
    element: HTMLElement;
    backsplash: HTMLElement | undefined;
};
/**
 * @returns The popup container
 */
export declare function popupContainer(children: HTMLElement | (HTMLElement | false)[], className?: string): HTMLElement;
