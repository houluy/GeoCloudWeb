/* eslint-disable */
import Map from "ol/Map"
// import store from '../store/index.js'
import Vue from 'vue/dist/vue.esm.js'
// import http from '@comm/service/interface.js'
import View from "ol/View"
import Overlay from 'ol/Overlay'
import Tile from "ol/layer/Tile"
import XYZ from "ol/source/XYZ"
import TileArcGISRest from "ol/source/TileArcGISRest"
import Vector from "ol/source/Vector"
import VEctor from "ol/layer/Vector"
import Fill from "ol/style/Fill"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import Text from "ol/style/Text"
import Circle from "ol/style/Circle"
import WKT from "ol/format/WKT"
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
	getArea,
	getLength
} from "ol/sphere"
import {
	unByKey
} from "ol/Observable"
import{
	easeOut
} from "ol/easing"
import {
	getVectorContext
	} from 'ol/render';
import ImageLayer from 'ol/layer/Image'
import Icon from 'ol/style/Icon'
import {
	getCenter,
	getHeight
} from 'ol/extent.js'
import Projection from 'ol/proj/Projection'
import Static from 'ol/source/ImageStatic'
import ImageArcGISRest from 'ol/source/ImageArcGISRest'
//import MousePosition from 'ol/control/MousePosition'
import {
	createStringXY
}from 'ol/coordinate';
import {
	Message
}from 'element-ui'

