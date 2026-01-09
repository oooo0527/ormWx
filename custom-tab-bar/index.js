// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#f77030",
    list: [
      {
        pagePath: "/pages/Home/Home",
        iconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/light.png",
        selectedIconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/orange.png",
        text: "首页"
      },
      {
        pagePath: "/pages/interaction/interaction",
        iconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/light.png",
        selectedIconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/orange.png",
        text: "互动"
      },
      {
        pagePath: "/pages/workRecommend/workRecommend",
        iconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/light.png",
        selectedIconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/orange.png",
        text: "作品"
      },
      {
        pagePath: "/pages/profile/profile",
        iconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/light.png",
        selectedIconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/orange.png",
        text: "煎蛋卷"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;

      // 查找当前点击的tab项索引
      const tabIndex = data.index;

      // 更新选中状态
      this.setData({
        selected: tabIndex
      });
      // 跳转页面
      wx.switchTab({ url })

    },

  }
})