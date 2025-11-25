// components/emoji/emoji.js
Page({
  properties: {

  },

  data: {
    emojis: []
  },

  onLoad: function () {
    this.loadEmojis();
  },


  // 加载表情包列表
  loadEmojis: function () {
    // 模拟从接口获取数据
    const emojis = [
      {
        id: 1,
        name: "Orm微笑",
        description: "Orm经典的迷人微笑表情",
        image: "/images/default_avatar.png"
      },
      {
        id: 2,
        name: "Orm眨眼",
        description: "Orm调皮眨眼的表情包",
        image: "/images/default_avatar.png"
      },
      {
        id: 3,
        name: "Orm害羞",
        description: "Orm害羞时的可爱表情",
        image: "/images/default_avatar.png"
      },
      {
        id: 4,
        name: "Orm惊讶",
        description: "Orm惊讶时的表情包",
        image: "/images/default_avatar.png"
      }
    ];

    this.setData({
      emojis: emojis
    });
  }

})