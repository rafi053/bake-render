import axios from "axios";

const RENDER_API_KEY = "rnd_FSXntAzjIKZqB4uZCQ9WjSvb6dms";

axios.get("https://api.render.com/v1/services", {
  headers: { Authorization: `Bearer ${RENDER_API_KEY}` }
}).then(res => console.log(res.data))
.catch(err => console.error("API Key Error:", err.response?.data || err.message));
// ownerId: 'tea-csp7rqrgbbvc73d1os1g',