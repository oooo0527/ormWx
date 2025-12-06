// pages/selfListDetail/selfListDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 'published', // 默认显示发布的留言
    activePublishStatus: 'all', // 发布内容的状态筛选：all, success, fail, pending
    publishedSuccessList: [], // 发布成功的互动留言列表
    publishedFailList: [], // 发布失败的互动留言列表
    publishedPendingList: [], // 待审核的互动留言列表
    favoriteList: [], // 收藏的互动留言列表
    loading: false, // 是否正在加载
    hasMorePublished: true, // 是否还有更多发布的留言
    hasMoreFavorite: true, // 是否还有更多收藏的留言
    publishedPage: 0, // 发布留言的页码
    favoritePage: 0, // 收藏留言的页码
    pageSize: 10, // 每页数据条数

    // 滑动删除相关数据
    startX: 0,
    startY: 0,
    slideThreshold: 30, // 滑动阈值
    swipeWidth: 80 // 删除按钮宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.setData({
      publishedSuccessList: [],
      publishedFailList: [],
      publishedPendingList: [],
      favoriteList: [],
      publishedPage: 0,
      favoritePage: 0,
      hasMorePublished: true,
      hasMoreFavorite: true
    });
    this.onPullDownRefresh()

    // 页面显示时加载数据
    // this.loadPublishedInteractions();
    // this.loadFavoriteInteractions();
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
    // 下拉刷新
    this.setData({
      publishedSuccessList: [],
      publishedFailList: [],
      publishedPendingList: [],
      favoriteList: [],
      publishedPage: 0,
      favoritePage: 0,
      hasMorePublished: true,
      hasMoreFavorite: true
    });

    if (this.data.activeTab === 'published') {
      this.loadPublishedInteractions();
    } else {
      this.loadFavoriteInteractions();
    }

    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 上拉加载更多
    if (this.data.activeTab === 'published' && this.data.hasMorePublished) {
      this.loadPublishedInteractions();
    } else if (this.data.activeTab === 'favorite' && this.data.hasMoreFavorite) {
      this.loadFavoriteInteractions();
    }
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
    this.setData({
      activeTab: tab
    });

    // 如果切换到收藏标签且收藏列表为空，则加载收藏数据
    if (tab === 'favorite' && this.data.favoriteList.length === 0) {
      this.loadFavoriteInteractions();
    } else if (tab === 'published') {
      // 如果切换到发布标签且发布列表为空，则加载发布数据
      if (this.data.publishedSuccessList.length === 0 &&
        this.data.publishedFailList.length === 0 &&
        this.data.publishedPendingList.length === 0) {
        this.loadPublishedInteractions();
      }
    }
  },

  /**
   * 切换发布内容的状态筛选
   */
  switchPublishStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      activePublishStatus: status
    });
  },

  /**
   * 加载用户发布的互动留言
   */
  loadPublishedInteractions() {
    if (this.data.loading || !this.data.hasMorePublished) return;

    this.setData({
      loading: true
    });

    const page = this.data.publishedPage;
    const pageSize = this.data.pageSize;

    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getUserInteractions',
        skip: page * pageSize,
        limit: pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          // 分类处理发布的内容
          const successList = []; // status: '1' 审核通过
          const failList = [];    // status: '2' 审核拒绝
          const pendingList = []; // status: '0' 待审核

          res.result.data.forEach(item => {
            const listItem = {
              id: item._id,
              title: item.title,
              role: "用户互动",
              type: "互动",
              cover: item.images && item.images.length > 0 ? item.images[0] : "", // 使用第一张图片作为封面
              updateTime: item.updateTime || '',
              createDate: item.createDate || '',
              createTime: item.createTime || '',
              description: item.content,
              likes: 0,
              isLiked: false,
              comments: item.comments || [],
              creator: item.userInfo.userInfo && item.userInfo.userInfo.nickname ? item.userInfo.userInfo.nickname : (item.creator || '匿名用户'), // 使用用户信息中的昵称
              commentsCount: (item.comments || []).length,
              status: item.status || '0', // 添加状态字段
              rejectReason: item.rejectReason || '未知',
              images: item.images || [] // 添加图片信息
            };

            // 根据状态分类
            switch (item.status) {
              case '1': // 审核通过
                successList.push(listItem);
                break;
              case '2': // 审核拒绝
                failList.push(listItem);
                break;
              case '0': // 待审核
              default:
                pendingList.push(listItem);
                break;
            }
          });

          this.setData({
            publishedSuccessList: this.data.publishedSuccessList.concat(successList),
            publishedFailList: this.data.publishedFailList.concat(failList),
            publishedPendingList: this.data.publishedPendingList.concat(pendingList),
            publishedPage: page + 1,
            hasMorePublished: res.result.data.length === pageSize,
            loading: false
          });
        } else {
          console.error('获取发布的互动留言失败：', res.result.message);
          this.setData({
            loading: false
          });
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败：', err);
        this.setData({
          loading: false
        });
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 加载用户收藏的互动留言
   */
  loadFavoriteInteractions() {
    if (this.data.loading || !this.data.hasMoreFavorite) return;

    this.setData({
      loading: true
    });

    const page = this.data.favoritePage;
    const pageSize = this.data.pageSize;

    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getFavoriteList',
        skip: page * pageSize,
        limit: pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          console.log('获取收藏的互动留言成功：', res.result.data);
          const newList = res.result.data.map(item => {
            const interaction = item.interaction || {};
            return {
              id: interaction._id,
              title: interaction.title,
              role: "用户互动",
              type: "互动",
              cover: interaction.images && interaction.images.length > 0 ? interaction.images[0] : "", // 使用第一张图片作为封面
              updateTime: interaction.updateTime || '',
              createDate: interaction.createDate || '',
              createTime: interaction.createTime || '',
              description: interaction.content,
              likes: 0,
              isLiked: false,
              comments: interaction.comments || [],
              creator: interaction.userInfo.userInfo && interaction.userInfo.userInfo.nickname ? interaction.userInfo.userInfo.nickname : (interaction.creator || '匿名用户'), // 使用用户信息中的昵称
              commentsCount: (interaction.comments || []).length,
              interactionId: item.interactionId,
            };
          });

          this.setData({
            favoriteList: this.data.favoriteList.concat(newList),
            favoritePage: page + 1,
            hasMoreFavorite: newList.length === pageSize,
            loading: false
          });
        } else {
          console.error('获取收藏的互动留言失败：', res.result.message);
          this.setData({
            loading: false
          });
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败：', err);
        this.setData({
          loading: false
        });
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到互动留言详情页
   */
  goToDetail(e) {
    const index = e.currentTarget.dataset.index;
    const status = e.currentTarget.dataset.status || 'success'; // 默认为success
    let works = null;

    // 根据不同的状态获取对应的数据
    switch (status) {
      case 'success':
        works = this.data.publishedSuccessList[index];
        break;
      case 'fail':
        works = this.data.publishedFailList[index];
        break;
      case 'pending':
        works = this.data.publishedPendingList[index];
        break;
      default:
        // 全部状态下，需要确定是哪个列表的数据
        const allPublished = [
          ...this.data.publishedSuccessList,
          ...this.data.publishedFailList,
          ...this.data.publishedPendingList
        ];
        works = allPublished[index];
        break;
    }

    if (works) {
      wx.navigateTo({
        url: '/pages/interactionDetail/interactionDetail',
        success: (res) => {
          // 通过事件通道向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            works: works,
          });
        }
      });
    }
  },

  goToDetail1(e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/interactionDetail/interactionDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          works: this.data.favoriteList[index],
        });
      }
    });
  },

  /**
   * 编辑发布失败的留言
   */
  editFailedItem(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.publishedFailList[index];

    // 跳转到publish页面进行重新编辑
    wx.navigateTo({
      url: `/pages/publish/publish?id=${item.id}&title=${encodeURIComponent(item.title)}&content=${encodeURIComponent(item.description)}&images=${encodeURIComponent(JSON.stringify(item.images || []))}`,
    });
  },

  /**
   * 切换待审核留言的展开状态
   */
  togglePendingItem(e) {
    const index = e.currentTarget.dataset.index;
    const pendingList = this.data.publishedPendingList;

    // 切换展开状态
    pendingList[index].expanded = !pendingList[index].expanded;

    this.setData({
      publishedPendingList: pendingList
    });
  },

  /**
   * 取消收藏
   */
  unfavorite(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.favoriteList[index];

    wx.showModal({
      title: '确认取消收藏',
      content: '确定要取消收藏这条留言吗？',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'fanVoice',
            data: {
              action: 'unfavorite',
              interactionId: item.interactionId
            },
            success: res => {
              if (res.result && res.result.success) {
                wx.showToast({
                  title: '取消收藏成功',
                  icon: 'success'
                });

                // 从列表中移除
                const newList = this.data.favoriteList.filter((_, i) => i !== index);
                this.setData({
                  favoriteList: newList
                });
              } else {
                wx.showToast({
                  title: res.result.message || '取消收藏失败',
                  icon: 'none'
                });
              }
            },
            fail: err => {
              console.error('取消收藏失败：', err);
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

  /**
   * 滑动删除相关函数
   */
  onTouchStart(e) {
    const touch = e.touches[0];
    this.setData({
      startX: touch.clientX,
      startY: touch.clientY
    });
  },

  onTouchMove(e) {
    if (!this.data.startX || !this.data.startY) return;

    const touch = e.touches[0];
    const moveX = touch.clientX;
    const moveY = touch.clientY;
    const diffX = this.data.startX - moveX;
    const diffY = this.data.startY - moveY;

    // 判断是否为水平滑动
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.data.slideThreshold) {
      const index = e.currentTarget.dataset.index;
      const status = e.currentTarget.dataset.status;

      // 计算滑动偏移量
      let offset = -diffX;
      if (offset > 0) offset = 0;
      if (offset < -this.data.swipeWidth) offset = -this.data.swipeWidth;

      // 更新对应列表项的滑动偏移量
      this.updateSwipeOffset(index, status, offset);
    }
  },

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const diffX = this.data.startX - endX;
    const diffY = this.data.startY - endY;

    const index = e.currentTarget.dataset.index;
    const status = e.currentTarget.dataset.status;

    // 判断是否为水平滑动并且超过阈值
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.data.slideThreshold) {
      // 根据滑动方向决定是否完全展开删除按钮
      let offset = -this.data.swipeWidth;
      if (diffX < 0) {
        // 向右滑动，收起删除按钮
        offset = 0;
      }
      this.updateSwipeOffset(index, status, offset);
    } else {
      // 不满足条件，收起删除按钮
      this.updateSwipeOffset(index, status, 0);
    }

    // 重置起始坐标
    this.setData({
      startX: 0,
      startY: 0
    });
  },

  /**
   * 更新滑动偏移量
   */
  updateSwipeOffset(index, status, offset) {
    // 根据状态更新对应的列表
    switch (status) {
      case 'success':
        const successList = this.data.publishedSuccessList;
        if (successList[index]) {
          successList[index].swipeOffset = offset;
          this.setData({
            publishedSuccessList: successList
          });
        }
        break;
      case 'fail':
        const failList = this.data.publishedFailList;
        if (failList[index]) {
          failList[index].swipeOffset = offset;
          this.setData({
            publishedFailList: failList
          });
        }
        break;
      case 'pending':
        const pendingList = this.data.publishedPendingList;
        if (pendingList[index]) {
          pendingList[index].swipeOffset = offset;
          this.setData({
            publishedPendingList: pendingList
          });
        }
        break;
    }
  },

  /**
   * 删除留言
   */
  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    const status = e.currentTarget.dataset.status;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条留言吗？',
      success: res => {
        if (res.confirm) {
          // 获取要删除的留言ID
          let itemId = null;
          switch (status) {
            case 'success':
              itemId = this.data.publishedSuccessList[index].id;
              break;
            case 'fail':
              itemId = this.data.publishedFailList[index].id;
              break;
            case 'pending':
              itemId = this.data.publishedPendingList[index].id;
              break;
          }

          if (itemId) {
            // 调用云函数删除留言
            wx.cloud.callFunction({
              name: 'fanVoice',
              data: {
                action: 'delete',
                id: itemId
              },
              success: res => {
                if (res.result && res.result.success) {
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  });

                  // 从列表中移除
                  this.removeItemFromList(index, status);
                } else {
                  wx.showToast({
                    title: res.result.message || '删除失败',
                    icon: 'none'
                  });
                }
              },
              fail: err => {
                console.error('删除失败：', err);
                wx.showToast({
                  title: '网络错误',
                  icon: 'none'
                });
              }
            });
          }
        }
      }
    });
  },

  /**
   * 从列表中移除留言
   */
  removeItemFromList(index, status) {
    switch (status) {
      case 'success':
        const newSuccessList = this.data.publishedSuccessList.filter((_, i) => i !== index);
        this.setData({
          publishedSuccessList: newSuccessList
        });
        break;
      case 'fail':
        const newFailList = this.data.publishedFailList.filter((_, i) => i !== index);
        this.setData({
          publishedFailList: newFailList
        });
        break;
      case 'pending':
        const newPendingList = this.data.publishedPendingList.filter((_, i) => i !== index);
        this.setData({
          publishedPendingList: newPendingList
        });
        break;
    }
  }
})