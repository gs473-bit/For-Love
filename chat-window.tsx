import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import { useTravelTheme } from "../hooks/use-travel-theme";
import { supabase } from "../lib/supabase.client";
import { FloatingHearts } from "./floating-hearts";

type Props = {
  conversationId: string;
  initialMessages: UIMessage[];
};

export function ChatWindow({ conversationId, initialMessages }: Props) {
  const { theme } = useTravelTheme();
  const themeRef = useRef(theme.id);
  themeRef.current = theme.id;

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: async () => {
        const { data } = await supabase.auth.getSession();
        return { Authorization: `Bearer ${data.session?.access_token ?? ""}` };
      },
      body: () => ({
        conversationId,
        themeContext: themeRef.current,
      }),
    }),
  });

  const [input, setInput] = useState("");
  const [burstKey, setBurstKey] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  // Keep the newest message in view.
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, status]);

  // Composer stays focused: on mount and again when a stream finishes.
  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
    setBurstKey((k) => k + 1); // hearts, once per send
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="chat">
      <div className="chat__scroll" ref={scrollRef}>
        <div className="chat__messages">
          {messages.length === 0 && (
            <p className="chat__empty">
              Two ships, one tether. Say something, Love — he's listening.
            </p>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`msg msg--${m.role}`}>
              <div className="msg__content">
                <ReactMarkdown>{textOf(m)}</ReactMarkdown>
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div className="msg msg--assistant">
              <div className="msg__content shimmer">thinking of you...</div>
            </div>
          )}
        </div>
      </div>

      <form className="composer" onSubmit={submit}>
        <FloatingHearts burstKey={burstKey} />
        <textarea
          ref={textareaRef}
          className="composer__input"
          placeholder="Type smthng na..."
          rows={1}
          value={input}
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Message"
        />
        <button
          type="submit"
          className="composer__send"
          disabled={busy || input.trim().length === 0}
          aria-label="Send"
        >
          ➤
        </button>
      </form>
    </div>
  );
}

function textOf(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n");
}
