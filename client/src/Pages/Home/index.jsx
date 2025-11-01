import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThreeDots } from "react-loader-spinner";
import { useEffect, useState, useRef } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { toast } from "react-toastify";

import { FiMessageSquare } from "react-icons/fi";
import { IoBulbOutline, IoSparkles } from "react-icons/io5";
import "./style.css";
import "../../components/styles/responsive.css";

import { useConversation } from "../../context";
import axios from "axios";
const status = {
  loading: "Loading",
  initial: "intital",
};
const Home = () => {
  const { apiStatus, conversation, template, displayTip } = useConversation();

  const [tip, setTip] = useState("");
  const [tipStatus, setTipStatus] = useState(status.initial);
  const [leftWidth, setLeftWidth] = useState(60);

  const bottomRef = useRef(null);

  const handleDrag = (e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  };

  const stopDrag = () => {
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDrag);
  };

  const startDrag = () => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDrag);
  };
  const getConversations = (item) => (
    <div key={item.id} className="conversation">
      <p className="userinput">{item.user}</p>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        style={{ wordBreak: "break-word" }}
      >
        {item.assistant}
      </ReactMarkdown>
    </div>
  );

  useEffect(() => {
    if (conversation.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const generateTip = async (event) => {
    event.preventDefault();
    setTipStatus(status.loading);
    try {
      const { data } = await axios.post("http://localhost:5000/tip", {
        language: event.target.value,
      });
      console.log(event.target.value);
      if (data.status) {
        setTip(data.reply);
        setTipStatus(status.initial);
      } else {
        toast.error(data.error);
        setTipStatus(status.initial);
      }
    } catch (error) {
      toast.error(error);
      setTipStatus(status.initial);
    }
  };
  const loader = () => (
    <div className="loader">
      <ThreeDots
        height="80"
        width="80"
        color="rgb(118, 103, 237)"
        ariaLabel="ThreeDots-loading"
        wrapperClass="wrapper-class"
        visible={true}
      />
    </div>
  );
  return (
    <>
      <Header />
      <section className="home">
        <nav className="nav-left" style={{ width: `${leftWidth}vw` }}>
          {conversation.length > 0 ? (
            <>
              {conversation.map((item) => getConversations(item))}
              <div ref={bottomRef}>
                {apiStatus === status.loading && loader()}
              </div>
            </>
          ) : (
            <div className="initial">
              <FiMessageSquare className="icon" />
              <h1>{template.chatHeadding}</h1>
              <p>{template.chatPara}</p>
            </div>
          )}
        </nav>
        <div className="divider" onMouseDown={startDrag}></div>
        <nav
          className="nav-right"
          style={{
            width: `${100 - leftWidth}vw`,
            display: displayTip ? "block" : "none",
          }}
        >
          <div className="initial">
            <header>
              <IoBulbOutline className="icon" />
              <h1>{template.generateTextHeadding}</h1>
              <IoSparkles className="icon" />
            </header>
            <section>
              <div className="scroll">
                {tipStatus === status.loading ? (
                  loader()
                ) : (
                  <ReactMarkdown>
                    {tip === "" ? template.generatePara : tip}
                  </ReactMarkdown>
                )}
              </div>
            </section>
            <footer>
              <button
                type="button"
                style={{
                  cursor: tipStatus === status.loading ? "wait" : "pointer",
                }}
                disabled={tipStatus === status.loading}
                onClick={generateTip}
                value={template.generateBtn}
              >
                <IoSparkles className="icon" />
                {template.generateBtn}
              </button>
            </footer>
          </div>
        </nav>
      </section>
      <Footer />
    </>
  );
};

export default Home;
