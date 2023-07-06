// pages/orderDetail/orderDetail.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail:{},
        isRunner:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const detail = wx.getStorageSync('orderDetail');
        const isRunner = wx.getStorageSync('isRunner')
        //console.log(cdetail);
        //var that = this;
        this.setData({
            detail:detail,
            isRunner: isRunner,
            status :''
        });
        const {status} = detail.basicInfo;
        // console.log(options.ddetail);
        //wx.getStorageSync('detail');
        console.log(this.data.detail);
        db.collection.doc(detail.basicInfo._id).watch({
            onChange:function(snapshot){
                that.setData({
                    // detail.basicInfo.status: snapshot
                })
            }
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

    },
    call(){
        wx.makePhoneCall({
          phoneNumber: this.data.detail.basicInfo.phone,
        })

    },

    orderReceive(e){
        if (this.data.isRunner){
            wx.showLoading({
              title: '加载中',
            })
            const {
                _id
            } = this.data.detail.basicInfo;
            
            db.collection('order').doc(_id).update({
                data:{
                    runnerid: this.data.openid,
                    status: 'inProcess',
                },
                success:(res) =>{
                    this.onLoad();
                    wx.hideLoading();
                }
            })
        }
        else {
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '您目前不是接单员，请先前往个人页申请成为接单员，待审核通过后再来接单',
            })
        }
    }
})