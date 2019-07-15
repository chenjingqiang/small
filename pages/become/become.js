// pages/become/become.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '', 
    userInfo: {},
    code:0,
    nan_nv:'女',
    name:'',
    age:'',
    add1:'',
    add2:'',
    wxid:'',
    range: ["高中","大专","本科专修","硕士","博士"],
    picker_value:'点击选择学历',
    yuyan_arr:[],
    yuyan_arr_length:0,
    yuyan_value:'',
    yuyan2_arr: [],
    yuyan2_arr_length: 0,
    yuyan2_value: '',
    beijing:'',
    nianxian:'',
    jingli:'',
    biaoqian_select_length:0,
    biaoqian_select:[],
    names2:[],
    source:'',
    start_time: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var openid=wx.getStorageSync('openid')
    this.setData({
      openid:openid
    })
    if (app.globalData.userInfo.nickName) {
      //console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.userInfoReadyCallback = res => {
        //console.log('userInfoReadyCallback: ', res.userInfo);
        //console.log('获取用户信息成功');
        that.setData({
          userInfo: res.userInfo
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
    })
    
    //获取微信id、标签
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_wxid.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        that.setData({
          wxid: res.data.data.wxid,
          biaoqian_select: res.data.data.scene
        })
      }, 
      complete: function () {
        //获取翻译官详情
        wx.request({
          url: 'https://www.uear.net/ajax4/trandlator_details.php',
          data: {
            openid: that.data.openid,
          },
          method: 'GET',
          success: function (res) {
            //console.log(res.data)
            that.setData({
              code: res.data.code
            })
            if (res.data.code == 1) {
              var data = res.data.data
              var major_scene = res.data.data.major_scene
              var biaoqian_select = that.data.biaoqian_select
              for (var i = 0; i < biaoqian_select.length; i++) {
                for (var j = 0; j < major_scene.length; j++) {
                  if (biaoqian_select[i].name == major_scene[j]) {
                    biaoqian_select[i].mark = false
                  }
                }
              }
              //console.log(major_scene)
              //console.log(biaoqian_select)
              that.setData({
                nan_nv: data.wx_sex,
                name: data.wx_name,
                age: data.wx_age,
                add1: data.country,
                add2: data.city,
                wxid: data.wxid,
                picker_value: data.education,
                yuyan_arr: data.language,
                yuyan_arr_length: data.language.length,
                beijing: data.background,
                jingli: data.work_text,
                nianxian: data.work_years,
                yuyan2_arr: data.major_certificate,
                yuyan2_arr_length: data.major_certificate.length,
                names2: data.major_scene,
                biaoqian_select_length: data.major_scene.length,
                source: data.source,
                biaoqian_select: biaoqian_select
              })
            }
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      }
    })
   
  },
  nan:function(){
    this.setData({
      nan_nv:'男'
    })
  },
  nv: function () {
    this.setData({
      nan_nv: '女'
    })
  },
  name_value:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  age_value: function (e) {
    this.setData({
      age: e.detail.value
    })
  },
  add1_value: function (e) {
    this.setData({
      add1: e.detail.value
    })
  },
  add2_value: function (e) {
    this.setData({
      add2: e.detail.value
    })
  },
  phone_value: function (e) {
    this.setData({
      wxid: e.detail.value
    })
  },
  //选择学历
  bindPickerChange: function (e) {
    //console.log(e.detail)
    var index = e.detail.value
    this.setData({
      picker_value: this.data.range[index]
    })
  },
  //添加语言标签
  yuyan_value:function(e){
    //console.log(e.detail.value)
    var value = e.detail.value
    this.setData({
      yuyan_value: e.detail.value
    })
    
  },
  //添加语言标签
  add_yuyan:function(){
    if (this.data.yuyan_value == '') {
      wx.showToast({
        title: '语言标签不能为空',
        icon:'none'
      })
    }else{
      if (this.data.yuyan_arr.length < 8) {
        var arr = this.data.yuyan_arr
        arr.push(this.data.yuyan_value)
        this.setData({
          yuyan_arr: arr,
          yuyan_arr_length: arr.length
        })
      }
    }
  },
  //删除语言标签
  remove_yuyan:function(e){
    //console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var arr = this.data.yuyan_arr
    arr.splice(index, 1); 
    this.setData({
      yuyan_arr: arr,
      yuyan_arr_length: arr.length
    })
  },
  //添加语言能力等级
  yuyan2_value: function (e) {
    //console.log(e.detail.value)
    var value = e.detail.value
    this.setData({
      yuyan2_value: e.detail.value
    })

  },
  //添加语言能力等级
  add2_yuyan: function () {
    if (this.data.yuyan2_value == '') {
      wx.showToast({
        title: '语言标签不能为空',
        icon: 'none'
      })
    } else {
      if (this.data.yuyan2_arr.length < 8) {
        var arr = this.data.yuyan2_arr
        arr.push(this.data.yuyan2_value)
        this.setData({
          yuyan2_arr: arr,
          yuyan2_arr_length: arr.length
        })
      }
    }
  },
  //删除语言能力等级
  remove2_yuyan: function (e) {
    //console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var arr = this.data.yuyan2_arr
    arr.splice(index, 1);
    this.setData({
      yuyan2_arr: arr,
      yuyan2_arr_length: arr.length
    })
  },
  beijing_value: function (e) {
    this.setData({
      beijing: e.detail.value
    })
  },
  nianxian_value: function (e) {
    this.setData({
      nianxian: e.detail.value
    })
  },
  jingli_value: function (e) {
    this.setData({
      jingli: e.detail.value
    })
  },
  //标签
  biaoqian_click: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var mark = e.currentTarget.dataset.mark
    var index = e.currentTarget.dataset.index
    var names2 = that.data.names2
    
    if (mark) {
      //console.log('未选中')
      if (that.data.names2.length < 8) {
        if (names2.indexOf(name) == -1) {
          //console.log('没有')
          names2.push(name)
        } else {
          //console.log('有')
        }
        var biaoqian_select = that.data.biaoqian_select
        biaoqian_select[index].mark = !biaoqian_select[index].mark
        that.setData({
          biaoqian_select: biaoqian_select,
        })
      }
    } else {
      //console.log('选中')
      var biaoqian_select = that.data.biaoqian_select
      biaoqian_select[index].mark = !biaoqian_select[index].mark
      that.setData({
        biaoqian_select: biaoqian_select
      })
      var cha_index = names2.indexOf(name);
      names2.splice(cha_index, 1)
    }
    that.setData({
      names2: names2,
      biaoqian_select_length: names2.length
    })
    console.log(names2)
  },
  source_value: function (e) {
    this.setData({
      source: e.detail.value
    })
  },
  sub:function(){
    var that=this
    var time = Date.parse(new Date());
    if (time - this.data.start_time < 10000) {
      //console.log('频繁点击')
      return
    } else {
      that.setData({
        start_time: time
      })
      //console.log('正常')
    }
    // if(this.data.nan_nv==0){
    //   wx.showToast({
    //     title: '请选择性别',
    //     icon: 'none'
    //   })
    //   return
    // }
    if (this.data.name == '') {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none'
      })
      return
    }
    if (this.data.age == '') {
      wx.showToast({
        title: '请填写年龄',
        icon: 'none'
      })
      return
    }
    if (this.data.add1 == '' || this.data.add2 == '') {
      wx.showToast({
        title: '请填写地区',
        icon: 'none'
      })
      return
    }
    if (this.data.picker_value == '点击选择学历') {
      wx.showToast({
        title: '请选择最高学历',
        icon: 'none'
      })
      return
    }
    if (this.data.yuyan_arr==''){
      wx.showToast({
        title: '请填写语言标签',
        icon: 'none'
      })
      return
    }
    var data = {
      openid: this.data.openid,
      wx_sex: this.data.nan_nv,
      wx_name: this.data.name,
      wx_img: this.data.userInfo.avatarUrl,
      wx_age: this.data.age,
      country: this.data.add1,
      city: this.data.add2,
      wxid: this.data.wxid,
      education: this.data.picker_value,
      language: this.data.yuyan_arr,
      background: this.data.beijing,
      work_text: this.data.jingli,
      work_years: this.data.nianxian,
      major_certificate: this.data.yuyan2_arr,
      major_scene: this.data.names2,
      source: this.data.source,
    }
    if(this.data.code==0){
      wx.request({
        url: 'https://www.uear.net/ajax4/translator.php',
        data: data,
        method: 'GET',
        success: function (res) {
          //console.log(res)
          if (res.data.code == 1) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              mark: true
            })
            wx.reLaunch({
              url: '/pages/wode/wode',
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              mark: true
            })
          }
        }
      })
    }else{
      wx.request({
        url: 'https://www.uear.net/ajax4/translator_update.php',
        data: data,
        method: 'GET',
        success: function (res) {
          //console.log(res)
          if (res.data.code == 1) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              mark: true
            })
            wx.reLaunch({
              url: '/pages/wode/wode',
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              mark: true
            })
          }
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})