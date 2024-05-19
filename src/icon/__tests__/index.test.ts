import { expect, test } from "vitest";
import { Icons } from "../icons";


test("All Icons are registered using the 'icon-naming-convention'", ()=> {

    const iconNames = Object.keys(Icons);
    const invalidNames = iconNames.filter(x=> x.toLocaleLowerCase() != x);

    expect(invalidNames).toMatchObject([])
})