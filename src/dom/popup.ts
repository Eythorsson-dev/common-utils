export enum PopupDirection {
    TOP = "top",
    BOTTOM = "bottom"
}

export enum PopupAlign {
    START = "start",
    CENTER = "center",
    END = "end"
}

export interface PopupOptions {
    direction?: PopupDirection
    align?: PopupAlign
    useMinWidth?: boolean
    autoReposition?: boolean
    popOver?: boolean
    useBacksplash?: boolean
    backskpachClassName?: string
    onBacksplashClick?(): void
    closeOnEsc?: boolean
}

function setOptions(options?: PopupOptions): PopupOptions {
    return {
        direction: PopupDirection.BOTTOM,
        align: PopupAlign.START,
        useMinWidth: false,
        autoReposition: true,
        popOver: false,
        useBacksplash: true,
        closeOnEsc: true,
        ...options
    }
}

type ElementRect = { top: number; left: number; height: number; width: number };

/**
 *
 * @param element The element to position
 * @param target The target of which we wish to position our {element}
 */
export function popupRelative(element: HTMLElement, target: HTMLElement, options?: PopupOptions) {
    options = setOptions(options)

    const tRect = target.getBoundingClientRect();

    // THE ELEMENT NEEDS TO BE ON THE BODY.
    positionElement(element, options, tRect)

    // SET MIN-WIDTH
    if (options.useMinWidth) {
        element.style.setProperty("min-width", tRect.width + "px")
    }

    // ADD A BACKSPLASH TO PREVENT THE USER FROM SCROLLING THE BACKGROUND ELEMENTS
    let backsplash: HTMLElement | undefined;
    if (options.useBacksplash) {
        backsplash = addBacksplash(backsplash, element, options)
    }


    // AUTO REPOSITION
    if (options?.autoReposition) {
        const interval = setInterval(() => {
            if (!document.body.contains(element)) {
                clearInterval(interval);
                return;
            }

            const _tRect = target.getBoundingClientRect();
            // TODO: CHECK BASED ON THE PopupOption ALIGN TYPE...
            if (_tRect.top == tRect.top && _tRect.left == tRect.left) return;

            clearInterval(interval);

            backsplash?.remove();
            popupRelative(element, target, options);
        }, 100);
    }

    return {
        element,
        backsplash
    }
}

export function popupPosition(element: HTMLElement, x: number, y: number, options?: PopupOptions) {
    options = setOptions(options)

    const rect = { top: y, left: x, height: 0, width: 0 };


    // THE ELEMENT NEEDS TO BE ON THE BODY.
    positionElement(element, options, rect);

    // ADD A BACKSPLASH TO PREVENT THE USER FROM SCROLLING THE BACKGROUND ELEMENTS
    let backsplash: HTMLElement | undefined;
    if (options.useBacksplash) {
        backsplash = addBacksplash(backsplash, element, options)
    }


    // AUTO REPOSITION
    if (options?.autoReposition) {
        const bRect = document.body.getBoundingClientRect();

        const interval = setInterval(() => {
            if (!document.body.contains(element)) {
                clearInterval(interval);
                return;
            }

            const _bRect = document.body.getBoundingClientRect();
            // TODO: CHECK BASED ON THE PopupOption ALIGN TYPE...
            if (_bRect.top == bRect.top && _bRect.left == bRect.left) return;

            clearInterval(interval);

            backsplash?.remove();
            popupPosition(element, x, y, options);
        }, 100);
    }

    return {
        element,
        backsplash
    }
}


function addBacksplash(backsplash: HTMLElement | undefined, element: HTMLElement, options: PopupOptions) {
    backsplash = document.createElement("div")
    backsplash.style.setProperty("position", "absolute")
    backsplash.style.setProperty("top", "0")
    backsplash.style.setProperty("right", "0")
    backsplash.style.setProperty("bottom", "0")
    backsplash.style.setProperty("left", "0")
    backsplash.style.setProperty("z-index", "10")
    // backsplash.className = "bg-zinc-900/10";
    backsplash.tabIndex = -1

    backsplash.addEventListener("click", event => {
        if (element.contains(event.target as HTMLElement)) return;

        element.remove()
        options!.onBacksplashClick?.()
    })

    if (options.closeOnEsc) {
        backsplash.addEventListener("keydown", event => {
            if (event.key != "Escape") return
            element.remove();
            event.stopPropagation();
        });
    }

    document.body.append(backsplash);
    backsplash.append(element)

    element.remove = ((baseRemove) => function () {
        //@ts-ignore
        baseRemove.call(this)
        backsplash?.remove()

    })(element.remove)
    return backsplash
}

