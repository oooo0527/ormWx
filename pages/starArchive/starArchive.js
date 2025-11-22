Page({
  data: {
    stars: [
      {
        avatar: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/d554005a153ae86aa6b8de351230cbf6.jpg',
        id: 1,
        name: "珙恩娜帕·瑟塔拉塔那彭",
        thaiName: "นรวรรณ เศรษฐรัตนพงศ์",
        englishName: "Kornnaphat Sethratanapong",
        nicknames: ["Orm", "Aom", "ออม"],
        gender: "女",
        birthday: "2002-05-27",
        zodiacSign: "双子座",
        nationality: "泰国",
        birthplace: "泰国",
        height: "175cm",
        occupations: ["演员", "模特"],
        education: {
          university: "诗纳卡宁威洛大学",
          college: "国际经济学院",
          major: "国际经济学"
        },
        familyBackground: {
          mother: "娜茹梦·彭素帕 (Koi Naruemon Phongsuphap)",
          motherOccupation: "演员"
        },
        career: {
          agency: "GMMTV",
          debutYear: "2020",
          debutWork: "《我的齿轮和你的海》",
          representativeWorks: [
            { year: "2025", title: "《我家妹妹不准嫁》", role: "小翁" },
            { year: "2024", title: "《Only You》", role: "Ira" },
            { year: "2024", title: "《我们的秘密》", role: "尔恩 (Earn)" },
            { year: "2023", title: "《Potion of Love》", role: "Pun" }
          ]
        },
        introduction: "珙恩娜帕·瑟塔拉塔那彭（Orm Kornnaphat），昵称Orm（小名Aom），泰国新生代女演员、模特。2020年通过参演电视剧《我的齿轮和你的海》正式出道。2024年因主演BL剧《我们的秘密》中饰演尔恩（Earn）一角而广受关注，与苏帕努·洛瀚帕尼（Nut）组成的荧幕情侣深受观众喜爱。Orm以其清新的气质和出色的演技赢得了众多粉丝的喜爱。"
      }
      // 可以添加更多明星数据
    ],
    selectedStar: null
  },

  onLoad: function (options) {
    // 页面加载时的逻辑
  },

  onShow: function () {
    // 页面显示时的逻辑
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
  },

  // 处理弹窗外部点击
  handleOverlayTap: function () {
    this.closeDetail();
  },

  // 阻止弹窗内容区域点击事件冒泡
  preventOverlayTap: function (e) {
    e.stopPropagation();
  }
})