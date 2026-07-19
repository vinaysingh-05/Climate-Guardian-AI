/**
 * Climate Guardian AI — Main App
 *
 * API Configuration: Set these environment variables in .env.local
 *   VITE_WEATHER_API_KEY  - https://www.weatherapi.com/
 *   VITE_GEMINI_API_KEY   - https://ai.google.dev/
 *   VITE_GOOGLE_MAPS_API_KEY - https://developers.google.com/maps
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, MapPin, Wind, Droplets, Thermometer, Eye, Gauge, Sun,
  Shield, AlertTriangle, TrendingUp, Brain, FileText, History,
  Settings, User, Home, ChevronRight, Download, Trash2, RefreshCw,
  CloudRain, Zap, Leaf, Globe, ArrowRight, Check, X, Menu, Bell,
  BarChart2, Activity, Cloud, Waves, Flame, Info, Star, Github,
  Linkedin, ChevronDown, Plus, Filter, Calendar, Clock
} from "lucide-react";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DocumentationPage from "./pages/DocumentationPage";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";

// ─── API CONFIG ─────────────────────────────────────────────────────────────

// Weather API base URL — used for all weather/AQI calls
const WEATHER_BASE = "https://api.weatherapi.com/v1";
const WEATHER_KEY  = import.meta.env.VITE_WEATHER_API_KEY;

// Gemini API — used for AI climate analysis and report generation
const GEMINI_BASE  = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_KEY   = import.meta.env.VITE_GEMINI_API_KEY;

// Google Maps Embed API — used for location map display
const MAPS_KEY     =  import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface WeatherData {
  location: { name: string; country: string; lat: number; lon: number; localtime: string };
  current: {
    temp_c: number; feelslike_c: number; humidity: number;
    wind_kph: number; pressure_mb: number; uv: number;
    vis_km: number; precip_mm: number;
    condition: { text: string; icon: string };
    air_quality?: { pm2_5: number; pm10: number; o3: number; "us-epa-index": number };
  };
}

interface ForecastData {
  forecast: {
    forecastday: Array<{
      date: string;
      day: { maxtemp_c: number; mintemp_c: number; avghumidity: number; daily_chance_of_rain: number; condition: { text: string } };
      hour: Array<{ time: string; temp_c: number; humidity: number; precip_mm: number }>;
    }>;
  };
}

interface ClimateScore {
  score: number;          // 0–100 overall climate risk score
  flood_risk: number;     // 0–100
  heat_risk: number;      // 0–100
  air_quality_risk: number;
  confidence: number;     // Gemini confidence 0–100
  summary: string;
  recommendations: string[];
  level: "low" | "moderate" | "high" | "critical";
}

interface ReportRecord {
  id: string;
  date: string;
  location: string;
  score: number;
  level: string;
  weather: WeatherData;
  climate: ClimateScore;
}

type Page = "landing" | "dashboard" | "report" | "history" | "about" | "settings" | "profile" | "404" | "privacy" | "terms" | "documentation";



function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-blue-50 to-white" />

      <div className="absolute top-0 left-1/4 w-96 h-96 opacity-20 animate-pulse"
        style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)", animationDuration: "4s" }} />

      <div className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-10 animate-bounce"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", animationDuration: "8s" }} />
      <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", animation: "float 12s ease-in-out infinite" }} />
      <svg className="absolute top-8 w-full" style={{ animation: "cloudDrift 60s linear infinite" }} viewBox="0 0 1440 120" fill="none">
        <ellipse cx="200" cy="60" rx="160" ry="40" fill="white" fillOpacity="0.6" />
        <ellipse cx="180" cy="55" rx="100" ry="35" fill="white" fillOpacity="0.5" />
        <ellipse cx="220" cy="58" rx="120" ry="30" fill="white" fillOpacity="0.4" />
      </svg>
      <svg className="absolute top-24 w-full" style={{ animation: "cloudDrift 80s linear infinite reverse" }} viewBox="0 0 1440 120" fill="none">
        <ellipse cx="900" cy="50" rx="200" ry="45" fill="white" fillOpacity="0.5" />
        <ellipse cx="880" cy="45" rx="130" ry="38" fill="white" fillOpacity="0.4" />
        <ellipse cx="1100" cy="60" rx="170" ry="38" fill="white" fillOpacity="0.45" />
      </svg>
      <svg className="absolute top-4 w-full" style={{ animation: "cloudDrift 100s linear infinite" }} viewBox="0 0 1440 100" fill="none">
        <ellipse cx="600" cy="40" rx="220" ry="35" fill="white" fillOpacity="0.35" />
        <ellipse cx="570" cy="35" rx="140" ry="28" fill="white" fillOpacity="0.3" />
      </svg>

      <style>{`
        @keyframes cloudDrift {
          from { transform: translateX(-5%); }
          to   { transform: translateX(5%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

function GlassCard({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-md bg-white/70 border border-white/60 rounded-2xl shadow-lg shadow-blue-100/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-0.5 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}



function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    moderate: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[level] ?? colors.moderate}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

function ScoreGauge({ score, size = 140 }: { score: number; size?: number }) {
  const data = [{ value: score, fill: score > 75 ? "#ef4444" : score > 50 ? "#f59e0b" : score > 25 ? "#3b82f6" : "#10b981" }];
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <RadialBarChart
        width={size} height={size}
        cx={size / 2} cy={size / 2}
        innerRadius={size * 0.35} outerRadius={size * 0.48}
        startAngle={220} endAngle={-40}
        data={[{ value: 100, fill: "#e2e8f0" }, ...data]}
      >
        <RadialBar dataKey="value" cornerRadius={6} background={false} />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{score}</span>
        <span className="text-xs text-slate-500 font-medium">Risk Score</span>
      </div>
    </div>
  );
}


function WeatherIcon({ condition }: { condition: string }) {
  const c = condition.toLowerCase();
  if (c.includes("rain")) return <CloudRain className="w-5 h-5 text-blue-500" />;
  if (c.includes("wind")) return <Wind className="w-5 h-5 text-slate-500" />;
  if (c.includes("thunder")) return <Zap className="w-5 h-5 text-amber-500" />;
  if (c.includes("cloud")) return <Cloud className="w-5 h-5 text-slate-400" />;
  return <Sun className="w-5 h-5 text-amber-400" />;
}

function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links: { label: string; id: Page; icon: React.ReactNode }[] = [
    { label: "Home", id: "landing", icon: <Home className="w-4 h-4" /> },
    { label: "Dashboard", id: "dashboard", icon: <BarChart2 className="w-4 h-4" /> },
    { label: "Reports", id: "history", icon: <History className="w-4 h-4" /> },
    { label: "About", id: "about", icon: <Info className="w-4 h-4" /> },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-blue-100/60 shadow-sm shadow-blue-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    
        <button onClick={() => setPage("landing")} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-md">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Climate<span className="text-blue-500">Guardian</span>
          </span>
          <span className="hidden sm:block text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">AI</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                page === l.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              {l.icon}{l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-200">
            <Zap className="w-3.5 h-3.5" />Analyze
          </button>
          <button onClick={() => setPage("profile")} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 text-white" />
          </button>
          <button className="md:hidden p-2 rounded-lg hover:bg-blue-50" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      
      {menuOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <button key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${page === l.id ? "bg-blue-50 text-blue-600" : "text-slate-600"}`}>
              {l.icon}{l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}


async function fetchWeather(location: string): Promise<WeatherData> {
  const url = `${WEATHER_BASE}/current.json?key=${WEATHER_KEY}&q=${encodeURIComponent(location)}&aqi=yes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Location not found");
  return res.json();
}


async function fetchForecast(location: string): Promise<ForecastData> {
  const url = `${WEATHER_BASE}/forecast.json?key=${WEATHER_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=yes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Forecast unavailable");
  return res.json();
}


async function analyzeWithGemini(weather: WeatherData): Promise<ClimateScore> {
  const prompt = `You are a climate risk analyst AI. Given the following weather data for ${weather.location.name}, ${weather.location.country}, produce a climate risk assessment in valid JSON.

Weather data:
- Temperature: ${weather.current.temp_c}°C (feels like ${weather.current.feelslike_c}°C)
- Humidity: ${weather.current.humidity}%
- Wind: ${weather.current.wind_kph} km/h
- Pressure: ${weather.current.pressure_mb} hPa
- Precipitation: ${weather.current.precip_mm} mm
- UV Index: ${weather.current.uv}
- Visibility: ${weather.current.vis_km} km
- Condition: ${weather.current.condition.text}
- AQI (US EPA): ${weather.current.air_quality?.["us-epa-index"] ?? "N/A"}
- PM2.5: ${weather.current.air_quality?.pm2_5 ?? "N/A"} µg/m³
- PM10: ${weather.current.air_quality?.pm10 ?? "N/A"} µg/m³

Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
{
  "score": <0-100 overall risk>,
  "flood_risk": <0-100>,
  "heat_risk": <0-100>,
  "air_quality_risk": <0-100>,
  "confidence": <0-100>,
  "level": "<low|moderate|high|critical>",
  "summary": "<2-sentence summary>",
  "recommendations": ["<rec1>", "<rec2>", "<rec3>", "<rec4>"]
}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 512 }
  };

  try {
    const res = await fetch(
      `${GEMINI_BASE}/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    if (!res.ok) throw new Error("Gemini API error");
    const data = await res.json();
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as ClimateScore;
  } catch {
    return deriveScoreLocally(weather);
  }
}

function deriveScoreLocally(w: WeatherData): ClimateScore {
  const heat_risk = Math.min(100, Math.max(0, (w.current.temp_c - 20) * 3));
  const flood_risk = Math.min(100, w.current.humidity > 80 ? (w.current.humidity - 50) * 2 : 10);
  const aqi_idx = w.current.air_quality?.["us-epa-index"] ?? 1;
  const air_quality_risk = Math.min(100, aqi_idx * 17);
  const score = Math.round((heat_risk * 0.35 + flood_risk * 0.35 + air_quality_risk * 0.3));
  const level = score > 75 ? "critical" : score > 50 ? "high" : score > 25 ? "moderate" : "low";
  return {
    score, flood_risk: Math.round(flood_risk), heat_risk: Math.round(heat_risk),
    air_quality_risk: Math.round(air_quality_risk), confidence: 70, level,
    summary: `Climate risk for ${w.location.name} is ${level}. Current conditions show temperature of ${w.current.temp_c}°C with ${w.current.humidity}% humidity.`,
    recommendations: [
      heat_risk > 50 ? "Limit outdoor activity during peak heat hours (11am–3pm)." : "Temperature conditions are within safe range.",
      flood_risk > 50 ? "Monitor flood advisories. Avoid low-lying areas." : "Flooding risk is currently minimal.",
      air_quality_risk > 50 ? "Wear N95 masks outdoors. Keep windows closed." : "Air quality is acceptable for most activities.",
      "Stay hydrated and check local weather updates regularly.",
    ],
  };
}


const CACHE_KEY = "cg_last_search";
const HISTORY_KEY = "cg_report_history";

function saveToHistory(record: ReportRecord) {
  const existing: ReportRecord[] = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  const updated = [record, ...existing].slice(0, 20); // keep last 20
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

function loadHistory(): ReportRecord[] {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
}


function LandingPage({ setPage, setLocation }: { setPage: (p: Page) => void; setLocation: (l: string) => void }) {
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);

  // Get current GPS location → reverse geocode via Weather API
  // API CALL: GET /current.json?key=&q={lat},{lon}
  const useMyLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude},${pos.coords.longitude}`);
        setLocating(false);
        setPage("dashboard");
      },
      () => setLocating(false)
    );
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    localStorage.setItem(CACHE_KEY, query);
    setLocation(query);
    setPage("dashboard");
  };

  const features = [
    { icon: <Gauge className="w-6 h-6 text-blue-500" />, title: "Climate Score", desc: "AI-generated 0–100 risk score combining flood, heat, and air quality factors." },
    { icon: <Waves className="w-6 h-6 text-blue-400" />, title: "Flood Risk", desc: "Real-time precipitation and humidity analysis to predict flooding probability." },
    { icon: <Flame className="w-6 h-6 text-orange-400" />, title: "Heat Risk", desc: "Urban heat island effect analysis combined with UV and temperature data." },
    { icon: <Leaf className="w-6 h-6 text-emerald-500" />, title: "Air Quality Index", desc: "PM2.5, PM10, and ozone monitoring with WHO guideline comparisons." },
    { icon: <Brain className="w-6 h-6 text-indigo-500" />, title: "AI Intelligence", desc: "Gemini AI analyzes patterns to deliver actionable climate recommendations." },
    { icon: <FileText className="w-6 h-6 text-slate-500" />, title: "PDF Reports", desc: "Download professional climate risk reports for any location." },
  ];

  const steps = [
    { n: "01", title: "Search Location", desc: "Enter any city, address, or use GPS coordinates." },
    { n: "02", title: "Collect Weather", desc: "We fetch live weather, AQI, and forecast data." },
    { n: "03", title: "AI Analysis", desc: "Gemini AI analyzes climate risk factors in depth." },
    { n: "04", title: "Risk Dashboard", desc: "View your personalized climate risk dashboard." },
    { n: "05", title: "Download Report", desc: "Export a professional PDF report for your location." },
  ];

  return (
    <div className="min-h-screen pt-16" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="hidden lg:flex absolute left-8 top-32 items-center gap-2 backdrop-blur-md bg-white/80 border border-blue-100 rounded-2xl px-4 py-2.5 shadow-lg animate-bounce" style={{ animationDuration: "4s" }}>
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold text-slate-700">Live AQI Monitoring</span>
        </div>
        <div className="hidden lg:flex absolute right-8 top-40 items-center gap-2 backdrop-blur-md bg-white/80 border border-blue-100 rounded-2xl px-4 py-2.5 shadow-lg" style={{ animation: "float 5s ease-in-out infinite" }}>
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-slate-700">AI-Powered Reports</span>
        </div>
        <div className="relative mx-auto mb-8 w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-emerald-400 shadow-2xl shadow-blue-300 animate-pulse" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-2 rounded-full overflow-hidden opacity-80">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-600 opacity-70" />
            {[20, 40, 60, 75].map((t, i) => (
              <div key={i} className="absolute left-0 right-0 h-px bg-white/20" style={{ top: `${t}%` }} />
            ))}
            {[25, 50, 75].map((l, i) => (
              <div key={i} className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${l}%` }} />
            ))}
          </div>
          <div className="absolute -inset-3 rounded-full border border-blue-300/30 animate-spin" style={{ animationDuration: "20s" }} />
          <Globe className="absolute inset-0 m-auto w-12 h-12 text-white opacity-80" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Zap className="w-3 h-3" /> Powered by Gemini AI × WeatherAPI
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6 max-w-4xl mx-auto">
          Understand Climate Risks<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
            Before They Become Disasters
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Real-time climate intelligence powered by AI. Assess flood, heat, and air quality risks for any location on Earth — instantly.
        </p>

        {/* API CALL: GET /current.json?key=&q={query}&aqi=yes — triggered on search */}
        <div className="max-w-xl mx-auto flex gap-2 p-1.5 rounded-2xl backdrop-blur-md bg-white/80 border border-blue-200 shadow-xl shadow-blue-100">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search city, address, or coordinates…"
              className="w-full pl-10 pr-4 py-3 bg-transparent text-slate-800 placeholder:text-slate-400 text-sm font-medium outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2"
          >
            Analyze <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* API CALL: Geolocation API → GET /current.json?key=&q={lat},{lon} */}
        <button
          onClick={useMyLocation}
          disabled={locating}
          className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {locating ? "Detecting location…" : "Use my current location"}
        </button>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
          {["WeatherAPI", "Gemini AI", "Google Maps", "SDG 13 Aligned", "WCAG AA"].map((b) => (
            <span key={b} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-slate-200">
              <Check className="w-3 h-3 text-emerald-500" />{b}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Complete Climate Intelligence</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Every risk factor analyzed in real time, delivered as actionable insight.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <GlassCard key={f.title} className="p-6">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-500 text-lg">From search to insight in under 5 seconds.</p>
        </div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.n} className="flex md:flex-col items-center md:items-center gap-4 md:gap-0 flex-1">
              <div className="flex flex-col md:flex-row items-center flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                  <span className="text-white text-xs font-bold">{s.n}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-blue-300 to-blue-100 mx-3" />
                )}
                {i < steps.length - 1 && (
                  <div className="md:hidden w-px h-8 bg-gradient-to-b from-blue-300 to-blue-100 ml-6" />
                )}
              </div>
              <div className="md:text-center md:mt-4 pb-4 md:pb-0">
                <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                <p className="text-slate-500 text-xs mt-0.5 max-w-28">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <GlassCard className="p-12 text-center bg-gradient-to-br from-blue-50 to-emerald-50/50">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Ready to protect what matters?</h2>
          <p className="text-slate-500 mb-8">Get your free climate risk report for any location in seconds.</p>
          <button
            onClick={() => setPage("dashboard")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
          >
            Start Analyzing <ArrowRight className="w-5 h-5" />
          </button>
        </GlassCard>
      </section>
    </div>
  );
}

