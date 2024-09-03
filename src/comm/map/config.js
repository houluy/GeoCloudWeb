/*eslint-disable*/
export const baseMapInitParameters = {
  "view": {
    // 设置地图中心
    // center: [85.3, 41.3271],
    center: [106.55, 29.57],
    // 指定投影使用EPSG:4326一个等同于WGS84坐标系
    projection: 'EPSG:4326',
    zoom: 5,
    minZoom: 4,
    maxZoom: 19
  },
  "layers": [
    {
      "name": "矢量",
      "layerName": "pb",
      "layerUrl": "/acgisServer/tdt/map/{z}/{x}/{y}.png",
      "layerType": "XYZ",
      "visible": true
    },
    {
      "name": "矢量",
      "layerName": "pbi",
      "layerUrl": "/acgisServer/tdt/mapi/{z}/{x}/{y}.png",
      "layerType": "XYZ",
      "visible": true
    }
  ],
}
