Page({
  data: {
    stars: [
      {
        id: 1,
        name: "张三",
        englishName: "Zhang San",
        avatar: "/images/star1.jpg",
        birthday: "1990-01-01",
        height: "180cm",
        weight: "70kg",
        bloodType: "O型",
        constellation: "摩羯座",
        hobby: "唱歌、跳舞、演戏",
        introduction: "中国内地男演员，毕业于北京电影学院表演系。代表作品有《青春校园》、《都市爱情》等。"
      },
      {
        id: 2,
        name: "李四",
        englishName: "Li Si",
        avatar: "/images/star2.jpg",
        birthday: "1992-05-15",
        height: "168cm",
        weight: "48kg",
        bloodType: "A型",
        constellation: "金牛座",
        hobby: "音乐、旅行、摄影",
        introduction: "华语流行女歌手，词曲创作人。代表作品有《梦想的声音》、《追光者》等。"
      }
    ],
    selectedStar: null
  },

  onLoad: function (options) {

  },

  // 查看明星详情
  viewStarDetail: function (e) {
    const index = e.currentTarget.dataset.index;
    const star = this.data.stars[index];
    this.setData({
      selectedStar: star
    });
  },

  // 关闭详情弹窗
  closeDetail: function () {
    this.setData({
      selectedStar: null
    });
  }
});