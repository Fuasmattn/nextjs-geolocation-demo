import { useEffect, useRef, useState } from "react";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import VectorSource from "ol/source/Vector.js";
import { Vector as VectorLayer } from "ol/layer.js";
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
  const [feature, setFeature] = useState<Feature>();
  const [featuresLayer, setFeaturesLayer] = useState<VectorLayer<any>>();

  useEffect(
    () => {
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

        setFeature(userPositionMarker);

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
            features: [feature, ...vehiclePositionMarkers],
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

        setFeaturesLayer(vectorLayer);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // geoPosition?.coords.latitude,
      // geoPosition?.coords.longitude,
      // geoPosition?.coords,
      // vehicles,
    ]
  );

  useEffect(() => {
    if (geoPosition) {
      const newPosition = new Point(
        fromLonLat([geoPosition.coords.longitude, geoPosition.coords.latitude])
      );
      feature?.setGeometry(newPosition);
      mapRef.current?.setView(
        new View({
          center: fromLonLat([
            geoPosition.coords.longitude,
            geoPosition.coords.latitude,
          ]),
          zoom: 15,
        })
      );
      if (feature) {
        featuresLayer?.setSource(new VectorSource({ features: [feature] }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    geoPosition,
    geoPosition?.coords.latitude,
    geoPosition?.coords.longitude,
  ]);

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
