import {
  http
} from './request'
export default {
  //用户订单反馈
  userFeedback: (params) => http.postAxios('/api/feedback', params),
  // login
  loginByUsername: (params) => http.postAxios('/systemAA/login/loginForm', params),
  // login
  loginByUsernameDZY: (params) => http.postAxios('/systemAA/login/loginForm', params),
  // loginByToken
  loginByToken: (params) => http.postAxios('/system/login/loginByToken', params),
  // logout
  logout: (params) => http.postAxios('/systemAA/login/logout', params),
  logoutNew: (params) => http.postAxios('/system/login/logoutNew', params),
  // 获取用户信息
  getUserInfo: (params) => http.getAxios('/systemAA/user/userInfo', params),
  // 注册用户
  // registerUser: (params) => http.getAxios('/system/user/registerUser', params),
  // 心跳
  getFrequency: (params) => http.getAxios('/systemAA/login/onlineMonitor', params),
  // 修改部门权限
  updateGroupRights: (params) => http.postAxios('/systemAA/group/updateGroupRights', params),
  // 获取日志信息
  logTable: (params) => http.postAxios('/systemAA/log/page', params),
  // 获取角色的全部权限
  listPermission: (params) => http.getAxios('/systemAA/role/listPermission', params),
  // 修改角色权限
  updateRolePermission: (params) => http.postAxios('/systemAA/role/updateRolePermission', params),
  // 获取权限树结构
  permissionTree: (params) => http.getAxios('/systemAA/permission/permissionTree', params),
  // 修改密码
  changePassword: (params) => http.postAxios('/systemAA/user/updatePassword', params),
  // 获取全部子系统
  getMenuToCS: (params) => http.getAxios('/systemAA/permission/getMenuToCS', params),
  // 初始化用户管理表格和groupId
  // 获取权限分页列表
  permissionPage: (params) => http.getAxios('/systemAA/permission/page', params),
  // 初始化日志类型
  initLogTypes: (params) => http.getAxios('/systemAA/log/initLogTypes', params),
  // 按条件对日志进行统计分析
  statistic: (params) => http.postAxios('/systemAA/log/statistic', params),
  // 获取系统信息和jvm虚拟机信息
  sysInfo: (params) => http.getAxios('/systemAA/monitor/sysInfo', params),
  fileInfo: (params) => http.getAxios('/systemAA/monitor/fileInfo', params),
  cpuInfo: (params) => http.getAxios('/systemAA/monitor/cpuInfo', params),
  // 获取角色分页列表
  rolePage: (params) => http.getAxios('/systemAA/role/page', params),
  // 删除角色
  removeRole: (params) => http.getAxios('/systemAA/role/removeById', params),
  // 添加角色
  saveRole: (params) => http.postAxios('/systemAA/role/save', params),
  // 修改密码
  // changePassword: (params) => http.postAxios('/systemAA/user/updatePassword', params)
  // 获取部门权限
  listRights: (params) => http.getAxios('/systemAA/group/listRights', params),
  // 获取用户管理树
  groupTree: (params) => http.getAxios('/systemAA/group/groupTree', params),
  // 初始化用户管理表格和groupId
  userTable: (params) => http.getAxios('/systemAA/user/page', params),
  // 用户审批
  getApproval: (params) => http.postAxios('/systemAA/user/updateTypeById', params),
  // 用户重置密码
  resetPassword: (params) => http.getAxios('/systemAA/user/resetPassword', params),
  // 更新用户
  userUpdate: (params) => http.postAxios('/systemAA/user/updateById', params),
  // 新增用户
  userSave: (params) => http.postAxios('/systemAA/user/save', params),
  // 删除用户
  userRemove: (params) => http.getAxios('/systemAA/user/removeById', params),
  // 获取角色的全部权限
  listPermiss: (params) => http.getAxios('/systemAA/role/listPermission', params),
  // 获取用户权限
  userListRights: (params) => http.getAxios('/systemAA/user/listRights', params),
  // 物理删除用户
  userPhysicsRemove: (params) => http.getAxios('/systemAA/user/remove', params),
  // 按照角色获取数据权限
  userInitEnums: (params) => http.getAxios('/systemAA/user/initEnums', params),
  updateRolePermiss: (params) => http.postAxios('/systemAA/role/updateRolePermission', params),
  // 修改角色权限
  updateRole: (params) => http.postAxios('/systemAA/role/updateById', params),
  // 获取权限树结构
  permissTree: (params) => http.getAxios('/systemAA/permission/permissionTree', params),
  // 获取用户权限
  userPermission: (params) => http.getAxios('/systemAA/role/list', params),
  // 获取用户所有信息
  userGetById: (params) => http.getAxios('/systemAA/user/getById', params),
  // 获取导航
  getMenu: (params) => http.getAxios('/systemAA/permission/getMenu', params),
  // 获取全部子系统
  getMenuToCSPower: (params) => http.getAxios('/systemAA/permission/getMenuToCS', params),
  // 用户注册
  registerUser: (params) => http.postAxios('/systemAA/user/registerUser', params),
  // 初始化用户管理表格和groupId
  // 获取权限分页列表
  permissPage: (params) => http.getAxios('/systemAA/permission/page', params),
  // 更新权限功能信息
  permissionUpdate: (params) => http.postAxios('/systemAA/permission/updateById', params),
  // 创建权限功能信息
  permissionSave: (params) => http.postAxios('/systemAA/permission/save', params),
  // 删除权限功能信息
  permissionRemove: (params) => http.getAxios('/systemAA/permission/removeById', params),
  // 获取权限信息
  permissionGetById: (params) => http.getAxios('/systemAA/permission/getById', params),
  // 获取部门分页列表
  departmentTable: (params) => http.getAxios('/systemAA/group/page', params),
  // 获取部门信息
  departmentUpdate: (params) => http.postAxios('/systemAA/group/updateById', params),
  // 创建部门信息
  departmentSave: (params) => http.postAxios('/systemAA/group/save', params),
  // 删除部门
  departmentRemove: (params) => http.getAxios('/systemAA/group/removeById', params),
  // 获取部门信息
  groupGetById: (params) => http.getAxios('/systemAA/group/getById', params),
  // 获取系统配置参数
  sysInfolist: (params) => http.getAxios('/systemAA/sysInfo/listSysInfos', params),
  // 通过key系统配置
  sysGetSysInfoByKey: (params) => http.getAxios('/systemAA/sysInfo/getSysInfoByKey', params),
  // 添加系统配置
  sysSaveSysInfo: (params) => http.postAxios('/systemAA/sysInfo/saveSysInfo', params),
  // 通过id删除系统配置
  removeSysById: (params) => http.getAxios('/systemAA/sysInfo/removeById', params),
  // 更新系统配置
  updateSysConfig: (params) => http.postAxios('/systemAA/sysInfo/updateSysInfo', params),
  // 修改用户权限
  updateUserRights: (params) => http.postAxios('/systemAA/user/updateUserRights', params),
  // 用户访问统计 ，插入记录
  insertVisitLog: (params) => http.postAxios('/systemAA/log/insertVisitLog', params),
  // 获取正则表达式
  getRegularRules: (params) => http.getAxios('/systemAA/sysInfo/getRegularRules', params),
  // 角色管理，名称验证唯一性
  listByName: (params) => http.getAxios('/systemAA/role/listByName', params),
  // 用户管理，名称验证唯一性
  getUserByName: (params) => http.postAxios('/systemAA/user/getUserByName', params),
  // menu -- mhd
  // getCatalogTree: (params) => http.getAxios('/mj/queryModuleSpatial/getCatalogTree', params),
  getCatalogTree: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsCatalogTree', params),
  // 地质云目录树获取
  getDzyCatalogTree: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsDzyCatalogTree', params),
  // result 获取条件
  // getQueryTablesFields: (params) => http.getAxios('/mj/queryModuleSpatial/getQueryTablesFields', params),
  getQueryTablesFields: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsQueryTablesFields', params),
  getQueryTablesFields1: (params) => http.getAxios('/mj/queryModuleSpatial/getQueryTablesByNodeIds', params),
  // 加入购物车
  addShop: (params) => http.postAxios('/mj/shop/save', params),
  // 资料-加入购物车
  addAgrsSave: (params) => http.postAxios('/mj/agrsShop/agrsSave', params),
  // 购物车获取
  // getAllShopDataForPage: (params) => http.postAxios('/mj/shop/list', params),
  getAllShopDataForPage: (params) => http.postAxios('/mj/agrsShop/agrsList', params),
  getAllShopDataForAllPage: (params) => http.postAxios('/mj/agrsShop/agrsAllList', params),
  //数据名称删除购物车
  getDeleteShopByDataName: (params) => http.postAxios('/mj/agrsShop/deleteShopByDataName', params),


  // 购物车获取条数获取
  getagrsListCount: (params) => http.postAxios('/mj/agrsShop/agrsListCount', params),
  // 购物车删除
  deleteShop: (params) => http.postAxios('/mj/agrsShop/deleteShopById', params),
  // 获取购物车详情
  queryShopList: (params) => http.getAxios('/mj/shop/getById', params),

  // 获取购物车的显示隐藏状态
  getShopZlStatus: (params) => http.getAxios('/mj/agrsShop/getShopZl', params),

  // result 去执行查询
  getPageList: (params) => http.postAxios('/mj/queryModuleSpatial/getPageList', params),
  // map
  identify: (params) => http.getAxios('/arcgisServer', params),
  // 获取省list
  // getByProvinceList: (params) => http.getAxios('/mj/spatial/getByProvinceList', params),
  getByProvinceList: (params) => http.getAxios('/mj/agrsSpatial/getByProvinceList', params),
  // 获取城市list
  // getByCityList: (params) => http.getAxios('/mj/spatial/getByCityList', params),
  getByCityList: (params) => http.getAxios('/mj/agrsSpatial/getByCityList', params),
  // 获取政区边界wkt
  // getAreaWkt: (params) => http.getAxios('/mj/spatial/getAreaWkt', params),
  getAreaWkt: (params) => http.getAxios('/mj/agrsSpatial/getAreaWkt', params),
  // 获取书签
  getBookList: (params) => http.getAxios('/mj/spatial/listBookmark', params),
  // 添加书签
  addBookList: (params) => http.postAxios('/mj/spatial/saveBookMark', params),
  // 删除书签
  deleteBookList: (params) => http.getAxios('/mj/spatial/removeBookMark', params),



  // // 获取覆盖度
  // getCoverageNum: (params) => http.postAxios('/mj/queryModuleSpatial/findCoverageNum', params),
  // // 获取覆盖度
  // getNoCoverageNum: (params) => http.postAxios('/mj/queryModuleSpatial/findNoCoverageNum', params),
  // 获取覆盖度
  getCoverageNum: (params) => http.postAxios('/mj/agrsSpatial/findCoverageNum', params),
  // 获取覆盖度
  getNoCoverageNum: (params) => http.postAxios('/mj/agrsSpatial/findNoCoverageNum', params),
  // 获取同步任务的列表


  getSyncList: (params) => http.postAxios('/mj/agrsSync/selectSyncTask', params),
  // 获取同步数据源的列表
  getSyncDataList: (params) => http.postAxios('/mj/agrsSync/selectSyncDb', params),
  // 获取同步数据源的列表
  addSyncDb: (params) => http.postAxios('/mj/agrsSync/addSyncDb', params),
  // 获取同步数据源的列表
  updateSyncDb: (params) => http.postAxios('/mj/agrsSync/updateSyncDb', params),
  // 获取同步数据源的列表
  delSyncDb: (params) => http.postAxios('/mj/agrsSync/delSyncDb', params),
  // 获取同步数据源的列表
  testConn: (params) => http.postAxios('/mj/agrsSync/testConn', params),
  // 修改同步任务信息
  updateSyncTask: (params) => http.postAxios('/mj/agrsSync/updateSyncTask', params),
  // 删除同步任务信息
  delSyncTask: (params) => http.postAxios('/mj/agrsSync/delSyncTask', params),


  // 获取数据任务列表
  getOrderTask: (params) => http.postAxios('/mj/agrsOrderTask/selectallTask', params),
  // 获取时间不为空的任务列表
  selectTask: (params) => http.postAxios('/mj/agrsOrderTask/selectTask', params),
  //关联订单列表
  getassociatedOrder: (params) => http.postAxios('/mj/agrsOrder/associatedOrder', params),
  //更改数据任务
  updateTask: (params) => http.postAxios('/mj/agrsOrderTask/updatetask', params),
  //条件查询数据任务的订单
  associatedOrderByID: (params) => http.postAxios('/mj/agrsOrder/associatedOrderByID', params),
  // 条件查询数据任务
  getOrderTaskByid: (params) => http.postAxios('/mj/agrsOrderTask/getByTaskId', params),
  // 获取查询检索-结果
  findQuery: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findAgrsPageList', params),
  findPageQuery: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/findAgrsPagePageList', params),
  findPagePageByNodes: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/findAgrsPagePageListNodes', params),
  findPageQueryByNodes: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findAgrsPageListNodes', params),
  // findQueryCount: (params) => http.getAxios('/mj/queryModuleSpatial/findaddAgrsSavePageListCount', params),
  findQueryCount: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/findAgrsPageListCount', params),
  // 调用合并面算法执行后台合并面
  // findCoverage:/user/getById  (params) => http.postAxios('/mj/queryModuleSpatial/findAllListWkt', params),
  findCoverage: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findAgrsAllListWktForHC', params),
  // 优选结果合并面
  findYxWkt: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/yxWkt', params),
  // 优选移除后结果合并面
  yxWktDelOrAdd: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/yxWktDelOrAdd', params),
  findCoverageByNodes: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findAgrsAllListWktForHCNodes', params),
  getCalCoverage: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsCalCoverage', params),
  getExportShp: (params) => http.getAxios('/mj/agrsCoverage/exportShp', params),
  getExportShpWidthAttributes: (params) => http.postAxios('/mj/agrsCoverage/exportShpWidthAttributes', params),
  getUploadFileZip: (params) => http.postAxios('/mj/agrsCoverage/uploadeFileZip', params),
  getExportCsvWidthAttributes: (params) => http.postAxios('/mj/agrsCoverage/exportCsvWidthAttributes', params),
  // getCalCoverage: (params) => http.getAxios('/mj/queryModuleSpatial/getCalCoverage', params),
  // 查询展示购物车生成订单
  // addOrder: (params) => http.getAxios('/mj/order/addOrder', params),
  addOrder: (params) => http.postAxios('/mj/order/save', params),
 
  // 创建订单
  // createOrder: (params) => http.postAxios('/mj/order/save', params),
  createOrder: (params) => http.postAxios('/mj/agrsOrder/agrsSave', params),
  // 创建常需求订单
  createRuleOrder: (params) => http.postAxios('/mj/agrsOrder/agrsSaveRule', params),
  // 获取订单列表
  // getOrderListForPage: (params) => http.postAxios('/mj/agrsOrder/list', params),
  //航片关联测区
  aerialDetails: (params) => http.postAxios('/mj/cequ/mate', params),
  // 个人订单
  getOrderListForPage: (params) => http.postAxios('/mj/agrsOrder/agrsMyList', params),
  // 管理员订单
  getManOrderListForPage: (params) => http.postAxios('/mj/agrsOrder/agrsList', params),
  // getOrderListForPage: (params) => http.postAxios('/orderAgency/order/list', params),

  // 按照部门获取数据权限
  groupDataPermissionList: (params) => http.postAxios('/mj/groupDataPermission/list', params),
  // 按照部门获取数据权限code  wkt
  groupDataPermissionGetArea: (params) => http.postAxios('/mj/groupDataPermission/getArea', params),
  // 新增部门数据权限
  groupDataPermissionSave: (params) => http.postAxios('/mj/groupDataPermission/update', params),
  // 删除订单
  // deleteOrderById: (params) => http.getAxios('/mj/order/deleteOrderById', params),
  // deleteOrderById: (params) => http.getAxios('/mj/order/deleteOrderById', params),
  deleteOrderById: (params) => http.getAxios('/mj/order/removeOrder', params),
  // 审核订单
  auditOrder: (params) => http.postAxios('/mj/agrsOrder/agrsAudit', params),
  // updateOrderStatusById: (params) => http.postAxios('/orderAgency/order/audit', params),
  // 修改订单状态
  stateOrder: (params) => http.getAxios('/mj/agrsOrder/updateStatusByOrderId', params),
  // 获取订单详情信息
  getOrderDetail: (params) => http.getAxios('/mj/order/getOrderById', params),
  // 获取订单详情数据列表
  // orderDataList: (params) => http.postAxios('/mj/orderdata/list', params),
  orderDataList: (params) => http.postAxios('/mj/agrsOrderData/agrsList', params),
  // 修改订单
  orderUpdate: (params) => http.postAxios('/orderAgency/order/update', params),
  // 修改订单状态
  orderUpdateStatus: (params) => http.postAxios('/orderAgency/order/updateStatus', params),
  // 订单下载
  orderdataDownload: (params) => http.getAxios('/mj/orderdata/download', params),
  
  // hangYao的接口
  // 任务服务-列表获取
  queryServicesList: (params) => http.getAxios('/mhd/api/sys/open/service/query_like', params),
  // 任务服务-左目录树获取
  getCategoryTree: (params) => http.postAxios('/mhd/api/sys/open/service/category', params),
  // 新闻中心-首页
  getNewsIndex: (params) => http.postAxios('/mj/news/getNewsByNum', params),
  // 新闻中心-最新新闻
  getLateNews: (params) => http.postAxios('/mj/news/getTopTen', params),
  // 新闻中心-图片轮播
  getNewsPic: (params) => http.postAxios('/mj/meta/getImage', params),
  // 新闻中心-最新数据产品
  getNewsPro: (params) => http.postAxios('/mj/meta/getMetaTopNew', params),
  // 新闻中心-最新订购情况
  getNewsOrder: (params) => http.postAxios('/mj/agrsOrder/getOrderMessageTopNew', params),
  // 新闻中心-今日订购数量
  getNewsOrderToday: (params) => http.postAxios('/mj/agrsOrder/orderNumDay', params),
  // 新闻中心-总订购数
  getNewsOrderAll: (params) => http.postAxios('/mj/agrsOrder/orderNumAll', params),
  // 新闻中心-最新服务展示
  getNewsServices: (params) => http.postAxios('/mhd/service/getServicesTopNew', params),
  // 分页获取新闻列表
  getNewList: (params) => http.postAxios('/mj/news/page', params),
  // 获取新闻类型
  getNewsTypeList: (params) => http.postAxios('/mj/newsType/pageList', params),
  // 新闻添加
  newsSave: (params) => http.postAxios('/mj/news/save', params),
  // 获取单个新闻-通过唯一id
  getNewsById: (params) => http.postAxios('/mj/news/getById', params),
  // 修改新闻
  updateNewsById: (params) => http.postAxios('/mj/news/updateById', params),
  // 删除新闻-通过唯一id
  removeNewsById: (params) => http.postAxios('/mj/news/removeById', params),
  // 批量删除新闻
  removeNewsByIds: (params) => http.postAxios('/mj/news/removeByIds', params),
  // 发布新闻
  publishNews: (params) => http.postAxios('/mj/news/publish', params),
  // 撤销新闻
  cancelNews: (params) => http.postAxios('/mj/news/cancel', params),
  // 获取订单列表
  // getOrderListForPage: (params) => http.getAxios('/mhd/order/getOrderListForPage', params),
  // getOrderListForPage: (params) => http.postAxios('/orderAgency/order/list', params),
  // 删除订单
  // deleteOrderById: (params) => http.getAxios('/mhd/order/deleteOrderById', params),
  // deleteOrderById: (params) => http.getAxios('/orderAgency/order/remove', params),
  // 审核订单
  updateOrderStatusById: (params) => http.getAxios('/mhd/order/auditOrderById', params),
  // 获取订单详情信息
  getOrderDataForPage: (params) => http.getAxios('/mhd/order/getOrderDataForPage', params),
  
  getOrderUser: () => http.getAxios('/mhd/order/getOrderUser'),
  
  // 修改角色权限
  // userDataPermissionSave: (params) => http.postAxios('/mj/userDataPermission/update', params),
  userDataPermissionSave: (params) => http.postAxios('/mj/agrsUserDataPermission/update', params),
  userDataPermissionData: (params) => http.postAxios('/mj/agrsUserDataPermission/list', params),

  // getCatalogTreeForPermission: (params) => http.getAxios('/mj/queryModuleSpatial/getCatalogTreeForPermission', params),
  getCatalogTreeForPermission: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getCatalogTreeForPermission', params),
  userDataPermissionGetArea: (params) => http.postAxios('/mj/userDataPermission/getArea', params),
  userDataPermissionList: (params) => http.postAxios('/mj/userDataPermission/list', params),
  
  // 任务监控
  taskMonitoring: (params) => http.getAxios('/mj/monitor/list', params),
  // 项目-资料基本信息
  materialInfo: (params) => http.getAxios('/material/Archive/TB_MLSX/GetList', params),
  // 资料文件列表
  materialFile: (params) => http.getAxios('/material/Archive/TB_FILEINFO/GetLis', params),

  // 获取影像详情信息
  getAgrsObjectById: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsObjectById', params),
  // 获取卫星影像详情信息
  getAgrsObjectByIdForMETA: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsObjectByIdForMETA', params),
  // 获取单个节点条件配置数据
  getByNodeId: (params) => http.postAxios('/mj/conditionsconfig/getByNodeId', params),
  // 修改单个节点条件配置数据
  updateByNodeId: (params) => http.postAxios('/mj/conditionsconfig/updateByNodeId', params),
  //shp转wkt
  wktfromshp: (params) => http.postAxios('/mj/agrsOrderTask/wktfromshp', params),
  // 地图服务
  serverBaseinfo: (params) => http.getAxios('/mhd/api/sys/open/service/query_like_back', params),
  deleteserverInfo: (params) => http.deleteAxios('/mhd/api/sys/open/service/delete_back/', params),
  editserverInfo: (params) => http.getAxios('/mhd/api/sys/open/service/back', params),
  logoutserverInfo: (params) => http.deleteAxios('/mhd/api/sys/open/service/delete/', params),
  reserverInfo: (params) => http.deleteAxios('/mhd/api/sys/open/service/recover/', params),
  getserverInfo: (params) => http.getAxios('/mhd/api/sys/open/categories', params),
  servierSingleId: (params) => http.getAxios('/mhd/api/sys/service/shippingId', params),
  servierSinglePost: (params) => http.postAxios('/mhd/api/sys/order/create/', params),
  servierSingle: (params) => http.getAxios('/mhd/api/sys/open/service/pre/', params),

  // 用户订单统计
  queryStaDatas: (params) => http.postAxios('/mj/agrsOrder/agrsStatisticsByOrderType', params),
  // 获取城市级别联动
  getAreaCode: (params) => http.getAxios('/mj/agrsArea/get', params),
  // 获取用户订单类别数量
  getOrderStatis: (params) => http.getAxios('/mj/agrsOrder/getOrderStatis', params),
  // 订单统计
  statisticalDataDistribution: (params) => http.postAxios('/mj/order/statisticalDataDistribution', params),
  statisticalDataCoverageDistribution: (params) => http.postAxios('/mj/coverage/statisticalDataCoverageDistribution', params),
  createDataCoverageDistribution: (params) => http.postAxios('/mj/coverage/createDataCoverageDistribution', params),
  getSourceListBySourceIds: (params) => http.postAxios('/mj/AgrsSpacial/queryId', params),
  // 航遥中心单点登录验证
  getCodeData: (params) => http.getAxios('/mj/ssoLogin/getCodeData', params),
  getTokenData: (params) => http.getAxios('/mj/ssoLogin/getTokenData', params),
  getLogoutUrl: (params) => http.getAxios('/mj/ssoLogin/getLogoutUrl', params),

  // 订单附件下载saveOrUpdateQueryFiled
  orderAttachementDownload: (params) => http.postAxios('/mj/agrsOrderAttachement/download', params),
  orderAttachementGetByOrderId: (params) => http.getAxios('/mj/agrsOrderAttachement/getByOrderId', params),
  updateStatusByIdAndManual: (params) => http.getAxios('/mj/agrsOrder/updateStatusByIdAndManual', params),
  // 查询目录树
  getAgrsCatalogTree: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsCatalogTree', params),
  getOrderShopSize: (params) => http.postAxios('/mj/agrsShop/agrsOrderShopSize', params),
  getDeriveShopDate: (params) => http.getAxios('/mj/agrsShop/deriveShopDate', params),
  getagrsSaveFiles: (params) => http.postAxios('/mj/agrsOrder/agrsSaveFiles', params),
  // 获取县list
  getByCountyList: (params) => http.getAxios('/mj/agrsSpatial/getByCountyList', params),
  // 失败数据重新提取
  getAgrsGetDataAgainAll: (params) => http.postAxios('/mj/agrsOrder/agrsGetDataAgainAll', params),
  // getfindNewTimeByNodeName: (params) => http.postAxios('mj/agrsQueryModuleSpatial/findNewTimeByNodeName', params),
  // 最新接受时间获取
  getfindNewTimeByNodeName: (params) => http.postAxios('mj/agrsQueryModuleSpatial/findNewTime', params),
  // getfindNewTimeByNodeName: (params) => http.postAxios('mj/agrsQueryModuleSpatial/findNewTimeByNodeName', params),
  // 订单数据列表查看
  getagrsListOfSate: (params) => http.postAxios('/mj/agrsOrderData/agrsListOfSate', params),
  // 订单数据附件获取
  getByOrderIdFile: (params) => http.getAxios('/mj/agrsOrderAttachement/getByOrderId', params),
  // 订单数据属性修改
  getagrsUpdateSave: (params) => http.postAxios('/mj/agrsOrder/agrsUpdateSave', params),
  // 订单数据附件信息修改
  updateOrderFileList: (params) => http.postAxios('/mj/agrsOrder/updateOrderFileList', params),
  // 订单数据附件下载
  getOrderFileByOrderId: (params) => http.getAxios('/mj/agrsOrderAttachement/getOrderFileByOrderId', params),
  // 查询数据-数据覆盖面导出
  getDeriveShopDateOnlyShp: (params) => http.postAxios('/mj/agrsShop/deriveShopDateOnlyShp', params),
  getderiveShopDateOnlyShpByNew: (params) => http.postAxios('/mj/agrsShop/deriveShopDateOnlyShpByNew', params),
  // 查询导出落图任务的进度状态
  getLuotuStatus: (params) => http.getAxios('/mj/agrsShop/getLuotuUrl', params),
  // 获取任务id
  getUUid: (params) => http.getAxios('/mj/agrsShop/getUUid', params),
  // 获取订单编号
  getOrderNameListByOrderName: (params) => http.getAxios('/mj/agrsOrder/agrsOrderNameListByOrderName', params),
  // 获取申请单位
  getagrsGroupNameList: (params) => http.postAxios('/mj/agrsOrder/agrsGroupNameList', params),
  // 修改订单状态-非物理删除
  getUpdateOrderStatus: (params) => http.postAxios('/mj/agrsOrder/agrsUpdateOrderStatusByOrderNames', params),
  // 未匹配数据导出 - 景号
  getNotDataListSceneId: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findAgrsPageNotDataList', params),
  // 订购用户数据获取
  getsubscriberData: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findAgrsPageNotDataList', params),
  // 删除订购用户
  getDeletsubscriberData: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findAgrsPageNotDataList', params),
  // 添加订阅用户
  saveAgrsFtp: (params) => http.postAxios('/mj/agrsFtp/agrsSave', params),
  // 获取订阅用户列表
  getagrsList: (params) => http.postAxios('/mj/agrsFtp/agrsList', params),
  // 删除订阅用户
  deleteFtpByIds: (params) => http.getAxios('/mj/agrsFtp/deleteFtpByIds', params),
  // 编辑订阅用户
  agrsUpdateSave: (params) => http.postAxios('/mj/agrsFtp/agrsUpdateSave', params),
  // 创建订阅订单数据
  saveAgrsSubscribe: (params) => http.postAxios('/mj/agrsSubscribe/agrsSave', params),
  // ==============================环保云的订阅订单的集成
  // 子任务展示
  listByTaskId: (params) => http.postAxios('/pushXg/secmep/subTask/listByTaskId', params),
  // 任务数据操作
  taskOperation: (params) => http.postAxios('/pushXg/secmep/task/taskOperation', params),
  // 展示任务列表
  listTask: (params) => http.postAxios('/pushXg/secmep/task/listTask', params),
  // 展示任务列表
  listDepartment: (params) => http.postAxios('/pushXg/secmep/task/listDepartment', params),
  // 获取等级  卫星类型   传感器类型
  getDataallstatistics: (params) => http.postAxios('/pushXg/secmep/dictionary/getSateInfos', params),
  // 获取ftp数据
  getDatabaseftp: (params) => http.postAxios('/pushXg/secmep/ftpManager/listByDepartment', params),
  // 行政区划查询
  listByCode: (params) => http.postAxios('/pushXg/secmep/xzqManager/listByCode', params),
  // 测试ftp连接
  connect: (params) => http.postAxios('/pushXg/secmep/ftpManager/connect', params),
  // 添加任务
  saveTask: (params) => http.postAxios('/pushXg/secmep/task/saveTask', params),
  // 获取传感器类型
  getDataSourceByPid: (params) => http.postAxios('/pushXg/secmep/dictionary/listSensorsBySatellite', params),
  // 获取每一条数据信息
  getEntityByDataId: (params) => http.postAxios('/pushXg/secmep/metadata/getEntityByDataId', params),
  // 获取子任务数据信息
  listBySubTaskId: (params) => http.postAxios('/pushXg/secmep/taskInfo/listBySubTaskId', params),
  // 接收系统数据展示
  listByTaskIdRe: (params) => http.postAxios('/pushXg/secmep/taskInfo/listByTaskId', params),
  // 获取传感器-对应title
  getSensortrans: (params) => http.getAxios('/mj/sensortranslation/page', params),
  // 订单数据下载
  downOrderData: (params) => http.getAxios('/mj/agrsOrderData/downloadConfirm', params),
  // 订单数据下载
  resetOrder: (params) => http.postAxios('/pushXg/secmep/task/resetOrder', params),
  // ===================资料下载=======================
  // 资料数据获取
  getZLtabelD: (params) => http.postAxios('/mj/ZLnews/page', params),
  // 资料下载
  getExportData: (params) => http.postAxios('/mj/zzzzzz', params),
  // 获取userid
  getUserIdByLoginName: (params) => http.postAxios('/mj/agrsOrder/getUserIdByLoginName', params),
  // 获取用户是否在线
  getCheckUserOnLine: (params) => http.postAxios('/mj/agrsOauthAccessTokenController/checkUserOnLine', params),
  // 订阅用户ftp地址校验
  checkFtp: (params) => http.postAxios('/mj/agrsFtp/checkFtp', params),
  //
  listData: (params) => http.postAxios('/mj/agrsFtp/listData', params),
  // 检测注册用户名是否存在
  checkUserIsIn: (params) => http.postAxios('/mj/agrsUserDataPermission/checkUserIsIn', params),
  // 检测用户是否免审 0是免审核 1是需要审核
  getUserIsAudited: (params) => http.postAxios('/mj/agrsUserDataPermission/getUserIsAudited', params),
  // 单条数据覆盖导出
  deriveShopDateOnlyShpOne: (params) => http.getAxios('/mj/agrsShop/deriveShopDateOnlyShpOne', params),
  // 删除用户
  deleteTokenByUserName: (params) => http.postAxios('/mj/agrsOauthAccessTokenController/deleteTokenByUserID', params),
  // 删除用户
  agrsGetOrderOldFile: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderOldFile', params),
  // 上传shp，将wkt转成sql形式
  getWKTToSQL: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/getWKTToSQL', params),
  // 验证查询数据是否有在购物车
  checkMeansInShopByIds: (params) => http.postAxios('/mj/agrsShop/checkMeansInShopByIds', params),
  // 查询列表中，对以加入购物车的数据通过id进行删除 String dataid, Long userid
  deleteShopByDataIdUserId: (params) => http.postAxios('/mj/agrsShop/deleteShopByDataIdUserId', params),
  // 给后台传送，用户客户端ip，用户名称，进入系统时间以及离开系统时间
  getTimepvuv: (params) => http.postAxios('/mj/agrsShop/getTimepvuv', params),
  // 获取在线订单数、在线订单数据量、离线订单数、离线订单数据量
  getOrderNumByOL: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderNumByOL', params),
  // getOrderNumByOLNew: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderNumByOLNew', params),
  // cmm 20241004 新增接口
  getOrderNumByOLNew: (params) => http.postAxios('http://127.0.0.1:9999/get_order_count', params),
  agrsGetOrderNumByMonth: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderNumByMonth', params),
  // 获取单位名称、在线订单数、在线订单数据量、离线订单数、离线订单数据量
  getOrderNumByUnit: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderNumByUnit', params),
  //获取月份、卫星、景数、数据量
  GetOrderDataReceive: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderDataReceive', params),
  GetOrderDataSumReceive: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderDataSumReceive', params),
  // 获取time、数据下载量、数据下载景数,
  getOrderNumByDay: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderNumByDay', params),
  // 获取列表信息含在线离线总量
  getOrderNumByLB: (params) => http.postAxios('/mj/agrsOrder/agrsOrder/agrsGetOrderNumByLB', params),
  // 获取项目名、数据下载量、数据下载景数
  getOrderNumByApplyUserUsed: (params) => http.postAxios('/mj/agrsOrder/agrsGetOrderNumByApplyUserUsed', params),
  // =========================用户行为分析上报=====================
  // 获取项目名、数据下载量、数据下载景数
  postSaveUserBehavior: (params) => http.postAxios('/mj/userBehavior/saveUserBehavior', params),
  // 用户行为分析
  postUserBrowseList: (params) => http.postAxios('/mj/userBehavior/getUserBrowseList', params),
  // 用户行为分析--前一天和上周期对比
  postUserBrowseCount: (params) => http.postAxios('/mj/userBehavior/getUserBrowseCount', params),
  // =============================================================
  // =========================订单优秀级设置=====================
  // 订单优先级设置-修改优先级
  postAgrsUpdataOrderSOrder: (params) => http.postAxios('/mj/agrsOrder/agrsUpdataOrderSOrder', params),
  // 订单详情查询优先级修改日志
  // postAgrsList: (params) => http.postAxios('/mj/agrsOrder/agrsList', params),
  // =============================================================
  wktManager: '/pushXg/secmep/wktManager/upload',
  // 订单详情合并后的wkt获取
  getMaxPolygon: (params) => http.postAxios('/mj/agrsOrderData/getMaxPolygon', params),
  // 原始影像传感器数据获取
  getAgrsCatalogListByUid: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsCatalogListByUid', params),
  // tree_分表变率，分级级数据获取
  getResolutionpower: (params) => http.getAxios('/mj/agrsQueryModuleSpatial/getAgrsCatalogListByUidResolutionpower', params),
  // ==============================目录配置接口=======================
  // 获取目录树
  getMLAgrsCatalogTree: (params) => http.getAxios('/mj/agrsCatalog/getAgrsCatalogTree', params),
  // 获取子节点
  getAgrsCatalogListByParameter: (params) => http.postAxios('/mj/agrsCatalogNode/getAgrsCatalogListByParameter', params),
  // 所属目录
  getAgrsCatalogNameGroup: (params) => http.getAxios('/mj/agrsCatalog/getAgrsCatalogNameGroup', params),
  // 获取查询分类
  getAgrsCatalogGroup: (params) => http.getAxios('/mj/agrsCatalog/getAgrsCatalogGroup', params),
  // 获取数据关联表
  getAgrsCatalogNodeAllTable: (params) => http.getAxios('/mj/agrsCatalogNodeTable/getAgrsCatalogNodeAllTable', params),
  // 添加新目录-第一个接口
  AddAgrsCataLogNode: (params) => http.postAxios('/mj/agrsCatalogNode/AddAgrsCataLogNode', params),
  // 添加新目录-第二个接口
  AddAgrsCataLogNodeTable: (params) => http.postAxios('/mj/agrsCatalogNodeTable/AddAgrsCataLogNodeTable', params),
  // 添加新目录-第三个接口
  addCatalogsave: (params) => http.postAxios('/mj/sensortranslation/save', params),
  // 删除子节点
  deleteAgrsCataLogNodeByNodeid: (params) => http.postAxios('/mj/agrsCatalogNode/deleteAgrsCataLogNodeByNodeid', params),
  // 删除父节点
  deleteAgrsCataLogByCatalogids: (params) => http.postAxios('/mj/agrsCatalog/deleteAgrsCataLogByCatalogids', params),
  // 获取根节点
  AddAgrsCataLogN: (params) => http.postAxios('/mj/agrsCatalog/AddAgrsCataLog', params),
  // 修节点属性==========================================
  // 通过获取节点属性值--叶子节点
  getAgrsCatalogNodeTableByNodeId: (params) => http.postAxios('/mj/agrsCatalogNodeTable/getAgrsCatalogNodeTableByNodeId', params),
  // 通过获取节点属性值--父节点
  getAgrsCataLogByCatalogId: (params) => http.postAxios('/mj/agrsCatalog/getAgrsCataLogByCatalogId', params),
  // 通过获取节点属性值
  getCatalogPage: (params) => http.getAxios('/mj/sensortranslation/page', params),
  // 修改节点属性基本属性值--叶子节点
  UpdateAgrsCataLogNodeByNodeId: (params) => http.postAxios('/mj/agrsCatalogNode/UpdateAgrsCataLogNodeByNodeId', params),
 // 修改节点属性基本属性值--父节点
  UpdateAgrsCataLogByCatalogId: (params) => http.postAxios('/mj/agrsCatalog/UpdateAgrsCataLogByCatalogId', params),
  // 修改节点属性关联表属性值
  UpdateAgrsCataLogNodeTableByNodeId: (params) => http.postAxios('/mj/agrsCatalogNodeTable/UpdateAgrsCataLogNodeTableByNodeId', params),
  // 修改传感器-前-删除已有的-传感器数据
  removeCataByNodeId: (params) => http.postAxios('/mj/sensortranslation/removeByNodeId', params),
  // tree拖动排序
  updateAgrsCataLogOrder: (params) => http.postAxios('/mj/agrsCatalogNode/UpdateAgrsCataLogOrder', params),
  // ============================目录展示查询======================
  // 查询nodeId对应所有字段名称
  getAllTableRowByNodeId: (params) => http.postAxios('/mj/agrsDisplayFiled/getAllTableRowByNodeId', params),
  // 查询字段的配置条件
  getDisplayFiledByNodeId: (params) => http.postAxios('/mj/agrsDisplayFiled/getDisplayFiledByNodeId', params),
  // 结果展示列表删除
  deleteDisplayFiled: (params) => http.postAxios('/mj/agrsDisplayFiled/deleteDisplayFiled', params),
  // 通过nodeid获取table表名
  getTableNameByNodeId: (params) => http.postAxios('/mj/agrsDisplayFiled/getTableNameByNodeId', params),
  // 结果展示字段更新保存
  saveOrUpdateDisplayFiled: (params) => http.postAxios('/mj/agrsDisplayFiled/saveOrUpdateDisplayFiled', params),
  // 查询展示字段更
  getAllQueryTableRowByNodeId: (params) => http.postAxios('/mj/agrsQueryFiled/getAllTableRowByNodeId', params),
  // 查询展示字段更新保存
  saveOrUpdateQueryFiled: (params) => http.postAxios('/mj/agrsQueryFiled/saveOrUpdateQueryFiled', params),
  // 查询展示获取
  getQueryFiledByNodeId: (params) => http.postAxios('/mj/agrsQueryFiled/getQueryFiledByNodeId', params),
  // 详情展示字段更新保存
  getAllNodeTableRowByNodeId: (params) => http.postAxios('/mj/agrsNodeFiled/getAllTableRowByNodeId', params),
  // 详情字段的配置条件
  getNodeFiledByNodeId: (params) => http.postAxios('/mj/agrsNodeFiled/getNodeFiledByNodeId', params),
  // 详情展示字段更新保存
  saveOrUpdateNodeFiled: (params) => http.postAxios('/mj/agrsNodeFiled/saveOrUpdateNodeFiled', params),
  // 修改根目录数据
  getAgrsCatalogListTree: (params) => http.postAxios('/mj/agrsCatalogNode/getAgrsCatalogListTree', params),
  // ========================================= 模板导出==================================
  // 导出结果列表配置模板
  expDisplayFiledForExcel: (params) => http.postAxios('/mj/agrsDisplayFiled/expDisplayFiledForExcel', params),
  // 导入结果列表配置模板
  impDisplayFiledForExcel: (params) => http.postAxios('/mj/agrsDisplayFiled/impDisplayFiledForExcel', params),
  // 导出详情列表配置模板
  expNodeFiledForExcel: (params) => http.postAxios('/mj/agrsNodeFiled/expNodeFiledForExcel', params),
  // 导入详情列表配置模板
  impNodeFiledForExcel: (params) => http.postAxios('/mj/agrsNodeFiled/impNodeFiledForExcel', params),
  // 导出查询列表配置模板
  expQueryFiledForExcel: (params) => http.postAxios('/mj/agrsQueryFiled/expQueryFiledForExcel', params),
  // 导入查询列表配置模板
  impQueryFiledForExcel: (params) => http.postAxios('/mj/agrsQueryFiled/impQueryFiledForExcel', params),
  // 全部导出数据
  deriveShpByNewByOrderId: (params) => http.postAxios('/mj/agrsShop/deriveShpByNewByOrderId', params),

  // ===================================再加工的产品级别获取=============
  // 导入查询列表配置模板=======吉威接口
  // listProcess: (params) => http.getAxios('/JWRG' + window.Geourl, params),
  // 导入查询列表配置模板
  listProcess: (params) => http.getAxios('/JWRG/tmcs/actGeBytearray/listProcess', params),
  // 修改目录子节点
  updateAgrsCataLog: (params) => http.postAxios('/mj/agrsCatalog/updateAgrsCataLog', params),
// ===================================订单反馈=============
  // 添加订单反馈信息
  agrsOrderFeedBack: (params) => http.postAxios('/mj/agrsOrder/agrsOrderFeedBack', params),
  // 查询空间范围的判断是否在限制区域内。
  searchArea: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/searchArea', params),
  // 查询空间范围的判断是否在限制区域内。
  getWktInfo: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/getWktInfo', params),
  // 初始化wkt。
  getWktInfoHome: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/getWktInfoHome', params),
  // 获取元数据列表
  getMetadata: (params) => http.postAxios('/mj/agrsMetadate/getMetadata', params),
  // 导出元数据。
  metadataExport: (params) => http.postAxios('/mj/agrsMetadate/metadataExport', params),

  //推送用户管理
  // 推送用户列表。
  listUserAddress: (params) => http.postAxios('/mj/agrsUserPushAddress/list', params),
  // 推送用户更新。
  updateUserAddress: (params) => http.postAxios('/mj/agrsUserPushAddress/updateById', params),
  // 推送用户保存。
  saveUserAddress: (params) => http.postAxios('/mj/agrsUserPushAddress/save', params),
  // 推送用户获取。
  getUserAddress: (params) => http.postAxios('/mj/agrsUserPushAddress/getById', params),
  // 推送用户删除。
  removeUserAddress: (params) => http.postAxios('/mj/agrsUserPushAddress/removeById', params),
  // 推送用户启用。
  powerUserAddress: (params) => http.postAxios('/mj/agrsUserPushAddress/powerById', params),
  // 推送用户禁用。
  lockUserAddress: (params) => http.postAxios('/mj/agrsUserPushAddress/lockById', params),
  // 推送用户检测。
  addressCheck: (params) => http.postAxios('/mj/agrsUserPushAddress/addressCheck', params),
  // 用户地址分页
  userAddressPage: (params) => http.getAxios('/mj/agrsUserPushAddress/page', params),
  // 用户地址
  getPushAddressdByLoingName: (params) => http.getAxios('/mj/agrsUserPushAddress/getPushAddressdByLoingName', params),
  // 用户分页
  userPage: (params) => http.getAxios('/mj/agrsUserPushAddress/userPage', params),
  // 推送用户列表
  listByLoginName: (params) => http.getAxios('/mj/agrsUserPushAddress/getByLoginName', params),

  // 资料查询使用。
  findNewAgrsAllListWktForHCNodes: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findNewAgrsAllListWktForHCNodes', params),
  // 资料查询使用。
  findNewAgrsAllListWktForHC: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findNewAgrsAllListWktForHC', params),
  // 资料查询使用。
  findNewAgrsPageList: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findNewAgrsPageList', params),
  // 资料查询使用。
  findNewAgrsPageListNodes: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findNewAgrsAllListWktForHCNodes', params),

  // 获取单位列表。
  getUnitList: (params) => http.postAxios('/mj/agrsGroup/getUnitList', params),
  // 新增单位。
  addUnit: (params) => http.postAxios('/mj/agrsGroup/setUnit', params),

  // 获取磁盘名称列表。
  offLineDiskList: (params) => http.postAxios('/mj/agrsOrderData/offLineDiskList', params),
  // 修改该磁盘状态。
  updateDiskStatus: (params) => http.postAxios('/mj/agrsOrderData/updateDiskStatus', params),
  // 优选查询。
  findNewAgrsAllListWktForHCNodesYX: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findNewAgrsAllListWktForHCNodesYX', params),
  findNewAgrsAllListWktForHCNodesYXAll: (params) => http.postAxios('/mj/agrsQueryModuleSpatial/findNewAgrsAllListWktForHCNodesYXAll', params),
  // 导出优选未覆盖面接口
  deriveYxNo: (params) => http.postAxios('/mj/agrsShop/deriveYxNo', params),
}
