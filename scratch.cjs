const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:3001/api/v1/settings');
    console.log("Success:", res.data);
  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}
test();
