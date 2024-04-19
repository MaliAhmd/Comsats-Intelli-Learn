// https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=PLZPZq0r_RZOO1zkgO4bIdfuLpizCeHYKv&key=AIzaSyDhemxtbpNA4Re8Y4UA7Vfk-ivuJJEEl9A

  // Initialize the YouTube player
  let player;

  function onPlayerReady(event) {
      // Player is ready
  }

  function playVideo(videoId) {
    // Play the selected video
    if (player) {
        player.loadVideoById(videoId);
        player.playVideo();
    } else {
        // If player is not initialized, initialize it
        player = new YT.Player('player', {
            height: '560',
            width: '100%',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady
            }
        });
        document.querySelector('#text').style.display = "block"
    }
}

//   Fetch playlist items
//   fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=PLZPZq0r_RZOO1zkgO4bIdfuLpizCeHYKv&key=AIzaSyDhemxtbpNA4Re8Y4UA7Vfk-ivuJJEEl9A`)
// fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=Flutter%20&key=AIzaSyDhemxtbpNA4Re8Y4UA7Vfk-ivuJJEEl9A`)
//       .then((result) => result.json())
//       .then((data) => {

//         let vedios =data.items;
//         let videocontainer=document.querySelector(".thumbnails-container")
//         for(vedio of vedios){
//             videocontainer.innerHTML+=`<img src="${vedio.snippet.thumbnails.high.url}">`
//         }

//         data.items.forEach((curr)=>{
//             vidTitle=curr.snippet.title;
//             vidURL=`https://www.youtube.com/watch?v=`+curr.id.videoId;
//             console.log(vidURL);
//             console.log(curr);
//             console.log("aaa",curr.snippet.thumbnails.high.url);
//         })


        function searchVideos() {
            const query = document.getElementById('searchInput').value;
            const apiKey = 'AIzaSyCak-QB3V_wM_pxwpb7edwczafzYmAxsXc'; // Replace with your own API key
            // Words to filter from the search query
    const wordsToFilter = ["education", "tutorial", "learning","app","development","react","java","c++","c","kotlin","flutter","dart","python","ai","ml","artificial intelligence","machine algorithm","nodejs","expressjs","angular","html","css","javascript","js","vue","mysql","mongodb","database","programming","fundamental"]; // Add more words as needed

    // Function to filter words from the search query
    function filterWords(searchQuery, wordsToFilter) {
        const queryWords = searchQuery.toLowerCase().split(/\s+/);
        const filteredWords = wordsToFilter.map(word => word.toLowerCase());
        console.log("Filtered Words:", filteredWords);
        const filteredQueryWords = queryWords.filter(word => filteredWords.includes(word));
        console.log("Filtered Query Words:", filteredQueryWords);
        return filteredQueryWords.join(' ');  
    }
        const filteredQuery = filterWords(query, wordsToFilter);
        if(filteredQuery){
            const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(filteredQuery)}&maxResults=30&type=playlist&key=${apiKey}`;
            

            fetch(apiUrl)
            .then((result) => result.json())
            .then((data) => {
                if (data.items && data.items.length > 0) {
                    let videos = data.items;
                    let videoContainer = document.querySelector(".thumbnails-container");
                    videoContainer.innerHTML = ''; // Clear previous search results
                    console.log(data.items)
                    for (let video of videos) {
                        
                        if (video.id.kind === "youtube#playlist") {
                            // If it's a playlist
                            const playlistId = video.id.playlistId;
                            const playlistTitle = video.snippet.title;
                            let totalVideos = 0;
                            if (video.contentDetails && video.contentDetails.itemCount) {
                                totalVideos = video.contentDetails.itemCount;
                            }
                            videoContainer.innerHTML += `<div class="list-block" onclick="showPlaylist('${playlistId}')"> <figure>
                                <img src="${video.snippet.thumbnails.high.url}" alt="${playlistTitle}" ">
                                <figcaption>
                                <p class="video-title">${playlistTitle}</p>
                                    </figcaption>
                                <div class="video-title">${playlistTitle}</div>
                                </figure>
                            </div>`;
                        } else {
                            // If it's a single video
                            const videoTitle = video.snippet.title;
                            console.log(video.snippet.thumbnails.high.url)
                            videoContainer.innerHTML += `<div onclick="playVideo('${video.id.videoId}')">
                                <img src="${video.snippet.thumbnails.high.url}" alt="${videoTitle}" />
                                <figcaption>
                                    <p class="video-title">${videoTitle}</p>
                            </figcaption>
                                <div class="video-title">${videoTitle}</div>
                            </div>`;
                        }
                    }
                } else {
                    console.log('No videos found.');
                }
            })
                .catch((error) => {
                    console.error('Error fetching videos:', error);
                });
        }
        else{
            
            function showNotFoundMessage() {
                var notFoundMessage = document.getElementById("notFoundMessage");
                notFoundMessage.style.display = "block";
                document.querySelector(".thumbnails-container").innerHTML=''
            }
            showNotFoundMessage();

        }
        
            
        }

        function showPlaylist(playlistId) {
            const apiKey = 'AIzaSyCak-QB3V_wM_pxwpb7edwczafzYmAxsXc'; // Replace with your own API key
            const apiUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
            fetch(apiUrl)
            .then((result) => result.json())
            .then((data) => {
                if (data.items && data.items.length > 0) {
                    let videos = data.items;
                    let videoContainer = document.querySelector(".thumbnails-container");
                    videoContainer.innerHTML = ''; // Clear previous search results
    
                    for (let video of videos) {
                        // Show thumbnails of videos in the playlist and handle their click event
                        const videoId = video.snippet.resourceId.videoId;
                        const videoTitle = video.snippet.title;
                        videoContainer.innerHTML += `<div class="list-block" onclick="playVideo('${videoId}')"> <figure>
                            <img src="${video.snippet.thumbnails.high.url}" alt="${videoTitle}" ">
                            <figcaption>
                            <p class="video-title">${videoTitle}</p>
                            </figcaption>
                            <div class="video-title">${videoTitle}</div>
                            </figure>
                        </div>`;    
                        }
                } else {
                    console.log('No videos found in the playlist.');
                }
            })
            .catch((error) => {
                console.error('Error fetching playlist videos:', error);
            });
        }
    //       let videos = data.items;
    //       let thumbnailsContainer = document.getElementById("thumbnails-container");

    //       videos.forEach((video) => {
    //           const videoTitle = video.snippet.title;
    //           const videoThumbnail = video.snippet.thumbnails.high.url;
    //           const videoId = video.snippet.resourceId.videoId;

    //           // Create a thumbnail image element
    //           const thumbnailImg = document.createElement('img');
    //           thumbnailImg.src = videoThumbnail;

    //           // Add click event listener to play the video
    //           thumbnailImg.addEventListener('click', () => {
    //               playVideo(videoId);
    //           });

    //           // Append the thumbnail to the thumbnails container
    //           thumbnailsContainer.appendChild(thumbnailImg);

    //           // Create a video title element
    //           const titleElement = document.createElement('p');
    //           titleElement.textContent = videoTitle;

    //           // Append the video title to the thumbnails container
    //           thumbnailsContainer.appendChild(titleElement);
    //       });
    //   })
    //   .catch((error) => {
    //       console.error('Error fetching data:', error);
    //   });

   