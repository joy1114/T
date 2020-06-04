

export default{
    /* 评论 时间 格式 */
    commentTime(datetime) {
        // 可以将2012 - 12 - 12 12 : 12 : 12字符串转为JS中的时期对象,
        // 因为默认情况下只把持2000 / 05 / 05这样形式的字符串转为时间对象
        var dateBegin = new Date(datetime.replace(/-/g, "/"))
        var dateEnd = new Date()
        var dateDiff = dateEnd.getTime() - dateBegin.getTime()
        // 计算相差的天数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
        var returnstr = ""
        if (dayDiff >= 2) { //昨天以前
            return returnstr += datetime.substring(0,16)
        }else { //昨天天以来的处理
            var parttime = datetime.substring(11, 16)
            switch (dayDiff) {
                case 1:
                    returnstr += "昨日 " + parttime
                    break
                default: //对今天的操作
                    returnstr += parttime
            }
        }
        return returnstr
    },
    /* 计算间隔时间 */
    intervalsTime(datetime) {
        // 可以将2012 - 12 - 12 12 : 12 : 12字符串转为JS中的时期对象,
        // 因为默认情况下只把持2000 / 05 / 05这样形式的字符串转为时间对象
        var dateBegin = new Date(datetime.replace(/-/g, "/"))
        var dateEnd = new Date()
        var dateDiff = dateEnd.getTime() - dateBegin.getTime()
        // 计算相差的天数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
        var returnstr = ""
        if (dayDiff >= 30) { //昨天以前
            if ((dayDiff / 30) < 12) {
                returnstr += Math.floor(dayDiff / 30) + '个月前'
            } else {
                returnstr += Math.floor(dayDiff / (30 * 12)) + '年前'
            }
        } else if (dayDiff > 1 && dayDiff < 30) {
            returnstr += dayDiff + '天前'
        } else { //昨天天以来的处理
            var parttime = datetime.substring(10, 15)
            switch (dayDiff) {
                case 1:
                    returnstr += "昨日 " + parttime
                    break
                default: //对今天的操作
                    var minuteleft = Math.floor(dateDiff / (60 * 1000)) //计算相差的分钟数
                    if (minuteleft > 60) {
                        var leftSecond1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
                        var hourDiff = Math.floor(leftSecond1 / (3600 * 1000))
                        returnstr += hourDiff + '小时前'
                    } else if (minuteleft == 0) {
                        returnstr += "刚刚"
                    } else {
                        returnstr += minuteleft + "分钟前"
                    }
            }
        }
        return returnstr
    },
    /* 格式化时间 */
    formatTime(datetime) {
        // 可以将2012 - 12 - 12 12 : 12 : 12字符串转为JS中的时期对象,
        // 因为默认情况下只把持2000 / 05 / 05这样形式的字符串转为时间对象
        var dateBegin = new Date(datetime.replace(/-/g, "/"))
        var dateEnd = new Date()
        var dateDiff = dateEnd.getTime() - dateBegin.getTime()
        // 计算相差的天数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
        var returnstr = ""
        if (dayDiff > 1) { //昨天以前就直接返回日期字符串
            return datetime.split(' ')[0]
        } else { //昨天天以来的处理
            var parttime = datetime.substring(10, 15)
            switch (dayDiff) {
                case 1:
                    returnstr += "昨日 " + parttime
                    break
                default: //对今天的操作
                    var minuteleft = Math.floor(dateDiff / (60 * 1000)) //计算相差的分钟数
                    console.log(minuteleft)
                    if (minuteleft > 60) {
                        var leftSecond1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
                        var hourDiff = Math.floor(leftSecond1 / (3600 * 1000))
                        returnstr += hourDiff + '小时前'
                    } else if (minuteleft == 0) {
                        returnstr += "刚刚"
                    } else {
                        returnstr += minuteleft + "分钟前"
                    }
            }
            return returnstr
        }
    },
    /* 获取当前时间 */
    getNOwTime() {
        let date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        let d = date.getDate()
        let h = date.getHours()
        let min = date.getMinutes()
        let s = date.getSeconds()

        return y + '-' + this.formatnumber(m) + '-' + this.formatnumber(d) + ' ' + this.formatnumber(h) + ':' + this.formatnumber(min) + ':' + this.formatnumber(s)
    },
    /* 日期格式化0000-00-00 00-00-00 */
    formatnumber(num) {
        if (num < 10) {
            let str = '0'
            return str.concat(num)
        } else {
            return num
        }
    }
}
