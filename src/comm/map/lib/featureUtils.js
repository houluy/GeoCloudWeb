/*
  工具类：要素类工具  create by dlw 2020-02-12 13：45
  功能描述：
 */

import Tile from "ol/layer/Tile"
import WKT from "ol/format/WKT";


var featureUtils = {
  desc: 'featureUtils',
  //转wkt为feature
  transformFeatureFromWkt: function(wkt){
    var format = new WKT();
    var feature = format.readFeature(wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    });
    return feature;
  }

}
export default featureUtils
