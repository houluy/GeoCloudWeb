/* eslint-disable */
import "ol/ol.css";
import Map from "ol/Map"
import store from '@comm/store/index.js'
import Vue from 'vue/dist/vue.esm.js'
import http from '@comm/service/interface.js'
import View from "ol/View"
import Overlay from 'ol/Overlay'
import Fill from "ol/style/Fill"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import Circle from "ol/style/Circle"
import Draw from "ol/interaction/Draw"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import {
  createBox
} from "ol/interaction/Draw"
import Polygon from "ol/geom/Polygon"
import LineString from "ol/geom/LineString"
import Point from "ol/geom/Point"
import Feature from "ol/Feature"

import {
  unByKey
} from "ol/Observable"
import ImageLayer from 'ol/layer/Image'
import Icon from 'ol/style/Icon'
import {
  getCenter,
  getHeight
} from 'ol/extent.js'
import Projection from 'ol/proj/Projection'
import Static from 'ol/source/ImageStatic'
import ImageArcGISRest from 'ol/source/ImageArcGISRest'
import {Message} from 'element-ui'
import MousePosition from 'ol/control/MousePosition'
import FullScreen from 'ol/control/FullScreen'
import layerUtils from './lib/layerUtils'
import featureUtils from './lib/featureUtils'
import calcUtils from "./lib/calcUtils"
import {createStringXY} from 'ol/coordinate'

import $ from 'jquery'
// import Cesium from 'cesium/Cesium'
// import 'cesium/Widgets/widgets.css'
var Cesium = null
/**
 * openlayer5.3 ,Cesium1.66地图核心js
 */
//var baseMapLayers=[];//基础底图图层
//var specialMapLayers=[];//专题地图图层
//var contrastMapLayers=[];//对比地图图层
//var featureLayers=[];//要素地图图层

//zIndex说明
//0-10级地图底图
//11-30专题图
//31-40标绘地图

// 可动态实例化的 地图对象 ，封装，地图创建，图层控制常用函数，测量，基础工具
// modify by dlw 2020-02-10 08:45
export default class GISMap {
  version = '0.3.1' //组件版本
  //初始化一些属性
  //绘制使用 的数据源
  drawSource = new VectorSource({  wrapX: false  })
  //测量使用 的数据源
  measureSource = new VectorSource()
  featuresSource = new VectorSource()
  featuresSourceAllImage = new VectorSource() //标绘图层每页的景
  featuresSourcePageImage = new VectorSource()//标绘图层
  featureSHPSource =  new VectorSource()//shp图层
  drawInfo =
    {
       "isDraw": false,
        "sketch": null,//当前绘制的要素（Currently drawn feature.）
        "helpTooltipElement": null,//帮助提示框对象（The help tooltip element.）
        "helpTooltip": null,//帮助提示框显示的信息（Overlay to show the help messages.）
    }
  measure = null//测距对象
  measureInfo =
    {
      "measureTooltips": [],
      "isMeasure": false,
      "isMeasureArea": false,
      "sketch": null,//当前绘制的要素（Currently drawn feature.）
      "helpTooltipElement": null,//帮助提示框对象（The help tooltip element.）
      "helpTooltip": null,//帮助提示框显示的信息（Overlay to show the help messages.）
      "measureTooltipElement": null,//测量工具提示框对象（The measure tooltip element. ）
      "measureTooltipContentElement": null,//测量工具提示框内容对象（The measure tooltip Content element. ）
      "measureTooltip": null,//测量工具中显示的测量值（Overlay to show the measurement.）
      "continuePolygonMsg": '双击结束',
      "continueLineMsg": '双击结束',
      "measureResults": [],
      "measureTooltipCloseElement": null,
      "measureTooltipId": 0,
      "measureTooltipElements": [],
      "measureResult": null,
      "lastPoint": null
    }
  //标绘图层全部的景
  darwState = false
  //绘图对象
  draw = null
  drawData = null
  // 分屏图层顺序
  ZindexCy = 10
  m = {}
  isReplayCy =  false
  //贴图图层
  overlayLayers= []

  swipe = null //席卷对象

  featurePopInfo = {
    "isFeaturePopOpen": false,
    "container": null,
    "content": null,
    "closer": null,
    "contentInfo": null
  }

  featurePop = null
  viewArrCy = []

  viewArrIndexCy = 0
  bookListData = []
  bookListComponent = {}
  baseMapLayers = []
  controlLayerComponent = {}
  // 分屏图层数组
  swipeSpecialMapLayers = []
  // 分屏事件监听
  fenpingListener = null
  viewCy = {}
  specialMapLayers = [] //2d专题地图图层
  specialMapLayer = null //2d专题地图图层
  //构造函数
  constructor(name) {
    // console.log("开始实例化："+ name);
    this["own_id"] = name||"myMap"; //private
    if(window.GISMaps){
      window.GISMaps[this["own_id"]]=this; //赋值到全局变量
    }else{
      window.GISMaps = {};
      window.GISMaps[this["own_id"]]=this; //赋值到全局变量
    }
  }
  //初始化三维
  baseMapInit3D(){
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(86.06689524994869,22.108857182532834,124.9584857499487,48.08052948253283);
    // this.map3d.camera.flyTo({
    //   destination : Cesium.Camera.DEFAULT_VIEW_RECTANGLE
    // });
  }
  show3d(){
    let list = this.map.getView().calculateExtent(this.map.getSize());
    this.map3d.camera.flyTo({
      duration:0,
      destination : Cesium.Rectangle.fromDegrees(list[0], list[1], list[2], list[3])
    });

    $("#"+this["own_id"] +"3d").css("z-index","2");
    $("#"+this["own_id"] +"2d").css("z-index","1");
    this.vis3d = true;

  }
  show2d(){
    $("#"+this["own_id"] +"3d").css("z-index","1");
    $("#"+this["own_id"] +"2d").css("z-index","2");
    this.vis3d = false;
  }
  vis3d = false //三维是否可见

