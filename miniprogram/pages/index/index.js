Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: ['../../images/swiper1.png','../../images/swiper2.png' , '../../images/swiper3.png'], 
    indexConfig: [
        {
            icon:'../../images/express.png',
            text:'快递代取',
            url:'../getExpress/getExpress'
        },
        {
            icon:'../../images/waimai.png',
            text:'外卖代取',
            url:'../takeaway/takeaway'
        },
        {
            icon:'../../images/run.png',
            text:'校园跑腿',
            url:'../Runleg/Runleg'
        },
        {
            icon:'../../images/expressDelivery.png',
            text:'快递代寄',
            url:'../expressDelivery/expressDelivery'
        },
        {
            icon:'../../images/borrow.png',
            text:'租借服务',
            url:'../Rentalservice/Rentalservice'
        },
        {
            icon:'../../images/print.png',
            text:'帮我打印',
            url:'../helpPrint/helpPrint'
        }
    ]
  },

toDetail(e){
    const userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
        wx.showToast({
            title: '请先登录',
            icon:'error'
        })
        return;
    } 
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    })
},  

handClickNotice(){
    wx.showModal({
        title:'公告',
        content:'如遇到问题请添加客服vx：123456789'
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('ok');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})