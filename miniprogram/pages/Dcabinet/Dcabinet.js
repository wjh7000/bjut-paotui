// pages/expressBusiness/expressBusiness.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: ['外卖存点'],
        tabNow: 0,
        pointList: ['北1','北2','西1','西2'],
        point:''
    },

    selectPoint(e) {
        const index = e.currentTarget.dataset.index;
        ///const business = this.data.businessList[index];
        ///wx.setStorageSync('businessNow', business);
        const url = wx.getStorageSync('Nowurl')
        ///wx.navigateBack({ delta: 1, })

        const point = this.data.pointList[index];
        wx.setStorageSync('pointNow', point);
        wx.navigateBack({
            delta:1,
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