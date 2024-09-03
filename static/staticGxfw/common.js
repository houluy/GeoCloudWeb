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
window.nodeName = ['航空物探测量']
// 是否跳转error页面
window.errorHtml = false
// 资料tree目录，节点名称
window.nodeNameSingle = []
// 资料tree目录，节点名称
window.nodeNameSinglezl = true
// 需要点选查询的卫星节点nodeId “10001/原始影像”
window.nodeIdSerach = ['10001']
// 系统的标识符判别，fw服务，dzy地质云
window.systemName = 'FW' // 'DZY', 'FW'
// todo 内网打开 再加工订单
window.repOrder = true // 再加工订单
// 控制公告显示隐藏 true:显示 false:隐藏
window.ggShow = false
// 控制公告显示文字
window.ggText = '3月17日--3月24日，因网络和存储进行升级维护，暂停卫星影像实体数据在线下载和离线提供服务，请谅解！' // 控制公告显示内容

// 吉威产品级别接口
window.Geourl = '/tmcs/actGeBytearray/listProcess'

// 任务创建-提取要素
window.taskDefExtractingElements = [
  // {value: '', label: '无'},
  {value: '铜', label: '铜'},
  {value: '铁', label: '铁'}
]

// 任务创建-子类数据级别
window.SubDataLevel = [
  // {value: '', label: '无'},
  {value: 4, label: '光学4级'},
]
