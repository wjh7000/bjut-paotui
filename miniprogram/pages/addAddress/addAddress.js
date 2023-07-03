// pages/addAddress/addAddress.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      defalutAddress: true,
      build: '',
      houseNumber: '',
      name: '',
      phone: '',
      isEdit: false,
      editNow: false,
      editIndex: 0,
    },

    saveAddress() {
        const {
            build,
            houseNumber,
            name,
            phone,
            defalutAddress,
            isEdit,
            editNow,
            index,
        } = this.data;
        if(!build){
            wx.showToast({
                title: '楼栋不可为空',
                icon:'error',
              })
            return;
        }
        if(!houseNumber){
            wx.showToast({
                title: '门牌号不可为空',
                icon:'error',
              })
            return;
        }
        if(houseNumber.length!=3){
            wx.showToast({
                title: '门牌号应为三位',
                icon:'error',
              })
            return;
        }
        var n2=Number(houseNumber);
        if(isNaN(n2)){
            wx.showToast({
                title: '门牌号非法',
                icon: 'error',
              })
            return;
        }
        if(!name){
            wx.showToast({
                title: '收件人不可为空',
                icon:'error',
              })
            return;
        }
        if(!phone){
            wx.showToast({
                title: '联系方式不可为空',
                icon:'error',
              })
            return;
        }
        if(phone.length!=11){
            wx.showToast({
                title: '手机号错误',
                icon:'error',
              })
              return;
        }
        var n1=Number(phone);
        if(isNaN(n1)){
            wx.showToast({
                title: '手机号非法',
                icon: 'error',
              })
            return;
        }
        let address = wx.getStorageSync('address');
                if (!isEdit && defalutAddress && address) {
                    for (let i = 0; i < address.length; i++) {
                        if (address[i].defalutAddress) {
                            wx.showToast({
                                icon: 'none',
                                title: '已存在默认地址!',
                            })
                            return;
                        }
                    }
        }
        const form = {
            build,
            houseNumber,
            name,
            phone,
            defalutAddress,
        };
        if (!address) {
            address = [form];
        } else {
            if (editNow) {
                address[Number(index)] = form;
            } else {
                address.push(form);
            }
        }
        wx.setStorageSync('address', address);
        wx.navigateBack({
            delta: 1
        })
    },
  
    handleChangeSwitch(e) {
        this.setData({
            defalutAddress: e.detail.value
        })
    },
  
    getPhone(e) {
        this.setData({
            phone: e.detail.value
        })
    },
  
    getName(e) {
        this.setData({
            name: e.detail.value
        })
    },
  
    getHouseNumber(e) {
        this.setData({
            houseNumber: e.detail.value
        })
    },
  
    selectBuild() {
        wx.redirectTo({
            url: '../selectBuild/selectBuild',
        })
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
         const {
          build, address, index
      } = options;
      if (address) {
          const { build: builds, houseNumber, name, phone, defalutAddress } = JSON.parse(address);
          if (defalutAddress) {
              this.setData({
                  isEdit: true
              })
          }
          this.setData({
              build: builds,
              houseNumber,
              name,
              phone,
              defalutAddress,
              index,
              editNow: true,
          })
      } else {
          const phone=wx.getStorageSync('phone');
          this.setData({
              phone,
              build,
          })
      }
  
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