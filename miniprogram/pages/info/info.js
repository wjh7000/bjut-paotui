// pages/info/info.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        hasuserinfo:false,
        ifuserprofile:false,
    },

    getUserProfile(){
        wx.cloud.callFunction({
            name:'getuserid',
            complete: res =>{
                wx.setStorageSync('userid', res.result.openid);
            }
        })
        wx.getUserProfile({
          desc: '获取用户信息',
          success:(res)=>{
              this.setData({
                  userInfo:res.userInfo,
                  hasuserinfo:true
              })
              wx.setStorageSync('userInfo', res.userInfo)
              if(!!!wx.getStorageSync('phone')){
                  wx.reLaunch({
                    url: '../personaldetail/personaldetail',
                  })
            }
              
          }
        })
    },

    personal(){
        if(this.data.hasuserinfo){
            wx.navigateTo({
              url: '../personaldetail/personaldetail',
            })
        }
    },

    au(){
        wx.navigateTo({
            url: '../aboutus/aboutus',
        })
    },

    apply(){
        const _openid=wx.getStorageSync('userid')
        var state;    
        db.collection('mailmanapply').where({
            _openid,
        }).get({
            success(res){
                if(res.data.length!=0)state=res.data[0].state;
                if(res.data.length==0){
                    wx.navigateTo({
                    url: '../apply/apply',
                    })    
                }
                else if(state=="审核中"){
                    wx.showModal({
                      title: '审核中',
                      content: '审核已提交，可点击确定复制客服微信询问状态',
                      complete: (res) => {
                        if (res.confirm) {
                            wx.setClipboardData({
                              data: 'Lmk78899296',
                            })
                        }
                      }
                    })
                }
                else if(state=="已拒绝"){
                    wx.showModal({
                      title: '拒绝',
                      content: '您的申请被拒绝，可联系客服或再次申请',
                      confirmText:'再次申请',
                      cancelText:'联系客服',
                      complete: (res) => {
                        if (res.cancel) {
                            wx.setClipboardData({
                                data: 'Lmk78899296',
                              })
                        }
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../apply/apply',
                                }) 
                        }
                      }
                    })
                }
                else if(state=="已通过"){
                    wx.showModal({
                      title: '通过',
                      content: '您的申请已通过',
                      complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {}
                      }
                    })
                }
            },
            fail(res){
                console.log(res);
            }
        }) 
        
    },


    addressmanage(){
        if(!this.data.hasuserinfo){
            wx.showToast({
                title: '请先登录',
                duration: 1000,
                icon:'error',
              })
            return;
        }
        wx.setStorageSync('Nowurl', 'personal')
        wx.navigateTo({
          url: '../addressmanage/addressmanage',
        })
    },

    getUserInfo(e){
        this.setData({
            userInfo: e.detail.userInfo,
            hasuserinfo:true
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(wx.getUserProfile){
            this.setData({
                ifuserprofile:true
            })
        }
        const userInfo=wx.getStorageSync('userInfo');
        //console.log(userInfo,!!userInfo);
        this.setData({
            hasuserinfo:!!userInfo,
            userInfo:userInfo,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.onLoad();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})