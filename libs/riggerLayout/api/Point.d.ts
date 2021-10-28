/**
* name
*/
declare module riggerLayout {
    class Point implements IRecoverable {
        static readonly sign: string;
        static createInstance(): Point;
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        clone(): Point;
        recover(): void;
    }
}
