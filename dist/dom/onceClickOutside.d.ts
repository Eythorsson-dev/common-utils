/**
 * Handles a single event click outside of the target element
 * @returns Returns an method that can be used to remove the handler
 */
export declare function onceClickOutside(target: HTMLElement, callback: (event: MouseEvent) => void): () => void;
