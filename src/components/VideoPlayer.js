// import React from "react";
import ReactPlayer from "react-player/youtube";
import { useEffect, useState } from "react";

function VideoPlayer(props) {
  const [url, setUrl] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [count, setCount] = useState(0);

  const nextVideo = () => {
    setCount(count + 1);
    setUrl(`https://www.youtube.com/watch?v=${props.videoList[count].id}`);
    console.log(url);
  };
  useEffect(() => {
    console.log("useEffect in effect");
    setCount(0);
    if (props.videoList) {
      const idArray = [];
      props.videoList.map((item) => {
        idArray.push(item.id);
        setPlaylist(idArray);
      });
      setUrl(`https://www.youtube.com/watch?v=${props.videoList[count].id}`);
    }
  }, [props.videoList]);

  if (!props.showVideo) {
    return null;
  }

  return (
    <div className="container">
      <div className="modal-container">
        <div className="modal-body">
          {playlist.length === 0 ? (
            <p>No videos</p>
          ) : (
            <ReactPlayer url={url} controls={false} playing={true} />
          )}
        </div>
        <button className="modal-button" onClick={nextVideo}>
          Next
        </button>
      </div>
      <div className="modal-background" onClick={props.onClose}></div>
    </div>
  );
}

export default VideoPlayer;

{
  /* <YoutubePlayer
              src="https://www.youtube.com/watch?v=a64cJiGKr7c"
              width={960}
              height={540}
              autoplay={1}
            /> */
}
