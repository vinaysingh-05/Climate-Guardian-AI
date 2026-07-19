import {
  BookOpen,
  Database,
  Cpu,
  Cloud,
  MapPinned
} from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-16 px-6">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border p-10">

        <div className="text-center mb-10">

          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />

          <h1 className="text-4xl font-bold text-slate-800">
            Documentation
          </h1>

          <p className="text-slate-500 mt-2">
            Climate Guardian AI — Developer & User Guide
          </p>

        </div>

        <div className="space-y-8">

          <section>

            <h2 className="text-2xl font-semibold mb-3">
              Overview
            </h2>

            <p className="text-slate-600">
              Climate Guardian AI is an AI-powered platform that analyzes
              weather, air quality, and environmental data to generate
              intelligent climate risk assessments.
            </p>

          </section>

          <section>

            <h2 className="text-2xl font-semibold mb-3">
              Features
            </h2>

            <ul className="list-disc ml-6 text-slate-600 space-y-2">

              <li>Location Search</li>

              <li>Live Weather Data</li>

              <li>Air Quality Monitoring</li>

              <li>Climate Risk Score</li>

              <li>Flood Risk Analysis</li>

              <li>Heatwave Prediction</li>

              <li>Interactive Dashboard</li>

              <li>AI Recommendations</li>

              <li>PDF Report Generation</li>

            </ul>

          </section>

          <section>

            <h2 className="text-2xl font-semibold mb-3">
              Technology Stack
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="border rounded-xl p-4 flex gap-3">
                <Cpu className="text-blue-600" />
                <div>
                  <h3 className="font-semibold">
                    Frontend
                  </h3>
                  <p>React • TypeScript • Tailwind CSS</p>
                </div>
              </div>

              <div className="border rounded-xl p-4 flex gap-3">
                <Database className="text-green-600" />
                <div>
                  <h3 className="font-semibold">
                    Backend
                  </h3>
                  <p>Firebase • Gemini AI</p>
                </div>
              </div>

              <div className="border rounded-xl p-4 flex gap-3">
                <Cloud className="text-orange-500" />
                <div>
                  <h3 className="font-semibold">
                    APIs
                  </h3>
                  <p>Open-Meteo • Google Maps</p>
                </div>
              </div>

              <div className="border rounded-xl p-4 flex gap-3">
                <MapPinned className="text-red-500" />
                <div>
                  <h3 className="font-semibold">
                    Visualizations
                  </h3>
                  <p>Leaflet • Recharts</p>
                </div>
              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}