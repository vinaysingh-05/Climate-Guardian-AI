import { ArrowLeft, BookOpen, Lightbulb, Zap, MapPin } from "lucide-react";

interface DocumentationPageProps {
  setPage: (page: "landing" | "dashboard" | "report" | "history" | "about" | "settings" | "profile" | "404" | "privacy" | "terms" | "documentation") => void;
}

export default function DocumentationPage({ setPage }: DocumentationPageProps) {
  return (
    <div className="min-h-screen pt-20 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setPage("landing")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-100/50 p-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-slate-500 mb-8">Learn how to use Climate Guardian AI effectively</p>

          <div className="space-y-8">
            {/* Getting Started */}
            <section className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-slate-800">Getting Started</h2>
              </div>
              <p className="text-slate-700 mb-3">
                Climate Guardian AI is a climate risk intelligence tool that helps you understand weather patterns and air quality in your area.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Enter your location in the search bar</li>
                <li>View current weather conditions and climate risk score</li>
                <li>Check the detailed analysis powered by Gemini AI</li>
                <li>Save reports for future reference</li>
              </ol>
            </section>

            {/* Features */}
            <section className="border-l-4 border-emerald-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-semibold text-slate-800">Key Features</h2>
              </div>
              <div className="space-y-3 text-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">🌍 Location Search</h3>
                  <p>Search for any location worldwide to get real-time climate data and risk assessment</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">📊 Climate Risk Score</h3>
                  <p>Get a comprehensive score (0-100) based on flood risk, heat risk, and air quality indicators</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">🧠 AI Analysis</h3>
                  <p>Powered by Gemini AI, get detailed insights and recommendations for climate adaptation</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">📈 Weather Forecast</h3>
                  <p>View 10-day forecast with temperature trends and precipitation data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">💾 Report History</h3>
                  <p>Save and revisit previous climate assessments and export as PDF</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">🗺️ Map View</h3>
                  <p>See your location on an interactive Google Map</p>
                </div>
              </div>
            </section>

            {/* Understanding Scores */}
            <section className="border-l-4 border-orange-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-semibold text-slate-800">Understanding Climate Risk Scores</h2>
              </div>
              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                  <span className="font-semibold">🟢 Low Risk</span>
                  <span>0-25: Safe conditions</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-200">
                  <span className="font-semibold">🟡 Moderate Risk</span>
                  <span>26-50: Monitor conditions</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-200">
                  <span className="font-semibold">🟠 High Risk</span>
                  <span>51-75: Take precautions</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                  <span className="font-semibold">🔴 Critical Risk</span>
                  <span>76-100: Severe conditions</span>
                </div>
              </div>
            </section>

            {/* How to Use */}
            <section className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-semibold text-slate-800">How to Use Each Feature</h2>
              </div>
              <div className="space-y-4 text-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Dashboard</h3>
                  <p>Your main view with current weather, climate risk score, and quick actions. Use the search bar at the top to change location.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Generate Report</h3>
                  <p>Click "Generate Report" to create a detailed analysis. This uses AI to provide personalized recommendations.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">History</h3>
                  <p>View all your previous reports. Click any report to view details or export as PDF.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Settings</h3>
                  <p>Configure your preferences, notifications, and units (Celsius/Fahrenheit).</p>
                </div>
              </div>
            </section>

            {/* Support */}
            <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Need Help?</h2>
              <p className="text-slate-700">
                For more support, please visit our <a href="#" className="text-blue-600 hover:underline">Help Center</a> or contact us at: support@climateguardian.ai
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
