export interface Icon {
}
export interface IconElement extends SVGElement, Icon {
}
declare const Icons: {
    "arrow-chevronRight": () => IconElement;
    "text-bold": () => IconElement;
    "text-italic": () => IconElement;
    "text-underline": () => IconElement;
};
export type IconTypes = keyof typeof Icons;
export declare function Icon(type: IconTypes): Icon;
export {};
