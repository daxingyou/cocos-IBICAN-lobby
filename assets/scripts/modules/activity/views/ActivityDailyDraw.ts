import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import ActivityServer from "../servers/ActivityServer";
import ActivityDrawModel, { PoolType } from "../models/ActivityDrawModel";
import { Winning, PrizePool, PoolProp, ErrResp } from "../../../protocol/protocols/protocols";
import PerRecordView from "./PerRecordView";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import ActivityDrawSignal from "../signals/ActivityDrawSignal";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import GoldGainPanel from "./GoldGainPanel";
import DrawHelpPanel from "./DrawHelpPanel";
import ActivityPanel, { page } from "./ActivityPanel";
import GrandWingSignal from "../signals/GrandWingSignal";
import ConversionFunction from "../../../../libs/common/scripts/utils/mathUtils/ConversionFunction";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ActivityDailyDraw extends Panel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @riggerIOC.inject(ActivityServer)
    private activityServer: ActivityServer = null;

    @riggerIOC.inject(ActivityDrawModel)
    private activityDrawModel: ActivityDrawModel;

    @property(cc.Node)
    private perNode: cc.Node = null;

    @property(cc.Node)
    private bigPrizeNode: cc.Node = null;

    @property(cc.Node)
    private perView: cc.Node = null;

    @property(cc.Node)
    private bigPriView: cc.Node = null;
    
    @property(cc.Node)
    private winRecordNode: cc.Node = null;

    @property(cc.Prefab)
    private perRecordView: cc.Prefab = null;

    @property(cc.Sprite)
    private turnTypeSprite: cc.Sprite = null

    @property(cc.Sprite)
    private turnBtnSprite: cc.Sprite = null

    @property(cc.SpriteFrame)
    private turnTypeBack: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    private turnBtnBack: cc.SpriteFrame[] = [];

    @property(cc.Button)
    private sliverBtn: cc.Button = null

    @property(cc.Button)
    private goldBtn: cc.Button = null

    @property(cc.Button)
    private diamondBtn: cc.Button = null

    @property(cc.Button)
    private turnDrawBtn: cc.Button = null

    @property(cc.Node)
    private turnPrizeNode: cc.Node = null;

    @property(cc.Label)
    private tomorrowScore: cc.Label = null;

    @property(cc.Label)
    private todaytScore: cc.Label = null;

    @property(cc.Node)
    private huangguang: cc.Node = null;

    @property(cc.Node)
    private languang: cc.Node = null;

    @property(cc.Node)
    private ziguang: cc.Node = null;

    @property(cc.Node)
    private turnPlate: cc.Node = null;

    @property(cc.Node)
    private turnBack: cc.Node = null;

    @property(cc.Node)
    private guangxiao: cc.Node = null;

    @property(cc.Button)
    private helpBtn: cc.Button = null

    @property(cc.Label)
    private sliverConsume: cc.Label = null;

    @property(cc.Label)
    private goldConsume: cc.Label = null;

    @property(cc.Label)
    private diamonConsume: cc.Label = null;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(ActivityDrawSignal)
    private activityDrawSignal: ActivityDrawSignal;    

    @riggerIOC.inject(GrandWingSignal)
    private grandWingSignal: GrandWingSignal;    

    @property(cc.Button)
    private allNodeBtn: cc.Button = null

    // @property(cc.Button)
    // private perNodeBtn: cc.Button = null

    // @property(cc.Node)
    // private jinfen: cc.Node = null;

    private colorAction: cc.Action = cc.repeatForever(
        cc.sequence(
            cc.fadeIn(1),
            cc.fadeOut(1)
        )
    )
    
    private poolId: number 
    private winPosition: number = 0.0625
    private turnNum: number = 22.5
    private consume: number = 0

    //白银转盘奖励
    private sliverPool: PoolProp[] = []
    //黄金转盘奖励
    private goldPool: PoolProp[] = []
    //钻石转盘奖励
    private diamondPool: PoolProp[] = []

    onShow() {
        super.onShow();
        this.initView();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    private async initView(){
        // this.onBigPrizeNodeBtn()
        this.allNodeBtn.getComponent(cc.Toggle).isChecked = true
        if(this.activityDrawModel.firstIntPut){
            let task = this.activityServer.getWinningRecord();
            let result = await task.wait()
            if(result.isOk){
                this.activityDrawModel.firstIntPut = false
                this.activityDrawModel.grandWinningList = result.result.grandWinningList
                this.activityDrawModel.myWinningList = result.result.myWinningList
                this.activityDrawModel.latestWinningList = result.result.latestWinningList
                this.activityDrawModel.poolList = result.result.poolList
                this.activityDrawModel.todayScore = result.result.todayScore
                this.activityDrawModel.tomorrowScore = result.result.tomorrowScore
                this.initWinningList()
                this.initTurnPrizePool()
                return
            }else{
                cc.log(result.reason)
            }
        }
        this.initWinningList()
        this.initTurnPrizePool()
        this.onBigPrizeNodeBtn()
    }

    private initWinningList(){
        this.initMyWinningList()
        this.initGrandWinningList()
        this.initLatestWinningList()
    }

    private initMyWinningList(){
        this.perNode.removeAllChildren()
        if(this.activityDrawModel.myWinningList.length > 0){
            let myWinList = this.activityDrawModel.myWinningList
            myWinList.forEach((winInfo: Winning)=>{
                // if(index > 9) return 
                // if(this.perNode.children.length > 9) return 
                let perRecord = UIUtils.instantiate(this.perRecordView); 
                let perItem = perRecord.getComponent(PerRecordView);
                perItem.initItem(winInfo)
                this.perNode.addChild(perRecord)
            })
        }
    }

    private initGrandWinningList(){
        if(this.activityDrawModel.grandWinningList.length > 0){
            this.bigPrizeNode.removeAllChildren()
            let grandWinList = this.activityDrawModel.grandWinningList
            grandWinList.forEach((winInfo: Winning)=>{
                // if(index > 9) return 
                // if(this.bigPrizeNode.children.length > 9) return 
                let perRecord = UIUtils.instantiate(this.perRecordView); 
                let perItem = perRecord.getComponent(PerRecordView);
                perItem.initItem(winInfo)
                this.bigPrizeNode.addChild(perRecord)
            })
        }
    }

    private initLatestWinningList(){
        if(this.activityDrawModel.latestWinningList.length > 0){
            this.winRecordNode.removeAllChildren()
            let latestList = this.activityDrawModel.latestWinningList
            latestList.forEach((winInfo: Winning, index)=>{
                if(index < latestList.length - 5) return 
                if(index >= latestList.length - 5){
                    let node = this.addRichTxt(winInfo)
                    this.winRecordNode.addChild(node)
                }
            })
        }
    }

    private initTurnPrizePool(){
        this.tomorrowScore.string = this.activityDrawModel.tomorrowScore + ''
        this.todaytScore.string = this.activityDrawModel.todayScore + ''
        if(this.activityDrawModel.poolList.length > 0){
            let poolList = this.activityDrawModel.poolList
            poolList.forEach((prizePool)=>{
                switch (prizePool.poolId){
                    case PoolType.SliverTurn:
                        this.sliverConsume.string = prizePool.consumedScore + '积分'
                        this.sliverPool = prizePool.propList
                        break;
                    case PoolType.GoldTurn:
                        this.goldConsume.string = prizePool.consumedScore + '积分'
                        this.goldPool = prizePool.propList
                        break;
                    case PoolType.DiamonTurn:
                        this.diamonConsume.string = prizePool.consumedScore + '积分'
                        this.diamondPool = prizePool.propList
                        break;
                }
            })
        }
        
        if(!this.poolId){
            this.initSliver()
        }
        
    }

    private updateTurnScore(){
        // this.activityDrawModel.todayScore = Number(this.activityDrawModel.todayScore - this.consume)
        this.activityDrawModel.todayScore = ConversionFunction.intToFloat((this.activityDrawModel.todayScore - this.consume) * 100,2)
        this.todaytScore.string = this.activityDrawModel.todayScore + ''
    }

    private initPrizeData(prizeData: PoolProp[]){
        this.turnPrizeNode.children.forEach((child,index)=>{
            child.getComponent(cc.Label).string = prizeData[index].propCount + ''
        })
    }

    addRichTxt(winInfo: Winning){
        let node = new cc.Node()
        let color = this.lateSetFontColor(winInfo.poolId)
        let richTxt = node.addComponent(cc.RichText)
        let nickname = this.changNickName(winInfo.nickname)
        richTxt.string = '恭喜<color=green>' + nickname + '</color>在<color='+color+'>' + 
        winInfo.poolName + '</color>获得' + winInfo.prizeAmount/100 + '元'
        richTxt.fontSize = 18
        richTxt.lineHeight = 22

        // let widget = node.addComponent(cc.Widget)
        // widget.isAlignLeft = true
        // widget.left = 20
        return node
    }

    changNickName(nickname:string){
        let len = 0
        let nickStr = ''
        let str = '***'
        for(let i = nickname.length-1; i >= 0; i--){
            if(nickname.charCodeAt(i) > 127 || nickname.charCodeAt(i) == 94){
                len += 2
            }else{
                len ++
            }
            nickStr += nickname[i]
            if(len >= 4){
                str += nickStr.split("").reverse().join("")
                break
            }
        }
        return str
    }

    lateSetFontColor(poolId: number){
        switch (poolId){
            case PoolType.SliverTurn:
                return '#10c8f0';
            case PoolType.GoldTurn:
                return '#f7ce3e';
            case PoolType.DiamonTurn:
                return '#d835f5';
        }
    }

    onPerNodeBtn(){
        this.perView.active = true
        this.bigPriView.active = false
    }

    onBigPrizeNodeBtn(){
        this.perView.active = false
        this.bigPriView.active = true
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnWindow,this);
        this.sliverBtn.node.on('click',this.onSliverBtn,this)
        this.goldBtn.node.on('click',this.onGoldBtn,this)
        this.diamondBtn.node.on('click',this.onDiamondBtn,this)
        this.turnDrawBtn.node.on('click',this.onTurnDrawBtn,this)
        this.helpBtn.node.on('click',this.onHelpBtn,this)
        this.activityDrawSignal.on(this, this.updateLateWinningList);
        this.grandWingSignal.on(this, this.updateGrandWinningList);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnWindow, this);
        this.sliverBtn.node.off('click',this.onSliverBtn,this)
        this.goldBtn.node.off('click',this.onGoldBtn,this)
        this.diamondBtn.node.off('click',this.onDiamondBtn,this)
        this.turnDrawBtn.node.off('click',this.onTurnDrawBtn,this)
        this.helpBtn.node.off('click',this.onHelpBtn,this)
        this.activityDrawSignal.off(this, this.updateLateWinningList);
        this.grandWingSignal.off(this, this.updateGrandWinningList);
    }

    updateLateWinningList() {
        this.initLatestWinningList()
    }

    updateGrandWinningList() {
        this.initGrandWinningList()
    }

    private initSliver(){
        this.poolId = PoolType.SliverTurn
        this.turnTypeSprite.spriteFrame = this.turnTypeBack[0]
        this.turnBtnSprite.spriteFrame = this.turnBtnBack[0]
        this.languang.active = true
        this.huangguang.active = false
        this.ziguang.active = false
        this.initPrizeData(this.sliverPool)
        this.updateConsumeData()
        this.languang.runAction(this.colorAction.clone())
    }

    onHelpBtn(){
        UIManager.instance.showPanel(DrawHelpPanel, LayerManager.uiLayerName, false)
    }

    private onSliverBtn(){
        if(!this.turnDrawBtn.interactable) return 
        this.poolId = PoolType.SliverTurn
        this.turnTypeSprite.spriteFrame = this.turnTypeBack[0]
        this.turnBtnSprite.spriteFrame = this.turnBtnBack[0]
        this.languang.active = true
        this.huangguang.active = false
        this.ziguang.active = false
        this.languang.runAction(this.colorAction.clone())
        this.initPrizeData(this.sliverPool)
        this.updateConsumeData()
    }
    
    private onGoldBtn(){
        if(!this.turnDrawBtn.interactable) return 
        this.poolId = PoolType.GoldTurn
        this.turnTypeSprite.spriteFrame = this.turnTypeBack[1]
        this.turnBtnSprite.spriteFrame = this.turnBtnBack[1]
        this.huangguang.active = true
        this.languang.active = false
        this.ziguang.active = false
        this.huangguang.runAction(this.colorAction.clone())
        this.initPrizeData(this.goldPool)
        this.updateConsumeData()
    }

    private onDiamondBtn(){
        if(!this.turnDrawBtn.interactable) return 
        this.poolId = PoolType.DiamonTurn
        this.turnTypeSprite.spriteFrame = this.turnTypeBack[2]
        this.turnBtnSprite.spriteFrame = this.turnBtnBack[2] 
        this.ziguang.active = true
        this.languang.active = false
        this.huangguang.active = false
        this.ziguang.runAction(this.colorAction.clone())
        this.initPrizeData(this.diamondPool)
        this.updateConsumeData()
    }

    updateConsumeData(){
        let poolList = this.activityDrawModel.poolList
        poolList.forEach((prizePool)=>{
            if(prizePool.poolId == this.poolId){
                this.consume = prizePool.consumedScore
                return
            }
        })
    }


    //抽奖动作
    private async onTurnDrawBtn(){
        // this.jinfen.active = true
        // let animation = this.jinfen.getComponent(cc.Animation)
        // animation.defaultClip.wrapMode = cc.WrapMode.Loop
        // animation.play()

        if(this.activityDrawModel.todayScore < this.consume){
            this.pushTipsQueueSignal.dispatch('积分不足');
            return;
        }

        this.turnDrawBtn.interactable = false
        let flag = false;
        let turnB: cc.Action
        let turnA: cc.Action = cc.sequence(
            cc.rotateBy(0.6,360),
            cc.callFunc(()=>{
                if(!flag){
                    this.turnPlate.runAction(turnA)
                }else{
                    this.turnPlate.runAction(turnB)
                }
            })
        )
        
        let backB: cc.Action
        let backA: cc.Action = cc.sequence(
            cc.rotateBy(0.6,360),
            cc.callFunc(()=>{
                if(!flag){
                    this.turnBack.runAction(backA)
                }else{
                    this.turnBack.runAction(backB)
                }
            })
        )

        let guangB: cc.Action
        let guangA: cc.Action = cc.sequence(
            cc.rotateBy(0.6,360),
            cc.callFunc(()=>{
                if(!flag){
                    this.guangxiao.runAction(guangA)
                }else{
                    this.guangxiao.runAction(guangB)
                }
            })
        )

        this.guangxiao.runAction(guangA)
        this.turnBack.runAction(backA)
        this.turnPlate.runAction(turnA)

        let task = this.activityServer.getDailyDrawReq(this.poolId);
        let result = await task.wait()  
        if(result.isOk){
            flag = true;
            let winPos = result.result.winPosition
            if(this.activityDrawModel.myWinningList.length>0){
                this.activityDrawModel.myWinningList.unshift(result.result.winning)
            }else{
                this.activityDrawModel.myWinningList = this.activityDrawModel.myWinningList.concat(result.result.winning)
            }
            this.activityDrawModel.latestWinningList = this.activityDrawModel.latestWinningList.concat(result.result.winning)
            
            this.updateTurnScore()

            cc.log('winpos:'+winPos)
            let turnDegree = (winPos - this.winPosition) * 360
            let guangTurn = winPos * 360

            let guangDegree = 45
            if(guangTurn%45 > 0){
                guangDegree = 45 - guangTurn%45
            }

            guangB = cc.rotateBy(3.3,360*10 + guangDegree - this.turnNum).easing(cc.easeOut(3))
            backB = cc.rotateBy(3,360*5 - turnDegree).easing(cc.easeOut(5))
            turnB = cc.sequence(
                cc.rotateBy(3,360*5 - turnDegree).easing(cc.easeOut(5)),
                cc.delayTime(1),
                cc.callFunc(()=>{
                    this.initMyWinningList()
                    this.updateLateWinningList()
                    this.turnDrawBtn.interactable = true
                    this.winPosition = winPos
                    this.turnNum = guangDegree
                    UIManager.instance.showPanel(GoldGainPanel, LayerManager.uiLayerName, false,result.result.winning.prizeAmount/100)
                    // animation.stop()
                    // this.jinfen.active = false
                })
            )
        }
    }

    private onCloseBtnWindow() {
        this.closeWindow();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
        // this.showActivityPanelSignal.dispatch(page.activity);
        UIManager.instance.showPanel(ActivityPanel, LayerManager.uiLayerName,true,page.activity)
    }
}

