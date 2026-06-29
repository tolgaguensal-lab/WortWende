"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send, Bot, User, Loader2, Mic, MicOff,
  BookOpen, Sparkles, Trophy, Smile, Gauge, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { CorrectionCard } from "@/components/ai/CorrectionCard";
import { UpgradePrompt } from "@/components/ai/UpgradePrompt";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PERSONALITIES = [
  { id: "streng", label: "Streng", icon: Gauge, desc: "Direkte Korrektur, Genauigkeit", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200" },
  { id: "locker", label: "Locker", icon: Smile, desc: "Ermutigend, Fehler sind ok", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200" },
  { id: "lustig", label: "Lustig", icon: Flame, desc: "Humorvoll, mit Emojis", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200" },
] as const;

type Personality = (typeof PERSONALITIES)[number]["id"];

const SESSION_TOPICS = [
  { id: "dativ", label: "Dativ", icon: "📋", desc: "Wem? – Den Dativ verstehen" },
  { id: "akkusativ", label: "Akkusativ", icon: "📌", desc: "Wen oder was?" },
  { id: "perfekt", label: "Perfekt", icon: "⏰", desc: "Vergangenheit bilden" },
  { id: "praepositionen", label: "Präpositionen", icon: "📍", desc: "in, an, auf, bei..." },
  { id: "artikel", label: "Artikel", icon: "📝", desc: "der, die, das trainieren" },
  { id: "satzbau", label: "Satzbau", icon: "🏗️", desc: "Hauptsatz & Nebensatz" },
  { id: "alltag", label: "Alltag", icon: "🛒", desc: "Einkaufen, Arzt, Behörden" },
  { id: "beruf", label: "Beruf", icon: "💼", desc: "Bewerbung, Arbeit" },
  { id: "rollenspiel", label: "Rollenspiel", icon: "🎭", desc: "Echte Situationen üben" },
];

function speakText(text: string, lang = "de-DE") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const germanVoice = voices.find(v => v.lang.startsWith("de"));
  if (germanVoice) utterance.voice = germanVoice;
  window.speechSynthesis.speak(utterance);
}

function extractCorrections(content: string) {
  const regex = /\[KORREKTUR:([^|]+)\|([^|]+)\|([^\]]*)\]/g;
  const corrections: { original: string; corrected: string; explanation: string }[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    corrections.push({ original: match[1], corrected: match[2], explanation: match[3] || "" });
  }
  return corrections;
}

function renderContent(content: string): React.ReactNode {
  // Remove KORREKTUR markers (rendered separately as CorrectionCard)
  const cleaned = content.replace(/\[KORREKTUR:[^\]]+\]/g, "");
  // Split by newlines and render with <br/>
  const lines = cleaned.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

export function AIChat() {
  const [mode, setMode] = useState<"chat" | "session">("chat");
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionTopic, setSessionTopic] = useState("");
  const [personality, setPersonality] = useState<Personality>("locker");
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
      content: "Hallo! Ich bin Leo, dein persönlicher Deutsch-Tutor. Wähle ein Thema für eine Lernsession oder stell mir eine Frage! Ich helfe dir, Deutsch wirklich zu verstehen.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const { isListening, transcript, startListening, stopListening, supported: voiceSupported } =
    useVoiceInput({ lang: "de-DE" });

  const [sessionsRemaining, setSessionsRemaining] = useState(10);
  const [maxSessions, setMaxSessions] = useState(10);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = (text ?? input).trim();
      if (!messageText || loading) return;

      const userMessage: Message = { role: "user", content: messageText };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const response = await fetch("/api/tutor/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages, personality, mode }),
        });

        const remainingHeader = response.headers.get("X-RateLimit-Remaining");
        const limitHeader = response.headers.get("X-RateLimit-Limit");

        if (remainingHeader) setSessionsRemaining(parseInt(remainingHeader));
        if (limitHeader) setMaxSessions(parseInt(limitHeader));

        if (!response.ok) {
          const err = await response.json();
          if (response.status === 429) {
            setRateLimited(true);
            setLoading(false);
            return;
          }
          const msg = err.error ?? "Fehler";
          setMessages(prev => [...prev, {
            role: "assistant",
            content: remainingHeader ? `⏳ ${msg} (Noch ${remainingHeader} Anfragen heute)` : `❌ ${msg}`,
          }]);
          setLoading(false);
          return;
        }

        setRateLimited(false);

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No stream");
        const decoder = new TextDecoder("utf-8");
        let assistantContent = "";
        setMessages(prev => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => { const copy = [...prev]; copy[copy.length - 1] = { role: "assistant", content: assistantContent }; return copy; });
              }
              if (parsed.toolResult) {
                const tr = parsed.toolResult;
                setMessages(prev => [...prev, { role: "assistant", content: `<div class="text-xs text-muted-foreground italic mt-1">🔧 ${tr.message}</div>` }]);
              }
              if (parsed.error) assistantContent = `❌ ${parsed.error}`;
            } catch { /* skip */ }
          }
        }

        const xpMatch = assistantContent.match(/\[SESSION_ENDE:\s*\+(\d+)\]/);
        if (xpMatch) setSessionXp(s => s + parseInt(xpMatch[1]));
      } catch (error) {
        setMessages(prev => [...prev, { role: "assistant", content: `❌ Netzwerkfehler: ${error instanceof Error ? error.message : ""}` }]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, personality, mode]
  );

  const startSession = (topic: typeof SESSION_TOPICS[0]) => {
    setMode("session");
    setSessionTopic(topic.label);
    setSessionXp(0);
    const msg = `[SESSION_START: ${topic.label}] Ich möchte ${topic.desc.toLowerCase()} lernen.`;
    setMessages([
      { role: "assistant", content: `🎯 <strong>Session: ${topic.label}</strong> – ${topic.desc}\n\nLass uns starten!` },
      { role: "user", content: msg },
    ]);
    setTimeout(() => sendMessage(msg), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const sessionsToLevel: Record<number, string> = { 10: "A1", 100: "A2", 200: "B1", 300: "B2", 500: "C1" };
  const currentLevel = sessionsToLevel[maxSessions] ?? "A1";
  const sessionsUsed = maxSessions - sessionsRemaining;
  const showLowWarning = sessionsRemaining <= 2 && sessionsRemaining > 0 && !rateLimited;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
          <Bot size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-foreground">
            Wortwende Tutor <span className="text-accent font-medium">Leo</span>
            {sessionTopic && <span className="text-accent"> · {sessionTopic}</span>}
          </h2>
          <p className="text-xs text-muted-foreground">
            {loading ? "Schreibt..." : mode === "session" ? `Session · +${sessionXp} XP` : `Online · ${PERSONALITIES.find(p => p.id === personality)?.label}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            showLowWarning ? "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" : "bg-secondary text-muted-foreground"
          }`}>
            <Flame size={12} className={showLowWarning ? "text-amber-500" : "text-muted-foreground"} />
            <span>{sessionsRemaining}/{maxSessions}</span>
          </div>
          {mode === "session" && (
            <Button variant="ghost" size="sm" onClick={() => { setMode("chat"); setSessionTopic(""); }} className="text-xs">Beenden</Button>
          )}
        </div>
      </div>

      {/* Rate Limit / Upgrade Banners */}
      {rateLimited && (
        <div className="px-4 pt-3">
          <UpgradePrompt
            currentLevel={currentLevel}
            sessionsRemaining={sessionsRemaining}
            onClose={() => setRateLimited(false)}
          />
        </div>
      )}
      {showLowWarning && (
        <div className="px-4 pt-2">
          <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg px-3 py-2 flex items-center gap-2">
            <Flame size={12} />
            Noch {sessionsRemaining} {sessionsRemaining === 1 ? "Session" : "Sessions"} heute – <Link href="/pricing" className="underline font-medium">Upgrade?</Link>
          </div>
        </div>
      )}

      {/* Personality + Topics (chat mode, first message) */}
      {mode === "chat" && messages.length <= 1 && (
        <div className="px-4 py-3 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5 space-y-3" suppressHydrationWarning>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Smile size={12} className="text-accent" /> Tutor-Stil
            </p>
            <div className="flex gap-1.5">
              {PERSONALITIES.map(p => {
                const active = personality === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPersonality(p.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      active ? `${p.bg} ${p.border} ${p.color}` : "bg-card border-border/50 text-muted-foreground hover:border-accent/30"
                    }`}
                  >
                    <p.icon size={12} /> {p.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Sparkles size={12} className="text-accent" /> Geführte Lernsessions
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SESSION_TOPICS.map(t => (
                <button
                  key={t.id}
                  onClick={() => startSession(t)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all text-center group ${
                    t.id === "rollenspiel" ? "bg-accent/10 border-accent/30 hover:bg-accent/20" : "bg-card border-border/50 hover:border-accent/40 hover:bg-accent/5"
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className={`text-xs font-semibold ${t.id === "rollenspiel" ? "text-accent" : "text-foreground"} group-hover:text-accent`}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-premium">
        {messages.map((msg, i) => {
          const corrections = extractCorrections(msg.content);
          const displayContent = renderContent(msg.content);
          return (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot size={15} className="text-white" />
                </div>
              )}
              <div className="max-w-[85%]">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border/50 text-foreground rounded-bl-md shadow-sm"
                  }`}
                >
                  {displayContent}
                </div>
                {corrections.map((c, ci) => (
                  <CorrectionCard key={ci} original={c.original} corrected={c.corrected} explanation={c.explanation} />
                ))}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <User size={15} className="text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* XP Bar */}
      {mode === "session" && sessionXp > 0 && (
        <div className="px-4 py-2 bg-gradient-to-r from-accent/10 to-amber/5 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm">
            <Trophy size={16} className="text-amber-500" />
            <span className="font-semibold text-foreground">+{sessionXp} XP</span>
            <span className="text-muted-foreground text-xs">in dieser Session gesammelt</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border/40 bg-card/50 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-2">
          {mounted && voiceSupported && (
            <button onClick={() => (isListening ? stopListening() : startListening())}
              className={`p-2.5 rounded-xl transition-all shrink-0 ${isListening ? "bg-accent text-white animate-pulse shadow-lg shadow-accent/30" : "bg-secondary text-muted-foreground hover:text-accent"}`}>
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
          )}
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Höre zu..." : mode === "session" ? "Deine Antwort..." : "Frag mich etwas auf Deutsch..."}
            disabled={loading || rateLimited}
            className="flex-1 bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
          />
          <Button onClick={() => sendMessage()} disabled={!input.trim() || loading || rateLimited} size="icon"
            className="rounded-xl shrink-0 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 h-10 w-10">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
          {isListening ? "🎤 Sprich jetzt..." : mode === "session" ? "Antworte auf die Übung – der Tutor korrigiert dich." : "Tippe oder sprich – der Tutor versteht beides."}
        </p>
      </div>
    </div>
  );
}
