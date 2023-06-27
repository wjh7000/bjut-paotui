// pages/expressDelivery/expressDelivery.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeList:[
            {
                name:'小件',
                tips:'小件：巴掌大小的快件，价格3元',
                money:3,
            },
            {
                name:'中件',
                tips:'中件：鞋盒服装大小的快件，价格5元',
                money:5,
            },
            {
                name:'大件',
                tips:'大件：重量超过5公斤的快件，价格8元',
                money:8,
            }
        ],
        typeNow: 0,
        money: 3,
        name:'',
        address:'',
        business:'',
        name_to:'',
        address_to:'',
        expressCode:'',
        remark:'',
        codeImg:'',
        userInfo:{}
    },

    selectType(e) {
        const { id,tip } = e.currentTarget.dataset;
        this.setData({
            typeNow: id,
            money: this.data.typeList[id].money
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