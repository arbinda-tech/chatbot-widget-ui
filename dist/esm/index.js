import React, { useState, useRef, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}


const ChatBotWidget = ({ callApi, chatbotName = "Chatbot", isTypingMessage = "Typing...", IncommingErrMsg = "Oops! Something went wrong. Please try again.", primaryColor = "#eb4034", inputMsgPlaceholder = "Send a Message", chatIcon = React.createElement(ChatIcon, null), botIcon = React.createElement(BotIcon, null), botFontStyle = {}, typingFontStyle = {}, handleNewMessage, onBotResponse, messages = [], useInnerHTML = false, }) => {
    const [userMessage, setUserMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const chatInputRef = useRef(null);
    const chatboxRef = useRef(null);
    const handleChat = () => __awaiter(void 0, void 0, void 0, function* () {
        const trimmedMessage = userMessage.trim();
        if (!trimmedMessage)
            return;
        setUserMessage("");
        // Display outgoing message
        const outgoingMessage = { role: "user", content: trimmedMessage };
        handleNewMessage === null || handleNewMessage === void 0 ? void 0 : handleNewMessage(outgoingMessage);
        try {
            setTyping(true);
            // Use the custom API call function
            const botResponse = yield callApi(trimmedMessage);
            // Call the callback function with the bot's response
            onBotResponse === null || onBotResponse === void 0 ? void 0 : onBotResponse(botResponse);
        }
        catch (error) {
            // Display error message if API call fails
            const errorMessage = { role: "error", content: IncommingErrMsg };
            handleNewMessage === null || handleNewMessage === void 0 ? void 0 : handleNewMessage(errorMessage);
        }
        finally {
            setTyping(false);
        }
    });
    const handleInputChange = (event) => {
        setUserMessage(event.target.value);
        // Reset height to auto before calculating new height
        chatInputRef.current.style.height = "auto";
        // Adjust the height dynamically based on content
        chatInputRef.current.style.height = `${Math.min(chatInputRef.current.scrollHeight, 80)}px`;
    };
    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey && window.innerWidth > 800) {
            event.preventDefault();
            handleChat();
        }
    };
    const toggleChatbot = () => {
        const body = document.body;
        if (body.classList.contains("show-chatbot")) {
            body.classList.remove("show-chatbot");
            body.classList.add("hide-chatbot");
        }
        else {
            body.classList.remove("hide-chatbot");
            body.classList.add("show-chatbot");
        }
    };
    useEffect(() => {
        const closeBtn = document.querySelector(".close-btn");
        if (closeBtn) {
            const handleClose = () => toggleChatbot();
            // Add event listeners for both click and touch events
            closeBtn.addEventListener("click", handleClose);
            closeBtn.addEventListener("touchend", handleClose);
            // Cleanup function to remove the event listeners
            return () => {
                closeBtn.removeEventListener("click", handleClose);
                closeBtn.removeEventListener("touchend", handleClose);
            };
        }
    }, []);
    useEffect(() => {
        // Scroll to bottom of chatbox when messages change
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }, [messages]);
    return (React.createElement("div", { className: "chatbot-container", style: {
            background: primaryColor,
            backgroundColor: primaryColor,
        } },
        React.createElement("button", { className: "chatbot-toggler", onClick: toggleChatbot, style: { background: primaryColor } },
            React.createElement("span", { className: "material-symbols-rounded" }, chatIcon),
            React.createElement("span", { className: "material-symbols-outlined" }, "Close")),
        React.createElement("div", { className: "chatbot" },
            React.createElement("header", { style: { background: primaryColor } },
                React.createElement("h2", null, chatbotName),
                React.createElement("span", { className: "close-btn material-symbols-outlined", onClick: toggleChatbot }, "close")),
            React.createElement("ul", { className: "chatbox", ref: chatboxRef },
                messages.map((msg, index) => (React.createElement("li", { key: index, className: `chat ${msg.role === "user" ? "outgoing" : "incoming"}` },
                    msg.role !== "user" && (React.createElement("span", { className: "material-symbols-outlined" }, botIcon)),
                    React.createElement("p", Object.assign({ style: msg.role === "assistant"
                            ? botFontStyle
                            : msg.role === "error"
                                ? botFontStyle
                                : { background: primaryColor } }, (useInnerHTML
                        ? { dangerouslySetInnerHTML: { __html: msg.content } }
                        : { children: msg.content })))))),
                typing && (React.createElement("li", { key: Date.now(), className: "chat incoming" },
                    React.createElement("span", { className: "material-symbols-outlined" }, botIcon),
                    React.createElement("p", { style: typingFontStyle }, isTypingMessage)))),
            React.createElement("div", { className: "chat-input" },
                React.createElement("textarea", { ref: chatInputRef, placeholder: inputMsgPlaceholder, spellCheck: "false", required: true, value: userMessage, onChange: handleInputChange, onKeyDown: handleKeyPress, maxLength: 500 }),
                React.createElement("span", { id: "send-btn", className: "material-symbols-outlined", onClick: handleChat, style: {
                        color: primaryColor,
                    } }, "send")))));
};
const ChatIcon = () => {
    return (React.createElement(React.Fragment, null,
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlSpace: "preserve", width: 18, height: 18, fill: "#fff", stroke: "#fff", viewBox: "0 0 58 58" },
            React.createElement("path", { d: "M53 3.293H5c-2.722 0-5 2.278-5 5v33c0 2.722 2.278 5 5 5h27.681l-4.439-5.161a1 1 0 1 1 1.517-1.304l4.998 5.811L43 54.707v-8.414h10c2.722 0 5-2.278 5-5v-33c0-2.722-2.278-5-5-5z", style: {
                    fill: "#fff",
                } }),
            React.createElement("circle", { cx: 15, cy: 24.799, r: 3, style: {
                    fill: "#fff",
                } }),
            React.createElement("circle", { cx: 29, cy: 24.799, r: 3, style: {
                    fill: "#fff",
                } }),
            React.createElement("circle", { cx: 43, cy: 24.799, r: 3, style: {
                    fill: "#fff",
                } }))));
};
const BotIcon = () => {
    return (React.createElement(React.Fragment, null,
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlSpace: "preserve", width: 18, height: 18, fill: "#fff", stroke: "#fff", viewBox: "0 0 58 58" },
            React.createElement("path", { d: "M53 3.293H5c-2.722 0-5 2.278-5 5v33c0 2.722 2.278 5 5 5h27.681l-4.439-5.161a1 1 0 1 1 1.517-1.304l4.998 5.811L43 54.707v-8.414h10c2.722 0 5-2.278 5-5v-33c0-2.722-2.278-5-5-5z", style: {
                    fill: "#fff",
                } }),
            React.createElement("circle", { cx: 15, cy: 24.799, r: 3, style: {
                    fill: "#fff",
                } }),
            React.createElement("circle", { cx: 29, cy: 24.799, r: 3, style: {
                    fill: "#fff",
                } }),
            React.createElement("circle", { cx: 43, cy: 24.799, r: 3, style: {
                    fill: "#fff",
                } }))));
};

export { ChatBotWidget };
