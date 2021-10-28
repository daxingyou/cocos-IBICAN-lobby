var protobuf;
if(CC_EDITOR) {
	protobuf = {};
	(function() {
		var message = function() {};
		protobuf.Message = message;
		protobuf.Type = {};
		protobuf.Type.d = function(a) {};
		protobuf.Field = {};
		protobuf.Field.d = function(a, b, c) {};
	})()
}
else {
	protobuf = require("protobufjs");
}

@protobuf.Type.d('LoginReq')
export class LoginReq extends protobuf.Message<LoginReq>{

		@protobuf.Field.d(1,"string","required")
		public token:string;

		@protobuf.Field.d(2,"int32","required")
		public platform:number;

		@protobuf.Field.d(3,"string","optional")
		public markCode?:string;

		@protobuf.Field.d(4,"int64","optional")
		public referrerId?:number;

		@protobuf.Field.d(5,"string","optional")
		public referrerChannel?:string;

		@protobuf.Field.d(6,"int32","optional")
		public gameId?:number;

		@protobuf.Field.d(7,"string","optional")
		public deviceNo?:string;
}

@protobuf.Type.d('LoginResp')
export class LoginResp extends protobuf.Message<LoginResp>{

		@protobuf.Field.d(1,"uint32","required")
		public serverSec:number;

		@protobuf.Field.d(2,"userInfo","required")
		public userInfo:UserInfo;
}

@protobuf.Type.d('ErrResp')
export class ErrResp extends protobuf.Message<ErrResp>{

		@protobuf.Field.d(1,"uint32","required")
		public cmd:number;

		@protobuf.Field.d(2,"uint32","optional")
		public errCode?:number;

		@protobuf.Field.d(3,"string","optional")
		public errMsg?:string;
}

@protobuf.Type.d('BeatHeartReq')
export class BeatHeartReq extends protobuf.Message<BeatHeartReq>{
}

@protobuf.Type.d('BeatHeartResp')
export class BeatHeartResp extends protobuf.Message<BeatHeartResp>{

		@protobuf.Field.d(1,"uint32","required")
		public serverSec:number;
}

@protobuf.Type.d('GmReq')
export class GmReq extends protobuf.Message<GmReq>{

		@protobuf.Field.d(1,"string","required")
		public gmStr:string;
}

@protobuf.Type.d('GmResp')
export class GmResp extends protobuf.Message<GmResp>{
}

@protobuf.Type.d('KickUserPush')
export class KickUserPush extends protobuf.Message<KickUserPush>{

		@protobuf.Field.d(1,"uint32","required")
		public code:number;
}

@protobuf.Type.d('RechargeReq')
export class RechargeReq extends protobuf.Message<RechargeReq>{

		@protobuf.Field.d(1,"uint64","required")
		public amount:number;

		@protobuf.Field.d(2,"string","required")
		public payFlag:string;
}

@protobuf.Type.d('RechargeResp')
export class RechargeResp extends protobuf.Message<RechargeResp>{

		@protobuf.Field.d(1,"string","required")
		public orderNo:string;

		@protobuf.Field.d(2,"int32","required")
		public payAction:number;

		@protobuf.Field.d(3,"string","required")
		public payData:string;
}

@protobuf.Type.d('UserInfoModifyPush')
export class UserInfoModifyPush extends protobuf.Message<UserInfoModifyPush>{

		@protobuf.Field.d(1,"userInfo","required")
		public userInfo:UserInfo;
}

@protobuf.Type.d('GameListReq')
export class GameListReq extends protobuf.Message<GameListReq>{
}

@protobuf.Type.d('GameListResp')
export class GameListResp extends protobuf.Message<GameListResp>{

		@protobuf.Field.d(1,"game","repeated")
		public gameList:Game[];
}

@protobuf.Type.d('GameLaunchReq')
export class GameLaunchReq extends protobuf.Message<GameLaunchReq>{

		@protobuf.Field.d(1,"string","required")
		public itemId:string;
}

@protobuf.Type.d('GameLaunchResp')
export class GameLaunchResp extends protobuf.Message<GameLaunchResp>{

		@protobuf.Field.d(1,"string","required")
		public appId:string;

		@protobuf.Field.d(2,"int32","required")
		public time:number;

		@protobuf.Field.d(3,"string","required")
		public nonStr:string;

		@protobuf.Field.d(4,"string","required")
		public openId:string;

		@protobuf.Field.d(5,"string","required")
		public itemId:string;

		@protobuf.Field.d(6,"int32","required")
		public userType:number;

		@protobuf.Field.d(7,"string","required")
		public userName:string;

		@protobuf.Field.d(8,"string","optional")
		public nickName?:string;

		@protobuf.Field.d(9,"string","optional")
		public homeUrl?:string;

		@protobuf.Field.d(10,"string","optional")
		public agentId?:string;

		@protobuf.Field.d(11,"string","required")
		public sign:string;

		@protobuf.Field.d(12,"string","required")
		public action:string;
}

@protobuf.Type.d('GameLaunchInjectReq')
export class GameLaunchInjectReq extends protobuf.Message<GameLaunchInjectReq>{

		@protobuf.Field.d(1,"string","required")
		public itemId:string;
}

@protobuf.Type.d('GameLaunchInjectResp')
export class GameLaunchInjectResp extends protobuf.Message<GameLaunchInjectResp>{

		@protobuf.Field.d(1,"string","required")
		public metaData:string;
}

@protobuf.Type.d('TypeGameListReq')
export class TypeGameListReq extends protobuf.Message<TypeGameListReq>{
}

@protobuf.Type.d('TypeGameListResp')
export class TypeGameListResp extends protobuf.Message<TypeGameListResp>{

		@protobuf.Field.d(1,"typeGameInfo","repeated")
		public typeGameList:TypeGameInfo[];
}

@protobuf.Type.d('GameListPush')
export class GameListPush extends protobuf.Message<GameListPush>{

		@protobuf.Field.d(1,"game","repeated")
		public gameList:Game[];
}

@protobuf.Type.d('GameWalletTransferAllReq')
export class GameWalletTransferAllReq extends protobuf.Message<GameWalletTransferAllReq>{

		@protobuf.Field.d(1,"int32","required")
		public transferType:number;
}

@protobuf.Type.d('GameWalletTransferAllResp')
export class GameWalletTransferAllResp extends protobuf.Message<GameWalletTransferAllResp>{
}

