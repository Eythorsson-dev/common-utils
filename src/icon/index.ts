import { ArrowIcons } from "./arrow";
import { IconElement, type Icon } from "./icon";
import { TextIcons } from "./text";

const Icons = {
    ...TextIcons,
    ...ArrowIcons,
} as { [key: string]: () => IconElement }

export type IconTypes = keyof typeof Icons

export function Icon(type: IconTypes): Icon {
    return Icons[type]();
}