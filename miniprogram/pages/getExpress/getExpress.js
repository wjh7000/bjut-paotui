const db = wx.cloud.database()
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
        address:'',
        business:'',
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

    selectAddress(){
        wx.setStorageSync('Nowurl', 'getExpress')
        wx.navigateTo({
          url: '../addressmanage/addressmanage',
        })
    },

    selectBusiness(){
        wx.navigateTo({
          url: '../expressBusiness/expressBusiness',
        })
    },
    getExpressCode(e) {
        this.setData({
            expressCode: e.detail.value
        })
    },

    getRemark(e) {
        this.setData({
            remark: e.detail.value
        })
    },

    getCode() {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            wx.showLoading({
              title: '加载中',
            })
            const random = Math.floor(Math.random() * 1000);
            wx.cloud.uploadFile({
                cloudPath: `expressCode/${random}.png`,
                filePath: res.tempFilePaths[0],
                success: (res) => {
                    let fileID = res.fileID;
                    this.setData({
                        codeImg: fileID,
                    })
                    wx.hideLoading();
                }
            })
          },
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const address = wx.getStorageSync('addressNow');
        const userInfo = wx.getStorageSync('userInfo');
        const { business } = options;
        //const name = wx.getStorageSync('addressNow');
        if (address) {
            const { build, houseNumber } = address;
            this.setData({
                address: `${build}-${houseNumber}`,
                userInfo,
                //name: `${name}`
            })
        }
        if(business){
            this.setData({
                business: business,
            })
        }
        
    },

    submit(){
        const that = this.data;
        const {phone ,name}=wx.getStorageSync('addressNow');
        db.collection('getExpress').add({
            data: {
                type:'getExpress',
                status:'waiting',
                money: that.money,
                address: that.address,
                business: that.business,
                expressCode: that.expressCode,
                remark: that.remark,
                codeImg: that.codeImg,
                userInfo:that.userInfo,
                name: that.name,
                phone: phone
            },
            success: (res) => {
                // 清空输入内容
                this.setData({
                    money: '',
                    address: '',
                    business: '',
                    expressCode: '',
                    remark: '',
                    codeImg: '',
                    userInfo: '',
                    name: ''
                })
                wx.showToast({
                  title: '提交成功',
                })
                wx.navigateTo({
                  url: '../index/index',
                })
            },
            fail: (res) => {
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                })
            }
        })
    },

    /**0888
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
        wx.switchTab({
          url: '../index/index',
        })
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