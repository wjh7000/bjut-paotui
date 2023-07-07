const app = getApp();
const db = wx.cloud.database();
var is_read1;
Page({
    data: {
        myid:'',
        my_customers:[],
    },

    onLoad() {
        const myid=wx.getStorageSync('userid');
        this.setData({
            myid,
            userInfo : app.globalData.userInfo
        })

       
    },
    onShow() {  
        this.setData({
            userInfo : app.globalData.userInfo,
            my_customers : [],
            me_rider    :[]
        })
        this.getmyCustomers2()
        this.getrider()
    },



    getmyCustomers2(){//进行监视，可以实时更新消息页面信息
        const _openid=wx.getStorageSync('userid')
        var state;    
        const that=this;
        db.collection('chat_record').where({_openid}).watch({
            onChange: function(snapshot) {
                that.setData({
                    my_customers : snapshot.docs
                })
                //console.log(that.data.my_customers);
                //检查骑手是否有未读消息
                for (var index in that.data.my_customers) {
                   if(that.data.my_customers[index].recent_update_time>that.data.my_customers[index].rider_read_time) {
                       is_read1=1
                   // console.log(is_read1)
                   }
                   else{
                    is_read1=0
                  //  console.log(is_read1)
                   }          
                   }
            },
            onError: function(err){
                console.log(err)
            }
        })
    },

    getrider() {
        const _openid=wx.getStorageSync('userid')
        var state;    
        const that=this;
        db.collection('chat_record').where({
            userid:_openid,
        }).watch({
            onChange: function(snapshot) {
                //console.log(snapshot);
                that.setData({
                    me_rider : snapshot.docs
                })
                //console.log(that.data.me_rider);
            },
            onError: function(err){
                console.log(err)
            }
    })
},

    startChat(e) {
        const that=this;
        var index = e.currentTarget.dataset.index;
        var myDate=new Date()
        //console.log(index);
        //console.log(that.data.my_customers[index]);
        //更新骑手最近读的时间

        db.collection('chat_record').where({
           _id:this.data.my_customers[index]._id
        })
        wx.navigateTo({
          url: '/pages/chat/chat?id=' + this.data.my_customers[index]._id
        })
        

        
    },

    startChatWithRider(e) {
        const that=this;
        var index = e.currentTarget.dataset.index;
        var myDate=new Date();
        //console.log(index);
        //console.log(this.data.me_rider);

        //更新用户最近读的时间
        db.collection('chat_record').where({
            _id:this.data.me_rider[index]._id
         })

        wx.navigateTo({
          url: '/pages/chat/chat?id=' + this.data.me_rider[index]._id
        })
        
    }
})