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
        this.setData({
            tabNow: e.currentTarget.dataset.id
        })
        if (this.tabNow == 0){
            this.onLoad();
        }
        else if (this.tabNow == 1){
            
            this.getMyOrder();
        }
        else if (this.tabNow == 2){
            this.getMyHelpOrder();
        }
        else if (this.tabNow == 3){
            this.getRewardOrder();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
        db.collection('order').get({
            success:(res)=> {
                const { data } = res;
                data.forEach(item => {
                    const info = {type: item.type, address: item.address}
                    const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                    item.info = info_text;
                });
                this.setData({
                    orderList: data,
                })
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
        let orderList = this.data.orderList;

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
                }
                else{
                    wx.showToast({
                      title: '无更多信息',
                    })
                    //wx.hideLoading()
                }
                
            }

        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    //我的订单页
    getMyOrder() {
        wx.cloud.callFunction({
            name:'getuserid',
            success:(res)=>{

            },
            fail:(res)=>{
                wx.showToast({
                  title: '错误',
                })

            }
        })
        db.collection('order').where({
            _openid:res.result.openid
        }).get({
            success:(res)=> {
                console.log('test');
                // const { data } = res;
                // data.forEach(item => {
                //     console.log(item)
                //     // const {business, expectGender, expectTime, number, remark, size} = item.info;
                //     // const info = '快递类型: ${size} -- 快递数量: ${number}个 -- 快递商家: ${business} -- ';
                //     // item.info = info
                //     const info = {type: item.type, address: item.address}
                //     const info_text = `订单类型: ${info.type} \n 地址: ${info.address}\n`;
                //     item.info = info_text;
                // });
                // this.setData({
                //     orderList: data,
                // })
                // //console.log(this.orderList)
            },
            fail:(res)=>{
                wx.showToast({
                    icon:'none',
                })
            }
        })
    }
})