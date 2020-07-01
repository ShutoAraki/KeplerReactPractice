function getDataType(colname) {
  const col2type = {
    "noiseMean": "real",
    "greenArea": "integer"
  };
  if (colname in col2type) {
    return col2type[colname];
  } else {
    return "real";
  }
};

export default function greenLayer(id, dataname, colname) {
    return ({
        "id": id,
        "type": "geojson",
        "config": {
          "dataId": dataname,
          "label": colname,
          "color": [
            246,
            209,
            138,
            255
          ],
          "columns": {
            "geojson": "geometry"
          },
          "isVisible": true,
          "visConfig": {
            "opacity": 0.8,
            "thickness": 0.5,
            "colorRange": {
              "name": "ColorBrewer YlGn-9",
              "type": "sequential",
              "category": "ColorBrewer",
              "colors": [
                "#ffffe5",
                "#f7fcb9",
                "#d9f0a3",
                "#addd8e",
                "#78c679",
                "#41ab5d",
                "#238443",
                "#006837",
                "#004529"
              ],
              "reversed": false
            },
            "radius": 10,
            "sizeRange": [
              0,
              10
            ],
            "radiusRange": [
              0,
              50
            ],
            "heightRange": [
              0,
              500
            ],
            "elevationScale": 5,
            "hi-precision": false,
            "stroked": false,
            "filled": true,
            "enable3d": false,
            "wireframe": false
          },
          "textLabel": {
            "field": null,
            "color": [
              255,
              255,
              255
            ],
            "size": 50,
            "offset": [
              0,
              0
            ],
            "anchor": "middle"
          }
        },
        "visualChannels": {
          "colorField": {
            "name": colname,
            "type": getDataType(colname)
          },
          "colorScale": "quantile",
          "sizeField": null,
          "sizeScale": "linear",
          "heightField": null,
          "heightScale": "linear",
          "radiusField": null,
          "radiusScale": "linear"
        }
      });
};
