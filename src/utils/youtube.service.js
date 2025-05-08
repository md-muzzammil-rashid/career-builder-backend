import axios from "axios";

export async function fetchYouTubeVideos(
    query,
    apiKey
  ) {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 1,
            key: apiKey,
            relevanceLanguage: "en",
            order: "relevance",
            videoDuration: "any",
            videoEmbeddable: "true",
          },
        }
      );
  
      if (response.data.items.length > 0) {
        return `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`;
      }
    } catch (error) {
      console.error(
        `Failed to fetch YouTube video for query "${query}":`,
        error.response?.data || error.message
      );
      throw new Error(
        `Failed to fetch YouTube video for query "${query}": ${error.response?.statusText || error.message}`
      );
    }
  
    return "";
  }


  
  export async function fetchYouTubePlaylistDetails(
    playlistId,
    apiKey
  ) {
    const videos = [];
  
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            part: "snippet",
            playlistId: playlistId,
            maxResults: 300,
            key: apiKey,
          },
        }
      );
  
      const items = response.data.items;
  
      items.forEach((item) => {
        videos.push({
          title: item.snippet.title,
          description: item.snippet.description,
          videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        });
      });
  
      return videos;
    } catch (error) {
      console.error("Failed to fetch YouTube playlist details:", error.response?.data || error.message);
      throw new Error("Failed to fetch YouTube playlist details");
    }
  }
  
  
//https://www.youtube.com/playlist?list=PLUwI7zx-CMG3c4om5dfUdxZdPAr4oqyXe