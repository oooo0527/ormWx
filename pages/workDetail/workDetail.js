Page({
  data: {
    work: {
      id: 0,
      title: "",
      role: "",
      type: "",
      cover: "",
      year: "",
      description: "",
      likes: 0,
      isLiked: false
    }
  },

  onLoad: function (options) {
    // 从上一个页面传递过来的作品数据
    if (options.work) {
      const work = JSON.parse(decodeURIComponent(options.work));
      this.setData({
        work: work
      });
    } else {
      // 如果没有传递作品数据，提供默认值
      this.setData({
        work: {
          id: 1,
          title: "默认作品",
          role: "默认角色",
          type: "电影",
          cover: "",
          year: "2024",
          description: "这是一个默认作品描述",
          likes: 0,
          isLiked: false
        }
      });
    }
  },

});