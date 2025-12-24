// Haversine formula to calculate distance between two points
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Geocode a location (city, state) and cache results
export async function geocodeLocation(city, state, integrations) {
  if (!city || !state) return null;
  
  const cacheKey = `geocode_${city}_${state}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  try {
    const result = await integrations.Core.InvokeLLM({
      prompt: `What are the latitude and longitude coordinates for ${city}, ${state}? Return only the coordinates.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          latitude: { type: "number" },
          longitude: { type: "number" }
        }
      }
    });
    
    if (result.latitude && result.longitude) {
      localStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}