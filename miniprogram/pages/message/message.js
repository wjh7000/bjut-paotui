const app = getApp();
const db = wx.cloud.database();
Page({
    data: {
        myid:'',
        my_customers:[],
    },

    onLoad() {
        const myid=wx.getStorageSync('userid');

        this.setData({
            myid,
            userInfo : app.globalData.userInfo
        })
    },
    onShow() {
        
        this.setData({
            userInfo : app.globalData.userInfo,
            my_customers : [],
            me_rider    :[]
        })
        //this.loadUser()
       // this.getMyfriend()
        this.getCustomers()
        this.getrider()
    },
    loadUser() {
        var that = this;
        db.collection('chat_user').where({
            _openid : that.data.userInfo._openid,
        }).get({
            success(res) {
                console.log(res)
                // 更新数据 拿到 _id
                app.globalData.userInfo = res.data[0]
                that.setData({
                    userInfo: app.globalData.userInfo
                })
            }
        })
    },

    getCustomers() {
        const _openid=wx.getStorageSync('userid')
        var state;    
        const that=this;
        db.collection('chat_record').where({
            _openid,
        }).get({
            success(res){
                that.setData({
                    my_customers:res,
                });
                console.log(that.data.my_customers);
            }})
    },

    getrider() {
        const _openid=wx.getStorageSync('userid')
        var state;    
        const that=this;
        db.collection('chat_record').where({
            userid:_openid,
        }).get({
            success(res){
                that.setData({
                    me_rider:res,
                });
                console.log(that.data.me_rider);
            }})
    },


    startChat(e) {
        const that=this;
        var index = e.currentTarget.dataset.index;
        console.log(index);
        console.log(this.data.my_customers);
        wx.navigateTo({
          url: '/pages/chat/chat?id=' + this.data.my_customers.data[index]._id
        })
        
    }
})