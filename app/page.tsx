"use client";

import { useState, FormEvent } from "react";
import type { WeatherData, WeatherState } from "@/types/weather";

// ---------------------------------------------------------------------------
// Weather icon map (WMO weather interpretation codes)
// ---------------------------------------------------------------------------
function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "❄️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 px-4 py-4 backdrop-blur-sm ring-1 ring-white/10">
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium tracking-wide text-white/50 uppercase">
        {label}
      </span>
      <span className="text-base font-semibold text-white">{value}</span>
    </div>
  );
}

function WeatherCard({ weatherData }: { weatherData: WeatherData }) {
  const emoji = getWeatherEmoji(weatherData.weatherCode);

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-md ring-1 ring-white/20">
      {/* City */}
      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm font-medium text-white/60">📍</span>
        <p className="text-lg font-semibold tracking-wide text-white/80">
          {weatherData.city}
        </p>
      </div>

      {/* Condition */}
      <p className="mb-6 text-sm text-white/50">{weatherData.condition}</p>

      {/* Temperature + emoji */}
      <div className="mb-8 flex items-center justify-between">
        <span
          className="text-8xl font-bold leading-none text-white"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {Math.round(weatherData.temp)}°
        </span>
        <span className="text-7xl leading-none">{emoji}</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon="💧"
          label="Humidity"
          value={`${weatherData.humidity}%`}
        />
        <StatCard
          icon="💨"
          label="Wind"
          value={`${weatherData.windSpeed} km/h`}
        />
        <StatCard
          icon="🌡️"
          label="Feels like"
          value={`${Math.round(weatherData.feelsLike)}°`}
        />
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-md ring-1 ring-white/20">
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-32 rounded-full bg-white/20" />
        <div className="h-3 w-24 rounded-full bg-white/10" />
        <div className="mt-6 flex items-center justify-between">
          <div className="h-20 w-40 rounded-2xl bg-white/20" />
          <div className="h-20 w-20 rounded-full bg-white/20" />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="w-full max-w-sm rounded-3xl bg-red-500/10 p-8 shadow-2xl backdrop-blur-md ring-1 ring-red-400/30">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-5xl">😕</span>
        <p className="text-lg font-semibold text-white">City not found</p>
        <p className="text-sm text-white/50">{message}</p>
      </div>
    </div>
  );
}

function IdleCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl bg-white/5 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/10">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-6xl">🌍</span>
        <p className="text-lg font-semibold text-white">
          Search for a city
        </p>
        <p className="text-sm text-white/40">
          Enter a city name above to get the current weather
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo data — simulates an API call
// ---------------------------------------------------------------------------
const DEMO_DATA: Record<string, WeatherData> = {
  london: {
    city: "London, GB",
    temp: 14,
    condition: "Partly Cloudy",
    humidity: 72,
    windSpeed: 19,
    feelsLike: 12,
    weatherCode: 2,
  },
  tokyo: {
    city: "Tokyo, JP",
    temp: 22,
    condition: "Clear Sky",
    humidity: 55,
    windSpeed: 8,
    feelsLike: 21,
    weatherCode: 0,
  },
  sydney: {
    city: "Sydney, AU",
    temp: 28,
    condition: "Sunny",
    humidity: 48,
    windSpeed: 14,
    feelsLike: 30,
    weatherCode: 0,
  },
  berlin: {
    city: "Berlin, DE",
    temp: 9,
    condition: "Light Rain",
    humidity: 85,
    windSpeed: 22,
    feelsLike: 6,
    weatherCode: 61,
  },
  "new york": {
    city: "New York, US",
    temp: 18,
    condition: "Overcast",
    humidity: 63,
    windSpeed: 16,
    feelsLike: 17,
    weatherCode: 3,
  },
};

async function fetchWeather(city: string): Promise<WeatherData> {
  await new Promise((r) => setTimeout(r, 900));
  const key = city.trim().toLowerCase();
  const data = DEMO_DATA[key];
  if (!data) throw new Error(`No weather data found for "${city}"`);
  return data;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function WeatherPage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<WeatherState>({ status: "idle" });

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setState({ status: "loading" });
    try {
      const data = await fetchWeather(query);
      setState({ status: "success", data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-start px-4 pt-20 pb-16"
      style={{
        background:
          "linear-gradient(135deg, #0d0d1a 0%, #1a0d33 35%, #0d1a33 70%, #0a1628 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-20 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #2563eb, transparent)" }}
      />

      {/* Header */}
      <div className="relative mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Weather
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Real-time conditions for any city
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="relative mb-10 w-full max-w-sm"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-md transition focus-within:ring-2 focus-within:ring-violet-400/60">
          <span className="text-lg text-white/40">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city… (try London, Tokyo)"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            aria-label="City name"
          />
          <button
            type="submit"
            disabled={state.status === "loading" || !query.trim()}
            className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Go
          </button>
        </div>
      </form>

      {/* Weather panel */}
      <div className="relative w-full max-w-sm">
        {state.status === "idle" && <IdleCard />}
        {state.status === "loading" && <LoadingCard />}
        {state.status === "error" && <ErrorCard message={state.message} />}
        {state.status === "success" && <WeatherCard weatherData={state.data} />}
      </div>

      {/* Demo hint */}
      <p className="relative mt-8 text-center text-xs text-white/25">
        Demo cities: London · Tokyo · Sydney · Berlin · New York
      </p>
    </main>
  );
}