@protobuf.Type.d('SafeDepositReq')
export class SafeDepositReq extends protobuf.Message<SafeDepositReq>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;
}

@protobuf.Type.d('SafeDepositResp')
export class SafeDepositResp extends protobuf.Message<SafeDepositResp>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;

		@protobuf.Field.d(2,"int64","required")
		public safeAmount:number;
}

@protobuf.Type.d('SafeWithdrawReq')
export class SafeWithdrawReq extends protobuf.Message<SafeWithdrawReq>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;

		@protobuf.Field.d(2,"string","required")
		public safePassword:string;
}

@protobuf.Type.d('SafeWithdrawResp')
export class SafeWithdrawResp extends protobuf.Message<SafeWithdrawResp>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;

		@protobuf.Field.d(2,"int64","required")
		public safeAmount:number;
}

@protobuf.Type.d('ModifySafePwdReq')
export class ModifySafePwdReq extends protobuf.Message<ModifySafePwdReq>{

		@protobuf.Field.d(1,"string","required")
		public newPassword:string;

		@protobuf.Field.d(2,"string","required")
		public oldPassword:string;
}

@protobuf.Type.d('ModifySafePwdResp')
export class ModifySafePwdResp extends protobuf.Message<ModifySafePwdResp>{
}

@protobuf.Type.d('GetSafeWalletReq')
export class GetSafeWalletReq extends protobuf.Message<GetSafeWalletReq>{
}

@protobuf.Type.d('GetSafeWalletResp')
export class GetSafeWalletResp extends protobuf.Message<GetSafeWalletResp>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;
}

@protobuf.Type.d('ModifyNicknameReq')
export class ModifyNicknameReq extends protobuf.Message<ModifyNicknameReq>{

		@protobuf.Field.d(1,"string","required")
		public nickname:string;
}

@protobuf.Type.d('ModifyNicknameResp')
export class ModifyNicknameResp extends protobuf.Message<ModifyNicknameResp>{

		@protobuf.Field.d(1,"string","required")
		public nickname:string;
}

@protobuf.Type.d('ModifyUserAvatarReq')
export class ModifyUserAvatarReq extends protobuf.Message<ModifyUserAvatarReq>{

		@protobuf.Field.d(1,"string","required")
		public avatar:string;
}

@protobuf.Type.d('ModifyUserAvatarResp')
export class ModifyUserAvatarResp extends protobuf.Message<ModifyUserAvatarResp>{

		@protobuf.Field.d(1,"string","required")
		public avatar:string;
}

@protobuf.Type.d('MaintenancePromptPush')
export class MaintenancePromptPush extends protobuf.Message<MaintenancePromptPush>{

		@protobuf.Field.d(1,"string","required")
		public content:string;
}

@protobuf.Type.d('MaintenancePush')
export class MaintenancePush extends protobuf.Message<MaintenancePush>{

		@protobuf.Field.d(1,"maintenance","required")
		public maintenance:Maintenance;
}

@protobuf.Type.d('UserAmountPush')
export class UserAmountPush extends protobuf.Message<UserAmountPush>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;
}

@protobuf.Type.d('GetUserAmountReq')
export class GetUserAmountReq extends protobuf.Message<GetUserAmountReq>{
}

@protobuf.Type.d('GetUserAmountResp')
export class GetUserAmountResp extends protobuf.Message<GetUserAmountResp>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;
}

@protobuf.Type.d('SendBindMobileVerifyCodeReq')
export class SendBindMobileVerifyCodeReq extends protobuf.Message<SendBindMobileVerifyCodeReq>{

		@protobuf.Field.d(1,"string","required")
		public mobile:string;
}

@protobuf.Type.d('SendBindMobileVerifyCodeResp')
export class SendBindMobileVerifyCodeResp extends protobuf.Message<SendBindMobileVerifyCodeResp>{

		@protobuf.Field.d(1,"int32","required")
		public seconds:number;
}

@protobuf.Type.d('BindMobileReq')
export class BindMobileReq extends protobuf.Message<BindMobileReq>{

		@protobuf.Field.d(1,"string","required")
		public mobile:string;

		@protobuf.Field.d(2,"string","required")
		public verifyCode:string;

		@protobuf.Field.d(3,"string","required")
		public password:string;
}

@protobuf.Type.d('BindMobileResp')
export class BindMobileResp extends protobuf.Message<BindMobileResp>{
}

@protobuf.Type.d('ReceiveRegAmountReq')
export class ReceiveRegAmountReq extends protobuf.Message<ReceiveRegAmountReq>{
}

@protobuf.Type.d('ReceiveRegAmountResp')
export class ReceiveRegAmountResp extends protobuf.Message<ReceiveRegAmountResp>{
}

@protobuf.Type.d('OperationalActivityListReq')
export class OperationalActivityListReq extends protobuf.Message<OperationalActivityListReq>{
}

@protobuf.Type.d('OperationalActivityListResp')
export class OperationalActivityListResp extends protobuf.Message<OperationalActivityListResp>{

		@protobuf.Field.d(1,"operationalActivity","repeated")
		public list:OperationalActivity[];
}

@protobuf.Type.d('BindAlipayAccountReq')
export class BindAlipayAccountReq extends protobuf.Message<BindAlipayAccountReq>{

		@protobuf.Field.d(1,"string","required")
		public alipayAccount:string;

		@protobuf.Field.d(2,"string","required")
		public realName:string;
}

@protobuf.Type.d('BindAlipayAccountResp')
export class BindAlipayAccountResp extends protobuf.Message<BindAlipayAccountResp>{

		@protobuf.Field.d(1,"userAlipay","required")
		public userAlipay:UserAlipay;
}

@protobuf.Type.d('BindBankCardReq')
export class BindBankCardReq extends protobuf.Message<BindBankCardReq>{

		@protobuf.Field.d(1,"string","required")
		public bankCard:string;

		@protobuf.Field.d(2,"string","required")
		public realName:string;

		@protobuf.Field.d(3,"string","required")
		public bankName:string;
}

@protobuf.Type.d('BindBankCardResp')
export class BindBankCardResp extends protobuf.Message<BindBankCardResp>{

		@protobuf.Field.d(1,"userBank","required")
		public userBank:UserBank;
}

@protobuf.Type.d('TransferTypeListReq')
export class TransferTypeListReq extends protobuf.Message<TransferTypeListReq>{
}

