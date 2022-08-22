export namespace Is {
    export const nil = (a: any): a is null | undefined => a === null || a === undefined;

    export const empty = (a: any) => {
        if (nil(a)) return true;
        if (a === "") return true;
        if (Number.isNaN(a)) return true;
        if (Array.isArray(a) && a.length === 0) return true;
        if (a instanceof Date) return isNaN(a as any);
        return Object.keys(a).length === 0 && Object.getPrototypeOf(a) === Object.prototype;
    };

    export const string = (str: any): str is string => typeof str === "string";
}
