/* TODO LIST
订单简略页 更改显示内容（起始地-到达地形式） 
订单详细页
拖动更新信息
*/
//const { DrawShapeEmitter } = require("XrFrame/components/emitter");
const db = wx.cloud.database()

// pages/order/order.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
            tabList:['订单广场','进行中','已完成','我发布的'],
            tabNow: 0,
            orderList:[],
            myOrder:[],
            rewardOrder:[],
            helpOrder:[],
            openid:'',
            userInfo: {},
            phone: '',
            isRunner:'',
            loginStatus:false,

            
    },
    
    
    selectTab (e) {
        let {id} =e.currentTarget.dataset
        this.setData({
            tabNow: id
        })
        if (id == 0){
            this.getRewardOrder();
        }
        else if (id == 1){
            this.getProcessOrder();
        }
        else if (id == 2){
            this.getFinishedOrder();
        }
        else if (id == 3){
            this.getMyOrder();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let openid = wx.getStorageSync('userid');
        let userInfo = wx.getStorageSync('userInfo');
        let phone = wx.getStorageSync('phone');
        let loginStatus;
        if (!openid){
            loginStatus = false;
        }
        else{
            loginStatus = true;
        }
        this.setData({
            openid:openid,
            loginStatus:loginStatus,
            userInfo:userInfo,
            phone:phone,
        })
        
        console.log(this.data.openid, 'openid', loginStatus);
        // 不用云函数了，直接从缓存取openid，上面是新版
        // wx.cloud.callFunction({
        //     name:'getuserid',
        //     success:(res)=>{
        //         this.setData({
        //             openid:res.result.openid
        //         })
        //     },
        //     fail:(res)=>{
        //         wx.showToast({
        //           title: '错误',
        //         })
        //     }
        // }),

        //判断骑手
        this.getPersonPower();
        if (this.data.tabNow == 0){
            this.getRewardOrder();
        }
        else if (this.data.tabNow == 1){
            this.getProcessOrder();
        }
        else if (this.data.tabNow == 2){
            this.getFinishedOrder();
        }
        else if (this.data.tabNow == 3){
            this.getMyOrder();
        }
        // //加载全部订单
        // db.collection('order').orderBy('createTime','desc').get({
        //     success:(res)=> {
        //         let { data } = res;
        //         data.forEach((item,index)=> {
        //             //旧版
        //             // const info = {type: item.type, address: item.address}
        //             // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
        //             // item.info = info_text;
        //             //新版
        //             const formattedItem = this.formatInfo(item);
        //             data[index] = formattedItem;
        //         });
        //         this.setData({
        //             orderList: data,
        //         })
        //         //console.log(this.data.orderList)
        //     },
        //     fail:(res)=>{
        //         wx.showToast({
        //             icon:'none',
        //         })
        //     }
        // })
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
        this.onLoad()

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
        
        if (this.data.tabNow == 0){
            this.getRewardOrder();
        }
        else if (this.data.tabNow == 1){
            this.getProcessOrder();
        }
        else if (this.data.tabNow == 2){
            this.getFinishedOrder();
        }
        else if (this.data.tabNow == 3){
            this.getMyOrder();
        }
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        wx.showLoading({
            title: '加载中',
          })
        //let orderList = this.data.orderList;
        let {
            orderList,
            myOrder,
            rewardOrder,
            helpOrder,
            tabNow,
            openid,
        } = this.data;
        if (tabNow === 0){
            db.collection('order').where({
                status:'waiting'
            }).orderBy('createTime','desc').skip(orderList.length).get({
                success:(res) => {
                    let {data} = res;
                    if (data.length){
                        // res.data.forEach(item => {
                        //     const info = {type: item.type, address: item.address}
                        //     const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                        //     item.info = info_text;

                        //     const formattedItem = this.formatInfo(item);
                        //     orderList.push(formattedItem);
                        // })
                        wx.hideLoading();
                        data.forEach((item,index)=> {
                            let formattedItem = this.formatInfo(item);
                            data[index] = formattedItem;
                            orderList.push(data[index]);
                        });
                        this.setData({
                            orderList,
                        });
                        
                    }
                    else{
                        wx.hideLoading()
                        wx.showToast({
                          title: '无更多信息',
                        })
                        
                    }
                }
            })
        }
        if (tabNow === 1){
            db.collection('order').where({
                runnerid: this.data.openid,
                status: 'inProcess',
            }).orderBy('createTime','desc').skip(orderList.length).get({
                success:(res) => {
                    let {data} = res;
                    if (data.length){
                        wx.hideLoading();
                        data.forEach((item,index)=> {
                            let formattedItem = this.formatInfo(item);
                            data[index] = formattedItem;
                            orderList.push(data[index]);
                        });
                        this.setData({
                            orderList,
                        });
                        
                    }
                    else{
                        wx.hideLoading()
                        wx.showToast({
                          title: '无更多信息',
                        })
                        
                    }
                }
            // db.collection('order').skip(orderList.length).where({
            //     _openid: openid
            // }).get({
            //     success:(res) => {
            //         if (res.data.length){
            //             // res.data.forEach(item => {
            //             //     const info = {type: item.type, address: item.address}
            //             //     const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
            //             //     item.info = info_text;
            //             //     orderList.push(item);
            //             // })
            //             // this.setData({
            //             //     orderList,
            //             // })
            //             res.data.forEach((item,index)=> {
            //                 let formattedItem = this.formatInfo(item);
            //                 data[index] = formattedItem;
            //                 orderList.push(data[index]);
            //             });
            //             this.setData({
            //                 orderList,
            //             })
            //             wx.hideLoading()
            //         }
            //         else{
            //             wx.showToast({
            //               title: '无更多信息',
            //             })
            //             wx.hideLoading()
            //         }
            //     }
            })
        }
        if (tabNow === 2){
            db.collection('order').where({
                runnerid: this.data.openid,
                status:'finished'
            }).orderBy('createTime','desc').skip(orderList.length).get({
                success:(res) => {
                    let {data} = res;
                    if (data.length){
                        wx.hideLoading();
                        data.forEach((item,index)=> {
                            let formattedItem = this.formatInfo(item);
                            data[index] = formattedItem;
                            orderList.push(data[index]);
                        });
                        this.setData({
                            orderList,
                        });
                        
                    }
                    else{
                        wx.hideLoading()
                        wx.showToast({
                          title: '无更多信息',
                        })
                        
                    }
                }
            // db.collection('order').skip(helpOrder.length).where({
            //     runnerid: openid
            // }).get({
            //     success:(res) => {
            //         if (res.data.length){
            //             res.data.forEach(item => {
            //                 const info = {type: item.type, address: item.address}
            //                 const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
            //                 item.info = info_text;
            //                 helpOrder.push(item);
            //             })
            //             this.setData({
            //                 helpOrder,
            //             })
            //             wx.hideLoading()
            //         }
            //         else{
            //             wx.hideLoading()
            //             wx.showToast({
            //               title: '无更多信息',
            //             })
                        
            //         }
            //     }
            })
        }
        if (tabNow === 3){
            db.collection('order').where({
                _openid: this.data.openid,
            }).orderBy('createTime','desc').skip(orderList.length).get({
                success:(res) => {
                    let {data} = res;
                    if (data.length){
                        wx.hideLoading();
                        data.forEach((item,index)=> {
                            let formattedItem = this.formatInfo(item);
                            data[index] = formattedItem;
                            orderList.push(data[index]);
                        });
                        this.setData({
                            orderList,
                        });
                        
                    }
                    else{
                        wx.hideLoading()
                        wx.showToast({
                          title: '无更多信息',
                        })
                        
                    }
                }
                // success:(res) => {
                //     if (res.data.length){
                //         res.data.forEach(item => {
                //             const info = {type: item.type, address: item.address}
                //             const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                //             item.info = info_text;
                //             rewardOrder.push(item);
                //         })
                //         this.setData({
                //             rewardOrder,
                //         })
                //         wx.hideLoading()
                //     }
                //     else{
                //         wx.showToast({
                //           title: '无更多信息',
                //         })
                //         wx.hideLoading()
                //     }
                // }
            })
        }

        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    getAll(){
        //加载全部订单
        db.collection('order').orderBy('createTime','desc').get({
            success:(res)=> {
                let { data } = res;
                data.forEach((item,index)=> {
                    //旧版
                    // const info = {type: item.type, address: item.address}
                    // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    // item.info = info_text;
                    //新版
                    const formattedItem = this.formatInfo(item);
                    data[index] = formattedItem;
                });
                this.setData({
                    orderList: data,
                });
                console.log(this.data.orderList)
            },
            fail:(res)=>{
                wx.showToast({
                    icon:'none',
                })
            }
        })
    },
    //我的订单页
    getMyOrder() {
        if (this.data.loginStatus === true){
            db.collection('order').where({
                _openid:this.data.openid
            }).orderBy('createTime','desc').get({
                success:(res)=> {
                    let { data } = res;
                    console.log(data)
                    data.forEach((item,index)=> {
                        //旧版
                        // const info = {type: item.type, address: item.address}
                        // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                        // item.info = info_text;
                        //新版
                        let formattedItem = this.formatInfo(item);
                        data[index] = formattedItem;
                    });
                    this.setData({
                        //myOrder: data,
                        orderList: data
                    })
                    console.log(this.data.orderList)
                },
                fail:(res)=>{
                    wx.showToast({
                        title:'加载错误',
                    })
                }
            })
        }
        else{
            wx.showModal({
                title: '提示',
                content: '请先登录再查看我发布的订单',
                showCancel:false,
                complete: (res) => {
  
                }
              })
              this.setData({
                  orderList:''
              })
        }
        
    },

    getMyHelpOrder(){
        db.collection('order').where({
            runnerid:this.data.openid
        }).orderBy('createTime','desc').get({
            success:(res)=> {
                let { data } = res;
                data.forEach((item,index)=> {
                    //旧版
                    // const info = {type: item.type, address: item.address}
                    // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    // item.info = info_text;
                    //新版
                    let formattedItem = this.formatInfo(item);
                    data[index] = formattedItem;
                });
                
                this.setData({
                    //rewardOrder: data,
                    orderList:data
                });
                
               
            },
            fail:(res)=>{
                wx.showToast({
                    title:'加载错误',
                })
            }
        })

    },
    getRewardOrder(){
        db.collection('order').where({
            status:'waiting'
        }).orderBy('createTime','desc').get({
            success:(res)=> {
                let { data } = res;
                console.log("d", data);
                data.forEach((item,index)=> {
                    //旧版
                    // const info = {type: item.type, address: item.address}
                    // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    // item.info = info_text;
                    //新版
                    let formattedItem = this.formatInfo(item);
                    data[index] = formattedItem;
                });
                
                this.setData({
                    //rewardOrder: data,
                    orderList:data
                });
                
                
                
                console.log(this.data.orderList)
            },
            fail:(res)=>{
                wx.showToast({
                    title:'加载错误',
                })
            }
        })

    },
    getProcessOrder(){
        if (this.data.loginStatus === true){
            db.collection('order').where({
                runnerid:this.data.openid,
                status:'inProcess'
            }).orderBy('createTime','desc').get({
                success:(res)=> {
                    let { data } = res;
                    //console.log("d", data);
                    data.forEach((item,index)=> {
                        //旧版
                        // const info = {type: item.type, address: item.address}
                        // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                        // item.info = info_text;
                        //新版
                        let formattedItem = this.formatInfo(item);
                        data[index] = formattedItem;
                    });
                    
                    this.setData({
                        //rewardOrder: data,
                        orderList:data
                    });
                    console.log(this.data.orderList)
                },
                fail:(res)=>{
                    wx.showToast({
                        title:'加载错误',
                    })
                }
            })
        }
        else{
            wx.showModal({
              title: '提示',
              content: '请先登录再查看我接到的订单',
              showCancel:false,
              complete: (res) => {

              }
            })
            this.setData({
                orderList:''
            })
        }
        

    },
    getFinishedOrder(){
        if (this.data.loginStatus === true){
            db.collection('order').where({
                runnerid:this.data.openid,
                status:'finished'
            }).orderBy('createTime','desc').get({
                success:(res)=> {
                    let { data } = res;
                    console.log("d", data);
                    data.forEach((item,index)=> {
                        //旧版
                        // const info = {type: item.type, address: item.address}
                        // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                        // item.info = info_text;
                        //新版
                        let formattedItem = this.formatInfo(item);
                        data[index] = formattedItem;
                    });
                    
                    this.setData({
                        //rewardOrder: data,
                        orderList:data
                    });
                    console.log(this.data.orderList)
                },
                fail:(res)=>{
                    wx.showToast({
                        title:'加载错误',
                    })
                }
            })
        }
        else{
            wx.showModal({
                title: '提示',
                content: '请先登录再查看我接到的订单',
                showCancel:false,
                complete: (res) => {
                    
                }
              })
            this.setData({
                orderList:''
            })
        }

    },

    jumptoDetail(e){
        const detail = e.currentTarget.dataset.detail
        //console.log(detail)
        wx.setStorageSync('orderDetail', detail),
        wx.navigateTo({
          url: `../orderDetail/orderDetail`,
          success:(res)=>{
          },
          fail:(res)=>{
            wx.showToast({
                title:'加载详情错误',
            })
          }
        })
    },
    
    formatInfo(item){
        let basicInfo = {
            type:item.type, _id:item._id, openid:item._openid, status:item.status, money:item.money, nowDate:item.nowDate, nowTime:item.nowTime, phone:item.phone, userInfo:item.userInfo, runnerid:item.runnerid, runnerphone:item.runnerphone, runnerInfo:item.runnerInfo
        }
        let moreInfo
        //console.log(basicInfo)
        if (basicInfo.type === "getExpress"){
            moreInfo = {
                addressFrom:"快递站", addressTo:item.address, business:item.business, img:item.codeImg, expressCode:item.expressCode, remark:item.remark, size:item.size
            }
        }
        else if (basicInfo.type === "expressDelivery"){
            moreInfo = {
                addressFrom:item.address, addressTo:"快递站", business:item.business, img:item.codeImg, expressCode:item.expressCode, name_from:item.name_from, name_to:item.name_to, remark:item.remark, size:item.size, receiverAddress:item.address_to
            }
        }
        else if (basicInfo.type === "takeaway"){
            moreInfo = {
                addressFrom:item.Spoint+"外卖柜", addressTo:item.Daddress, img:item.codeImg, expressCode:item.expresscode, remark:item.remark, size:item.size
            }
        }
        else if (basicInfo.type === "helpPrint"){
            
            moreInfo = {
                addressFrom:"打印机", addressTo:item.address, info:item.info
            }
        }
        else if (basicInfo.type === "Runleg"){
            moreInfo = {
                addressFrom:item.A1, addressTo:item.A2, info:item.info.itemname, remark:item.info.remark, sendname:item.sendname, sendphone: item.sendphone, receivername:item.receivername, receiverphone:item.receiverphone
            }
        }
        else if (basicInfo.type === "Rentalservice"){
            moreInfo = {
                addressTo:item.address, itemname:item.info.itemname, remark:item.info.remark, renttime:item.info.renttime, returntime:item.info.returntime
            }
        }
        else{
            moreInfo = {test:"test"}
        }

        let returnItem = {basicInfo:basicInfo, moreInfo:moreInfo}
        return returnItem
    },
    orderReceive(e){
        if (this.data.isRunner){
            const {
                item
            } = e.currentTarget.dataset;
            console.log(e);
            const {
                _id
            } = item.basicInfo;
            if (item.basicInfo.openid === this.data.openid){
                wx.showModal({
                  title: '提示',
                  content: '不能接自己发布的订单',
                  showCancel:false,
                  complete: (res) => {
                  }
                });
            }
            else{
                wx.showLoading({
                    title: '加载中',
                  })
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
                                    this.createDialog(item.basicInfo.openid, item.basicInfo.userInfo.avatarUrl, item.basicInfo.userInfo.nickName)
                                    this.onLoad();
                                    wx.hideLoading();
                                },
                            })
                        }
                        else{
                            wx.hideLoading();
                            wx.showToast({
                                title: '订单被抢走了',
                                icon:'error',
                                success: (res)=>{
                                    if (this.data.tabNow == 0){
                                        this.getRewardOrder();
                                    }
                                    else if (this.data.tabNow == 1){
                                        this.getProcessOrder();
                                    }
                                    else if (this.data.tabNow == 2){
                                        this.getFinishedOrder();
                                    }
                                    else if (this.data.tabNow == 3){
                                        this.getMyOrder();
                                    }
                                }
                            });
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

    orderFinished(e){
        wx.showLoading({
          title: '加载中',
        })
        const {
            item
        } = e.currentTarget.dataset;
        console.log(e);
        const {
            _id
        } = item.basicInfo;
    
        db.collection('order').doc(_id).update({
            data:{
                status: 'finished',
            },
            success:(res) =>{
                this.onLoad();
                wx.hideLoading();
            }
        })
    },
    getPersonPower(){
        db.collection('mailmanapply').where({
            _openid: wx.getStorageSync('userid'),
            state:'已通过'
        }).get({
            success:(res)=>{
                this.setData({
                    isRunner: !!res.data.length
                })
                wx.setStorageSync('isRunner', this.data.isRunner)
            }
        })
    },
    createDialog(openid, avatar, nickName){
        var that=this.data;
        var myDate=new Date();
        var rider_read_time=new Date();
        var user_read_time=new Date();
        const deliverid=wx.getStorageSync('userid');
        const userid=openid;//用户id
        //const userid='o0IHy4mVYyOvEz6fdfJzVoB_gXxs';//用户id
        const user_avatar=avatar  //用户的头像
        const user_nickname=nickName  //用户的昵称
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
                        wx.showToast({
                          //title: '提交成功',
                        })
                    },
                    fail: (res) => {
                        wx.showToast({
                          icon: 'none',
                          title: '对话创建失败',
                        })
                    }
                })
            },
})