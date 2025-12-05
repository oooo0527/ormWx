Page({
  data: {
    works: {},
    showFlag: false,

    // 评论数据 - 从云端获取
    comments: [],

    // 新评论内容
    newComment: "",

    // 回复相关
    isReplying: false,
    replyToCommentId: null,
    replyToNickname: "",
    newReply: "",

    // 收藏状态
    isFavorited: false
  },

  onLoad: function (options) {
    console.log('999999999999999999')
    if (!this.data.showFlag) {
      // 获取从上一页传递过来的数据
      const eventChannel = this.getOpenerEventChannel();
      console.log('eventChannel', eventChannel)
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        console.log('da ta', data)
        this.setData({
          works: data.works,
          showFlag: true
        }, () => {
          // 加载评论数据
          this.loadComments();
          // 检查是否已收藏
          this.checkFavoriteStatus();
        });
      });
    }
  },

  // 页面卸载时不需要停止轮询
  onUnload: function () {
    // 不需要做任何事情
  },

  // 页面隐藏时不需要停止轮询
  onHide: function () {
    // 不需要做任何事情
  },

  // 页面显示时不需要重新启动轮询
  onShow: function () {
    // 不需要做任何事情
  },

  // 检查收藏状态
  checkFavoriteStatus: function () {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    if (!userInfo) return;

    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getFavoriteList',
        skip: 0,
        limit: 100 // 获取较多数据以确保能找到
      },
      success: res => {
        if (res.result && res.result.success) {
          const isFavorited = res.result.data.some(item =>
            item.interactionId === (this.data.works.id || this.data.works._id)
          );
          this.setData({
            isFavorited: isFavorited
          });
        }
      },
      fail: err => {
        console.error('检查收藏状态失败：', err);
      }
    });
  },

  // 切换收藏状态
  toggleFavorite: function () {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    const interactionId = this.data.works.id || this.data.works._id;
    if (!interactionId) return;

    const action = this.data.isFavorited ? 'unfavorite' : 'favorite';
    const successMsg = this.data.isFavorited ? '取消收藏成功' : '收藏成功';

    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: action,
        interactionId: interactionId
      },
      success: res => {
        if (res.result && res.result.success) {
          wx.showToast({
            title: successMsg,
            icon: 'success'
          });
          this.setData({
            isFavorited: !this.data.isFavorited
          });
        } else {
          wx.showToast({
            title: res.result.message || '操作失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('收藏操作失败：', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  // 加载评论数据
  loadComments: function () {
    const selectedWork = this.data.works;
    if (selectedWork && selectedWork.comments) {
      // 将云端数据转换为页面所需格式
      const comments = selectedWork.comments.map((item, index) => {
        return {
          id: item._id || index,
          avatar: item.userInfo && item.userInfo.avatar ? item.userInfo.avatar : "/images/avatar-default.png",
          nickname: item.userInfo && item.userInfo.nickname ? item.userInfo.nickname : "用户" + (index + 1),
          content: item.content,
          createTime: item.createTime,
          createDate: item.createDate,
          likes: 0,
          isLiked: false,
          replies: [],

        }
      });
      const sortedComments2 = [...comments]
        .sort((a, b) =>
          new Date(`${b.createDate} ${b.createTime}`) -
          new Date(`${a.createDate} ${a.createTime}`)
        );
      this.setData({
        comments: sortedComments2
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
    console.log(this.data.works, 'this.data.work')

    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');

    // 调用云函数添加评论
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'addComment',
        interactionId: this.data.works.id || this.data.works._id,
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
            newComment: "",
            works: {
              ...this.data.works,
              comments: [...this.data.works.comments, res.result.data]
            }
          });
          console.log(this.data.works, 'ndsjkcnjdfnv')

          // 重新加载评论
          this.loadComments();

          // 同时更新当前作品的评论数据
          // this.refreshCurrentWorkComments();
        } else {
          wx.showToast({
            title: res.result.message || '评论失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('评论失败：', err);
        wx.showToast({
          title: '评论失败，请稍后再试',
          icon: 'none'
        });
      }
    });
  },

  // 刷新当前作品的评论数据
  refreshCurrentWorkComments: function () {
    // 重新获取当前作品的最新数据
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getInteractionById',
        id: this.data.works.id
      },
      success: res => {
        if (res.result && res.result.success && res.result.data) {
          const updatedWork = res.result.data;

          // 更新当前作品数据
          this.setData({
            works: updatedWork
          });

        }
      },
      fail: err => {
        console.error('刷新作品数据失败：', err);
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
        interactionId: this.data.works.id,
        createDate: new Date().toISOString().slice(0, 10), // 添加创建时间
        createTime: new Date().toLocaleTimeString(), // 添加创建时间
        content: `回复 @${this.data.replyToNickname}: ${this.data.newReply}`,
        userInfo: userInfo || {} // 添加用户信息
      },
      success: res => {
        console.log('res', res)
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
            newReply: "",
            works: {
              ...this.data.works,
              comments: [...this.data.works.comments, res.result.data]
            }
          });

          // 重新加载评论
          this.loadComments();

          // 同时更新当前作品的评论数据
          // this.refreshCurrentWorkComments();
        } else {
          wx.showToast({
            title: res.result.message || '回复失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('回复失败：', err);
        wx.showToast({
          title: '回复失败，请稍后再试',
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
              interactionId: this.data.works.id,
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

                // 同时更新当前作品的评论数据
                // this.refreshCurrentWorkComments();
              } else {
                wx.showToast({
                  title: res.result.message || '删除失败',
                  icon: 'none'
                });
              }
            },
            fail: err => {
              console.error('删除评论失败：', err);
              wx.showToast({
                title: '删除失败，请稍后再试',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  }
})