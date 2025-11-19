Page({
  data: {
    isLogin: false,
    userInfo: null,
    voices: [
      {
        id: 1,
        userId: 101,
        username: "粉丝小王",
        avatar: "/images/fan1.jpg",
        content: "张三的演技真的越来越好了，每次看他的作品都能感受到不同的魅力！",
        time: "2023-06-15 14:30",
        likes: 25,
        isLiked: false,
        comments: 3
      },
      {
        id: 2,
        userId: 102,
        username: "追星女孩",
        avatar: "/images/fan2.jpg",
        content: "李四的新歌太好听了，已经单曲循环一整天了！期待她的新专辑！",
        time: "2023-06-14 10:15",
        likes: 42,
        isLiked: false,
        comments: 8
      },
      {
        id: 3,
        userId: 103,
        username: "影视爱好者",
        avatar: "/images/fan3.jpg",
        content: "刚刚看完《都市爱情》，剧情紧凑，演员表现出色，强烈推荐！",
        time: "2023-06-13 20:45",
        likes: 18,
        isLiked: false,
        comments: 2
      }
    ],
    showPostForm: false,
    postContent: ""
  },

  onLoad: function (options) {
    this.checkLoginStatus();
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  checkLoginStatus: function () {
    const app = getApp();
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo
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
    const { postContent, userInfo } = this.data;

    if (!postContent) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    // 模拟发布心声
    const newVoice = {
      id: Date.now(),
      userId: userInfo.id,
      username: userInfo.nickname,
      avatar: userInfo.avatar || "/images/default_avatar.png",
      content: postContent,
      time: this.formatTime(new Date()),
      likes: 0,
      isLiked: false,
      comments: 0
    };

    this.setData({
      voices: [newVoice, ...this.data.voices],
      showPostForm: false,
      postContent: ""
    });

    wx.showToast({
      title: '发布成功',
      icon: 'success'
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
    const index = e.currentTarget.dataset.index;
    const voices = this.data.voices;
    const voice = voices[index];

    // 切换点赞状态
    voice.isLiked = !voice.isLiked;
    voice.likes = voice.isLiked ? voice.likes + 1 : voice.likes - 1;

    this.setData({
      voices: voices
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