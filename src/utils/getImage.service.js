import axios from "axios";

export async function getImage(query) {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        client_id: process.env.UNSPLASH_ACCESS_KEY,
        per_page: 1,
      },
    });

    if (response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
  } catch (error) {
    console.error(`Failed to fetch image for query "${query}":`, error.response?.data || error.message);
    throw new Error(`Failed to fetch image for query "${query}": ${error.response?.statusText || error.message}`);
  }

  return "";
}