  layersList = [] // 图层控制插件对应的list
  baseMapInit(baseMapInitParameters, initcallback,gisMapContentDiv,has3D ) {
    //has3D 是否同时生产三维 地球
    this.baseMapInitParameters = baseMapInitParameters;
    this.viewCy = this.baseMapInitParameters.view;
    this.gisMapContentDiv = gisMapContentDiv;
    this.view = new View(baseMapInitParameters.view);
    this.tagType = baseMapInitParameters.type||"2d";
    this.layersList = []
    if (gisMapContentDiv != null) {
      // gisMapContentDiv 在这里面创建一个面板 ，包含2d map 和 3d Globe
      // if(this.tagType=="3d"){
        // Cesium = require('cesium/Cesium');
        // require('cesium/Widgets/widgets.css');
        // require('./lib/cesium/main.css');
        // var mapContent3d = ' <div style="position: absolute;top:0;bottom:0;left:0;right:0;"  id="'+this["own_id"] +'3d"></div>';
        // $("#" + gisMapContentDiv + "").append(mapContent3d);
        // var layer = new Cesium.ArcGisMapServerImageryProvider(
        //   {
        //     url:"http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
        //   });
        // this.map3d = new Cesium.Viewer(this["own_id"]+"3d",{
        //   sceneMode:Cesium.SceneMode.SCENE3D,
        //   // imageryProvider:layer,
        //   baseLayerPicker:false,
        //   timeline: false,//
        //   animation:false,//
        //   geocoder:false,//
        //   homeButton:false,//
        //   sceneModePicker:false,//
        //   fullscreenButton:false,//
        //   navigationHelpButton:false
        // });
        // return
      // }else if(this.tagType=="23d"){
      //   Cesium = require('cesium/Cesium');
      //   require('cesium/Widgets/widgets.css');
      //   require('./lib/cesium/main.css');
      //   var mapContent3d = ' <div style="position: absolute;top:0;bottom:0;left:0;right:0;display: block;z-index: 1;"  id="'+this["own_id"] +'3d"></div>';
      //   $("#" + gisMapContentDiv + "").append(mapContent3d);
      //   var layer = new Cesium.ArcGisMapServerImageryProvider(
      //     {
      //       url:"http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
      //     });
      //   this.map3d = new Cesium.Viewer(this["own_id"]+"3d",{
      //     sceneMode:Cesium.SceneMode.SCENE3D,
      //     imageryProvider:layer,
      //     baseLayerPicker:false,
      //     timeline: false,//
      //     animation:false,//
      //     geocoder:false,//
      //     homeButton:false,//
      //     sceneModePicker:false,//
      //     fullscreenButton:false,//
      //     navigationHelpButton:false
      //   });
      // }
      var mapContent2d = ' <div style="position: absolute;top:0;bottom:0;left:0;right:0;display: block;z-index: 2;background: #fff;" class="map" id="'+this["own_id"] +'2d"></div>';
      $("#" + gisMapContentDiv + "").append(mapContent2d)
      // this.addSwipeStyle();
      //实例化全屏显示控件

      this.baseMapLayers = layerUtils.getLayers(this.baseMapInitParameters.layers);
      //创建 地图
      this.map = new Map({
        controls:[],//s defaultControls().extend([mousePositionControl]),//待改造 不需要这种添加
        layers: this.baseMapLayers,//使用图层工具创建 layers
        target: this["own_id"]+"2d",
        view: this.view
      });
      this.drawSoruceVectorLayer = new VectorLayer({source: this.drawSource, zIndex: 31});
      this.map.addLayer(this.drawSoruceVectorLayer);
      this.layersList.unshift({
        layer: this.drawSoruceVectorLayer,
        name: '工具绘制图层',
        key: 'drawSoruceVectorLayer',
        vis: true,
        index: 31})
      //根据创建情况，看是否需要，加参数控制
      this.measureSoruceVectorLayer = new VectorLayer({
        source: this.measureSource,
        style: new Style({ //图层样式
          fill: new Fill({  color: 'rgba(37,241,239,0.2)' }),
          stroke: new Stroke({  color: '#ffcc33',   width: 2  }),
          image: new Circle({ radius: 5,
            stroke: new Stroke({  color: '#ffcc33', width: 1   }),
            fill: new Fill({ color: '#ffffff'  }),
          })
        }),
        zIndex: 32
      });
      this.map.addLayer(this.measureSoruceVectorLayer);
      this.layersList.unshift({
        layer: this.measureSoruceVectorLayer,
        name: '工具测量图层',
        key: 'measureSoruceVectorLayer',
        vis: true,
        index: 32})

      this.featuresSourceVectorLayer = new VectorLayer({source: this.featuresSource, zIndex: 33});
      this.featuresSourceVectorLayer.name = "featuresSourceVectorLayer";
      this.map.addLayer(this.featuresSourceVectorLayer);
      this.layersList.unshift({
        layer: this.featuresSourceVectorLayer,
        name: '查询结果覆盖面',
        key: 'featuresSourceVectorLayer',
        vis: true,
        index: 33})

      this.featuresSourceVectorLayerAllImage = new VectorLayer({ source: this.featuresSourceAllImage, zIndex: 34});
      this.featuresSourceVectorLayerAllImage.name = "featuresSourceVectorLayerAllImage";
      this.featureSHPSourceImage = new VectorLayer({ source: this.featureSHPSource, zIndex: 80});
      this.featureSHPSourceImage.name = "featureSHPSourceImageName";
      this.map.addLayer(this.featuresSourceVectorLayerAllImage);
      this.map.addLayer(this.featureSHPSourceImage);
      this.layersList.unshift({
        layer: this.featuresSourceVectorLayerAllImage,
        name: '查询结果覆盖合并面',
        key: 'featuresSourceVectorLayerAllImage',
        vis: true,
        index: 34})

      this.featuresSourceVectorLayerPageImage = new VectorLayer({ source: this.featuresSourcePageImage, zIndex: 35});
      this.featuresSourceVectorLayerPageImage.name = "featuresSourceVectorLayerPageImage";
      this.map.addLayer(this.featuresSourceVectorLayerPageImage);
      // this.layersList.unshift({
      //   layer: this.featuresSourceVectorLayerPageImage,
      //   name: 'xxxxxxx',
      //   key: 'featuresSourceVectorLayerPageImage',
      //   vis: true,
      //   index: 35})

      // this.myLayer = layerUtils.getLayer({
      //   "name": "sssss",
      //   "layerName": "sssss",
      //   "layerUrl": " http://www.narutogis.com:6080/arcgis/rest/services/route/MapServer",
      //   "layerType": "arcgis",
      //   "layerIcon":"",
      //   "visible": true})
      // this.map.addLayer(this.myLayer);
      // this.layersList.unshift({
      //   layer: this.myLayer,
      //   name: '我的测试图层服务',
      //   key: 'myLayer',
      //   vis: true,
      //   index: 41})

      // this.myLayer22 = layerUtils.getLayer({
      //   "name": "sssss22",
      //   "layerName": "sssss22",
      //   "layerUrl": "http://www.narutogis.com:6080/arcgis/rest/services/flood/MapServer",
      //   "layerType": "arcgis",
      //   "layerIcon":"",
      //   "visible": true})
      // this.map.addLayer(this.myLayer22);
      // this.layersList.unshift({
      //   layer: this.myLayer22,
      //   name: '我的测试图层服务22',
      //   key: 'myLayer22',
      //   vis: true,
      //   index: 42})

      // 高亮图层 -
      this.featureOverlay = new VectorLayer({
        source: new VectorSource(),
        map: this.map,
        style: new Style({
          stroke: new Stroke({  color: '#f00',  width: 1    }),
          fill: new Fill({ color: 'rgba(255,0,0,0.1)'  })
        })
      });

      this.addControls(baseMapInitParameters.controls)

      this.addEvents()
      if (initcallback != null) {
        initcallback('init completed.')
      }
    } else {
      console.log("map div target is null")
    }
  }
  //销毁当前的实例， 变量，以及绑定监听，以及DOM元素
  baseMapDestory(){
    //删除监听
    //删除dom
    //删除layer
    //删除map
  }
  //添加事件
  addEvents(){
    if(this.tagType=="23d"){//如果是二三维一体化那么的话，需要视野同步
      let self = this;
      // this.map.getView().on('change:resolution',function () {
      //   if (self.getView().getZoom() == 11) {
      //   }
      // });
      // this.map.getView().on('propertychange', function (evt) {
      //   var projExtent = this.getProjection().getExtent();
      //   if (projExtent) {
      //     var currentCenter = this.getCenter();
      //     var currentResolution = this.getResolution();
      //     var mapSize = self.map.getSize();
      //     var newExtent = [projExtent[0] + currentResolution * mapSize[0] / 2,
      //       projExtent[1] + currentResolution * mapSize[1] / 2,
      //       projExtent[2] - currentResolution * mapSize[0] / 2,
      //       projExtent[3] - currentResolution * mapSize[1] / 2];
      //      console.dir(newExtent);
      //   }
      // });

      //注册二维地图移动后触发得事件，联动三维
      this.map.on('moveend', function(event){
        if(!self.vis3d)return;
        //获取可视化区域得范围
        let list = self.map.getView().calculateExtent(self.map.getSize());
        self.map3d.camera.flyTo({
          duration:0.3,
          destination : Cesium.Rectangle.fromDegrees(list[0], list[1], list[2], list[3])
        });
        // self.map3d.camera.viewRectangle(Cesium.Rectangle.fromDegrees(list[0], list[1], list[2], list[3]));
      })
      //
      // var updateTimer;
      // if (true) {
      //   var camera = this.map3d.camera;
      //   camera.moveStart.addEventListener(function() {
      //     if (!Cesium.defined(updateTimer)) {
      //       updateTimer = window.setInterval(saveCamera, 1000);
      //     }
      //   });
      //   camera.moveEnd.addEventListener(function() {
      //     if (Cesium.defined(updateTimer)) {
      //       window.clearInterval(updateTimer);
      //       updateTimer = undefined;
      //     }
      //     saveCamera();
      //   });
      // }
    }
    // let self = this;
    // function saveCamera () {
    //   var camera =  self.map3d.camera;
    //   var position = camera.positionCartographic;
    //   // var rectangle = self.map3d.camera.computeViewRectangle();
    //   //
    //   // var ellipsoid = self.map3d.scene.globe.ellipsoid;
    //   //
    //   // var xyz = new Cesium.Cartesian3(rectangle.west, rectangle.south, 0);
    //   // var wgs84 = ellipsoid.cartesianToCartographic(xyz);
    //   // console.log('lng=' + Cesium.Math.toDegrees(wgs84.longitude) + ',lat=' + Cesium.Math.toDegrees(wgs84.latitude));
    //   //
    //   // var xyz2 = new Cesium.Cartesian3(rectangle.east, rectangle.north, 0);
    //   // var wgs842 = ellipsoid.cartesianToCartographic(xyz2);
    //   // console.log('lng=' + Cesium.Math.toDegrees(wgs842.longitude) + ',lat=' + Cesium.Math.toDegrees(wgs842.latitude));
    //
    //   // console.log(self.getCurrentExtent());
    //
    //   console.dir({
    //     longitude: Cesium.Math.toDegrees(position.longitude),
    //     latitude: Cesium.Math.toDegrees(position.latitude),
    //     height:position.height ,
    //     heading:Cesium.Math.toDegrees(camera.heading) ,
    //     pitch:Cesium.Math.toDegrees(camera.pitch),
    //     roll:Cesium.Math.toDegrees(camera.roll),
    //     zoom:self.altitudeToZoom(position.height)
    //   });
    // }
  }

  getCurrentExtent() {
    // 范围对象
    var extent = {};

    // 得到当前三维场景
    var scene = this.map3d.scene;

    // 得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var canvas = scene.canvas;

    // canvas左上角
    var car3_lt = this.map3d.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);

