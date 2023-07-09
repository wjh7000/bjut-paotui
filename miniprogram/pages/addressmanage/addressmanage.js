// pages/addressmanage/addressmanage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: [],
    },

    edit(e) {
        const index = e.currentTarget.dataset.index;
        const address = this.data.address[index];
        wx.navigateTo({
          url: `../addAddress/addAddress?address=${JSON.stringify(address)}&index=${index}`,
        })
      },
      
      selectAddress(e) {
        const {
          index
        } = e.currentTarget.dataset;
        const url = wx.getStorageSync('Nowurl')
        if(url=='personal') { return;}
        const address = this.data.address[index];
        const no=wx.getStorageSync('no');
        if(no==1){
        wx.setStorageSync('addressNow2', address);
        wx.setStorageSync('indexnow2', index);
        wx.setStorageSync('no', 0);
    }
        else{
        wx.setStorageSync('addressNow', address);
        wx.setStorageSync('indexnow', index);}
        // wx.redirectTo({
        //   url: `../${url}/${url}`,
        // })
        wx.navigateBack({
            delta: 1
        })
      },
    
      delete(e) {
        const index = e.currentTarget.dataset.index;
        var indexnow=wx.getStorageSync('indexnow');
        var indexnow2=wx.getStorageSync('indexnow2');
        const address = this.data.address;
        wx.showModal({
            title: '删除',
            content: '确定要删除吗？',
            complete: (res) => {
            if (res.confirm) {
                if(indexnow>index) indexnow--;
                else if(indexnow==index){
                    wx.removeStorage({
                      key: 'addressNow',
                    })
                    wx.removeStorage({
                      key: 'indexnow',
                    })
                }
                if(indexnow2>index) indexnow2--;
                else if(indexnow2==index){
                    wx.removeStorage({
                      key: 'addressNow2',
                    })
                    wx.removeStorage({
                      key: 'indexnow2',
                    })
                }
                wx.setStorageSync('indexnow', indexnow)
                wx.setStorageSync('indexnow2', indexnow2)
                address.splice(index, 1);
                wx.setStorageSync('address', address);
                wx.showToast({
                title: '删除成功',
                })
                this.onLoad();   
            }
            }
          })
        
      },
    
      addAddress() {
        wx.navigateTo({
          url: '../addAddress/addAddress',
        })
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    const address = wx.getStorageSync('address');
    this.setData({
    address,
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
        this.setData({
            address: wx.getStorageSync('address')
          })
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
        wx.setStorageSync('no', 0);
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