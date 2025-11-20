Page({
  data: {
    isLogin: false,
    userInfo: null,
    voices: [],
    showPostForm: false,
    postContent: ""
  },

  onLoad: function (options) {
    // this.checkLoginStatus();
    // 加载心声列表
    this.loadVoices();
  },

  onShow: function () {
    // this.checkLoginStatus();
    // 重新加载心声列表
    this.loadVoices();
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