    // canvas右下角
    var car3_rb = this.map3d.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);

    // 当canvas左上角和右下角全部在椭球体上
    if (car3_lt && car3_rb) {
      var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
      var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
      extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
      extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
      extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
      extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
    }

    // 当canvas左上角不在但右下角在椭球体上
    else if (!car3_lt && car3_rb) {
      var car3_lt2 = null;
      var yIndex = 0;
      do {
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        yIndex <= canvas.height ? yIndex += 10 : canvas.height;
        car3_lt2 = this.map3d.camera.pickEllipsoid(new Cesium.Cartesian2(0, yIndex), ellipsoid);
      } while (!car3_lt2);
      var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
      var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
      extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
      extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
      extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
      extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
    }

    // 获取高度
    extent.height = Math.ceil(this.map3d.camera.positionCartographic.height);
    return extent;
  }
  altitudeToZoom(altitude) {
    var A = 40487.57;
    var B = 0.00007096758;
    var C = 91610.74;
    var D = -40467.74;

    return Math.round(D +(A-D)/(1 + Math.pow(altitude/C,B)));

  }

  //添加控件
  addControls(options){
    let data = options||{}
    if(data.hasOwnProperty("coordinate")&&data.coordinate.show){
      //创建地图鼠标移动，经纬度坐标联动显示
      let style = data.coordinate.style||"position: absolute;top:auto;bottom:0;left:calc(50% - 50px);width: 200px;  height: 20px;  z-index: 2000"
      let mousePosition = ' <div style="'+style+'"   id="'+this["own_id"] +'_coordinate"></div>';
      $("#" + this["own_id"] + "2d").append(mousePosition);

      let mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById(this["own_id"]+'_coordinate'),
        undefinedHTML: '&nbsp;'
      });
      this.map.addControl(mousePositionControl);//这个在上边已经加了 ,上边先注释掉
    }
    if(data.hasOwnProperty("fullScreen")&&data.fullScreen.show){
      //将全屏显示控件加载到map中
      var fullScreenControl = new FullScreen();
      this.map.addControl(fullScreenControl);
    }
  }
  //返回到原始范围
  zoomToInitView(){
    this.map.getView().animate({
      zoom: this.viewCy.zoom,
      center: this.viewCy.center
    })
  }
  //设置视图为了多地图联动来的
  setView(mainView){ActiveXObject
    this.map.setView(mainView);
  }
  getView(){
    return this.view
  }
  addSwipeStyle() {
    //这块添加了部分样式到全局
    $('<style>.map {\n' +
      '            width: 100%;\n' +
      '            height: 100%;\n' +
      '            position: absolute;\n' +
      '            box-sizing: border-box;\n' +
      '            padding: 0;\n' +
      '            margin: 0;\n' +
      '            float:left;\n' +
      '            border-left: 2px solid #333;\n' +
      '        }</style>').appendTo('head');
    //为了卷帘，添加元素，默认还是隐藏
    var swipe = " <div id=\"swipe\" class=\"swipe_bg\" title=\"水平拖动\" style=\"visibility: hidden\" onmouseover=\"this.style.cursor='w-resize'\" onmouseout=\"this.style.cursor='default'\">\n" +
      "        <div class=\"swipe_drag\">\n" +
      "        </div>\n" +
      "    </div>";
    $("#" + this.gisMapContentDiv + "").append(swipe);
    $('<style> .swipe_bg {\n' +
      '            position: absolute;/*相对于父div占满*/\n' +
      '            z-index: 10;\n' +
      '            width: 4px;\n' +
      '            background-color:rgb(216,216,216);\n' +
      '            border: 1px solid #848484;\n' +
      '        }</style>').appendTo('head');
    $('<style>.swipe_drag {\n' +
      '            border-radius:5px;\n' +
      '            left:-10px;\n' +
      '            top:50%;\n' +
      '            bottom:50%;\n' +
      '            position: absolute;\n' +
      '            width: 24px;\n' +
      '            height: 34px;\n' +
      '            background-color:rgb(216,216,216);\n' +
      '            background-image:url(../common/js/gis_plugin/swipe/vDrag.png);\n' +
      '            background-repeat:no-repeat;\n' +
      '            background-size:100% 100%;\n' +
      '            -moz-background-size:100% 100%;\n' +
      '            border:  solid 1px #848484;\n' +
      '        }</style>').appendTo('head');
  }

  getName() {
    return "007";
  }
  clearAllDraws () {
    this.drawSoruceVectorLayer.getSource().clear()
  }
  clearAllMeasure () {
    this.measureSoruceVectorLayer.getSource().clear()
  }
  clearAllFeatures () {
    this.featuresSourceVectorLayer.getSource().clear()
  }
  clearAllImageFeatures () {
    this.featuresSourceVectorLayerAllImage.getSource().clear()
  }
  clearSHP () {
    this.map.removeLayer(this.featureSHPSource)
  }
  clearVector () {
    this.map.removeLayer(this.specialMapLayer)
  }
  clearAll () {
    this.drawSoruceVectorLayer.getSource().clear();
    this.measureSoruceVectorLayer.getSource().clear();
    this.featuresSourceVectorLayer.getSource().clear();
    this.featuresSourceVectorLayerAllImage.getSource().clear();
    this.featuresSourceVectorLayerPageImage.getSource().clear();
    this.featureSHPSourceImage.getSource().clear();
  }
  removeLayer () {
    this.map.removeLayer(this.featuresSourcePageImage) //source 删除 什么玩意
  }
  drawLayerIndexChange (zIndex) {
    this.drawSoruceVectorLayer.values_.zIndex = zIndex;
    this.map.updateSize()
  }
  measureLayerIndexChange (zIndex) {
    this.drawSoruceVectorLayer.values_.zIndex = zIndex;
    this.map.updateSize()
  }
  featuresLayerIndexChang (zIndex) {
    this.drawSoruceVectorLayer.values_.zIndex = zIndex;
    this.map.updateSize()
  }
  //切换地图  底图切换有可能联动 ，多屏情况
  baseMapLayerChange (name) {
    for (let i = 0; i < this.baseMapLayers.length; i++) {
      var baseMaplayer = this.baseMapLayers[i];
      if (baseMaplayer.values_.name == name) {
        baseMaplayer.values_.visible = true;
      } else {
        baseMaplayer.values_.visible = false;
      }
    }
    this.map.updateSize();
  }
  addLayer (data){
    let layer = layerUtils.getLayer(data);
    this.map.addLayer(layer)
    this.layersList.unshift({
      layer: layer,
      name: data.name,
      key: data.name,
      vis: true,
      index: ++this.ZindexCy + 99})
  }
  removeLayer (key){
    for (let i = 0; i < this.layersList.length; i++) {
      var item = this.layersList[i];
      if (item.key == key) {
        this.map.removeLayer(item.layer)
        this.layersList.splice(i,1)
        break;
      }
    }
  }
  setLayerVis (key, vis) {
    for (let i = 0; i < this.layersList.length; i++) {
      var item = this.layersList[i];
      if (item.key == key) {
        item.layer.values_.visible = vis
        break;
      }
    }
    this.map.updateSize();
  }
  setLayerZIndex (key, index){
    for (let i = 0; i < this.layersList.length; i++) {
      var item = this.layersList[i];
      if (item.key == key) {
        item.layer.values_.zIndex = index
        break;
      }
    }
    this.map.updateSize();
  }
  //切换地图,保留图层
  baseMapLayerChangeVisible (name, exceptname) {
    for (let i = 0; i < this.baseMapLayers.length; i++) {
      var baseMaplayer = this.baseMapLayers[i];
      if (baseMaplayer.values_.name == name || baseMaplayer.values_.name.indexOf(exceptname) != -1) {
        baseMaplayer.values_.visible = true;
      } else {
        baseMaplayer.values_.visible = false;
      }
    }
    this.map.updateSize();
  }
  //创建专题地图图层  ，这个函数没有找到用的地方，可能不需要，带删除
  specialMapLayerInit (initSpecialMapParameter) {
    for (let i = 0; i < initSpecialMapParameter.layers.length; i++) {
      var initSpecialMaplayer = initSpecialMapParameter.layers[i];
      switch (initSpecialMaplayer.layerType) {
        case "WMS":
          var layer = new Image({
            name: initSpecialMaplayer.name,
            source: new ImageWMS({
              url: initSpecialMaplayer.layerUrl,
              params: {
                LAYERS: initSpecialMaplayer.layerName,
              }
            }),
            zIndex: 10 + i,
            visible: initSpecialMaplayer.visible
          });
          this.specialMapLayers.push(layer);
          this.map.addLayer(layer);
          break;
      }
    }
  }
  //显示隐藏专题图层
  specialMapLayerChange (checkLayer) {
    for (let i = 0; i < this.specialMapLayers.length; i++) {
      var specialMapLayer = this.specialMapLayers[i];
      if (specialMapLayer.values_.name == checkLayer.name) {
        specialMapLayer.values_.visible = checkLayer.visible;
        break;
      }
    }
    this.map.updateSize();
  }
  //指定专题图层显示层级
  specialMapLayerIndexChange (changeLayer) {
    for (let i = 0; i < this.specialMapLayers.length; i++) {
      var specialMapLayer = this.specialMapLayers[i];
      if (specialMapLayer.values_.name == changeLayer.name) {
        specialMapLayer.values_.zIndex = changeLayer.zIndex;
        break;
      }
    }
    this.map.updateSize();
  }
  //专题图层显示层级上移一级
  specialMapLayerIndexUp (layerName) {
    for (let i = 0; i < this.specialMapLayers.length; i++) {
      var specialMapLayer = this.specialMapLayers[i];
      if (specialMapLayer.values_.name == layerName) {
        specialMapLayer.values_.zIndex = specialMapLayer.values_.zIndex + 1;
        break;
      }
    }
    this.map.updateSize();
  }
  //专题图层显示层级下移一级
  specialMapLayerIndexDown (layerName) {
    for (let i = 0; i < this.specialMapLayers.length; i++) {
      var specialMapLayer = this.specialMapLayers[i];
      if (specialMapLayer.values_.name == layerName) {
        specialMapLayer.values_.zIndex = specialMapLayer.values_.zIndex - 1;
        break;
      }
    }
    this.map.updateSize();
  }
  //通过图层名称获取图层对象
  getBaseLayer (layerName) {
    let layers = this.baseMapLayers;
    var layer = null;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].values_.name == layerName) {
        layer = layers[i];
        break;
      }
    }
    return layer;
  }
  //分屏的初始化，待改造
  mapSplitInit (number) {
    // this.closeSwipe();
    // var width = (100 / number);
    // var heitht = this.height;
  }
  //
  drawPolygon (feature) {
    //gisMap.drawSource.clear();
    var style = null;
    if (feature.style) {
      style = new Style({
        fill: new Fill({ color: feature.style.fillcolor }),
        stroke: new Stroke({ color: feature.style.strokecolor,  width: feature.style.strokewidth })
      });
    }else{
      style = new Style({
        fill: new Fill({  color: 'rgba(255, 255, 255, 0)' }),
        stroke: new Stroke({color: '#ffcc33', width: 1})
      });
    }
    if (feature.geometry == undefined) {
      return;
    }
    if (feature.geometry.indexOf("）") != -1) {
      feature.geometry = feature.geometry.replace("）", ")");
    }
    if (feature.geometry.indexOf("（") != -1) {
      feature.geometry = feature.geometry.replace("（", "(");
    }
    this.sourceFeature = feature;
    //转wkt为feature
    var featureTemp = featureUtils.transformFeatureFromWkt(this.sourceFeature.geometry);
    //应用样式
    featureTemp.setStyle(style);
    featureTemp.attributes = feature.attributes;
    //添加到图层
    var source = this.drawSoruceVectorLayer.getSource();
    source.addFeature(featureTemp);
  }
  //转wkt为feature
  transformFeatureFromWkt (wkt) {
     return featureUtils.transformFeatureFromWkt(wkt);
  }
  openDrawPolygon (drawType, callDrawDataFunc, drawToolStyle) {
    this.drawInfo.isDraw = true;
    this.openDrawTool(drawType, callDrawDataFunc, drawToolStyle);
  }
  openDrawRectangle (drawType, callDrawDataFunc, drawToolStyle) {
    this.drawInfo.isDraw = true;
    this.openDrawTool(drawType, callDrawDataFunc, drawToolStyle);
  }
  //外部有调用的直接，尽量不允许
  setDrawState(tag){
    this.darwState = tag;
  }
   //绘图工具
   //drawType【点：Point，线：LineString，面：Polygon，矩形：Rectangle[Circle]，圆形：Circle，自定义图形：】
  openDrawTool (drawType, callDrawDataFunc, drawToolStyle) { // 初始化地图绘制控件
    this.drawType = drawType;
    if (this.drawInfo.helpTooltipElement) {
      if (this.drawInfo.helpTooltipElement.parentNode) {
        this.drawInfo.helpTooltipElement.parentNode.removeChild(this.drawInfo.helpTooltipElement);
      }
    }
    let rings = "";
    $('<style>.drawTooltip {\n' +
      '            position: relative;\n' +
      '            background:#ffffff;\n' +
      '            border-radius: 4px;\n' +
      '            color: #000000;\n' +
      '            padding: 2px 2px;\n' +
      '            opacity: 0.7;\n' +
      '            white-space: nowrap;\n' +
      '            border: 1px solid #000000;\n' +
      '            font-size:6px\n' +
      '        }</style>').appendTo('head');
    this.map.getInteractions().item(1).setActive(false);

    if (this.draw) {
      this.map.removeInteraction(this.draw); //移除绘制图形
      this.draw = null;
    }
    var self =this;
    this.map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      var helpMsg = '单击绘制'; //当前默认提示信息
      if (self.drawInfo.sketch) {
        helpMsg = "双击结束";
      }
      self.drawInfo.helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
      self.drawInfo.helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
    }); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
    //////////////////////////////////////////////////////////////////////////////
    this.darwState = true;
    var style = new Style({
      fill: new Fill({
        color: 'rgba(37,241,239,0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 1
      })
    });
    if (drawToolStyle) {
      style = new Style({
        fill: new Fill({
          color: drawToolStyle.fillcolor
        }),
        stroke: new Stroke({
          color: drawToolStyle.strokecolor,
          width: drawToolStyle.strokewidth
        })
      });
    }
    if (drawType == 'Point') {
      style = new Style({
        fill: new Fill({
          color: 'rgba(37,241,239,0.2)'
        }),
        image: new Circle({
          radius: 5,
          fill: new Fill({
            color: '#e81818'
          })
        }),
        zIndex: 20
      })
    }
    this.drawSoruceVectorLayer.setStyle(style);

    if (drawType == 'Point') {
      this.draw = new Draw({
        source: this.drawSource,
        type: drawType
      });
    }
    if (drawType == 'LineString') {
      this.draw = new Draw({
        source: this.drawSource,
        type: (drawType),
        style: style
      });
    }
    if (drawType == 'Polygon') {
      this.draw = new Draw({
        source: this.drawSource,
        type: (drawType)
      });
    }
    if (drawType == 'Rectangle') {
      this.draw = new Draw({
        source: this.drawSource,
        type: 'Circle',
        style: style,
        geometryFunction: createBox()
      });
    }

    this.draw.on('drawstart', function (evt) {
      self.clearAll();
      self.drawInfo.sketch = evt.feature; //绘制的要素
      rings = "";
    });
    this.map.addInteraction(this.draw);
    //创建帮助提示框
    this.drawInfo.helpTooltipElement = document.createElement('div');
    this.drawInfo.helpTooltipElement.className = 'drawTooltip';
    this.drawInfo.helpTooltip = new Overlay({
      element: this.drawInfo.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    this.map.addOverlay(this.drawInfo.helpTooltip);

    this.draw.on('drawend', function (evt) {
        if(self.drawType=="Point"){
          var arr = self.draw.sketchCoords_;
          rings = "POINT(" + arr[0].toFixed(4) + " " + arr[1].toFixed(4) + ")";
        }
        if(self.drawType=="LineString") {
          var arr = self.draw.sketchCoords_;
          var rings0 = "";
          for (var i = 0; i < arr.length; i++) {
            rings0 += arr[i][0].toFixed(4) + " " + arr[i][1].toFixed(4) + ",";
          }
          rings += "LINESTRING(" + rings0.substring(0, rings0.length - 1) + ")";
        }
        if(self.drawType=="Polygon") {
          var arr = self.draw.sketchCoords_;
          var rings0 = "";
          for (var i = 0; i < arr[0].length; i++) {
            rings0 += arr[0][i][0].toFixed(4) + " " + arr[0][i][1].toFixed(4) + ",";
          }
          rings += "POLYGON((" + rings0 + arr[0][0][0].toFixed(4) + " " + arr[0][0][1].toFixed(4) + "))";
        }
        if(self.drawType=="Rectangle") {
          var geom = evt.feature.getGeometry();
          var leftuplong = geom.extent_[0];
          var leftuplat = geom.extent_[3];
          var rightuplong = geom.extent_[2];
          var rightuplat = geom.extent_[3];
          var rightbottomlong = geom.extent_[2];
          var rightbottomlat = geom.extent_[1];
          var leftbottomlong = geom.extent_[0];
          var leftbottomlat = geom.extent_[1];
          rings += "POLYGON((" +
            leftuplong.toFixed(4) + " " + leftuplat.toFixed(4) + "," +
            rightuplong.toFixed(4) + " " + rightuplat.toFixed(4) + "," +
            rightbottomlong.toFixed(4) + " " + rightbottomlat.toFixed(4) + "," +
            leftbottomlong.toFixed(4) + " " + leftbottomlat.toFixed(4) + "," +
            leftuplong.toFixed(4) + " " + leftuplat.toFixed(4) + "))";
        }
      self.drawData = rings;
      self.map.removeEventListener('pointermove');
      self.drawInfo.drawTooltipElement = null; //置空测量工具提示框对象
      self.drawInfo.sketch = null;
      self.drawInfo.isDraw = false;
      self.map.removeInteraction(self.draw); //移除测量工具
      self.draw = null;
        if (self.drawInfo.helpTooltipElement) {
          if (self.drawInfo.helpTooltipElement.parentNode) {
            self.drawInfo.helpTooltipElement.parentNode.removeChild(self.drawInfo.helpTooltipElement);
          }
        }
        if (callDrawDataFunc){
          callDrawDataFunc(rings);
        }
        });
  }
  //放大
  zoomOut () {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
  }
  //缩小
  zoomIn () {
    this.map.getView().setZoom(this.map.getView().getZoom() - 1);
  }
  closeDrawTool () { //关闭地图绘制控件
    if (this.draw) {
      this.map.removeInteraction(this.draw);
      this.draw = null;
      this.darwState = false;
    }
  }
  openPan () {
    this.map.getInteractions().item(2).setActive(true);
    // this.closeSwipe();
    this.map.removeEventListener('pointermove');
    this.drawInfo.drawTooltipElement = null; //置空测量工具提示框对象
    this.drawInfo.sketch = null;
    this.drawInfo.isDraw = false;
    this.map.removeInteraction(this.draw); //移除测量工具
    if (this.drawInfo.helpTooltipElement) {
      if (this.drawInfo.helpTooltipElement.parentNode) {
        this.drawInfo.helpTooltipElement.parentNode.removeChild(this.drawInfo.helpTooltipElement);
      }
    }
  }
  closePan () {
    this.map.getInteractions().item(2).setActive(false);
  }
  // nobody use maybe
  addIcon (feature) {
    var style;
    if (feature.style) {
      style = new Style({image: new Icon(({scale: feature.style.imagescale,  src: feature.style.imagesrc }))  });
    }else{
      style = new Style({image: new Icon(({scale: 0.5,src: '../common/js/gis_plugin/img/blueIcon.png'})) });
    }
    if (feature.geometry == undefined) {
      return;
    }
    var featureTemp = featureUtils.transformFeatureFromWkt(feature.geometry);
    featureTemp.setStyle(style);
    featureTemp.attributes = feature.attributes;
    this.featuresSource.addFeature(featureTemp);
  }

  toggleStaticImage (isChecked, feature, index) {
    //转wkt为feature
    var featureTemp = featureUtils.transformFeatureFromWkt(feature.geometry);
    var sourceProj = this.map.getView().getProjection(); //获取投影坐标系
    if (isChecked) {
      var overlayLayer = new ImageLayer({
        index: index,
        source: new Static({
          url: feature.imagesrc,
          projection: sourceProj,
          imageExtent: featureTemp.getGeometry().getExtent()
        }),
        zIndex: ++this.ZindexCy + 99
      });
      this.m[index] = overlayLayer;
      this.map.addLayer(this.m[index]);
    } else {
      this.map.removeLayer(this.m[index]);
    }
  }

  addPoint (feature,source)  {
    var style = new Style({
      fill: new Fill({
        color: 'rgba(37,241,239,0.2)'
      }),
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: '#e81818'
        })
      }),
      zIndex: 20
    })
    if (feature.style) {
      style = new Style({
        fill: new Fill({
          color: feature.style.fillcolor
        }),
        stroke: new Stroke({
          color: feature.style.strokecolor,
          width: feature.style.strokewidth
        }),
        image: new Circle({
          radius: feature.style.imageradius,
          fill: new Fill({
            color: feature.style.imagefillcolor
          })
        })
      });
    }
    if (feature.geometry == undefined) {
      return;
    }
    var featureTemp = featureUtils.transformFeatureFromWkt(feature.geometry);
    featureTemp.setStyle(style);
    featureTemp.attributes = feature.attributes;
    if (source) {
      if (source === "featuresSourcePageImage") { //范围框图层
        this.featuresSourcePageImage.addFeature(featureTemp);
      }
      if (source === "featuresSourceAllImage") { //合并面图层
        this.featuresSourceAllImage.addFeature(featureTemp);
      }
    } else {
      this.featuresSource.addFeature(featureTemp);
    }
  }

  addLineString (feature) {
    var style = new Style({
      fill: new Fill({ //矢量图层填充颜色，以及透明度
        color: 'rgba(255, 255, 255, 0)'
      }),
      stroke: new Stroke({ //边界样式
        color: '#ffcc33',
        width: 1
      })
    });
    if (feature.style) {
      style = new Style({
        fill: new Fill({ //矢量图层填充颜色，以及透明度
          color: feature.style.fillcolor
        }),
        stroke: new Stroke({ //边界样式
          color: feature.style.strokecolor,
          width: feature.style.strokewidth
        })
      });
    }
    if (feature.geometry == undefined) {
      return;
    }
    var featureTemp = featureUtils.transformFeatureFromWkt(feature.geometry);
    featureTemp.setStyle(style);
    featureTemp.attributes = feature.attributes;
    this.featuresSource.addFeature(featureTemp);
  }

  addPolygon (feature, source) {
    //this.drawSource.clear(); //是否要清空
    var style = new Style({
      fill: new Fill({ //矢量图层填充颜色，以及透明度
        color: 'rgba(255, 255, 255, 0)'
      }),
      stroke: new Stroke({ //边界样式
        color: '#ffcc33',
        width: 1
      })
    });
    if (feature.style) {
      style = new Style({
        fill: new Fill({ //矢量图层填充颜色，以及透明度
          color: feature.style.fillcolor
        }),
        stroke: new Stroke({ //边界样式
          color: feature.style.strokecolor,
          width: feature.style.strokewidth
        })
      });
    }
    if (feature.geometry == undefined) {
      return;
    }
    if (feature.geometry.indexOf("）") != -1) {
      feature.geometry = feature.geometry.replace("）", ")");
    }
    if (feature.geometry.indexOf("（") != -1) {
      feature.geometry = feature.geometry.replace("（", "(");
    }
    var featureTemp = featureUtils.transformFeatureFromWkt(feature.geometry);
    featureTemp.setStyle(style);
    featureTemp.attributes = feature.attributes;
    if (source) {
      if (source == "featuresSourcePageImage") {//范围框图层
        this.featuresSourcePageImage.addFeature(featureTemp);
      }
      if (source == "featuresSourceAllImage") {//合并面图层
        this.featuresSourceAllImage.addFeature(featureTemp);
      }
      if (source == "featureSHPSource") {
        this.featureSHPSource.addFeature(featureTemp);
      }
    } else {
      this.featuresSource.addFeature(featureTemp);
    }
  }

  addCrossPolygon (feature, nodeId, source, style) {
    var _this = this;

    if (feature.geometry == undefined) {
      return;
    }
    if (feature.geometry.indexOf("）") != -1) {
      feature.geometry = feature.geometry.replace("）", ")");
    }
    if (feature.geometry.indexOf("（") != -1) {
      feature.geometry = feature.geometry.replace("（", "(");
    }
    //转wkt为feature
    var featureTemp = featureUtils.transformFeatureFromWkt(feature.geometry);
    featureTemp.setStyle(style);
    featureTemp.attributes = feature.attributes;
    //添加到图层
    if (source) {
      if (source == "featuresSourceAllImage") { //合并面图层
        gisMap.featuresSourceAllImage.addFeature(featureTemp);
      }
    }
  }

  toggleLayer (isChecked, url, val) {
    if (isChecked) {
      this.specialMapLayer = new ImageLayer({
        source: new ImageArcGISRest({
          ratio: 1,
          params: {
            'LAYERS': 'show:' + val,
          },
          url: url,
          projection: new Projection({
            units: 'degrees',
            code: 'EPSG:4326'
          })
        })
      });
      this.specialMapLayers.push(this.specialMapLayer);
      this.map.addLayer(this.specialMapLayer);
    } else {
      this.map.removeLayer(this.specialMapLayer);
    }
  }
  // 多边形定位
  zoomToPolygon (feature, level) {
    if (!feature) {
      return;
    }
    var polygon = feature.getGeometry();
    var point = this.getCenterPoint(polygon.getExtent());
    this.map.getView().fit(polygon.getExtent());
    var zoom = this.map.getView().getZoom() + 1;
    this.map.getView().animate({
      zoom: zoom,
      center: [point[0], point[1]],
    });
    var self =this;
    setTimeout(function () {
      var zoom = zoom - 1;
      self.map.getView().animate({
        zoom: zoom,
        center: [point[0], point[1]],
      });
      self.map.getView().fit(polygon.getExtent());
    }, 500);
  }
  // 点定位
  zoomToPoint (feature, level) {
    if (!feature) {
      return
    }
    var polygon = feature.getGeometry();
    var point = this.getCenterPoint(polygon.getExtent());
    this.map.getView().animate({
      zoom: level,
      center: [point[0], point[1]]
    })
  }

  getExtentHeight (extent) {
    var l = getHeight(extent);
    return l;
  }
  getExtentCenter (extent) {
    var c = getCenter(extent);
    return c;
  }
  //定位到某地
  zoomTo (feature) {
    var polygon = feature.getGeometry();
    var r = this.map.getView().getResolutionForExtent(polygon.getExtent(), this.map.getSize());
    this.map.getView().setResolution(r);
    this.map.getView().setCenter(this.getExtentCenter(polygon.getExtent()));
  }
  //飞到某地
  flyTo (feature, done) {
    var duration = 2000;
    var parts = 2;
    var called = false;
    var polygon = feature.getGeometry();
    var location = this.getCenterPoint(polygon.getExtent());
    var r = this.map.getView().getResolutionForExtent(polygon.getExtent(), this.map.getSize());
    var zoom = this.map.getView().getZoomForResolution(r);

    function callback(complete) {
      --parts;
      if (called) {
        return
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete)
      }
    }

    this.map.getView().animate({
      center: location,
      duration: duration
    }, callback);
    this.map.getView().animate({
      zoom: zoom - 1,
      duration: duration / 2
    }, {
      zoom: zoom - 1,
      duration: duration / 2
    }, callback);
  }
  zoomToLevel (level) {
    if (!level) {
      return;
    }
    this.map.getView().animate({
      zoom: level
    });
  }
  //获取当前可视级别
  getMapLevel () {
    var zoom = this.map.getView().getZoom();
    return zoom;
  }
  //获取可视范围
  getMapView () {
    var view = this.map.getView();
    return arr = view.calculateExtent(this.map.getSize());
  }

  getPixelFromCoordinate (point)  {
    this.map.getPixelFromCoordinate([point.x, point, y]);
  }

  getCenterPoint (arr) {
    return calcUtils.getCenterPoint(arr);
  }
  measureArea () {
    this.measureInfo.isMeasure = true;
    this.openMeasureTool("area");
    this.measureInfo.isMeasureArea = true;
  }
  measureLength () {
    this.measureInfo.isMeasure = true;
    this.openMeasureTool("LineString");
    this.measureInfo.isMeasureArea = false;
  }
  openMeasureTool (type) {
    $('<style>.measureTooltip {\n' +
      '            position: relative;\n' +
      '            background:#ffffff;\n' +
      '            border-radius: 4px;\n' +
      '            color: #000000;\n' +
      '            padding: 2px 2px;\n' +
      '            opacity: 0.7;\n' +
      '            white-space: nowrap;\n' +
      '            border: 1px solid #000000;\n' +
      '            font-size:6px\n' +
      '        }</style>').appendTo('head');

    this.map.getInteractions().item(1).setActive(false);
    if (this.measure) {
      this.map.removeInteraction(this.measure); //移除绘制图形
    }
    var self = this;
    this.map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      /** @type {string} */
      var helpMsg = '单击绘制'; //当前默认提示信息
      //判断绘制几何类型设置相应的帮助提示信息
      if (self.measureInfo.sketch) {
        var geom = (self.measureInfo.sketch.getGeometry());
        if (geom instanceof Polygon) {
          helpMsg = self.measureInfo.continuePolygonMsg; //绘制多边形时提示相应内容
        } else if (geom instanceof LineString) {
          helpMsg = self.measureInfo.continueLineMsg; //绘制线时提示相应内容
        }
      }
      self.measureInfo.helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
      self.measureInfo.helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
    }); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
    var type = (type == 'area' ? 'Polygon' : 'LineString');
    this.measure = new Draw({
      //source: gisMap.measureSource,//测量绘制层数据源
      type: /** @type {GeometryType} */ (type), //几何图形类型
      style: new Style({ //图层样式
        fill: new Fill({
          color: 'rgba(37,241,239,0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33', //边框颜色
          width: 2 // 边框宽度
        }),
        image: new Circle({
          radius: 5,
          stroke: new Stroke({
            color: '#ffcc33', //边框颜色
            width: 2
          }),
          fill: new Fill({
            color: '#ffffff' //填充颜色
          }),
        })
      })
    });
    this.map.addInteraction(this.measure);
    this.createMeasureTooltip(); //创建测量工具提示框
    this.createHelpTooltip(); //创建帮助提示框
    //定义一个事件监听
    var listener;
    //定义一个控制鼠标点击次数的变量
    var count = 0;
    //绑定交互绘制工具开始绘制的事件
    this.measure.on('drawstart',function (evt) {
      self.measureInfo.sketch = evt.feature; //绘制的要素
      var tooltipCoord = evt.coordinate; // 绘制的坐标
      //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
      listener = self.measureInfo.sketch.getGeometry().on('change', function (evt) {
        var geom = evt.target; //绘制几何要素
        var output;
        if (geom instanceof Polygon) {
          self.map.removeEventListener('singleclick');
          output = self.formatArea(/** @type {Polygon} */ (geom)); //面积值
          tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
        } else if (geom instanceof LineString) {
          output = self.formatLength(/** @type {LineString} */ (geom)); //长度值
          tooltipCoord = geom.getLastCoordinate(); //坐标
        }
        self.measureInfo.measureTooltipContentElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
        self.measureInfo.measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
        self.measureInfo.lastPoint = tooltipCoord;
      });
        //地图单击事件
      self.map.on('singleclick', function (evt) {
          //如果是第一次点击，则设置测量提示框的文本内容为起点
          if (count == 0) {
            self.measureInfo.measureTooltipContentElement.innerHTML = "起点";
          }
          if (self.measureInfo.measureResult != self.measureInfo.measureTooltipContentElement.innerHTML &&
            self.measureInfo.measureTooltipContentElement.innerHTML != "") {
            //设置测量提示信息的位置坐标，用来确定鼠标点击后测量提示框的位置
            self.measureInfo.measureTooltip.setPosition(evt.coordinate);
            //根据鼠标点击位置生成一个点
            var point = new Point(evt.coordinate);
            //将该点要素添加到矢量数据源中
            var feature = new Feature(point);
            feature.id = self.measureInfo.measureTooltipId;
            self.measureSource.addFeature(feature);
            //更改测量提示框的样式，使测量提示框可见
            self.measureInfo.measureTooltipElement.className = 'measureTooltip';
            //创建测量提示框
            self.createMeasureTooltip();
            //gisMap.createMeasureTooltipClose();//重新创建一个测试工具提示框显示结果
            //点击次数增加
            count++;
            self.measureInfo.measureResult = self.measureInfo.measureTooltipContentElement.innerHTML;
          }
        });
      });
    //绑定交互绘制工具结束绘制的事件
    this.measure.on('drawend',function (evt) {
        var geom = evt.feature; //绘制几何要素
        geom.id = self.measureInfo.measureTooltipId;
      self.measureInfo.measureTooltipId++;
      self.measureSource.addFeature(geom);
        if (!self.measureInfo.isMeasureArea) {
          //根据鼠标点击位置生成一个点
          var point = new Point(self.measureInfo.lastPoint);
          //将该点要素添加到矢量数据源中
          var feature = new Feature(point);
          feature.id = self.measureInfo.measureTooltipId;
          self.measureSource.addFeature(feature);
          self.map.removeEventListener('pointermove');
          self.map.removeEventListener('singleclick');
          count = 0;
          self.createMeasureTooltipClose(); //重新创建一个关闭工具提示框显示结果
          self.measureInfo.sketch = null; //置空当前绘制的要素对象
          self.measureInfo.measureTooltipElement = null; //置空测量工具提示框对象
          self.measureInfo.isMeasure = false;
          self.map.removeInteraction(self.measure); //移除测量工具
        }
        if (self.measureInfo.helpTooltipElement) {
          if (self.measureInfo.helpTooltipElement.parentNode) {
            self.measureInfo.helpTooltipElement.parentNode.removeChild(self.measureInfo.helpTooltipElement);
          }
        }
        if (self.measureInfo.isMeasureArea) {
          self.createMeasureTooltipClose(); //重新创建一个关闭工具提示框显示结果
          self.measureInfo.sketch = null; //置空当前绘制的要素对象
          self.measureInfo.measureTooltipElement = null; //置空测量工具提示框对象
          self.measureInfo.isMeasure = false;
          self.map.removeInteraction(self.measure); //移除测量工具
          if (self.measureInfo.helpTooltipElement) {
            if (self.measureInfo.helpTooltipElement.parentNode) {
              self.measureInfo.helpTooltipElement.parentNode.removeChild(self.measureInfo.helpTooltipElement);
            }
          }
        }
        unByKey(listener);
      });
  }
  /**
  *创建一个新的帮助提示框（tooltip）
*/
  createHelpTooltip () {
    this.measureInfo.helpTooltipElement = document.createElement('div');
    this.measureInfo.helpTooltipElement.className = 'measureTooltip';
    this.measureInfo.helpTooltip = new Overlay({
      element: this.measureInfo.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    this.map.addOverlay(this.measureInfo.helpTooltip);
  }
  /**
   *创建一个新的测量工具提示框（tooltip）
   */
  createMeasureTooltip () {
    this.measureInfo.measureTooltipElement = document.createElement('div');
    this.measureInfo.measureTooltipElement.className = 'measureTooltip';
    this.measureInfo.measureTooltipContentElement = document.createElement('div');
    this.measureInfo.measureTooltipContentElement.style.display = "inline";
    this.measureInfo.measureTooltipElement.append(this.measureInfo.measureTooltipContentElement);

    this.measureInfo.measureTooltip = new Overlay({
      element: this.measureInfo.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.measureInfo.measureTooltips.push(this.measureInfo.measureTooltip);
    this.map.addOverlay(this.measureInfo.measureTooltip);
    this.measureInfo.measureTooltipId++;
  }
  /**
   *创建一个新的测量工具关闭提示框（tooltip）
   */
  createMeasureTooltipClose () {
    this.measureInfo.measureTooltipElement.className = 'measureTooltip';
    this.measureInfo.measureTooltipElement.append(this.measureInfo.measureTooltipContentElement);
    this.measureInfo.measureTooltipCloseElement = document.createElement('a');
    this.measureInfo.measureTooltipCloseElement.innerHTML = "✖";
    this.measureInfo.measureTooltipCloseElement.setAttribute("id", this.measureInfo.measureTooltipId);
    this.measureInfo.measureTooltipCloseElement.setAttribute("title", "清除本次测量结果");
    this.measureInfo.measureTooltipCloseElement.style.cursor = "pointer";
    this.measureInfo.measureTooltipCloseElement.style.display = "inline";
    this.measureInfo.measureTooltipElement.append(this.measureInfo.measureTooltipCloseElement);
    var gisMap = this;
    this.measureInfo.measureTooltipCloseElement.onclick = function (evt) {
      var id = evt.currentTarget.getAttribute("id");
      var measureSourceFeatures = gisMap.measureSource.getFeatures();
      for (let i = 0; i < gisMap.measureInfo.measureResults.length; i++) {
        if (id == gisMap.measureInfo.measureResults[i].id) {
          var measureTooltips = gisMap.measureInfo.measureResults[i].measureTooltips;
          for (let j = 0; j < measureTooltips.length; j++) {
            let measureTooltip = measureTooltips[j];
            gisMap.map.removeOverlay(measureTooltip);
          }
          if (i > 0) {
            //临时数组存放
            var tempArray1 = gisMap.measureInfo.measureResults[i].measureSourceFeatures; //临时数组1
            var tempArray2 = gisMap.measureInfo.measureResults[i - 1].measureSourceFeatures; //临时数组2
            var result = [];
            for (var k = 0; k < tempArray1.length; k++) {
              var obj = tempArray1[k];
              var num = obj.id;
              var isExist = false;
              for (var l = 0; l < tempArray2.length; l++) {
                var aj = tempArray2[l];
                var n = aj.id;
                if (n == num) {
                  isExist = true;
                  break;
                }
              }
              if (!isExist) {
                result.push(obj);
              }
            }
            for (var n = 0; n < result.length; n++) {
              gisMap.measureSource.removeFeature(result[n]);
            }
          } else {
            for (var n = 0; n < gisMap.measureInfo.measureResults[i].measureSourceFeatures.length; n++) {
              gisMap.measureSource.removeFeature(gisMap.measureInfo.measureResults[i].measureSourceFeatures[n]);
            }
          }
        }
      }
    };
    var obj = {
      "id": this.measureInfo.measureTooltipId,
      "measureTooltips": this.measureInfo.measureTooltips,
      "measureSourceFeatures": this.measureSource.getFeatures()
    };
    this.measureInfo.measureResults.push(obj);
    this.measureInfo.measureTooltips = [];
    this.measureInfo.measureTooltipId++;
  }
  formatLength (line) {
    return calcUtils.formatLength(this.map,line); //返回线的长度
  }
  formatArea (polygon) {
    return calcUtils.formatArea(this.map,polygon); //返回多边形的面积
  }

  addFeatureClick (callBackFeatureClick, poPshow) {
    this.featurePopInfo.isFeaturePopOpen = true;
    //初始化弹出窗样式
    $('<style>.feature-popup {\n' +
      '\t\tposition: absolute;\n' +
      '\t\tbackground-color: white;\n' +
      '\t\t-webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));\n' +
      '\t\tfilter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));\n' +
      '\t\tpadding: 15px;\n' +
      '\t\tborder-radius: 10px;\n' +
      '\t\tborder: 1px solid #cccccc;\n' +
      '\t\tbottom: 12px;\n' +
      '\t\tleft: -50px;\n' +
      '\t\tmin-width: 200px;\n' +
      '\t}</style>').appendTo('head');
    $('<style>.feature-popup:after, .feature-popup:before {\n' +
      '            top: 100%;\n' +
      '            border: solid transparent;\n' +
      '            content: " ";\n' +
      '            height: 0;\n' +
      '            width: 0;\n' +
      '            position: absolute;\n' +
      '            pointer-events: none;\n' +
      '        }</style>').appendTo('head');
    $('<style> .feature-popup:after {\n' +
      '            border-top-color: white;\n' +
      '            border-width: 10px;\n' +
      '            left: 48px;\n' +
      '            margin-left: -10px;\n' +
      '        }</style>').appendTo('head');
    $('<style>.feature-popup:before {\n' +
      '            border-top-color: #cccccc;\n' +
      '            border-width: 11px;\n' +
      '            left: 48px;\n' +
      '            margin-left: -11px;\n' +
      '        }</style>').appendTo('head');
    $('<style>.feature-popup-closer {\n' +
      '            text-decoration: none;\n' +
      '            position: absolute;\n' +
      '            top: 2px;\n' +
      '            right: 8px;\n' +
      '        }</style>').appendTo('head');
    $('<style>.feature-popup-closer:after {\n' +
      '            content: "✖";\n' +
      '        }</style>').appendTo('head');

    this.featurePopInfo.container = document.createElement('div');
    this.featurePopInfo.container.className = 'feature-popup';
    this.featurePopInfo.popupCloser = document.createElement('a');
    this.featurePopInfo.popupCloser.className = 'feature-popup-closer';
    this.featurePopInfo.container.append(this.featurePopInfo.popupCloser);
    // 弹出窗内容DIV
    this.featurePopInfo.content = document.createElement('div');
    this.featurePopInfo.container.append(this.featurePopInfo.content);
    this.featurePopInfo.content.style.visibility = "hidden";
    // 弹出窗关闭
    this.featurePopInfo.popupCloser.setAttribute("title", "关闭");
    this.featurePopInfo.popupCloser.style.cursor = "pointer";
    this.featurePopInfo.popupCloser.style.display = "inline";

    this.featurePop = new Overlay(
      ({
        //要转换成overlay的HTML元素
        element: this.featurePopInfo.container,
        //当前窗口可见
        autoPan: true,
        //Popup放置的位置
        positioning: 'bottom-center',
        //是否应该停止事件传播到地图窗口
        stopEvent: false,
        autoPanAnimation: {
          //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
          duration: 250
        }
      }));
    let self = this;
    // openlayers只有针对整个地图事件监听，可以通过以下方式达到对feature监听，也可对feature自定义点击事件。
    this.map.on('click', function (e) {
      // 在点击时获取像素区域
      var pixel = self.map.getEventPixel(e.originalEvent);
      self.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        if (layer) {
          if (layer.name == "featuresSourceVectorLayerPageImage") {
            // coodinate存放了点击时的坐标信息
            var coodinate = e.coordinate;
            callBackFeatureClick(self.featurePopInfo.content, feature);
            // 显示overlay
            if (poPshow) {
              if (!self.darwState) {
                self.featurePopInfo.content.style.visibility = "visible";
                // 设置overlay的显示位置
                var center = getCenter(feature.values_.geometry.extent_);
                self.featurePop.setPosition(center);
                self.map.addOverlay(self.featurePop);
              }
            }
          }
        }
      });
    });
    // 鼠标移动事件
    this.map.on('pointermove', function (e) {
      if (e.dragging) {
        return;
      }
      var pixel = self.map.getEventPixel(e.originalEvent);
      var feature = self.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        if (layer) {
          if (layer.name == "featuresSourceVectorLayer") {
            return feature;
          }
        }
        return null;
      });
      if (feature) {
        // store.dispatch('getRowId', feature.attributes.F_DATAID)
      } else {
        // store.dispatch('getRowId', "")
      }
    });
    this.featurePopInfo.popupCloser.onclick = function (evt) {
      self.featurePopInfo.content.style.visibility = "hidden";
      self.featurePop.setPosition(undefined);
    };
  }
  addHighlight (val) {
    var srv = this.featureOverlay.getSource();
    srv.clear();
    var style = new Style({
      fill: new Fill({ // 矢量图层填充颜色，以及透明度
        color: 'rgba(255, 255, 255, 0)'
      }),
      stroke: new Stroke({ // 边界样式
        color: '#ffcc33',
        width: 3
      })
    });
    if (val) {
      // 转wkt为feature
      var featureTemp = featureUtils.transformFeatureFromWkt(val.WKTRESPONSE);
      // 应用样式
      featureTemp.setStyle(style);
      this.featureOverlay.getSource().addFeature(featureTemp)
    }
  }
  closeFeaturePop () {
    this.featurePopInfo.isFeaturePopOpen = false;
    this.map.removeOverlay(this.featurePop);
  }
  openTwoDMap () {
  }
  openThreeDMap () {
  }
  mapOpenSwipe () {
    if (this.swipe) {
      this.closeSwipe()
    } else if (!this.swipe) {
      document.getElementById("swipe").style.height = (document.getElementById("mapDiv").offsetHeight - 10) / 50 + 'rem';
      document.getElementById("swipe").style.visibility = "visible"; // 显示
      this.swipe = document.getElementsByClassName("swipe_bg")[0]; // 获取元素
      var x, y; // 存储div的坐标
      var isDrop = false; // 移动状态的判断鼠标按下才能移动
      let self =this;
      this.swipe.onmousedown = function (e) {
        var e = e || window.event ;// 要用event这个对象来获取鼠标的位置
        x = e.clientX - self.swipe.offsetLeft;
        y = e.clientY - self.swipe.offsetTop;
        isDrop = true // 设为true表示可以移动
      };

      document.onmousemove = function (e) {
        // 是否为可移动状态                　　　　　　　　　　　 　　　　　　　
        if (isDrop) {
          var e = e || window.event;
          var moveX = e.clientX - x ;// 得到距离左边距离                    　　
          var moveY = e.clientY - y; // 得到距离上边距离
          var maxX = document.documentElement.clientWidth - self.swipe.offsetWidth;
          var maxY = document.documentElement.clientHeight - self.swipe.offsetHeight;
          // 范围限定
          moveX = Math.min(maxX, Math.max(0, moveX));
          moveY = Math.min(maxY, Math.max(0, moveY));
          self.swipe.style.left = moveX + "px";
          self.map.render();
        } else {
          return;
        }
      };
      document.onmouseup = function () {
        isDrop = false // 设置为false不可移动
      };
      let productBaseMap = '/productBaseMap/arcgis/rest/services/HBLY/2016_suixian/MapServer';
      let specialMapLayer = new ImageLayer({
        name: 'showSwipe',
        source: new ImageArcGISRest({
          ratio: 1,
          params: {
            'LAYERS': 'show:' + 0,
          },
          url: productBaseMap
        }),
        id: 999,
        zIndex: ++this.ZindexCy
      });
      this.swipeSpecialMapLayers.push(specialMapLayer);
      this.map.addLayer(specialMapLayer);
      let widthPx = 1;
      if (document.body.clientWidth == 1440) {
        widthPx = 2
      }
      this.fenpingListener = this.getMapLayer("showSwipe").on('precompose', function (event) {
        let ctx = event.context;
        let width = ctx.canvas.width * (this.swipe.offsetLeft / ctx.canvas.width);
        ctx.save();
        ctx.beginPath();

        ctx.rect(width * widthPx, 0, ctx.canvas.width - width, ctx.canvas.height);
        ctx.clip();
      });
      this.getMapLayer('showSwipe').on('postcompose', function (event) {
        var ctx = event.context;
        ctx.restore();
      })
    }
  }
  // 关闭卷帘
  closeSwipe () {
    if (this.swipe) this.swipe.style.left = 0 + 'px';
    this.swipe = null;
    if (this.fenpingListener) unByKey(this.fenpingListener);
    this.map.removeLayer(this.getMapLayer('showSwipe'));
    this.map.render();
    document.getElementById('swipe').style.visibility = 'hidden'
  }
  // 获取指定名字获取图层
  getMapLayer (name, index) {
    let layer = null;
    let layers = this.map.getLayers();
    for (let i = 0; i < layers.array_.length; i++) {
      let _layer = layers.array_[i];
      if (_layer.values_.name == name) {
        layer = _layer
      }
    }
    return layer
  }
  // 清除点击表格定位重绘的图层
  productTableFeaturesRemove () {
    var productTableFeatures = this.featuresSource.getFeatures();
    for (var i = 0; i < productTableFeatures.length; i++) {
      if (productTableFeatures[i].attributes["productTable_id"] === '') {
        this.featuresSource.removeFeature(productTableFeatures[i]);
        break
      }
    }
  }
  // 清除移入表格定位重绘的图层
  productTableHoverRemove () {
    var productTableHoverFeatures = this.featuresSource.getFeatures();
    for (var i = 0; i < productTableHoverFeatures.length; i++) {
      if (productTableHoverFeatures[i].attributes["productTable_hover"] === '') {
        this.featuresSource.removeFeature(productTableHoverFeatures[i]);
        break
      }
    }
  }
  // // 123清除移入表格定位重绘的图层
  // productTableHoverRemove () {
  //   var productTableHoverFeatures = this.featuresSource.getFeatures();
  //   for (var i = 0; i < productTableHoverFeatures.length; i++) {
  //     if (productTableHoverFeatures[i].attributes["productTable_hover"] === '') {
  //       this.featuresSource.removeFeature(productTableHoverFeatures[i]);
  //       break
  //     }
  //   }
  // }

  // 改变位置分辨率
  checkZoomAndCenter () {
    if (this.isReplayCy) {
      this.isReplayCy = false;
      return
    }
    this.viewArrCy = this.viewArrCy.slice(0, this.viewArrIndexCy + 1);
    let wkt = this.sourceFeature;
    let zoom = this.map.getView().getZoom();
    let obj = {wkt, zoom};
    this.viewArrCy.push(obj);
    this.viewArrIndexCy = this.viewArrCy.length - 1;
  }
  // 回放-前放
  computeViewArr (handle) {
    this.isReplayCy = true;
    let index = this.viewArrIndexCy;
    if (handle === 'prev') {
      index = index - 1 < 0 ? index : --index
    } else if (handle === 'next') {
      index = index + 1 > this.viewArrCy.length - 1 ? index : ++index
    }
    this.viewArrIndexCy = index;
    this.localtionCy(this.viewArrCy[index]);
  }
