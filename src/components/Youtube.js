/* global gapi */
import { useState, useEffect } from "react";

function Youtube(props) {
  // const [videoList, setVideoList] = useState(null)
  // const [coords, setCoords] = useState(props.coords);

  const [lat, lon] = props.coords;

  const setVideoList = (val) => {
    props.setVideoList(val);
  };

  useEffect(() => {
    if (props.clientIsLoaded && props.coords.length) {
      console.log("getting vids");
      getVideos();

      // ++++++++++++++++  The getVideos function  ++++++++++++++++

      function getVideos() {
        var arr_search = {
          part: "snippet",
          type: "video",
          order: "date",
          maxResults: 3,
          // topicId: "/m/04rlf",
          location: `${lat}, ${lon}`,
          locationRadius: "100km",
          videoEmbeddable: true,
          // videoSyndicated: true,
          safeSearch: "none",
        };

        //   if (pageToken != "") {
        //     arr_search.pageToken = pageToken;
        //   }

        // call YouTube search API and display the result in the HTML
        return gapi.client.youtube.search.list(arr_search).then(
          function (response) {
            // Handle the results here (response.result has the parsed body).
            const listItems = response.result.items;
            const videoIdArray = [];
            //   console.log(listItems);
            if (listItems) {
              let output = "<h4>Videos</h4><ul>";

              listItems.forEach((item) => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;

                videoIdArray.push(videoId);

                output += `
                      <li><a data-fancybox="gallery" href="https://www.youtube.com/watch?v=${videoId}"><img src="http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg" /></a><p>${videoTitle}</p></li>
                  `;
              });
              output += "</ul>";

              // if (response.result.prevPageToken) {
              //   output += `<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;
              // }

              // if (response.result.nextPageToken) {
              //   output += `<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)">Next</a>`;
              // }

              // Output list
              // videoList.innerHTML = output;
            }
            return gapi.client.youtube.videos
              .list({
                part: ["contentDetails", "statistics", "status"],
                id: videoIdArray,
              })
              .then(
                function (response) {
                  // Handle the results here (response.result has the parsed body)
                  setVideoList(response.result.items);
                },
                function (err) {
                  console.error("Execute error", err);
                }
              );
          },
          function (err) {
            console.error("Execute error", err);
          }
        );
      }
    }
  }, [lat, lon]);

  return null;
}

export default Youtube;
