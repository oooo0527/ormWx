// pages/selfListDetail/selfListDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 'published', // 默认显示发布的留言
    publishedList: [], // 发布的互动留言列表
    favoriteList: [], // 收藏的互动留言列表
    loading: false, // 是否正在加载
    hasMorePublished: true, // 是否还有更多发布的留言
    hasMoreFavorite: true, // 是否还有更多收藏的留言
    publishedPage: 0, // 发布留言的页码
    favoritePage: 0, // 收藏留言的页码
    pageSize: 10 // 每页数据条数
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
      publishedList: [],
      favoriteList: [],
      publishedPage: 0,
      favoritePage: 0,
      hasMorePublished: true,
      hasMoreFavorite: true
    });
    // 页面显示时加载数据
    this.loadPublishedInteractions();
    this.loadFavoriteInteractions();
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
      publishedList: [],
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
    }
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
          const newList = res.result.data.map(item => {
            return {
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
              commentsCount: (item.comments || []).length
            };
          });

          this.setData({
            publishedList: this.data.publishedList.concat(newList),
            publishedPage: page + 1,
            hasMorePublished: newList.length === pageSize,
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
    wx.navigateTo({
      url: '/pages/interactionDetail/interactionDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          works: this.data.publishedList[index],
        });
      }
    });
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
  }
})