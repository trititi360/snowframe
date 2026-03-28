"use client";

import { useState } from "react";

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  weatherCode: number;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setWeather(data);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-sans px-4">
      <main className="w-full max-w-md flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Weather
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-1 h-11 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-5 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm font-medium disabled:opacity-50 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            {loading ? "Loading…" : "Search"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        {weather && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {weather.city}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{weather.condition}</p>
            </div>

            <p className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
              {Math.round(weather.temp)}°C
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Feels like</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {Math.round(weather.feelsLike)}°C
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Humidity</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {weather.humidity}%
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Wind</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {Math.round(weather.windSpeed)} km/h
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
