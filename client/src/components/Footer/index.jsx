import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { CiMicrophoneOn } from "react-icons/ci";
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { FaSquare } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "./style.css";
import "../styles/responsive.css";

import { useConversation } from "../../context";
import { v4 as uuidv4 } from "uuid";

const status = {
  initial: "Initial",
  loading: "Loading",
  success: "Success",
  failure: "Failure",
};

const Footer = () => {
  const {
    addMessage,
    apiStatus,
    updateApiStatus,
    context,
    setSenderText,
    language,
    template,
    conversation,
    displayTip,
  } = useConversation();
  const [activeBtn, setActiveBtn] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [preMsg, setPreMsg] = useState("");

  useEffect(() => updateApiStatus(status.initial), []);

  const sendApiRequest = async (event, msg = userMessage) => {
    setPreMsg(userMessage);
    if (event) event.preventDefault();
    if (apiStatus === status.loading) return;

    if (!msg.trim()) {
      toast.error("Please ask something!");
      return;
    }
    updateApiStatus(status.loading);
    setSenderText(msg);

    try {
      const { data } = await axios.post("http://localhost:5000", {
        userMessage: msg,
        context,
      });

      if (data.status) {
        const id = uuidv4();
        addMessage(msg, data.reply, id);
        setPreMsg(msg);
        setUserMessage("");
        updateApiStatus(status.success);
      } else {
        toast.error(data.error);
        updateApiStatus(status.failure);
      }
    } catch (error) {
      toast.error(error);
      updateApiStatus(status.failure);
    }
  };

  //text to speech
  //text to speech
  //text to speech
  //text to speech
  //text to speech
  //text to speech
  //text to speech
  const [speak, setSpeak] = useState(false);
  const synth = window.speechSynthesis;

  const speakAudio = async () => {
    const lastConversation = conversation.at(-1);

    if (!lastConversation) {
      toast.error("Please Ask Something!");
      setSpeak(false);
      setActiveBtn("");
      return;
    }
    const userText = lastConversation.assistant;
    const cleaned = userText;
    if (!cleaned) return;
    const utterance = new SpeechSynthesisUtterance(cleaned);

    utterance.lang = `${language}-IN`;
    utterance.volume = 1;
    utterance.rate = 1.2;
    utterance.pitch = 1;
    synth.speak(utterance);
    utterance.onend = () => {
      setSpeak(false);
    };
  };

  useEffect(() => {
    if (speak) {
      setActiveBtn("listen");
      speakAudio();
    } else {
      if (synth) {
        synth.cancel();
        setActiveBtn("");
      }
    }
  }, [speak]);

  //Speech to text converter
  //Speech to text converter
  //Speech to text converter
  //Speech to text converter
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [listeningToastId, setListeningToastId] = useState(null);
  const startListening = () => {
    setActiveBtn("ask");
    const id = toast.info("AI voice chat is in Progress...", {
      autoClose: false, // 👈 stays until clicked
      closeOnClick: true, // 👈 closes when clicked
      closeButton: false, // 👈 shows the close (X) button
      position: "top-right",
      draggable: false,
      pauseOnHover: true,
    });
    setListeningToastId(id);
    if (!browserSupportsSpeechRecognition) {
      return <span>Your browser does not support speech recognition.</span>;
    }
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: `${language}-IN`,
    });
  };
  const stopListening = () => {
    setActiveBtn("");
    SpeechRecognition.stopListening();
    sendApiRequest(event, transcript);
    setUserMessage(transcript);
    resetTranscript();
    if (listeningToastId) {
      toast.dismiss(listeningToastId);
      setListeningToastId(null);
    }
  };

  return (
    <footer style={{ display: displayTip ? "none" : "block" }}>
      <button
        type="button"
        style={{
          cursor: apiStatus === status.loading ? "progress" : "pointer",
        }}
        className="ask-btn"
        onClick={() => (listening ? stopListening() : startListening())}
        disabled={apiStatus === status.loading || activeBtn === "listen"}
      >
        {listening ? template.askBtnAlter : template.askBtn}
        {listening ? (
          <span
            style={{
              border: "2px solid #fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              padding: "3px",
            }}
          >
            <FaSquare className="icon" style={{ fontSize: "15px" }} />
          </span>
        ) : (
          <CiMicrophoneOn className="icon" />
        )}
      </button>
      <p>transcript:{transcript}</p>
      <textarea
        rows={3}
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            sendApiRequest(e, userMessage);
            setUserMessage("");
          }
        }}
        placeholder={
          preMsg.trim() !== "" ? preMsg + "..." : template.inputPlaceholder
        }
      />
      <button
        type="button"
        className="btn btn-send"
        style={{
          cursor: apiStatus === status.loading ? "progress" : "pointer",
        }}
        disabled={apiStatus === status.loading}
        onClick={(e) => sendApiRequest(e, userMessage)}
      >
        {template.sendBtn} <LuSendHorizontal className="icon send" />
      </button>
      <button
        type="button"
        style={{
          cursor: apiStatus === status.loading ? "progress" : "pointer",
        }}
        onClick={() => setSpeak(!speak)}
        disabled={apiStatus === status.loading || activeBtn === "ask"}
        className={speak ? "btn btn-listen" : "btn-listen"}
      >
        {speak ? template.askBtnAlter : template.listen}
        <MdOutlineRecordVoiceOver className="icon" />
      </button>
      <div className="mobile-width">
        <button
          type="button"
          style={{
            cursor: apiStatus === status.loading ? "progress" : "pointer",
            width: "max-content",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="ask-btn"
          onClick={() => (listening ? stopListening() : startListening())}
          disabled={apiStatus === status.loading || activeBtn === "listen"}
        >
          {listening ? template.askBtnAlter : template.askBtn}
          {listening ? (
            <span
              style={{
                border: "2px solid #fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                padding: "3px",
              }}
            >
              <FaSquare className="icon" style={{ fontSize: "15px" }} />
            </span>
          ) : (
            <CiMicrophoneOn className="icon" />
          )}
        </button>
        <button
          type="button"
          className="btn btn-send"
          style={{
            cursor: apiStatus === status.loading ? "progress" : "pointer",
          }}
          disabled={apiStatus === status.loading}
          onClick={(e) => sendApiRequest(e, userMessage)}
        >
          {template.sendBtn} <LuSendHorizontal className="icon send" />
        </button>
        <button
          type="button"
          style={{
            cursor: apiStatus === status.loading ? "progress" : "pointer",
          }}
          onClick={() => setSpeak(!speak)}
          disabled={apiStatus === status.loading || activeBtn === "ask"}
          className={speak ? "btn btn-listen" : "btn-listen"}
        >
          {speak ? template.askBtnAlter : template.listen}
          <MdOutlineRecordVoiceOver className="icon" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
