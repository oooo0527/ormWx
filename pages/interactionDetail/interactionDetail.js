Page({
  data: {
    currentSlide: 0,
    selectedWork: null,
    works: [],

    // 评论数据 - 从云端获取
    comments: [],

    // 新评论内容
    newComment: "",

    // 回复相关
    isReplying: false,
    replyToCommentId: null,
    replyToNickname: "",
    newReply: ""
  },

  onLoad: function (options) {
    // 初始化云数据库
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    // 获取从上一页传递过来的数据
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.setData({
        works: data.works,
        currentSlide: data.currentIndex,
        selectedWork: data.works[data.currentIndex]
      }, () => {
        // 加载评论数据
        this.loadComments();
      });
    });
  },

  // 加载评论数据
  loadComments: function () {
    const selectedWork = this.data.selectedWork;
    if (selectedWork && selectedWork.comments) {
      // 将云端数据转换为页面所需格式
      const comments = selectedWork.comments.map((item, index) => {
        return {
          id: item._id || index,
          avatar: item.userInfo.userInfo && item.userInfo.userInfo.avatar ? item.userInfo.userInfo.avatar : "/images/avatar-default.png",
          nickname: item.userInfo.userInfo && item.userInfo.userInfo.nickname ? item.userInfo.userInfo.nickname : "用户" + (index + 1),
          content: item.content,
          time: this.formatTime(item.createTime),
          likes: 0,
          isLiked: false,
          replies: []
        }
      });

      this.setData({
        comments: comments
      });
    }
  },

  // 格式化时间
  formatTime: function (time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 返回作品列表
  backToList: function () {
    wx.navigateBack();
  },

  // 轮播图切换事件
  onSwiperChange: function (e) {
    const current = e.detail.current;
    this.setData({
      currentSlide: current,
      selectedWork: this.data.works[current]
    }, () => {
      // 切换作品时重新加载评论
      this.loadComments();
    });
  },

  // 轮播图图片点击事件
  onSwiperImageTap: function (e) {
    // 可以在这里添加点击图片的处理逻辑
    console.log("点击了轮播图图片");
  },

  // 点赞功能
  toggleLike: function (e) {
    const works = this.data.works;
    const currentSlide = this.data.currentSlide;
    const work = works[currentSlide];

    // 更新点赞状态
    work.isLiked = !work.isLiked;
    work.likes += work.isLiked ? 1 : -1;

    // 更新数据
    const newWorks = [...works];
    newWorks[currentSlide] = work;

    this.setData({
      works: newWorks,
      selectedWork: work
    });
  },

  // 评论点赞功能
  toggleCommentLike: function (e) {
    const commentId = e.currentTarget.dataset.id;
    const comments = this.data.comments;

    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
      comments[commentIndex].isLiked = !comments[commentIndex].isLiked;
      comments[commentIndex].likes += comments[commentIndex].isLiked ? 1 : -1;

      this.setData({
        comments: comments
      });
    }
  },

  // 输入评论
  onCommentInput: function (e) {
    this.setData({
      newComment: e.detail.value
    });
  },

  // 提交评论
  submitComment: function () {
    if (!this.data.newComment.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }

    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');

    // 调用云函数添加评论
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'addComment',
        interactionId: this.data.selectedWork.id,
        content: this.data.newComment,
        userInfo: userInfo || {} // 添加用户信息
      },
      success: res => {
        if (res.result && res.result.success) {
          wx.showToast({
            title: '评论成功',
            icon: 'success'
          });

          // 清空输入框
          this.setData({
            newComment: ""
          });

          // 重新加载评论
          this.loadComments();
        } else {
          wx.showToast({
            title: '评论失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('评论失败：', err);
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        });
      }
    });
  },

  // 开始回复评论
  startReply: function (e) {
    const commentId = e.currentTarget.dataset.id;
    const nickname = e.currentTarget.dataset.nickname;

    this.setData({
      isReplying: true,
      replyToCommentId: commentId,
      replyToNickname: nickname
    });
  },

  // 输入回复
  onReplyInput: function (e) {
    this.setData({
      newReply: e.detail.value
    });
  },

  // 提交回复
  submitReply: function () {
    if (!this.data.newReply.trim()) {
      wx.showToast({
        title: '请输入回复内容',
        icon: 'none'
      });
      return;
    }

    // 获取用户信息
    const app = getApp();
    const userInfo = app.globalData.userInfo;

    // 调用云函数添加回复（这里简化处理，实际应该有专门的回复数据结构）
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'addComment',
        interactionId: this.data.selectedWork.id,
        content: `回复 @${this.data.replyToNickname}: ${this.data.newReply}`,
        userInfo: userInfo || {} // 添加用户信息
      },
      success: res => {
        if (res.result && res.result.success) {
          wx.showToast({
            title: '回复成功',
            icon: 'success'
          });

          // 重置回复状态
          this.setData({
            isReplying: false,
            replyToCommentId: null,
            replyToNickname: "",
            newReply: ""
          });

          // 重新加载评论
          this.loadComments();
        } else {
          wx.showToast({
            title: '回复失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('回复失败：', err);
        wx.showToast({
          title: '回复失败',
          icon: 'none'
        });
      }
    });
  },

  // 取消回复
  cancelReply: function () {
    this.setData({
      isReplying: false,
      replyToCommentId: null,
      replyToNickname: "",
      newReply: ""
    });
  },

  // 删除评论
  deleteComment: function (e) {
    const commentId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条评论吗？',
      success: res => {
        if (res.confirm) {
          // 调用云函数删除评论
          wx.cloud.callFunction({
            name: 'fanVoice',
            data: {
              action: 'deleteComment',
              interactionId: this.data.selectedWork.id,
              commentId: commentId
            },
            success: res => {
              if (res.result && res.result.success) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });

                // 重新加载评论
                this.loadComments();
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
              }
            },
            fail: err => {
              console.error('删除评论失败：', err);
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 获取当前时间
  getCurrentTime: function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});