function positionElement(
    element: HTMLElement,
    options: PopupOptions,
    targetRect: ElementRect
) {
    if (!document.contains(element))
        document.body.append(element)

    element.style.setProperty("position", "absolute")

    const eRect = element.getBoundingClientRect();

    const { bottom, top } = alignVertically(options, targetRect, eRect)
    const { left, right } = alignHorizontally(options, targetRect, eRect)

    if (top > 0) element.style.setProperty("top", top + "px")
    else if (bottom > 0) element.style.setProperty("bottom", bottom + "px")

    if (left > 0) element.style.setProperty("left", left + "px")
    else if (right > 0) element.style.setProperty("right", right + "px")

    if (options.closeOnEsc) {
        element.addEventListener("keydown", event => {
            if (event.key != "Escape") return
            element.remove();
            event.stopPropagation();
        });
    }
}

function alignHorizontally(
    options: PopupOptions,
    targetRect: ElementRect,
    eRect: DOMRect
) {
    let left = 0, right = 0;

    if ([PopupAlign.START, PopupAlign.END, PopupAlign.CENTER].includes(options.align!)) {
        const mStart = targetRect.left
        const mEnd = window.innerWidth - (targetRect.left + targetRect.width)

        var _align = options.align

        // VALIDATE THAT THERE IS SPLACE FOR THE ELEMENT.
        if (_align == PopupAlign.CENTER && mStart >= eRect.width / 2 && mEnd >= eRect.width / 2) _align = PopupAlign.CENTER
        else if (_align == PopupAlign.END && mStart >= eRect.width) _align = PopupAlign.END
        else if (_align == PopupAlign.START && mEnd >= eRect.width) _align = PopupAlign.START
        else if (mStart < mEnd) _align = PopupAlign.START
        else if (mStart > mEnd) _align = PopupAlign.END


        if (_align == PopupAlign.CENTER) left = targetRect.left + targetRect.width / 2 - eRect.width / 2
        else if (_align == PopupAlign.START) left = targetRect.left
        else right = window.innerWidth - (targetRect.left + targetRect.width)
    }
    else throw "Invalid PopupAlign: " + options.align
    return { left, right }
}

function alignVertically(
    options: PopupOptions,
    targetRect: ElementRect,
    eRect: DOMRect
) {
    let top = 0, bottom = 0;

    if ([PopupDirection.TOP, PopupDirection.BOTTOM].includes(options.direction!)) {
        const mTop = targetRect.top - eRect.height
        const mBottom = window.innerHeight - (targetRect.top + targetRect.height + eRect.height)

        var _direction = options.direction

        // VALIDATE THAT THERE IS SPACE FOR THE ELEMENT.
        if (_direction == PopupDirection.BOTTOM && mBottom < eRect.height && mTop > mBottom) _direction = PopupDirection.TOP
        else if (_direction == PopupDirection.TOP && mTop < eRect.height && mTop < mBottom) _direction = PopupDirection.BOTTOM
        else if (mTop <= 0 && mBottom <= 0 && mTop > mBottom) _direction = PopupDirection.TOP
        else if (mTop <= 0 && mBottom <= 0 && mTop < mBottom) _direction = PopupDirection.BOTTOM

        if (_direction == PopupDirection.TOP) bottom = window.innerHeight - targetRect.top
        else top = targetRect.top + targetRect.height

        if (options.popOver && _direction == PopupDirection.TOP) bottom -= targetRect.height
        else if (options.popOver) top -= targetRect.height
    }
    else throw "Invalid PopupDirection: " + options.direction
    return { bottom, top }
}

/**
 * @returns The popup container
 */
export function popupContainer(children: HTMLElement | (HTMLElement | false)[], className: string = "bg-zinc-700 rounded p-1 z-10"): HTMLElement {
    const container = document.createElement("div");
    if (className) container.className += " " + className;

    container.append(...<HTMLElement[]>[children ?? []].flat().filter(x => x));
    return container;
}