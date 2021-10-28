import SubGamesServer from "../servers/SubGamesServer";
import RequestLaunchInfoTask from "../servers/tasks/RequestLaunchInfoTask";
import { GameLaunchInjectResp, ErrResp, LoginResp } from "../../../protocol/protocols/protocols";
import NativeFileUtils from "../../../../libs/native/NativeFileUtils";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import SubGameEntity, { LaunchType } from "../models/SubGameEntity";
import SubGamesModel from "../models/SubGamesModel";
import SituationModel from "../../../../libs/common/scripts/modules/situation/models/SituationModel";
import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
import BaseConnectionSpec from "../../../../libs/common/scripts/modules/network/servers/BaseConnectionSpec";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class PrepareToLaunchSubGameCommand extends riggerIOC.WaitableCommand {

   @riggerIOC.inject(SubGamesServer)
   private server: SubGamesServer;

   @riggerIOC.inject(SubGamesModel)
   private subGameModel: SubGamesModel;

   @riggerIOC.inject(PushTipsQueueSignal)
   private tipsSignal: PushTipsQueueSignal;

   @riggerIOC.inject(SituationModel)
   private situationModel: SituationModel;

   onCancel(): void {

   }

   async execute(subGameId, ret) {
      cc.log(`prepare:${ret}`)
      console.time("*** 准备登录信息 ***");
      // 从服务器获取启动信息
      if (!ret) {
         this.done(false);
      }
      else {
         cc.log(`now request launch info:${subGameId}`);
         let task: RequestLaunchInfoTask = this.server.requestLaunchInfo(subGameId);
         let resp = await task.wait();

         // let metas = frag.children

         if (resp.isOk) {
            // 根据游戏类型处理启动数据
            let entity: SubGameEntity = this.subGameModel.getSubGame(subGameId);
            switch (entity.launchType) {
               case LaunchType.Native:
                  let ret = this.parseMeta(resp.result.metaData);
                  // 将启动数据写入全局环境中去
                  // 登录描述信息
                  let loginSpec: LoginRequest = new LoginRequest();
                  loginSpec.token = ret["token"];
                  this.situationModel.setLoginSpecGlobal(loginSpec, subGameId);

                  // 连接信息
                  let serverUrl: string = ret["serverIp"];
                  serverUrl = window.atob(serverUrl);

                  let port = ret["serverPort"];
                  if (port) {
                     port = window.atob(port);
                  }

                  let connectionSpec: BaseConnectionSpec = new BaseConnectionSpec(serverUrl, port);
                  this.situationModel.setConnectionSpecGlobal(connectionSpec, subGameId);

                  // 其它的一些信息
                  // 报表地址
                  let recordUrl:string = ret["recordUrl"];
                  recordUrl = window.atob(recordUrl);
                  this.situationModel.setRecordUrlGlobal(recordUrl, subGameId);

                  break;
               case LaunchType.WebView:
                  let t_textPath = NativeFileUtils.getWritablePath() + "subGames/" + subGameId + "/bin/index.html";
                  this.writeHtml(t_textPath, resp.result.metaData);
                  break;
               default:
                  break;
            }

            this.done(true);
         }
         else {
            // 错误码
            let err: ErrResp = resp.reason;
            if (err) {
               console.log(`failed to request launch info, err code:${err.errCode}, message:${err.errMsg}`);
               this.tipsSignal.dispatch(err.errMsg);
            }
            this.done(false);
         }

         console.timeEnd("*** 准备登录信息 ***");
      }
   }

   private parseMeta(meta: string) {
      let metas = meta.split('<meta id="');
      let ret = {}
      for (let i = 0; i < metas.length; i++) {
         let meta = metas[i].split('" value="');
         if (meta.length == 2) {
            ret[meta[0]] = meta[1].replace('" />', '').trim();
         }
      }

      return ret;
   }

   private writeHtml(path: string, meta: string) {
      cc.log(`meta:${meta}`);
      if (!cc.sys.isNative) {
         // this.done(false);
         return;
      }

      let t_str = jsb.fileUtils.getStringFromFile(path);
      let t_htmlNotesH = "<!--addMeta begin-->";
      let t_htmlNotesE = "<!--addMeta end-->";
      let t_htmlHead = "";
      let t_htmlEnd = "";
      let t_html = "";
      if (t_str) {
         let t_metaIndexH = t_str.indexOf(t_htmlNotesH);
         let t_metaIndexE = t_str.indexOf(t_htmlNotesE);
         if (t_metaIndexH > -1 && t_metaIndexE > -1) {
            t_htmlHead = t_str.substring(0, t_metaIndexH + t_htmlNotesH.length);
            t_htmlNotesH = "";
            t_htmlNotesE = "";
         } else {
            t_metaIndexH = 0;
            t_metaIndexE = t_str.indexOf("<script>");
            t_htmlHead = t_str.substring(t_metaIndexH, t_metaIndexE);
         }
         t_htmlEnd = t_str.substring(t_metaIndexE, t_str.length);
         // cc.log("mate :" + this.gameRunnerServer.meta)
         t_html = t_htmlHead + t_htmlNotesH + meta + t_htmlNotesE + t_htmlEnd;
         jsb.fileUtils.writeStringToFile(t_html, path);
         // cc.log("t_html:" + t_html);
      }
   }
}
