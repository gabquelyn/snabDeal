export default function calculateDistance(
  source: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number {
  // if the positions are the same
  if (source.lat === destination.lat && source.lng === destination.lng) {
    return 0;
  }
  // Radius of the Earth in kilometers
  const earthRadius = 6371;

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = (source.lat * Math.PI) / 180;
  const lon1Rad = (source.lng * Math.PI) / 180;
  const lat2Rad = (destination.lat * Math.PI) / 180;
  const lon2Rad = (destination.lng * Math.PI) / 180;

  // Differences in latitude and longitude
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = earthRadius * c;

  return distance / 1.61; // Distance in kilometers
}
