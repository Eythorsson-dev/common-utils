import { getShortcutString } from "./getShortcutString";



export function getFormattedShortcut(shortcut: string): string {
    return shortcut.toLowerCase()
        .split(" ").join("")
        .split(",")
        .map(str => {
            const keys = str.split("+");
            
            if (keys.filter(x => x.length == 1).length != 1)
                throw new Error("shortcut must contain one letter");

            if(keys.some(x=> x != "ctrl" && x != "shift" && x != "alt" && x.length != 1))
                throw new Error("The shortcut string contains unrecognizable characters");

            return getShortcutString(
                keys.some(x => x == "ctrl"),
                keys.some(x => x == "shift"),
                keys.some(x => x == "alt"),
                keys.find(x => x.length == 1)!
            );
        }).join(",");
}
