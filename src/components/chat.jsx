import axios from "axios";
import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import logo from "../assets/images/evos-logo-1.png";
import evos from "../assets/images/evos-logo.png";

const api_key = process.env.REACT_APP_API_KEY;

const Chat = () => {
  const [newQuestion, setNewQuestion] = useState("");
  const [storedValues, setStoredValues] = useState([]);
  const [loader, setLoader] = useState(false);

  const instance = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`,
    },
  });

  const askGPT = async (prompt) => {
    const response = await instance.post("/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    console.log("Answer to the Question is : ", response.data.choices[0].message.content);

    return response.data.choices[0].message.content; // this is the answer provided by chatgpt as per api
  };

  const handleSubmit = async () => {
    setLoader(true);
    const response = await askGPT(newQuestion);
    const id = Date.now();
    setStoredValues([
      {
        id,
        question: newQuestion,
        answer: response,
      },
      ...storedValues,
    ]);
    setLoader(false);
    setNewQuestion("");
  };

  const enterHandle = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
      <div className="page-content page-container bg-color-lite " id="page-content">
        <div className="">
          <div className="row container d-flex justify-content-center py-5 ">
            <div className="offset-md-3 col-md-6">
              <div className="card card-bordered">
                <div className="card-header">
                  <h2 className="card-title">
                    <img className="align-center" src={evos} width="100px" alt="..." />
                  </h2>
                </div>

                <div className="ps-container ps-theme-default ps-active-y overFLOW" id="chat-content">
                  {storedValues.map((value) => {
                    return <QuesAnswer ques={value.question} answer={value.answer} key={value.id} />;
                  })}
                  <div className="ps-scrollbar-x-rail" style={{ left: "0px", bottom: "0px" }}>
                    <div className="ps-scrollbar-x" tabIndex="0" style={{ left: "0px", width: "0px" }}></div>
                  </div>
                  <div className="ps-scrollbar-y-rail" style={{ top: "0px", height: "0px", right: "2px" }}>
                    <div className="ps-scrollbar-y" tabIndex="0" style={{ top: "0px", height: "2px" }}></div>
                  </div>
                </div>
                {loader === true ? (
                  <div className="publisher bt-1 border-light">
                    <img className="" src={logo} width="30px" alt="..." />
                    <input
                      className="publisher-input"
                      type="text"
                      placeholder="Ask Me Anything"
                      value={newQuestion}
                      disabled
                    />
                    <Bars
                      height="36"
                      width="36"
                      color="#4fa94d"
                      ariaLabel="bars-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  </div>
                ) : (
                  <div className="publisher bt-1 border-light">
                    <img className="" src={logo} width="50px" alt="..." />
                    <input
                      className="publisher-input"
                      type="text"
                      placeholder="Ask Me Anything..."
                      value={newQuestion}
                      onChange={(e) => {
                        setNewQuestion(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        enterHandle(e);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        handleSubmit(e);
                      }}
                      className="btn btn-warning"
                    >
                      <i className="fa fa-paper-plane"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const QuesAnswer = ({ ques, answer }) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

//used to set the typing effect

  useEffect(() => {
    setText("");
    setIndex(0);
  }, [answer]);

  useEffect(() => {
    if (index < answer.length) {
      setTimeout(() => {
        setText(text + answer[index]);
        setIndex(index + 1);
      }, 20);
    }
  }, [index]);
  return (
    <>
      <div className="media media-chat">
        <img className="" src={logo} width="30px" alt="..." />
        <div className="media-body">
          <p>{text}</p>
        </div>
      </div>
      <div className="media media-chat media-chat-reverse">
        <div className="media-body">
          <p>{ques}</p>
        </div>
      </div>
    </>
  );
};

export default Chat;
