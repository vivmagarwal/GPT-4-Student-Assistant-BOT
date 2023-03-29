import "./styles.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content:
        "You are a tutor that always responds in the Socratic style. You never give the student the answer, but always try to ask just the right question to help them learn to think for themselves. You should always tune your question to the interst & knowledge of the student, breaking down the problem into simpler parts until it's at just the right level for them.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const chatHistoryRef = useRef(null);

  const sendMessage = async (message) => {
    const newMessage = { role: "user", content: message };
    const newChatHistory = [...chatHistory, newMessage];

    setChatHistory(newChatHistory);
    setLoading(true);
    setError(null);

    try {

      // comment this out
      const response = await axios.post(
        `https://fair-cyan-indri-robe.cyclic.app/openai-chat`,
        {
          model: "gpt-3.5-turbo",
          messages: newChatHistory,
        }
      );    

      // un-comment it.
      // const response = await axios.post(
      //   "https://api.openai.com/v1/chat/completions",
      //   {
      //     model: "gpt-3.5-turbo",
      //     messages: newChatHistory,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
      //     },
      //   }
      // );

      console.log(response);
      setLoading(false);

      const chatbotMessage = response.data.choices[0].message.content;

      const updatedChatHistory = [
        ...newChatHistory,
        { role: "assistant", content: chatbotMessage },
      ];

      setChatHistory(updatedChatHistory);
      setInputValue("");
      inputRef.current.focus();
    } catch (error) {
      setLoading(false);
      setError("Oops! Something went wrong. Please try again later.");
      console.error(error);
    }
  };

  useEffect(() => {
    // scroll chat history to the bottom on every update
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    inputRef.current.focus();
  }, [chatHistory]);

  return (
    <div className="chatbot">
      <h2>Masaischool AI Tutor (24x7 Available) </h2>
      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.map((message, index) => (
          <code key={index}  className={`message-${message.role}`} >
            <pre>
              {message.content}
            </pre>
          </code>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          rows='3'
          placeholder="Type your message here"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage(inputValue);
            }
          }}
          disabled={loading}
          ref={inputRef}
        />
        {error && <div className="error">{error}</div>}
      </div>

      {loading && (
        <div className="loading-animation">
          <div className="ball"></div>
          <div className="ball"></div>
          <div className="ball"></div>
        </div>
      )}
    </div>
  );
};


export default function App() {
  return (
    <div className="App">
      <Chatbot />
    </div>
  );
}
