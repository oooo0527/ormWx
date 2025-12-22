// packageA/addEvent/addEvent.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newEvent: {
      date: '',
      title: '',
      description: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 输入框绑定事件
   */
  bindInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;

    this.setData({
      [`newEvent.${field}`]: value
    });
  },

  /**
   * 日期选择器绑定事件
   */
  bindDateChange(e) {
    this.setData({
      'newEvent.date': e.detail.value
    });
  },

  /**
   * 添加新事件
   */
  addEvent() {
    const { date, title, description } = this.data.newEvent;

    if (!date || !title || !description) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 调用云函数添加事件
    wx.cloud.callFunction({
      name: 'events',
      data: {
        action: 'addEvent',
        event: {
          date,
          title,
          description
        }
      },
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });

          // 清空表单
          this.setData({
            newEvent: {
              date: '',
              title: '',
              description: ''
            }
          });

          // 返回上一页
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: '添加失败: ' + res.result.message,
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('添加事件失败:', err);
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        });
      }
    });
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

  }
})