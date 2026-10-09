import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  Mic, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  ArrowRight,
  Compass
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  suggestedAction?: string;
  actionTab?: 'plan' | 'alerts' | 'trips';
}

export const CopilotAssistantModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentScenario, setActiveTab, language } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const initialMessages: ChatMessage[] = [
    {
      id: 'm1',
      sender: 'copilot',
      text: language === 'hi' 
        ? 'नमस्ते! मैं मुंबई कम्यूट को-पायलट हूँ। आज के मौसम, लोकल ट्रेन स्थिति और जलभराव के आधार पर सर्वश्रेष्ठ मार्ग बताइए।'
        : language === 'mr'
        ? 'नमस्कार! मी मुंबई कम्यूट को-पायलट आहे. हवामान, लोकल ट्रेन व पाणी साचण्याच्या स्थितीनुसार योग्य मार्ग विचारा.'
        : 'Hello! I am Mumbai Commute Copilot. Ask me about weather impacts, high tide warnings, safest night paths, or the quickest multimodal way to your destination.',
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const quickPrompts = [
    "What's the safest way to reach BKC tonight?",
    "Should I leave earlier today?",
    "Is it safe to travel through Sion right now?",
    "Find the cheapest route from Andheri to BKC",
    "Which route is least crowded?"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = '';
      let suggestedAction: string | undefined = undefined;
      let actionTab: 'plan' | 'alerts' | 'trips' | undefined = undefined;

      const q = query.toLowerCase();

      if (q.includes('safe') || q.includes('tonight') || q.includes('night')) {
        reply = "For tonight, I recommend Metro Line 1 connecting to Metro Line 3. All stations have bright LED lighting, active RPF patrols, and avoid poorly lit street corridors. Safety score is 94/100. Be sure to enable Trip Sharing with trusted contacts.";
        suggestedAction = "View Night-Safe Plan";
        actionTab = "plan";
      } else if (q.includes('leave earlier') || q.includes('time') || q.includes('traffic')) {
        reply = `With today's conditions (${currentScenario.weather.condition}, high tide at ${currentScenario.tide.highTideTime}), road corridors like the Western Express Highway have higher uncertainty. I suggest leaving at 8:35 AM for an arrive-by time of 9:30 AM (90% confidence buffer: +12 min).`;
        suggestedAction = "Check Leave-By Times";
        actionTab = "plan";
      } else if (q.includes('sion') || q.includes('water') || q.includes('flood') || q.includes('rain')) {
        reply = "Sion railway culvert and low-lying roads are currently under watch with 20-45cm water accumulation. BEST buses are diverted via Sulochana Shetty Marg. If travelling towards Dadar or CSMT, take elevated flyovers or Central AC local.";
        suggestedAction = "Check Waterlogging Sensors";
        actionTab = "alerts";
      } else if (q.includes('cheap') || q.includes('cost') || q.includes('budget')) {
        reply = "The cheapest option is Suburban Local Train (₹15) or BEST AC Express (₹25). That saves ₹220 compared to a direct cab, with only 8-12 minutes additional travel time.";
        suggestedAction = "Compare Route Fares";
        actionTab = "plan";
      } else {
        reply = "Evaluating real-time Mumbai parameters: Metro Line 1 & Line 3 Aqua are currently the most reliable corridors with zero flood exposure and 92% arrival punctuality.";
        suggestedAction = "Explore Multimodal Routes";
        actionTab = "plan";
      }

      const copilotMsg: ChatMessage = {
        id: 'copilot_' + Date.now(),
        sender: 'copilot',
        text: reply,
        suggestedAction,
        actionTab,
      };

      setMessages((prev) => [...prev, copilotMsg]);
    }, 450);
  };

  const handleVoiceSim = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend("What's the safest way to reach BKC tonight?");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[600px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2166F3] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1F3A]">
                Mumbai Commute Copilot AI
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Multilingual · Natural Language Reasoning Engine
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user' ? 'bg-[#0B1F3A] text-white' : 'bg-blue-100 text-[#2166F3]'
              }`}>
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#2166F3] text-white'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {m.text}

                {m.suggestedAction && m.actionTab && (
                  <button
                    onClick={() => {
                      setActiveTab(m.actionTab!);
                      onClose();
                    }}
                    className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#2166F3] font-bold rounded-lg border border-blue-200 shadow-xs hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <span>{m.suggestedAction}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isListening && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl text-xs flex items-center gap-2 animate-pulse">
              <Mic className="w-4 h-4 text-red-500" />
              <span>Listening to your voice in Mumbai English / Hindi / Marathi...</span>
            </div>
          )}
        </div>

        {/* Quick query chips */}
        <div className="p-2 px-4 bg-slate-50 border-t border-slate-200/70 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-slate-300 hover:text-slate-900 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 px-4 border-t border-slate-200 bg-white flex items-center gap-2">
          <button
            onClick={handleVoiceSim}
            title="Voice query in English, Hindi, or Marathi"
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Ask about weather, tide, crowd, safe routes..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2166F3] transition-colors"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-[#2166F3] text-white disabled:opacity-40 hover:bg-[#1b55cc] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
