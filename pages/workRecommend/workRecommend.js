Page({
  data: {
    works: [
      {
        id: 1,
        title: "青春校园",
        type: "电视剧",
        cover: "/images/work1.jpg",
        rating: 8.5,
        year: "2022",
        description: "讲述了一群大学生在校园中的青春故事，友情、爱情与梦想交织。",
        likes: 128,
        isLiked: false
      },
      {
        id: 2,
        title: "追光者",
        type: "电影",
        cover: "/images/work2.jpg",
        rating: 9.0,
        year: "2023",
        description: "一部关于追逐梦想的励志电影，主人公通过不懈努力最终实现音乐梦想。",
        likes: 256,
        isLiked: false
      },
      {
        id: 3,
        title: "都市爱情",
        type: "电视剧",
        cover: "/images/work3.jpg",
        rating: 7.8,
        year: "2021",
        description: "都市背景下的浪漫爱情故事，展现了现代都市人的爱情观与生活状态。",
        likes: 95,
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