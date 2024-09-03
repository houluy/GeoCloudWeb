'use strict'
import Vue from 'vue'
import http from '@comm/service/interface.js'
let v = new Vue()
// 设置按钮权限
export function hasPermission (permission) {
  if (localStorage.getItem('authorities')) {
    let allBtnPermission = JSON.parse(localStorage.getItem('authorities'))
    // console.log(allBtnPermission)
    return allBtnPermission.indexOf(permission) > -1
  } else {
    return false
  }
}
// 初始化部门树
export function initGroupTree (pid, callback) {
  http.groupTree({pid}).then(res => {
    if (res.data) {
      callback(res)
    }
  })
}
// 获取当前用户所属部门
export function handleUserGroup (id, callback) {
  http.userGetById({id}).then(res => {
    if (res.data) {
      callback(res)
    }
  })
}
// 购物车数据删除和批量删除
export function orderBatchDelete (shopId, callbackFunction) {
  v.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  }).then(() => {
    http.deleteShop(shopId).then(res => {
      if (res.data) {
        v.$message({
          message: '删除成功！',
          type: 'success'
        })
        callbackFunction()
      } else {
        v.$message.error('删除失败！')
      }
    }, (resp) => {
      v.$message.error('请求失败！')
    })
  }).catch(() => {
    v.$message({
      type: 'info',
      message: '已取消删除'
    })
  })
}
// 购物车数据删除和批量删除
export function changeFixedPageSizeZ (treeHeight, h) {
  return parseInt(treeHeight / h)
}
// 购物车数据删除和批量删除
export function formatTime (number, format) {
  let time = new Date(number)
  let newArr = []
  let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
  newArr.push(time.getFullYear())
  newArr.push(formatNumber(time.getMonth() + 1))
  newArr.push(formatNumber(time.getDate()))
  newArr.push(formatNumber(time.getHours()))
  newArr.push(formatNumber(time.getMinutes()))
  newArr.push(formatNumber(time.getSeconds()))

  for (let i in newArr) {
    format = format.replace(formatArr[i], newArr[i])
  }
  return format
}
// 格式化日期，如月、日、时、分、秒保证为2位数
function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
