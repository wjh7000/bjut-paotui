
const app = getApp()
const db = wx.cloud.database()
const utils = require("../../utils/util")

Page({


    data: {
        inputValue : "",
        time : 0,
        my_dialogs:[],
        id:'',//对方的openid
        userid:'',
        userInfo:{}

    },

    onLoad :function (options) {
        const userid=wx.getStorageSync('userid');
        const userInfo=wx.getStorageSync('userInfo');
        this.setData({
            id : options.id,
            userid,
            userInfo
        })
        this.getmyDialogs()
    },

    onshow: function (options) {
        
    },

    onUnload() {
        this.update_rider_last_read()
        this.update_customer_last_read()
        console.log("退出")
    },


    publishMessage(){
        if (this.data.inputValue == "") {
            wx.showToast({
                icon: "none",
                title: '不能发送空消息',
            })
            return;
        }
        var that = this;
        const _id=that.data.id;
        //console.log(_id);
        db.collection('chat_record').doc(_id).get({
            success(res) {
                console.log(res)
                var chatlog = res.data.chatlog;
                var msg = {}
                var myDate=new Date()
                //msg.id = app.globalData.userInfo._openid
                console.log("check")

                msg.id = that.data.userid;
                msg.sentamce = that.data.inputValue;
                msg.time = utils.formatTime(new Date());
                      
                //console.log(msg)
                chatlog.push(msg)
               //console.log(chatlog)
                db.collection('chat_record').doc(_id).update({
                    data: {
                        chatlog : chatlog,
                        recent_update_time: myDate.toLocaleString()
                    },
                    success(res) {
                        console.log(res)
                        wx.showToast({
                          title: '发送成功',
                        })
                        that.getmyDialogs(),
                        that.setData({
                            inputValue : ''
                        })
                    }
                
                })
            }
        })
    },
    handleInput(e) {
        clearTimeout(this.data.time)
        var that = this;
        this.data.time = setTimeout(() => {
            that.getInputValue(e.detail.value)
        }, 200)
    },
    getInputValue(value) {
        this.setData({
            inputValue: value
        })
    },
    getmyDialogs(){
        var that = this;
        const _id=that.data.id;
        db.collection('chat_record').doc(_id).watch({
            onChange: function(snapshot) {
                that.setData({
                    my_dialogs : snapshot.docs[0]
                })
                that.setData({
                    scrollLast: "toView"
                })
            },
            onError: function(err){
                console.log(err)
            }
        })
    },
    getChatList() {
        var that = this;
        const _id=that.data.id;
        db.collection('chat_record').doc(_id).watch({
            onChange: function(snapshot) {
                that.setData({
                    my_dialogs : snapshot.docs[0].chatlog
                })
                that.setData({
                    scrollLast: "toView"
                })
            },
            onError: function(err){
                console.log(err)
            }
        })
    },
    
    update_rider_last_read(){
        var that = this;
        const _id=that.data.id;
        //console.log(_id);
        db.collection('chat_record').doc(_id).get({
            success(res) {
                console.log(res)
                var myDate=new Date()
                db.collection('chat_record').doc(_id).update({
                    data: {
                        rider_read_time: myDate.toLocaleString()
                    },
                    success(res) {
                            console.log('1')
                    }
                
                })
            }
        })
    },
    update_customer_last_read(){
        var that = this;
        const _id=wx.getStorageSync('userid');
        //console.log(_id);
        db.collection('chat_record').doc(_id).get({
            success(res) {
                console.log(res)
                var myDate=new Date()
                db.collection('chat_record').doc(_id).update({
                    data: {
                        user_read_time: myDate.toLocaleString()
                    },
                    success(res) {
                            console.log('1')
                    }
                
                })
            }
        })
    }
})