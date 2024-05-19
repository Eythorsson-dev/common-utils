import { Icons } from "./icons";

export interface Icon { }

export interface IconElement
    extends SVGElement, Icon {
}


export type IconTypes = keyof typeof Icons

export function getIcon(type: IconTypes): Icon {
    return Icons[type]();
}