@protobuf.Type.d('TransferTypeListResp')
export class TransferTypeListResp extends protobuf.Message<TransferTypeListResp>{

		@protobuf.Field.d(1,"transferType","repeated")
		public transferTypeList:TransferType[];
}

@protobuf.Type.d('TransferRecordListReq')
export class TransferRecordListReq extends protobuf.Message<TransferRecordListReq>{

		@protobuf.Field.d(1,"string","optional")
		public timeKeyword?:string;

		@protobuf.Field.d(2,"int32","repeated")
		public transferTypeList:number[];
}

@protobuf.Type.d('TransferRecordListResp')
export class TransferRecordListResp extends protobuf.Message<TransferRecordListResp>{

		@protobuf.Field.d(1,"transferRecord","repeated")
		public transferRecordList:TransferRecord[];

		@protobuf.Field.d(2,"int64","required")
		public totalRechargeAmount:number;

		@protobuf.Field.d(3,"int64","required")
		public totalWithdrawAmount:number;

		@protobuf.Field.d(4,"int64","required")
		public totalGiftAmount:number;

		@protobuf.Field.d(5,"int64","required")
		public amount:number;
}

@protobuf.Type.d('WinRankingListReq')
export class WinRankingListReq extends protobuf.Message<WinRankingListReq>{
}

@protobuf.Type.d('WinRankingListResp')
export class WinRankingListResp extends protobuf.Message<WinRankingListResp>{

		@protobuf.Field.d(1,"winRanking","repeated")
		public list:WinRanking[];

		@protobuf.Field.d(2,"winRanking","optional")
		public myWinRanking?:WinRanking;
}

@protobuf.Type.d('ActivityListReq')
export class ActivityListReq extends protobuf.Message<ActivityListReq>{
}

@protobuf.Type.d('ActivityListResp')
export class ActivityListResp extends protobuf.Message<ActivityListResp>{

		@protobuf.Field.d(1,"activity","repeated")
		public activityList:Activity[];
}

@protobuf.Type.d('ActivityReadReq')
export class ActivityReadReq extends protobuf.Message<ActivityReadReq>{

		@protobuf.Field.d(1,"int32","required")
		public activityId:number;
}

@protobuf.Type.d('ActivityReadResp')
export class ActivityReadResp extends protobuf.Message<ActivityReadResp>{

		@protobuf.Field.d(1,"int32","required")
		public activityId:number;
}

@protobuf.Type.d('ActivityPush')
export class ActivityPush extends protobuf.Message<ActivityPush>{

		@protobuf.Field.d(1,"activity","required")
		public activity:Activity;
}

@protobuf.Type.d('NoticeListReq')
export class NoticeListReq extends protobuf.Message<NoticeListReq>{
}

@protobuf.Type.d('NoticeListResp')
export class NoticeListResp extends protobuf.Message<NoticeListResp>{

		@protobuf.Field.d(1,"notice","repeated")
		public noticeList:Notice[];
}

@protobuf.Type.d('NoticeReadReq')
export class NoticeReadReq extends protobuf.Message<NoticeReadReq>{

		@protobuf.Field.d(1,"int32","required")
		public noticeId:number;
}

@protobuf.Type.d('NoticeReadResp')
export class NoticeReadResp extends protobuf.Message<NoticeReadResp>{

		@protobuf.Field.d(1,"int32","required")
		public noticeId:number;
}

@protobuf.Type.d('NoticePush')
export class NoticePush extends protobuf.Message<NoticePush>{

		@protobuf.Field.d(1,"notice","required")
		public notice:Notice;
}

@protobuf.Type.d('WithdrawReq')
export class WithdrawReq extends protobuf.Message<WithdrawReq>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;

		@protobuf.Field.d(2,"int32","required")
		public withdrawWay:number;

		@protobuf.Field.d(3,"string","required")
		public withdrawAccount:string;
}

@protobuf.Type.d('WithdrawResp')
export class WithdrawResp extends protobuf.Message<WithdrawResp>{

		@protobuf.Field.d(1,"withdrawOrder","required")
		public withdrawOrder:WithdrawOrder;
}

@protobuf.Type.d('WithdrawMosaicListReq')
export class WithdrawMosaicListReq extends protobuf.Message<WithdrawMosaicListReq>{
}

@protobuf.Type.d('WithdrawMosaicListResp')
export class WithdrawMosaicListResp extends protobuf.Message<WithdrawMosaicListResp>{

		@protobuf.Field.d(1,"withdrawMosaic","repeated")
		public withdrawMosaicList:WithdrawMosaic[];

		@protobuf.Field.d(2,"int64","required")
		public totalRechargeAmount:number;

		@protobuf.Field.d(3,"int64","required")
		public totalGiftAmount:number;

		@protobuf.Field.d(4,"int64","required")
		public totalRechargeMosaicFee:number;

		@protobuf.Field.d(5,"int64","required")
		public totalGiftMosaicFee:number;

		@protobuf.Field.d(6,"int64","required")
		public totalMosaicAmount:number;

		@protobuf.Field.d(7,"string","required")
		public beginTime:string;

		@protobuf.Field.d(8,"string","required")
		public endTime:string;
}

@protobuf.Type.d('WithdrawMosaicReq')
export class WithdrawMosaicReq extends protobuf.Message<WithdrawMosaicReq>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;

		@protobuf.Field.d(2,"int32","required")
		public withdrawWay:number;
}

@protobuf.Type.d('WithdrawMosaicResp')
export class WithdrawMosaicResp extends protobuf.Message<WithdrawMosaicResp>{

		@protobuf.Field.d(1,"int64","required")
		public amount:number;

		@protobuf.Field.d(2,"int64","required")
		public totalRechargeMosaic:number;

		@protobuf.Field.d(3,"int64","required")
		public totalGiftMosaic:number;

		@protobuf.Field.d(4,"int64","required")
		public totalRechargeMosaicFee:number;

		@protobuf.Field.d(5,"int64","required")
		public totalGiftMosaicFee:number;

		@protobuf.Field.d(6,"float","required")
		public manageFeeRadix:number;

		@protobuf.Field.d(7,"int64","required")
		public serviceFee:number;

		@protobuf.Field.d(8,"float","required")
		public serviceFeeRadix:number;

		@protobuf.Field.d(9,"int64","required")
		public realAmount:number;

		@protobuf.Field.d(10,"string","required")
		public time:string;

