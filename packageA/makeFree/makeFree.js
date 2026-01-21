// packageA/makeFree/makeFree.js
Page({
  data: {
    elements: [], // 存储所有可拖拽元素
    selectedElementId: null, // 当前选中的元素ID
    nextId: 1, // 下一个元素的ID
    isAddingText: false, // 是否正在添加文字模式
    isAddingImage: false, // 是否正在添加图片模式
    canvasWidth: 750, // 画布宽度(rpx)
    canvasHeight: 1334, // 画布高度(rpx)
    backgroundColor: '#ffffff', // 背景颜色
    showToolbar: true, // 是否显示工具栏
    showPropertyPanel: false, // 是否显示属性面板
    dragStartX: 0,
    dragStartY: 0,
    elementStartX: 0,
    elementStartY: 0
  },




  // 加载本地存储的数据
  loadCanvasData() {
    try {
      const savedData = wx.getStorageSync('diyCanvasData');
      if (savedData) {
        this.setData({
          elements: savedData.elements || [],
          nextId: savedData.nextId || 1,
          backgroundColor: savedData.backgroundColor || '#ffffff'
        });
      }
    } catch (e) {
      console.error('加载数据失败:', e);
    }
  },



  // 添加文字元素
  addText() {
    const newElement = {
      id: this.data.nextId,
      type: 'text',
      content: '双击编辑文字',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: 28,
      color: '#000000',
      backgroundColor: 'transparent',
      textAlign: 'left',
      zIndex: this.data.nextId
    };

    this.setData({
      elements: [...this.data.elements, newElement],
      nextId: this.data.nextId + 1,
      selectedElementId: newElement.id
    });
  },

  // 添加图片元素
  addImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0];
        const newElement = {
          id: that.data.nextId,
          type: 'image',
          src: tempFilePath,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          zIndex: that.data.nextId
        };

        that.setData({
          elements: [...that.data.elements, newElement],
          nextId: that.data.nextId + 1,
          selectedElementId: newElement.id
        });

      }
    });
  },

  // 开始拖拽
  startDrag(e) {
    const elementId = e.currentTarget.dataset.id;
    const touch = e.touches[0];

    // 找到对应的元素
    const element = this.data.elements.find(el => el.id === elementId);
    if (!element) return;

    this.setData({
      selectedElementId: elementId,
      dragStartX: touch.clientX,
      dragStartY: touch.clientY,
      elementStartX: element.x,
      elementStartY: element.y
    });
  },

  // 拖拽中
  onDrag(e) {
    if (!this.data.selectedElementId) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - this.data.dragStartX;
    const deltaY = touch.clientY - this.data.dragStartY;

    const newX = this.data.elementStartX + deltaX;
    const newY = this.data.elementStartY + deltaY;

    // 更新元素位置
    const updatedElements = this.data.elements.map(el =>
      el.id === this.data.selectedElementId
        ? { ...el, x: newX, y: newY }
        : el
    );

    this.setData({
      elements: updatedElements
    });
  },

  // 结束拖拽
  endDrag() {
    this.setData({
      selectedElementId: null
    });
  },

  // 删除选中元素
  deleteElement() {
    if (!this.data.selectedElementId) return;

    const updatedElements = this.data.elements.filter(
      el => el.id !== this.data.selectedElementId
    );

    this.setData({
      elements: updatedElements,
      selectedElementId: null
    });

  },

  // 双击编辑文字
  editTextInput(e) {
    const elementId = e.currentTarget.dataset.id;
    const element = this.data.elements.find(el => el.id === elementId);

    if (element && element.type === 'text') {
      this.setData({ selectedElementId: elementId });

      wx.showModal({
        title: '编辑文字',
        editable: true,
        placeholderText: '请输入文字内容',
        content: element.content,
        success: (res) => {
          if (res.confirm) {
            const updatedElements = this.data.elements.map(el =>
              el.id === elementId
                ? { ...el, content: res.content || el.content }
                : el
            );

            this.setData({
              elements: updatedElements
            });
          }
        }
      });
    }
  },

  // 清空画布
  clearCanvas() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            elements: [],
            nextId: 1,
            selectedElementId: null
          });
        }
      }
    });
  },


  // 切换属性面板显示
  togglePropertyPanel() {
    this.setData({
      showPropertyPanel: !this.data.showPropertyPanel
    });
  },

  // 取消选中
  deselectElement() {
    this.setData({
      selectedElementId: null
    });
  }
})