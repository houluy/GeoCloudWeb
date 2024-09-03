// 地图在线离线配置
window.mapConfigZ = {
  // 在线底图
  url_mapline: 'http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=f09b5f106ccb1b3172b79dad5bbdfc65',
  // 离线底图
  // url_mapline: '/arcgisServer/tdt/map/{z}/{x}/{y}.png',
  // 在线标注
  url_mapline_bz: 'http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=f09b5f106ccb1b3172b79dad5bbdfc65'
  // 离线标注
  // url_mapline_bz: '/arcgisServer/tdt/mapi/{z}/{x}/{y}.png'
}
// 订单创建时候的注意事项
window.orderSpan = {
  orderOne: '订购数据量超过20GB不支持在线下载',
  orderOneP: [
    '1) 线下拷贝订单必须上传“任务来源说明文件”，“签字后的分发登记表”、“身份证号”、“介绍信”可以在获取数据时现场提供，也可以在线上传，如果选择在线上传，则必须保障获取数据的人员信息与上传附件的人员信息一致，否则不予提供。',
    '2) 在线下载订单必须上传“任务来源说明文件”、“签字后的分发登记表”、“身份证号”、“介绍信”,其中“签字后的分发登记表”必须通过本页"下载"按钮获取后签字上传才有效。',
    '3) 如果以上材料暂未准备好，可以“保存”后关闭本页面，随后在“用户中心\\待提交订单”列表中补充附件。',
    '4) 在线下载订单用户需要在订单状态为“数据准备完成”后14天内进行数据获取，超过14天将不再进行数据提供。',
    '5) 线下拷贝订单用户需要在订单状态为“数据准备完成”后30天内进行数据获取，超过30天将不再进行数据提供。'
  ]
}
// 查询结果列表。采集时间、接收时间切换
window.resultSpanLi = ['采集时间', '数据名称']
// 卫星tree目录，节点名称
window.nodeName = []
// 是否跳转error页面
window.errorHtml = false
// 资料tree目录，节点名称
window.nodeNameSingle = ['航空物探测量','航空物探应用','遥感应用','航空遥感影像','标准产品']
// 资料tree目录，节点名称
window.nodeNameSinglezl = true
// 需要点选查询的卫星节点nodeId “10001/原始影像”
window.nodeIdSerach = ['10001']
// 系统的标识符判别，fw服务，dzy地质云
window.systemName = 'FW' // 'DZY', 'FW'
// todo 内网打开 再加工订单
window.repOrder = false // 再加工订单
// 控制公告显示隐藏 true:显示 false:隐藏
window.ggShow = true
// 控制公告显示文字
window.ggText = '温馨提示：1.订单量超过200GB时，数据获取优选级会自动降为最低，如有特殊需求请联系管理员！2.本网站数据只提供公益性服务，非公益性需求订单不予提供，请理解！' // 控制公告显示内容

// ========================  调查问卷
window.openDataUrl = 'http://wenjuan.ngac.cn/vj/PpNc1j7.aspx'  //跳转地址
window.openDataShow = true  //跳转地址
window.shopXC = true
window.shopXCZL = true
// 地质云登陆
window.LayOutDZY = false
window.directGetData = false
// 配置单个贴图的开放与关闭，数组中写原始影像的nodeId
window.chartletIds = ['100016', '1000311', '100050', '100017', '100051', '100013', '100052', '1000214', '100056', '100053', '100014', '100015', '100055', '100029' ,'100028']
// 配置单个贴图的开放与关闭
window.chartletShow = true
// 订购数据量大小控制 超过这个值就是离线拷贝，不超过就是在线下载，单位：KB
window.orderDataSize = '20971520'
// 航磁等资料信息不能用经纬度查询
window.noCoordinateForNodeId = ['11312','11311','10143','10142','10141','10121','10111','10101','10094','10093','10092','10091']
window.dataPair = {
  "GF701":{
	  "sensorName":"BWD,MUX",
	  "substrBE":"7,40"
  },
  "zy301a":{
	  "sensorName":"NAD,MUX",
	  "substrBE":"12,42"
  },
  "zy302a":{
	  "sensorName":"NAD,MUX",
	  "substrBE":"12,42"
  },
  "zy303a":{
	  "sensorName":"NAD,MUX",
	  "substrBE":"12,42"
  }
}
