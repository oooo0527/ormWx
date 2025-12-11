// packageA/noteList/noteList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1, // 当前选中的标签页
    commentNotifications: [], // 评论消息列表
    replyNotifications: [],   // 回复消息列表
    announcementNotifications: [], // 公告消息列表
    unreadCommentCount: 0, // 未读评论数量
    unreadReplyCount: 0    // 未读回复数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时获取消息数据
    this.loadNotifications();
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
    // 每次显示页面时重新加载消息数据
    this.loadNotifications();
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
    // 下拉刷新时重新加载消息数据
    this.loadNotifications(() => {
      wx.stopPullDownRefresh();
    });
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

  /**
   * 切换标签页
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    console.log('切换标签页:', tab); // 添加日志以便调试

    this.setData({
      currentTab: parseInt(tab)
    });

    // 如果切换到评论或回复标签页，刷新未读消息数量
    if (tab === '1' || tab === '2') {
      this.loadNotifications();
    }
  },

  /**
   * 加载消息数据 - 增强版本，支持缓存机制
   */
  loadNotifications(callback) {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      console.error('未获取到用户信息');
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    // 检查是否有缓存数据且未过期（5分钟内）
    const cachedData = this.getCachedNotifications();
    if (cachedData && !this.isCacheExpired(cachedData.timestamp)) {
      console.log('使用缓存数据');
      // 使用缓存数据更新页面
      this.setData({
        commentNotifications: cachedData.commentNotifications,
        replyNotifications: cachedData.replyNotifications,
        announcementNotifications: cachedData.announcementNotifications,
        unreadCommentCount: cachedData.unreadCommentCount || 0,
        unreadReplyCount: cachedData.unreadReplyCount || 0
      });

      // 执行回调函数（如果有）
      if (callback && typeof callback === 'function') {
        callback();
      }

      // 异步更新缓存数据（不影响当前显示）
      this.fetchAndCacheNotifications(userInfo);
      return;
    }

    // 没有有效缓存，显示加载提示并从服务器获取数据
    wx.showLoading({
      title: '加载中...'
    });

    // 并行调用云函数获取不同类型的消息
    Promise.all([
      // 获取评论消息
      this.getCommentNotifications(userInfo.openid),
      // 获取回复消息
      this.getReplyNotifications(userInfo.openid),
      // 获取公告消息（这里模拟数据，实际应从数据库获取）
      this.getAnnouncementNotifications()
    ]).then(results => {
      // 隐藏加载提示
      wx.hideLoading();

      // 设置数据
      const newData = {
        commentNotifications: results[0].notifications,
        replyNotifications: results[1].notifications,
        announcementNotifications: results[2],
        unreadCommentCount: results[0].unreadCount || 0,
        unreadReplyCount: results[1].unreadCount || 0
      };

      this.setData(newData);

      // 缓存数据
      this.cacheNotifications(newData);

      // 执行回调函数（如果有）
      if (callback && typeof callback === 'function') {
        callback();
      }
    }).catch(err => {
      // 隐藏加载提示
      wx.hideLoading();

      console.error('加载消息失败：', err);
      wx.showToast({
        title: '加载消息失败，请稍后再试',
        icon: 'none'
      });

      // 执行回调函数（如果有）
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  },

  /**
   * 获取评论消息
   */
  getCommentNotifications(userId) {
    return new Promise((resolve, reject) => {
      // 修改为调用新的getUserComments云函数
      wx.cloud.callFunction({
        name: 'fanVoice',
        data: {
          action: 'getUserComments',
          skip: 0,
          limit: 20
        },
        success: res => {
          if (res.result && res.result.success) {
            // 处理评论通知数据
            const notifications = res.result.data.map(comment => {
              // 返回通知对象
              return {
                ...comment,
                notes: `"${comment.userInfo.nickname}" 评论了你的留言"${comment.interactionTitle}"：${comment.content}`
              };
            });

            resolve({
              notifications: notifications,
              unreadCount: res.result.unreadCount || 0
            });
          } else {
            reject(new Error(res.result.message || '获取评论消息失败'));
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  },

  /**
   * 获取回复消息
   */
  getReplyNotifications(userId) {
    return new Promise((resolve, reject) => {
      // 修改为调用新的getUserReplyNotifications云函数
      wx.cloud.callFunction({
        name: 'fanVoice',
        data: {
          action: 'getUserReplyNotifications',
          skip: 0,
          limit: 20
        },
        success: res => {
          if (res.result && res.result.success) {
            // 处理回复通知数据
            const notifications = res.result.data.map(reply => {
              return {
                ...reply,
                notes: `"${reply.userInfo.nickname}" 在留言"${reply.interactionTitle}"中回复了你：${reply.content}`,
              };
            });

            resolve({
              notifications: notifications,
              unreadCount: res.result.unreadCount || 0
            });
          } else {
            reject(new Error(res.result.message || '获取回复消息失败'));
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  },

  /**
   * 获取公告消息
   */
  getAnnouncementNotifications() {
    return new Promise((resolve, reject) => {
      // 这里需要一个专门的云函数来获取公告消息
      // 由于当前云函数没有提供此功能，暂时模拟数据
      // 在实际开发中，应该有一个云函数可以查询公告信息

      // 模拟数据
      const notifications = [
        {
          id: '1',
          adminName: '系统管理员',
          adminAvatar: '/images/admin-avatar.png',
          title: '系统维护通知',
          content: '系统将于今晚00:00-02:00进行维护，期间可能会出现服务不稳定的情况，请大家谅解。',
          time: '2023-05-15'
        },
        {
          id: '2',
          adminName: '运营团队',
          adminAvatar: '/images/admin-avatar.png',
          title: '新功能上线',
          content: '我们上线了全新的消息中心功能，欢迎大家体验并提出宝贵意见！',
          time: '2023-05-10'
        }
      ];

      resolve(notifications);
    });
  },

  /**
   * 跳转到评论详情
   */
  navigateToComment(e) {
    const index = e.currentTarget.dataset.index;
    const comment = this.data.commentNotifications[index];
    console.log('查看评论详情，索引:', index, comment);

    // 更新评论为已读
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'markCommentAsRead',
        commentId: comment._id
      },
      success: res => {
        if (res.result && res.result.success) {
          console.log('评论标记为已读成功');
          // 更新本地数据状态
          const commentNotifications = this.data.commentNotifications;
          commentNotifications[index].read = true;
          this.setData({
            commentNotifications: commentNotifications
          });

          // 更新缓存
          this.cacheNotifications({
            commentNotifications: commentNotifications,
            replyNotifications: this.data.replyNotifications,
            announcementNotifications: this.data.announcementNotifications,
            unreadCommentCount: Math.max(0, this.data.unreadCommentCount - 1),
            unreadReplyCount: this.data.unreadReplyCount
          });
        } else {
          console.error('标记评论为已读失败：', res.result.message);
        }
      },
      fail: err => {
        console.error('标记评论为已读失败：', err);
      }
    });

    // 获取完整的互动留言数据，然后跳转到详情页
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getInteractionById',
        id: comment.interactionId
      },
      success: res => {
        if (res.result && res.result.success && res.result.data) {
          wx.navigateTo({
            url: '/pages/interactionDetail/interactionDetail',
            success: (navRes) => {
              // 通过事件通道向被打开页面传送数据
              navRes.eventChannel.emit('acceptDataFromOpenerPage', {
                works: res.result.data,
                highlightCommentId: comment.commentId  // 传递需要高亮的评论ID
              });
            }
          });
        } else {
          wx.showToast({
            title: '获取留言详情失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('获取留言详情失败：', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到回复详情
   */
  navigateToReply(e) {
    const index = e.currentTarget.dataset.index;
    const reply = this.data.replyNotifications[index];
    console.log('查看回复详情，索引:', index, reply);

    // 更新回复为已读
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'markReplyAsRead',
        replyId: reply._id
      },
      success: res => {
        if (res.result && res.result.success) {
          console.log('回复标记为已读成功');
          // 更新本地数据状态
          const replyNotifications = this.data.replyNotifications;
          replyNotifications[index].read = true;
          this.setData({
            replyNotifications: replyNotifications
          });

          // 更新缓存
          this.cacheNotifications({
            commentNotifications: this.data.commentNotifications,
            replyNotifications: replyNotifications,
            announcementNotifications: this.data.announcementNotifications,
            unreadCommentCount: this.data.unreadCommentCount,
            unreadReplyCount: Math.max(0, this.data.unreadReplyCount - 1)
          });
        } else {
          console.error('标记回复为已读失败：', res.result.message);
        }
      },
      fail: err => {
        console.error('标记回复为已读失败：', err);
      }
    });

    // 根据回复中的interactionId获取完整的互动留言数据，然后跳转到详情页
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getInteractionById',
        id: reply.interactionId
      },
      success: res => {
        if (res.result && res.result.success && res.result.data) {
          wx.navigateTo({
            url: '/pages/interactionDetail/interactionDetail',
            success: (navRes) => {
              // 通过事件通道向被打开页面传送数据
              navRes.eventChannel.emit('acceptDataFromOpenerPage', {
                works: res.result.data,
                highlightReplyId: reply.replyId || reply.commentId  // 传递需要高亮的回复ID
              });
            }
          });
        } else {
          wx.showToast({
            title: '获取留言详情失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('获取留言详情失败：', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到公告详情
   */
  navigateToAnnouncement(e) {
    const id = e.currentTarget.dataset.id;
    console.log('查看公告详情，ID:', id);
    // 这里可以跳转到具体的公告详情页面
    // wx.navigateTo({
    //   url: `/pages/announcementDetail/announcementDetail?id=${id}`
    // });
  },

  /**
   * 缓存通知数据
   */
  cacheNotifications(data) {
    const cacheData = {
      ...data,
      timestamp: Date.now() // 添加时间戳
    };
    try {
      wx.setStorageSync('notificationCache', cacheData);
      console.log('通知数据已缓存');
    } catch (e) {
      console.error('缓存通知数据失败：', e);
    }
  },

  /**
   * 获取缓存的通知数据
   */
  getCachedNotifications() {
    try {
      const cacheData = wx.getStorageSync('notificationCache');
      return cacheData || null;
    } catch (e) {
      console.error('获取缓存通知数据失败：', e);
      return null;
    }
  },

  /**
   * 检查缓存是否过期（5分钟有效期）
   */
  isCacheExpired(timestamp) {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5分钟毫秒数
    return (now - timestamp) > fiveMinutes;
  },

  /**
   * 异步获取并缓存最新的通知数据
   */
  fetchAndCacheNotifications(userInfo) {
    // 并行调用云函数获取最新数据
    Promise.all([
      this.getCommentNotifications(userInfo.openid),
      this.getReplyNotifications(userInfo.openid),
      this.getAnnouncementNotifications()
    ]).then(results => {
      // 更新缓存
      const newData = {
        commentNotifications: results[0].notifications,
        replyNotifications: results[1].notifications,
        announcementNotifications: results[2],
        unreadCommentCount: results[0].unreadCount || 0,
        unreadReplyCount: results[1].unreadCount || 0,
        timestamp: Date.now() // 更新时间戳
      };

      try {
        wx.setStorageSync('notificationCache', newData);
        console.log('缓存数据已更新');
      } catch (e) {
        console.error('更新缓存数据失败：', e);
      }
    }).catch(err => {
      console.error('异步更新缓存数据失败：', err);
    });
  }
});