export interface Icon {
}
export interface IconElement extends SVGElement, Icon {
}
declare const Icons: {
    [key: string]: () => IconElement;
};
export type IconTypes = keyof typeof Icons;
export declare function Icon(type: IconTypes): Icon;
export {};
