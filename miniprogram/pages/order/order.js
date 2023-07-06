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
            tabList:['全部','我的订单','我帮助的','正在悬赏'],
            tabNow: 0,
            orderList:[],
            myOrder:[],
            rewardOrder:[],
            helpOrder:[],
            openid:'',
            isRunner:''
    },
    
    
    selectTab (e) {
        const {id} =e.currentTarget.dataset
        this.setData({
            tabNow: id
        })
        if (id == 0){
            this.onLoad();
        }
        else if (id == 1){
            this.getMyOrder();
        }
        else if (id == 2){
            this.getMyHelpOrder();
        }
        else if (id == 3){
            this.getRewardOrder();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.cloud.callFunction({
            name:'getuserid',
            success:(res)=>{
                this.setData({
                    openid:res.result.openid
                })
                //console.log(this.data.openid)
                //this.data.openid = res.result.openid
            },
            fail:(res)=>{
                wx.showToast({
                  title: '错误',
                })
            }
        }),

        //判断骑手
        this.getPersonPower();
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
                })
                //console.log(this.data.orderList)
            },
            fail:(res)=>{
                wx.showToast({
                    icon:'none',
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
            this.onLoad();
        }
        else if (this.data.tabNow == 1){
            this.getMyOrder();
        }
        else if (this.data.tabNow == 2){
            this.getMyHelpOrder();
        }
        else if (this.data.tabNow == 3){
            this.getRewardOrder();
        }
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
            pagenum
        } = this.data;
        if (tabNow === 0){
            db.collection('order').skip(orderList.length).get({
                success:(res) => {
                    if (res.data.length){
                        res.data.forEach(item => {
                            const info = {type: item.type, address: item.address}
                            const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                            item.info = info_text;

                            const formattedItem = this.formatInfo(item);
                            orderList.push(formattedItem);
                        })
                        this.setData({
                            orderList,
                        })
                        wx.hideLoading()
                    }
                    else{
                        wx.showToast({
                          title: '无更多信息',
                        })
                        //wx.hideLoading()
                    }
                }
            })
        }
        if (tabNow === 1){
            db.collection('order').skip(myOrder.length).where({
                _openid: openid
            }).get({
                success:(res) => {
                    if (res.data.length){
                        res.data.forEach(item => {
                            const info = {type: item.type, address: item.address}
                            const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                            item.info = info_text;
                            myOrder.push(item);
                        })
                        this.setData({
                            myOrder,
                        })
                        wx.hideLoading()
                    }
                    else{
                        wx.showToast({
                          title: '无更多信息',
                        })
                        wx.hideLoading()
                    }
                }
            })
        }
        if (tabNow === 2){
            db.collection('order').skip(helpOrder.length).where({
                runnerid: openid
            }).get({
                success:(res) => {
                    if (res.data.length){
                        res.data.forEach(item => {
                            const info = {type: item.type, address: item.address}
                            const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                            item.info = info_text;
                            helpOrder.push(item);
                        })
                        this.setData({
                            helpOrder,
                        })
                        wx.hideLoading()
                    }
                    else{
                        wx.showToast({
                          title: '无更多信息',
                        })
                        wx.hideLoading()
                    }
                }
            })
        }
        if (tabNow === 3){
            db.collection('order').skip(rewardOrder.length).where({
                status: 'waiting'
            }).get({
                success:(res) => {
                    if (res.data.length){
                        res.data.forEach(item => {
                            const info = {type: item.type, address: item.address}
                            const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                            item.info = info_text;
                            rewardOrder.push(item);
                        })
                        this.setData({
                            rewardOrder,
                        })
                        wx.hideLoading()
                    }
                    else{
                        wx.showToast({
                          title: '无更多信息',
                        })
                        wx.hideLoading()
                    }
                }
            })
        }

        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    //我的订单页
    getMyOrder() {
        db.collection('order').where({
            _openid:this.data.openid
        }).orderBy('createTime','desc').get({
            success:(res)=> {
                const { data } = res;
                data.forEach(item => {
                    //const newItem = this.formatInfo(item)
                    // const info = {type: item.type, address: item.address}
                    // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    // item.info = info_text;
                    const formattedItem = this.formatInfo(item);
                    data[index] = formattedItem;
                });
                this.setData({
                    myOrder: data,
                })
                //console.log(this.myOrder)
            },
            fail:(res)=>{
                wx.showToast({
                    title:'加载错误',
                })
            }
        })
    },

    getMyHelpOrder(){
        db.collection('order').where({
            runnerid:this.data.openid
        }).orderBy('createTime','desc').get({
            success:(res)=> {
                const { data } = res;
                data.forEach(item => {
                    //console.log(item)
                    // const info = {type: item.type, address: item.address}
                    // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    // item.info = info_text;
                    const formattedItem = this.formatInfo(item);
                    data[index] = formattedItem;
                });
                this.setData({
                    helpOrder: data,
                })
                //console.log(this.myOrder)
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
                const { data } = res;
                data.forEach(item => {
                    // const info = {type: item.type, address: item.address}
                    // const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    // item.info = info_text;
                    const formattedItem = this.formatInfo(item);
                    data[index] = formattedItem;
                });
                this.setData({
                    rewardOrder: data,
                })
            },
            fail:(res)=>{
                wx.showToast({
                    title:'加载错误',
                })
            }
        })

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
            type:item.type, _id:item._id, openid:item._openid, status:item.status, money:item.money, nowDate:item.nowDate, nowTime:item.nowTime, phone:item.phone, userInfo:item.userInfo
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
                addressFrom:item.address, addressTo:"快递站", business:item.business, img:item.codeImg, expressCode:item.expressCode, name_from:item.name_from, name_to:item.name_to, remark:item.remark, size:item.size
            }
        }
        else if (basicInfo.type === "helpPrint"){
            
            moreInfo = {
                addressFrom:"打印机", addressTo:item.address, info:item.info
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
                    runnerid: this.data.openid,
                    status: 'inProcess',
                },
                success:(res) =>{
                    this.onLoad();
                    wx.hideLoading();
                }
            })
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
    }
})