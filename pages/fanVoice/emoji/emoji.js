// emoji.js
Page({
  data: {
    voices: [
      {
        id: 9,
        content: "Orm的这个表情包太可爱了，已经保存了100遍！",
        context: "Orm最新表情包",
        type: "表情包分享",
        category: "emoji",
        userId: "user9",
        likes: [],
        comments: [],
        createTime: "2025-01-18 09:15",
        updateTime: "2025-01-18 09:15"
      },
      {
        id: 14,
        content: "Orm的新表情包合集来啦，快收藏！",
        context: "Orm最新表情包系列",
        type: "表情包合集",
        category: "emoji",
        userId: "user14",
        likes: [],
        comments: [],
        createTime: "2025-01-16 12:30",
        updateTime: "2025-01-16 12:30"
      }
    ]
  },

  onLoad: function (options) {

  },

  onShow: function () {

  },

  // 点赞心声
  likeVoice: function (e) {
    wx.showModal({
      title: '提示',
      content: '请先登录以使用点赞功能',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 评论心声
  commentVoice: function (e) {
    wx.showModal({
      title: '提示',
      content: '请先登录以使用评论功能',
      showCancel: false,
      confirmText: '知道了'
    });
  }
})