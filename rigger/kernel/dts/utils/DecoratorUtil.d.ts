/**
 * Decorator
 */
declare module rigger.utils {
    class DecoratorUtil {
        constructor(parameters: any);
        /**
         * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
         */
        static retrievAble(v?: number): (target: any, keyStr: string) => void;
        /**
         * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
         */
        static retrievable(v?: number): (target: any, keyStr: string) => void;
        /**
         * 替换服务
         * @param oldServiceName 被替换的服务名
         */
        static replaceService(oldServiceName: string): (ctor: any, attrName: string) => void;
        /**
         * 类装饰器
         * 对服务或插件进行注册,此接口主要用于无法动态使用eval函数根据全名获取其类定义的情形
         * 使用此装饰器进行注册时，类应该至少定义了有效的"pluginName"或"serviceName"静态成员之一
         * @param ct
         * @throws 如果被装饰的类中没有定义有效的"pluginName"或"serviceName"静态成员之一,会抛出错误
         * @example @register export default class TestPlugin {}
         */
        static register(ct: Function): void;
        private static extendableMethodMapKey;
        static makeExtendable(beReplacable?: boolean): Function;
        private static makeExtenasionMethod;
        /**
         * 将方法申明为可扩展的（可以被插件扩展)
         * @param target 被扩展方法所在对象
         * @param methodName 被扩展的方法
         * @param value 属性描述符
         */
        private static doExtend;
    }
}
