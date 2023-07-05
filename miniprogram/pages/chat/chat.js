
const app = getApp()
const db = wx.cloud.database()
const utils = require("../../utils/util")

Page({


    data: {
        inputValue : "",
        time : 0,
        my_dialogs:[],
        id:'',//对方的openid
        userid:''
    },

    onLoad :function (options) {
        const userid=wx.getStorageSync('userid');
        this.setData({
            id : options.id,
            userid
        })
        this.getmyDialogs()
    },

    onshow: function (options) {
        
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
                //msg.id = app.globalData.userInfo._openid
                console.log("check")

                msg.id = that.data.userid;
                msg.sentamce = that.data.inputValue;
                msg.time = utils.formatTime(new Date());
                
                
                console.log(msg)
                chatlog.push(msg)
               console.log(chatlog)
                db.collection('chat_record').doc(_id).update({
                    data: {
                        chatlog : chatlog
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
    }
})