const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeList2:[
            {
                name:'饭食',
                tips:'饭食：米饭炸鸡等，价格3元',
                money:3,
            },
            {
                name:'饮料',
                tips:'饮料：奶茶咖啡等，价格2元',
                money:2,
            }
        ],
        typeNow: 0,
        money: 3,
        name:'饭食',
        Daddress:'',
        Spoint:'',
        expresscode:'',
        remark1:'',
        codeImg1:'',
        userInfo1:{},
        nowDate1:'',
        nowTime1:''
    },


    selectType(e) {
        const { id,tip } = e.currentTarget.dataset;
        this.setData({
            typeNow: id,
            money: this.data.typeList2[id].money,
            name:this.data.typeList2[id].name
        })
        wx.showToast({
            icon: 'none',
            title: tip,
        })
    },

    selectDaddress(){
        wx.setStorageSync('Nowurl', 'takeaway')
        wx.navigateTo({
          url: '../addressmanage/addressmanage',
        })
    },

    selectPoint(){
        wx.setStorageSync('Nowurl', 'takeaway')
        wx.navigateTo({
          url: '../Dcabinet/Dcabinet',
        })
    },
    getExpressCode(e) {
        this.setData({
            expresscode: e.detail.value
        })
 
    },

    getRemark(e) {
        this.setData({
            remark1: e.detail.value
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
                cloudPath: `expresscode/${random}.png`,
                filePath: res.tempFiles[0].tempFilePath,
                success: (res) => {
                    let fileID = res.fileID;
                    this.setData({
                        codeImg1: fileID,
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
    
        this.nowDate1 = yy + ' 年 ' + mm + ' 月 ' + dd + ' 日'
    
        this.nowTime1 = hou + ' : ' + min + ' : ' + sec
    
        this.nowWeek1 = week
    
        this.setData({
    
          nowDate1: this.nowDate1,
    
          nowTime1: this.nowTime1,
    
        })  
    
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.currentTime();
        const Daddress = wx.getStorageSync('addressNow');
        const Spoint = wx.getStorageSync('pointNow');
        const userInfo1 = wx.getStorageSync('userInfo');
        ///const { business } = options;
        //const name = wx.getStorageSync('addressNow');
        if (Daddress) {
            const { build, houseNumber } = Daddress;
            this.setData({
                Daddress: `${build}-${houseNumber}`,
                userInfo1,
                //name: `${name}`
            })
        }
        if (!Daddress) {

            this.setData({
                Daddress:''
                //name: `${name}`
            })
        }
        if(Spoint){
            this.setData({
                Spoint: Spoint,
            })
        }
        
    },

    
    submit(){
        const that = this.data;
        const {phone ,name}=wx.getStorageSync('DaddressNow');
        if(!that.Daddress){
            wx.showToast({
                title: '未选收件地址',
                icon:'error'
            })
            return;
        }
        else if(!that.Spoint){
            wx.showToast({
                title: '未选快递商家',
                icon:'error'
            })
            return;
        }
         else if(!that.expresscode && !that.codeImg1){
            wx.showToast({
                title: '未填写取件信息',
                icon:'error'
            })
            return;
        }
        else if(that.remark1.length>10){
            wx.showToast({
                title: '备注大于10字',
                icon:'error',
              })
              return;
        }

        else if(that.expresscode.length>10){
            wx.showToast({
                title: '取件码大于10字',
                icon:'error',
              })
              return;
        }
        db.collection('order').add({
            data: {
                type:'takeaway',
                status:'waiting',
                money: that.money,
                Daddress: that.Daddress,
                Spoint: that.Spoint,
                expresscode: that.expresscode,
                remark: that.remark1,
                codeImg: that.codeImg1,
                userInfo:that.userInfo1,
                size: that.typeList2[that.typeNow].name,
                phone: phone,
                nowDate:that.nowDate1,
                nowTime:that.nowTime1,
                createTime:db.serverDate()
            },
            success: (res) => {
                console.log(res)
                // 清空输入内容
                this.setData({
                    money: '',
                    Daddress: '',
                    Spoint: '',
                    expresscode: '',
                    remark1: '',
                    codeImg1: '',
                    userInfo1: '',
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
        wx.removeStorageSync('pointNow')
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