		@protobuf.Field.d(11,"int32","required")
		public withdrawWay:number;
}

@protobuf.Type.d('WithdrawOrderListReq')
export class WithdrawOrderListReq extends protobuf.Message<WithdrawOrderListReq>{
}

@protobuf.Type.d('WithdrawOrderListResp')
export class WithdrawOrderListResp extends protobuf.Message<WithdrawOrderListResp>{

		@protobuf.Field.d(1,"withdrawOrder","repeated")
		public withdrawOrderList:WithdrawOrder[];
}

@protobuf.Type.d('WithdrawOrderReq')
export class WithdrawOrderReq extends protobuf.Message<WithdrawOrderReq>{

		@protobuf.Field.d(1,"int64","required")
		public orderId:number;
}

@protobuf.Type.d('WithdrawOrderResp')
export class WithdrawOrderResp extends protobuf.Message<WithdrawOrderResp>{

		@protobuf.Field.d(1,"withdrawOrder","required")
		public withdrawOrder:WithdrawOrder;
}

@protobuf.Type.d('WithdrawCountReq')
export class WithdrawCountReq extends protobuf.Message<WithdrawCountReq>{
}

@protobuf.Type.d('WithdrawCountResp')
export class WithdrawCountResp extends protobuf.Message<WithdrawCountResp>{

		@protobuf.Field.d(1,"int32","required")
		public alipayMaxCount:number;

		@protobuf.Field.d(2,"int32","required")
		public alipayCount:number;

		@protobuf.Field.d(3,"int32","required")
		public bankMaxCount:number;

		@protobuf.Field.d(4,"int32","required")
		public bankCount:number;
}

@protobuf.Type.d('WithdrawSettingReq')
export class WithdrawSettingReq extends protobuf.Message<WithdrawSettingReq>{
}

@protobuf.Type.d('WithdrawSettingResp')
export class WithdrawSettingResp extends protobuf.Message<WithdrawSettingResp>{

		@protobuf.Field.d(1,"withdrawSetting","repeated")
		public list:WithdrawSetting[];
}

@protobuf.Type.d('RechargeResultPush')
export class RechargeResultPush extends protobuf.Message<RechargeResultPush>{

		@protobuf.Field.d(1,"rechargeOrder","required")
		public order:RechargeOrder;
}

@protobuf.Type.d('RechargeOrderListReq')
export class RechargeOrderListReq extends protobuf.Message<RechargeOrderListReq>{
}

@protobuf.Type.d('RechargeOrderListResp')
export class RechargeOrderListResp extends protobuf.Message<RechargeOrderListResp>{

		@protobuf.Field.d(1,"rechargeOrder","repeated")
		public orderList:RechargeOrder[];
}

@protobuf.Type.d('RechargeOrderReq')
export class RechargeOrderReq extends protobuf.Message<RechargeOrderReq>{

		@protobuf.Field.d(1,"int64","required")
		public orderId:number;
}

@protobuf.Type.d('RechargeOrderResp')
export class RechargeOrderResp extends protobuf.Message<RechargeOrderResp>{

		@protobuf.Field.d(1,"rechargeOrder","required")
		public order:RechargeOrder;
}

@protobuf.Type.d('FirstRechargeReq')
export class FirstRechargeReq extends protobuf.Message<FirstRechargeReq>{

		@protobuf.Field.d(1,"string","required")
		public payFlag:string;
}

@protobuf.Type.d('FirstRechargeResp')
export class FirstRechargeResp extends protobuf.Message<FirstRechargeResp>{

		@protobuf.Field.d(1,"string","required")
		public orderNo:string;

		@protobuf.Field.d(2,"int32","required")
		public payAction:number;

		@protobuf.Field.d(3,"string","required")
		public payData:string;
}

@protobuf.Type.d('RechargeSettingReq')
export class RechargeSettingReq extends protobuf.Message<RechargeSettingReq>{
}

@protobuf.Type.d('RechargeSettingResp')
export class RechargeSettingResp extends protobuf.Message<RechargeSettingResp>{

		@protobuf.Field.d(1,"rechargeSetting","repeated")
		public list:RechargeSetting[];
}

@protobuf.Type.d('FirstRechargeResultPush')
export class FirstRechargeResultPush extends protobuf.Message<FirstRechargeResultPush>{

		@protobuf.Field.d(1,"rechargeOrder","required")
		public order:RechargeOrder;
}

@protobuf.Type.d('UserSysMailListReq')
export class UserSysMailListReq extends protobuf.Message<UserSysMailListReq>{
}

@protobuf.Type.d('UserSysMailListResp')
export class UserSysMailListResp extends protobuf.Message<UserSysMailListResp>{

		@protobuf.Field.d(1,"sysMailSummary","repeated")
		public list:SysMailSummary[];
}

@protobuf.Type.d('SysMailDetailReq')
export class SysMailDetailReq extends protobuf.Message<SysMailDetailReq>{

		@protobuf.Field.d(1,"int64","required")
		public mailId:number;
}

@protobuf.Type.d('SysMailDetailResp')
export class SysMailDetailResp extends protobuf.Message<SysMailDetailResp>{

		@protobuf.Field.d(1,"userSysMail","required")
		public userSysMail:UserSysMail;
}

@protobuf.Type.d('ReceiveMailPropReq')
export class ReceiveMailPropReq extends protobuf.Message<ReceiveMailPropReq>{

		@protobuf.Field.d(1,"int64","required")
		public mailId:number;
}

@protobuf.Type.d('ReceiveMailPropResp')
export class ReceiveMailPropResp extends protobuf.Message<ReceiveMailPropResp>{

		@protobuf.Field.d(1,"int64","required")
		public mailId:number;
}

@protobuf.Type.d('DeleteSysMailReq')
export class DeleteSysMailReq extends protobuf.Message<DeleteSysMailReq>{

		@protobuf.Field.d(1,"int64","required")
		public mailId:number;
}

@protobuf.Type.d('DeleteSysMailResp')
export class DeleteSysMailResp extends protobuf.Message<DeleteSysMailResp>{

		@protobuf.Field.d(1,"int64","required")
		public mailId:number;
}

@protobuf.Type.d('SysMailPush')
export class SysMailPush extends protobuf.Message<SysMailPush>{

		@protobuf.Field.d(1,"sysMailSummary","required")
		public mail:SysMailSummary;
}

@protobuf.Type.d('WinningInfoReq')
export class WinningInfoReq extends protobuf.Message<WinningInfoReq>{
}

