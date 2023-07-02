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
        db.collection('order').get({
            success:(res)=> {
                let { data } = res;
                console.log(res)


                data.forEach((item,index)=> {
                    //旧版
                    const info = {type: item.type, address: item.address}
                    const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    item.info = info_text;
                    //新版
                    // const formattedItem = this.formatInfo(item);
                    // data[index] = formattedItem;
                });
                this.setData({
                    orderList: data,
                })
                console.log(this.data.orderList)
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
                            orderList.push(item);
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
        }).get({
            success:(res)=> {
                const { data } = res;
                data.forEach(item => {
                    //const newItem = this.formatInfo(item)
                    const info = {type: item.type, address: item.address}
                    const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    item.info = info_text;
                    
                    //console.log(newItem)
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
        }).get({
            success:(res)=> {
                const { data } = res;
                data.forEach(item => {
                    //console.log(item)
                    const info = {type: item.type, address: item.address}
                    const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    item.info = info_text;
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
        }).get({
            success:(res)=> {
                const { data } = res;
                data.forEach(item => {
                    //console.log(item)
                    const info = {type: item.type, address: item.address}
                    const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    item.info = info_text;
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
          
          //恢复这里
          url: `../orderDetail/orderDetail`,
          //url: `../testGPT/testGPT`,
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
                addressFrom:"快递站", addressTo:item.address, business:item.business, codeImg:item.codeImg, expressCode:item.expressCode, remark:item.remark, size:item.size
            }
        }
        else if (basicInfo.type === "expressDelivery"){
            moreInfo = {
                address, business, codeImg, expressCode, name_from, name_to, remark, size
            } = item
        }
        else if (basicInfo.type === "helpPring"){
            moreInfo = {
                address, info
            } = item
        }
        else{
            moreInfo = {test:"test"}
        }

        let returnItem = {basicInfo:basicInfo, moreInfo:moreInfo}
        return returnItem
    }
})