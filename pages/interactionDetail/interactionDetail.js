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
    highlightReplyId: null,

    // 批量提交队列
    commentQueue: [], // 评论队列
    replyQueue: []    // 回复队列
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

    // 启动批量提交定时器
    this.startBatchSubmitTimer();
  },

  // 页面卸载时清理定时器
  onUnload: function () {
    // 停止批量提交定时器
    this.stopBatchSubmitTimer();

    // 在离开页面前提交所有未提交的操作
    this.submitAllPendingOperations();
  },

  // 页面隐藏时不需要停止轮询
  onHide: function () {
    // 不需要做任何事情
  },

  // 页面显示时不需要重新启动轮询
  onShow: function () {
    // 不需要做任何事情
  },

  // 启动批量提交定时器
  startBatchSubmitTimer: function () {
    // 每30秒检查一次是否有待提交的操作
    this.batchSubmitTimer = setInterval(() => {
      this.processBatchSubmit();
    }, 30000); // 30秒
  },

  // 停止批量提交定时器
  stopBatchSubmitTimer: function () {
    if (this.batchSubmitTimer) {
      clearInterval(this.batchSubmitTimer);
      this.batchSubmitTimer = null;
    }
  },

  // 处理批量提交
  processBatchSubmit: function () {
    const { commentQueue, replyQueue } = this.data;

    // 如果有待提交的评论
    if (commentQueue.length > 0) {
      this.submitCommentBatch(commentQueue);
    }

    // 如果有待提交的回复
    if (replyQueue.length > 0) {
      this.submitReplyBatch(replyQueue);
    }
  },

  // 提交所有未提交的操作
  submitAllPendingOperations: function () {
    const { commentQueue, replyQueue } = this.data;

    // 提交所有待提交的评论
    if (commentQueue.length > 0) {
      this.submitCommentBatch(commentQueue);
    }

    // 提交所有待提交的回复
    if (replyQueue.length > 0) {
      this.submitReplyBatch(replyQueue);
    }
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
      // 获取当前页面上的本地评论
      const localComments = this.data.comments.filter(comment => comment.isLocal);

      // 合并服务器评论和本地评论
      let allComments = [...selectedWork.comments];

      // 将本地评论添加到列表开头
      allComments = [...localComments, ...allComments];

      // 对所有评论进行排序
      const sortedComments = [...allComments]
        .sort((a, b) => {
          // 修复iOS日期格式兼容性问题
          const dateB = new Date(`${b.createDate}T${b.createTime}`);
          const dateA = new Date(`${a.createDate}T${a.createTime}`);
          return dateB - dateA;
        });

      this.setData({
        comments: sortedComments
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

  // 提交评论（加入队列）
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

    // 创建评论对象
    const commentObj = {
      content: this.data.newComment,
      userId: userInfo.openid || '', // 添加用户ID
      userInfo: userInfo || {}, // 添加用户信息
      createTime: timeUtils.getCurrentTime(),
      createDate: timeUtils.getCurrentDate(),
      commentId: 'temp_' + Date.now(), // 临时ID用于本地显示
      isLocal: true // 标记为本地评论
    };

    // 立即在页面上显示自己的评论
    const updatedComments = [...this.data.comments];
    updatedComments.unshift(commentObj); // 将新评论添加到列表顶部

    // 将评论添加到队列
    const newQueue = [...this.data.commentQueue, {
      interactionId: this.data.works.id || this.data.works._id,
      content: this.data.newComment,
      userInfo: userInfo || {},
      createDate: timeUtils.getCurrentDate(),
      createTime: timeUtils.getCurrentTime(),
      updateTime: timeUtils.getCurrentTime()
    }];

    this.setData({
      comments: updatedComments, // 立即更新页面显示
      commentQueue: newQueue,
      newComment: "" // 清空输入框
    });

    // 如果队列长度达到5条，立即提交
    if (newQueue.length >= 5) {
      this.submitCommentBatch(newQueue);
      // 清空队列
      this.setData({
        commentQueue: []
      });
    }
    // 不再显示提示信息

    // 同时更新当前作品的评论数据
    this.refreshCurrentWorkComments();
  },

  // 批量提交评论
  submitCommentBatch: function (queue) {
    if (queue.length === 0) return;

    // 不再显示loading提示

    // 调用云函数批量添加评论
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'addCommentsBatch', // 新增批量添加评论的云函数
        comments: queue
      },
      success: res => {
        // 不再显示成功提示
        if (res.result && res.result.success) {
          // 清空队列
          this.setData({
            commentQueue: []
          });

          // 同时更新当前作品的评论数据
          this.refreshCurrentWorkComments();
        } else {
          // 不再显示失败提示
        }
      },
      fail: err => {
        console.error('评论提交失败：', err);
        // 不再显示失败提示
      }
    });
  },

  // 刷新当前作品的评论数据
  refreshCurrentWorkComments: function () {
    // 保存当前的本地评论
    const localComments = this.data.comments.filter(comment => comment.isLocal);

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
          // 重新加载评论，同时保留本地评论
          this.loadCommentsWithLocal(localComments);
        }
      },
      fail: err => {
        console.error('刷新作品数据失败：', err);
      }
    });
  },

  // 带本地评论的加载评论数据
  loadCommentsWithLocal: function (localComments) {
    const selectedWork = this.data.works;
    if (selectedWork && selectedWork.comments) {
      // 合并服务器评论和本地评论
      let allComments = [...selectedWork.comments];

      // 将本地评论添加到列表开头
      allComments = [...localComments, ...allComments];

      // 对所有评论进行排序
      const sortedComments = [...allComments]
        .sort((a, b) => {
          // 修复iOS日期格式兼容性问题
          const dateB = new Date(`${b.createDate}T${b.createTime}`);
          const dateA = new Date(`${a.createDate}T${a.createTime}`);
          return dateB - dateA;
        });

      this.setData({
        comments: sortedComments
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

  // 提交回复 - 修改为支持每个评论独立回复（加入队列）
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

    // 创建回复对象
    const replyObj = {
      content: `回复 @${this.data.replyToNickname}: ${this.data.newReply}`,
      userId: userInfo.openid || '',
      userInfo: userInfo || {},
      createTime: timeUtils.getCurrentTime(),
      createDate: timeUtils.getCurrentDate(),
      id: 'temp_reply_' + Date.now(), // 临时ID用于本地显示
      isLocal: true // 标记为本地回复
    };

    // 立即在页面上显示自己的回复
    const updatedComments = [...this.data.comments];
    if (!updatedComments[index].replies) {
      updatedComments[index].replies = [];
    }
    updatedComments[index].replies.push(replyObj);

    // 将回复添加到队列
    const newQueue = [...this.data.replyQueue, {
      interactionId: this.data.works.id || this.data.works._id,
      commentId: this.data.replyToCommentId,
      content: `回复 @${this.data.replyToNickname}: ${this.data.newReply}`,
      userInfo: userInfo || {},
      createDate: timeUtils.getCurrentDate(),
      createTime: timeUtils.getCurrentTime(),
      updateTime: timeUtils.getCurrentTime()
    }];

    this.setData({
      comments: updatedComments, // 立即更新页面显示
      replyQueue: newQueue,
      replyingToIndex: -1, // 重置正在回复的评论索引
      replyToCommentId: null,
      replyToNickname: "",
      newReply: ""
    });

    // 如果队列长度达到5条，立即提交
    if (newQueue.length >= 5) {
      this.submitReplyBatch(newQueue);
      // 清空队列
      this.setData({
        replyQueue: []
      });
    }
    // 不再显示提示信息

    // 同时更新当前作品的评论数据
    this.refreshCurrentWorkComments();
  },

  // 批量提交回复
  submitReplyBatch: function (queue) {
    if (queue.length === 0) return;

    // 不再显示loading提示

    // 调用云函数批量添加回复
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'addCommentRepliesBatch', // 新增批量添加回复的云函数
        replies: queue
      },
      success: res => {
        // 不再显示成功提示
        if (res.result && res.result.success) {
          // 清空队列
          this.setData({
            replyQueue: []
          });

          // 重新加载评论
          this.loadComments();

          // 同时更新当前作品的评论数据
          this.refreshCurrentWorkComments();
        } else {
          // 不再显示失败提示
        }
      },
      fail: err => {
        console.error('回复提交失败：', err);
        // 不再显示失败提示
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