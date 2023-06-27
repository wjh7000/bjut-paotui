// pages/personaldetail/personaldetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        phone:'',
        hasphone:false,
        haschanged:false,
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const userInfo = wx.getStorageSync('userInfo');
        const phone = wx.getStorageSync('phone');
        this.setData({
            userInfo,
            phone,
            hasphone:!!phone,
        })
    },

    updatenickname(e){
        let userInfo=this.data.userInfo;
        userInfo.nickName= e.detail.value;
        this.setData({
            userInfo,
            haschanged:true,
        })
    },

    save(e){
        let xinxi
        let phonenum
        wx.setStorageSync('phone', this.data.phone);
        wx.setStorageSync('userInfo', this.data.userInfo);
        xinxi =  this.data.userInfo
        phonenum =  this.data.phone
        wx.cloud.database().collection('chat_user').
        add({
            data:{
                time:Date.now(),
                ...xinxi,phonenum
            }
        })

        if(!!!this.data.phone){
            wx.showToast({
              title: '手机号不可为空',
              icon:'error',
            })
            return;
        }
        else if(this.data.phone.length!=11){
            wx.showToast({
                title: '手机号错误',
                icon:'error',
              })
              return;
        }
        else if(!!!this.data.userInfo.nickName){
            wx.showToast({
              title: '名字不可为空',
              icon:'error',
            })
            return;
        }
        else if(!this.data.haschanged){
            wx.showToast({
                title: '未进行修改',
                duration: 500,
                icon:'error',
              })
              return ;
        }
        wx.showToast({
          title: '修改成功',
          duration: 500,
        })
        setTimeout(function(){
            wx.switchTab({
              url: '../info/info',
             })}
             ,600);
        
    },

    updatephone(e){
        let phone=this.data.phone;
        phone=e.detail.value;
        this.setData({
            phone,
            haschanged:true,
        })
    },

    updateaddress(){
        if(!!!wx.getStorageSync('phone')){
            //wx.hideHomeButton();
            wx.showToast({
                title: '请保存手机号',
                duration: 1000,
                icon:'error',
              })
            return;
        }
        wx.setStorageSync('Nowurl', 'personal');
        wx.navigateTo({
          url: '../addressmanage/addressmanage',
        })
    },

    changeavatar(){
        let userInfo=this.data.userInfo;
        var that=this;
        wx.chooseMedia({
            count:1,
            mediaType:['image'],
            sourceType:['album','camera'],
            maxDuration:30,
            camera:'back',
            success(res) {
                wx.showLoading({
                    title:'正在上传头像',
                })
                const random =Math.floor(Math.random()*1000);
                wx.cloud.uploadFile({
                    cloudPath:'avatar/'+random+'.png',
                    filePath:res.tempFiles[0].tempFilePath,
                    success:(res)=>{
                        let fileID = res.fileID;
                        userInfo.avatarUrl = fileID;
                        that.setData({
                            userInfo,
                            haschanged:true,
                        })
                        wx.hideLoading()
                    }
                })
            }
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
        if(!!!wx.getStorageSync('phone')){
            wx.hideHomeButton();
            wx.showToast({
                title: '请填写手机号',
                duration: 1000,
                icon:'error',
              })
        }
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