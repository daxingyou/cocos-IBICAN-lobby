import DecoratorUtil from '../../libs/common/scripts/utils/DecoratorUtil';
import * as protocolSignals from './signals/signals';
import * as protocol from './protocols/protocols'
@DecoratorUtil.commandMap
export default class CommandCodes {

	@DecoratorUtil.retrievAble(CommandCodes.PPLoginReq)
	static readonly PPLoginReq = 1001;

	@DecoratorUtil.retrievAble(CommandCodes.PPLoginResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.LoginRespSignal)
	@DecoratorUtil.protocolResponse(protocol.LoginResp)
	static readonly PPLoginResp = 1002;

	@DecoratorUtil.retrievAble(CommandCodes.PPErrResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ErrRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ErrResp)
	static readonly PPErrResp = 1003;

	@DecoratorUtil.retrievAble(CommandCodes.PPBeatHeartReq)
	static readonly PPBeatHeartReq = 1004;

	@DecoratorUtil.retrievAble(CommandCodes.PPBeatHeartResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.BeatHeartRespSignal)
	@DecoratorUtil.protocolResponse(protocol.BeatHeartResp)
	static readonly PPBeatHeartResp = 1005;

	@DecoratorUtil.retrievAble(CommandCodes.PPGmReq)
	static readonly PPGmReq = 1006;

	@DecoratorUtil.retrievAble(CommandCodes.PPGmResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GmRespSignal)
	@DecoratorUtil.protocolResponse(protocol.GmResp)
	static readonly PPGmResp = 1007;

