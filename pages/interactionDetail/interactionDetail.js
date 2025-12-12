import timeUtils from '../../utils/timeUtils.js';

Page({
  data: {
    works: {},
    showFlag: false,

    // 评论数据 - 从云端获取
    comments: [],

    // 新评论内容
    newComment: "",

    // 回复相关 - 修改为支持每个评论独立回复
    replyingToIndex: -1, // 当前正在回复的评论索引，-1表示没有正在回复的评论
    replyToCommentId: null,
    replyToNickname: "",
    newReply: "",

    // 回复的回复相关
    replyingToCommentIndex: -1, // 当前正在回复的评论索引
    replyingToReplyIndex: -1,   // 当前正在回复的回复索引
    replyToReplyId: null,       // 被回复的回复ID
    replyToReplyNickname: "",   // 被回复的回复昵称
    newReplyToReply: "",        // 回复的回复内容

    // 控制回复列表展开/收起状态
    expandedReplies: {},
    expandFlage: true,

    // 收藏状态
    isFavorited: false,

    // 高亮评论ID
    highlightCommentId: null,

    // 高亮回复ID
    highlightReplyId: null
  },

  /**
   * 页面滚动事件处理
   * 必须实现此方法以便自定义导航栏组件可以正确绑定滚动事件
   */
  onPageScroll: function (e) {
    // 空实现，但必须保留以便自定义导航栏组件可以绑定滚动事件
    // 实际的滚动处理由custom-navbar组件完成
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
          showFlag: true,
          highlightCommentId: data.highlightCommentId || null,  // 接收高亮评论ID
          highlightReplyId: data.highlightReplyId || null  // 接收高亮回复ID
        }, () => {
          // 加载评论数据
          this.loadComments();
          // 检查是否已收藏
          this.checkFavoriteStatus();
          // 高亮指定评论或回复
          if (this.data.highlightCommentId) {
            this.highlightComment(this.data.highlightCommentId);
          } else if (this.data.highlightReplyId) {
            this.highlightReply(this.data.highlightReplyId);
          }
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
      const sortedComments2 = [...selectedWork.comments]
        .sort((a, b) => {
          // 修复iOS日期格式兼容性问题
          const dateB = new Date(`${b.createDate}T${b.createTime}`);
          const dateA = new Date(`${a.createDate}T${a.createTime}`);
          return dateB - dateA;
        });
      this.setData({
        comments: sortedComments2
      }, () => {
        // 如果有需要高亮的评论或回复，则执行高亮操作
        if (this.data.highlightCommentId) {
          this.highlightComment(this.data.highlightCommentId);
        } else if (this.data.highlightReplyId) {
          this.highlightReply(this.data.highlightReplyId);
        }
      });
    }
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
        userInfo: userInfo || {}, // 添加用户信息
        createDate: timeUtils.getCurrentDate(),
        createTime: timeUtils.getCurrentTime(),
        updateTime: timeUtils.getCurrentTime()
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
          });
          // 同时更新当前作品的评论数据
          this.refreshCurrentWorkComments();
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
        id: this.data.works.id || this.data.works._id
      },
      success: res => {
        console.log('res', res)
        if (res.result && res.result.success && res.result.data) {
          const updatedWork = res.result.data;

          // 更新当前作品数据
          this.setData({
            works: updatedWork
          });
          // 重新加载评论
          this.loadComments();

        }
      },
      fail: err => {
        console.error('刷新作品数据失败：', err);
      }
    });
  },

  // 高亮指定评论
  highlightComment: function (commentId) {
    // 延迟一段时间确保DOM渲染完成
    setTimeout(() => {
      // 使用selector查询需要高亮的评论元素
      const query = wx.createSelectorQuery();
      query.select(`#comment-${commentId}`).boundingClientRect();
      query.exec((res) => {
        if (res[0]) {
          // 获取系统信息以计算屏幕高度
          wx.getSystemInfo({
            success: (sysInfo) => {
              // 计算将元素居中显示所需的滚动位置
              // scrollTop = 元素距离页面顶部的距离 - (屏幕高度 - 元素高度) / 2
              const scrollTop = res[0].top - (sysInfo.windowHeight - res[0].height) / 2;

              // 如果找到了元素，滚动到该元素位置
              wx.pageScrollTo({
                scrollTop: scrollTop,
                duration: 300
              });
            },
            fail: () => {
              // 如果获取系统信息失败，回退到原来的逻辑
              wx.pageScrollTo({
                scrollTop: res[0].top + 50, // 留出一些间距
                duration: 300
              });
            }
          });

          // 设置高亮状态
          this.setData({
            highlightCommentId: commentId
          });

          // 3秒后取消高亮
          setTimeout(() => {
            this.setData({
              highlightCommentId: null
            });
          }, 3000);
        }
      });
    }, 500);
  },

  // 高亮指定回复
  highlightReply: function (replyId) {
    console.log('highlightReply', replyId)
    // 延迟一段时间确保DOM渲染完成
    setTimeout(() => {
      // 使用selector查询需要高亮的回复元素
      const query = wx.createSelectorQuery();
      query.select(`#reply-${replyId}`).boundingClientRect();
      query.exec((res) => {
        if (res[0]) {
          console.log('res', res)
          // 获取系统信息以计算屏幕高度
          wx.getSystemInfo({
            success: (sysInfo) => {
              // 计算将元素居中显示所需的滚动位置
              // scrollTop = 元素距离页面顶部的距离 - (屏幕高度 - 元素高度) / 2
              const scrollTop = res[0].top - (sysInfo.windowHeight - res[0].height) / 2;

              // 如果找到了元素，滚动到该元素位置
              wx.pageScrollTo({
                scrollTop: scrollTop,
                duration: 300
              });
            },
            fail: () => {
              // 如果获取系统信息失败，回退到原来的逻辑
              wx.pageScrollTo({
                scrollTop: res[0].top + 200, // 留出一些间距
                duration: 300
              });
            }
          });

          // 设置高亮状态
          this.setData({
            highlightReplyId: replyId
          });

          // 3秒后取消高亮
          setTimeout(() => {
            this.setData({
              highlightReplyId: null
            });
          }, 3000);
        }
      });
    }, 500);
  },

  // 开始回复评论 - 修改为支持每个评论独立回复
  startReply: function (e) {
    const commentId = e.currentTarget.dataset.id;
    const nickname = e.currentTarget.dataset.nickname;
    const index = e.currentTarget.dataset.index; // 获取评论索引

    this.setData({
      replyingToIndex: index, // 设置正在回复的评论索引
      replyToCommentId: commentId,
      replyToNickname: nickname,
      newReply: "" // 清空之前的回复内容
    });
  },

  // 输入回复
  onReplyInput: function (e) {
    this.setData({
      newReply: e.detail.value
    });
  },

  // 提交回复 - 修改为支持每个评论独立回复
  submitReply: function (e) {
    // 获取当前评论的索引
    const index = e.currentTarget.dataset.index;

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
        action: 'addCommentReply',
        interactionId: this.data.works.id || this.data.works._id,
        commentId: this.data.replyToCommentId,
        content: `回复 @${this.data.replyToNickname}: ${this.data.newReply}`,
        userInfo: userInfo || {}, // 添加用户信息
        createDate: timeUtils.getCurrentDate(),
        createTime: timeUtils.getCurrentTime(),
        updateTime: timeUtils.getCurrentTime()
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
            replyingToIndex: -1, // 重置正在回复的评论索引
            replyToCommentId: null,
            replyToNickname: "",
            newReply: ""
          });

          // 重新加载评论
          this.loadComments();

          // 同时更新当前作品的评论数据
          this.refreshCurrentWorkComments();
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
      replyingToIndex: -1,
      replyToCommentId: null,
      replyToNickname: "",
      newReply: ""
    });
  },

  // 开始回复评论中的回复
  startReply1: function (e) {
    const replyId = e.currentTarget.dataset.id;
    const nickname = e.currentTarget.dataset.nickname;
    const commentIndex = e.currentTarget.dataset.index; // 评论索引
    const replyIndex = e.currentTarget.dataset.replyIndex; // 回复索引

    this.setData({
      replyingToCommentIndex: commentIndex,
      replyingToReplyIndex: replyIndex,
      replyToReplyId: replyId,
      replyToReplyNickname: nickname,
      newReplyToReply: "" // 清空之前的回复内容
    });
  },

  // 输入回复的回复
  onReplyToReplyInput: function (e) {
    this.setData({
      newReplyToReply: e.detail.value
    });
  },

  // 提交回复的回复
  submitReplyToReply: function (e) {
    const commentIndex = e.currentTarget.dataset.commentIndex;
    const replyIndex = e.currentTarget.dataset.replyIndex;
    const commentId = e.currentTarget.dataset.commentId;
    const replyId = e.currentTarget.dataset.replyId;

    if (!this.data.newReplyToReply.trim()) {
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
        action: 'addCommentReply',
        interactionId: this.data.works.id || this.data.works._id,
        commentId: commentId,
        replyToReplyId: replyId, // 添加这个参数用于识别回复目标
        content: `回复 @${this.data.replyToReplyNickname}: ${this.data.newReplyToReply}`,
        userInfo: userInfo || {}, // 添加用户信息
        createDate: timeUtils.getCurrentDate(),
        createTime: timeUtils.getCurrentTime(),
        updateTime: timeUtils.getCurrentTime()
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
            replyingToCommentIndex: -1,
            replyingToReplyIndex: -1,
            replyToReplyId: null,
            replyToReplyNickname: "",
            newReplyToReply: ""
          });

          // 重新加载评论
          this.loadComments();

          // 同时更新当前作品的评论数据
          this.refreshCurrentWorkComments();
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

  // 取消回复的回复
  cancelReplyToReply: function () {
    this.setData({
      replyingToCommentIndex: -1,
      replyingToReplyIndex: -1,
      replyToReplyId: null,
      replyToReplyNickname: "",
      newReplyToReply: ""
    });
  },

  // 展开/收起回复列表
  toggleReplies: function (e) {
    const commentIndex = e.currentTarget.dataset.commentIndex;
    const expandedReplies = this.data.expandedReplies;

    // 切换展开状态
    expandedReplies[commentIndex] = !expandedReplies[commentIndex];

    this.setData({
      expandedReplies: expandedReplies,
      expandFlage: !this.data.expandFlage
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