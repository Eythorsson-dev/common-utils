

export function onHover(target: HTMLElement | HTMLElement[], onEnter: () => void, onExit: () => void, showTimeoutMs = 200, exitTimeoutMs = 300) {
    var hideTimeout: any;
    var showTimeout: any;

    [target].flat().forEach(e => e.addEventListener("mouseenter", () => {

        clearTimeout(hideTimeout);

        showTimeout = setTimeout(() => onEnter(), showTimeoutMs);
    }));

    [target].flat().forEach(e => e.addEventListener("mouseleave", () => {
        clearTimeout(showTimeout);
        hideTimeout = setTimeout(() => onExit(), exitTimeoutMs);
    }));
}
