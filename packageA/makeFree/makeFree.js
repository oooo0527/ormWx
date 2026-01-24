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
    elementStartY: 0,
    // 缩放相关数据
    scaleStartDistance: 0,
    elementStartWidth: 0,
    elementStartHeight: 0,
    isScaling: false,

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

  // 开始拖拽/缩放
  startDrag(e) {
    const elementId = e.currentTarget.dataset.id;
    const touches = e.touches;

    // 找到对应的元素
    const element = this.data.elements.find(el => el.id === elementId);
    if (!element) return;

    // 双指触摸 - 开始缩放
    if (touches.length === 2) {
      const distance = this.getTouchDistance(touches[0], touches[1]);
      this.setData({
        selectedElementId: elementId,
        isScaling: true,
        scaleStartDistance: distance,
        elementStartWidth: element.width,
        elementStartHeight: element.height
      });
    }
    // 单指触摸 - 开始拖拽
    else if (touches.length === 1) {
      const touch = touches[0];
      this.setData({
        selectedElementId: elementId,
        isScaling: false,
        dragStartX: touch.clientX,
        dragStartY: touch.clientY,
        elementStartX: element.x,
        elementStartY: element.y
      });
    }
  },

  // 拖拽/缩放中
  onDrag(e) {
    if (!this.data.selectedElementId) return;

    const touches = e.touches;

    // 双指缩放
    if (this.data.isScaling && touches.length === 2) {
      const currentDistance = this.getTouchDistance(touches[0], touches[1]);
      const scale = currentDistance / this.data.scaleStartDistance;

      // 限制缩放范围
      const minScale = 0.5;
      const maxScale = 3.0;
      const clampedScale = Math.min(Math.max(scale, minScale), maxScale);

      const newWidth = this.data.elementStartWidth * clampedScale;
      const newHeight = this.data.elementStartHeight * clampedScale;

      // 更新元素尺寸
      const updatedElements = this.data.elements.map(el =>
        el.id === this.data.selectedElementId
          ? { ...el, width: newWidth, height: newHeight }
          : el
      );

      this.setData({
        elements: updatedElements
      });
    }
    // 单指拖拽
    else if (!this.data.isScaling && touches.length === 1) {
      const touch = touches[0];
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
    }
  },

  // 结束拖拽/缩放
  endDrag() {
    this.setData({
      selectedElementId: null,
      isScaling: false,
      scaleStartDistance: 0,
      elementStartWidth: 0,
      elementStartHeight: 0
    });
  },

  // 删除选中元素
  deleteElement() {
    if (!this.data.selectedElementId) {
      wx.showToast({
        title: '请先选择要删除的元素',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: '确定要删除选中的元素吗？',
      success: (res) => {
        if (res.confirm) {
          const updatedElements = this.data.elements.filter(
            el => el.id !== this.data.selectedElementId
          );

          this.setData({
            elements: updatedElements,
            selectedElementId: null
          });

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 点击元素 - 用于选中元素
  selectElement(e) {
    const elementId = e.currentTarget.dataset.id;
    // 阻止事件冒泡
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();

    this.setData({
      selectedElementId: elementId
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
  deselectElement(e) {
    // 如果是来自元素的事件，则不处理
    if (e && e.target && e.target.dataset && e.target.dataset.id) {
      return;
    }

    this.setData({
      selectedElementId: null
    });
  },

  // 计算两点间距离
  getTouchDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  },

  // 获取元素中心点
  getElementCenter(element) {
    return {
      x: element.x + element.width / 2,
      y: element.y + element.height / 2
    };
  },


})