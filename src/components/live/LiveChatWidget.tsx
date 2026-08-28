import { useEffect, useRef, useState, type FormEvent } from "react";
import { io, type Socket } from "socket.io-client";
import { env } from "@/lib/env";
import { getStoredChatDisplayName, storeChatDisplayName } from "@/lib/chatIdentity";

/**
 * Anonymous live chat (ADR-0004), ported from the widget cwsi-BistroRestaurant
 * already runs in production. English copy and this site's design system; the
 * protocol is untouched.
 *
 * ⚠️ This is a COPY, not a shared package — a fix upstream does not reach here.
 * The protocol it speaks (auth payload, event names, rejection codes) is owned
 * by CWSB-Baytrax; if that changes, this file has to follow.
 *
 * No login: the visitor picks a display name, the API mints a short-lived guest
 * token with every Mux Live poll, and the socket authenticates with the latest
 * one.
 */

interface ChatMessage {
  id: string;
  displayName: string;
  body: string;
  createdAt: string;
}

type RejectionCode = "slow_mode" | "rate_limited" | "message_rejected" | "invalid";

const REJECTION_TEXT: Record<RejectionCode, string> = {
  slow_mode: "Slow mode is on — wait a few seconds before sending again.",
  rate_limited: "You’re sending messages too quickly. Give it a moment.",
  message_rejected: "That message couldn’t be sent.",
  invalid: "The message couldn’t be sent.",
};

export function LiveChatWidget({
  chat,
}: {
  chat: { token: string; expiresIn: number } | null;
}) {
  const [displayName, setDisplayName] = useState(() => getStoredChatDisplayName());
  const [nameInput, setNameInput] = useState("");
  const [chatAvailable, setChatAvailable] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);

  const chatTokenRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Runs on every poll (~10s) and does no socket work. A fresh guest token is
  // minted each time, so only the latest is kept for a future reconnect — the
  // socket is never torn down just because the token changed.
  useEffect(() => {
    chatTokenRef.current = chat?.token ?? null;
    if (chat?.token && !chatAvailable) setChatAvailable(true);
  }, [chat, chatAvailable]);

  // Connects exactly once, when a display name and a first token both exist.
  // `chatAvailable` only ever flips false→true, so this never re-runs.
  useEffect(() => {
    if (!displayName || !chatAvailable || socketRef.current) return;

    const socket = io(env.API_URL.replace(/\/$/, ""), {
      path: "/chat/socket.io",
      transports: ["websocket"],
      auth: (cb) => cb({ token: chatTokenRef.current, displayName }),
    });
    socketRef.current = socket;

    socket.on("chat:history", (history: ChatMessage[]) => setMessages(history));
    socket.on("chat:message", (message: ChatMessage) =>
      setMessages((prev) => [...prev, message]),
    );
    socket.on("chat:room_closed", () => {
      setClosed(true);
      setStatusNote("The broadcast ended and the chat is closed.");
    });
    socket.on("chat:banned", () => {
      setClosed(true);
      setStatusNote("You can no longer post in this chat.");
    });
    socket.on("connect_error", () => setStatusNote("Could not connect to the chat."));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [displayName, chatAvailable]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  function submitName(event: FormEvent) {
    event.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    storeChatDisplayName(trimmed);
    setDisplayName(trimmed);
  }

  function submitMessage(event: FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !socketRef.current) return;
    socketRef.current.emit(
      "chat:message",
      { body },
      (ok: boolean, info?: { code: RejectionCode }) => {
        setStatusNote(ok ? null : (info?.code ? REJECTION_TEXT[info.code] : REJECTION_TEXT.invalid));
      },
    );
    setDraft("");
  }

  // No token means the broadcast is not live: there is no room to join.
  if (!chat) return null;

  return (
    <aside className="live-chat" aria-label="Live chat">
      <p className="eyebrow">Live chat</p>

      {!displayName ? (
        <form className="live-chat__join" onSubmit={submitName}>
          <label>
            <span className="sr-only">Your name in the chat</span>
            <input
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Your name"
              maxLength={60}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Join the chat
          </button>
          <p className="live-chat__note">
            No account needed. Your name is stored on this device only.
          </p>
        </form>
      ) : (
        <>
          <div className="live-chat__messages" ref={listRef}>
            {messages.length === 0 ? (
              <p className="live-chat__empty">Be the first to say something…</p>
            ) : (
              messages.map((message) => (
                <p className="live-chat__message" key={message.id}>
                  <b>{message.displayName}</b>
                  <span>{message.body}</span>
                </p>
              ))
            )}
          </div>

          {statusNote ? <p className="live-chat__status">{statusNote}</p> : null}

          {!closed ? (
            <form className="live-chat__send" onSubmit={submitMessage}>
              <label>
                <span className="sr-only">Your message</span>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message…"
                  maxLength={500}
                />
              </label>
              <button className="btn btn-primary" type="submit">
                Send
              </button>
            </form>
          ) : null}
        </>
      )}
    </aside>
  );
}
