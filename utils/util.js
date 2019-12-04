

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//var ajaxurl ='https://www.uear.net/test/'
var ajaxurl = 'https://www.uear.net/ajax4/'

//获取分享标题
const get_title=function(that){
  wx.request({
    url: ''+ajaxurl+'random_text.php',
    data: {
    },
    method: 'GET',
    success: function (res) {
      that.setData({
        tit: res.data.data
      })
    }
  })
}
//获取red
const get_red = function (that) {
  wx.request({
    url: '' + ajaxurl + 'sign_num.php',
    data: {
      openid:that.data.openid
    },
    method: 'GET',
    success: function (res) {
      //console.log(res.data.data.status)
      if (res.data.data.status){
        that.setData({
          red_point:true,
          status_num: res.data.data.status_num
        })
      }else{
        that.setData({
          red_point: false
        })
      }
    }
  })
}


module.exports = {
  formatTime: formatTime,
  ajaxurl: ajaxurl,
  get_title: get_title,
  get_red: get_red
}
