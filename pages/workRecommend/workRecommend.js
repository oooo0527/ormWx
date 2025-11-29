Page({
  data: {
    currentSlide: 0,
    works: [
      {
        id: 1,
        title: "我家妹妹不准嫁",
        role: "小翁",
        type: "电影",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
        year: "2025",
        description: "首部大银幕作品，票房佳绩。在这部电影中，Orm饰演了一个性格独立、勇敢追求爱情的现代女性角色小翁。影片讲述了小翁在面对家庭压力和社会偏见时，如何坚持自己的选择并最终获得幸福的故事。这部电影不仅展现了Orm出色的演技，也让她在大银幕上留下了深刻的印象。",
        likes: 0,
        isLiked: false
      },
      {
        id: 2,
        title: "Only You",
        role: "Ira",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/24c44a6355707a277309865e62c1b5cb.jpg",
        year: "2024",
        description: "饰演人气歌手。在这部音乐题材的电视剧中，Orm扮演了才华横溢的歌手Ira，展现了角色在音乐道路上的奋斗历程和情感纠葛。该剧不仅有动人的音乐作品，还有精彩的剧情发展，Orm的表演获得了观众和评论家的一致好评。",
        likes: 0,
        isLiked: false
      },
      {
        id: 3,
        title: "我们的秘密",
        role: "尔恩 (Earn)",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/329c3f47da4836e2c4ef41bf97540833.jpg",
        year: "2024",
        description: "对主角情感生活产生重大影响的人物。在这部BL剧中，Orm饰演的尔恩(Earn)是一个温柔内敛的大学生，与另一位男主角之间发展出深刻的情感关系。这部剧因其细腻的情感描绘和演员们的精彩表演而广受好评，成为当年最受欢迎的BL剧之一。",
        likes: 0,
        isLiked: false
      },
      {
        id: 4,
        title: "Potion of Love",
        role: "Pun",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/3916c9499882d66371bc6573597693bf.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品。在这部奇幻爱情剧中，她饰演了聪明勇敢的女主人公Pun，为了拯救心爱的人而踏上寻找神奇药水的冒险之旅。这部剧展现了Orm在动作戏和情感戏方面的出色表现，为她的演艺生涯奠定了坚实的基础。",
        likes: 0,
        isLiked: false
      },
      {
        id: 5,
        title: "Potion of Love1",
        role: "Pun",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/443aaee45d2852f42a20789b76793ea0.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品续集。在这部续集中，Pun继续她的冒险旅程，面对新的挑战和敌人。剧情更加紧张刺激，角色发展也更加深入，Orm的表演也更加成熟。",
        likes: 0,
        isLiked: false
      },
      {
        id: 6,
        title: "Potion of Love",
        role: "Pun",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/46022d31c72eb3e3cc17126fdc53d9f9.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品特别篇。这个特别篇回顾了Pun的冒险历程，并为未来的剧情发展埋下伏笔。特别篇中包含了许多精彩的动作场面和感人的剧情。",
        likes: 0,
        isLiked: false
      },
      {
        id: 7,
        title: "Potion of Love",
        role: "Pun",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/4fe790c8959fd90505b3fbadefe51ecb.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品幕后花絮。这部花絮展示了拍摄过程中的精彩瞬间和演员们的幕后生活，让观众更深入了解这部作品的制作过程。",
        likes: 0,
        isLiked: false
      },
      {
        id: 8,
        title: "公益广告1",
        role: "主演",
        type: "公益广告",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
        year: "2022",
        description: "Orm参与拍摄的公益广告，呼吁关注环境保护。在这部广告中，她以真诚的表演传达了保护地球的重要性，展现了作为公众人物的社会责任感。",
        likes: 0,
        isLiked: false
      },
      {
        id: 9,
        title: "公益广告2",
        role: "主演",
        type: "公益广告",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/24c44a6355707a277309865e62c1b5cb.jpg",
        year: "2022",
        description: "Orm参与拍摄的公益广告，关注儿童教育问题。通过这部广告，她呼吁社会各界关注贫困地区儿童的教育问题，为他们提供更好的学习条件。",
        likes: 0,
        isLiked: false
      }
    ],

    // 按类型分类的作品
    categorizedWorks: {},


  },

  onLoad: function () {

    this.categorizeWorks();
  },

  // 按类型分类作品
  categorizeWorks: function () {
    const works = this.data.works;
    const categorizedWorks = {};

    // 按类型分组
    works.forEach(work => {
      if (!categorizedWorks[work.type]) {
        categorizedWorks[work.type] = [];
      }
      categorizedWorks[work.type].push(work);
    });

    this.setData({
      categorizedWorks: categorizedWorks
    });
  },
});