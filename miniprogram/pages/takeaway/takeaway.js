// pages/takeaway/takeaway.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeList:[
            {
                name:'饭食',
                tips:'饭食包括汉堡炸鸡米饭等哟~价格3元',
                money:3
            },
            {
                name:'饮料',
                tips:'饮料包括奶茶咖啡等哟~价格2元',
                money:2
            }
        ],
        typeNow:0,
        money:5,
    },
    selectType(e){
        const { id,tip,money} = e.currentTarget.dataset;
        this.setData({
            typeNow: id,
            money,
        })
        
        wx.showToast({
            icon: 'none',
          title: tip,
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
        wx.switchTab({
            url: '../index/index',
          })
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