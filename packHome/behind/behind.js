Page({
  data: {
    timeOptions: [
      { id: 1, title: "童年回忆", date: "2010-2015", content: "童年的美好时光，无忧无虑的日子，充满好奇的探索世界。" },
      { id: 2, title: "青春岁月", date: "2015-2020", content: "青春的成长足迹，学习与成长的岁月，友谊与梦想交织。" },
      { id: 3, title: "求学时光", date: "2020-2023", content: "大学的学习生活，知识的积累，人生观的塑造。" },
      { id: 4, title: "初入职场", date: "2023-2024", content: "职场新人的体验，从学生到职场人的转变。" },
      { id: 5, title: "追梦之旅", date: "2024-至今", content: "追寻梦想的历程，不断挑战自我，追求更高的目标。" },
      { id: 6, title: "重要时刻", date: "2020-05-15", content: "毕业典礼，人生的重要节点，新阶段的开始。" },
      { id: 7, title: "难忘经历", date: "2021-08-22", content: "第一次旅行，开阔视野，体验不同文化。" },
      { id: 8, title: "成长足迹", date: "2022-03-10", content: "技能提升，专业能力的突破和成长。" },
      { id: 9, title: "人生转折", date: "2023-06-30", content: "毕业求职，人生道路的重要选择。" },
      { id: 10, title: "美好未来", date: "2024-01-01", content: "新年开始，对未来的憧憬和规划。" }
    ],
    selectedTime: null,
    scrollTop: 100, // 初始滚动位置，跳过顶部占位符
    itemHeight: 100, // 每个项目的高度（rpx）
    animation: true,
    currentIndex: 0,
    visibleItems: 5 // 同时显示5个项目
  },

  onLoad() {
    // 初始化选中第一个时间项
    this.setData({
      selectedTime: this.data.timeOptions[0],
      scrollTop: 200 // 初始滚动位置，跳过顶部占位符
    });
  },

  onScroll(e) {
    // 计算当前滚动位置对应的时间项
    const scrollTop = e.detail.scrollTop;
    const itemHeight = this.data.itemHeight;

    // 计算当前选中的项目索引，减去顶部占位符高度的影响
    const currentIndex = Math.round((scrollTop - 100) / itemHeight); // 减去顶部占位符的200px

    // 确保索引在有效范围内
    const maxIndex = this.data.timeOptions.length - 1;
    const validIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    if (validIndex !== this.data.currentIndex) {
      this.setData({
        currentIndex: validIndex,
        selectedTime: this.data.timeOptions[validIndex]
      });
    }
  },

  goToDetail() {
    const selected = this.data.selectedTime;
    if (selected) {
      wx.navigateTo({
        url: `/packHome/bookDetail/bookDetail?bookId=${selected.id}&title=${encodeURIComponent(selected.title)}&content=${encodeURIComponent(selected.content)}`,
      });
    }
  }
})