Page({
  data: {
    books: [
      {
        id: 1,
        title: "童年回忆",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg",
        color: "#333"
      },
      {
        id: 2,
        title: "青春时光",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/50a564a77eb43dd2c90f8294b03c1f91.jpg",
        color: "#3f3232"
      },
      {
        id: 3,
        title: "成长足迹",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/6ca0533a7313c69c9e5a07cdeba38cd0.jpg",

        color: "#694141"
      },
      {
        id: 4,
        title: "梦想启航",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/7107bc357e6ac46e53f504384e17e397.jpg",

        color: "#ad4d4d"
      },
      {
        id: 5,
        title: "美好未来",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/7107bc357e6ac46e53f504384e17e397.jpg",
        color: "#681919"
      }
    ],
    books1: [
      {
        id: 1,
        title: "童年回忆",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg",

        color: "#3d1357"
      },
      {
        id: 2,
        title: "青春时光",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/50a564a77eb43dd2c90f8294b03c1f91.jpg",

        color: "#642f85"
      },
      {
        id: 3,
        title: "成长足迹",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/6ca0533a7313c69c9e5a07cdeba38cd0.jpg",

        color: "#66427c"
      },
      {
        id: 4,
        title: "梦想启航",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/7107bc357e6ac46e53f504384e17e397.jpg",

        color: "#46384f"
      },
      {
        id: 5,
        title: "美好未来",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/7107bc357e6ac46e53f504384e17e397.jpg",
        color: "#433c47"
      }
    ],
    animatedBookId: null,
    animatedBookId1: null,
    currentIndex: 0, // 当前显示的书籍索引
    currentIndex1: 0 // 当前显示的书籍索引
  },

  onLoad() {

    // 初始化当前选中的书籍
    this.updateCurrentBook();
    this.updateCurrentBook1();
  },

  updateCurrentBook() {
    const currentBook = this.data.books[this.data.currentIndex];
    if (currentBook) {
      this.setData({
        animatedBookId: currentBook.id
      });

      // 动画结束后取消动画状态
      setTimeout(() => {
        this.setData({
          animatedBookId: null
        });
      }, 400);
    }
  },
  updateCurrentBook1() {
    const currentBook = this.data.books1[this.data.currentIndex1];
    if (currentBook) {
      this.setData({
        animatedBookId1: currentBook.id
      });

      // 动画结束后取消动画状态
      setTimeout(() => {
        this.setData({
          animatedBookId1: null
        });
      }, 400);
    }
  },
  preventTap(e) {
    console.log('#E9E8EF事件冒泡');
  },

  onBookTap(e) {
    console.log("onBookTap triggered", e);
    const bookId = e.currentTarget.dataset.id;
    console.log("Book ID:", bookId);

    // 触发动画效果
    this.setData({
      animatedBookId: bookId
    });
    console.log("Book tapped:", bookId);

    // 延迟跳转到详情页
    setTimeout(() => {
      const book = this.data.books.find(item => item.id === bookId);
      console.log("Found book:", book);
      if (book) {
        wx.navigateTo({
          url: `/packHome/bookDetail/bookDetail?bookId=${bookId}&title=${encodeURIComponent(book.title)}`,
        });
      }
    }, 400);
  },

  // 处理滑动事件
  onTouchStart(e) {
    this.startY = e.touches[0].clientY;
    this.startX = e.touches[0].clientX; // 记录起始X坐标
  },

  onTouchMove(e) {
    this.moveY = e.touches[0].clientY;
    this.moveX = e.touches[0].clientX; // 记录移动X坐标
  },

  onTouchEnd(e) {
    if (this.startY && this.moveY) {
      const deltaY = this.startY - this.moveY;
      const deltaX = Math.abs((this.moveX || e.changedTouches[0].clientX) - this.startX);

      // 判断是否为点击操作（垂直和水平移动都很小）
      if (Math.abs(deltaY) < 10 && deltaX < 10) {
        // 可能是点击，不执行滑动逻辑
        this.startY = 0;
        this.moveY = 0;
        this.startX = 0;
        this.moveX = 0;
        return;
      }

      // 向上滑动切换到下一本书
      if (deltaY > 50) {
        //把第一条数据插入到最后
        this.data.books.push(this.data.books[0]);
        this.data.books.shift();

        this.switchToNextBook();
      }
      // 向下滑动切换到上一本书
      else if (deltaY < -50) {
        //把最后一本数据插入到最前面
        this.data.books.unshift(this.data.books[this.data.books.length - 1]);
        this.data.books.pop();
        this.switchToPrevBook();
      }
      this.setData({
        books: this.data.books
      });
    }

    // 重置触摸位置
    this.startY = 0;
    this.moveY = 0;
    this.startX = 0;
    this.moveX = 0;
  },

  // 切换到下一本书
  switchToNextBook() {
    let newIndex = this.data.currentIndex + 1;
    if (newIndex >= this.data.books.length) {
      newIndex = 0; // 循环到第一本
    }

    this.setData({
      currentIndex: newIndex
    });

    this.updateCurrentBook();
  },

  // 切换到上一本书
  switchToPrevBook() {
    let newIndex = this.data.currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.data.books.length - 1; // 循环到最后一本
    }

    this.setData({
      currentIndex: newIndex
    });

    this.updateCurrentBook();
  },

  onBookTap1(e) {
    console.log("onBookTap1 triggered", e);
    const bookId = e.currentTarget.dataset.id;
    console.log("Book ID:", bookId);

    // 触发动画效果
    this.setData({
      animatedBookId1: bookId
    });

    // 延迟跳转到详情页
    setTimeout(() => {
      const book = this.data.books1.find(item => item.id === bookId);
      console.log("Found book1:", book);
      if (book) {
        wx.navigateTo({
          url: `/packHome/bookDetail/bookDetail?bookId=${bookId}&title=${encodeURIComponent(book.title)}`,
        });
      }
    }, 400);
  },

  // 处理滑动事件
  onTouchStart1(e) {
    this.startY = e.touches[0].clientY;
    this.startX = e.touches[0].clientX; // 记录起始X坐标
  },

  onTouchMove1(e) {
    this.moveY = e.touches[0].clientY;
    this.moveX = e.touches[0].clientX; // 记录移动X坐标
  },

  onTouchEnd1(e) {
    if (this.startY && this.moveY) {
      const deltaY = this.startY - this.moveY;
      const deltaX = Math.abs((this.moveX || e.changedTouches[0].clientX) - this.startX);

      // 判断是否为点击操作（垂直和水平移动都很小）
      if (Math.abs(deltaY) < 10 && deltaX < 10) {
        // 可能是点击，不执行滑动逻辑
        this.startY = 0;
        this.moveY = 0;
        this.startX = 0;
        this.moveX = 0;
        return;
      }

      // 向上滑动切换到下一本书
      if (deltaY > 50) {
        //把第一条数据插入到最后
        this.data.books1.push(this.data.books1[0]);
        this.data.books1.shift();

        this.switchToNextBook1();
      }
      // 向下滑动切换到上一本书
      else if (deltaY < -50) {
        //把最后一本数据插入到最前面
        this.data.books1.unshift(this.data.books1[this.data.books1.length - 1]);
        this.data.books1.pop();
        this.switchToPrevBook1();
      }
      this.setData({
        books1: this.data.books1
      });
    }

    // 重置触摸位置
    this.startY = 0;
    this.moveY = 0;
    this.startX = 0;
    this.moveX = 0;
  },

  // 切换到下一本书
  switchToNextBook1() {
    let newIndex = this.data.currentIndex + 1;
    if (newIndex >= this.data.books1.length) {
      newIndex = 0; // 循环到第一本
    }

    this.setData({
      currentIndex: newIndex
    });

    this.updateCurrentBook1();
  },

  // 切换到上一本书
  switchToPrevBook1() {
    let newIndex = this.data.currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.data.books1.length - 1; // 循环到最后一本
    }

    this.setData({
      currentIndex1: newIndex
    });

    this.updateCurrentBook1();
  }
});