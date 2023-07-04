const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    printImg: '',
    address: '',
    userInfo: {},
    pageNum: null,
    remark: '',
    colorPrint: false,
    twoSided: false,
    path: '',
    nowDate:'',
    nowTime:''
  },

  getTwoSided(e) {
    this.setData({
      twoSided: e.detail.value
    })
  },

  getColorPrint(e) {
    this.setData({
      colorPrint: e.detail.value
    })
  },

  submit() {
    const that = this.data;
    
    if(that.remark.length>10){
        wx.showToast({
            title: '备注大于10字',
            icon:'error',
          })
          return;
    }
    const {
      printImg,
      address,
      userInfo,
      pageNum,
      colorPrint,
      remark,
      twoSided
    } = this.data;
    if (!printImg) {
      wx.showToast({
        icon: 'none',
        title: '您未上传文件',
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
    else if (!pageNum) {
        wx.showToast({
          icon: 'none',
          title: '您未填页数',
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
        type: 'helpPrint',
        // 当前时间
        nowTime:that.nowTime,
        nowDate:that.nowDate,
        // 订单金额
        money: colorPrint ? (2 * pageNum + 3) : (0.5 * pageNum + 3),
        // 订单状态
        status: 'waiting',
        // 收件地址
        address,
        // 订单信息
        info: {
          // 打印原件
          printImg,
          // 页数
          pageNum,
          // 备注
          remark,
          // 是否彩印
          colorPrint,
          // 是否双面
          twoSided,
        },
        // 用户信息
        userInfo,
        // 用户手机号
        phone: wx.getStorageSync('phone')
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

  getRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  getPageNumber(e) {
    this.setData({
      pageNum: Number(e.detail.value)
    })
  },

  selectAddress() {
    wx.setStorageSync('urlNow', 'print')
    wx.redirectTo({
      url: '../address/address',
    })
  },

  getImg() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        console.log(res);
        const { path, name } = res.tempFiles[0];
        this.setData({
          path,
        })
        wx.showLoading({
          title: '加载中',
        })
        const random = Math.floor(Math.random() * 1000);
        wx.cloud.uploadFile({
          cloudPath: `print/${random}${name}`,
          filePath: path,
          success: (res) => {
            console.log(res);
            let fileID = res.fileID;
            this.setData({
              printImg: fileID,
            })
            console.log(this.data.printImg);
            wx.hideLoading();
          },
          fail: (err) => {
            console.log(err);
          }
        })
      }
    })
  },

  preview() {
    wx.openDocument({
      filePath: this.data.path,
      success: function (res) {
        console.log('打开文档成功')
      }
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