Page({
  data: {
    stars: [
      {
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
          agency: "泰国3台签约艺人",
          debutYear: 2019,
          debutWork: "《酒店之星》",
          representativeWorks: [
            { year: 2019, title: "酒店之星", role: "Nook" },
            { year: 2021, title: "珠光璀璨", role: "客串" },
            { year: 2021, title: "猎恶游戏", role: "Anya" },
            { year: 2022, title: "嘿，我爱你", role: "" },
            { year: 2023, title: "日影之下", role: "Vicky" },
            { year: 2023, title: "医爱之名", role: "Riri" },
            { year: 2023, title: "黑色贞洁", role: "" },
            { year: 2024, title: "我们的秘密", role: "尔恩 (Earn)" },
            { year: 2024, title: "Potion of Love", role: "Thanya" }
          ]
        },
        avatar: "/images/star1.jpg",
        weight: "",
        bloodType: "",
        hobby: "",
        introduction: "泰国演员和模特，目前是泰国3台签约艺人。"
      }
    ],
    selectedStar: null
  },

  onLoad: function (options) {
    // console.log('明星档案页面加载');
    // wx.cloud.init({
    //   env: "cloud1-5gzybpqcd24b2b58",
    //   traceUser: true,
    // })
    // wx.cloud.callFunction({
    //   name: 'user',
    //   data: {
    //     action: 'getUserInfo'
    //   }
    // }).then(res => {
    //   console.log('用户信息:', res);
    //   if (res.result.success) {
    //     this.setData({
    //       stars:[{...res.result.data}]
    //     });
    //   }
    // });
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