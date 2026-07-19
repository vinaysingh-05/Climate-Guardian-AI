import { ArrowLeft } from "lucide-react";

interface PrivacyPageProps {
  setPage: (page: "landing" | "dashboard" | "report" | "history" | "about" | "settings" | "profile" | "404" | "privacy" | "terms" | "documentation") => void;
}

export default function PrivacyPage({ setPage }: PrivacyPageProps) {
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
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">1. Introduction</h2>
              <p className="leading-relaxed">
                Climate Guardian AI ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">2. Information We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Location Data:</h3>
                  <p>We collect your location to provide weather and climate risk assessments. You can manage this in settings.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Usage Data:</h3>
                  <p>We track which features you use to improve the application experience.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">API Integration:</h3>
                  <p>We use WeatherAPI, Gemini AI, and Google Maps APIs to provide our services.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">3. Data Usage</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide and maintain our services</li>
                <li>Improve and optimize our application</li>
                <li>Detect and prevent security issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">4. Data Retention</h2>
              <p className="leading-relaxed">
                Your data is retained as long as necessary to provide services. You can delete your data at any time through your profile settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at: privacy@climateguardian.ai</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