import $ from 'jquery'
export const GisMapApi = (function () {
	function GisMapApi() {
		var _this = this;
		_this.layerParameters = null,
		_this.isThreeMap = false,
		_this.resolution =
			[{
				"level": 0,"resolution": 1.40625,"scale": 590995197.1416691
			}, {
				"level": 1,"resolution": 0.703125,"scale": 295497598.5708346
			}, {
				"level": 2,"resolution": 0.3515625,"scale": 147748799.2854173
			}, {
				"level": 3,"resolution": 0.17578125,"scale": 73874399.64270864
			}, {
				"level": 4,"resolution": 0.087890625,"scale": 36937199.82135432
			}, {
				"level": 5,"resolution": 0.0439453125,"scale": 18468599.91067716
			}, {
				"level": 6,"resolution": 0.02197265625,"scale": 9234299.95533858
			}, {
				"level": 7,"resolution": 0.010986328125,"scale": 4617149.97766929
			}, {
				"level": 8,"resolution": 0.0054931640625,"scale": 2308574.98883465
			}, {
				"level": 9,"resolution": 0.00274658203125,"scale": 1154287.49441732
			}, {
				"level": 10,"resolution": 0.001373291015625,"scale": 577143.747208662
			}, {
				"level": 11,"resolution": 0.0006866455078125,"scale": 288571.873604331
			}, {
				"level": 12,"resolution": 0.00034332275390625,"scale": 144285.936802165
			}, {
				"level": 13,"resolution": 0.000171661376953125,"scale": 72142.9684010827
			}, {
				"level": 14,"resolution": 0.0000858306884765625,"scale": 36071.4842005414
			}, {
				"level": 15,"resolution": 0.00004291534423828125,"scale": 18035.7421002707
			}, {
				"level": 16,"resolution": 0.000021457672119140625,"scale": 9017.87105013534
			}, {
				"level": 17,"resolution": 0.000010728836059570312,"scale": 4508.93552506767
			}, {
				"level": 18,"resolution": 0.000005364418029785156,"scale": 2254.467762533835
			}, {
				"level": 19,"resolution": 0.000002682209014892578,"scale": 1127.233881266918
			}, {
				"level": 20,"resolution": 0.000001341104507446289,"scale": 563.6169406334588
			}
		],
		_this.flickerPoint= [],
		_this.flickerPointTemp= [],
		_this.scaleLineControl = null,
		_this.callBackFeatureClick = null,
		_this.callBackThreeDMapFeatureClick = null,
		_this.gisMapContentDiv = null,
		_this.heitht ='',
		_this.twoDMapDivObjs = [],
		_this.twoDMapDivObj = null,
		_this.twoDMapDivObj0 = null,
		_this.twoDMapDivObj1 = null,
		_this.twoDMapDivObj2 = null,
		_this.twoDMapDivObj3 = null,
		_this.twoDMapDiv = null, //2ddiv
		_this.threeDMapDiv = null, //3ddiv
		_this.threeDMapDivObj = null, //3ddiv
		_this.threeDMap = null, //3d地图对象
		_this.threeDMapHandler = null, //3d地图事件
		_this.threeDMapDrawHandler = null, //3d绘图事件
		_this.threeDMapDragZoomHandler = null, //拉框放大事件
		_this.threeDMapMeasureHandler = null, //3d绘图事件
		_this.threeDMapMeasureVolumeHandler = null, //体积测量事件
		_this.threeDMapSlopeSurfaceAnalysisHandler = null, //坡面分析事件
		_this.threeDMapSlopeAnalysisHandler = null, //坡度分析事件
		_this.threeDMapSlopeSurfaceAnalysis = {
			"AnalysiseEntitys": [], //测量物体
		},
		_this.threeDMapHeightMeasureHandler = null, //高度测量
		_this.threeDMapRriangleMeasure = null, //三角测量
		_this.threeDMapMeasureVolume = {
			"sectionCircles": [], //圆形切面
			"measesureEntitys": [], //测量物体
			"polygons": [], //测量范围
			"points": []//点集合
		},
		_this.threeDMapMeasureTooltip = null,
		_this.threeDMapTooltip = {
			"threeDMapTooltip": null,
			"meassageInfo": null
		},
		_this.measure_entities = null,
		_this.threeDMapImagerLayers = null,
		_this.threeDMapLayers = [], //3d基础底图图层
		_this.threeDSpecialMapLayers = [], //3d专题地图图层
		_this.baseMapLayers = [], //2d基础底图图层
		_this.baseMapLayers0 = [],
		_this.baseMapLayers1 = [],
		_this.baseMapLayers2 = [],
		_this.baseMapLayers3 = [],
		_this.baseMapInitParameters = [], //初始化参数-废弃
		_this.specialMapLayers = [], //2d专题地图图层
		_this.specialMapLayers0 = [],
		_this.specialMapLayers1 = [],
		_this.specialMapLayers2 = [],
		_this.specialMapLayers3 = [],
		_this.specialMapLayer = null, //2d专题地图图层-废弃
		_this.overlayLayers = [], //贴图图层-废弃
		_this.overlayLayer = null, //贴图图层-废弃
		_this.m = {},//-废弃
		_this.initcallbackfunc = null,
		_this.maps = [], //地图对象集合
		_this.mapTargetDivs = [], //地图对象集合
		_this.map = null, //2d地图对象
		_this.map0 = null,
		_this.map1 = null,
		_this.map2 = null,
		_this.map3 = null,
		_this.swipe = null, //席卷对象
		_this.drawSource = new Vector({
				wrapX: false
			}),
		_this.drawSourceTemp = new Vector({
				wrapX: false
			}),
		_this.drawSoruceVectorLayer = null, //绘图图层
		//_this.drawSoruceVectorLayerTemp = null, //绘图图层
		_this.measureSource = new Vector(),
		//_this.measureSourceTemp = new Vector(),
		_this.measureSoruceVectorLayer = null, //测量图层
		//_this.measureSoruceVectorLayerTemp = null, //测量图层
		_this.featuresSource = new Vector(),
		_this.featuresSourcePageImage = new Vector(),
        _this.featuresSourceAllImage = new Vector(),
		_this.featuresSourceVectorLayer = null, //标绘图层
		_this.featuresSourceVectorLayerPageImage = null, //标绘图层每页的景
		_this.featuresSourceVectorLayerAllImage = null, //标绘图层全部的景
		_this.viewC = {},
		_this.viewArrCy = [],
		_this.viewArrIndexCy = 0,
		_this.isReplayCy = false,
		_this.viewCy = {},
		_this.sourceFeature = {},
		_this.controlLayerComponent = {},
		_this.bookListData = [],
		_this.bookListComponent = {},
		// _this.searchFeaturesSource = new Vector({
		// 		format: new format.GeoJSON()
		// 	}),
		//_this.searchFeaturesSourceVectorLayer = null, //标绘图层
		_this.darwState = false,
		_this.threeDFeaturePopInfo = {
			"isFeaturePopOpen": false,
			"container": null,
			"content": null,
			"closer": null,
			"contentInfo": null
		},
		_this.popInfo = {
			"isPopOpen": false,
			"container": null,
			"content": null,
			"closer": null,
			"contentInfo": null
		},
		_this.featurePopInfos = [],
		_this.featurePopInfo = {
			"isFeaturePopOpen": false,
			"container": null,
			"content": null,
			"closer": null,
			"contentInfo": null
		},
		_this.featurePopInfo0 = {
			"isFeaturePopOpen": false,
			"container": null,
			"content": null,
			"closer": null,
			"contentInfo": null
		},
		_this.featurePopInfo1 = {
			"isFeaturePopOpen": false,
			"container": null,
			"content": null,
			"closer": null,
			"contentInfo": null
		},
		_this.featurePopInfo2 = {
			"isFeaturePopOpen": false,
			"container": null,
			"content": null,
			"closer": null,
			"contentInfo": null
		},
		_this.featurePopInfo3 = {
			"isFeaturePopOpen": false,
			"container": null,
			"content": null,
			"closer": null,
			"contentInfo": null
		},
		_this.featurePops = [],
		_this.pop = null,
		_this.featurePop = null,
		_this.featurePop0 = null,
		_this.featurePop1 = null,
		_this.featurePop2 = null,
		_this.featurePop3 = null,
		_this.draw = null, //绘图对象
		_this.draw0 = null, //绘图对象
		_this.draw1 = null, //绘图对象
		_this.draw2 = null, //绘图对象
		_this.draw3 = null, //绘图对象
		  // 分屏图层数组
		_this.swipeSpecialMapLayers = [],
		// 分屏图层顺序
		_this.ZindexCy = 10,
		// 分屏事件监听
		_this.fenpingListener = null,
		_this.drawData = null,
		_this.drawData0 = null,
		_this.drawData1 = null,
		_this.drawData2 = null,
		_this.drawData3 = null,
		_this.drawInfo = {
			"isDraw": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
		},
		_this.drawInfo0 = {
			"isDraw": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
		},
		_this.drawInfo1 = {
			"isDraw": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
		},
		_this.drawInfo2 = {
			"isDraw": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
		},
		_this.drawInfo3 = {
			"isDraw": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
		},
		_this.measure = null, //测距对象
		_this.measure0 = null, //测距对象
		_this.measure1 = null, //测距对象
		_this.measure2 = null, //测距对象
		_this.measure3 = null, //测距对象
		_this.measureInfo = {
			"measureTooltips": [],
			"isMeasure": false,
			"isMeasureArea": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
			/**
			 * 测量工具提示框对象（The measure tooltip element. ）
			 * @type {Element}
			 */
			"measureTooltipElement": null,
			/**
			 * 测量工具提示框内容对象（The measure tooltip Content element. ）
			 * @type {Element}
			 */
			"measureTooltipContentElement": null,
			/**
			 *测量工具中显示的测量值（Overlay to show the measurement.）
			 * @type {Overlay}
			 */
			"measureTooltip": null,
			/**
			 *  当用户正在绘制多边形时的提示信息文本
			 * @type {string}
			 */
			"continuePolygonMsg": '双击结束',
			/**
			 * 当用户正在绘制线时的提示信息文本
			 * @type {string}
			 */
			"continueLineMsg": '双击结束',
			"measureResults": [],
			/**
			 * 测量工具提示框关闭对象（The measure tooltip close element. ）
			 * @type {Element}
			 */
			"measureTooltipCloseElement": null,
			"measureTooltipId": 0,
			"measureTooltipElements": [],
			"measureResult": null,
			"lastPoint": null
		},
		_this.measureInfo0 = {
			"measureTooltips": [],
			"isMeasure": false,
			"isMeasureArea": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
			/**
			 * 测量工具提示框对象（The measure tooltip element. ）
			 * @type {Element}
			 */
			"measureTooltipElement": null,
			/**
			 * 测量工具提示框内容对象（The measure tooltip Content element. ）
			 * @type {Element}
			 */
			"measureTooltipContentElement": null,
			/**
			 *测量工具中显示的测量值（Overlay to show the measurement.）
			 * @type {Overlay}
			 */
			"measureTooltip": null,
			/**
			 *  当用户正在绘制多边形时的提示信息文本
			 * @type {string}
			 */
			"continuePolygonMsg": '双击结束',
			/**
			 * 当用户正在绘制线时的提示信息文本
			 * @type {string}
			 */
			"continueLineMsg": '双击结束',
			"measureResults": [],
			/**
			 * 测量工具提示框关闭对象（The measure tooltip close element. ）
			 * @type {Element}
			 */
			"measureTooltipCloseElement": null,
			"measureTooltipId": 0,
			"measureTooltipElements": [],
			"measureResult": null,
			"lastPoint": null
		},
		_this.measureInfo1 = {
			"measureTooltips": [],
			"isMeasure": false,
			"isMeasureArea": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
			/**
			 * 测量工具提示框对象（The measure tooltip element. ）
			 * @type {Element}
			 */
			"measureTooltipElement": null,
			/**
			 * 测量工具提示框内容对象（The measure tooltip Content element. ）
			 * @type {Element}
			 */
			"measureTooltipContentElement": null,
			/**
			 *测量工具中显示的测量值（Overlay to show the measurement.）
			 * @type {Overlay}
			 */
			"measureTooltip": null,
			/**
			 *  当用户正在绘制多边形时的提示信息文本
			 * @type {string}
			 */
			"continuePolygonMsg": '双击结束',
			/**
			 * 当用户正在绘制线时的提示信息文本
			 * @type {string}
			 */
			"continueLineMsg": '双击结束',
			"measureResults": [],
			/**
			 * 测量工具提示框关闭对象（The measure tooltip close element. ）
			 * @type {Element}
			 */
			"measureTooltipCloseElement": null,
			"measureTooltipId": 0,
			"measureTooltipElements": [],
			"measureResult": null,
			"lastPoint": null
		},
		_this.measureInfo2 = {
			"measureTooltips": [],
			"isMeasure": false,
			"isMeasureArea": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
			/**
			 * 测量工具提示框对象（The measure tooltip element. ）
			 * @type {Element}
			 */
			"measureTooltipElement": null,
			/**
			 * 测量工具提示框内容对象（The measure tooltip Content element. ）
			 * @type {Element}
			 */
			"measureTooltipContentElement": null,
			/**
			 *测量工具中显示的测量值（Overlay to show the measurement.）
			 * @type {Overlay}
			 */
			"measureTooltip": null,
			/**
			 *  当用户正在绘制多边形时的提示信息文本
			 * @type {string}
			 */
			"continuePolygonMsg": '双击结束',
			/**
			 * 当用户正在绘制线时的提示信息文本
			 * @type {string}
			 */
			"continueLineMsg": '双击结束',
			"measureResults": [],
			/**
			 * 测量工具提示框关闭对象（The measure tooltip close element. ）
			 * @type {Element}
			 */
			"measureTooltipCloseElement": null,
			"measureTooltipId": 0,
			"measureTooltipElements": [],
			"measureResult": null,
			"lastPoint": null
		},
		_this.measureInfo3 = {
			"measureTooltips": [],
			"isMeasure": false,
			"isMeasureArea": false,
			/**
			 * 当前绘制的要素（Currently drawn feature.）
			 * @type {Feature}
			 */
			"sketch": null,
			/**
			 * 帮助提示框对象（The help tooltip element.）
			 * @type {Element}
			 */
			"helpTooltipElement": null,
			/**
			 *帮助提示框显示的信息（Overlay to show the help messages.）
			 * @type {Overlay}
			 */
			"helpTooltip": null,
			/**
			 * 测量工具提示框对象（The measure tooltip element. ）
			 * @type {Element}
			 */
			"measureTooltipElement": null,
			/**
			 * 测量工具提示框内容对象（The measure tooltip Content element. ）
			 * @type {Element}
			 */
			"measureTooltipContentElement": null,
			/**
			 *测量工具中显示的测量值（Overlay to show the measurement.）
			 * @type {Overlay}
			 */
			"measureTooltip": null,
			/**
			 *  当用户正在绘制多边形时的提示信息文本
			 * @type {string}
			 */
			"continuePolygonMsg": '双击结束',
			/**
			 * 当用户正在绘制线时的提示信息文本
			 * @type {string}
			 */
			"continueLineMsg": '双击结束',
			"measureResults": [],
			/**
			 * 测量工具提示框关闭对象（The measure tooltip close element. ）
			 * @type {Element}
			 */
			"measureTooltipCloseElement": null,
			"measureTooltipId": 0,
			"measureTooltipElements": [],
			"measureResult": null,
			"lastPoint": null
		}
	};
	/**
	 * @Description:此函数为初始方法
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/8/18
	 */
	GisMapApi.prototype.init = function (initParameters, initcallback, gisMapContentDiv, twoDMapDiv, threeDMapDiv) {
		var _this = this;
		if (gisMapContentDiv != null) {
			//拉框样式
			_this.loadCssCode('.ol-dragbox {background-color: rgba(255, 255, 255, 0);border-color: rgb(249,17,14);}');
			//地图容器样式
			_this.loadCssCode('.gisMapContent {' +
				'position: relative;' +
				'border: none;' +
				'padding: 0px;' +
				'margin: 0px;' +
				'left: 0px;' +
				'top: 0px;' +
				'width: 100%;' +
				'height: 100%;\\n\' +')
			// _this.loadCssCode('.ol-overlaycontainer-stopevent' +
			// 	'                \'{' +
			// 	'                \'display:none;' +
			// 	'                \'}');//影响pop显示
			_this.loadCssCode('.map {' +
				'width: 100%;' +
				'height: 100%;' +
				'float:left;' +
				'}');
			_this.loadCssCode(' .swipe_bg {' +
				'position: relative;/*相对于父div占满*/' +
				'z-index: 10;' +
				'width: 4px;' +
				'background-color:rgb(216,216,216);' +
				'border:  solid 1px #848484;' +
				'			 -moz-user-select:none;\n'+
				'			 -moz-user-select: none;\n'+
				'			 -webkit-user-select: none;\n'+
				'			 -ms-user-select: none;\n'+
				'			 -khtml-user-select: none;\n'+
				'			 user-select: none;\n'+
				'}');
			_this.loadCssCode('.swipe_drag {' +
				'border-radius:5px;' +
				'left:-10px;' +
				'top:50%;' +
				'bottom:50%;' +
				'position: absolute;' +
				'width: 24px;' +
				'height: 34px;' +
				'background-color:rgb(216,216,216);' +
				//'background-image:url(../common/js/gis_plugin/swipe/vDrag.png);' +
				'background-repeat:no-repeat;' +
				'background-size:100% 100%;' +
				'-moz-background-size:100% 100%;' +
				'border:  solid 1px #848484;' +
				'-moz-user-select:none;\n'+
				'}');

			_this.initParameters = initParameters;
			_this.initcallbackfunc = initcallback;
			_this.gisMapContentDiv = gisMapContentDiv;
			_this.twoDMapDiv = twoDMapDiv;
			_this.threeDMapDiv = threeDMapDiv;
			if (_this.twoDMapDiv != null) {
				//初始化2d地图
				_this.map = new Map({
						target: this.twoDMapDiv,
						view: new View(initParameters.view)
					});
				for (var j = 0; j < 4; j++) {
					var targetDiv = "gisMap_div" + j;
					_this.mapTargetDivs.push(targetDiv);
					var mapDiv = document.createElement('div');
					mapDiv.innerHTML = " <div id=" + targetDiv + " class=\"map\" >" +
						"        </div>\n";
					document.getElementById(_this.gisMapContentDiv).appendChild(mapDiv);
					switch (j) {
					case 0: {
							//0
							_this.map0 = new Map({
									target: targetDiv,
									view: _this.map.getView()
								});
							break;
						}
					case 1: {
							// 1
							_this.map1 = new Map({
									target: targetDiv,
									view: _this.map.getView()
								});
							break;
						}
					case 2: {
							// 2
							_this.map2 = new Map({
									target: targetDiv,
									view: _this.map.getView()
								});
							break;
						}
					case 3: {
							// 3
							_this.map3 = new Map({
									target: targetDiv,
									view: _this.map.getView()
								});
							break;
						}
					}
				}
				_this.maps.push(_this.map);
				_this.maps.push(_this.map0);
				_this.maps.push(_this.map1);
				_this.maps.push(_this.map2);
				_this.maps.push(_this.map3);
				_this.twoDMapDivObj = document.getElementById(_this.twoDMapDiv);
				_this.twoDMapDivObj0 = document.getElementById("gisMap_div0");
				_this.twoDMapDivObj1 = document.getElementById("gisMap_div1");
				_this.twoDMapDivObj2 = document.getElementById("gisMap_div2");
				_this.twoDMapDivObj3 = document.getElementById("gisMap_div3");
				_this.twoDMapDivObjs.push(_this.twoDMapDivObj);
				_this.twoDMapDivObjs.push(_this.twoDMapDivObj0);
				_this.twoDMapDivObjs.push(_this.twoDMapDivObj1);
				_this.twoDMapDivObjs.push(_this.twoDMapDivObj2);
				_this.twoDMapDivObjs.push(_this.twoDMapDivObj3);
				if (_this.drawSoruceVectorLayer == null) {
					_this.drawSoruceVectorLayer = new VEctor({
						    name: "drawSoruceVectorLayer",
							source: _this.drawSource,
							style: new Style({ //图层样式
								fill: new Fill({
									//填充颜色
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
										width: 1
									}),
									fill: new Fill({
										color: '#ffffff' //填充颜色
									}),
								})
							}),
							zIndex: 31
						});
					for (var i = 0; i < 5; i++) {
						var map = _this.maps[i];
						map.addLayer(_this.drawSoruceVectorLayer);
					}
				}
				if (_this.measureSoruceVectorLayer == null) {
					_this.measureSoruceVectorLayer = new VEctor({
							source: _this.measureSource,
							style: new Style({ //图层样式
								fill: new Fill({
									//填充颜色
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
										width: 1
									}),
									fill: new Fill({
										color: '#ffffff' //填充颜色
									}),
								})
							}),
							zIndex: 32
						});
					for (var i = 0; i < 5; i++) {
						var map = _this.maps[i];
						map.addLayer(_this.measureSoruceVectorLayer);
					}
				}
				if (_this.featuresSourceVectorLayer == null) {
					_this.featuresSourceVectorLayer = new VEctor({
							source: _this.featuresSource,
							zIndex: 33
						});
					_this.featuresSourceVectorLayer.name = "featuresSourceVectorLayer";
					for (var i = 0; i < 5; i++) {
						var map = _this.maps[i];
						map.addLayer(_this.featuresSourceVectorLayer);
					}
				}
				if (_this.featuresSourceVectorLayerAllImage == null) {
					_this.featuresSourceVectorLayerAllImage = new VEctor({
							source: _this.featuresSourceAllImage,
							zIndex: 34
						});
					_this.featuresSourceVectorLayerAllImage.name = "featuresSourceVectorLayerAllImage";
					for (var i = 0; i < 5; i++) {
						var map = _this.maps[i];
						map.addLayer(_this.featuresSourceVectorLayerAllImage);
					}
				}
				if (_this.featuresSourceVectorLayerPageImage == null) {
					_this.featuresSourceVectorLayerPageImage = new VEctor({
							source: _this.featuresSource,
							zIndex: 35
						});
					_this.featuresSourceVectorLayerPageImage.name = "featuresSourceVectorLayerPageImage";
					for (var i = 0; i < 5; i++) {
						var map = _this.maps[i];
						map.addLayer(_this.featuresSourceVectorLayerPageImage);
					}
				}

				_this.loadCssCode('.drawTooltip {' +
					'position: relative;' +
					'background:#ffffff;' +
					'border-radius: 4px;' +
					'color: #000000;' +
					'padding: 2px 2px;' +
					'opacity: 0.7;' +
					'white-space: nowrap;' +
					'border: 1px solid #000000;' +
					'font-size:6px' +
					'}');

				_this.loadCssCode('.measureTooltip {' +
					'position: relative;' +
					'background:#ffffff;' +
					'border-radius: 4px;' +
					'color: #000000;' +
					'padding: 2px 2px;' +
					'opacity: 0.7;' +
					'white-space: nowrap;' +
					'border: 1px solid #000000;' +
					'font-size:6px' +
					'}');

				_this.loadCssCode('.feature-popup {' +
					'position: absolute;' +
					'background-color: white;' +
					'-webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));' +
					'filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));' +
					'padding: 15px;' +
					'border-radius: 10px;' +
					'border: 1px solid #cccccc;' +
					'bottom: 12px;' +
					'left: -50px;' +
					'min-width: 200px;' +
					'}');

				_this.loadCssCode('.feature-popup:after, .feature-popup:before {' +
					'top: 100%;' +
					'border: solid transparent;' +
					'content: " ";' +
					'height: 0;' +
					'width: 0;' +
					'position: absolute;' +
					'pointer-events: none;' +
					'}');

				_this.loadCssCode('.feature-popup:after {' +
					'border-top-color: white;' +
					'border-width: 10px;' +
					'left: 48px;' +
					'margin-left: -10px;' +
					'}');

				_this.loadCssCode('.feature-popup:before {' +
					'border-top-color: #cccccc;' +
					'border-width: 11px;' +
					'left: 48px;' +
					'margin-left: -11px;' +
					'}');

				_this.loadCssCode('.feature-popup-closer {' +
					'text-decoration: none;' +
					'position: absolute;' +
					'top: 2px;' +
					'right: 8px;' +
					'}');

				_this.loadCssCode('.feature-popup-closer:after {' +
					'content: "✖";' +
					'}');
				if (_this.mapTargetDivs.length > 0) {
					for (var i = 0; i < _this.mapTargetDivs.length; i++) {

						var child = document.getElementById(_this.mapTargetDivs[i].toString());
						if (child)
							child.parentNode.removeChild(child);
					}
					_this.mapTargetDivs = [];
				}
			}
			_this.initPop();
			if (initcallback != null) {
				_this.initcallbackfunc('init completed.');

			}
		}
		_this.refreshMapLayer();
	};
	/**
	 * @Description:  更新指定的地图对象
	 * @Param:index：地图对象索引（0，1，2，3，4）默认不填添加全部地图对象
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.refreshMapLayer = function (index) {
		var _this = this;
		if (index) {
			var map = _this.maps[index];
			map.updateSize();
			map.render();
		} else {
			for (var i = 0; i < 5; i++) {
				var map = _this.maps[i];
				map.updateSize();
				map.render();
			}
		}
	};
	/**
	 * @Description:  添加图层
	 * @Param:
	 * layerType(
	 * "WMS": //geoserver引擎动态地图服务,
	 * "ImageArcGIS": //arcgisserver引擎动态地图服务,
	 * "TileArcGIS": //arcgisserver引擎瓦片地图服务,
	 * "ImageStatic": //图片贴图地图服务),
	 * "XYZ": //（天地图/谷歌）,
	 * name(自定义名称),
	 * layerUrl(地图url),
	 * visible(true/false),
	 * params(自定义)
	 * index：地图对象索引（0，1，2，3，4）默认不填添加全部地图对象
	 * @return: void
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.addLayer = function (layerType, name, layerUrl, visible,params, index) {
		var _this = this;
		if (_this.twoDMapDiv != null) {
			if (index) {
				var map = _this.maps[index];
				_this._addLayer(layerType, name, layerUrl, visible,params, index, map);
			} else {
				for (var i = 0; i < 5; i++) {
					var map = _this.maps[i];
					_this._addLayer(layerType, name, layerUrl, visible,params, index, map);
				}
			}
			_this.refreshMapLayer();
		}
	};
	/**
	 * @Description:  内部添加图层方法
	  * layerType(
	 * "WMS": //geoserver引擎动态地图服务,
	 * "ImageArcGIS": //arcgisserver引擎动态地图服务,
	 * "TileArcGIS": //arcgisserver引擎瓦片地图服务,
	 * "ImageStatic": //图片贴图地图服务),
	 * "XYZ": //（天地图/谷歌）,
	 * name(自定义名称),
	 * layerUrl(地图url),
	 * visible(true/false),
	 * params(自定义)
	 * index：地图对象索引（0，1，2，3，4）默认不填添加全部地图对象
	 * map:地图对象
	 * @return: void
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype._addLayer = function (layerType, name, layerUrl, visible, params, index, map) {
		var _this = this;
		if (_this.twoDMapDiv != null) {
			switch (layerType) {
			case "WMS": //geoserver引擎动态地图服务
				var layer = new Image({
						name: name,
						source: new ImageWMS({
							url: layerUrl,
							params: {
								LAYERS: layerName,
							},
						}),
						visible: visible
					});
				map.addLayer(layer);
				break;
			case "ImageArcGIS": //arcgisserver引擎动态地图服务
				var layer = new ImageLayer({
				  name: name,
				  title: name,
				  source: new ImageArcGISRest({
				    ratio: 1,
				    params: params,
				    url: layerUrl,
				    projection: new Projection({
				      units: 'degrees',
				      code: 'EPSG:4326'
				      // code: 'EPSG:4490'
				    })
				  }),
				  visible: visible
				});
				map.addLayer(layer);
				break;
			case "TileArcGIS": //arcgisserver引擎瓦片地图服务
				var layer = new Tile({
						name: name,
						title: name,
						//extent: [-13884991, 2870341, -7455066, 6338219],
						source: new TileArcGISRest({
							url: layerUrl,
						}),
						visible: visible
					});
				map.addLayer(layer);
				break;
			case "ImageStatic": //图片贴图地图服务
				var extent = extent; //[0, 0, 1024, 968];//图片图层四至
				var layer = new Image({
						name: name,
						title: name,
						source: new Static({
							url: layerUrl,
							imageExtent: extent
						}),
						visible: visible
					});
				map.addLayer(layer);
				break;
			case "XYZ": //（天地图/谷歌）
					var layer = new Tile({
					  name: name,
					  title: name,
					  source: new XYZ({
					    url: layerUrl
					  }),
					  visible: visible
					});
				map.addLayer(layer);
				break;
			}
		}
	};
	/**
	 * @Description:  隐藏图层
	 * @Param:  name：图层名称,index：地图对象索引（0，1，2，3，4）默认不填，隐藏所有地图对象下的指定图层
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.hideLayer = function (name, index) {
		var _this = this;
		if (_this.twoDMapDiv != null) {
			if (index) {
				var map = _this.maps[index];
				var layers = map.getLayers();
				for (var i = 0; i < layers.array_.length; i++) {
					var layer = layers.array_[i];
					if (layer.values_.name == name) {
						layer.values_.visible = false;
						break;
					}
				}
			} else {
				for (var i = 0; i < 5; i++) {
					var map = _this.maps[i];
					var layers = map.getLayers();
					for (var j = 0; j < layers.array_.length; j++) {
						var layer = layers.array_[j];
						if (layer.values_.name == name) {
							layer.values_.visible = false;
							break;
						}
					}
				}
			}
		}
		_this.refreshMapLayer();
	},
	/**
	 * @Description:  显示图层
	 * @Param:  name：图层名称,index：地图对象索引（0，1，2，3，4）默认不填，显示所有地图对象下的指定图层
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.showLayer = function (name, index) {
		var _this = this;
		if (_this.twoDMapDiv != null) {
			if (index) {
				var map = _this.maps[index];
				var layers = map.getLayers();
				for (var i = 0; i < layers.array_.length; i++) {
					var layer = layers.array_[i];
					if (layer.values_.name == name) {
						layer.values_.visible = true;
						break;
					}
				}
			} else {
				for (var i = 0; i < 5; i++) {
					var map = _this.maps[i];
					var layers = map.getLayers();
					for (var j = 0; j < layers.array_.length; j++) {
						var layer = layers.array_[j];
						if (layer.values_.name == name) {
							layer.values_.visible = true;
							break;
						}
					}
				}
			}
		}
		_this.refreshMapLayer();
	},
	/**
	 * @Description:  删除图层
	 * @Param: name：图层名称,index：地图对象索引（0，1，2，3，4）默认不填，删除所有地图对象下的指定图层
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.removeLayer = function (name, index) {
		var _this = this;
		if (_this.twoDMapDiv != null) {
			if (index) {
				var map = _this.maps[index];
				var layers = map.getLayers();
				for (var i = 0; i < layers.array_.length; i++) {
					var layer = layers.array_[i];
					if (layer.values_.name == name) {
						map.removeLayer(layer);
						break;
					}
				}
			} else {
				for (var i = 0; i < 5; i++) {
					var map = _this.maps[i];
					var layers = map.getLayers();
					for (var j = 0; j < layers.array_.length; j++) {
						var layer = layers.array_[j];
						if (layer.values_.name == name) {
							map.removeLayer(layer);
							break;
						}
					}
				}
			}
			_this.refreshMapLayer();
		}
	},
	/**
	 * @Description:  改变图层顺序
	 * @Param:  name：图层名称,index：地图对象索引（0，1，2，3，4）默认不填，所有地图对象下的指定图层，zIndex：显示层级
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.changeLayerZIndex = function (name, index, zIndex) {
		var _this = this;
		if (index) {
			var map = _this.maps[index];
			var layers = map.getLayers();
			for (var i = 0; i < layers.array_.length; i++) {
				var layer = layers.array_[i];
				if (layer.values_.name == name) {
					layer.values_.zIndex = zIndex;
					break;
				}
			}
		} else {
			for (var i = 0; i < 5; i++) {
				var map = _this.maps[i];
				var layers = map.getLayers();
				for (var j = 0; j < layers.array_.length; j++) {
					var layer = layers.array_[j];
					if (layer.values_.name == name) {
						layer.values_.zIndex = zIndex;
						break;
					}
				}
			}
		}
		_this.refreshMapLayer();
	},
	/**
	 * @Description:分屏
	 * @Param:number:分屏数量,borderFlag：是否显示分屏边框
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.mapSplitInit = function (number, borderFlag) {
		var _this = this;
		if (_this.swipe)
			return;
		var width = (100 / number);
		var heitht = 100;

		var twoMap = document.getElementById(_this.twoDMapDiv);
		if (twoMap)
			twoMap.parentNode.removeChild(twoMap);

		var threeDMap = document.getElementById(_this.threeDMapDiv);
		if (threeDMap)
			threeDMap.parentNode.removeChild(threeDMap);
		if (_this.mapTargetDivs.length > 0) {
			for (var i = 0; i < _this.mapTargetDivs.length; i++) {

				var mapDiv = document.getElementById(_this.mapTargetDivs[i]);
				if (mapDiv)
					mapDiv.parentNode.removeChild(mapDiv);
			}
		}
		if (number == 1) {
			document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj);
			_this.loadCssCode('.map { width:' + width + '%;height: 100%;position: absolute;float:left;}');
			_this.mapTargetDivs = [];
		} else {
			switch (number) {
			case 2: {
					width = 49.5;
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj0);
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj1);
					break;
				}
			case 4: {
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj0);
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj1);
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj2);
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj3);
					width = 50;
					heitht = 50;
					break;
				}
			case 3: {
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj0);
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj1);
					document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj2);
				}
			}

			_this.loadCssCode('.map {width:' + width + '%;height:' + heitht + '%;position: relative;float:left;border: 1px solid #333}}');
			_this.mapTargetDivs = [];
			for (var j = 0; j < number; j++) {
				var targetDiv = "gisMap_div" + j;
				_this.mapTargetDivs.push(targetDiv);
			}
		}
		if (borderFlag) {
			var viewport = document.getElementsByClassName("ol-viewport"); //.borderColor="#f9110e;"
			for (var i = 0; i < viewport.length; i++) {
				viewport[i].border = "solid 1px #f9110e";
			}
			if (number == 1) {
				var viewport = document.getElementsByClassName("ol-viewport"); //.borderColor="#f9110e;"
				for (var i = 0; i < viewport.length; i++) {
					viewport[i].border = "solid 0px #f9110e";
				}
			}
		}
		_this.refreshMapLayer();
	},
	/**
	 * @Description:打开卷帘
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/3/4
	 */
	GisMapApi.prototype.openSwipe = function () {
		var _this = this;
		if (_this.mapTargetDivs.length > 0)
			return;
		if (_this.swipe)
			return;
		var width = 100;
		var heitht = 100;

		var twoMap = document.getElementById(_this.twoDMapDiv);
		if (twoMap)
			twoMap.parentNode.removeChild(twoMap);

		var threeDMap = document.getElementById(_this.threeDMapDiv);
		if (threeDMap)
			threeDMap.parentNode.removeChild(threeDMap);
		if (_this.mapTargetDivs.length > 0) {
			for (var i = 0; i < _this.mapTargetDivs.length; i++) {

				var mapDiv = document.getElementById(_this.mapTargetDivs[i]);
				if (mapDiv)
					mapDiv.parentNode.removeChild(mapDiv);
			}
		}
		document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj1);
		document.getElementById(_this.gisMapContentDiv).append(_this.twoDMapDivObj0);

		_this.loadCssCode('.map {width:' + width + '%;height:' + heitht + '%;float:left;position:absolute;box-sizing: border-box;}');
		_this.mapTargetDivs = [];
		for (var j = 0; j < 2; j++) {
			var targetDiv = "gisMap_div" + j;
			_this.mapTargetDivs.push(targetDiv);
		}
		var viewport = document.getElementsByClassName("ol-viewport"); //.borderColor="#f9110e;"
		for (var i = 0; i < viewport.length; i++) {
			viewport[i].style.border = "solid 0px #f9110e";
		}
		_this.refreshMapLayer();
		var swipe = document.createElement('div');
		swipe.setAttribute("id", "swipe");
		swipe.setAttribute("class", "swipe_bg");
		swipe.setAttribute("title", "水平拖动");
		swipe.style.visibility = "hidden";
		swipe.innerHTML = "<div class=swipe_drag></div>";
		document.getElementById(_this.gisMapContentDiv).append(swipe);
		document.getElementById("swipe").style.height = document.getElementById(_this.gisMapContentDiv).offsetHeight - 2 + "px";
		document.getElementById("swipe").style.visibility = "visible"; //显示
		swipe.onmousemove=function (e) {
			this.style.cursor = 'w-resize';
		}
		swipe.onmouseout=function (e) {
			this.style.cursor = 'default';
		}
		_this.swipe = document.getElementsByClassName("swipe_bg")[0]; //获取元素

		var height = document.body.clientHeight;
		var width = document.body.clientWidth;
		document.getElementById('gisMap_div0').style.clip = 'rect(0px,' + width / 2 + 'px,' + height + 'px,0px)';

		_this.swipe.style.left = width / 2 + "px";
		_this.refreshMapLayer();
		var x,
		y; //存储div的坐标
		var isDrop = false; //移动状态的判断鼠标按下才能移动
		_this.swipe.onmousedown = function (e) {
			var e = e || window.event; //要用event这个对象来获取鼠标的位置
			x = e.clientX - _this.swipe.offsetLeft;
			// y = e.clientY - _this.swipe.offsetTop;
			isDrop = true; //设为true表示可以移动
		}

		document.onmousemove = function (e) {
			//是否为可移动状态                　　　　　　　　　　　 　　　　　　　
			if (isDrop) {
				var e = e || window.event;
				var moveX = e.clientX - x; //得到距离左边距离                    　　
				// var moveY = e.clientY - y; //得到距离上边距离
				var maxX=document.getElementById(_this.gisMapContentDiv).offsetWidth- _this.swipe.offsetWidth-11;
				//var maxX = document.documentElement.clientWidth - _this.swipe.offsetWidth-11;
				// var maxY = document.documentElement.clientHeight - _this.swipe.offsetHeight;
				//范围限定
				moveX = Math.min(maxX, Math.max(0, moveX));
				// moveY = Math.min(maxY, Math.max(0, moveY));
				_this.swipe.style.left = moveX + "px";
				// _this.swipe.top = moveY + "px";
				console.log(e);
				e.stopPropagation();
				var height = document.body.clientHeight;
				document.getElementById('gisMap_div0').style.clip = 'rect(0px,' + moveX + 'px,' + height + 'px,0px)';
				// document.getElementById('gisMap_div0').clip='rect('+document.documentElement.clientWidth+'px', 0+'px', moveX+'px', height+'px)';
				_this.refreshMapLayer();
			} else {
				return;
			}
		}
		document.onmouseup = function () {
			isDrop = false; //设置为false不可移动
		}
	},
	/**
	 * @Description:  关闭席卷
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.closeSwipe = function () {
		var _this = this;
		if (_this.swipe) {
			_this.swipe.style.left = 0 + "px";
			var height = document.body.clientHeight;
			var width = document.body.clientWidth;
			document.getElementById('gisMap_div0').style.clip = 'rect(0px,' + width + 'px,' + height + 'px,0px)';
			_this.refreshMapLayer();
			document.getElementById("swipe").style.visibility = "hidden"; //隐藏
			var child = document.getElementById("swipe");
			if (child)
				child.parentNode.removeChild(child)
				_this.swipe = null;
			_this.mapSplitInit(1);
		}
	}
	/**
	 * @Description:设置中心点
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/10
	 */
	GisMapApi.prototype.setCenter = function (geometry, level) {
		var _this = this;
		if (geometry) {
			//转wkt为feature
			var _geometry = new format.WKT().readFeature(geometry, {
					dataProjection: 'EPSG:4326',
					featureProjection: 'EPSG:4326'
				});
			//var _geometry = _this.transformFeatureFromWkt(geometry);
			_this.map.getView().setCenter(_geometry.values_.geometry.flatCoordinates); //中心点
		}
		if (level) {
			_this.map.getView().setZoom(2); //级别
		}
	},
	//转wkt为feature
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.transformFeatureFromWkt = function (wkt) {
		var _this = this;
		var format = new WKT();
		var feature = format.readFeature(wkt, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
		return feature;
	}
	/**
	 * @Description:  打开放大缩小控件
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/3/19
	 */
	GisMapApi.prototype.openTwoDMapZoomInOutTool = function () {
		var _this = this;
		// _this.loadCssCode('.ol-overlaycontainer-stopevent' +
		// 	'{' +
		// 	'display:block;' +
		// 	'}');
		//_this.refreshMapLayer();
	}
	/**
	 * @Description:  关闭放大缩小控件
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/3/19
	 */
	GisMapApi.prototype.closeTwoDMapZoomInOutTool = function () {
		var _this = this;
		// _this.loadCssCode('.ol-overlaycontainer-stopevent' +
		// 	' {' +
		// 	'  display:none;' +
		// 	'  }');
		//_this.refreshMapLayer();
	}
	/**
	 * @Description:  添加比例尺
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/15
	 */
	GisMapApi.prototype.openTwoDMapScaleLine = function () {
		var _this = this;
		//加载比例尺控件  
		_this.scaleLineControl = new contrScaleLine({
				//设置度量单位为米    
				units: 'metric'
			});
		_this.map.addControl(_this.scaleLineControl);
	}
	GisMapApi.prototype.closeTwoDMapScaleLine = function () {
		var _this = this;
		if (_this.scaleLineControl) {
			_this.map.removeControl(_this.scaleLineControl);
		}
	}
	GisMapApi.prototype.getTwoMaplevle = function () {
		var _this = this;
		if (_this.twoDMapDiv != null) {
			var level = _this.map.getView().getZoom();
			return level
		}
		return 0;
	}
	/**
	 * @Description:  判断点是否在多边形内
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/5/23
	 */
	GisMapApi.prototype.isInPolygon = function (checkPoint, polygonPoints) {
		var _this = this;
		var counter = 0;
		var i;
		var xinters;
		var p1,
		p2;
		var pointCount = polygonPoints.length;
		p1 = polygonPoints[0];

		for (i = 1; i <= pointCount; i++) {
			p2 = polygonPoints[i % pointCount];
			if (
				checkPoint[0] > Math.min(p1.x, p2.x) &&
				checkPoint[0] <= Math.max(p1.x, p2.x)) {
				if (checkPoint[1] <= Math.max(p1.y, p2.y)) {
					if (p1.x != p2.x) {
						xinters =
							(checkPoint[0] - p1.x) *
						(p2.y - p1.y) /
						(p2.x - p1.x) +
						p1.y;
						if (p1.y == p2.y || checkPoint[1] <= xinters) {
							counter++;
						}
					}
				}
			}
			p1 = p2;
		}
		if (counter % 2 == 0) {
			return false;
		} else {
			return true;
		}
	},
	/**
	 * 经纬度转墨卡托
	 * @param poi 经纬度
	 * @returns {{}}
	 * @private
	 */
	GisMapApi.prototype.getLngLatToMercator = function (poi) { //[114.32894, 30.585748]
		var _this = this;
		var mercator = {};
		var earthRad = 6378137.0;
		// console.log("mercator-poi",poi);
		mercator.x = poi.lng * Math.PI / 180 * earthRad;
		var a = poi.lat * Math.PI / 180;
		mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
		// console.log("mercator",mercator);
		return mercator; //[12727039.383734727, 3579066.6894065146]
	},
	/**
	 * 墨卡托转经纬度
	 * @param poi 墨卡托
	 * @returns {{}}
	 * @private
	 */
	GisMapApi.prototype.getMercatorToLngLat = function (poi) {
		var _this = this;
		var lnglat = {};
		lnglat.lng = poi.x / 20037508.34 * 180;
		var mmy = poi.y / 20037508.34 * 180;
		lnglat.lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
		return lnglat;
	},
	/**
	 * 经纬度Lng转墨卡托x
	 * @param poi 经纬度
	 * @returns {{}}
	 * @private
	 */
	GisMapApi.prototype.getLngToMercatorX = function (lng) { //114.32894
		var _this = this;
		var earthRad = 6378137.0;
		var x = lng* Math.PI / 180 * earthRad;
		return x; //[12727039.383734727
	},
	/**
	 * 经纬度Lat转墨卡托y
	 * @param poi 经纬度
	 * @returns {{}}
	 * @private
	 */
	GisMapApi.prototype.getLatToMercatorY = function (Lat) { // 30.585748
		var _this = this;
		var earthRad = 6378137.0;
		var a = Lat * Math.PI / 180;
		var y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
		return y;// 3579066.6894065146
	},
	/**
	 * 墨卡托转经纬度Lng
	 * @param poi 墨卡托
	 * @returns {{}}
	 * @private
	 */
	GisMapApi.prototype.getMercatorToLng = function (x) {
		var _this = this;
		var lng = x / 20037508.34 * 180;
		return lng;
	},
	/**
	 * 墨卡托转经纬度Lat
	 * @param poi 墨卡托
	 * @returns {{}}
	 * @private
	 */
	GisMapApi.prototype.getMercatorToLat = function (y) {
		var _this = this;
		var mmy = y / 20037508.34 * 180;
		var lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
		return lat;
	},
	/**
	 * @Description:  获取空间两点直线距离
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/5/31
	 */
	GisMapApi.prototype.getStraightLineDistance = function (lon1, lat1, lon2, lat2) {
		var _this = this;
		var DEF_PI = 3.14159265359; // PI
		var DEF_2PI = 6.28318530712; // 2*PI
		var DEF_PI180 = 0.01745329252; // PI/180.0
		var DEF_R = 6370693.5; // radius of earth
		var ew1,
		ns1,
		ew2,
		ns2;
		var dx,
		dy,
		dew;
		var distance;
		// 角度转换为弧度
		ew1 = lon1 * DEF_PI180;
		ns1 = lat1 * DEF_PI180;
		ew2 = lon2 * DEF_PI180;
		ns2 = lat2 * DEF_PI180;
		// 经度差
		dew = ew1 - ew2;
		// 若跨东经和西经180 度，进行调整
		if (dew > DEF_PI)
			dew = DEF_2PI - dew;
		else if (dew < -DEF_PI)
			dew = DEF_2PI + dew;
		dx = DEF_R * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
		dy = DEF_R * (ns1 - ns2); // 南北方向长度(在经度圈上的投影长度)
		// 勾股定理求斜边长
		distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);
		// console.log(distance)
		return distance;
	}
	 //放大
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.zoomOut= function() {
	  var _this = this;
	  _this.map.getView().setZoom(_this.map.getView().getZoom() + 1);
	}
	//缩小
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.zoomIn= function() {
	  var _this = this;
	  _this.map.getView().setZoom(_this.map.getView().getZoom() - 1);
	}
	/**
	 * @Description:移除图片
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.removeIconFeature=function(feature) {
		var _this = this;
		_this.featuresSource.removeFeature(feature);
	}
	/**
	 * @Description:添加GIF图片
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.addGIF=function(feature) {
		var gifDiv= document.createElement('div');
		gifDiv.setAttribute("id", "gifDiv");
		gifDiv.setAttribute("style","width:"+feature.style.width+"px;height:"+feature.style.height+"px;background:url("+feature.style.imagesrc+")");
		var _this = this;
		var gif = new Overlay({
        positioning: 'center-bottom',
        element: gifDiv,//绑定上面添加的元素
        //stopEvent: false,
        offset: [-13.5, -40],//图片偏移量//当前窗口可见
		autoPan: true,
		stopEvent: false,
		autoPanAnimation: {
		  //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
		  duration: 250
		}
		});
		var featureTemp = _this.transformFeatureFromWkt(feature.geometry);
		gif.setPosition(featureTemp.values_.geometry.flatCoordinates); //显示
		_this.map.addOverlay(gif);

	}
	/**
	 * @Description:添加Static图片
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.addIcon=function(feature) {
	  var _this = this;
	  var style = new Style({
	    /**{olx.style.IconOptions}类型*/
	    image: new Icon(
	      ({
	        scale: 0.5,
	        //图标的url
	        src: '../common/js/gis_plugin/img/blueIcon.png'
	      })
	    )
	  });
	  if (feature.style) {
	    style = new Style({
	      /**{olx.style.IconOptions}类型*/
	      image: new Icon(
	        ({
	          //图标缩放比例
	          scale: feature.style.imagescale,
	          //图标的url
	          src: feature.style.imagesrc
	        })
	      )
	    });
	  }
	  if (feature.geometry == undefined) {
	    return;
	  }
	  //转wkt为feature
	  var featureTemp = _this.transformFeatureFromWkt(feature.geometry);
	  //应用样式
	  featureTemp.setStyle(style);
	  featureTemp.attributes = feature.attributes;
		var featureTempId = _this.generateUUID();
	  featureTemp.id = featureTempId;
	  featureTemp.id_ = featureTempId;
	  //添加到图层
	  _this.featuresSource.addFeature(featureTemp);
		var _feature=null;
	  _feature= _this.featuresSource.getFeatureById(featureTempId);
    return _feature;
	}
	/**
	 * @Description:添加点
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.addPoint=function(feature) {
	  var _this = this;
	  var style = new Style({
	    //把点的样式换成ICON图标
	    fill: new Fill({
	      //填充颜色
	      color: 'rgba(37,241,239,0.2)'
	    }),
	    //图形样式，主要适用于点样式
	    image: new Circle({
	      //半径大小
	      radius: 5,
	      //填充
	      fill: new Fill({
	        //填充颜色
	        color: '#e81818'
	      })
	    }),
	    //层
	    zIndex: 20
	  })
	  if (feature.style) {
	    style = new Style({
	      //填充色
	      fill: new Fill({
	        color: feature.style.fillcolor
	      }),
	      //边线颜色
	      stroke: new Stroke({
	        color: feature.style.strokecolor,
	        width: feature.style.strokewidth
	      }),
	      //形状
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
	  //转wkt为feature
	  var featureTemp = _this.transformFeatureFromWkt(feature.geometry);
	  //应用样式
	  featureTemp.setStyle(style);
	  featureTemp.attributes = feature.attributes;
	  //添加到图层
	  _this.featuresSource.addFeature(featureTemp);
	}
	/**
	 * @Description:添加线
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.addLineString= function(feature) {
	  var _this = this;
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
	  //转wkt为feature
	  var featureTemp = _this.transformFeatureFromWkt(feature.geometry);
	  //应用样式
	  featureTemp.setStyle(style);
	  featureTemp.attributes = feature.attributes;
	  var featureTempId = _this.generateUUID();
	  featureTemp.id = featureTempId;
	  featureTemp.id_ = featureTempId;
	  //添加到图层
	  _this.featuresSource.addFeature(featureTemp);
	  var feature= _this.featuresSource.getFeatureById(featureTempId);
	  return feature;
	}
	/**
	 * @Description:添加面
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.addCrossPolygon=function(feature, source) {
	  var _this = this;
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
	  //转wkt为feature
	  var featureTemp = _this.transformFeatureFromWkt(feature.geometry);
	  //应用样式
	  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	  let line1=document.createElementNS('http://www.w3.org/2000/svg', 'line');
	  let line2=document.createElementNS('http://www.w3.org/2000/svg', 'line');
	  line1.style.stroke="#FF4500";
	  line1.style.strokewidth='1';
	  line1.setAttribute('x1', 0);
	  line1.setAttribute('y1', 0);
	  line1.setAttribute('x2', 10);
	  line1.setAttribute('x2', 10);
	  line2.style.strokewidth='1';
	  line2.style.stroke="#FF4500";
	  line2.setAttribute('x1', 0);
	  line2.setAttribute('y1', 0);
	  line2.setAttribute('x2', 10);
	  line2.setAttribute('x2', 10);
	  svg.appendChild(line1);
	  svg.appendChild(line2);
	  var cnv = document.createElement('canvas');
      var ctx = cnv.getContext('2d');
	  var serializer = new XMLSerializer();
      //var str = '<svg xmlns="http://www.w3.org/2000/svg" width="10px"height="10px">'+svg.innerHTML+'</svg>';
	  var str="<svg xmlns='http://www.w3.org/2000/svg' width='10px' height='10px' version='1.1'>"+
	"<line x1='0' y1='0' x2='10' y2='10' style='stroke:"+feature.style.strokecolor+";stroke-width:1'></line>"+
	"<line x1='-10' y1='20' x2='10' y2='0' style='stroke:"+feature.style.strokecolor+";stroke-width:1'></line>"+
	"</svg>"
      var img = new Image();
      img.setAttribute('src', 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(str))));
      //var img = new Image();
      //img.src = require('@/assets/img/diagonalcross.png');
      img.onload = function () {
        var pattern = ctx.createPattern(img, 'repeat');
		ctx.fillStyle = 'red';
        featureTemp.setStyle(new Style({
            stroke: new Stroke({
                color: 'red',
                //lineDash: [5],
                width: 1
            }),
            fill: new Fill({
                color: pattern
            })
        }));
    };
	  featureTemp.setStyle(style);
	  featureTemp.attributes = feature.attributes;
	  var featureTempId = _this.generateUUID();
	  featureTemp.id = featureTempId;
	  featureTemp.id_ = featureTempId;
	  var feature=null;
	  //添加到图层
	  if (source) {
	    if (source == "featuresSourcePageImage") {//范围框图层
	      _this.featuresSourcePageImage.addFeature(featureTemp);
		  feature= _this.featuresSourcePageImage.getFeatureById(featureTempId);
	    }
	    if (source == "featuresSourceAllImage") {//合并面图层
	      _this.featuresSourceAllImage.addFeature(featureTemp);
		  feature= _this.featuresSourceAllImage.getFeatureById(featureTempId);
	    }
	  } else {
	    _this.featuresSource.addFeature(featureTemp);
		feature= _this.featuresSource.getFeatureById(featureTempId);
	  }
	    return feature;
	}
	/**
	 * @Description:添加面
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.addPolygon=function(feature, source) {
	  var _this = this;
	  var style = new Style({
	    fill: new Fill({ //矢量图层填充颜色，以及透明度
	      color: 'rgba(255, 255, 255, 0)'
	    }),
	    stroke: new Stroke({ //边界样式
	      color: '#ffcc33',
	      width: 1
	    })
	  });
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
	  var featureTemp = _this.transformFeatureFromWkt(feature.geometry);
	  featureTemp.attributes = feature.attributes;
	  var featureTempId = _this.generateUUID();
	  featureTemp.id = featureTempId;
	  featureTemp.id_ = featureTempId;
	  var _feature=null;
	  if (feature.style) {
		if(feature.style.fillStyle=="Cross")
		  {
			   var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			    let line1=document.createElementNS('http://www.w3.org/2000/svg', 'line');
			    let line2=document.createElementNS('http://www.w3.org/2000/svg', 'line');
			    line1.style.stroke="#FF4500";
			    line1.style.strokewidth='1';
			    line1.setAttribute('x1', 0);
			    line1.setAttribute('y1', 0);
			    line1.setAttribute('x2', 10);
			    line1.setAttribute('x2', 10);
			    line2.style.strokewidth='1';
			    line2.style.stroke="#FF4500";
			    line2.setAttribute('x1', 0);
			    line2.setAttribute('y1', 0);
			    line2.setAttribute('x2', 10);
			    line2.setAttribute('x2', 10);
			    svg.appendChild(line1);
			    svg.appendChild(line2);
			    var cnv = document.createElement('canvas');
			    var ctx = cnv.getContext('2d');
			    var serializer = new XMLSerializer();
			    //var str = '<svg xmlns="http://www.w3.org/2000/svg" width="10px"height="10px">'+svg.innerHTML+'</svg>';
			    var str="<svg xmlns='http://www.w3.org/2000/svg' width='10px' height='10px' version='1.1'>"+
			  "<line x1='0' y1='0' x2='10' y2='10' style='stroke:"+feature.style.fillcolor+";stroke-width:1'></line>"+
			  "<line x1='-10' y1='20' x2='10' y2='0' style='stroke:"+feature.style.fillcolor+";stroke-width:1'></line>"+
			  "</svg>"
			    var img = new Image();
			    img.setAttribute('src', 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(str))));
			    //var img = new Image();
			    //img.src = require('@/assets/img/diagonalcross.png');
			    img.onload = function () {
			      var pattern = ctx.createPattern(img, 'repeat');
			  	//ctx.fillStyle = 'red';
			      featureTemp.setStyle(new Style({
			          stroke: new Stroke({
			              color: feature.style.strokecolor,
			              //lineDash: [5],
			              width: 1
			          }),
			          fill: new Fill({
			              color: pattern
			          })
			      }));
			  };
		  }else{
			  style = new Style({
			    fill: new Fill({ //矢量图层填充颜色，以及透明度
			      color: feature.style.fillcolor,
			    }),
			    stroke: new Stroke({ //边界样式
			      color: feature.style.strokecolor,
			      width: feature.style.strokewidth
			    })
			  });
			  featureTemp.setStyle(style);
		  }
	  }
	  //添加到图层
	  if (source) {
	    if (source == "featuresSourcePageImage") {//范围框图层
	      _this.featuresSourcePageImage.addFeature(featureTemp);
		  feature= _this.featuresSourcePageImage.getFeatureById(featureTempId);
	    }
	    if (source == "featuresSourceAllImage") {//合并面图层
	      _this.featuresSourceAllImage.addFeature(featureTemp);
		  feature= _this.featuresSourceAllImage.getFeatureById(featureTempId);
	    }
	  } else {
	    _this.featuresSource.addFeature(featureTemp);
		_feature= _this.featuresSource.getFeatureById(featureTempId);
	  }
        return _feature;
	}
	GisMapApi.prototype.initPop=function(){
		var _this = this;
		_this.popInfo.container = document.createElement('div');
		_this.popInfo.container.className = 'feature-popup';
		_this.popInfo.container.style.zIndex='999';
		_this.popInfo.popupCloser = document.createElement('a');
		_this.popInfo.popupCloser.className = 'feature-popup-closer';
		_this.popInfo.container.append(_this.popInfo.popupCloser);
		// 弹出窗内容DIV
		_this.popInfo.content = document.createElement('div');
		_this.popInfo.container.append( _this.popInfo.content);
		_this.popInfo.content.style.visibility = "hidden";

		_this.popInfo.popupCloser.setAttribute("title", "关闭");
		  _this.popInfo.popupCloser.style.cursor = "pointer";
		  _this.popInfo.popupCloser.style.display = "inline";

		  _this.popInfo.popupCloser.setAttribute("id", "popupCloser");
		  _this.popInfo.content.setAttribute("id", "PopInfo");

		  _this.pop = new Overlay(
		      /** @type {olx.OverlayOptions} */
		      ({
		          //要转换成overlay的HTML元素
		          element: _this.popInfo.container,
		          //当前窗口可见
		          autoPan: true,
		          //Popup放置的位置
		          positioning: 'bottom-center',
		          //是否应该停止事件传播到地图窗口
		          // stopEvent: false,
				  // 如果设置为ture，那么叠置层被放在装载控件的那个div容器中
				  //（该div容器css类名为ol-overlaycontainer-stopevent）
				  // 如果设置为false，那么叠置层被放在css类名为ol-overlaycontainer的div容器下
				  //，由className属性（默认为'ol-overlay-container ol-selectable'）指定类名的div容器中

		          autoPanAnimation: {
		            //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
		            duration: 250
		          }
		      }));
		_this.map.addOverlay(_this.pop);
		_this.popInfo.popupCloser.onclick = function(evt) {
			     _this.popInfo.popupCloser.blur();//解决事件冲突
				 _this.popInfo.content.style.visibility = "hidden";
				 _this.pop.setPosition(undefined);
				 return false;
		}
	}
	GisMapApi.prototype.addPop=function(point,divContent,addPopFinish){
		 var _this = this;
		_this.popInfo.content.innerHTML=divContent
		_this.popInfo.content.style.visibility = "visible";
		// 设置overlay的显示位置
		_this.pop.setPosition(point);
		addPopFinish();
	}
	GisMapApi.prototype.removePop=function(){
		var _this = this
			//_this.popInfo.popupCloser.blur();//解决事件冲突
			_this.popInfo.content.style.visibility = "hidden";
			_this.pop.setPosition(undefined);
		}
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.addFeatureClick=function(callBackFeatureClick, poPshow) {
	  var _this = this;
	  _this.featurePopInfo.container = document.createElement('div');
      _this.featurePopInfo.container.className = 'feature-popup';
      _this.featurePopInfo.popupCloser = document.createElement('a');
      _this.featurePopInfo.popupCloser.className = 'feature-popup-closer';
      _this.featurePopInfo.container.append(_this.featurePopInfo.popupCloser);
      // 弹出窗内容DIV
      _this.featurePopInfo.content = document.createElement('div');
      _this.featurePopInfo.container.append(_this.featurePopInfo.content);
      _this.featurePopInfo.content.style.visibility = "hidden";
      // 弹出窗关闭

      _this.featurePopInfo.popupCloser.setAttribute("title", "关闭");
      _this.featurePopInfo.popupCloser.style.cursor = "pointer";
      _this.featurePopInfo.popupCloser.style.display = "inline";

      _this.featurePopInfo.popupCloser.setAttribute("id", "popupCloser");
      _this.featurePopInfo.content.setAttribute("id", "featurePopInfo");
	  var popupCloser=document.getElementById("popupCloser");
	  _this.featurePopInfo.popupCloser.onclick = function(evt) {
	  		_this.featurePopInfo.content.style.visibility = "hidden";
	  		_this.featurePop.setPosition(undefined);
	  };
	  _this.featurePop = new Overlay(
	      /** @type {olx.OverlayOptions} */
	      ({
	          //要转换成overlay的HTML元素
	          element: _this.featurePopInfo.container,
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
	  // openlayers只有针对整个地图事件监听，可以通过以下方式达到对feature监听，也可对feature自定义点击事件。
	  _this.map.on('click', function(e) {
	      // 在点击时获取像素区域
	      var pixel = _this.map.getEventPixel(e.originalEvent);
	      _this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
	          if (layer) {
	              if (layer.name == "featuresSourceVectorLayer") {
	                  // coodinate存放了点击时的坐标信息
	                  var coodinate = e.coordinate;
	                  callBackFeatureClick(_this.featurePopInfo.content, feature);
	                  // 显示overlay
	                  if (poPshow) {
	                      if (!_this.darwState) {
	                          _this.featurePopInfo.content.style.visibility = "visible";
	                          // 设置overlay的显示位置
	                          var center=getCenter(feature.values_.geometry.extent_);
	                          _this.featurePop.setPosition(center);
	                          _this.map.addOverlay(_this.featurePop);
	                      }
	                  }
	              }
	          }

	      });
	  });
	      // 鼠标移动事件
    _this.map.on('pointermove', function(e) {
        if (e.dragging) {
            return;
        }
        var pixel = _this.map.getEventPixel(e.originalEvent);
        var feature = _this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            if (layer) {
                if (layer.name == "featuresSourceVectorLayer") {
                    return feature;
                }
            }
            return null;
        })
        if (feature) {
            // store.dispatch('getRowId', feature.attributes.F_DATAID)
        } else {
            // store.dispatch('getRowId', "")
        }
    });
    _this.featurePopInfo.popupCloser.onclick = function(evt) {
        _this.featurePopInfo.content.style.visibility = "hidden";
        _this.featurePop.setPosition(undefined);
    };
	}
	GisMapApi.prototype.closeFeaturePop	= function () {
		var _this = this;
    _this.featurePopInfo.isFeaturePopOpen = false;
    _this.map.removeOverlay(_this.featurePop);
	};
	GisMapApi.prototype.addHighlight = function(val) {
	var _this = this;
    var srv = _this.featureOverlay.getSource();
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
      var featureTemp = _this.transformFeatureFromWkt(val.WKTRESPONSE);
      // 应用样式
      featureTemp.setStyle(style);
      _this.featureOverlay.getSource().addFeature(featureTemp)
    }
  }
  // 获取指定名字获取图层
  GisMapApi.prototype.getMapLayer = function (name, index) {
	var _this = this;
    let layer = null
    let layers = _this.map.getLayers()
    for (let i = 0; i < layers.array_.length; i++) {
      let _layer = layers.array_[i]
      if (_layer.values_.name == name) {
        layer = _layer
      }
    }
    return layer
  }
  // 清除点击表格定位重绘的图层
  GisMapApi.prototype.productTableFeaturesRemove = function() {
	var _this = this;
    var productTableFeatures = _this.featuresSource.getFeatures()
    for (var i = 0; i < productTableFeatures.length; i++) {
      if(productTableFeatures[i].attributes["productTable_id"] === ''){
        _this.featuresSource.removeFeature(productTableFeatures[i])
        break
      }
    }
  },
  // 清除移入表格定位重绘的图层
  GisMapApi.prototype.productTableHoverRemove = function() {
	var _this = this;
    var productTableHoverFeatures = _this.featuresSource.getFeatures()
    for (var i = 0; i < productTableHoverFeatures.length; i++) {
      if(productTableHoverFeatures[i].attributes["productTable_hover"] === ''){
        _this.featuresSource.removeFeature(productTableHoverFeatures[i])
        break
      }
    }
  },
  // 改变位置分辨率
  GisMapApi.prototype.checkZoomAndCenter = function () {
	var _this = this;
    if (_this.isReplayCy) {
      _this.isReplayCy = false
      return
    }
    _this.viewArrCy = _this.viewArrCy.slice(0, _this.viewArrIndexCy + 1)
    let wkt = _this.sourceFeature
    let zoom = _this.map.getView().getZoom()
    let obj = {wkt, zoom}
    _this.viewArrCy.push(obj)
    _this.viewArrIndexCy = _this.viewArrCy.length - 1
    // gisMap.judgeViewImg(gisMap.viewArrIndexCy)
  },
  // 回放-前放
  GisMapApi.prototype.computeViewArr = function (handle) {
	var _this = this;
    _this.isReplayCy = true
    let index = _this.viewArrIndexCy
    if (handle === 'prev') {
      index = index - 1 < 0 ? index : --index
    } else if (handle === 'next') {
      index = index + 1 > _this.viewArrCy.length - 1 ? index : ++index
    }
    // gisMap.judgeViewImg(index)
    _this.viewArrIndexCy = index
    _this.localtionCy(_this.viewArrCy[index])
  },
  // 定位
  GisMapApi.prototype.localtionCy = function (local = {}) {
	var _this = this;
    _this.clearAllDraws()
    let feature = local.wkt
    _this.drawPolygon(feature)
    let f = _this.transformFeatureFromWkt(feature.geometry)
    // 飞到某地
    _this.flyTo(f, () => {})
  },
  // 书签
  GisMapApi.prototype.bookList = function (e) {///specialMapLayers有问题
	var _this = this;
    if (Object.keys(this.bookListComponent).length) {
      this.bookListComponent._data.divVisible = !this.bookListComponent._data.divVisible
      if (this.bookListComponent._data.divVisible) {
        bookTestGet()
      }
      this.bookListComponent._data.bookListData = this.bookListData
      this.bookListComponent._data.inputDivFlag = false
      return
    }
    const template = document.createElement('template')
    e.target.parentNode.appendChild(template)
    // let height = this.vm.$el.parentNode.clientHeight + 'px'
    const component = Vue.component('bookListDiv', {
      data () {
        return {
          bookListData: [],
          divVisible: true,
          styles:{
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
          // imgSrc: require('@/assets/img/delete.png')
        }
      },
      methods: {
        inputDivShow () {
          this.inputDivFlag = true
        },
        addBookList () {
          if (!this.mapName) {
            Message.error('书签名称不能为空')
            return
          }
          let wkt = ''
          wkt = store.state.searchStore.wkt || _this.sourceFeature.geometry
          // console.log(store.searchStore.wkt)
          let mapConfigList = []
          _this.specialMapLayers.map(each => {
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
            center: _this.map.getView().getCenter().join(','),
            zoom: _this.map.getView().getZoom()
          }
          // let param = new URLSearchParams()
          // param.append('bookmarksVoJson', JSON.stringify(dataObj))
          http.addBookList(dataObj).then(res => {
            if (res) {
              Message.success('添加成功！')
              bookTestGet()
            } else {
              Message.error('书签名称已存在!')
            }
          })
        },
        deleteBook (item) {
          http.deleteBookList({id: item.id}).then(res => {
            if (res.data === true) {
              Message.success('删除成功！')
              bookTestGet()
            }
          }).catch(err => {
            Message.error(err)
          })
        },
        positionBook (data) {
          _this.clearAllDraws()
          let {center, zoom, mapConfigList, wkt} = data
          _this.specialMapLayers.map(each => {
            mapConfigList.map(item => {
              if (each.values_.id == item.serviceId) {
                each.values_.zIndex = item.serviceOrder
                each.values_.visible = item.serviceStatus
              }
            })
          })
          if(Object.keys(_this.controlLayerComponent).length) {
            _this.controlLayerComponent._data.specialMapLayers = _this.specialMapLayers
          }
          let arr = center.split(',')
          center = arr.map(each => {
            return Number(each)
          })
          let feature = {
            'attributes': {

            },
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
          _this.drawPolygon(feature)
          _this.map.getView().animate({
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
    function bookTestGet () {
      http.getBookList().then(res => {
        _this.bookListComponent._data.bookListData = res.data
      }).catch(err => {
        Message.error(err)
      })
    }
  }
	 /**
	 * @Description:显示坐标
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/11/13
	 */
	GisMapApi.prototype.showMapXY=function()
	{
		var _this = this;
		 _this.map.addControl(new MousePosition());
	}
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.getCenterPoint=function(arr) {
	  var k = arr.length / 2;
	  var xarr = 0,
	    yarr = 0;
	  for (var i = 0; i < arr.length; i++) {
	    if (i % 2 == 0) {
	      xarr += arr[i];
	    } else {
	      yarr += arr[i];
	    }
	  }
	  var x = xarr / k;
	  var y = yarr / k;
	  var point = [x, y];
	  return point;
	}
	// 飞到某地
	GisMapApi.prototype.flyTo=function(feature, done) {
	  var _this = this;
	  var duration = 2000;
	  var parts = 2;
	  var called = false;
	  var polygon = feature.getGeometry()
	  var location = _this.getCenterPoint(polygon.getExtent());
	  var r = _this.map.getView().getResolutionForExtent(polygon.getExtent(), _this.map.getSize());
	  var zoom = _this.map.getView().getZoomForResolution(r);

	  function callback(complete) {
	    --parts
	    if (called) {
	      return
	    }
	    if (parts === 0 || !complete) {
	      called = true
	      done(complete)
	    }
	  }
	  _this.map.getView().animate({
	    center: location,
	    duration: duration
	  }, callback);
	  _this.map.getView().animate({
	    zoom: zoom - 2,
	    duration: duration / 2
	  }, {
	    zoom: zoom - 2,
	    duration: duration / 2
	  }, callback);
	}
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.measureArea= function() {
	  var _this = this;
	  _this.measureInfo.isMeasure = true;
	  _this.openMeasureTool("area");
	  _this.measureInfo.isMeasureArea = true;
	}
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.measureLength= function() {
	  var _this = this;
	  _this.measureInfo.isMeasure = true;
	  _this.openMeasureTool("LineString");
	  _this.measureInfo.isMeasureArea = false;
	}
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.openMeasureTool=function(type) {
	var _this = this;
	if (_this.measureInfo.isMeasure) {
	    _this.map.getInteractions().item(1).setActive(false);
	    if (_this.measure) {
	      _this.map.removeInteraction(_this.measure); //移除绘制图形
	    }
	    var type = (type == 'area' ? 'Polygon' : 'LineString');
	    _this.measure = new Draw({
	      //source: gisMap.measureSource,//测量绘制层数据源
	      type: /** @type {GeometryType} */ (type), //几何图形类型
	      style: new Style({ //图层样式
	        fill: new Fill({
	          //填充颜色
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
	    _this.map.addInteraction(_this.measure);
	    _this.createMeasureTooltip(); //创建测量工具提示框
	    _this.createHelpTooltip(); //创建帮助提示框
		var helpTooltipElement=document.getElementById("helpTooltipElement");
		_this.map.on('pointermove', function(evt) {
		  if (evt.dragging) {
		    return;
		  }
		  /** @type {string} */
		  var helpMsg = '单击开始'; //当前默认提示信息
		  //判断绘制几何类型设置相应的帮助提示信息
		  if (_this.measureInfo.sketch) {
		    var geom = (_this.measureInfo.sketch.getGeometry());
		    if (geom instanceof Polygon) {
		      helpMsg = _this.measureInfo.continuePolygonMsg; //绘制多边形时提示相应内容
		    } else if (geom instanceof LineString) {
		      helpMsg = _this.measureInfo.continueLineMsg; //绘制线时提示相应内容
		    }
		  }
		  _this.measureInfo.helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
		  _this.measureInfo.helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
		}); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
	    //定义一个事件监听
	    var listener;
	    //定义一个控制鼠标点击次数的变量
	    var count = 0;
	    //绑定交互绘制工具开始绘制的事件
	    _this.measure.on('drawstart',
	      function(evt) {
	        // set sketch
	        _this.measureInfo.sketch = evt.feature; //绘制的要素
	        /** @type {Coordinate|undefined} */
	        var tooltipCoord = evt.coordinate; // 绘制的坐标
	        //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
	        listener = _this.measureInfo.sketch.getGeometry().on('change', function(evt) {
	          var geom = evt.target; //绘制几何要素
	          //gisMap.measureSource.addFeature(new Feature(geom));
	          var output;
	          if (geom instanceof Polygon) {
	            _this.map.removeEventListener('singleclick');
	            // gisMap.map.removeEventListener('dblclick');
	            output = _this.formatArea( /** @type {Polygon} */ (geom)); //面积值
	            tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
	          } else if (geom instanceof LineString) {
	            output = _this.formatLength( /** @type {LineString} */ (geom)); //长度值
	            tooltipCoord = geom.getLastCoordinate(); //坐标
	          }
	          _this.measureInfo.measureTooltipContentElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
	          _this.measureInfo.measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
	          _this.measureInfo.lastPoint = tooltipCoord;
	        });
	        //地图单击事件
	        _this.map.on('singleclick', function(evt) {
	          //如果是第一次点击，则设置测量提示框的文本内容为起点
	          if (count == 0) {
	            _this.measureInfo.measureTooltipContentElement.innerHTML = "起点";
	          }
	          if (_this.measureInfo.isMeasure&&_this.measureInfo.measureResult != _this.measureInfo.measureTooltipContentElement.innerHTML &&
	            _this.measureInfo.measureTooltipContentElement.innerHTML != "") {
	            //设置测量提示信息的位置坐标，用来确定鼠标点击后测量提示框的位置
	            _this.measureInfo.measureTooltip.setPosition(evt.coordinate);
	            //根据鼠标点击位置生成一个点
	             var point = new Point(evt.coordinate);
	            // //将该点要素添加到矢量数据源中
	             var feature = new Feature(point);
	             feature.id = _this.measureInfo.measureTooltipId;
	             _this.measureSource.addFeature(feature);
	            //更改测量提示框的样式，使测量提示框可见
	            _this.measureInfo.measureTooltipElement.className = 'measureTooltip';
	            //创建测量提示框
	             _this.createMeasureTooltip();
	            //_this.createMeasureTooltipClose();//重新创建一个测试工具提示框显示结果
	            //点击次数增加
	            count++;
	            _this.measureInfo.measureResult = _this.measureInfo.measureTooltipContentElement.innerHTML;
	          }
	        });
	      }, this);
	    //绑定交互绘制工具结束绘制的事件
	    _this.measure.on('drawend',
	      function(evt) {

	        var geom = evt.feature; //绘制几何要素
	        geom.id = _this.measureInfo.measureTooltipId;
	        _this.measureInfo.measureTooltipId++;
	        _this.measureSource.addFeature(geom);
	        if (!_this.measureInfo.isMeasureArea) {
	          //根据鼠标点击位置生成一个点
	           var point = new Point(_this.measureInfo.lastPoint);
	          // //将该点要素添加到矢量数据源中
	           var feature = new Feature(point);
	           feature.id = _this.measureInfo.measureTooltipId;
	          _this.measureSource.addFeature(feature);
	          _this.map.removeEventListener('pointermove');
	          _this.map.removeEventListener('singleclick');
	          count = 0;

	          _this.createMeasureTooltipClose(); //重新创建一个关闭工具提示框显示结果
	          // unset sketch
	          _this.measureInfo.sketch = null; //置空当前绘制的要素对象
	          // unset tooltip so that a new one can be created
	          _this.measureInfo.measureTooltipElement = null; //置空测量工具提示框对象

	          _this.measureInfo.isMeasure = false;

	          _this.map.removeInteraction(_this.measure); //移除测量工具

	        }

	        if (_this.measureInfo.helpTooltipElement) {
	          if (_this.measureInfo.helpTooltipElement.parentNode) {
	            _this.measureInfo.helpTooltipElement.parentNode.removeChild(_this.measureInfo.helpTooltipElement);
	          }
	        }
	        if (_this.measureInfo.isMeasureArea) {
	          _this.createMeasureTooltipClose(); //重新创建一个关闭工具提示框显示结果
	          // unset sketch
	          _this.measureInfo.sketch = null; //置空当前绘制的要素对象
	          // unset tooltip so that a new one can be created
	          _this.measureInfo.measureTooltipElement = null; //置空测量工具提示框对象

	          _this.measureInfo.isMeasure = false;

	          _this.map.removeInteraction(_this.measure); //移除测量工具

	          if (_this.measureInfo.helpTooltipElement) {
	            if (_this.measureInfo.helpTooltipElement.parentNode) {
	              _this.measureInfo.helpTooltipElement.parentNode.removeChild(_this.measureInfo.helpTooltipElement);
	            }
	          }
	        }
	        unByKey(listener);
	      }, this);
		}
	 }
	/**
	 *创建一个新的帮助提示框（tooltip）
	 */
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.createHelpTooltip = function() {
	  var _this = this;
	  _this.measureInfo.helpTooltipElement = document.createElement('div');
	  _this.measureInfo.helpTooltipElement.className = 'measureTooltip';
	  _this.measureInfo.helpTooltip = new Overlay({
	    element: _this.measureInfo.helpTooltipElement,
		offset:[10, -20],
		positioning: 'bottom-left',
		//是否应该停止事件传播到地图窗口
		stopEvent: false,
		autoPanAnimation: {
		    //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
		    duration: 250
		}
	  });
	  _this.map.addOverlay(_this.measureInfo.helpTooltip);
	}
	/**
	 *创建一个新的测量工具提示框（tooltip）
	 */
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.createMeasureTooltip= function() {
	  var _this = this;
	  _this.measureInfo.measureTooltipElement = document.createElement('div');
	  _this.measureInfo.measureTooltipElement.className = 'measureTooltip';
	  _this.measureInfo.measureTooltipContentElement = document.createElement('div');
	  _this.measureInfo.measureTooltipContentElement.style.display = "inline";
	  _this.measureInfo.measureTooltipElement.append(_this.measureInfo.measureTooltipContentElement);

	  _this.measureInfo.measureTooltip = new Overlay({
	    element: _this.measureInfo.measureTooltipElement,
		offset:[-25, -10],
	     //stopEvent: false,
		  autoPanAnimation: {
		    //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
		    duration: 250
		  },
	    positioning: 'bottom-center'
	  });
	  _this.measureInfo.measureTooltips.push(_this.measureInfo.measureTooltip);
	  _this.map.addOverlay(_this.measureInfo.measureTooltip);
	  _this.measureInfo.measureTooltipId++;
	}

	/**
	 *创建一个新的测量工具关闭提示框（tooltip）
	 */
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.createMeasureTooltipClose=function() {
	  var _this = this;
	  _this.measureInfo.measureTooltipElement.className = 'measureTooltip';
	  _this.measureInfo.measureTooltipElement.append(_this.measureInfo.measureTooltipContentElement);
	  _this.measureInfo.measureTooltipCloseElement = document.createElement('a');
	  _this.measureInfo.measureTooltipCloseElement.innerHTML = "✖";
	  _this.measureInfo.measureTooltipCloseElement.setAttribute("id", _this.measureInfo.measureTooltipId);
	  _this.measureInfo.measureTooltipCloseElement.setAttribute("title", "清除本次测量结果");
	  _this.measureInfo.measureTooltipCloseElement.style.cursor = "pointer";
	  _this.measureInfo.measureTooltipCloseElement.style.display = "inline";
	  _this.measureInfo.measureTooltipElement.append(_this.measureInfo.measureTooltipCloseElement);
	  _this.measureInfo.measureTooltipCloseElement.onclick = function(evt) {
	    var id = evt.currentTarget.getAttribute("id");
	    var measureSourceFeatures = _this.measureSource.getFeatures();
	    for (let i = 0; i < _this.measureInfo.measureResults.length; i++) {
	      if (id == _this.measureInfo.measureResults[i].id) {
	        var measureTooltips = _this.measureInfo.measureResults[i].measureTooltips;
	        for (let j = 0; j < measureTooltips.length; j++) {
	          let measureTooltip = measureTooltips[j];
	          _this.map.removeOverlay(measureTooltip);
	        }
	        if (i > 0) {
	          //临时数组存放
	          var tempArray1 = _this.measureInfo.measureResults[i].measureSourceFeatures; //临时数组1
	          var tempArray2 = _this.measureInfo.measureResults[i - 1].measureSourceFeatures; //临时数组2
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
	            _this.measureSource.removeFeature(result[n]);
	          }
	        } else {
	          for (var n = 0; n < _this.measureInfo.measureResults[i].measureSourceFeatures.length; n++) {
	            _this.measureSource.removeFeature(_this.measureInfo.measureResults[i].measureSourceFeatures[n]);
	          }
	        }
	      }
	    }
	  };
	  var obj = {
	    "id": _this.measureInfo.measureTooltipId,
	    "measureTooltips": _this.measureInfo.measureTooltips,
	    "measureSourceFeatures": _this.measureSource.getFeatures()
	  }
	  _this.measureInfo.measureResults.push(obj);
	  _this.measureInfo.measureTooltips = [];
	  _this.measureInfo.measureTooltipId++;
	}

	/**
	 * @Description:测量长度输出
	 * @Param: Arcgis Geometry as{LineString} line
	 * @return:{string}
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.formatLength= function(line) {
	  var _this = this;
	  var sourceProj = _this.map.getView().getProjection(); //获取投影坐标系
	  //方法1
	  // var geom = (line.clone().transform(sourceProj, 'EPSG:3857'));
	  // var length = getLength(geom);
	  //方法2
	  var length = getLength(line, {
	    projection: sourceProj /*, radius: 6371008.8*/
	  });
	  var output;
	  if (length > 100) {
	    output = (Math.round(length / 1000 * 100) / 100) + ' ' + '公里'; //换算成KM单位
	  } else {
	    output = (Math.round(length * 100) / 100) + ' ' + '米'; //m为单位
	  }
	  return output; //返回线的长度
	}
	/**
	 * @Description:测量面积输出
	 * @Param: Arcgis Geometry as {Polygon} polygon
	 * @return:{string}
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.formatArea=function(polygon) {
	  var _this = this;
	  var sourceProj = _this.map.getView().getProjection(); //获取投影坐标系
	  //方法1
	  // var geom = (polygon.clone().transform(sourceProj, 'EPSG:3857'));
	  // var area = getArea(geom);
	  //方法2
	  var area = getArea(polygon, {
	    projection: sourceProj /*, radius: 6371008.8*/
	  })
	  var output;
	  if (area > 10000) {
	    output = (Math.round(area / 1000000 * 100) / 100) + ' ' + '平方公里'; //换算成KM单位
	  } else {
	    output = (Math.round(area * 100) / 100) + ' ' + '平方米'; //m为单位
	  }
	  return output; //返回多边形的面积
	}
	 /**
     * @Description:  添加扩散点
     * @Param:
     * feature:  {"attributes": {},"style": {},"geometry": "POINT(109.48467074 21.61881787)"}
     * flag:true
     * @return:
     * @Author: kbh
     * @Date: 2019/3/19
     */
    GisMapApi.prototype.addFlickerPoint=function (feature,index, flag) {
		var _this = this;
		var _index=5;
		if(index){
			if(index>=_this.map.getLayers().array_.length){
				index=_this.map.getLayers().array_.length-1
			}
			if(index>_index){
				_index=index;
			}
		}
        var flickerFeature = feature;
        //转wkt为feature
        var featureTemp = _this.transformFeatureFromWkt(feature.geometry);
        if (flag) {
            _this.flickerPoint.push(featureTemp);
            _this.flickerPointTemp.push(featureTemp);
        }
        var start = new Date().getTime();
        var listenerKey;

        function animate(event) {
            var duration = 100;
            var vectorContext = getVectorContext(event);
            var frameState = event.frameState;

            var elapsed = frameState.time - start-8;
			if(elapsed<0)
			elapsed=1;
            var elapsedRatio = elapsed / duration;
            //指定半径从5开始，到30结束
            var radius = easeOut(elapsedRatio) * 15;
            var opacity = easeOut(1 - elapsedRatio);

            var style = new Style({
                image: new Circle({
                    radius: radius,
                    snapToPixel: false,
                    stroke: new Stroke({
                        color: 'rgba(255, 0, 0, ' + 1 + ')',
                        width: 0.5
                    }),
                    fill: new Fill({
                    	color: 'rgba(255,0,0,0.1)'//填充颜色
                    })
                })
            });
            for (var i = 0; i < _this.flickerPoint.length; i++) {
                var flashGeom = _this.flickerPoint[i].getGeometry().clone();
               // vectorContext.text_ = _this.flickerPoint[i].attributes.id;
                vectorContext.setStyle(style);
                vectorContext.drawGeometry(flashGeom);
            }
            if (elapsed > duration) {
				//_this.addFlickerPoint(flickerFeature, false);
                unByKey(listenerKey);
                return;
            }
			 _this.map.updateSize();
			 _this.map.render();
        }
        var layers=_this.map.getLayers();
		var layer=layers.array_[_index]
        listenerKey = layer.on('postrender', animate);
		_this.map.updateSize();
		_this.map.render();
    }
    /**
     * @Description:隐藏所有map对象下的扩散点
     * @Param:
     * @return:
     * @Author: kbh
     * @Date: 2019/3/19
     */
    GisMapApi.prototype.hideFlickerPoint=function () {
		var _this = this;
        _this.flickerPoint = [];
        _this.map.updateSize();
        _this.map.render();
    }
    /**
     * @Description:显示所有map对象下的扩散点
     * @Param:
     * @return:
     * @Author: kbh
     * @Date: 2019/3/19
     */
    GisMapApi.prototype.showFlickerPoint= function () {
		var _this = this;
        _this.flickerPoint = _this.flickerPointTemp;
        _this.map.updateSize();
        _this.map.render();
    }
	 /**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/27
	 */
	GisMapApi.prototype.openDrawPolygon= function(drawType, callDrawDataFunc, drawToolStyle) {
	  var _this = this;
	  _this.drawInfo.isDraw = true;
	  _this.openDrawTool(drawType, callDrawDataFunc, drawToolStyle);
	},
	GisMapApi.prototype.openDrawRectangle= function(drawType, callDrawDataFunc, drawToolStyle) {
	  var _this = this;
	  _this.drawInfo.isDraw = true;
	  _this.openDrawTool(drawType, callDrawDataFunc, drawToolStyle);
	},
	/**
	 * @Description:绘图工具
	 * @Param:drawType【点：Point，线：LineString，面：Polygon，矩形：Rectangle[Circle]，圆形：Circle，自定义图形：】
	 * drawToolStyle={
                    "fillcolor": 'rgba(255, 255, 255, 0)',//填充颜色
                    "strokecolor": '#ff1824',	//笔触颜色
                    "strokewidth": 2,//笔触宽度
                    "imageradius": 7,//半径大小
                    "imagefillcolor": '#ff1824'//填充颜色
                }
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/19
	 */
	GisMapApi.prototype.openDrawTool= function(drawType, callDrawDataFunc, drawToolStyle) { // 初始化地图绘制控件
	  var _this = this;
	  _this.map.removeInteraction(_this.draw); //移除测量工具
	  if (_this.drawInfo.helpTooltipElement) {
	    if (_this.drawInfo.helpTooltipElement.parentNode) {
	      _this.drawInfo.helpTooltipElement.parentNode.removeChild(_this.drawInfo.helpTooltipElement);
	    }
	  }
	  let rings = "";
	  _this.map.getInteractions().item(1).setActive(false);
	  if (_this.draw) {
	    _this.map.removeInteraction(_this.draw); //移除绘制图形
	  }
	  _this.map.on('pointermove', function(evt) {
	    if (evt.dragging) {
	      return;
	    }
	    /** @type {string} */
	    var helpMsg = '单击绘制'; //当前默认提示信息
	    if (_this.drawInfo.sketch) {
	      helpMsg = "双击结束"
	    }
	    _this.drawInfo.helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
	    _this.drawInfo.helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
	  }); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
	  _this.darwState = true;
	  var style = new Style({
	    //样式填充
	    fill: new Fill({
	      //填充颜色
	      color: 'rgba(37,241,239,0.2)'
	    }),
	    //笔触
	    stroke: new Stroke({
	      //笔触颜色
	      color: '#ffcc33',
	      //笔触宽度
	      width: 1
	    })
	  });
	  if (drawToolStyle) {
	    style = new Style({
	      //样式填充
	      fill: new Fill({
	        //填充颜色
	        color: drawToolStyle.fillcolor
	      }),
	      //笔触
	      stroke: new Stroke({
	        //笔触颜色
	        color: drawToolStyle.strokecolor,
	        //笔触宽度
	        width: drawToolStyle.strokewidth
	      })
	    });
	  }
	  if (drawType == 'Point') {
	    style = new Style({
	      //把点的样式换成ICON图标
	      fill: new Fill({
	        //填充颜色
	        color: 'rgba(37,241,239,0.2)'
	      }),
	      //图形样式，主要适用于点样式
	      image: new Circle({
	        //半径大小
	        radius: 5,
	        //填充
	        fill: new Fill({
	          //填充颜色
	          color: '#e81818'
	        })
	      }),
	      //层
	      zIndex: 20
	    })
	  }
	  _this.drawSoruceVectorLayer.setStyle(style);
	  if (_this.draw) {
	    _this.map.removeInteraction(_this.draw);
	  }
	  if (drawType == 'Point') {
	    _this.draw = new Draw({
	      source: _this.drawSource,
	      type: (drawType),

	    });
	    _this.draw.on('drawstart', function(evt) {
	      _this.clearAll()
	      _this.drawInfo.sketch = evt.feature; //绘制的要素
	      rings = "";
	    }, this);
	    _this.map.addInteraction(_this.draw);
	    //创建帮助提示框
	    _this.drawInfo.helpTooltipElement = document.createElement('div');
	    _this.drawInfo.helpTooltipElement.className = 'drawTooltip';
	    _this.drawInfo.helpTooltip = new Overlay({
	      element: _this.drawInfo.helpTooltipElement,
		  offset:[10,-10],
		  positioning: 'bottom-left',
		  //是否应该停止事件传播到地图窗口
		  stopEvent: false,
		  autoPanAnimation: {
		    //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
		    duration: 250
		  }
	    });
	    _this.map.addOverlay(_this.drawInfo.helpTooltip);
	    _this.draw.on('drawend', function(evt) {
	      var arr = _this.draw.sketchCoords_;
	      var rings = "POINT(" + arr[0].toFixed(4) + " " + arr[1].toFixed(4) + ")";
	      _this.drawData = rings;
	      _this.map.removeEventListener('pointermove');
	      _this.drawInfo.drawTooltipElement = null; //置空测量工具提示框对象
	      _this.drawInfo.sketch = null;
	      _this.drawInfo.isDraw = false;
	      _this.map.removeInteraction(_this.draw); //移除测量工具
	      if (_this.drawInfo.helpTooltipElement) {
	        if (_this.drawInfo.helpTooltipElement.parentNode) {
	          _this.drawInfo.helpTooltipElement.parentNode.removeChild(_this.drawInfo.helpTooltipElement);
	        }
	      }
	      if (callDrawDataFunc)
			{
			  callDrawDataFunc(rings);
			  return;
		  }
	    });
	  }
	  if (drawType == 'LineString') {
	    _this.draw = new Draw({
	      source: _this.drawSource,
	      type: (drawType),
	      //style: style
	    });
	    _this.draw.on('drawstart', function(evt) {
	      _this.clearAll()
	      _this.drawInfo.sketch = evt.feature; //绘制的要素
	      rings = "";
	    }, this);
	    _this.map.addInteraction(_this.draw);
	    //创建帮助提示框
	    _this.drawInfo.helpTooltipElement = document.createElement('div');
	    _this.drawInfo.helpTooltipElement.className = 'drawTooltip';
	    _this.drawInfo.helpTooltip = new Overlay({
	      element: _this.drawInfo.helpTooltipElement,
		  offset:[10,-10],
		  positioning: 'bottom-left',
		  //是否应该停止事件传播到地图窗口
		  stopEvent: false,
		  autoPanAnimation: {
		    //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
		    duration: 250
		  }
	    });
	    _this.map.addOverlay(_this.drawInfo.helpTooltip);
	    _this.draw.on('drawend', function(evt) {
	      var arr = _this.draw.sketchCoords_;
	      var rings0 = "";
	      for (var i = 0; i < arr.length; i++) {
	        rings0 += arr[i][0].toFixed(4) + " " + arr[i][1].toFixed(4) + ",";
	      }
	      rings += "LINESTRING(" + rings0.substring(0, rings0.length - 1) + ")";
	      _this.drawData = rings;
	      _this.map.removeEventListener('pointermove');
	      _this.drawInfo.drawTooltipElement = null; //置空测量工具提示框对象
	      _this.drawInfo.sketch = null;
	      _this.drawInfo.isDraw = false;
	      _this.map.removeInteraction(_this.draw); //移除测量工具
	      if (_this.drawInfo.helpTooltipElement) {
	        if (_this.drawInfo.helpTooltipElement.parentNode) {
	          _this.drawInfo.helpTooltipElement.parentNode.removeChild(_this.drawInfo.helpTooltipElement);
	        }
	      }
	      if (callDrawDataFunc)
	        {
	          callDrawDataFunc(rings);
	          return;
	        }
	    });
	  }
	  if (drawType == 'Polygon') {
	    _this.draw = new Draw({
	      source: _this.drawSource,
	      type: (drawType),
	      //style: style
	    });
	    _this.draw.on('drawstart', function(evt) {
	      _this.clearAll()
	      _this.drawInfo.sketch = evt.feature; //绘制的要素
	      rings = "";
	    }, this);
	    _this.map.addInteraction(_this.draw);
	    //创建帮助提示框
	    _this.drawInfo.helpTooltipElement = document.createElement('div');
	    _this.drawInfo.helpTooltipElement.className = 'drawTooltip';
	    _this.drawInfo.helpTooltip = new Overlay({
	      element: _this.drawInfo.helpTooltipElement,
		  offset:[10,-10],
		  positioning: 'bottom-left',
		  //是否应该停止事件传播到地图窗口
		  stopEvent: false,
		  autoPanAnimation: {
		    //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
		    duration: 250
		  }
	    });
	    _this.map.addOverlay(_this.drawInfo.helpTooltip);
	    _this.draw.on('drawend', function(evt) {
			 _this.clearAll()
	      var arr = _this.draw.sketchCoords_;
	      var rings0 = "";
	      for (var i = 0; i < arr[0].length; i++) {
	        rings0 += arr[0][i][0].toFixed(4) + " " + arr[0][i][1].toFixed(4) + ",";
	      }
	      rings += "POLYGON((" + rings0 + arr[0][0][0].toFixed(4) + " " + arr[0][0][1].toFixed(4) + "))";
	      _this.drawData = rings;
	      _this.map.removeEventListener('pointermove');
	      _this.drawInfo.drawTooltipElement = null; //置空测量工具提示框对象
	      _this.drawInfo.sketch = null;
	      _this.drawInfo.isDraw = false;
	      _this.map.removeInteraction(_this.draw); //移除测量工具
	      if (_this.drawInfo.helpTooltipElement) {
	        if (_this.drawInfo.helpTooltipElement.parentNode) {
	          _this.drawInfo.helpTooltipElement.parentNode.removeChild(_this.drawInfo.helpTooltipElement);
	        }
	      }
	      if (callDrawDataFunc)
		  {
			  callDrawDataFunc(rings);
			  return;
		  }
	    });
	  }
	  if (drawType == 'Rectangle') {
	    _this.draw = new Draw({
	      source: _this.drawSource,
	      type: 'Circle',
	      //style: style,
	      geometryFunction: createBox()
	    });
	    _this.map.addInteraction(_this.draw);
	    //创建帮助提示框
	    _this.drawInfo.helpTooltipElement = document.createElement('div');
	    _this.drawInfo.helpTooltipElement.className = 'drawTooltip';
	    _this.drawInfo.helpTooltip = new Overlay({
	      element: _this.drawInfo.helpTooltipElement,
		  offset:[10,-10],
		  positioning: 'bottom-left',
		  //是否应该停止事件传播到地图窗口
		  stopEvent: false,
		  autoPanAnimation: {
		    //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
		    duration: 250
		  }
	    });
	    _this.map.addOverlay(_this.drawInfo.helpTooltip);
	    _this.draw.on('drawstart', function(evt) {
	      _this.clearAll()
	      _this.drawInfo.sketch = evt.feature; //绘制的要素
	      rings = "";
	    });
	    _this.draw.on('drawend', function(evt) {
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

	      _this.drawData = rings;
	      _this.map.removeEventListener('pointermove');
	      _this.drawInfo.drawTooltipElement = null; //置空测量工具提示框对象
	      _this.drawInfo.sketch = null;
	      _this.drawInfo.isDraw = false;
	      _this.map.removeInteraction(_this.draw); //移除测量工具
	      if (_this.drawInfo.helpTooltipElement) {
	        if (_this.drawInfo.helpTooltipElement.parentNode) {
	          _this.drawInfo.helpTooltipElement.parentNode.removeChild(_this.drawInfo.helpTooltipElement);
	        }
	      }
	      if (callDrawDataFunc)
		  {
			  callDrawDataFunc(rings);
			  return;
		  }
	    }, this);
	  }
	},
	/**
	 * @Description:
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/2/26
	 */
	GisMapApi.prototype.closeDrawTool=function() { //关闭地图绘制控件
	  var _this = this;
	  if (_this.draw) {
	    _this.map.removeInteraction(_this.draw);
	    _this.drawSoruceVectorLayer.getSource().clear();
	    _this.darwState = false;
	  }
	}
	GisMapApi.prototype.clearAll= function() {
	  var _this = this;
	  _this.drawSource.clear()
	  _this.drawSoruceVectorLayer.getSource().clear()
	  _this.measureSoruceVectorLayer.getSource().clear()
	  _this.featuresSourceVectorLayer.getSource().clear()
	  _this.featuresSourceVectorLayer.getSource().clear()
	  _this.featuresSourceVectorLayerAllImage.getSource().clear()
	  //_this.map.removeLayer(_this.featuresSourcePageImage)
	}
	/**
	 * @Description:  清除范围框图层
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.featureClear=function(){
		var _this = this
		let featuresSources = _this.featuresSource.getFeatures()
		for (var i = 0; i < featuresSources.length; i++) {
			_this.featuresSource.removeFeature(featuresSources[i])
			break
		}
	}
	/**
	 * @Description:  清除绘图图层
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.drawSoruceFeatureClear=function(){
		var _this = this
		_this.drawSoruceVectorLayer.getSource().clear()
	}
	 /**
     * @Description:  生成唯一id
     * @Param:
     * @return:
     * @Author: kbh
     * @Date: 2019/3/19
     */
    GisMapApi.prototype.generateUUID=function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
	/**
	 * @Description:  加载css样式
	 * @Param:
	 * @return:
	 * @Author: kbh
	 * @Date: 2019/4/9
	 */
	GisMapApi.prototype.loadCssCode = function (code) {
		var _this = this;
		var style = document.createElement('style');
		style.type = 'text/css';
		style.rel = 'stylesheet';
		try {
			//for Chrome Firefox Opera Safari
			style.appendChild(document.createTextNode(code));
		} catch (ex) {
			//for IE
			style.styleSheet.cssText = code;
		}
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(style);
	}
	return GisMapApi;
})();
