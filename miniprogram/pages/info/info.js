// pages/info/info.js
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
        wx.getUserProfile({
          desc: '获取用户信息',
          success:(res)=>{
              this.setData({
                  userInfo:res.userInfo,
                  hasuserinfo:true
              })
              wx.setStorageSync('userInfo', res.userInfo)
          }
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
        console.log(userInfo,!!userInfo);
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