@protobuf.Type.d('WinningInfoResp')
export class WinningInfoResp extends protobuf.Message<WinningInfoResp>{

		@protobuf.Field.d(1,"winning","repeated")
		public grandWinningList:Winning[];

		@protobuf.Field.d(2,"winning","repeated")
		public myWinningList:Winning[];

		@protobuf.Field.d(3,"winning","repeated")
		public latestWinningList:Winning[];

		@protobuf.Field.d(4,"prizePool","repeated")
		public poolList:PrizePool[];

		@protobuf.Field.d(5,"double","required")
		public todayScore:number;

		@protobuf.Field.d(6,"double","required")
		public tomorrowScore:number;
}

@protobuf.Type.d('LotteryReq')
export class LotteryReq extends protobuf.Message<LotteryReq>{

		@protobuf.Field.d(1,"int32","required")
		public poolId:number;
}

@protobuf.Type.d('LotteryResp')
export class LotteryResp extends protobuf.Message<LotteryResp>{

		@protobuf.Field.d(1,"winning","required")
		public winning:Winning;

		@protobuf.Field.d(2,"double","required")
		public winPosition:number;
}

@protobuf.Type.d('WinningPush')
export class WinningPush extends protobuf.Message<WinningPush>{

		@protobuf.Field.d(1,"winning","required")
		public winning:Winning;
}

@protobuf.Type.d('UserTomorrowScorePush')
export class UserTomorrowScorePush extends protobuf.Message<UserTomorrowScorePush>{

		@protobuf.Field.d(1,"double","required")
		public tomorrowScore:number;
}

@protobuf.Type.d('GrandWinningPush')
export class GrandWinningPush extends protobuf.Message<GrandWinningPush>{

		@protobuf.Field.d(1,"winning","required")
		public winning:Winning;
}

@protobuf.Type.d('GetShareUrlReq')
export class GetShareUrlReq extends protobuf.Message<GetShareUrlReq>{
}

@protobuf.Type.d('GetShareUrlResp')
export class GetShareUrlResp extends protobuf.Message<GetShareUrlResp>{

		@protobuf.Field.d(1,"string","required")
		public shareUrl:string;

		@protobuf.Field.d(2,"string","required")
		public shareTitle:string;

		@protobuf.Field.d(3,"string","required")
		public shareDescription:string;

		@protobuf.Field.d(4,"string","required")
		public shareImage:string;
}

@protobuf.Type.d('ShareSuccessReq')
export class ShareSuccessReq extends protobuf.Message<ShareSuccessReq>{

		@protobuf.Field.d(1,"string","required")
		public shareUrl:string;

		@protobuf.Field.d(2,"int32","required")
		public shareChannel:number;
}

@protobuf.Type.d('ShareSuccessResp')
export class ShareSuccessResp extends protobuf.Message<ShareSuccessResp>{

		@protobuf.Field.d(1,"bool","required")
		public isFirstShare:boolean;
}

@protobuf.Type.d('CommissionRankReq')
export class CommissionRankReq extends protobuf.Message<CommissionRankReq>{
}

@protobuf.Type.d('CommissionRankResp')
export class CommissionRankResp extends protobuf.Message<CommissionRankResp>{

		@protobuf.Field.d(1,"commissionRankItem","required")
		public myCommissionRankItem:CommissionRankItem;

		@protobuf.Field.d(2,"commissionRankItem","repeated")
		public commissionRankItems:CommissionRankItem[];
}

@protobuf.Type.d('DirectCommissionReq')
export class DirectCommissionReq extends protobuf.Message<DirectCommissionReq>{
}

@protobuf.Type.d('DirectCommissionResp')
export class DirectCommissionResp extends protobuf.Message<DirectCommissionResp>{

		@protobuf.Field.d(1,"directCommissionItem","repeated")
		public directCommissionItems:DirectCommissionItem[];
}

@protobuf.Type.d('DrawCommissionReq')
export class DrawCommissionReq extends protobuf.Message<DrawCommissionReq>{

		@protobuf.Field.d(3,"int64","required")
		public amount:number;
}

@protobuf.Type.d('DrawCommissionResp')
export class DrawCommissionResp extends protobuf.Message<DrawCommissionResp>{

		@protobuf.Field.d(1,"uint32","required")
		public ret:number;

		@protobuf.Field.d(2,"string","required")
		public msg:string;

		@protobuf.Field.d(3,"int64","required")
		public amount:number;
}

@protobuf.Type.d('DrawCommissionRecordReq')
export class DrawCommissionRecordReq extends protobuf.Message<DrawCommissionRecordReq>{
}

@protobuf.Type.d('DrawCommissionRecordResp')
export class DrawCommissionRecordResp extends protobuf.Message<DrawCommissionRecordResp>{

		@protobuf.Field.d(1,"drawCommissionRecordItem","repeated")
		public drawCommissionRecordItems:DrawCommissionRecordItem[];
}

@protobuf.Type.d('MyPromotionInformationReq')
export class MyPromotionInformationReq extends protobuf.Message<MyPromotionInformationReq>{
}

@protobuf.Type.d('MyPromotionInformationResp')
export class MyPromotionInformationResp extends protobuf.Message<MyPromotionInformationResp>{

		@protobuf.Field.d(1,"uint32","required")
		public ret:number;

		@protobuf.Field.d(2,"string","required")
		public msg:string;

		@protobuf.Field.d(3,"int64","required")
		public yesterdayAmount:number;

		@protobuf.Field.d(4,"int64","required")
		public yesterdayDirectAmount:number;

		@protobuf.Field.d(5,"int64","required")
		public yesterdayOtherAmount:number;

		@protobuf.Field.d(6,"int32","required")
		public directNumber:number;

		@protobuf.Field.d(7,"int32","required")
		public directDayAddNumber:number;

		@protobuf.Field.d(8,"int32","required")
		public directMonthAddNumber:number;

		@protobuf.Field.d(9,"int32","required")
		public otherNumber:number;

		@protobuf.Field.d(10,"int32","required")
		public otherDayAddNumber:number;

		@protobuf.Field.d(11,"int32","required")
		public otherMonthAddNumber:number;

		@protobuf.Field.d(12,"int64","required")
		public totalCommission:number;

		@protobuf.Field.d(13,"int64","required")
		public commission:number;

		@protobuf.Field.d(14,"string","required")
		public qrCodeUrl:string;
}

