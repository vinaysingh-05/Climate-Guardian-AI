import { Shield, Lock, Database, Globe, Mail } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-4xl font-bold text-slate-800">
            Privacy Policy
          </h1>

          <p className="text-slate-500 mt-3">
            Last Updated: July 2026
          </p>

          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Climate Guardian AI values your privacy. This policy explains how
            we collect, use, and protect your information while providing
            AI-powered climate risk assessments.
          </p>
        </div>

        {/* Information Collection */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Database className="text-blue-600" />
            <h2 className="text-2xl font-semibold text-slate-800">
              Information We Collect
            </h2>
          </div>

          <ul className="list-disc ml-6 text-slate-600 space-y-2">
            <li>Location entered by the user for climate analysis.</li>
            <li>Weather and environmental data retrieved from trusted APIs.</li>
            <li>Basic browser and device information for performance improvements.</li>
            <li>Anonymous analytics to improve the platform experience.</li>
          </ul>
        </section>

        {/* Data Usage */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-800">
              How We Use Your Data
            </h2>
          </div>

          <ul className="list-disc ml-6 text-slate-600 space-y-2">
            <li>Generate personalized climate risk assessments.</li>
            <li>Provide AI-powered recommendations.</li>
            <li>Improve prediction accuracy and user experience.</li>
            <li>Maintain platform reliability and security.</li>
          </ul>
        </section>

        {/* Security */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="text-orange-500" />
            <h2 className="text-2xl font-semibold text-slate-800">
              Data Security
            </h2>
          </div>

          <p className="text-slate-600 leading-7">
            We use secure communication protocols and industry-standard security
            practices to protect your information. Climate Guardian AI does not
            sell or rent your personal data to third parties.
          </p>
        </section>

        {/* Third Party Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Third-Party Services
          </h2>

          <p className="text-slate-600 mb-3">
            Our platform integrates trusted services to deliver accurate climate
            intelligence:
          </p>

          <ul className="list-disc ml-6 text-slate-600 space-y-2">
            <li>Gemini AI</li>
            <li>Open-Meteo API</li>
            <li>Google Maps</li>
            <li>Firebase</li>
          </ul>
        </section>

        {/* User Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Your Rights
          </h2>

          <p className="text-slate-600 leading-7">
            You may request information regarding your stored data or ask for
            its removal, subject to applicable laws and technical limitations.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t pt-8">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="text-blue-600" />
            <h2 className="text-2xl font-semibold text-slate-800">
              Contact Us
            </h2>
          </div>

          <p className="text-slate-600">
            For privacy-related questions, feedback, or concerns, please contact
            us at:
          </p>

          <p className="mt-3 font-medium text-blue-600">
            vinay@example.com
          </p>
        </section>

      </div>
    </div>
  );
}