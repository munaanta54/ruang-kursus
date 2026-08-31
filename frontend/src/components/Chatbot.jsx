import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

const API_URL = "http://127.0.0.1:8000/api/chat/";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        "Halo! Saya RuangKursus AI 👋\n\n" +
        "Silakan tanyakan informasi kursus, pendaftaran, pembayaran, atau jam operasional."
    }
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text
      }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: text
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Gagal menghubungi chatbot."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer
        }
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "Maaf, chatbot tidak dapat terhubung ke server."
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="rk-chatbot">

      {open && (
        <div className="rk-chat-window">

          <div className="rk-chat-header">
            <strong>RuangKursus AI</strong>

            <button
              type="button"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="rk-chat-body">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`rk-chat-row ${item.role}`}
              >
                <div
                  className={`rk-chat-message ${item.role}`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="rk-chat-row bot">
                <div className="rk-chat-message bot">
                  Sedang mengetik...
                </div>
              </div>
            )}

            <div ref={endRef} />

          </div>

          <div className="rk-chat-input-area">

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan sesuatu..."
            />

            <button
              type="button"
              className="rk-send-button"
              onClick={sendMessage}
              disabled={loading || !message.trim()}
            >
              Kirim
            </button>

          </div>

        </div>
      )}

      <button
        type="button"
        className="rk-chat-floating-button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
      >
        {open ? "×" : "💬"}
      </button>

    </div>
  );
}

export default Chatbot;