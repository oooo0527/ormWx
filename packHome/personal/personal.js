Page({
  data: {
    ormInfo: {
      name: {
        chinese: "陈美铃",
        english: "Orm Kornnaphat Sethratanapong",
        thai: "กรณ์นภัส เศรษฐรัตนพงศ์"
      },
      nicknames: "Orm, ออม，陈奥,毛毛, 小金毛",
      basicInfo: {
        nationality: "泰国",
        birthDate: "2002.05.27",
        height: "173CM",
        weight: "50KG",
        bloodType: "B",
        zodiac: "马",
        constellations: {
          thai: "金牛座",
          international: "双子座"
        },
        mbti: "ENFP"
      },
      career: {
        occupations: "演员， 模特, 在读研究生",
        agency: "泰国第3电视台（2020—至今）",
        debutDate: "2019年7月12日"
      },
      preferences: {
        favoriteColors: "粉，白，蓝",
        favoriteFoods: "甜食, 牛肉, 沙拉, 三文鱼",
        fanColor: "粉色",
        fanName: "煎蛋卷（Omelette）",
        representativeEmoji: "🦋"
      },
      songs: [
        "《ระยะไกลของดวงจันทร์ 月亮的距离》"
      ],
      brands: [
        { name: "KeepSilent", type: "服饰", role: "CEO" },
        { name: "Chagô", type: "餐饮", role: "合伙人" }
      ],
      socialMedia: {
        weibo: "@orm_kornnaphat",
        x: "ormmormm",
        instagram: "orm.kornnaphat",
        tiktok: "ormkornnaphat"
      },
      education: {
        graduate: {
          university: "诗纳卡宁威洛大学",
          college: "社会传播创新学院",
          major: "影视与数字媒体（硕士在读）"
        },
        undergraduate: {
          university: "诗纳卡宁威洛大学",
          college: "经济学院",
          major: "国际经济学"
        },
        highSchool: "诗纳卡宁威洛大学附属中学",
        middleSchool: "帕尼亚拉特中学",
        elementarySchool: "瓦塔纳威塔亚学校"
      },
      family: {
        mother: "Koy",
        father: "Oct",
        brother: "Utt"
      },
      pets: [
        {
          name: "Uni",
          type: "博美犬",
          gender: "女",
          birthday: "2021.03.18",
          instagram: "uni.sdiary"
        },
        {
          name: "Abu",
          type: "鸟"
        },
        {
          name: "Juad",
          type: "乌龟"
        },
        {
          name: "Toothless",
          type: "鱼"
        }
      ]
    }
  },

  onLoad: function (options) {
    // 页面加载时的逻辑
  },

  onShow: function () {
    // 页面显示时的逻辑
  },
  onPageScroll: function (e) {
    // 空实现，但必须保留以便自定义导航栏组件可以绑定滚动事件
    // 实际的滚动处理由custom-navbar组件完成
  },
})