@protobuf.Type.d('BroadcastTypeResp')
export class BroadcastTypeResp extends protobuf.Message<BroadcastTypeResp>{

		@protobuf.Field.d(1,"int32","required")
		public type:number;

		@protobuf.Field.d(2,"int32","required")
		public priority:number;

		@protobuf.Field.d(3,"string","required")
		public body:string;
}

@protobuf.Type.d('RechargeAgentReq')
export class RechargeAgentReq extends protobuf.Message<RechargeAgentReq>{

		@protobuf.Field.d(1,"int32","optional")
		public pageNum?:number;
}

@protobuf.Type.d('RechargeAgentResp')
export class RechargeAgentResp extends protobuf.Message<RechargeAgentResp>{

		@protobuf.Field.d(1,"string","required")
		public description:string;

		@protobuf.Field.d(2,"rechargeAgentItem","repeated")
		public rechargeAgentItems:RechargeAgentItem[];

		@protobuf.Field.d(3,"int32","required")
		public totalPageNum:number;

		@protobuf.Field.d(4,"int32","required")
		public currentPageNum:number;
}

@protobuf.Type.d('RechargeAgentPush')
export class RechargeAgentPush extends protobuf.Message<RechargeAgentPush>{

		@protobuf.Field.d(1,"string","required")
		public description:string;

		@protobuf.Field.d(2,"rechargeAgentItem","repeated")
		public rechargeAgentItems:RechargeAgentItem[];

		@protobuf.Field.d(3,"int32","required")
		public totalPageNum:number;

		@protobuf.Field.d(4,"int32","required")
		public currentPageNum:number;
}

@protobuf.Type.d('userInfo')
export class UserInfo extends protobuf.Message<UserInfo>{

		@protobuf.Field.d(1,"uint64","required")
		public userId:number;

		@protobuf.Field.d(2,"string","required")
		public nickname:string;

		@protobuf.Field.d(3,"string","optional")
		public mobile?:string;

		@protobuf.Field.d(4,"uint64","required")
		public balance:number;

		@protobuf.Field.d(5,"uint32","required")
		public type:number;

		@protobuf.Field.d(6,"uint32","required")
		public gm:number;

		@protobuf.Field.d(7,"string","required")
		public avatar:string;

		@protobuf.Field.d(8,"uint32","required")
		public modifyNicknameCount:number;

		@protobuf.Field.d(9,"bool","optional")
		public isWhitelist?:boolean;

		@protobuf.Field.d(10,"userAlipay","optional")
		public userAlipay?:UserAlipay;

		@protobuf.Field.d(11,"userBank","repeated")
		public userBank:UserBank[];
}

@protobuf.Type.d('userAlipay')
export class UserAlipay extends protobuf.Message<UserAlipay>{

		@protobuf.Field.d(1,"string","required")
		public alipayAccount:string;

		@protobuf.Field.d(2,"string","required")
		public realName:string;
}

@protobuf.Type.d('userBank')
export class UserBank extends protobuf.Message<UserBank>{

		@protobuf.Field.d(1,"string","required")
		public bankCard:string;

		@protobuf.Field.d(2,"string","required")
		public realName:string;

		@protobuf.Field.d(3,"string","required")
		public bankName:string;
}

@protobuf.Type.d('game')
export class Game extends protobuf.Message<Game>{

		@protobuf.Field.d(1,"string","required")
		public gameId:string;

		@protobuf.Field.d(2,"string","required")
		public gameName:string;

		@protobuf.Field.d(3,"string","required")
		public gameType:string;

		@protobuf.Field.d(4,"string","required")
		public imageUrl:string;

		@protobuf.Field.d(5,"string","optional")
		public recommendPicture?:string;

		@protobuf.Field.d(6,"bool","required")
		public isHot:boolean;

		@protobuf.Field.d(7,"bool","required")
		public isNew:boolean;

		@protobuf.Field.d(8,"bool","required")
		public isRecommend:boolean;

		@protobuf.Field.d(9,"int32","required")
		public status:number;

		@protobuf.Field.d(10,"string","required")
		public downloadUrl:string;

		@protobuf.Field.d(11,"string","required")
		public version:string;

		@protobuf.Field.d(12,"string","optional")
		public settings?:string;

		@protobuf.Field.d(13,"string","optional")
		public index?:string;

		@protobuf.Field.d(14,"string","optional")
		public orientation?:string;

		@protobuf.Field.d(15,"string","optional")
		public meta?:string;
}

@protobuf.Type.d('typeGameInfo')
export class TypeGameInfo extends protobuf.Message<TypeGameInfo>{

		@protobuf.Field.d(1,"string","required")
		public gameType:string;

		@protobuf.Field.d(2,"game","repeated")
		public gameList:Game[];
}

@protobuf.Type.d('maintenance')
export class Maintenance extends protobuf.Message<Maintenance>{

		@protobuf.Field.d(1,"int32","required")
		public id:number;

		@protobuf.Field.d(2,"string","required")
		public beginTime:string;

		@protobuf.Field.d(3,"string","required")
		public endTime:string;

		@protobuf.Field.d(4,"string","required")
		public maintenanceTitle:string;

		@protobuf.Field.d(5,"string","required")
		public maintenanceContent:string;

		@protobuf.Field.d(6,"string","required")
		public updateContent:string;

		@protobuf.Field.d(7,"string","optional")
		public version?:string;

		@protobuf.Field.d(8,"int32","required")
		public status:number;
}

@protobuf.Type.d('operationalActivity')
export class OperationalActivity extends protobuf.Message<OperationalActivity>{

		@protobuf.Field.d(1,"string","required")
		public activityCode:string;

		@protobuf.Field.d(2,"string","required")
		public activityName:string;

		@protobuf.Field.d(3,"bool","required")
		public enable:boolean;

		@protobuf.Field.d(4,"bool","required")
		public finish:boolean;
}

@protobuf.Type.d('transferType')
export class TransferType extends protobuf.Message<TransferType>{

		@protobuf.Field.d(1,"int32","required")
		public type:number;

		@protobuf.Field.d(2,"string","required")
		public name:string;
}

@protobuf.Type.d('transferRecord')
export class TransferRecord extends protobuf.Message<TransferRecord>{

		@protobuf.Field.d(1,"int64","required")
		public id:number;

		@protobuf.Field.d(2,"int64","required")
		public beginAmount:number;

