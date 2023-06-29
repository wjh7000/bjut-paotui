// pages/expressBusiness/expressBusiness.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: ['快递点'],
        tabNow: 0,
        businessList: ['顺丰','圆通','韵达','京东','中通'],
        business:''
    },

    selectBusiness(e) {
        const index = e.currentTarget.dataset.index;
        const business = this.data.businessList[index];
        const url = wx.getStorageSync('Nowurl')
        wx.redirectTo({
          url: `../${url}/${url}?business=${business}`,
        })
    },
    selectTab(e) {
        const id = e.currentTarget.dataset.id;
        this.setData({
            tabNow: id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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