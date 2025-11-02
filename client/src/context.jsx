import { createContext, useState, useContext, useEffect } from "react";

// 1. Create the context
const ConversationContext = createContext();
const systemLanguages = {
  en: {
    title: "AI Health Advisor MVP",
    chatHeadding: "Hello! Let’s Take Care of Your Health Together!!",
    chatPara:
      "I am here to provide general self-care advice and securely log your conversation.",
    askBtn: "Ask",
    askBtnAlter: "Stop",
    inputPlaceholder: "What is your health condition...?",
    sendBtn: "Send",
    listen: "Listen",
    generateTextHeadding: "Wellness Insights",
    generatePara: `Click 'Generate New Tip' for a daily wellness insights!`,
    generateBtn: "Generate Health Tip",
  },
  te: {
    title: "ఏఐ ఆరోగ్య సలహాదారు MVP",
    chatHeadding: "హలో! మనం కలిసి మీ ఆరోగ్యాన్ని జాగ్రత్తగా చూసుకుందాం!!",
    chatPara:
      "నేను సాధారణ స్వీయ సంరక్షణ సలహాలను అందించడానికి మరియు మీ సంభాషణను సురక్షితంగా లాగ్ చేయడానికి ఇక్కడ ఉన్నాను.",
    askBtn: "వ్రాయండి",
    askBtnAlter: "ఆపండి",
    inputPlaceholder: "మీ ఆరోగ్య పరిస్థితి ఏమిటి...?",
    sendBtn: "పంపండి",
    listen: "వినండి",
    generateTextHeadding: "ఆరోగ్య సూచనలు",
    generatePara: `'కొత్త సలహాను రూపొందించండి' బటన్ పై క్లిక్ చేసి రోజువారీ ఆరోగ్య సూచనలు పొందండి!`,
    generateBtn: "ఆరోగ్య సలహా రూపొందించండి",
  },
  hi: {
    title: "एआई हेल्थ एडवाइजर MVP",
    chatHeadding: "नमस्ते! आइए मिलकर आपके स्वास्थ्य का ख्याल रखें!!",
    chatPara:
      "मैं सामान्य स्व-देखभाल सलाह देने और आपकी बातचीत को सुरक्षित रूप से लॉग करने के लिए यहां हूं।",
    askBtn: "पूछें",
    askBtnAlter: "रोकें",

    inputPlaceholder: "आपकी स्वास्थ्य स्थिति क्या है...?",
    sendBtn: "भेजें",
    listen: "सुनें",
    generateTextHeadding: "स्वास्थ्य सुझाव",
    generatePara: `'नया सुझाव उत्पन्न करें' पर क्लिक करके दैनिक स्वास्थ्य सुझाव प्राप्त करें!`,
    generateBtn: "स्वास्थ्य सुझाव उत्पन्न करें",
  },
  ta: {
    title: "ஏஐ ஆரோக்கிய ஆலோசகர் MVP",
    chatHeadding: "வணக்கம்! உங்கள் ஆரோக்கியத்தை ஒன்றாக கவனிப்போம்!!",
    chatPara:
      "நான் பொதுவான சுய பராமரிப்பு ஆலோசனைகளை வழங்கவும் உங்கள் உரையாடலை பாதுகாப்பாக பதிவு செய்யவும் இங்கே உள்ளேன்.",
    askBtn: "கேளுங்கள்",
    askBtnAlter: "நிறுத்தவும்",
    inputPlaceholder: "உங்கள் ஆரோக்கிய நிலை என்ன...?",
    sendBtn: "அனுப்பவும்",
    listen: "கேளுங்கள்",
    generateTextHeadding: "நலன் குறிப்புகள்",
    generatePara: `'புதிய குறிப்பு உருவாக்கவும்' கிளிக் செய்து தினசரி நலன் குறிப்புகளைப் பெறுங்கள்!`,
    generateBtn: "ஆரோக்கிய குறிப்பு உருவாக்கவும்",
  },
};
// 2. Create a provider component
export const ConversationProvider = ({ children }) => {
  const [conversation, setConversation] = useState([]);
  const [senderText, setSenderText] = useState("");
  const [apiStatus, setApiStatus] = useState("Initial");
  const [language, setLanguage] = useState("en");
  const [template, setTemplate] = useState(systemLanguages.en);
  const [reset, setReset] = useState(false);
  const [displayTip, setDisplayTip] = useState(false);
  const [displayBurger, setDisplayBurger] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [location, setLocation] = useState("");
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLatitude(lat);
          setLongitude(lon);

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await res.json();

            if (data && data.address) {
              const { city, town, village, state, country } = data.address;
              const locationName = `${
                city || town || village || "Unknown"
              }, ${state}, ${country}`;
              setLocation(locationName);
            } else {
              setLocation("Location not found");
            }
          } catch (err) {
            console.error("Error fetching location:", err);
          }
        },
        (error) => {
          console.error("Location access denied or unavailable:", error);
        }
      );
    } else {
      console.error("Geolocation not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("language");
    const savedConversation = sessionStorage.getItem("conversation");
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedConversation) setConversation(JSON.parse(savedConversation));
  }, []);

  useEffect(() => {
    if (conversation.length !== 0) {
      sessionStorage.setItem("language", language);
      sessionStorage.setItem("conversation", JSON.stringify(conversation));
    }
  }, [language, conversation]);

  useEffect(() => {
    switch (language) {
      case "en":
        setTemplate(systemLanguages.en);
        return;
      case "te":
        setTemplate(systemLanguages.te);
        return;
      case "ta":
        setTemplate(systemLanguages.ta);
        return;
      case "hi":
        setTemplate(systemLanguages.hi);
        return;
      default:
        setTemplate(systemLanguages.en);
    }
  }, [language]);

  const addMessage = (user, assistant, id) => {
    setConversation((prev) => [...prev, { user, assistant, id }]);
  };
  const context = conversation
    .slice(-5)
    .map((msg) => `${msg.user}: ${msg.assistant}`)
    .join("\n");
  const updateApiStatus = (status) => {
    setApiStatus(status);
  };
  useEffect(() => {
    if (reset) {
      setConversation([]);
      setSenderText("");
      setApiStatus("initial");

      setReset(false);
    }
  }, [reset]);

  return (
    <ConversationContext.Provider
      value={{
        template,
        conversation,
        addMessage,
        updateApiStatus,
        apiStatus,
        setSenderText,
        senderText,
        context,
        language,
        setLanguage,
        displayTip,
        setDisplayTip,
        setDisplayBurger,
        displayBurger,
        setReset,
        location,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// 3. Custom hook for easier usage
export const useConversation = () => useContext(ConversationContext);