		@protobuf.Field.d(3,"int64","required")
		public transferAmount:number;

		@protobuf.Field.d(4,"int64","required")
		public endAmount:number;

		@protobuf.Field.d(5,"int32","required")
		public transferType:number;

		@protobuf.Field.d(6,"string","required")
		public transferTypeName:string;

		@protobuf.Field.d(7,"int32","required")
		public transferWay:number;

		@protobuf.Field.d(8,"string","required")
		public createTime:string;
}

@protobuf.Type.d('winRanking')
export class WinRanking extends protobuf.Message<WinRanking>{

		@protobuf.Field.d(1,"int64","required")
		public no:number;

		@protobuf.Field.d(2,"string","required")
		public nickname:string;

		@protobuf.Field.d(3,"string","optional")
		public avatar?:string;

		@protobuf.Field.d(4,"int64","required")
		public winAmount:number;
}

@protobuf.Type.d('activity')
export class Activity extends protobuf.Message<Activity>{

		@protobuf.Field.d(1,"int32","required")
		public id:number;

		@protobuf.Field.d(2,"string","required")
		public title:string;

		@protobuf.Field.d(3,"string","optional")
		public url?:string;

		@protobuf.Field.d(4,"string","required")
		public beginTime:string;

		@protobuf.Field.d(5,"string","required")
		public endTime:string;

		@protobuf.Field.d(6,"string","optional")
		public image?:string;

		@protobuf.Field.d(7,"int32","required")
		public status:number;

		@protobuf.Field.d(8,"string","required")
		public createTime:string;

		@protobuf.Field.d(9,"bool","required")
		public hasRead:boolean;

		@protobuf.Field.d(10,"string","optional")
		public buttonText?:string;

		@protobuf.Field.d(11,"int32","optional")
		public urlType?:number;

		@protobuf.Field.d(12,"int32","optional")
		public sortNum?:number;
}

@protobuf.Type.d('notice')
export class Notice extends protobuf.Message<Notice>{

		@protobuf.Field.d(1,"int32","required")
		public id:number;

		@protobuf.Field.d(2,"string","required")
		public title:string;

		@protobuf.Field.d(3,"string","required")
		public beginTime:string;

		@protobuf.Field.d(4,"string","required")
		public endTime:string;

		@protobuf.Field.d(5,"string","optional")
		public image?:string;

		@protobuf.Field.d(6,"int32","required")
		public status:number;

		@protobuf.Field.d(7,"string","required")
		public createTime:string;

		@protobuf.Field.d(8,"bool","required")
		public hasRead:boolean;

		@protobuf.Field.d(9,"string","optional")
		public url?:string;

		@protobuf.Field.d(10,"string","optional")
		public buttonText?:string;

		@protobuf.Field.d(11,"int32","optional")
		public sortNum?:number;
}

@protobuf.Type.d('withdrawOrder')
export class WithdrawOrder extends protobuf.Message<WithdrawOrder>{

		@protobuf.Field.d(1,"int64","required")
		public id:number;

		@protobuf.Field.d(2,"string","required")
		public orderNo:string;

		@protobuf.Field.d(3,"string","optional")
		public thirdOrderNo?:string;

		@protobuf.Field.d(4,"int64","required")
		public userId:number;

		@protobuf.Field.d(5,"string","required")
		public nickname:string;

		@protobuf.Field.d(6,"string","required")
		public withdrawAccount:string;

		@protobuf.Field.d(7,"int64","required")
		public amount:number;

		@protobuf.Field.d(8,"float","required")
		public manageFeeRadix:number;

		@protobuf.Field.d(9,"int64","required")
		public rechargeMosaic:number;

		@protobuf.Field.d(10,"int64","required")
		public rechargeMosaicFee:number;

		@protobuf.Field.d(11,"int64","required")
		public giftMosaic:number;

		@protobuf.Field.d(12,"int64","required")
		public giftMosaicFee:number;

		@protobuf.Field.d(13,"float","required")
		public serviceFeeRadix:number;

		@protobuf.Field.d(14,"int64","required")
		public serviceFee:number;

		@protobuf.Field.d(15,"int64","required")
		public realAmount:number;

		@protobuf.Field.d(16,"int32","required")
		public status:number;

		@protobuf.Field.d(17,"int32","required")
		public withdrawWay:number;

		@protobuf.Field.d(18,"string","required")
		public createTime:string;

		@protobuf.Field.d(19,"string","optional")
		public updateTime?:string;

		@protobuf.Field.d(20,"string","optional")
		public remark?:string;
}

@protobuf.Type.d('withdrawMosaic')
export class WithdrawMosaic extends protobuf.Message<WithdrawMosaic>{

		@protobuf.Field.d(1,"int64","required")
		public rechargeAmount:number;

		@protobuf.Field.d(2,"int64","required")
		public giftAmount:number;

		@protobuf.Field.d(3,"int32","required")
		public transferType:number;

		@protobuf.Field.d(4,"int64","required")
		public rechargeMosaic:number;

		@protobuf.Field.d(5,"int64","required")
		public giftMosaic:number;

		@protobuf.Field.d(6,"int64","required")
		public realMosaic:number;

		@protobuf.Field.d(7,"bool","required")
		public rechargeMosaicPass:boolean;

		@protobuf.Field.d(8,"bool","required")
		public giftMosaicPass:boolean;

		@protobuf.Field.d(9,"string","required")
		public createTime:string;

		@protobuf.Field.d(10,"string","required")
		public transferTypeName:string;
}

@protobuf.Type.d('withdrawSetting')
export class WithdrawSetting extends protobuf.Message<WithdrawSetting>{

		@protobuf.Field.d(1,"int32","required")
		public withdrawWay:number;

		@protobuf.Field.d(2,"int32","required")
		public dayLimitCount:number;

		@protobuf.Field.d(3,"float","required")
		public serviceFeeRadix:number;

		@protobuf.Field.d(4,"int64","required")
		public minAmount:number;

		@protobuf.Field.d(5,"int64","required")
		public maxAmount:number;
}

@protobuf.Type.d('rechargeOrder')
export class RechargeOrder extends protobuf.Message<RechargeOrder>{

		@protobuf.Field.d(1,"int64","required")
		public id:number;

		@protobuf.Field.d(2,"string","required")
		public orderNo:string;

		@protobuf.Field.d(3,"string","optional")
		public thirdOrderNo?:string;

