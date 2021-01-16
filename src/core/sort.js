export const sort_points_along_vector2 = (points, vector) => points
  .map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
  .sort((a, b) => a.d - b.d)
  .map(a => a.point);

