import { Icons } from "./icons";

export interface IconElement
    extends SVGElement {
}

export type IconTypes = keyof typeof Icons

export function getIcon(type: IconTypes): IconElement {
    return Icons[type]();
}