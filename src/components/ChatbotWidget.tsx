// src/components/ChatbotWidget.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Send,
  X,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { API_BASE_URL, STORAGE_KEYS } from "../config";

type Role = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

const SUGGESTIONS: string[] = [
  "Tháng này chi tiêu bao nhiêu",
  "Tháng này thu nhập bao nhiêu",
  "Tháng này chi bao nhiêu cho danh mục 'Ăn uống'",
  "Top 3 giao dịch chi tiêu lớn nhất tháng này",
];

// Gọi API chatbot – khớp với backend của bạn
async function sendChatbotMessage(question: string): Promise<string> {
  const token =
    sessionStorage.getItem(STORAGE_KEYS.token) ||
    localStorage.getItem(STORAGE_KEYS.token);

  const res = await fetch(`${API_BASE_URL}/api/chatbot/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // 👇 backend cần "message", không phải "question"
    body: JSON.stringify({ message: question }),
  });

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Chatbot raw response:", text);
    throw new Error(
      text || "Máy chủ trả về dữ liệu không hợp lệ. Vui lòng thử lại sau."
    );
  }

  const json = await res.json();

  if (res.status === 401 || res.status === 403) {
    throw new Error("AUTH");
  }

  if (!res.ok || json.status === "error") {
    throw new Error(json.message || "Có lỗi xảy ra khi gọi chatbot.");
  }

  // 👇 backend trả "data.reply"
  const answer =
    json.data?.reply ??
    json.reply ??
    "Mình chưa nhận được câu trả lời nào từ máy chủ.";

  return String(answer);
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Chào bạn! Mình là trợ lý tài chính của BudgetF. Hãy hỏi mình về chi tiêu, ví, danh mục… nhé 💸",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  function addMessage(role: Role, content: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        content,
      },
    ]);
  }

  async function handleSend(text?: string) {
    const question = (text ?? input).trim();
    if (!question || isSending) return;

    setInput("");
    addMessage("user", question);

    setIsSending(true);
    try {
      const answer = await sendChatbotMessage(question);
      addMessage("assistant", answer);
    } catch (err: any) {
      if (err?.message === "AUTH") {
        addMessage(
          "assistant",
          "Bạn cần đăng nhập trước khi dùng chatbot. Vui lòng đăng nhập lại rồi thử lại nhé."
        );
      } else {
        addMessage(
          "assistant",
          err?.message ||
            "Có lỗi xảy ra khi gọi chatbot. Vui lòng thử lại sau ít phút."
        );
      }
    } finally {
      setIsSending(false);
    }
  }

  function handleSuggestionClick(suggestion: string) {
    handleSend(suggestion);
  }

  return (
    <>
      {/* PANEL – cố định góc dưới bên phải, z-index rất cao */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: "24px",
            bottom: "96px",
            width: "380px",
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: "1.5rem",
            backgroundColor: "var(--card)",
            color: "var(--card-foreground)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
            border: "1px solid var(--border)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background:
                "linear-gradient(to right, #49a778ff, #0c5d2cff, #0f533cff)",
              color: "#fff",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(0, 191, 102, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                BF
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  BudgetF Chatbot
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    opacity: 0.8,
                  }}
                >
                  Hỏi nhanh về chi tiêu, ví, danh mục…
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.3)",
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Đóng chatbot"
            >
              <X size={14} />
            </button>
          </div>

          {/* SUGGESTIONS – UI cũ, 4 pill / 4 hàng + mũi tên thu gọn */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-800/70 bg-black/20 rounded-b-2xl">
            {/* Hàng tiêu đề: Bạn có thể hỏi + nút mũi tên */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Bạn có thể hỏi:</span>
              </div>

              <button
                type="button"
                onClick={() => setShowSuggestions((prev) => !prev)}
                className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-700 bg-gray-900/80 text-gray-200 hover:bg-gray-800 hover:border-gray-500 transition-colors"
                aria-label={showSuggestions ? "Thu gọn gợi ý" : "Mở gợi ý"}
              >
                {showSuggestions ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* 4 gợi ý – chỉ render khi showSuggestions = true */}
            {showSuggestions && (
              <div className="mt-3 space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "1rem",
                      padding: "0.45rem 0.75rem",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      backgroundColor: "#000000ff", // đen giống button
                      color: "#ffffff",
                      boxShadow: "0 1px 3px rgba(15,23,42,0.35)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MESSAGES – nền trắng ngà, bubble đen, có scrollbar */}
          <div
            className="bf-chat-scroll"
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              backgroundColor: "var(--background)", // trắng ngà
              overflowY: "auto",
            }}
          >
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      borderRadius: "1rem",
                      padding: "0.45rem 0.75rem",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      backgroundColor: isUser
                        ? "var(--primary)"
                        : "var(--card)",
                      color: isUser
                        ? "var(--primary-foreground)"
                        : "var(--card-foreground)",
                      boxShadow: "0 1px 3px rgba(15,23,42,0.35)",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            {isSending && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    borderRadius: "1rem",
                    padding: "0.45rem 0.75rem",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    backgroundColor: "var(--card)",
                    color: "var(--card-foreground)",
                    boxShadow: "0 1px 3px rgba(15,23,42,0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  {/* <span
                    style={{
                      fontSize: "0.7rem",
                      color: "#9ca3af",
                    }}
                  >
                    Đang suy nghĩ
                  </span> */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.2rem",
                    }}
                  >
                    <span className="bf-typing-dot" />
                    <span className="bf-typing-dot bf-typing-dot-2" />
                    <span className="bf-typing-dot bf-typing-dot-3" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "0.75rem 1rem",
              borderTop: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                height: "2.5rem",
                borderRadius: "9999px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--input-background)",
                color: "var(--foreground)",
                padding: "0 0.75rem",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              style={{
                height: "2.5rem",
                padding: "0 1rem",
                borderRadius: "9999px",
                border: "none",
                background:
                  "linear-gradient(to right, #49a778ff, #0c5d2cff, #0f533cff)",
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                opacity: !input.trim() || isSending ? 0.5 : 1,
                cursor: !input.trim() || isSending ? "not-allowed" : "pointer",
              }}
            >
              <span>Gửi</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* NÚT FLOATING */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: 9999,
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.3)",
            background:
              "linear-gradient(to top right, #7c3aed, #3fbb92ff, #3b82f6)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.45)",
            cursor: "pointer",
          }}
          aria-label="Mở chatbot BudgetF"
        >
          <MessageCircle size={26} />
        </button>
      )}
    </>
  );
}