		@protobuf.Field.d(4,"int64","required")
		public userId:number;

		@protobuf.Field.d(5,"string","required")
		public nickname:string;

		@protobuf.Field.d(6,"int64","optional")
		public payAmount?:number;

		@protobuf.Field.d(7,"int64","required")
		public rechargeAmount:number;

		@protobuf.Field.d(8,"int64","required")
		public giftAmount:number;

		@protobuf.Field.d(9,"int32","required")
		public status:number;

		@protobuf.Field.d(10,"string","required")
		public payFlag:string;

		@protobuf.Field.d(11,"string","required")
		public createTime:string;

		@protobuf.Field.d(12,"string","optional")
		public payTime?:string;
}

@protobuf.Type.d('rechargeSetting')
export class RechargeSetting extends protobuf.Message<RechargeSetting>{

		@protobuf.Field.d(1,"string","required")
		public payFlag:string;

		@protobuf.Field.d(2,"int64","optional")
		public minAmount?:number;

		@protobuf.Field.d(3,"int64","optional")
		public maxAmount?:number;

		@protobuf.Field.d(4,"bool","required")
		public enable:boolean;

		@protobuf.Field.d(5,"int64","repeated")
		public fastAmountList:number[];
}

@protobuf.Type.d('sysMailSummary')
export class SysMailSummary extends protobuf.Message<SysMailSummary>{

		@protobuf.Field.d(1,"int64","required")
		public mailId:number;

		@protobuf.Field.d(2,"string","required")
		public title:string;

		@protobuf.Field.d(3,"int32","required")
		public mailType:number;

		@protobuf.Field.d(4,"string","required")
		public sender:string;

		@protobuf.Field.d(5,"string","required")
		public sendTime:string;

		@protobuf.Field.d(6,"bool","required")
		public hasRead:boolean;

		@protobuf.Field.d(7,"bool","optional")
		public hasReceivedProps?:boolean;
}

@protobuf.Type.d('userSysMail')
export class UserSysMail extends protobuf.Message<UserSysMail>{

		@protobuf.Field.d(1,"int64","required")
		public userId:number;

		@protobuf.Field.d(2,"int64","required")
		public mailId:number;

		@protobuf.Field.d(3,"bool","required")
		public hasRead:boolean;

		@protobuf.Field.d(4,"bool","optional")
		public hasReceivedProps?:boolean;

		@protobuf.Field.d(5,"sysMail","required")
		public mail:SysMail;
}

@protobuf.Type.d('sysMail')
export class SysMail extends protobuf.Message<SysMail>{

		@protobuf.Field.d(1,"int64","required")
		public mailId:number;

		@protobuf.Field.d(2,"string","required")
		public title:string;

		@protobuf.Field.d(3,"string","required")
		public content:string;

		@protobuf.Field.d(4,"string","required")
		public sender:string;

		@protobuf.Field.d(5,"string","required")
		public sendTime:string;

		@protobuf.Field.d(6,"int32","required")
		public mailType:number;

		@protobuf.Field.d(7,"sysMailProp","repeated")
		public props:SysMailProp[];
}

@protobuf.Type.d('sysMailProp')
export class SysMailProp extends protobuf.Message<SysMailProp>{

		@protobuf.Field.d(1,"int64","required")
		public propId:number;

		@protobuf.Field.d(2,"int32","required")
		public propType:number;

		@protobuf.Field.d(3,"int32","required")
		public propNumber:number;
}

@protobuf.Type.d('winning')
export class Winning extends protobuf.Message<Winning>{

		@protobuf.Field.d(1,"int64","required")
		public userId:number;

		@protobuf.Field.d(2,"string","required")
		public nickname:string;

		@protobuf.Field.d(3,"int32","required")
		public poolId:number;

		@protobuf.Field.d(4,"string","required")
		public poolName:string;

		@protobuf.Field.d(5,"int64","required")
		public prizeAmount:number;

		@protobuf.Field.d(6,"string","required")
		public time:string;
}

@protobuf.Type.d('prizePool')
export class PrizePool extends protobuf.Message<PrizePool>{

		@protobuf.Field.d(1,"int32","required")
		public poolId:number;

		@protobuf.Field.d(2,"string","required")
		public poolName:string;

		@protobuf.Field.d(3,"int32","required")
		public consumedScore:number;

		@protobuf.Field.d(4,"poolProp","repeated")
		public propList:PoolProp[];
}

@protobuf.Type.d('poolProp')
export class PoolProp extends protobuf.Message<PoolProp>{

		@protobuf.Field.d(1,"int32","required")
		public propId:number;

		@protobuf.Field.d(2,"int32","required")
		public propCount:number;
}

@protobuf.Type.d('commissionRankItem')
export class CommissionRankItem extends protobuf.Message<CommissionRankItem>{

		@protobuf.Field.d(1,"string","required")
		public number:string;

		@protobuf.Field.d(2,"int32","required")
		public avatarId:number;

		@protobuf.Field.d(3,"string","required")
		public nickname:string;

		@protobuf.Field.d(4,"int64","required")
		public amount:number;
}

@protobuf.Type.d('directCommissionItem')
export class DirectCommissionItem extends protobuf.Message<DirectCommissionItem>{

		@protobuf.Field.d(1,"int64","required")
		public userId:number;

		@protobuf.Field.d(2,"string","required")
		public nickname:string;

		@protobuf.Field.d(3,"int64","required")
		public amount:number;

		@protobuf.Field.d(4,"string","required")
		public lastLoginTime:string;
}

@protobuf.Type.d('drawCommissionRecordItem')
export class DrawCommissionRecordItem extends protobuf.Message<DrawCommissionRecordItem>{

		@protobuf.Field.d(3,"int64","required")
		public amount:number;

		@protobuf.Field.d(4,"string","required")
		public drawTime:string;
}

@protobuf.Type.d('rechargeAgentItem')
export class RechargeAgentItem extends protobuf.Message<RechargeAgentItem>{

		@protobuf.Field.d(1,"int64","required")
		public agentUid:number;

		@protobuf.Field.d(2,"string","required")
		public agentNick:string;

		@protobuf.Field.d(3,"string","required")
		public payType:string;

		@protobuf.Field.d(4,"int32","required")
		public contactType:number;

		@protobuf.Field.d(5,"string","required")
		public contactAccount:string;

		@protobuf.Field.d(6,"int32","required")
		public mark:number;
}