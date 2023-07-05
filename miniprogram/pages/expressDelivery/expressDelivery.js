// pages/expressDelivery/expressDelivery.js
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
        name_from:'',
        name_to:'',
        address_to:'',
        expressCode:'',
        remark:'',
        codeImg:'',
        userInfo:{}
    },
    selectAddress(){
        wx.setStorageSync('Nowurl', 'expressDelivery')
        wx.navigateTo({
          url: '../addressmanage/addressmanage',
        })
    },

    selectBusiness(){
        wx.setStorageSync('Nowurl', 'expressDelivery')
        wx.navigateTo({
          url: '../expressBusiness/expressBusiness',
        })
    },

    getExpressCode(e) {
        console.log(e.detail)
        this.setData({
            expressCode: e.detail.value
        })
        console.log(this.data.expressCode)
    },

    getRemark(e) {
        this.setData({
            remark: e.detail.value
        })
    },

    getName(e) {
        this.setData({
            name: e.detail.value
        })
    },
    getAddress_to(e) {
        this.setData({
            address_to: e.detail.value
        })
    },

    getName_to(e) {
        this.setData({
            name_to: e.detail.value
        })
    },
    getName_from(e) {
        this.setData({
            name_from: e.detail.value
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
        const userInfo = wx.getStorageSync('userInfo');
        const business = wx.getStorageSync('businessNow');
        //const { business } = options;
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
                title: '未选择寄件地址',
                icon:'error'
            })
            return;
        }
        else if(!that.business){
            wx.showToast({
                title: '未选择快递商家',
                icon:'error'
            })
            return;
        }
         else if(!that.name_from){
            wx.showToast({
                title: '未填写寄件人',
                icon:'error'
            })
            return;
        }
        else if(!that.name_to){
            wx.showToast({
                title: '未填写收件人',
                icon:'error'
            })
            return;
        }
        else if(!that.address_to){
            wx.showToast({
                title: '未填写收件地址',
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
        else if(that.remark.length>20){
            wx.showToast({
                title: '备注大于20字',
                icon:'error',
              })
              return;
        }
        else if(that.expressCode.length>20){
            wx.showToast({
                title: '取件码大于20字',
                icon:'error',
              })
              return;
        }
        else if(that.address_to.length>20){
            wx.showToast({
                title: '收件地址非法',
                icon:'error',
              })
              return;
        }
        else if(that.name_from.length>5){
            wx.showToast({
                title: '寄件人姓名非法',
                icon:'error',
              })
              return;
        }

        else if(that.name_to.length>5){
            wx.showToast({
                title: '收件人姓名非法',
                icon:'error',
              })
              return;
        }
        db.collection('order').add({
            data: {
                type:'expressDelivery',
                status:'waiting',
                money: that.money,
                name_from:that.name_from,
                name_to:that.name_to,
                address_to:that.address_to,
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
                createTime: db.serverDate()
            },
            success: (res) => {
                // 清空输入内容
                this.setData({
                    type:'',
                    status:'',
                    money: '',
                    address: '',
                    name_to:'',
                    address_to:'',
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