Page({
  data: {

  },

  onLoad: function (options) {

  },

  testInteraction: function () {
    wx.navigateTo({
      url: '/pages/fanVoice/interaction/interaction'
    });
  },

  testSupport: function () {
    wx.navigateTo({
      url: '/pages/fanVoice/support/support'
    });
  },

  testMom: function () {
    wx.navigateTo({
      url: '/pages/fanVoice/mom/mom'
    });
  },

  testDream: function () {
    wx.navigateTo({
      url: '/pages/fanVoice/dream/dream'
    });
  },

  testEmoji: function () {
    wx.navigateTo({
      url: '/pages/fanVoice/emoji/emoji'
    });
  }
});