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
        name:'小件',
        address:'',
        business:'',
        expressCode:'',
        remark:'',
        codeImg:'',
        userInfo:{},
        nowDate:'',
        nowTime:''
    },


    selectType(e) {
        const { id,tip } = e.currentTarget.dataset;
        this.setData({
            typeNow: id,
            money: this.data.typeList[id].money,
            name:this.data.typeList[id].name
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
        wx.setStorageSync('Nowurl', 'getExpress')
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
        wx.chooseMedia({
          count: 1,
          mediaType:['image'],
          sourceType:['album','camera'],
          maxDuration:30,
          camera:'back',
          success: (res) => {
            wx.showLoading({
              title: '加载中',
            })
            const random = Math.floor(Math.random() * 1000);
            wx.cloud.uploadFile({
                cloudPath: `expressCode/${random}.png`,
                filePath: res.tempFiles[0].tempFilePath,
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
    onLoad(options) {
        this.currentTime();
        const address = wx.getStorageSync('addressNow');
        const business = wx.getStorageSync('businessNow');
        const userInfo = wx.getStorageSync('userInfo');
        ///const { business } = options;
        //const name = wx.getStorageSync('addressNow');
        if (address) {
            const { build, houseNumber } = address;
            this.setData({
                address: `${build}-${houseNumber}`,
                userInfo,
                //name: `${name}`
            })
        }
        if (!address) {

            this.setData({
                address:''
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
        if(!that.address){
            wx.showToast({
                title: '未选收件地址',
                icon:'error'
            })
            return;
        }
        else if(!that.business){
            wx.showToast({
                title: '未选快递商家',
                icon:'error'
            })
            return;
        }
         else if(!that.expressCode && !that.codeImg){
            wx.showToast({
                title: '未填写取件信息',
                icon:'error'
            })
            return;
        }
        else if(that.remark.length>10){
            wx.showToast({
                title: '备注大于10字',
                icon:'error',
              })
              return;
        }

        else if(that.expressCode.length>10){
            wx.showToast({
                title: '取件码大于10字',
                icon:'error',
              })
              return;
        }
        db.collection('order').add({
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
                size: that.typeList[that.typeNow].name,
                phone: phone,
                nowDate:that.nowDate,
                nowTime:that.nowTime,
                createTime:db.serverDate()
            },
            success: (res) => {
                console.log(res)
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
                
                setTimeout(function(){
                    wx.switchTab({
                      url: '../index/index',
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

    /**0888
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.onLoad();
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