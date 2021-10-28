/**
* name
*/
declare module riggerLayout {
    class LayoutLayer extends Group {
        protected topContainer: ITopContainer;
        readonly designWidth: number;
        readonly designHeight: number;
        relateTop(item: any): string;
        relateBottom(item: any): string;
        relateLeft(item: any): string;
        relateRight(item: any): string;
        relateHorizontalCenter(item: any): string;
        constructor(container: ITopContainer);
        measure(ifChild?: boolean): void;
        protected initRectangle(): void;
        protected decideRealSize(): void;
        protected decideRealPos(): void;
        draw(): void;
        protected onResize(): void;
    }
}