function DashboardPage({
  location, setLocation, setPage, setActiveReport
}: {
  location: string;
  setLocation: (l: string) => void;
  setPage: (p: Page) => void;
  setActiveReport: (r: ReportRecord) => void;
}) {
  const [query, setQuery] = useState(location || "London");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [climate, setClimate] = useState<ClimateScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const load = useCallback(async (loc: string) => {
    if (!loc) return;
    setLoading(true);
    setError("");
    setWeather(null);
    setClimate(null);
    try {
      const [w, f] = await Promise.all([fetchWeather(loc), fetchForecast(loc)]);
      setWeather(w);
      setForecast(f);
      setAiLoading(true);
      const c = await analyzeWithGemini(w);
      setClimate(c);
      const record: ReportRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        location: `${w.location.name}, ${w.location.country}`,
        score: c.score,
        level: c.level,
        weather: w,
        climate: c,
      };
      saveToHistory(record);
      localStorage.setItem(CACHE_KEY, loc);
    } catch (e: any) {
  
      setError(e.message ?? "Failed to fetch data. Check the location name.");
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const target = location || cached || "London";
    setQuery(target);
    load(target);
  }, [location]);

  const handleSearch = () => {
    setLocation(query);
    load(query);
  };

  const forecastChartData = forecast?.forecast.forecastday.map((d) => ({
    day: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
    max: Math.round(d.day.maxtemp_c),
    min: Math.round(d.day.mintemp_c),
    rain: d.day.daily_chance_of_rain,
    humidity: Math.round(d.day.avghumidity),
  })) ?? [];


  const mapUrl = weather
    ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(weather.location.name + "," + weather.location.country)}&zoom=11`
    : null;

  const aqiLabels = ["Good", "Moderate", "Unhealthy for Sensitive", "Unhealthy", "Very Unhealthy", "Hazardous"];
  const aqiColors = ["text-emerald-600", "text-yellow-500", "text-orange-400", "text-red-500", "text-red-700", "text-purple-700"];
  const aqiIdx = (weather?.current.air_quality?.["us-epa-index"] ?? 1) - 1;

  return (
    <div className="min-h-screen pt-20 pb-16 max-w-7xl mx-auto px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="flex gap-2 mb-8 mt-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search location…"
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/80 border border-blue-200 text-slate-800 text-sm font-medium outline-none focus:border-blue-400 shadow-sm"
          />
        </div>
        <button onClick={handleSearch} className="px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2">
          <Search className="w-4 h-4" /> Search
        </button>
        <button onClick={() => load(query)} className="p-3 rounded-xl backdrop-blur-md bg-white/70 border border-blue-200 hover:bg-white transition-all">
          <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <GlassCard className="p-6 mb-6 border-red-200 bg-red-50/50">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        </GlassCard>
      )}

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/60 border border-blue-100 animate-pulse" />
          ))}
        </div>
      )}

      {weather && climate && !loading && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h1 className="text-2xl font-bold text-slate-900">{weather.location.name}, {weather.location.country}</h1>
                <RiskBadge level={climate.level} />
              </div>
              <p className="text-slate-500 text-sm mt-1 ml-7">
                {new Date(weather.location.localtime).toLocaleString("en", { weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                &nbsp;· {weather.current.condition.text}
              </p>
            </div>
            <div className="flex gap-2">
           
              <button
                onClick={() => {
                  const r: ReportRecord = { id: Date.now().toString(), date: new Date().toISOString(), location: `${weather.location.name}, ${weather.location.country}`, score: climate.score, level: climate.level, weather, climate };
                  setActiveReport(r);
                  setPage("report");
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
              >
                <Brain className="w-4 h-4" /> AI Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-5">
            <GlassCard className="p-6 flex flex-col items-center justify-center">
              {aiLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
                  <p className="text-sm text-slate-500 text-center">Gemini AI analyzing…</p>
                </div>
              ) : (
                <>
                  <ScoreGauge score={climate.score} size={130} />
                  <div className="mt-3 w-full space-y-2">
                    {[
                      { label: "Flood Risk", val: climate.flood_risk, color: "bg-blue-500" },
                      { label: "Heat Risk", val: climate.heat_risk, color: "bg-orange-400" },
                      { label: "Air Quality", val: climate.air_quality_risk, color: "bg-purple-400" },
                    ].map((r) => (
                      <div key={r.label}>
                        <div className="flex justify-between text-xs text-slate-500 mb-1"><span>{r.label}</span><span className="font-semibold text-slate-700">{r.val}</span></div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${r.color} rounded-full transition-all duration-1000`} style={{ width: `${r.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </GlassCard>

            {[
              { label: "Temperature", val: `${weather.current.temp_c}°C`, sub: `Feels ${weather.current.feelslike_c}°C`, icon: <Thermometer className="w-5 h-5 text-orange-400" />, color: "from-orange-50 to-amber-50" },
              { label: "Humidity", val: `${weather.current.humidity}%`, sub: `Precip ${weather.current.precip_mm}mm`, icon: <Droplets className="w-5 h-5 text-blue-400" />, color: "from-blue-50 to-sky-50" },
              { label: "Wind Speed", val: `${weather.current.wind_kph} km/h`, sub: `Pressure ${weather.current.pressure_mb}hPa`, icon: <Wind className="w-5 h-5 text-slate-400" />, color: "from-slate-50 to-gray-50" },
            ].map((s) => (
              <GlassCard key={s.label} className={`p-5 bg-gradient-to-br ${s.color}`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</span>
                  <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">{s.icon}</div>
                </div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{s.val}</p>
                <p className="text-xs text-slate-500">{s.sub}</p>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 text-sm">Air Quality Index</h3>
                <Leaf className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-bold text-slate-900">{weather.current.air_quality?.["us-epa-index"] ?? "N/A"}</span>
                <span className={`text-sm font-semibold pb-1 ${aqiColors[aqiIdx]}`}>{aqiLabels[aqiIdx]}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "PM2.5", val: weather.current.air_quality?.pm2_5?.toFixed(1) ?? "—" },
                  { label: "PM10", val: weather.current.air_quality?.pm10?.toFixed(1) ?? "—" },
                  { label: "Ozone", val: weather.current.air_quality?.o3?.toFixed(1) ?? "—" },
                ].map((a) => (
                  <div key={a.label} className="bg-slate-50 rounded-xl p-2">
                    <p className="text-xs text-slate-400 mb-0.5">{a.label}</p>
                    <p className="text-sm font-bold text-slate-700">{a.val}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 text-sm">Conditions</h3>
                <WeatherIcon condition={weather.current.condition.text} />
              </div>
              {[
                { label: "UV Index", val: weather.current.uv, max: 11, unit: "", icon: <Sun className="w-4 h-4 text-amber-400" />, color: "bg-amber-400" },
                { label: "Visibility", val: weather.current.vis_km, max: 20, unit: "km", icon: <Eye className="w-4 h-4 text-blue-400" />, color: "bg-blue-400" },
              ].map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-1.5">{c.icon}<span className="text-slate-600 font-medium">{c.label}</span></div>
                    <span className="font-bold text-slate-800">{c.val}{c.unit}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, (c.val / c.max) * 100)}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-auto pt-2 text-center">
                <img src={`https:${weather.current.condition.icon}`} alt={weather.current.condition.text} className="w-12 h-12 mx-auto" />
                <p className="text-xs text-slate-500 mt-1">{weather.current.condition.text}</p>
              </div>
            </GlassCard>

        
            <GlassCard className="overflow-hidden">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  title={`Map of ${weather.location.name}`}
                  className="w-full h-full min-h-52"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              ) : (
                <div className="flex items-center justify-center h-52 text-slate-400 text-sm">Loading map…</div>
              )}
            </GlassCard>
          </div>

          {forecastChartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <GlassCard className="p-6">
                <h3 className="font-semibold text-slate-800 text-sm mb-4">7-Day Temperature Forecast</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={forecastChartData}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="°" />
                    <Tooltip contentStyle={{ background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="max" stroke="#3b82f6" fill="url(#tempGrad)" strokeWidth={2} name="Max °C" />
                    <Area type="monotone" dataKey="min" stroke="#93c5fd" fill="none" strokeWidth={2} strokeDasharray="4 2" name="Min °C" />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-semibold text-slate-800 text-sm mb-4">Rain Probability (%)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={forecastChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="rain" fill="#60a5fa" radius={[6, 6, 0, 0]} name="Rain %" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          )}

          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Brain className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-slate-800">AI Recommendations</h3>
              <span className="text-xs text-slate-400 ml-auto">Confidence: {climate.confidence}%</span>
            </div>
            <p className="text-slate-600 text-sm mb-5 leading-relaxed">{climate.summary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {climate.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}



function ReportPage({ report }: { report: ReportRecord | null }) {
  if (!report) return (
    <div className="min-h-screen pt-28 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <GlassCard className="p-12 text-center max-w-sm">
        <Brain className="w-10 h-10 text-blue-400 mx-auto mb-4" />
        <p className="text-slate-500">No report loaded. Run a dashboard search first.</p>
      </GlassCard>
    </div>
  );

  const { weather, climate } = report;

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-20 pb-16 max-w-4xl mx-auto px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-8 mt-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <FileText className="w-4 h-4" />
            <span>Climate Risk Report</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 font-medium">{report.location}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">AI Climate Analysis</h1>
        </div>
        <button onClick={downloadPDF} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 active:scale-95">
          <Download className="w-4 h-4" /> Export as PDF
        </button>
      </div>

      <div className="space-y-5">
        <GlassCard className="p-8 mb-5 bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-100/50">
        <div className="flex flex-wrap gap-8 items-center">
          <ScoreGauge score={climate.score} size={150} />
          <div className="flex-1 min-w-48">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-slate-800">{report.location}</span>
              <RiskBadge level={climate.level} />
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">{climate.summary}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(report.date).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                {new Date(report.date).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="flex items-center gap-1.5 text-indigo-500">
                <Brain className="w-3.5 h-3.5" />
                Confidence: {climate.confidence}%
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          { label: "Flood Risk", val: climate.flood_risk, icon: <Waves className="w-5 h-5 text-blue-500" />, color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
          { label: "Heat Risk", val: climate.heat_risk, icon: <Flame className="w-5 h-5 text-orange-500" />, color: "text-orange-600", bg: "bg-orange-50", bar: "bg-orange-400" },
          { label: "Air Quality Risk", val: climate.air_quality_risk, icon: <Leaf className="w-5 h-5 text-emerald-500" />, color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" },
        ].map((r) => (
          <GlassCard key={r.label} className={`p-5 ${r.bg}`}>
            <div className="flex items-center justify-between mb-3">{r.icon}<span className={`text-2xl font-bold ${r.color}`}>{r.val}</span></div>
            <p className="text-sm font-semibold text-slate-700 mb-2">{r.label}</p>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <div className={`h-full ${r.bar} rounded-full transition-all duration-1000`} style={{ width: `${r.val}%` }} />
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6 mb-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Thermometer className="w-4 h-4 text-orange-400" />Observed Weather Data</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Temperature", val: `${weather.current.temp_c}°C` },
            { label: "Humidity", val: `${weather.current.humidity}%` },
            { label: "Wind", val: `${weather.current.wind_kph} km/h` },
            { label: "Pressure", val: `${weather.current.pressure_mb} hPa` },
            { label: "UV Index", val: weather.current.uv },
            { label: "Precipitation", val: `${weather.current.precip_mm} mm` },
          ].map((d) => (
            <div key={d.label} className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 mb-1">{d.label}</p>
              <p className="font-bold text-slate-800">{d.val}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6 mb-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Leaf className="w-4 h-4 text-emerald-500" />Air Quality Data</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "EPA AQI Index", val: weather.current.air_quality?.["us-epa-index"] ?? "N/A" },
            { label: "PM2.5 (µg/m³)", val: weather.current.air_quality?.pm2_5?.toFixed(1) ?? "N/A" },
            { label: "PM10 (µg/m³)", val: weather.current.air_quality?.pm10?.toFixed(1) ?? "N/A" },
            { label: "Ozone (µg/m³)", val: weather.current.air_quality?.o3?.toFixed(1) ?? "N/A" },
          ].map((d) => (
            <div key={d.label} className="text-center p-3 bg-emerald-50/60 rounded-xl">
              <p className="text-xs text-slate-400 mb-1">{d.label}</p>
              <p className="font-bold text-slate-800">{d.val}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2"><Brain className="w-4 h-4 text-indigo-500" />AI Recommendations</h3>
        <div className="space-y-3">
          {climate.recommendations.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <p className="text-slate-700 text-sm leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </GlassCard>
      </div>
    </div>
  );
}


function HistoryPage({ setPage, setActiveReport }: { setPage: (p: Page) => void; setActiveReport: (r: ReportRecord) => void }) {
  const [records, setRecords] = useState<ReportRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setRecords(loadHistory());
  }, []);

  const filtered = records.filter((r) => {
    const matchSearch = r.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.level === filter;
    return matchSearch && matchFilter;
  });
  const deleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen pt-20 pb-16 max-w-6xl mx-auto px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Report History</h1>
        <p className="text-slate-500 text-sm">Your saved climate risk reports.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl backdrop-blur-md bg-white/80 border border-blue-200 text-slate-800 text-sm font-medium outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl backdrop-blur-md bg-white/80 border border-blue-200 text-sm font-medium text-slate-700 outline-none appearance-none cursor-pointer"
          >
            {["all", "low", "moderate", "high", "critical"].map((v) => (
              <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 && (
        <GlassCard className="p-16 text-center">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium mb-1">No reports found</p>
          <p className="text-slate-400 text-sm">Run a dashboard analysis to generate your first report.</p>
        </GlassCard>
      )}

      <div className="space-y-3">
        {filtered.map((r) => (
          <GlassCard key={r.id} className="p-5 flex flex-wrap items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <span className="text-blue-700 font-bold text-sm">{r.score}</span>
            </div>
            <div className="flex-1 min-w-32">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-slate-800 text-sm">{r.location}</p>
                <RiskBadge level={r.level} />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(r.date).toLocaleString("en", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setActiveReport(r); setPage("report"); }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button
                onClick={() => deleteRecord(r.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}



function AboutPage() {
  const techStack = [
    { label: "React + TypeScript", role: "Frontend" },
    { label: "WeatherAPI.com", role: "Weather & AQI Data" },
    { label: "Gemini AI", role: "Climate Intelligence" },
    { label: "Google Maps", role: "Location Mapping" },
    { label: "Recharts", role: "Data Visualization" },
    { label: "Tailwind CSS", role: "Styling" },
  ];
  return (
    <div className="min-h-screen pt-20 pb-16 max-w-5xl mx-auto px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mt-4 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6">
          <Globe className="w-3 h-3" /> SDG 13 — Climate Action
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-5 leading-tight">
          AI for a <span className="text-blue-500">safer planet</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Climate Guardian AI democratizes access to climate risk intelligence. Built on real-time data and powered by Gemini AI, it helps individuals, planners, and businesses make climate-informed decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
        {[
          { icon: <Shield className="w-6 h-6 text-blue-500" />, title: "Our Mission", desc: "Make climate risk data accessible and actionable for everyone — not just climate scientists." },
          { icon: <Globe className="w-6 h-6 text-emerald-500" />, title: "SDG 13 Aligned", desc: "Supporting UN Sustainable Development Goal 13: Take urgent action to combat climate change." },
          { icon: <Brain className="w-6 h-6 text-indigo-500" />, title: "Powered by Gemini", desc: "Google DeepMind's Gemini AI analyzes multi-dimensional climate factors with high confidence." },
          { icon: <Activity className="w-6 h-6 text-orange-400" />, title: "Real-Time Data", desc: "Live weather, AQI, and atmospheric data sourced from WeatherAPI's global sensor network." },
        ].map((c) => (
          <GlassCard key={c.title} className="p-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">{c.icon}</div>
            <h3 className="font-bold text-slate-800 mb-2">{c.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Technology Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {techStack.map((t) => (
            <div key={t.label} className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium mb-1">{t.role}</span>
              <span className="text-sm font-bold text-slate-800">{t.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}


function SettingsPage() {
  const [tempUnit, setTempUnit] = useState("celsius");
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <div className="min-h-screen pt-20 pb-16 max-w-2xl mx-auto px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500 text-sm">Configure your Climate Guardian preferences.</p>
      </div>
      <div className="space-y-4">
        {[
          {
            title: "Temperature Unit",
            desc: "Choose between Celsius and Fahrenheit.",
            control: (
              <div className="flex gap-2">
                {["celsius", "fahrenheit"].map((u) => (
                  <button key={u} onClick={() => setTempUnit(u)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${tempUnit === u ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {u === "celsius" ? "°C" : "°F"}
                  </button>
                ))}
              </div>
            )
          },
          {
            title: "Risk Notifications",
            desc: "Alert when climate risk exceeds threshold.",
            control: (
              <button onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-all ${notifications ? "bg-blue-500" : "bg-slate-200"} relative`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifications ? "left-6" : "left-0.5"}`} />
              </button>
            )
          },
          {
            title: "Auto Refresh",
            desc: "Refresh dashboard data every 10 minutes.",
            control: (
              <button onClick={() => setAutoRefresh(!autoRefresh)}
                className={`w-12 h-6 rounded-full transition-all ${autoRefresh ? "bg-blue-500" : "bg-slate-200"} relative`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${autoRefresh ? "left-6" : "left-0.5"}`} />
              </button>
            )
          },
        ].map((s) => (
          <GlassCard key={s.title} className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
            </div>
            {s.control}
          </GlassCard>
        ))}

        <GlassCard className="p-5">
          <p className="font-semibold text-slate-800 text-sm mb-3">Data Management</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => localStorage.removeItem(CACHE_KEY)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-all border border-slate-200">
              <RefreshCw className="w-3.5 h-3.5" /> Clear Search Cache
            </button>
            <button onClick={() => localStorage.removeItem(HISTORY_KEY)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-all border border-red-200">
              <Trash2 className="w-3.5 h-3.5" /> Clear All History
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}


