import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString';

export const proximityCheck = (p1: Point, p2: Point) => {
  const line = new LineString([p1.getCoordinates(), p2.getCoordinates()])
  return line.getLength();
}
