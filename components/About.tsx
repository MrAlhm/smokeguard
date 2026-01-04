
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in duration-1000">
      <div className="p-8 md:p-12 space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-blue-900/40">
              🛡️
            </div>
            <h2 className="text-3xl font-extrabold text-white">SmokeGuard AI Monitoring</h2>
          </div>
          <p className="text-lg text-slate-400 leading-relaxed max-w-4xl">
            SmokeGuard AI is a state-of-the-art prototype designed to automate the detection of visible smoke emissions from vehicles. 
            Developed by team <b>Black Dragon</b>, it bridges the gap in roadside pollution enforcement using advanced vision intelligence.
          </p>
        </section>

        <div className="h-px bg-slate-800 w-full"></div>

        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
              Hackathon Entry
            </h3>
            <div className="space-y-4 text-slate-400">
              <p><strong>System Name:</strong> <span className="text-blue-400 font-bold">SmokeGuard AI</span></p>
              <p><strong>Developed By:</strong> <span className="text-blue-400 font-bold">BLACK-DRAGON</span></p>
              <p className="text-sm leading-relaxed mt-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                Created for the TechSprint Hackathon, this solution leverages multimodal AI to identify environmental risks and polluting vehicles instantly.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
              Black Dragon Team
            </h3>
            <div className="grid gap-6">
              <TeamMember name="Harsha" role="Team Leader" reg="23BCE8747" />
              <TeamMember name="Hasika" role="AI & Backend" reg="23BCE9934" />
              <TeamMember name="Cheritha" role="UI/UX Lead" reg="23BCE7686" />
            </div>
          </section>
        </div>
      </div>
      
      <footer className="bg-slate-900/50 p-6 text-center border-t border-slate-800">
        <p className="text-sm text-slate-500 font-medium">SmokeGuard AI Prototype | Team Black Dragon</p>
      </footer>
    </div>
  );
};

const TeamMember: React.FC<{ name: string; role: string; reg: string }> = ({ name, role, reg }) => (
  <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-blue-400">
      {name[0]}
    </div>
    <div>
      <h4 className="font-bold text-slate-200">{name}</h4>
      <p className="text-xs text-slate-500 font-medium">{role} • {reg}</p>
    </div>
  </div>
);

export default About;
