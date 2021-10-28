declare module rigger.utils {
    class Byte {
        private _dataView;
        private _allocated;
        private _pos;
        private _length;
        private _u8d;
        static readonly BIG_ENDIAN: string;
        static readonly LITTLE_ENDIAN: string;
        private static sysEndian;
        static getSystemEndian(): any;
        /**
         * 默认长度
         */
        static defaultLenth: number;
        constructor(data?: any);
        clear(): void;
        /**
         * 有效内容的字节长度
         */
        /**
         * 占用内存的字节长度
         */
        readonly byteLength: number;
        /**
         * 当前位置(字节)
         */
        /**
        *
        */
        pos: number;
        /**
         * 长度（字节）
         */
        length: number;
        /**
         * 可用字节数（从当前位置到终点）
         */
        readonly bytesAvailable: number;
        /**
         * 缓冲区
         */
        readonly buffer: ArrayBuffer;
        /**
         * 大小端标示
         */
        endian: string;
        littleEndian: boolean;
        /**
        *<p>常用于解析固定格式的字节流。</p>
        *<p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串,此方法不会导致位置移动。</p>
        *@return 读取的字符串。
        */
        getString(): string;
        /**
        *读取 <code>len</code> 参数指定的长度的字符串。
        *@param len 要读取的字符串的长度。
        *@return 指定长度的字符串。
        */
        readCustomString(len: number): string;
        /**
        *从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象,此方法不会导致POS发生改变。
        *@param start 开始位置。
        *@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
        *@return 读取的 Float32Array 对象。
        */
        getFloat32Array(start: number, len: number): Float32Array;
        /**
         *
         * @param start
         * @param len
         */
        getUint8Array(start: number, len: number): Uint8Array;
        getUint16Array(start: number, len: number): Uint16Array;
        getInt16Array(start: number, len: number): Int16Array;
        /**
        *从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。
        *@param start 开始位置。
        *@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
        *@return 读取的 Float32Array 对象。
        */
        readFloat32Array(start: number, len: number): Float32Array;
        readUint8Array(start: number, len: number): Uint8Array;
        readUint16Array(start: number, len: number): Uint16Array;
        readInt16Array(start: number, len: number): Int16Array;
        /**
         * 从字节流当前位置读取8位整型值，此方法不会导致位置移动
         */
        getInt8(): number;
        /**
         * 从字节流当前位置读取16位整型值，此方法不会导致位置移动
         */
        getInt16(): number;
        /**
         * 从字节流当前位置读取32位整型值，此方法不会导致位置移动
         */
        getInt32(): number;
        /**
         * 从字节流当前位置读取64位整型值，此方法不会导致位置移动
         */
        getInt64(): number;
        getFloat32(): number;
        getFloat64(): number;
        /**
         * 从字节流当前位置读取8位无符号整型值，此方法不会导致位置移动
         */
        getUint8(): number;
        /**
         * 从字节流当前位置读取16位无符号整型值，此方法不会导致位置移动
         */
        getUint16(): number;
        /**
         * 从字节流当前位置读取32位无符号整型值，此方法不会导致位置移动
         */
        getUint32(): number;
        /**
         * 从字节流当前位置读取64位无符号整型值，此方法不会导致位置移动
         */
        getUint64(): number;
        /**
         * 从字节流当前位置读取8位整型值，并使当前位置向后移动8位
         */
        readInt8(): number;
        /**
         * 从字节流当前位置读取16位整型值，并使当前位置向后移动16位
         */
        readInt16(): number;
        /**
         * 从字节流当前位置读取32位整型值，并使当前位置向后移动32位
         */
        readInt32(): number;
        /**
         * 从字节流当前位置读取64位整型值，并使当前位置向后移动64位
         */
        readInt64(): number;
        /**
         * 从字节流当前位置读取8位无符号整型值，并使当前位置向后移动8位
         */
        readUint8(): number;
        /**
         * 从字节流当前位置读取16位无符号整型值，并使当前位置向后移动16位
         */
        readUint16(): number;
        /**
         * 从字节流当前位置读取32位无符号整型值，并使当前位置向后移动32位
         */
        readUint32(): number;
        /**
         * 从字节流当前位置读取64位无符号整型值，并使当前位置向后移动32位
         */
        readUint64(): number;
        readFloat32(): number;
        readFloat64(): number;
        /**
         * 写入一个8位的有符号值，并且使位置向后移动8位
         * @param v 写入的值
         */
        writeInt8(v: number): Byte;
        /**
         * 写入一个16位的有符号值，并且使位置向后移动16位
         * @param v 写入的值
         */
        writeInt16(v: number): Byte;
        /**
         * 写入一个32位的有符号值，并且使位置向后移动32位
         * @param v 写入的值
         */
        writeInt32(v: number): Byte;
        /**
         * 写入一个64位的有符号值，并且使位置向后移动64位
         * @param v 写入的值
         */
        writeInt64(v: number): Byte;
        /**
         * 写入一个8位的无符号值，并且使位置向后移动8位
         * @param v 写入的值
         */
        writeUint8(v: number): Byte;
        writeByte(value: any): Byte;
        getByte(): number;
        readByte(): number;
        /**
         * 写入一个16位的无符号值，并且使位置向后移动16位
         * @param v 写入的值
         */
        writeUint16(v: number): Byte;
        /**
         * 写入一个32位的无符号值，并且使位置向后移动32位
         * @param v 写入的值
         */
        writeUint32(v: number): Byte;
        /**
         * 写入一个64位的无符号值，并且使位置向后移动64位
         * @param v 写入的值
         */
        writeUint64(v: number): Byte;
        writeFloat32(v: number): Byte;
        writeFloat64(v: number): Byte;
        writeUTFBytes(v: any): Byte;
        writeUTFString(value: any): Byte;
        readUTFBytes(len?: number): string;
        readUTFString(): string;
        /**
         * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
         * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
         * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
         * $NEXTBIG 由于没有判断length和arraybuffer的合法性，当开发者填写了错误的length值时，会导致写入多余的空白数据甚至内存溢出，为了避免影响开发者正在使用此方法的功能，下个重大版本会修复这些问题。
         * @param	arraybuffer	需要写入的 Arraybuffer 对象。
         * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
         * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
         */
        writeArrayBuffer(arraybuffer: ArrayBuffer, offset?: number, length?: number): Byte;
        /**
         * 将字节流重置为指定长度，重置后，所有内容清空
         * @param byteLen
         */
        protected ensureWrite(lengthToEnsure: any): void;
        private resizeBuffer;
        private rUTF;
        private getBuffer;
    }
}
