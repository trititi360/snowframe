"use client";

import { useState, useEffect } from "react";
import WeatherCard from "@/components/WeatherCard";

const MOCK_WEATHER = {
  location: "Chamonix, France",
  temp: 2,
  feelsLike: -1,
  condition: "Light Snow",
  humidity: 78,
  wind: 24,
  emoji: "🌨️",
};

const MOCK_FORECAST = [
  { day: "Mon", emoji: "❄️", high: 1, low: -3, condition: "Snow" },
  { day: "Tue", emoji: "🌨️", high: -2, low: -6, condition: "Heavy Snow" },
  { day: "Wed", emoji: "⛅", high: 4, low: -1, condition: "Partly Cloudy" },
  { day: "Thu", emoji: "🌧️", high: 6, low: 2, condition: "Rain" },
  { day: "Fri", emoji: "❄️", high: 0, low: -5, condition: "Snow" },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  const showSnowboardMessage = MOCK_WEATHER.temp < 5;

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl space-y-5">
        {/* Header */}
        <div
          className="text-center transition-all duration-500"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
        >
          <p className="text-sm font-medium tracking-widest text-slate-400 uppercase">
            Weather
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">
            {MOCK_WEATHER.location}
          </h1>
        </div>

        {/* Current weather card */}
        <div
          className="transition-all duration-500 delay-100"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
        >
          <WeatherCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-7xl font-thin text-white tabular-nums">
                  {MOCK_WEATHER.temp}°
                </div>
                <div className="mt-1 text-slate-400">{MOCK_WEATHER.condition}</div>
                <div className="mt-0.5 text-sm text-slate-500">
                  Feels like {MOCK_WEATHER.feelsLike}°C
                </div>
              </div>
              <div className="animate-weather-bounce text-7xl select-none" aria-hidden>
                {MOCK_WEATHER.emoji}
              </div>
            </div>

            <div className="mt-5 flex gap-6 border-t border-white/10 pt-4 text-sm text-slate-400">
              <span>💧 {MOCK_WEATHER.humidity}% humidity</span>
              <span>💨 {MOCK_WEATHER.wind} km/h</span>
            </div>
          </WeatherCard>
        </div>

        {/* Snowboarding message */}
        {showSnowboardMessage && (
          <div
            className="transition-all duration-500 delay-200"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
          >
            <WeatherCard className="px-5 py-3.5">
              <p className="text-sm text-slate-300">
                🏂{" "}
                <span className="font-medium text-white">
                  Feels like snowboarding weather.
                </span>{" "}
                Pack your gear — the mountain is calling.
              </p>
            </WeatherCard>
          </div>
        )}

        {/* 5-day forecast */}
        <div
          className="transition-all duration-500 delay-300"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
        >
          <WeatherCard className="divide-y divide-white/8 overflow-hidden">
            <div className="px-5 py-3">
              <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                5-Day Forecast
              </h2>
            </div>
            {MOCK_FORECAST.map(({ day, emoji, high, low, condition }) => (
              <div
                key={day}
                className="flex items-center gap-3 px-5 py-3.5 text-sm"
              >
                <span className="w-10 font-medium text-slate-300">{day}</span>
                <span className="text-xl" aria-label={condition}>
                  {emoji}
                </span>
                <span className="flex-1 text-slate-500">{condition}</span>
                <span className="font-medium text-white">{high}°</span>
                <span className="text-slate-500">{low}°</span>
              </div>
            ))}
          </WeatherCard>
        </div>
      </div>
    </main>
  );
}
