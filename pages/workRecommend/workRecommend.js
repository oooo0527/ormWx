Page({
  data: {
    works: [
      {
        id: 1,
        title: "我家妹妹不准嫁",
        role: "小翁",
        type: "电影",
        cover: "/images/work1.jpg",
        year: "2025",
        description: "首部大银幕作品，票房佳绩",
        likes: 0,
        isLiked: false
      },
      {
        id: 2,
        title: "Only You",
        role: "Ira",
        type: "电视剧",
        cover: "/images/work2.jpg",
        year: "2024",
        description: "饰演人气歌手",
        likes: 0,
        isLiked: false
      },
      {
        id: 3,
        title: "我们的秘密",
        role: "尔恩 (Earn)",
        type: "电视剧",
        cover: "/images/work3.jpg",
        year: "2024",
        description: "对主角情感生活产生重大影响的人物",
        likes: 0,
        isLiked: false
      },
      {
        id: 4,
        title: "Potion of Love",
        role: "Thanya",
        type: "电视剧",
        cover: "/images/fan1.jpg",
        year: "2024",
        description: "",
        likes: 0,
        isLiked: false
      },
      {
        id: 5,
        title: "医爱之名",
        role: "Riri",
        type: "电视剧",
        cover: "/images/fan2.jpg",
        year: "2023",
        description: "",
        likes: 0,
        isLiked: false
      },
      {
        id: 6,
        title: "日影之下",
        role: "Vicky",
        type: "电视剧",
        cover: "/images/fan3.jpg",
        year: "2023",
        description: "客串出演",
        likes: 0,
        isLiked: false
      },
      {
        id: 7,
        title: "黑色贞洁",
        role: "未知",
        type: "电视剧",
        cover: "/images/star1.jpg",
        year: "2023",
        description: "",
        likes: 0,
        isLiked: false
      },
      {
        id: 8,
        title: "嘿，我爱你",
        role: "未知",
        type: "电视剧",
        cover: "/images/star2.jpg",
        year: "2022",
        description: "",
        likes: 0,
        isLiked: false
      },
      {
        id: 9,
        title: "猎恶游戏",
        role: "Anya",
        type: "电视剧",
        cover: "/images/work1.jpg",
        year: "2021",
        description: "饰演被冷漠抛弃的黑手党千金",
        likes: 0,
        isLiked: false
      },
      {
        id: 10,
        title: "珠光璀璨",
        role: "未知",
        type: "电视剧",
        cover: "/images/work2.jpg",
        year: "2021",
        description: "客串都市情感剧",
        likes: 0,
        isLiked: false
      },
      {
        id: 11,
        title: "酒店之星",
        role: "Nook",
        type: "电视剧",
        cover: "/images/work3.jpg",
        year: "2019",
        description: "出道作品",
        likes: 0,
        isLiked: false
      }
    ]
  },

  onLoad: function (options) {

  },

  // 点赞作品
  likeWork: function (e) {
    const index = e.currentTarget.dataset.index;
    const works = this.data.works;
    const work = works[index];

    // 切换点赞状态
    work.isLiked = !work.isLiked;
    work.likes = work.isLiked ? work.likes + 1 : work.likes - 1;

    this.setData({
      works: works
    });
  },

  // 分享作品
  shareWork: function (e) {
    const index = e.currentTarget.dataset.index;
    const work = this.data.works[index];

    wx.showActionSheet({
      itemList: ['分享到朋友圈', '分享给朋友', '生成海报'],
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        });
      }
    });
  }
});