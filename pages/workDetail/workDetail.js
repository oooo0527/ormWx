Page({
  data: {
    work: {
      id: 0,
      title: "",
      role: "",
      type: "",
      cover: "",
      year: "",
      description: "",
      likes: 0,
      isLiked: false
    }
  },

  onLoad: function (options) {
    // 从上一个页面传递过来的作品数据
    if (options.work) {
      const work = JSON.parse(decodeURIComponent(options.work));
      this.setData({
        work: work
      });
    } else {
      // 如果没有传递作品数据，提供默认值
      this.setData({
        work: {
          id: 1,
          title: "默认作品",
          role: "默认角色",
          type: "电影",
          cover: "",
          year: "2024",
          description: "这是一个默认作品描述",
          likes: 0,
          isLiked: false
        }
      });
    }
  },

  // 返回上一页
  goBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  // 切换点赞状态
  toggleLike: function () {
    const currentWork = this.data.work;
    currentWork.isLiked = !currentWork.isLiked;
    currentWork.likes = currentWork.isLiked ? currentWork.likes + 1 : Math.max(0, currentWork.likes - 1);

    this.setData({
      work: currentWork
    });

    wx.showToast({
      title: currentWork.isLiked ? '已点赞' : '已取消点赞',
      icon: currentWork.isLiked ? 'success' : 'none'
    });
  },

  // 分享作品
  shareWork: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: () => {
        wx.showToast({
          title: '分享已打开',
          icon: 'success'
        });
      }
    });
  }
});