function ProfilePage() {
  const stats = loadHistory();
  return (
    <div className="min-h-screen pt-20 pb-16 max-w-2xl mx-auto px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Profile</h1>
      </div>
      <GlassCard className="p-8 mb-5 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Climate Analyst</h2>
        <p className="text-slate-400 text-sm">Free Plan</p>
      </GlassCard>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Reports Generated", val: stats.length },
          { label: "Locations Analyzed", val: new Set(stats.map((r) => r.location)).size },
          { label: "Avg Risk Score", val: stats.length ? Math.round(stats.reduce((a, b) => a + b.score, 0) / stats.length) : 0 },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 mb-1">{s.val}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}


function NotFoundPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <GlassCard className="p-16 text-center max-w-sm">
        <div className="text-7xl font-bold text-blue-200 mb-4">404</div>
        <Cloud className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Page not found</h2>
        <p className="text-slate-400 text-sm mb-6">The page you are looking for has drifted away.</p>
        <button onClick={() => setPage("landing")} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
          Back to Home
        </button>
      </GlassCard>
    </div>
  );
}


function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="relative z-10 border-t border-blue-100/60 bg-white/60 backdrop-blur-xl mt-8">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-700 text-sm">Climate<span className="text-blue-500">Guardian</span> AI</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <button onClick={() => setPage("privacy")} className="hover:text-blue-600 transition-colors">Privacy</button>
            <button onClick={() => setPage("terms")} className="hover:text-blue-600 transition-colors">Terms</button>
            <button onClick={() => setPage("documentation")} className="hover:text-blue-600 transition-colors">Documentation</button>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/vinaysingh-05" className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-blue-100 transition-all">
              <Github className="w-4 h-4 text-slate-500" />
            </a>
            <a href="https://www.linkedin.com/in/vinay-kumar0805/" className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-blue-100 transition-all">
              <Linkedin className="w-4 h-4 text-slate-500" />
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} Climate Guardian AI · Powered by WeatherAPI, Gemini AI & Google Maps · SDG 13 Climate Action
        </p>
      </div>
    </footer>
  );
}


export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [location, setLocation] = useState("");
  const [activeReport, setActiveReport] = useState<ReportRecord | null>(null);

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <AnimatedBackground />

      <Navbar page={page} setPage={setPage} />

    
      <div className="relative z-10">
        {page === "landing"   && <LandingPage setPage={setPage} setLocation={setLocation} />}
        {page === "dashboard" && <DashboardPage location={location} setLocation={setLocation} setPage={setPage} setActiveReport={setActiveReport} />}
        {page === "report"    && <ReportPage report={activeReport} />}
        {page === "history"   && <HistoryPage setPage={setPage} setActiveReport={setActiveReport} />}
        {page === "about"     && <AboutPage />}
        {page === "settings"  && <SettingsPage />}
        {page === "profile"   && <ProfilePage />}
        {page === "privacy"   && <PrivacyPage setPage={setPage} />}
        {page === "terms"     && <TermsPage setPage={setPage} />}
        {page === "documentation" && <DocumentationPage setPage={setPage} />}
        {page === "404"       && <NotFoundPage setPage={setPage} />}
      </div>

      <Footer setPage={setPage} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-16px); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @media print {
          .fixed, nav, footer { display: none !important; }
          .relative { position: static !important; }
        }
      `}</style>
    </div>
  );
}
