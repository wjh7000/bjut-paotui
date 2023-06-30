// pages/selectBuild/selectBuild.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: ['教学区', '宿舍楼','其余地点'],
        teachList:['第一教学楼','第二教学楼','第三教学楼','第四教学楼','材料楼','信息楼','智研楼','经管楼','科学楼','人文楼','实训楼','城建楼','艺设楼'],
        otherList:['南操','北操','北图','逸夫图书馆','体育馆'],
        tabNow: 0
    },
  
    selectBuild(e) {
        const index = e.currentTarget.dataset.index;
        const that = this.data;
        const build =(this.data.tabNow==0)?
        `${that.tabList[that.tabNow]}-${this.data.teachList[index]}`:
        (this.data.tabNow==2)?
        `${that.tabList[that.tabNow]}-${this.data.otherList[index]}`
        : `${that.tabList[that.tabNow]}-${index + 1}号楼`;
        wx.redirectTo({
          url: `../addAddress/addAddress?build=${build}`
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