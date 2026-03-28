import type { NextRequest } from "next/server";

function mapWeatherCode(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  if (!city || city.trim() === "") {
    return Response.json({ error: "Missing city parameter" }, { status: 400 });
  }

  // Geocode the city
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );

  if (!geoRes.ok) {
    return Response.json({ error: "Geocoding API error" }, { status: 502 });
  }

  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    return Response.json({ error: "City not found" }, { status: 404 });
  }

  const { latitude, longitude, name } = geoData.results[0];

  // Fetch weather
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&temperature_unit=celsius`
  );

  if (!weatherRes.ok) {
    return Response.json({ error: "Weather API error" }, { status: 502 });
  }

  const weatherData = await weatherRes.json();
  const current = weatherData.current;

  return Response.json({
    city: name,
    temp: current.temperature_2m,
    condition: mapWeatherCode(current.weather_code),
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    feelsLike: current.apparent_temperature,
    weatherCode: current.weather_code,
  });
}
