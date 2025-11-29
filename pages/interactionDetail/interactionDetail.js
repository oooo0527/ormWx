Page({
  data: {
    currentSlide: 0,
    selectedWork: null,
    works: [],

    // 评论数据
    comments: [
      {
        id: 1,
        avatar: "/images/avatar1.png",
        nickname: "粉丝小王",
        content: "Orm真的太棒了！每次看到她的作品都让我感动不已。",
        time: "2025-11-28 15:30",
        likes: 25,
        isLiked: false,
        replies: [
          {
            id: 1,
            avatar: "/images/avatar2.png",
            nickname: "Orm官方",
            content: "谢谢支持！我们会继续努力的！",
            time: "2025-11-28 16:45"
          }
        ]
      },
      {
        id: 2,
        avatar: "/images/avatar3.png",
        nickname: "泰国粉丝",
        content: "从泰国过来支持Orm！希望她越来越好！",
        time: "2025-11-27 10:15",
        likes: 18,
        isLiked: false,
        replies: []
      },
      {
        id: 3,
        avatar: "/images/avatar4.png",
        nickname: "影视爱好者",
        content: "Orm的演技真的越来越精湛了，每部作品都很精彩！",
        time: "2025-11-26 20:20",
        likes: 32,
        isLiked: false,
        replies: [
          {
            id: 2,
            avatar: "/images/avatar5.png",
            nickname: "剧评人",
            content: "确实，Orm在《我们的秘密》中的表现特别出色！",
            time: "2025-11-26 21:10"
          }
        ]
      }
    ],

    // 新评论内容
    newComment: "",

    // 回复相关
    isReplying: false,
    replyToCommentId: null,
    replyToNickname: "",
    newReply: ""
  },

  onLoad: function (options) {
    // 获取从上一页传递过来的数据
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.setData({
        works: data.works,
        currentSlide: data.currentIndex,
        selectedWork: data.works[data.currentIndex]
      });
    });
  },

  // 返回作品列表
  backToList: function () {
    wx.navigateBack();
  },

  // 轮播图切换事件
  onSwiperChange: function (e) {
    const current = e.detail.current;
    this.setData({
      currentSlide: current,
      selectedWork: this.data.works[current]
    });
  },

  // 轮播图图片点击事件
  onSwiperImageTap: function (e) {
    // 可以在这里添加点击图片的处理逻辑
    console.log("点击了轮播图图片");
  },

  // 点赞功能
  toggleLike: function (e) {
    const works = this.data.works;
    const currentSlide = this.data.currentSlide;
    const work = works[currentSlide];

    // 更新点赞状态
    work.isLiked = !work.isLiked;
    work.likes += work.isLiked ? 1 : -1;

    // 更新数据
    const newWorks = [...works];
    newWorks[currentSlide] = work;

    this.setData({
      works: newWorks,
      selectedWork: work
    });
  },

  // 评论点赞功能
  toggleCommentLike: function (e) {
    const commentId = e.currentTarget.dataset.id;
    const comments = this.data.comments;

    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
      comments[commentIndex].isLiked = !comments[commentIndex].isLiked;
      comments[commentIndex].likes += comments[commentIndex].isLiked ? 1 : -1;

      this.setData({
        comments: comments
      });
    }
  },

  // 输入评论
  onCommentInput: function (e) {
    this.setData({
      newComment: e.detail.value
    });
  },

  // 提交评论
  submitComment: function () {
    if (!this.data.newComment.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }

    const newComment = {
      id: this.data.comments.length + 1,
      avatar: "/images/avatar-default.png",
      nickname: "我",
      content: this.data.newComment,
      time: this.getCurrentTime(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    const comments = [...this.data.comments, newComment];

    this.setData({
      comments: comments,
      newComment: ""
    });

    wx.showToast({
      title: '评论成功',
      icon: 'success'
    });
  },

  // 开始回复评论
  startReply: function (e) {
    const commentId = e.currentTarget.dataset.id;
    const nickname = e.currentTarget.dataset.nickname;

    this.setData({
      isReplying: true,
      replyToCommentId: commentId,
      replyToNickname: nickname
    });
  },

  // 输入回复
  onReplyInput: function (e) {
    this.setData({
      newReply: e.detail.value
    });
  },

  // 提交回复
  submitReply: function () {
    if (!this.data.newReply.trim()) {
      wx.showToast({
        title: '请输入回复内容',
        icon: 'none'
      });
      return;
    }

    const comments = [...this.data.comments];
    const commentIndex = comments.findIndex(comment => comment.id === this.data.replyToCommentId);

    if (commentIndex !== -1) {
      const newReply = {
        id: comments[commentIndex].replies.length + 1,
        avatar: "/images/avatar-default.png",
        nickname: "我",
        content: this.data.newReply,
        time: this.getCurrentTime()
      };

      comments[commentIndex].replies.push(newReply);

      this.setData({
        comments: comments,
        newReply: "",
        isReplying: false,
        replyToCommentId: null,
        replyToNickname: ""
      });

      wx.showToast({
        title: '回复成功',
        icon: 'success'
      });
    }
  },

  // 取消回复
  cancelReply: function () {
    this.setData({
      isReplying: false,
      replyToCommentId: null,
      replyToNickname: "",
      newReply: ""
    });
  },

  // 获取当前时间
  getCurrentTime: function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});