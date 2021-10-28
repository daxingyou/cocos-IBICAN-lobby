export default class FloatUtils {
    
    public static accAdd(num1, num2) {
        num1 = Number(num1);
        num2 = Number(num2);
        var dec1, dec2, times;
        try { dec1 = FloatUtils.countDecimals(num1)+1; } catch (e) { dec1 = 0; }
        try { dec2 = FloatUtils.countDecimals(num2)+1; } catch (e) { dec2 = 0; }
        times = Math.pow(10, Math.max(dec1, dec2));
        var result = (FloatUtils.accMul(num1, times) + FloatUtils.accMul(num2, times)) / times;
        return FloatUtils.getCorrectResult("add", num1, num2, result);
    }
     
    public static accSub(num1, num2) {
        num1 = Number(num1);
        num2 = Number(num2);
        var dec1, dec2, times;
        try { dec1 = FloatUtils.countDecimals(num1)+1; } catch (e) { dec1 = 0; }
        try { dec2 = FloatUtils.countDecimals(num2)+1; } catch (e) { dec2 = 0; }
        times = Math.pow(10, Math.max(dec1, dec2));
        var result = Number((FloatUtils.accMul(num1, times) - FloatUtils.accMul(num2, times)) / times);
        return FloatUtils.getCorrectResult("sub", num1, num2, result);
    }
     
    public static accDiv(num1, num2) {
        num1 = Number(num1);
        num2 = Number(num2);
        var t1 = 0, t2 = 0, dec1, dec2;
        try { t1 = FloatUtils.countDecimals(num1); } catch (e) { }
        try { t2 = FloatUtils.countDecimals(num2); } catch (e) { }
        dec1 = FloatUtils.convertToInt(num1);
        dec2 = FloatUtils.convertToInt(num2);
        var result = FloatUtils.accMul((dec1 / dec2), Math.pow(10, t2 - t1));
        return FloatUtils.getCorrectResult("div", num1, num2, result);
    }
     
    public static accMul(num1, num2) {
        num1 = Number(num1);
        num2 = Number(num2);
        var times = 0, s1 = num1.toString(), s2 = num2.toString();
        try { times += FloatUtils.countDecimals(s1); } catch (e) { }
        try { times += FloatUtils.countDecimals(s2); } catch (e) { }
        var result = FloatUtils.convertToInt(s1) * FloatUtils.convertToInt(s2) / Math.pow(10, times);
        return FloatUtils.getCorrectResult("mul", num1, num2, result);
    };
     
    public static countDecimals(num) {
        var len = 0;
        try {
            num = Number(num);
            var str = num.toString().toUpperCase();
            if (str.split('E').length === 2) { 
                var isDecimal = false;
                if (str.split('.').length === 2) {
                    str = str.split('.')[1];
                    if (parseInt(str.split('E')[0]) !== 0) {
                        isDecimal = true;
                    }
                }
                let x = str.split('E');
                if (isDecimal) {
                    len = x[0].length;
                }
                len -= parseInt(x[1]);
            } else if (str.split('.').length === 2) { 
                if (parseInt(str.split('.')[1]) !== 0) {
                    len = str.split('.')[1].length;
                }
            }
        } catch(e) {
            throw e;
        } finally {
            if (isNaN(len) || len < 0) {
                len = 0;
            }
            return len;
        }
    }
     
    public static convertToInt(num) {
        num = Number(num);
        var newNum = num;
        var times = FloatUtils.countDecimals(num);
        var temp_num = num.toString().toUpperCase();
        if (temp_num.split('E').length === 2) {
            newNum = Math.round(num * Math.pow(10, times));
        } else {
            newNum = Number(temp_num.replace(".", ""));
        }
        return newNum;
    }
     
    private static getCorrectResult(type, num1, num2, result) {
        var temp_result = 0;
        switch (type) {
            case "add":
                temp_result = num1 + num2;
                break;
            case "sub":
                temp_result = num1 - num2;
                break;
            case "div":
                temp_result = num1 / num2;
                break;
            case "mul":
                temp_result = num1 * num2;
                break;
        }
        if (Math.abs(result - temp_result) > 1) {
            return temp_result;
        }
        return result;
    }
}