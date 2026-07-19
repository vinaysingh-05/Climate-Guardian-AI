import { ArrowLeft } from "lucide-react";

interface TermsPageProps {
  setPage: (page: "landing" | "dashboard" | "report" | "history" | "about" | "settings" | "profile" | "404" | "privacy" | "terms" | "documentation") => void;
}

export default function TermsPage({ setPage }: TermsPageProps) {
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
            Terms of Service
          </h1>
          <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">1. Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing and using Climate Guardian AI, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">2. Use License</h2>
              <p className="mb-3">Permission is granted to temporarily download one copy of the materials (information or software) on Climate Guardian AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the application</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">3. Disclaimer</h2>
              <p className="leading-relaxed">
                The materials on Climate Guardian AI are provided on an 'as is' basis. Climate Guardian AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">4. Limitations</h2>
              <p className="leading-relaxed">
                In no event shall Climate Guardian AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the application, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">5. Accuracy of Materials</h2>
              <p className="leading-relaxed">
                The materials appearing on Climate Guardian AI could include technical, typographical, or photographic errors. Climate Guardian AI does not warrant that any of the materials on the application are accurate, complete, or current. Climate Guardian AI may make changes to the materials contained on the application at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">6. Links</h2>
              <p className="leading-relaxed">
                Climate Guardian AI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Climate Guardian AI of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">7. Modifications</h2>
              <p className="leading-relaxed">
                Climate Guardian AI may revise these terms of service for the application at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">8. Governing Law</h2>
              <p className="leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
