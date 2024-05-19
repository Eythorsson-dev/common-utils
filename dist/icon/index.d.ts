import { IconElement, Icon } from './icon';

declare const Icons: {
    [key: string]: () => IconElement;
};
export type { IconElement };
export type IconTypes = keyof typeof Icons;
export declare function Icon(type: IconTypes): Icon;
