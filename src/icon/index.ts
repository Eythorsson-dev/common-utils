import { ArrowIcons } from "./arrow";
import { TextIcons } from "./text";


export interface Icon { }

export interface IconElement
    extends SVGElement, Icon {
}

const Icons = {
    ...TextIcons,
    ...ArrowIcons,
} as { [key: string]: () => IconElement }

export type IconTypes = keyof typeof Icons

export function Icon(type: IconTypes): Icon {
    return Icons[type]();
}