	@DecoratorUtil.retrievAble(CommandCodes.PPKickUserPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.KickUserPushSignal)
	@DecoratorUtil.protocolResponse(protocol.KickUserPush)
	static readonly PPKickUserPush = 1008;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeReq)
	static readonly PPRechargeReq = 1009;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.RechargeRespSignal)
	@DecoratorUtil.protocolResponse(protocol.RechargeResp)
	static readonly PPRechargeResp = 1010;

	@DecoratorUtil.retrievAble(CommandCodes.PPUserInfoModifyPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.UserInfoModifyPushSignal)
	@DecoratorUtil.protocolResponse(protocol.UserInfoModifyPush)
	static readonly PPUserInfoModifyPush = 1011;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameListReq)
	static readonly PPGameListReq = 1101;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GameListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.GameListResp)
	static readonly PPGameListResp = 1102;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameLaunchReq)
	static readonly PPGameLaunchReq = 1103;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameLaunchResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GameLaunchRespSignal)
	@DecoratorUtil.protocolResponse(protocol.GameLaunchResp)
	static readonly PPGameLaunchResp = 1104;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameLaunchInjectReq)
	static readonly PPGameLaunchInjectReq = 1113;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameLaunchInjectResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GameLaunchInjectRespSignal)
	@DecoratorUtil.protocolResponse(protocol.GameLaunchInjectResp)
	static readonly PPGameLaunchInjectResp = 1114;

	@DecoratorUtil.retrievAble(CommandCodes.PPTypeGameListReq)
	static readonly PPTypeGameListReq = 1117;

	@DecoratorUtil.retrievAble(CommandCodes.PPTypeGameListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.TypeGameListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.TypeGameListResp)
	static readonly PPTypeGameListResp = 1118;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameListPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GameListPushSignal)
	@DecoratorUtil.protocolResponse(protocol.GameListPush)
	static readonly PPGameListPush = 1135;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameWalletTransferAllReq)
	static readonly PPGameWalletTransferAllReq = 1147;

	@DecoratorUtil.retrievAble(CommandCodes.PPGameWalletTransferAllResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GameWalletTransferAllRespSignal)
	@DecoratorUtil.protocolResponse(protocol.GameWalletTransferAllResp)
	static readonly PPGameWalletTransferAllResp = 1148;

	@DecoratorUtil.retrievAble(CommandCodes.PPSafeDepositReq)
	static readonly PPSafeDepositReq = 1107;

	@DecoratorUtil.retrievAble(CommandCodes.PPSafeDepositResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.SafeDepositRespSignal)
	@DecoratorUtil.protocolResponse(protocol.SafeDepositResp)
	static readonly PPSafeDepositResp = 1108;

	@DecoratorUtil.retrievAble(CommandCodes.PPSafeWithdrawReq)
	static readonly PPSafeWithdrawReq = 1109;

	@DecoratorUtil.retrievAble(CommandCodes.PPSafeWithdrawResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.SafeWithdrawRespSignal)
	@DecoratorUtil.protocolResponse(protocol.SafeWithdrawResp)
	static readonly PPSafeWithdrawResp = 1110;

	@DecoratorUtil.retrievAble(CommandCodes.PPModifySafePwdReq)
	static readonly PPModifySafePwdReq = 1111;

	@DecoratorUtil.retrievAble(CommandCodes.PPModifySafePwdResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ModifySafePwdRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ModifySafePwdResp)
	static readonly PPModifySafePwdResp = 1112;

	@DecoratorUtil.retrievAble(CommandCodes.PPGetSafeWalletReq)
	static readonly PPGetSafeWalletReq = 1115;

	@DecoratorUtil.retrievAble(CommandCodes.PPGetSafeWalletResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GetSafeWalletRespSignal)
	@DecoratorUtil.protocolResponse(protocol.GetSafeWalletResp)
	static readonly PPGetSafeWalletResp = 1116;

	@DecoratorUtil.retrievAble(CommandCodes.PPModifyNicknameReq)
	static readonly PPModifyNicknameReq = 1119;

	@DecoratorUtil.retrievAble(CommandCodes.PPModifyNicknameResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ModifyNicknameRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ModifyNicknameResp)
	static readonly PPModifyNicknameResp = 1120;

	@DecoratorUtil.retrievAble(CommandCodes.PPModifyUserAvatarReq)
	static readonly PPModifyUserAvatarReq = 1121;

	@DecoratorUtil.retrievAble(CommandCodes.PPModifyUserAvatarResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ModifyUserAvatarRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ModifyUserAvatarResp)
	static readonly PPModifyUserAvatarResp = 1122;

	@DecoratorUtil.retrievAble(CommandCodes.PPMaintenancePromptPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.MaintenancePromptPushSignal)
	@DecoratorUtil.protocolResponse(protocol.MaintenancePromptPush)
	static readonly PPMaintenancePromptPush = 1133;

	@DecoratorUtil.retrievAble(CommandCodes.PPMaintenancePush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.MaintenancePushSignal)
	@DecoratorUtil.protocolResponse(protocol.MaintenancePush)
	static readonly PPMaintenancePush = 1134;

	@DecoratorUtil.retrievAble(CommandCodes.PPUserAmountPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.UserAmountPushSignal)
	@DecoratorUtil.protocolResponse(protocol.UserAmountPush)
	static readonly PPUserAmountPush = 1136;

	@DecoratorUtil.retrievAble(CommandCodes.PPGetUserAmountReq)
	static readonly PPGetUserAmountReq = 1137;

	@DecoratorUtil.retrievAble(CommandCodes.PPGetUserAmountResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GetUserAmountRespSignal)
	@DecoratorUtil.protocolResponse(protocol.GetUserAmountResp)
	static readonly PPGetUserAmountResp = 1138;

	@DecoratorUtil.retrievAble(CommandCodes.PPSendBindMobileVerifyCodeReq)
	static readonly PPSendBindMobileVerifyCodeReq = 1139;

	@DecoratorUtil.retrievAble(CommandCodes.PPSendBindMobileVerifyCodeResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.SendBindMobileVerifyCodeRespSignal)
	@DecoratorUtil.protocolResponse(protocol.SendBindMobileVerifyCodeResp)
	static readonly PPSendBindMobileVerifyCodeResp = 1140;

	@DecoratorUtil.retrievAble(CommandCodes.PPBindMobileReq)
	static readonly PPBindMobileReq = 1141;

	@DecoratorUtil.retrievAble(CommandCodes.PPBindMobileResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.BindMobileRespSignal)
	@DecoratorUtil.protocolResponse(protocol.BindMobileResp)
	static readonly PPBindMobileResp = 1142;

	@DecoratorUtil.retrievAble(CommandCodes.PPReceiveRegAmountReq)
	static readonly PPReceiveRegAmountReq = 1143;

	@DecoratorUtil.retrievAble(CommandCodes.PPReceiveRegAmountResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ReceiveRegAmountRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ReceiveRegAmountResp)
	static readonly PPReceiveRegAmountResp = 1144;

	@DecoratorUtil.retrievAble(CommandCodes.PPOperationalActivityListReq)
	static readonly PPOperationalActivityListReq = 1145;

	@DecoratorUtil.retrievAble(CommandCodes.PPOperationalActivityListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.OperationalActivityListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.OperationalActivityListResp)
	static readonly PPOperationalActivityListResp = 1146;

	@DecoratorUtil.retrievAble(CommandCodes.PPBindAlipayAccountReq)
	static readonly PPBindAlipayAccountReq = 1156;

	@DecoratorUtil.retrievAble(CommandCodes.PPBindAlipayAccountResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.BindAlipayAccountRespSignal)
	@DecoratorUtil.protocolResponse(protocol.BindAlipayAccountResp)
	static readonly PPBindAlipayAccountResp = 1157;

	@DecoratorUtil.retrievAble(CommandCodes.PPBindBankCardReq)
	static readonly PPBindBankCardReq = 1158;

	@DecoratorUtil.retrievAble(CommandCodes.PPBindBankCardResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.BindBankCardRespSignal)
	@DecoratorUtil.protocolResponse(protocol.BindBankCardResp)
	static readonly PPBindBankCardResp = 1159;

	@DecoratorUtil.retrievAble(CommandCodes.PPTransferTypeListReq)
	static readonly PPTransferTypeListReq = 1160;

	@DecoratorUtil.retrievAble(CommandCodes.PPTransferTypeListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.TransferTypeListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.TransferTypeListResp)
	static readonly PPTransferTypeListResp = 1161;

	@DecoratorUtil.retrievAble(CommandCodes.PPTransferRecordListReq)
	static readonly PPTransferRecordListReq = 1162;

	@DecoratorUtil.retrievAble(CommandCodes.PPTransferRecordListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.TransferRecordListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.TransferRecordListResp)
	static readonly PPTransferRecordListResp = 1163;

	@DecoratorUtil.retrievAble(CommandCodes.PPWinRankingListReq)
	static readonly PPWinRankingListReq = 1174;

	@DecoratorUtil.retrievAble(CommandCodes.PPWinRankingListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WinRankingListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WinRankingListResp)
	static readonly PPWinRankingListResp = 1175;

	@DecoratorUtil.retrievAble(CommandCodes.PPActivityListReq)
	static readonly PPActivityListReq = 1123;

	@DecoratorUtil.retrievAble(CommandCodes.PPActivityListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ActivityListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ActivityListResp)
	static readonly PPActivityListResp = 1124;

	@DecoratorUtil.retrievAble(CommandCodes.PPActivityReadReq)
	static readonly PPActivityReadReq = 1125;

	@DecoratorUtil.retrievAble(CommandCodes.PPActivityReadResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ActivityReadRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ActivityReadResp)
	static readonly PPActivityReadResp = 1126;

	@DecoratorUtil.retrievAble(CommandCodes.PPActivityPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ActivityPushSignal)
	@DecoratorUtil.protocolResponse(protocol.ActivityPush)
	static readonly PPActivityPush = 1131;

	@DecoratorUtil.retrievAble(CommandCodes.PPNoticeListReq)
	static readonly PPNoticeListReq = 1127;

	@DecoratorUtil.retrievAble(CommandCodes.PPNoticeListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.NoticeListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.NoticeListResp)
	static readonly PPNoticeListResp = 1128;

	@DecoratorUtil.retrievAble(CommandCodes.PPNoticeReadReq)
	static readonly PPNoticeReadReq = 1129;

	@DecoratorUtil.retrievAble(CommandCodes.PPNoticeReadResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.NoticeReadRespSignal)
	@DecoratorUtil.protocolResponse(protocol.NoticeReadResp)
	static readonly PPNoticeReadResp = 1130;

	@DecoratorUtil.retrievAble(CommandCodes.PPNoticePush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.NoticePushSignal)
	@DecoratorUtil.protocolResponse(protocol.NoticePush)
	static readonly PPNoticePush = 1132;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawReq)
	static readonly PPWithdrawReq = 1105;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WithdrawRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WithdrawResp)
	static readonly PPWithdrawResp = 1106;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawMosaicListReq)
	static readonly PPWithdrawMosaicListReq = 1164;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawMosaicListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WithdrawMosaicListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WithdrawMosaicListResp)
	static readonly PPWithdrawMosaicListResp = 1165;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawMosaicReq)
	static readonly PPWithdrawMosaicReq = 1166;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawMosaicResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WithdrawMosaicRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WithdrawMosaicResp)
	static readonly PPWithdrawMosaicResp = 1167;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawOrderListReq)
	static readonly PPWithdrawOrderListReq = 1168;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawOrderListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WithdrawOrderListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WithdrawOrderListResp)
	static readonly PPWithdrawOrderListResp = 1169;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawOrderReq)
	static readonly PPWithdrawOrderReq = 1170;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawOrderResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WithdrawOrderRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WithdrawOrderResp)
	static readonly PPWithdrawOrderResp = 1171;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawCountReq)
	static readonly PPWithdrawCountReq = 1172;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawCountResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WithdrawCountRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WithdrawCountResp)
	static readonly PPWithdrawCountResp = 1173;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawSettingReq)
	static readonly PPWithdrawSettingReq = 1179;

	@DecoratorUtil.retrievAble(CommandCodes.PPWithdrawSettingResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WithdrawSettingRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WithdrawSettingResp)
	static readonly PPWithdrawSettingResp = 1180;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeResultPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.RechargeResultPushSignal)
	@DecoratorUtil.protocolResponse(protocol.RechargeResultPush)
	static readonly PPRechargeResultPush = 1149;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeOrderListReq)
	static readonly PPRechargeOrderListReq = 1150;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeOrderListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.RechargeOrderListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.RechargeOrderListResp)
	static readonly PPRechargeOrderListResp = 1151;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeOrderReq)
	static readonly PPRechargeOrderReq = 1152;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeOrderResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.RechargeOrderRespSignal)
	@DecoratorUtil.protocolResponse(protocol.RechargeOrderResp)
	static readonly PPRechargeOrderResp = 1153;

	@DecoratorUtil.retrievAble(CommandCodes.PPFirstRechargeReq)
	static readonly PPFirstRechargeReq = 1154;

	@DecoratorUtil.retrievAble(CommandCodes.PPFirstRechargeResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.FirstRechargeRespSignal)
	@DecoratorUtil.protocolResponse(protocol.FirstRechargeResp)
	static readonly PPFirstRechargeResp = 1155;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeSettingReq)
	static readonly PPRechargeSettingReq = 1176;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeSettingResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.RechargeSettingRespSignal)
	@DecoratorUtil.protocolResponse(protocol.RechargeSettingResp)
	static readonly PPRechargeSettingResp = 1177;

	@DecoratorUtil.retrievAble(CommandCodes.PPFirstRechargeResultPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.FirstRechargeResultPushSignal)
	@DecoratorUtil.protocolResponse(protocol.FirstRechargeResultPush)
	static readonly PPFirstRechargeResultPush = 1178;

	@DecoratorUtil.retrievAble(CommandCodes.PPUserSysMailListReq)
	static readonly PPUserSysMailListReq = 1181;

	@DecoratorUtil.retrievAble(CommandCodes.PPUserSysMailListResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.UserSysMailListRespSignal)
	@DecoratorUtil.protocolResponse(protocol.UserSysMailListResp)
	static readonly PPUserSysMailListResp = 1182;

	@DecoratorUtil.retrievAble(CommandCodes.PPSysMailDetailReq)
	static readonly PPSysMailDetailReq = 1183;

	@DecoratorUtil.retrievAble(CommandCodes.PPSysMailDetailResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.SysMailDetailRespSignal)
	@DecoratorUtil.protocolResponse(protocol.SysMailDetailResp)
	static readonly PPSysMailDetailResp = 1184;

	@DecoratorUtil.retrievAble(CommandCodes.PPReceiveMailPropReq)
	static readonly PPReceiveMailPropReq = 1185;

	@DecoratorUtil.retrievAble(CommandCodes.PPReceiveMailPropResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ReceiveMailPropRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ReceiveMailPropResp)
	static readonly PPReceiveMailPropResp = 1186;

	@DecoratorUtil.retrievAble(CommandCodes.PPDeleteSysMailReq)
	static readonly PPDeleteSysMailReq = 1187;

	@DecoratorUtil.retrievAble(CommandCodes.PPDeleteSysMailResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.DeleteSysMailRespSignal)
	@DecoratorUtil.protocolResponse(protocol.DeleteSysMailResp)
	static readonly PPDeleteSysMailResp = 1188;

	@DecoratorUtil.retrievAble(CommandCodes.PPSysMailPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.SysMailPushSignal)
	@DecoratorUtil.protocolResponse(protocol.SysMailPush)
	static readonly PPSysMailPush = 1189;

	@DecoratorUtil.retrievAble(CommandCodes.PPWinningInfoReq)
	static readonly PPWinningInfoReq = 1191;

	@DecoratorUtil.retrievAble(CommandCodes.PPWinningInfoResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WinningInfoRespSignal)
	@DecoratorUtil.protocolResponse(protocol.WinningInfoResp)
	static readonly PPWinningInfoResp = 1192;

	@DecoratorUtil.retrievAble(CommandCodes.PPLotteryReq)
	static readonly PPLotteryReq = 1193;

	@DecoratorUtil.retrievAble(CommandCodes.PPLotteryResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.LotteryRespSignal)
	@DecoratorUtil.protocolResponse(protocol.LotteryResp)
	static readonly PPLotteryResp = 1194;

	@DecoratorUtil.retrievAble(CommandCodes.PPWinningPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.WinningPushSignal)
	@DecoratorUtil.protocolResponse(protocol.WinningPush)
	static readonly PPWinningPush = 1195;

	@DecoratorUtil.retrievAble(CommandCodes.PPUserTomorrowScorePush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.UserTomorrowScorePushSignal)
	@DecoratorUtil.protocolResponse(protocol.UserTomorrowScorePush)
	static readonly PPUserTomorrowScorePush = 1196;

	@DecoratorUtil.retrievAble(CommandCodes.PPGrandWinningPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GrandWinningPushSignal)
	@DecoratorUtil.protocolResponse(protocol.GrandWinningPush)
	static readonly PPGrandWinningPush = 1197;

	@DecoratorUtil.retrievAble(CommandCodes.PPGetShareUrlReq)
	static readonly PPGetShareUrlReq = 1201;

	@DecoratorUtil.retrievAble(CommandCodes.PPGetShareUrlResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.GetShareUrlRespSignal)
	@DecoratorUtil.protocolResponse(protocol.GetShareUrlResp)
	static readonly PPGetShareUrlResp = 1202;

	@DecoratorUtil.retrievAble(CommandCodes.PPShareSuccessReq)
	static readonly PPShareSuccessReq = 1203;

	@DecoratorUtil.retrievAble(CommandCodes.PPShareSuccessResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.ShareSuccessRespSignal)
	@DecoratorUtil.protocolResponse(protocol.ShareSuccessResp)
	static readonly PPShareSuccessResp = 1204;

	@DecoratorUtil.retrievAble(CommandCodes.PPCommissionRankReq)
	static readonly PPCommissionRankReq = 1301;

	@DecoratorUtil.retrievAble(CommandCodes.PPCommissionRankResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.CommissionRankRespSignal)
	@DecoratorUtil.protocolResponse(protocol.CommissionRankResp)
	static readonly PPCommissionRankResp = 1302;

	@DecoratorUtil.retrievAble(CommandCodes.PPDirectCommissionReq)
	static readonly PPDirectCommissionReq = 1303;

	@DecoratorUtil.retrievAble(CommandCodes.PPDirectCommissionResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.DirectCommissionRespSignal)
	@DecoratorUtil.protocolResponse(protocol.DirectCommissionResp)
	static readonly PPDirectCommissionResp = 1304;

	@DecoratorUtil.retrievAble(CommandCodes.PPDrawCommissionReq)
	static readonly PPDrawCommissionReq = 1305;

	@DecoratorUtil.retrievAble(CommandCodes.PPDrawCommissionResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.DrawCommissionRespSignal)
	@DecoratorUtil.protocolResponse(protocol.DrawCommissionResp)
	static readonly PPDrawCommissionResp = 1306;

	@DecoratorUtil.retrievAble(CommandCodes.PPDrawCommissionRecordReq)
	static readonly PPDrawCommissionRecordReq = 1307;

	@DecoratorUtil.retrievAble(CommandCodes.PPDrawCommissionRecordResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.DrawCommissionRecordRespSignal)
	@DecoratorUtil.protocolResponse(protocol.DrawCommissionRecordResp)
	static readonly PPDrawCommissionRecordResp = 1308;

	@DecoratorUtil.retrievAble(CommandCodes.PPMyPromotionInformationReq)
	static readonly PPMyPromotionInformationReq = 1309;

	@DecoratorUtil.retrievAble(CommandCodes.PPMyPromotionInformationResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.MyPromotionInformationRespSignal)
	@DecoratorUtil.protocolResponse(protocol.MyPromotionInformationResp)
	static readonly PPMyPromotionInformationResp = 1310;

	@DecoratorUtil.retrievAble(CommandCodes.PPBroadcastTypeResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.BroadcastTypeRespSignal)
	@DecoratorUtil.protocolResponse(protocol.BroadcastTypeResp)
	static readonly PPBroadcastTypeResp = 1401;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeAgentReq)
	static readonly PPRechargeAgentReq = 1411;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeAgentResp)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.RechargeAgentRespSignal)
	@DecoratorUtil.protocolResponse(protocol.RechargeAgentResp)
	static readonly PPRechargeAgentResp = 1412;

	@DecoratorUtil.retrievAble(CommandCodes.PPRechargeAgentPush)
	@DecoratorUtil.protocolResponseSignal(protocolSignals.RechargeAgentPushSignal)
	@DecoratorUtil.protocolResponse(protocol.RechargeAgentPush)
	static readonly PPRechargeAgentPush = 1413
}