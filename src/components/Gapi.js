import { useEffect } from "react";

/* global gapi */
const API_KEY = "YOUR_API_KEY";

function Gapi(props) {
  const gapiReady = (val) => {
    props.gapiIsReady(val);
  };

  useEffect(() => {
    gapi.load("client", loadClient);

    function loadClient() {
      gapi.client.setApiKey(API_KEY);
      return gapi.client
        .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(
          function () {
            gapiReady(true);
          },
          function (err) {
            console.error("Error loading GAPI client for API", err);
          }
        );
    }
  });

  return null;
}

export default Gapi;
