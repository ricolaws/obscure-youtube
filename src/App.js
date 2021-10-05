import "./index.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Globe from "./components/Globe";
import Gapi from "./components/Gapi";
import Youtube from "./components/Youtube";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  const [clientIsLoaded, setClientIsLoaded] = useState(false);
  const [coords, setCoords] = useState([]);
  const [videoList, setVideoList] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  function gapiIsReadyHandler(value) {
    setClientIsLoaded(value);
    console.log("GAPI client loaded for API");
  }

  const setCoordsHandler = (value) => {
    setCoords(value);
  };

  const setVideoListHandler = (value) => {
    setVideoList(value);
    setShowVideo(true);
  };

  const showVideoHandler = (condition) => {
    setShowVideo(condition);
  };

  return (
    <div>
      <VideoPlayer
        showVideo={showVideo}
        onClose={() => showVideoHandler(false)}
        videoList={videoList}
      />
      <Gapi gapiIsReady={gapiIsReadyHandler} />
      <VideoPlayer videoList={videoList} />
      <Youtube
        clientIsLoaded={clientIsLoaded}
        coords={coords}
        setVideoList={setVideoListHandler}
      />
      <Globe setCoords={setCoordsHandler} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
