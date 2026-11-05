/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  RefreshCw,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC = () => {
  const { language, activeReport } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [chatLanguage, setChatLanguage] = useState<'hi' | 'en' | 'mr'>('hi');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeMessages: Record<'en' | 'hi' | 'mr', string> = {
    hi: `नमस्ते! मैं आपका **Med-Decoder AI स्वास्थ्य मित्र (Powered by Google Gemini)** हूँ। 🩺\n\nआप मुझसे ब्लड टेस्ट (CBC, हीमोग्लोबिन, कोलेस्ट्रॉल, शुगर), बीपी, सिरदर्द, पेट दर्द, बुखार, खान-पान या डॉक्टर के पर्चे (OD, BD, SOS) से जुड़ा **कोई भी सवाल** पूछ सकते हैं!`,
    en: `Hello! I am your **Med-Decoder AI Health Guide (Powered by Google Gemini)**. 🩺\n\nYou can ask me **anything** about your blood tests, symptoms (fever, BP, headache, stomach discomfort), dietary tips, or doctor prescription instructions!`,
    mr: `नमस्कार! मी आपला **Med-Decoder AI आरोग्य सहाय्यक (Powered by Google Gemini)** आहे. 🩺\n\nआपण आपल्या रक्त तपासणी, लक्षणे (ताप, डोकेदुखी, रक्तदाब), औषधांच्या वेळा किंवा आहाराबद्दल **कोणताही प्रश्न** विचारू शकता!`,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: initialWelcomeMessages[chatLanguage],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update welcome message when chat language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: initialWelcomeMessages[chatLanguage],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [chatLanguage]);

  const quickPrompts = [
    { label: '🩸 हीमोग्लोबिन और प्लेटलेट्स कैसे बढ़ाएं?', lang: 'hi' as const },
    { label: '💊 पर्चे में OD, BD, SOS का क्या मतलब है?', lang: 'hi' as const },
    { label: '🩺 सिरदर्द और हाई बीपी के क्या कारण हैं?', lang: 'hi' as const },
    { label: '🥗 डायबिटीज और कोलेस्ट्रॉल में क्या खाएं?', lang: 'hi' as const },
    { label: '🌡️ बुखार और कमजोरी में घरेलू देखभाल?', lang: 'hi' as const },
  ];

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: chatLanguage,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          context: activeReport ? {
            title: activeReport.reportTitle,
            category: activeReport.testCategory,
            status: activeReport.status,
            patient: `${activeReport.patientName} (${activeReport.patientAge}y)`,
          } : undefined,
        }),
      });

      const data = await response.json();
      let rawText = typeof data.reply === 'string' ? data.reply : '';

      // Check if response contains 503, raw json, or error payload
      const isRawError =
        !rawText ||
        rawText.includes('503') ||
        rawText.includes('UNAVAILABLE') ||
        rawText.includes('"error"') ||
        rawText.trim().startsWith('{') ||
        Boolean(data.error);

      let replyText = rawText;
      if (isRawError) {
        replyText =
          chatLanguage === 'hi'
            ? 'सर्वर पर अभी भारी ट्रैफिक है। सामान्यतः लैब रिपोर्ट में दिए गए संदर्भ मान (Reference Range) स्वास्थ्य की स्थिति दर्शाते हैं। यदि कोई मान असामान्य है तो घबराएं नहीं और अपने डॉक्टर से परामर्श अवश्य लें।'
            : chatLanguage === 'mr'
            ? 'सर्व्हरवर सध्या जास्त ट्रॅफिक आहे. आपल्या रिपोर्टमधील सर्व चाचण्या सामान्य मर्यादेत ठेवण्यासाठी डॉक्टरांचा सल्ला नक्की घ्यावा.'
            : 'The AI cloud service is experiencing temporary peak traffic. Lab reference ranges indicate standard health baselines. Always consult your doctor for personalized advice.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'सर्वर से कनेक्ट करने में परेशानी हुई। कृपया कुछ समय बाद पुनः प्रयास करें।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeech = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = chatLanguage === 'hi' ? 'hi-IN' : chatLanguage === 'mr' ? 'mr-IN' : 'en-US';
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#123B66] via-[#1a4a7d] to-[#2563EB] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          aria-label="Open AI Medical Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-teal-300" />
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1.5 -right-1.5 animate-bounce" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            Ask AI Assistant · स्वास्थ्य मित्र
          </span>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#123B66] to-[#2563EB] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-teal-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">Med-Decoder AI Assistant</h3>
                <p className="text-[11px] text-teal-200 flex items-center gap-1">
                  <span>स्वास्थ्य मित्र</span>
                  <span>·</span>
                  <span>Gemini 3.8 Flash</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector in Header */}
              <select
                value={chatLanguage}
                onChange={(e) => setChatLanguage(e.target.value as any)}
                className="text-[11px] font-semibold bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white outline-none cursor-pointer"
              >
                <option value="hi" className="text-slate-900 bg-white">हिंदी</option>
                <option value="en" className="text-slate-900 bg-white">English</option>
                <option value="mr" className="text-slate-900 bg-white">मराठी</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  if (speakingId) window.speechSynthesis?.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setChatLanguage(p.lang);
                  handleSendMessage(p.label);
                }}
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-[#123B66] border border-slate-200 hover:border-blue-200 rounded-full whitespace-nowrap transition-colors shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/40">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#123B66] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-[#2563EB]" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-1`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isAssistant
                          ? 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs'
                          : 'bg-[#123B66] text-white shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {isAssistant && 'speechSynthesis' in window && (
                        <button
                          type="button"
                          onClick={() => handleSpeech(msg.text, msg.id)}
                          className="hover:text-slate-700 p-0.5 inline-flex items-center gap-1 cursor-pointer"
                          title="Read aloud"
                        >
                          {speakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3 text-teal-600" />
                              <span className="text-teal-600 font-semibold">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-[#123B66] text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-2 rounded-2xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-300" />
                  <span className="text-[11px] text-slate-500 ml-1">Typing clinical guidance...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Safety Notice */}
          <div className="px-4 py-1.5 bg-amber-50/70 border-t border-amber-100 flex items-center gap-1.5 text-[10px] text-amber-900">
            <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Educational AI guide only. Does not replace professional clinical diagnosis.</span>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                chatLanguage === 'hi'
                  ? 'अपनी रिपोर्ट या दवा के बारे में पूछें...'
                  : chatLanguage === 'mr'
                  ? 'आपल्या रिपोर्टबद्दल विचारा...'
                  : 'Ask about a lab parameter or dosage...'
              }
              className="flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 rounded-xl bg-[#123B66] hover:bg-[#1a4a7d] text-white disabled:opacity-50 transition-all cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
