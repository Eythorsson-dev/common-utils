/**
 * Handles a single event click outside of the target element
 * @returns Returns an method that can be used to remove the handler
 */
export function onceClickOutside(target: HTMLElement, callback: (event: MouseEvent) => void): () => void {

    function handler(event: MouseEvent) {
        if (target.contains(event.target as HTMLElement)) return;

        removeHandler();

        callback(event);
    }

    function removeHandler() {
        document.removeEventListener("click", handler)
    }

    document.addEventListener("click", handler);

    return removeHandler;
}