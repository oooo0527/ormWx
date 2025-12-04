// packageA/waitProve/waitProve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 'status', // 当前激活的标签页 ('status' 或 'checked')
    pendingStatusList: [], // 待审核留言列表 (status='0')
    pendingCheckedList: [], // 待审核精选列表 (checked='1')
    isLoading: false // 是否正在加载数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时获取待审核数据
    this.getPendingApprovals();
  },

  /**
   * 获取待审核数据
   */
  getPendingApprovals() {
    wx.showLoading({
      title: '加载中...',
    });

    this.setData({
      isLoading: true
    });

    // 调用云函数获取待审核数据
    wx.cloud.callFunction({
      name: 'approve',
      data: {
        action: 'getPendingApprovals'
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          isLoading: false
        });

        if (res.result && res.result.success) {
          this.setData({
            pendingStatusList: res.result.data.pendingStatus,
            pendingCheckedList: res.result.data.pendingChecked
          });
        } else {
          wx.showToast({
            title: res.result ? res.result.message : '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        this.setData({
          isLoading: false
        });
        console.error('获取待审核数据失败', err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 切换标签页
   */
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  /**
   * 审核通过
   */
  onApprove(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type; // 'status' 或 'checked'

    wx.showModal({
      title: '确认审核通过',
      content: type === 'status' ? '确定要通过此留言的审核吗？' : '确定要将此留言设为精选吗？',
      success: res => {
        if (res.confirm) {
          this.updateApprovalStatus(id, type, 'approve');
        }
      }
    });
  },

  /**
   * 拒绝审核
   */
  onReject(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type; // 'status' 或 'checked'

    wx.showModal({
      title: '确认拒绝',
      content: type === 'status' ? '确定要拒绝此留言吗？' : '确定不将此留言设为精选吗？',
      success: res => {
        if (res.confirm) {
          this.updateApprovalStatus(id, type, 'reject');
        }
      }
    });
  },

  /**
   * 更新审核状态
   */
  updateApprovalStatus(id, type, action) {
    wx.showLoading({
      title: '处理中...',
    });

    // 调用云函数更新审核状态
    wx.cloud.callFunction({
      name: 'approve',
      data: {
        action: action === 'approve' ? 'approveInteraction' : 'rejectInteraction',
        id: id,
        type: type
      },
      success: res => {
        wx.hideLoading();

        if (res.result && res.result.success) {
          wx.showToast({
            title: action === 'approve' ? '审核通过' : '已拒绝',
            icon: 'success'
          });

          // 更新本地数据
          if (type === 'status') {
            // 从待审核留言列表中移除
            const newList = this.data.pendingStatusList.filter(item => item._id !== id);
            this.setData({
              pendingStatusList: newList
            });
          } else if (type === 'checked') {
            // 从待审核精选列表中移除
            const newList = this.data.pendingCheckedList.filter(item => item._id !== id);
            this.setData({
              pendingCheckedList: newList
            });
          }
        } else {
          wx.showToast({
            title: res.result ? res.result.message : '操作失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error('更新审核状态失败', err);
        wx.showToast({
          title: '网络请求失败',
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
    // 下拉刷新时重新获取数据
    this.getPendingApprovals();
    wx.stopPullDownRefresh();
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