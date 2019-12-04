// pages/jianli/jianli.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data_url = 'https://www.uear.net/fileresume/tmp_e347ef86f40cb304fcde1bfd94573952.doc'
    var data_type = data_url.split('.')[3]
    wx.downloadFile({
      url: data_url, // 可以是后台返回的地址。这里写的是死的
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath; // 小程序中文件的临时文件
        wx.openDocument({
          filePath: filePath,
          // 文档打开格式记得写上，否则可能不能打开文档。 文档类型只能是一个
          // 若是想打开多种类型的文档，可以解析文档地址中的文档格式，动态复制到fileTpye参数
          fileType: data_type,
          success: function (res) {
          
          },
          fail: (e) => {
            console.log(e);
          }
        })
      }
    })
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