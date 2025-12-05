// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  switch (event.action) {
    case 'getPendingApprovals':
      return await getPendingApprovals(event)
    case 'approveInteraction':
      return await approveInteraction(event)
    case 'rejectInteraction':
      return await rejectInteraction(event)
    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

// 获取待审核的互动留言
async function getPendingApprovals(event) {
  try {
    // 获取status为'0'的留言（待审核留言）
    const pendingStatusResult = await db.collection('interactions')
      .where({
        status: '0',
        checked: '0'

      })
      .orderBy('createTime', 'desc')
      .get()

    // 获取checked为'1'的留言（待审核精选）
    const pendingCheckedResult = await db.collection('interactions')
      .where({
        checked: '1',
        status: '0'
      })
      .orderBy('createTime', 'desc')
      .get()

    return {
      success: true,
      data: {
        pendingStatus: pendingStatusResult.data,
        pendingChecked: pendingCheckedResult.data
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 审核通过留言 (status: '0' -> '1')
async function approveInteraction(event) {
  try {
    const { id, type } = event

    let updateData = {}

    if (type === 'status') {
      // 更新status字段: '0' -> '1'
      updateData.status = '1'
    } else if (type === 'checked') {
      // 更新checked字段: '1' -> '2'
      updateData.checked = '2'
      updateData.status = '1'
    }

    const result = await db.collection('interactions')
      .doc(id)
      .update({
        data: updateData
      })

    return {
      success: true,
      data: result
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 拒绝留言 (status: '0' -> '2', checked: '1' -> '0')
async function rejectInteraction(event) {
  try {
    const { id, type, reason } = event

    let updateData = {}

    if (type === 'status') {
      // 更新status字段: '0' -> '2'
      updateData.status = '2'
    } else if (type === 'checked') {
      // 更新checked字段: '1' -> '0'
      updateData.checked = '0'
      updateData.status = '2'
    }

    // 添加拒绝理由
    if (reason) {
      updateData.rejectReason = reason
    }

    const result = await db.collection('interactions')
      .doc(id)
      .update({
        data: updateData
      })

    return {
      success: true,
      data: result
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}