// 定位
  localtionCy (local = {}) {
    this.clearAllDraws();
    let feature = local.wkt;
    this.drawPolygon(feature);
    let f = featureUtils.transformFeatureFromWkt(feature.geometry);
    // 飞到某地
    this.flyTo(f, () => {
    })
  }
  // 书签
  bookList (e) {
    if (Object.keys(this.bookListComponent).length) {
      this.bookListComponent._data.divVisible = !this.bookListComponent._data.divVisible;
      if (this.bookListComponent._data.divVisible) {
        bookTestGet()
      }
      this.bookListComponent._data.bookListData = this.bookListData;
      this.bookListComponent._data.inputDivFlag = false;
      return
    }
    const template = document.createElement('template');
    e.target.parentNode.appendChild(template);
    let self =this;
    let component = Vue.component('bookListDiv', {
      data() {
        return {
          myMap:self,
          bookListData: [],
          divVisible: true,
          styles: {
            position: 'absolute',
            width: '4.5rem',
            height: '5.5rem',
            background: '#fff',
            top: '.84rem',
            left: '7.8rem',
            padding: '.15rem',
            zIndex: 10000
          },
          liStyle: {
            height: '.4rem',
            lineHeight: '.4rem',
            padding: '.1rem 0',
            overflow: 'hidden',
            color: '#fff'
          },
          inputDivFlag: false,
          mapName: '',
          imgSrc: require('@/assets/img/delete.png')
        }
      },
      methods: {
        inputDivShow() {
          this.inputDivFlag = true

        },
        addBookList() {
          if (!this.mapName) {
            Message.error('书签名称不能为空')
            return
          }
          let wkt = ''
          wkt = store.state.searchStore.wkt || this.myMap.sourceFeature.geometry
          // console.log(store.searchStore.wkt)
          let mapConfigList = []
          this.myMap.specialMapLayers.map(each => {
            let obj = {
              serviceId: each.values_.id,
              serviceOrder: each.values_.zIndex,
              serviceStatus: each.values_.visible ? 1 : 0,
            }
            mapConfigList.push(obj)
          })
          let dataObj = {
            name: this.mapName,
            mapConfigList,
            wkt,
            center: this.myMap.map.getView().getCenter().join(','),
            zoom: this.myMap.map.getView().getZoom()
          }
          // let param = new URLSearchParams()
          // param.append('bookmarksVoJson', JSON.stringify(dataObj))
          http.addBookList(dataObj).then(res => {
            if (res) {
              Message.success('添加成功！')
              this.mapName = ''
              bookTestGet()
            } else {
              Message.error('书签名称已存在!')
            }
          })
        },
        deleteBook(item) {
          http.deleteBookList({id: item.id}).then(res => {
            if (res.data === true) {
              Message.success('删除成功！')
              bookTestGet()
            }
          }).catch(err => {
            Message.error(err)
          })
        },
        positionBook(data) {
          this.myMap.clearAllDraws()
          let {center, zoom, mapConfigList, wkt} = data
          this.myMap.specialMapLayers.map(each => {
            mapConfigList.map(item => {
              if (each.values_.id == item.serviceId) {
                each.values_.zIndex = item.serviceOrder
                each.values_.visible = item.serviceStatus
              }
            })
          })
          if (Object.keys(this.myMap.controlLayerComponent).length) {
            this.myMap.controlLayerComponent._data.specialMapLayers = this.myMap.specialMapLayers
          }
          let arr = center.split(',')
          center = arr.map(each => {
            return Number(each)
          })
          let feature = {
            'attributes': {},
            'style': {
              fillcolor: 'rgba(255, 255, 255, 0)',
              strokecolor: 'red',
              strokewidth: 2
            },
            'geometry': wkt
          }
          let local = {
            center,
            zoom,
            wkt: feature
          }
          this.myMap.drawPolygon(feature)
          this.myMap.map.getView().animate({
            zoom: local.zoom,
            center: local.center
          })
        },
        gbshuqian() {
          this.divVisible = false
        }
      },
      template: `<div :style="{...styles}" v-show='divVisible' @click.stop>
        <div style="width: 100%;height: .6rem;borderBottom: 1px solid #ccc;lineHeight: .6rem;">
          <span style="display: inline-block;float: left;marginLeft: .1rem;">我的书签</span>
          <i style="display: inline-block;float: right;marginRight: .1rem;color: #E07F40;" @click="gbshuqian"> X </i>
        </div>
        <ul style="height:4rem;overflow:auto">
          <li v-for='item in bookListData' :style="{...liStyle}">
            <span style="float:left;cursor:pointer;color:black" @click='positionBook(item)'>{{item.name}}</span>
            <span style="float:right;background:#fff;padding:1px 2px;borderRadius:2px;cursor:pointer" @click='deleteBook(item)'>
              <img :src="imgSrc" />
            </span>
          </li>
        </ul>
        <div style="position:absolute;width:100%;bottom:5px;left:0;text-align: center;" v-show='!inputDivFlag'>
          <button style="background:#029567;color:#fff;padding:1px 2px;width:1rem;borderRadius:2px;cursor:pointer" @click="inputDivShow">添加</button>
        </div>
        <div style="position:absolute;width:100%;bottom:5px;left:0;text-align: center;" v-show='inputDivFlag'>
          <input type="text" style="width:60%;border:1px solid #ccc;" placeholder='请输入书签名称' v-model='mapName'/>
          <button style="width:20%;borderRadius:2px;padding:1px 2px;background:#4c9afc;color:#fff;cursor:pointer" @click="addBookList">确认</button>
        </div>
      </div>`
    })
    this.bookListComponent = new component()
    this.bookListComponent.$mount(template)
    bookTestGet()


    function bookTestGet() {
      http.getBookList().then(res => {
        self.bookListComponent._data.bookListData = res.data
      }).catch(err => {
        Message.error(err)
      })
    }
  }
  panTangtherMaps = []
  _test_move = true
  togeterMapMove (maps){
    // [map1 , map2]
    var self = this;
    var maps = maps;
    if(maps.length == 2) {
      maps[0].events.register("move", maps[0], function() {
        if( self._test_move) {
          var  c1 = this.getCenter();
          var z1 = this.getZoom();
          self._test_move = false;
          if(maps[1])
            maps[1].setCenter(c1,z1);
          self._test_move = true;
        }
      });
      if(maps[1])
        maps[1].events.register("move", maps[1], function() {
          if( self._test_move) {
            var  c1 = this.getCenter();
            var z1 = this.getZoom();
            self._test_move = false;
            maps[0].setCenter(c1,z1);
            self._test_move = true;
          }
        });
    }
  }

}
