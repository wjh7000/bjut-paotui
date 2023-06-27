// pages/apply/apply.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        name:'',
        userID:'',
        userIDImg:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    getName(e){
        let name=this.data.name;
        name= e.detail.value;
        this.setData({
            name,
        })
    },

    getUserID(e){
        let userID=this.data.userID;
        userID= e.detail.value;
        this.setData({
            userID,
        })
    },

    uploadImg(){
        let userIDImg=this.data.userIDImg;
        var that=this;
        wx.chooseMedia({
            count:1,
            mediaType:['image'],
            sourceType:['album','camera'],
            maxDuration:30,
            camera:'back',
            success(res) {
                wx.showLoading({
                    title:'正在校验证件',
                })
                const random =Math.floor(Math.random()*1000);
                wx.cloud.uploadFile({
                    cloudPath:'idimg/'+that.data.userInfo.nickName+random+'.png',
                    filePath:res.tempFiles[0].tempFilePath,
                    success:(res)=>{
                        let fileID = res.fileID;
                        userIDImg = fileID;
                        that.setData({
                            userIDImg,
                        })
                        wx.hideLoading()
                    }
                })
            }
        })
    },

    submit(){
        var that=this.data;
        var myDate=new Date();
        db.collection('mailmanapply').add({
            data: {
                userInfo:that.userInfo,
                name:that.name,
                userID:that.userID,
                userIDImg:that.userIDImg,
                state:"审核中",
            },
            success: (res) => {
                wx.showToast({
                  title: '提交成功',
                })
                setTimeout(function(){
                    wx.switchTab({
                      url: '../info/info',
                     })}
                     ,600);
            },
            fail: (res) => {
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                })
            }
        })
    },

    onLoad(options) {
        const userInfo=wx.getStorageSync('userInfo');
        this.setData({
            userInfo
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