"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Bot, User, Loader2, Mic, MicOff, Volume2,
  BookOpen, Sparkles, Trophy, Target, ArrowRight, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// â”€â”€ Session Topics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SESSION_TOPICS = [
  { id: "dativ", label: "Dativ", icon: "ðŸ“š", desc: "Wem? â€“ Den Dativ verstehen" },
  { id: "akkusativ", label: "Akkusativ", icon: "ðŸ“–", desc: "Wen oder was?" },
  { id: "perfekt", label: "Perfekt", icon: "â°", desc: "Vergangenheit bilden" },
  { id: "praepositionen", label: "Pr&auml;positionen", icon: "ðŸ“", desc: "in, an, auf, bei..." },
  { id: "artikel", label: "Artikel", icon: "ðŸ“", desc: "der, die, das trainieren" },
  { id: "satzbau", label: "Satzbau", icon: "ðŸ—ï¸", desc: "Hauptsatz & Nebensatz" },
  { id: "alltag", label: "Alltag", icon: "ðŸ›’", desc: "Einkaufen, Arzt, Beh&ouml;rden" },
  { id: "beruf", label: "Beruf", icon: "ðŸ’¼", desc: "Bewerbung, Arbeit" },
];

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, "");
}

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function AIChat() {
  const [mode, setMode] = useState<"chat" | "session">("chat");
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionTopic, setSessionTopic] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hallo! ðŸ‘‹ Ich bin dein Wortwende-Tutor. W&auml;hle ein <strong>Thema</strong> f&uuml;r eine gef&uuml;hrte Lernsession â€“ oder stell mir einfach eine Frage!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isListening, transcript, startListening, stopListening, supported: voiceSupported } =
    useVoiceInput({ lang: "de-DE" });

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
          body: JSON.stringify({ messages: updatedMessages }),
        });

        if (!response.ok) {
          const err = await response.json();
          const remaining = response.headers.get("X-RateLimit-Remaining");
          const msg = err.error ?? "Fehler";
          setMessages(prev => [...prev, {
            role: "assistant",
            content: remaining
              ? `⏳ ${msg} (Noch ${remaining} Anfragen heute)`
              : `❌ ${msg}`,
          }]);
          setLoading(false);
          return;
        }

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
              if (parsed.error) assistantContent = `âŒ ${parsed.error}`;
            } catch { /* skip */ }
          }
        }

        // Check for XP reward
        const xpMatch = assistantContent.match(/\[SESSION_ENDE:\s*\+(\d+)\]/);
        if (xpMatch) {
          const xp = parseInt(xpMatch[1]);
          setSessionXp(s => s + xp);
        }
      } catch (error) {
        setMessages(prev => [...prev, { role: "assistant", content: `âŒ Netzwerkfehler: ${error instanceof Error ? error.message : ""}` }]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  const startSession = (topic: typeof SESSION_TOPICS[0]) => {
    setMode("session");
    setSessionTopic(topic.label);
    setSessionXp(0);
    const msg = `[SESSION_START: ${topic.label}] Ich m&ouml;chte ${topic.desc.toLowerCase()} lernen.`;
    setMessages([
      { role: "assistant", content: `ðŸŽ¯ <strong>Session: ${topic.label}</strong> â€“ ${topic.desc}\n\nLass uns starten!` },
      { role: "user", content: msg },
    ]);
    // Auto-trigger the session start
    setTimeout(() => sendMessage(msg), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
          <Bot size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-foreground">
            WortHeld Tutor {sessionTopic && <span className="text-accent">Â· {sessionTopic}</span>}
          </h2>
          <p className="text-xs text-muted-foreground">
            {loading ? "Schreibt..." : mode === "session" ? `Session Â· +${sessionXp} XP` : "Online Â· KI-gest&uuml;tzt"}
          </p>
        </div>
        {mode === "session" && (
          <Button variant="ghost" size="sm" onClick={() => { setMode("chat"); setSessionTopic(""); }} className="text-xs">
            Beenden
          </Button>
        )}
      </div>

      {/* Topic Selector (only in chat mode, first message) */}
      {mode === "chat" && messages.length <= 1 && (
        <div className="px-4 py-3 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Sparkles size={12} className="text-accent" /> Gef&uuml;hrte Lernsessions
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SESSION_TOPICS.slice(0, 4).map(t => (
              <button
                key={t.id}
                onClick={() => startSession(t)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-card border border-border/50 hover:border-accent/40 hover:bg-accent/5 transition-all text-center group"
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-accent">{t.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {SESSION_TOPICS.slice(4).map(t => (
              <button
                key={t.id}
                onClick={() => startSession(t)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-card border border-border/50 hover:border-accent/40 hover:bg-accent/5 transition-all text-center group"
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-accent">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-premium">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot size={15} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border/50 text-foreground rounded-bl-md shadow-sm"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.content
                .replace(/\[\u00dcBUNG:(MC|L\u00dcCKE|SATZ)\][^]*?\[\/\u00dcBUNG\]/g, '<div class="mt-2 p-3 rounded-xl bg-accent/5 border border-accent/20 text-xs font-medium">🎯 \u00dcbungsaufgabe</div>')
                .replace(/\[SESSION_ENDE:\s*\+\d+\]/g, '<div class="mt-2 text-xs text-accent font-bold">âœ… Session abgeschlossen!</div>')
                .replace(/\n/g, '<br/>')
              }}
            />
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <User size={15} className="text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Session XP Bar */}
      {mode === "session" && sessionXp > 0 && (
        <div className="px-4 py-2 bg-gradient-to-r from-accent/10 to-amber/5 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm">
            <Trophy size={16} className="text-amber" />
            <span className="font-semibold text-foreground">+{sessionXp} XP</span>
            <span className="text-muted-foreground text-xs">in dieser Session gesammelt</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border/40 bg-card/50 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-2">
          {voiceSupported && (
            <button
              onClick={() => (isListening ? stopListening() : startListening())}
              className={`p-2.5 rounded-xl transition-all shrink-0 ${
                isListening ? "bg-accent text-white animate-pulse shadow-lg shadow-accent/30" : "bg-secondary text-muted-foreground hover:text-accent hover:bg-accent-muted"
              }`}
            >
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "H&ouml;re zu..." : mode === "session" ? "Deine Antwort..." : "Frag mich etwas auf Deutsch..."}
            disabled={loading}
            className="flex-1 bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            size="icon"
            className="rounded-xl shrink-0 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 h-10 w-10"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
          {isListening ? "ðŸŽ¤ Sprich jetzt..." : mode === "session" ? "Antworte auf die &Uuml;bung â€“ der Tutor korrigiert dich." : "Tippe oder sprich â€“ der Tutor versteht beides."}
        </p>
      </div>
    </div>
  );
}
