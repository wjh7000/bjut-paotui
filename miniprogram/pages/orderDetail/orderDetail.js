// pages/orderDetail/orderDetail.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid:'',
        detail:{},
        isRunner:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const detail = wx.getStorageSync('orderDetail');
        const isRunner = wx.getStorageSync('isRunner');
        const userid = wx.getStorageSync('userid');
        const phone = wx.getStorageSync('phone');
        const userInfo = wx.getStorageSync('userInfo')
        //console.log(cdetail);
        //var that = this;
        this.setData({
            detail:detail,
            isRunner: isRunner,
            status :'',
            openid:userid,
            userInfo: userInfo,
            phone: phone
        });
        let {status} = detail.basicInfo;
        // console.log(options.ddetail);
        //wx.getStorageSync('detail');
        console.log(this.data.detail);
        // db.collection.doc(detail.basicInfo._id).watch({
        //     onChange:function(snapshot){
        //         that.setData({
        //             // detail.basicInfo.status: snapshot
        //         })
        //     }
        // });
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

    },
    call(e){
        const {phone} = e.target.dataset
        console.log(e);
        wx.makePhoneCall({
          phoneNumber: phone,
        })

    },

    orderReceive(e){
        if (this.data.isRunner){
            wx.showLoading({
              title: '加载中',
            })
            const {
                _id
            } = this.data.detail.basicInfo;
            console.log(this.data.detail.basicInfo.openid);
            console.log(this.data.openid);
            if (this.data.detail.basicInfo.openid === this.data.openid){
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: '不能接自己发布的订单',
                  showCancel:false,
                  complete: (res) => {
                    if (res.cancel) {
                    }
                  }
                })
            }
            else{
                db.collection('order').doc(_id).get({
                    success:(res) => {
                        if (res.data.status === 'waiting'){
                            db.collection('order').doc(_id).update({
                                data:{
                                    runnerid: this.data.openid,
                                    runnerInfo: this.data.userInfo,
                                    runnerphone: this.data.phone,
                                    status: 'inProcess',
                                },
                                success:(res) =>{
                                    this.onLoad();
                                    wx.hideLoading();
                                }
                            });
                            //这里有问题
                            wx.hideLoading();
                            this.createDialog();
                            wx.showToast({
                                title: '接单成功',
                                duration: 2000,
                                success: function(){
                                  setTimeout(function(){
                                    wx.navigateBack();
                                  }, 2000);
                                
                                }
                            })
                        }
                        else{
                            wx.hideLoading();
                            wx.showToast({
                                title: '订单被抢走了',
                                icon:'error',
                                success: function(){
                                  setTimeout(function(){
                                    wx.navigateBack();
                                  }, 2000);
                                }
                            })
                        }
                    }
                })
            }
            
        }
        else {
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '您目前不是接单员，请先前往个人页申请成为接单员，待审核通过后再来接单',
            })
        }
    },
    orderFinished(){
            wx.showLoading({
              title: '加载中',
            })
            const {
                _id
            } = this.data.detail.basicInfo;
            console.log(this.data.detail.basicInfo.openid);
            console.log(this.data.openid);
            db.collection('order').doc(_id).get({
                success:(res) => {
                    if (res.data.status === 'inProcess'){
                        db.collection('order').doc(_id).update({
                            data:{
                                runnerid: this.data.openid,
                                status: 'finished',
                            },
                            success:(res) =>{
                                this.onLoad();
                                wx.hideLoading();
                            }
                        });
                        //这里有问题
                        wx.hideLoading();
                        wx.showToast({
                            title: '订单已完成',
                            duration: 2000,
                            success: function(){
                              setTimeout(function(){
                                wx.navigateBack();
                              }, 2000);
                            }
                        })
                    }
                    else{
                        wx.hideLoading();
                        wx.showToast({
                            title: '订单已经被完成了',
                            icon:'error',
                            success: function(){
                              setTimeout(function(){
                                wx.navigateBack();
                              }, 2000);
                            
                            }
                        })
                    }
                }
            })
        },

        createDialog(){
            var that=this.data;
            var myDate=new Date();
            var rider_read_time=new Date();
            var user_read_time=new Date();
            const deliverid=wx.getStorageSync('userid');
            const userid=this.data.detail.basicInfo.openid;//用户id
            //const userid='o0IHy4mVYyOvEz6fdfJzVoB_gXxs';//用户id
            const user_avatar=this.data.detail.basicInfo.userInfo.avatarUrl  //用户的头像
            const user_nickname=this.data.detail.basicInfo.userInfo.nickName  //用户的昵称
            const userInfo=wx.getStorageSync('userInfo');//自己的信息
            const typeList=[
             {
              id:deliverid,
              sentamce:'我是您的骑手请开始,有什么问题可以联系我',
              time:myDate.toLocaleString(),
             }];
             db.collection('chat_record').add({
             data: {
                    chatlog: typeList,
                    userid:userid,
                    user_avatar,
                    user_nickname,

                    recent_update_time:myDate.toLocaleString(),
                    rider_read_time:'',
                    user_read_time:'',
                    userInfo,
                   },
                        success: (res) => {
            //                 wx.showToast({
            //                   //title: '提交成功',
            //                 })
                        },
                        fail: (res) => {
                            wx.showToast({
                              icon: 'none',
                              title: '对话创建失败',
                            })
                        }
                    })
                },
        downloadFile(){
            console.log( "fileID");
            wx.showLoading({
              title: '下载中',
            })
            wx.cloud.downloadFile({
                fileID: this.data.detail.moreInfo.info.printImg,
                success : res =>{
                    
                    const fileManager = wx.getFileSystemManager();
                    fileManager.saveFile({
                       tempFilePath: res.tempFilePath,
                        
                        success: (res) =>{
                            wx.hideLoading()
                            console.log(res, "tmppath");
                            wx.openDocument({
                              filePath: res.savedFilePath,
                              showMenu:true
                          })
                        }
                    })
                },
                fail: (res) =>{
                    console.log("fail")
                }
            })
        }
    
    
})