

export default{
    // 获取频道列表 请求接口
    getChannel:async function(that) {
        await that.$http.get('/book/channel')
        .then( (res) => {
			// let list = JSON.parse(JSON.stringify(res.data.data))
			that.channelList = res.data.data
        }).catch( (err) =>{
            console.log(err)
        })
    },
    // 获取类型列表 请求接口
    getCategory: async function(that) {
        await that.$http.get('/book/category')
        .then( function(res) {
            for(let i = 0; i < that.channelList.length; i++) {
                that.categoryList.push(res.data.data.filter(item =>item.channel === that.channelList[i].channel_name)) 
            }
        }).catch( function(err) {
            console.log(err)
        })
    },
    // 获取书籍列表 请求接口
    getBookList: async function(that) {
        await that.$http.get('/book/suggest')
        .then( function(res) {
            for(let i = 0; i < that.channelList.length; i++) {
                that.bookList.push(res.data.data.filter(item =>item.channel === that.channelList[i].channel_name))
            }
        }).catch( function(err) {
            console.log(err)
        })
    },
    getStatus: async function(that) {
        await that.$http.get('/book/status')
        .then( function(res) {
            for(let i = 0; i < res.data.data.length; i++) {
                that.statusList.push(res.data.data[i])
            }
        }).catch( function(err) {
            console.log(err)
        })
    }
}
