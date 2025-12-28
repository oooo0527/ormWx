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
    },

    // Tab相关
    activeTab: 'form', // 'form' or 'list'
    eventList: [],
    loading: false
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

  },

  // 切换tab
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });

    if (tab === 'list') {
      this.loadEventList();
    }
  },

  // 加载陈奥行程列表
  loadEventList: function () {
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'events',
      data: {
        action: 'getEvents'
      },
      success: res => {
        if (res.result.success) {
          this.setData({
            eventList: res.result.data || [],
            loading: false
          });
        } else {
          console.error('获取陈奥行程列表失败：', res.result.message);
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
          this.setData({
            loading: false
          });
        }
      },
      fail: err => {
        console.error('获取陈奥行程列表失败：', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        this.setData({
          loading: false
        });
      }
    });
  },

  // 删除陈奥行程
  deleteEvent: function (e) {
    const id = e.currentTarget.dataset.id;
    const title = e.currentTarget.dataset.title;

    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${title}"吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          });

          // 调用云函数删除数据
          wx.cloud.callFunction({
            name: 'events',
            data: {
              action: 'deleteEvent',
              id: id
            },
            success: res => {
              wx.hideLoading();
              if (res.result.success) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });

                // 重新加载列表
                this.loadEventList();
              } else {
                console.error('删除陈奥行程失败：', res.result.message);
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
              }
            },
            fail: err => {
              wx.hideLoading();
              console.error('删除陈奥行程失败：', err);
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 编辑陈奥行程
  editEvent: function (e) {
    const item = e.currentTarget.dataset.item;

    // 设置编辑状态
    this.setData({
      'newEvent.date': item.date || '',
      'newEvent.title': item.title || '',
      'newEvent.description': item.description || '',
      activeTab: 'form'
    });

    wx.showToast({
      title: '已切换到编辑模式',
      icon: 'none'
    });
  }
})