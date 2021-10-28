import TouchFullScreenUtils, { ScreenMode } from "./TouchFullScreenUtils";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class TouchFullScreen {
    public static get instance(): TouchFullScreen {
        if (!TouchFullScreen.inst) TouchFullScreen.inst = new TouchFullScreen();
        return TouchFullScreen.inst;
    }
    private static inst: TouchFullScreen = null;

    constructor() {
    }

    init() {
        if(!TouchFullScreenUtils.isSupported()) {
            window.onresize = () => {
                setTimeout(() => {
                    cc.view.setFrameSize(window.innerWidth, window.innerHeight);
                }, 300);
            };
            return;
        } 
        this.onCreate();        
    }

    private screenMode: ScreenMode = ScreenMode.none;
    /**
     * 支持的屏幕模式
     */
    setScreenMode(mode: ScreenMode) {
        this.screenMode = mode;
    }

    getScreenMode(): ScreenMode {
        return this.screenMode;
    }
    
    private cocosContainer: HTMLDivElement;
    private cocosCanvas: HTMLCanvasElement;
    private maskElement: HTMLDivElement;
    private body: HTMLElement;
    private isShowMask: boolean = true;
    private onCreate() {
        this.body = document.getElementsByTagName('body')[0];
        this.cocosContainer = document.getElementById('Cocos2dGameContainer') as HTMLDivElement;
        this.cocosCanvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
        this.maskElement = document.createElement('div');
        this.maskElement.innerHTML = `<br /><img src="arrow.2cb0a.png" /><br />` + '向上滑动可全屏游戏';
        this.maskElement.setAttribute("style", "position:absolute; text-align:center; font-size:20px; color:#ffffff; left:0px; top:0px; background:rgba(0, 0, 0, 0.5);");
        this.maskElement.setAttribute("id", "maskDiv");
        // this.maskElement.style.pointerEvents = 'none';
        this.maskElement.onselectstart = function () { return false; };
        this.cocosContainer.appendChild(this.maskElement);
        // this.gameDiv.insertBefore(this.maskElement, this.cocosContainer);
        // this.body.insertBefore(this.maskElement, this.body.lastChild);
        // this.body.append(this.maskElement);
        cc.view.resizeWithBrowserSize(true);
        cc.view.adjustViewportMeta(true);
        this.initScreenInnerHeight();
        this.onResize();
        window.onresize = () => {
            this.onResize();
            setTimeout(() => {
                cc.view.setFrameSize(window.innerWidth, window.innerHeight);
            }, 300);
        };
        this.addEventListener();
    }

    maskDivStatus(isShow: boolean) {
        this.maskElement.style.visibility = isShow ? "visible" : "hidden";
        this.isShowMask = isShow;
    }

    resizeMaskElementHeight() {
        if(this.isShowMask) this.maskElement.style.height = "200%";
        else this.maskElement.style.height = "101%";
    }

    private landScreenInnerHeight: number;
    private portraitScreenInnerHeight: number;
    initScreenInnerHeight() {
        if(TouchFullScreenUtils.getScreenMode() == ScreenMode.LandScreen) {
            if(!this.landScreenInnerHeight || window.innerHeight < this.landScreenInnerHeight) {
                this.landScreenInnerHeight = window.innerHeight;
            }
        }
        else {
            if(!this.portraitScreenInnerHeight || window.innerHeight < this.portraitScreenInnerHeight) {
                this.portraitScreenInnerHeight = window.innerHeight;
            }
        }
    }

    decideMaskIsShow() {
        if(this.screenMode != ScreenMode.none) {
            if(TouchFullScreenUtils.getScreenMode() != this.screenMode) {
                this.maskDivStatus(false);
                window.scroll(0, 0);
                return;
            }
        }

        setTimeout( () => {
            if(TouchFullScreenUtils.isSafari()) {
                this.decideOnSafari(); //ios safari浏览器
            } 
            else if(TouchFullScreenUtils.onIosChrome || TouchFullScreenUtils.isAdrChrome) {
                this.decideOnChrome(); // ios android下的chrome浏览器
            } 
            else {
                this.decideOnAll();
            }
            this.resizeMaskElementHeight();
            window.scroll(0, 0);
        }, 400)
    }

    decideOnAll() {
        if(TouchFullScreenUtils.getScreenMode() == ScreenMode.LandScreen) {
            if(window.innerHeight > this.landScreenInnerHeight) {
                this.maskDivStatus(false);
                window.scroll(0, 0);
            }
            else {
                this.maskDivStatus(true);
                window.scroll(0, 0);
            }
        }
        else {
            if(window.innerHeight > this.portraitScreenInnerHeight) {
                this.maskDivStatus(false);
                window.scroll(0, 0);
            }
            else {
                this.maskDivStatus(true);
                window.scroll(0, 0);
            }
        }
    }

    /**
     * iOS safari浏览器全屏适配
     */
    decideOnSafari() {
        if(TouchFullScreenUtils.getScreenMode() == ScreenMode.LandScreen) {
            if(window.innerHeight < document.documentElement.clientHeight) {
                this.maskDivStatus(true);
                window.scroll(0, 0);
            }
            else if(window.innerHeight >= document.documentElement.clientHeight) {
                this.maskDivStatus(false);
                window.scroll(0, 0);
            }
        }
        else {
            if(window.innerHeight <= document.documentElement.clientHeight) {
                this.maskDivStatus(true);
                window.scroll(0, 0);
            }
            else if(window.innerHeight > document.documentElement.clientHeight) {
                this.maskDivStatus(false);
                window.scroll(0, 0);
            }
        }
    }

    /**
     * chrome浏览器全屏适配
     */
    decideOnChrome() {
        if(window.innerHeight <= document.documentElement.clientHeight) {
            this.maskDivStatus(true);
            window.scroll(0, 0);
        }
        else if(window.innerHeight > document.documentElement.clientHeight) {
            this.maskDivStatus(false);
            window.scroll(0, 0);
        }
    }

    addEventListener() {
        document.addEventListener('touchstart', this.onTouchStart.bind(this), true);
        document.addEventListener('touchmove', this.onTouchMove.bind(this), true);
        document.addEventListener('touchend', this.onTouchEnd.bind(this), true);
        document.addEventListener('scroll', this.onScroll.bind(this), true);
    }

    removeEventListener() {
        document.removeEventListener('touchstart', this.onTouchStart, true);
        document.removeEventListener('touchmove', this.onTouchMove, true);
        document.removeEventListener('touchend', this.onTouchEnd, true);
        document.removeEventListener('scroll', this.onScroll.bind(this), true);
    }

    private onResize() {
        this.initScreenInnerHeight();
        let screenH: number = TouchFullScreenUtils.getScreenMode() == ScreenMode.LandScreen ? screen.width : screen.height;
        this.maskElement.style.width = "100%";
        this.maskElement.style.height = "200%";
        this.maskElement.style.top = this.maskElement.style.left = 0 + 'px';
        this.decideMaskIsShow();
        // cc.log(`FrameSize: (${cc.view.getFrameSize().width}, ${cc.view.getFrameSize().height})`);
        // cc.log(`winSize: (${cc.winSize.width}, ${cc.winSize.height})`);
        // cc.log(`visibleSize: (${cc.view.getVisibleSize().width}, ${cc.view.getVisibleSize().height})`);
        // cc.log(`inner: (${window.innerWidth},${window.innerHeight})`);
        // cc.log(`client: (${document.documentElement.clientWidth}, ${document.documentElement.clientHeight})`);
        // cc.log(`body: (${document.body.clientWidth}, ${document.body.clientHeight})`);
        // cc.log(`screen: (${screen.width}, ${screen.height})`);
        // cc.log(`scrollTop: (${document.documentElement.scrollTop}, ${document.body.scrollTop})`);
        // cc.log(`pageYOffset: (${document.documentElement.offsetHeight},${document.body.offsetHeight})`);
        // cc.log(`avail: (${window.screen.availWidth},${window.screen.availHeight})`);
        // cc.log(`screenTop: (${window.screenTop})`);
    }

    private isTouching: boolean = false;
    private onTouchStart(e) {
        this.isTouching = true;
        if(e.touches.length > 1) {
            e.stopPropagation();
            e.preventDefault();
            this.isTouching = false;
        }
    }

    private onTouchMove(e) {
        this.isTouching = true;
        if(e.touches.length > 1) {
            e.stopPropagation();
            e.preventDefault();
            this.isTouching = false;
        }
    }

    private onTouchEnd(e) {
        this.isTouching = false;
        this.decideMaskIsShow();
    }

    private onScroll(e) {
        if(!this.isTouching) {
            e.stopPropagation();
            e.preventDefault();
            window.scroll(0, 0);
        }
    }
}