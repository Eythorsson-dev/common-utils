export function onceClickOutside(target: HTMLElement, callback: (event: MouseEvent) => void) {
    function handler(event: MouseEvent) {
        if (target.contains(event.target as HTMLElement)) return;

        document.removeEventListener("click", handler)
        callback(event);
    }

    document.addEventListener("click", handler);
}