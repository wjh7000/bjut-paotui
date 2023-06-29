export const getuserstate =(_openid,db)=>{
    var state;
    db.collection('mailmanapply').where({
        _openid,
    }).get({
        success(res){
            console.log(res);
            state=res.data[0].state;
            wx.setStorageSync('state', state);
            return ;
        }
    }) 
   
}