'use client';
import { useState, useRef, useEffect } from 'react';
import type { T } from '@/lib/i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function formatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function ChatDrawer({ t }: { t: T }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content ?? 'Eroare la răspuns.';
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Eroare de conexiune.' }]);
    }
    setLoading(false);
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)}>
        <ion-icon name={open ? 'close-outline' : 'chatbubbles-outline'} />
      </button>

      <div className={`chat-window${open ? ' active' : ''}`}>
        <div className="chat-header">
          <h3><ion-icon name="sparkles-outline" /> {t.aiAssistant}</h3>
          <button className="close-chat" onClick={() => setOpen(false)}>
            <ion-icon name="close-outline" />
          </button>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="message ai">
              Bună! Sunt asistentul tău bancar Neters. Cu ce te pot ajuta? 💡
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${m.role === 'user' ? 'user' : 'ai'}`}
              dangerouslySetInnerHTML={{ __html: formatText(m.content) }}
            />
          ))}
          {loading && (
            <div className="message ai">
              <span className="loading-dots">●●●</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t.chatPlaceholder}
          />
          <button onClick={sendMessage} disabled={loading}>
            <ion-icon name="send-outline" />
          </button>
        </div>
      </div>
    </>
  );
}
