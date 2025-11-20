Page({
  data: {
    isLogin: false,
    userInfo: null,
    voices: [
      {
        id: 1,
        content: "ORM：我想拥有隐形的能力，这样我就可以偷偷出去玩而不被人发现（笑）。",
        context: "ELLE杂志采访中关于超能力的提问",
        type: "幽默自白",
        userId: "user1",
        likes: [],
        comments: [],
        createTime: "2025-01-15 10:30",
        updateTime: "2025-01-15 10:30"
      },
      {
        id: 2,
        content: "我是一个特别容易入睡的人...在片场，有三个发型师围着我忙...我却能在这样的环境里睡着。所以有很多'数字足迹'（笑），因为大家会偷拍我睡觉。",
        context: "ELLE杂志采访中分享的片场趣事",
        type: "可爱日常",
        userId: "user2",
        likes: [],
        comments: [],
        createTime: "2025-01-10 14:20",
        updateTime: "2025-01-10 14:20"
      },
      {
        id: 3,
        content: "如果我能回去和小时候的小Norawan对话，我会告诉她'你所做的一切都是对的'...我从来不是那种固执到会造成生活中重大问题的人。爸爸妈妈教了我很多东西，让我内心变得非常充实。",
        context: "ELLE杂志采访中回顾成长的感悟",
        type: "积极人生观",
        userId: "user3",
        likes: [],
        comments: [],
        createTime: "2025-01-05 09:15",
        updateTime: "2025-01-05 09:15"
      },
      {
        id: 4,
        content: "她以亮眼的表现，首次登上ELLE Thailand 2025年1月刊封面",
        context: "时尚杂志对其专业表现力的认可",
        type: "专业认可",
        userId: "user4",
        likes: [],
        comments: [],
        createTime: "2024-12-28 16:45",
        updateTime: "2024-12-28 16:45"
      },
      {
        id: 5,
        content: "Orm在《猎恶游戏》中饰演被冷漠抛弃的黑手党千金'Anya'而为人熟知。",
        context: "代表角色获得关注",
        type: "演技肯定",
        userId: "user5",
        likes: [],
        comments: [],
        createTime: "2024-12-20 11:30",
        updateTime: "2024-12-20 11:30"
      },
      {
        id: 6,
        content: "Orm Kornnaphat Sethratanapong，泰国新生代的女演员及模特...作为该台的签约艺人，她展现出了在表演艺术方面的天赋和热情。",
        context: "媒体对其职业潜力的评价",
        type: "职业潜力",
        userId: "user6",
        likes: [],
        comments: [],
        createTime: "2024-12-15 13:20",
        updateTime: "2024-12-15 13:20"
      }
    ],
    showPostForm: false,
    postContent: ""
  },

  onLoad: function (options) {
    // this.checkLoginStatus();
    // 加载心声列表
    // this.loadVoices();
  },

  onShow: function () {
    // this.checkLoginStatus();
    // 重新加载心声列表
    // this.loadVoices();
  },

  // 加载心声列表
  loadVoices: function () {
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getVoices',
        limit: 20
      }
    }).then(res => {
      if (res.result.success) {
        // 处理点赞状态
        const voices = res.result.data.map(voice => {
          const openid = wx.getStorageSync('openid') || '';
          return {
            ...voice,
            isLiked: voice.likes && voice.likes.includes(openid)
          };
        });

        this.setData({
          voices: voices
        });
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('加载心声失败', err);
      wx.showToast({
        title: '加载心声失败',
        icon: 'none'
      });
    });
  },

  // 显示发布表单
  showPostForm: function () {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    this.setData({
      showPostForm: true
    });
  },

  // 隐藏发布表单
  hidePostForm: function () {
    this.setData({
      showPostForm: false,
      postContent: ""
    });
  },

  // 输入内容
  onContentInput: function (e) {
    this.setData({
      postContent: e.detail.value
    });
  },

  // 发布心声
  postVoice: function () {
    const { postContent } = this.data;

    if (!postContent) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    // 调用云函数发布心声
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'postVoice',
        content: postContent
      }
    }).then(res => {
      if (res.result.success) {
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        });

        // 重新加载心声列表
        this.loadVoices();

        this.setData({
          showPostForm: false,
          postContent: ""
        });
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('发布失败', err);
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      });
    });
  },

  // 格式化时间
  formatTime: function (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 点赞心声
  likeVoice: function (e) {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    const index = e.currentTarget.dataset.index;
    const voice = this.data.voices[index];

    // 调用云函数点赞
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'likeVoice',
        voiceId: voice._id
      }
    }).then(res => {
      if (res.result.success) {
        // 更新本地数据
        const voices = this.data.voices;
        voices[index].isLiked = !voices[index].isLiked;
        voices[index].likes = res.result.data.likes;

        this.setData({
          voices: voices
        });
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('点赞失败', err);
      wx.showToast({
        title: '点赞失败',
        icon: 'none'
      });
    });
  },

  // 评论心声
  commentVoice: function (e) {
    const index = e.currentTarget.dataset.index;
    const voice = this.data.voices[index];

    wx.showModal({
      title: '评论功能',
      content: '暂不支持评论功能，该功能将在后续版本中实现。',
      showCancel: false,
      confirmText: '知道了'
    });
  }
});