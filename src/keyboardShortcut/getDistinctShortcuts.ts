import { ShortcutOption } from "./keyboardShortcut";



export function getDistinctShortcuts<T extends ShortcutOption>(shortcuts: T[]): T[] {
    return shortcuts.reduce(
        (arr, curr) => {
            const index = arr.findIndex(group => group[0].shortcut == curr.shortcut
                && (group.some(y => y.target.contains(curr.target) || curr.target.contains(y.target)))
            );

            if (index == -1) arr.push([curr]);
            else {
                const hasCloser = arr[index].some(x => x.target.contains(curr.target));

                if (hasCloser) {
                    arr[index] = arr[index]
                        .filter(x => x.target.contains(curr.target) == false && curr.target.contains(x.target) == false)
                        .concat(curr);
                }
            }
            return arr
        },
        [] as T[][])
        .flat()
}
