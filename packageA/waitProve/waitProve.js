// packageA/waitProve/waitProve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 'status', // 当前激活的标签页 ('status' 或 'checked')
    pendingStatusList: [], // 待审核留言列表 (status='0')
    pendingCheckedList: [], // 待审核精选列表 (checked='1')
    isLoading: false, // 是否正在加载数据

    // 拒绝理由相关数据
    showRejectModal: false, // 是否显示拒绝理由弹窗
    rejectReasons: [
      { value: 'inappropriate', text: '内容不当', checked: true },
      { value: 'spam', text: '垃圾信息', checked: false },
      { value: 'duplicate', text: '重复内容', checked: false },
      { value: 'other', text: '其他原因', checked: false }
    ],
    selectedReason: 'inappropriate', // 默认选中的拒绝理由
    otherReason: '', // 其他原因输入框的内容
    currentRejectId: null, // 当前拒绝的项目ID
    currentRejectType: null // 当前拒绝的项目类型
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
          // 为每个项目添加展开状态属性
          const pendingStatusList = res.result.data.pendingStatus.map(item => {
            return {
              ...item,
              isExpanded: false
            };
          });

          const pendingCheckedList = res.result.data.pendingChecked.map(item => {
            return {
              ...item,
              isExpanded: false
            };
          });

          this.setData({
            pendingStatusList: pendingStatusList,
            pendingCheckedList: pendingCheckedList
          });

          // 添加成功提示
          if (pendingStatusList.length > 0 || pendingCheckedList.length > 0) {
            wx.showToast({
              title: '数据加载成功',
              icon: 'success',
              duration: 1000
            });
          }
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

    // 添加切换动画效果
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  /**
   * 切换内容展开/收起状态
   */
  toggleContent(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type; // 'status' 或 'checked'

    if (type === 'status') {
      const pendingStatusList = this.data.pendingStatusList.map(item => {
        if (item._id === id) {
          return {
            ...item,
            isExpanded: !item.isExpanded
          };
        }
        return item;
      });

      this.setData({
        pendingStatusList: pendingStatusList
      });
    } else if (type === 'checked') {
      const pendingCheckedList = this.data.pendingCheckedList.map(item => {
        if (item._id === id) {
          return {
            ...item,
            isExpanded: !item.isExpanded
          };
        }
        return item;
      });

      this.setData({
        pendingCheckedList: pendingCheckedList
      });
    }
  },

  /**
   * 显示拒绝理由选择弹窗
   */
  showRejectReasonModal(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type; // 'status' 或 'checked'

    // 重置拒绝理由选项
    const rejectReasons = this.data.rejectReasons.map((item, index) => {
      return {
        ...item,
        checked: index === 0 // 默认选中第一个选项
      };
    });

    this.setData({
      showRejectModal: true,
      currentRejectId: id,
      currentRejectType: type,
      rejectReasons: rejectReasons,
      selectedReason: 'inappropriate',
      otherReason: ''
    });
  },

  /**
   * 隐藏拒绝理由选择弹窗
   */
  hideRejectModal() {
    this.setData({
      showRejectModal: false,
      currentRejectId: null,
      currentRejectType: null,
      selectedReason: 'inappropriate',
      otherReason: ''
    });
  },

  /**
   * 拒绝理由选项改变
   */
  onReasonChange(e) {
    this.setData({
      selectedReason: e.detail.value
    });
  },

  /**
   * 其他原因输入框输入事件
   */
  onOtherReasonInput(e) {
    this.setData({
      otherReason: e.detail.value
    });
  },

  /**
   * 确认拒绝
   */
  confirmReject() {
    const { currentRejectId, currentRejectType, selectedReason, otherReason, rejectReasons } = this.data;

    // 获取选中的拒绝理由文本
    let reasonText = '';
    const reasonObj = rejectReasons.find(item => item.value === selectedReason);
    if (reasonObj) {
      reasonText = reasonObj.text;
    }

    // 如果选择了"其他原因"，则使用输入的文本
    if (selectedReason === 'other' && otherReason.trim()) {
      reasonText = otherReason.trim();
    }

    // 如果没有输入其他原因，则提示
    if (selectedReason === 'other' && !otherReason.trim()) {
      wx.showToast({
        title: '请输入拒绝理由',
        icon: 'none'
      });
      return;
    }

    // 隐藏弹窗
    this.hideRejectModal();

    // 执行拒绝操作
    wx.showModal({
      title: '确认拒绝',
      content: `确定要拒绝此${currentRejectType === 'status' ? '留言' : '精选'}吗？\n拒绝理由：${reasonText}`,
      confirmColor: '#f48eb5',
      success: res => {
        if (res.confirm) {
          this.updateApprovalStatus(currentRejectId, currentRejectType, 'reject', reasonText);
        }
      }
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
      confirmColor: '#4cd964',
      success: res => {
        if (res.confirm) {
          this.updateApprovalStatus(id, type, 'approve');
        }
      }
    });
  },

  /**
   * 更新审核状态
   */
  updateApprovalStatus(id, type, action, reason = '') {
    wx.showLoading({
      title: '处理中...',
    });

    // 调用云函数更新审核状态
    wx.cloud.callFunction({
      name: 'approve',
      data: {
        action: action === 'approve' ? 'approveInteraction' : 'rejectInteraction',
        id: id,
        type: type,
        reason: reason // 传递拒绝理由
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

            // 如果列表为空，显示提示
            if (newList.length === 0 && this.data.activeTab === 'status') {
              wx.showToast({
                title: '暂无待审核留言',
                icon: 'none',
                duration: 2000
              });
            }
          } else if (type === 'checked') {
            // 从待审核精选列表中移除
            const newList = this.data.pendingCheckedList.filter(item => item._id !== id);
            this.setData({
              pendingCheckedList: newList
            });

            // 如果列表为空，显示提示
            if (newList.length === 0 && this.data.activeTab === 'checked') {
              wx.showToast({
                title: '暂无待审核精选',
                icon: 'none',
                duration: 2000
              });
            }
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