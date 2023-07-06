const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemname: '',
    address: '',
    money: null,
    userInfo: {},
    renttime: '',
    returntime: '',
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
  getremark(e) {
    this.setData({
      remark: e.detail.value
    })
  },  
  submit() {
    const that = this.data;
    var n1=Number(this.data.renttime);
    var n2=Number(this.data.returntime);
    var n11=Math.floor(n1/10000);
    var n111=Math.floor(n1/100)-n11*100;
    var n1111=n1-n11*10000-n111*100;
    var n22=Math.floor(n2/10000);
    var n222=Math.floor(n2/100)-n22*100;
    var n2222=n2-n22*10000-n222*100;
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
      money,
      userInfo,
      renttime,
      returntime,
      remark,
    } = this.data;
    if (!itemname) {
      wx.showToast({
        icon: 'none',
        title: '您未选择物品',
      })
      return;
    }
    else if (!address) {
        wx.showToast({
          icon: 'none',
          title: '您未填写地址',
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
    else if (!renttime) {
        wx.showToast({
          icon: 'none',
          title: '您未填租借日期',
        })
        return;
    }
    else if (!returntime) {
        wx.showToast({
          icon: 'none',
          title: '您未填归还日期',
        })
        return;
    }
    else if (renttime.length!=8||isNaN(n1)) {
        wx.showToast({
          icon: 'none',
          title: '租借日期为8位数字',
        })
        return;
      }
      else if (returntime.length!=8||isNaN(n2)) {
        wx.showToast({
          icon: 'none',
          title: '归还日期为8位数字',
        })
        return;
      }
      else if(n11<2023||n11>2050||n22<2023||n22>2050){
        wx.showToast({
            icon: 'none',
            title: '使用期限为2023-2050年',
          })
          return;
      }
      else if(n111<1||n111>12||n222<1||n222>12){
        wx.showToast({
            icon: 'none',
            title: '月份格式为01-12',
          })
          console.log(n1);
          console.log(n11);
          console.log(n111);
          console.log(n1111);
          return;
      }
      else if(n1111<1||n1111>31||n2222<1||n2222>31){
        wx.showToast({
            icon: 'none',
            title: '日份格式为01-31',
          })
          return;
      }
      else if(n111==2){
        if(n1111==29||n1111==30||n1111==31){
        wx.showToast({
            icon: 'none',
            title: '不存在此日期',
          })
          return;
        }
      }
      else if(n222==2){
        if(n2222==29||n2222==30||n2222==31){
        wx.showToast({
            icon: 'none',
            title: '不存在此日期',
          })
          return;
        }
      }
      else if(n111==4||n111==6||n111==9||n111==11){
        if(n1111==31){
        wx.showToast({
            icon: 'none',
            title: '不存在此日期',
          })
          return;
        }
      }
      else if(n222==4||n222==6||n222==9||n222==11){
        if(n2222==31){
        wx.showToast({
            icon: 'none',
            title: '不存在此日期',
          })
          return;
        }
      }
      else if(n11>n22||n11==n22&&n111>n222||n11==n22&&n111==n222&&n1111>n2222){
        wx.showToast({
            icon: 'none',
            title: '租借日期应小于归还日期',
          })
          return;
      }
    else if (remark.length>20) {
        wx.showToast({
          icon: 'none',
          title: '备注大于20字',
        })
        return;
      }
    db.collection('order').add({
      data: {
        // 模块的名字
        type: 'Rentalservice',
        // 当前时间
        nowTime:that.nowTime,
        nowDate:that.nowDate,
        // 订单金额
        money,
        // 订单状态
        status: 'waiting',
        // 收件地址
        address,
        // 订单信息
        info: {
          itemname,
          remark,
          renttime,
          returntime,
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
  getrenttime(e) {
    this.setData({
      renttime: e.detail.value
    })
  },
  getreturntime(e) {
    this.setData({
      returntime: e.detail.value
    })
  },
  getmoney(e) {
    this.setData({
      money: Number(e.detail.value)
    })
  },
  selectAddress(){
    wx.setStorageSync('Nowurl', 'Rentalservice')
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
    const userInfo = wx.getStorageSync('userInfo');

    if (address) {
      const {
        build,
        houseNumber
      } = address;
      this.setData({
        address: `${build}-${houseNumber}`,
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