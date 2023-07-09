const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemname: '',
    address: '',
    address2:'',
    money: '',
    userInfo: {},
    remark: '',
    nowDate:'',
    nowTime:''
  },
  getitemname(e) {
    this.setData({
      itemname: e.detail.value
    })
  },
  getaddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  getaddress2(e) {
    this.setData({
      address2: e.detail.value
    })
  },
  getremark(e) {
    this.setData({
      remark: e.detail.value
    })
  },  
  submit() {
    const that = this.data;
    if(that.remark.length>20){
        wx.showToast({
            title: '备注大于20字',
            icon:'error',
          })
          return;
    }
    const {
      itemname,
      address,
      A1,
      address2,
      A2,
      money,
      userInfo,
      remark,
    } = this.data;
    const sendphone=address.phone;
    const receiverphone=address2.phone;
    const sendname=address.name;
    const receivername=address2.name;
    if (!itemname||itemname.replace(/\s*/g,"").length==0) {
      wx.showToast({
        icon: 'none',
        title: '您未选择物品',
      })
      return;
    }
    else if (!A1) {
        wx.showToast({
          icon: 'none',
          title: '您未填写发件地址',
        })
        return;
    }
    else if (!A2) {
        wx.showToast({
          icon: 'none',
          title: '您未填写收件地址',
        })
        return;
    }
    else if (!money) {
        wx.showToast({
          icon: 'none',
          title: '您未报价',
        })
        return;
    }
    else if (remark.length>20) {
        wx.showToast({
          icon: 'none',
          title: '备注不能大于20字',
        })
        return;
      }
    db.collection('order').add({
      data: {
        // 模块的名字
        type: 'Runleg',
        nowTime:that.nowTime,
        nowDate:that.nowDate,
        money,
        status: 'waiting',
        A1,
        A2,
        sendname,
        sendphone,
        receivername,
        receiverphone,
        info: {
          itemname,
          remark,
        },
        // 用户信息
        userInfo,
        // 用户手机号
        phone: wx.getStorageSync('phone'),
        createTime:db.serverDate()
      },
      success: (res) => {
        wx.switchTab({
          url: '../index/index',
        })
        wx.showToast({
          title: '发布成功',
        })
      }
    })
  },
  getmoney(e) {
    this.setData({
      money: Number( e.detail.value)
    })
    //console.log(this.data.money)
  },
  selectAddress(){
    wx.setStorageSync('Nowurl', 'Runleg')
    wx.navigateTo({
      url: '../addressmanage/addressmanage',
    })
  },
  selectAddress2(){
    wx.setStorageSync('Nowurl', 'Runleg');
    wx.setStorageSync('no', 1);
    wx.navigateTo({
      url: '../addressmanage/addressmanage',
    })
  },
  currentTime() {

    setInterval(this.formatDate, 500);

  },
  formatDate() {

    //获取当前时间并打印

    let myDate = new Date()

    let wk = myDate.getDay()

    let yy = String(myDate.getFullYear())

    let mm = myDate.getMonth() + 1

    let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())

    let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())

    let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())

    let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())

    let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

    let week = weeks[wk]

    this.nowDate = yy + ' 年 ' + mm + ' 月 ' + dd + ' 日'

    this.nowTime = hou + ' : ' + min + ' : ' + sec

    this.nowWeek = week

    this.setData({

      nowDate: this.nowDate,

      nowTime: this.nowTime,

    })  

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.currentTime();
    const address = wx.getStorageSync('addressNow');
    const address2 = wx.getStorageSync('addressNow2');
    const userInfo = wx.getStorageSync('userInfo');

    if (address) {
      const {
        build,
        houseNumber
      } = address;
      this.setData({
        address:address,
        A1: `${build}-${houseNumber}`,
      })
    }
    else{
        this.setData({
            A1:'',
          })
      }
    if (address2) {
        const {
          build,
          houseNumber
        } = address2;
        this.setData({
          address2:address2,
          A2: `${build}-${houseNumber}`,
        })
      }
      else{
        this.setData({
            A2:'',
          })
      }
    this.setData({
      userInfo,
    })
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
    this.onLoad();
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
    wx.switchTab({
        url: '../index/index',
      })
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