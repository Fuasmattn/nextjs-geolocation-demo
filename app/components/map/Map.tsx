import { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import VectorSource from "ol/source/Vector.js";
import { Layer, Vector as VectorLayer } from "ol/layer.js";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import useGeoLocation from "../../hooks/useGeolocation";

const styles = {
  geoMarker: new Style({
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({ color: "hotpink" }),
      stroke: new Stroke({
        color: "black",
        width: 2,
      }),
    }),
  }),
  vehicleMarker: new Style({
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({ color: "#22C55E" }),
      stroke: new Stroke({
        color: "black",
        width: 2,
      }),
    }),
  }),
};

const DICEMap = ({ vehicles }: any) => {
  const mapRef = useRef<Map>();
  const [geoPosition] = useGeoLocation();

  useEffect(() => {
    if (geoPosition?.coords) {
      const userPositionMarker = new Feature({
        type: "geoMarker",
        geometry: new Point(
          fromLonLat([
            geoPosition.coords.longitude,
            geoPosition.coords.latitude,
          ])
        ),
      });

      const vehiclePositionMarkers = vehicles.map(
        (vehicle: any) =>
          new Feature({
            type: "vehicleMarker",
            geometry: new Point(
              fromLonLat([
                vehicle.position.longitude,
                vehicle.position.latitude,
              ])
            ),
          })
      );

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [userPositionMarker, ...vehiclePositionMarkers],
        }),
        style: function (feature) {
          // @ts-ignore
          return styles[feature.get("type")];
        },
      });

      mapRef.current?.addLayer(vectorLayer);

      mapRef.current?.setView(
        new View({
          center: fromLonLat([
            geoPosition.coords.longitude,
            geoPosition.coords.latitude,
          ]),
          zoom: 15,
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapRef.current?.getAllLayers().forEach((layer: Layer) => {
      layer.getSource()?.refresh();
    })
  }, [geoPosition?.coords])

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: "map",
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
    }
  }, []);

  return <div id="map" className="w-full h-full"></div>;
};

export default DICEMap;
