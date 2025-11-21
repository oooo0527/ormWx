// dream.js
Page({
  data: {
    voices: [
      {
        id: 6,
        content: "Orm Kornnaphat Sethratanapong，泰国新生代的女演员及模特...作为该台的签约艺人，她展现出了在表演艺术方面的天赋和热情。",
        context: "媒体对其职业潜力的评价",
        type: "职业潜力",
        category: "dream",
        userId: "user6",
        likes: [],
        comments: [],
        createTime: "2024-12-15 13:20",
        updateTime: "2024-12-15 13:20"
      },
      {
        id: 13,
        content: "和Orm一起追剧的感觉太幸福了！",
        context: "梦女幻想场景",
        type: "梦境分享",
        category: "dream",
        userId: "user13",
        likes: [],
        comments: [],
        createTime: "2025-01-17 20:15",
        updateTime: "2025-01-17 20:15"
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