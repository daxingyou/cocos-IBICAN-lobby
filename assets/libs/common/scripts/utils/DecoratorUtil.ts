// import CommandCodes from "../protocol/CommandCodes";
// import "reflect-metadata"

export default class DecoratorUtil {

    constructor(any) {
    }

    private static commandMapObj;

    private static metaAttrPre = "$$meta_attr";

    public static retrievAble(v?: any) {

        return function (target: any, keyStr: string) {
            v = v || target[keyStr];
            target[v] = keyStr;
        }
    }

    public static commandMap(target: any) {
        DecoratorUtil.commandMapObj = target
    }

    public static protocolResponseSignal(signalCls: any) {
        // let signal = new signalCls();
        riggerIOC.InjectionBinder.instance.bind(signalCls).toSingleton();
        return DecoratorUtil.metadata("protocol_response_signal", signalCls);
    }

    public static protocolResponse(spec: any) {

        return DecoratorUtil.metadata("protocol_response", spec);
    }

    /**
     * 协议的请求装饰器
     */
    public static protocolRequest(spec: any) {
        return DecoratorUtil.metadata("protocol_request", spec);
    }


    /**
     * 协议的协议名装饰器
     */
    public static protocolName(name: string) {
        return DecoratorUtil.metadata("protocol_name", name);
    }

    /**
     * 从元数据中获取协议号对应的请求类名
     */
    public static getProtocolRequestClassName(code: number): string {
        return DecoratorUtil.getMetadata("protocol_request", DecoratorUtil.commandMapObj, DecoratorUtil.commandMapObj[code]);
    }
    // public getMetaData(target:any, )

    /**
     * 从元数据中获取协议号对应的应答类名
     */
    public static getProtocolResponseClassName(code: number): any {
        // console.log(`get protocol cls, code:${code} ret:${Reflect.getMetadata("protocol_response", CommandCodes, CommandCodes[code])}`);

        return DecoratorUtil.getMetadata("protocol_response", DecoratorUtil.commandMapObj, DecoratorUtil.commandMapObj[code]);
    }

    public static getProtocolResponseSignal(code: number): any {
        // return DecoratorUtil.getMetadata("protocol_response_signal", DecoratorUtil.commandMapObj, DecoratorUtil.commandMapObj[code]);
        let signalCls = DecoratorUtil.getMetadata("protocol_response_signal", DecoratorUtil.commandMapObj, DecoratorUtil.commandMapObj[code]);
        return riggerIOC.InjectionBinder.instance.bind(signalCls).toSingleton().getInstance();
    }

    /**
     * 解绑所有协议信号
     */
    public static unbindSignals(): void {
        for (var code in DecoratorUtil.commandMapObj) {
            let signalCls = DecoratorUtil.getMetadata("protocol_response_signal", DecoratorUtil.commandMapObj, DecoratorUtil.commandMapObj[code]);
            riggerIOC.InjectionBinder.instance.unbind(signalCls);
        }
    }

    /**
     * 绑定协议信号
     */
    public static bindSignals(): void {
        for (var code in DecoratorUtil.commandMapObj) {
            let signalCls = DecoratorUtil.getMetadata("protocol_response_signal", DecoratorUtil.commandMapObj, DecoratorUtil.commandMapObj[code]);
            if(!signalCls) continue;
            riggerIOC.InjectionBinder.instance.bind(signalCls).toSingleton();
        }
    }

    /**
     * 获取协议号对应的协议文件名
     */
    public static getProtocolName(code: number): string {
        // console.log(`get protocol name, ret:${Reflect.getMetadata("protocol_name", CommandCodes, CommandCodes[code])}`);

        return DecoratorUtil.getMetadata("protocol_name", DecoratorUtil.commandMapObj, DecoratorUtil.commandMapObj[code]);
    }

    public static metadata(metadataKey: string | number, metadataValue: any) {
        return function (target: any, attrName: string) {
            DecoratorUtil.getMetaDatas(target, attrName)[metadataKey] = metadataValue;
        }
    }

    public static getMetadata(metadataKey: string | number, target: Object, propertyKey: string): any {
        return DecoratorUtil.getMetaDatas(target, propertyKey)[metadataKey];
    }

    private static makeMetaAttrKey(attrName: string): string {
        return `$$meta_attr_${attrName}`;
    }

    private static getMetaDatas(target: any, attrName: string): any {
        let k: string = DecoratorUtil.makeMetaAttrKey(attrName);
        let data = target[k];
        if (data === null || data == undefined) {
            data = target[DecoratorUtil.makeMetaAttrKey(attrName)] = {};
        }
        return data;
    }
}


