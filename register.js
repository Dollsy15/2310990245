const axios = require("axios");
const fs = require("fs");

async function register() {
  const registrationData = {
    email: "dollsy0245.be23@chitkara.edu.in",
    name: "Dollsy Rani",
    mobileNo: "7719422080",
    githubUsername: "Dollsy15",
    rollNo: "2310990245",
    accessCode: "EXfvDp",
  };

  try {
    const response = await axios.post(
      "http://20.207.122.201/evaluation-service/register",
      registrationData,
    );

    console.log("Registration successful!");
    console.log("Client ID:", response.data.clientID);
    console.log("Client Secret:", response.data.clientSecret);

    const envContent = `
CLIENT_ID=${response.data.clientID}
CLIENT_SECRET=${response.data.clientSecret}
EMAIL=${registrationData.email}
NAME=${registrationData.name}
ROLL_NO=${registrationData.rollNo}
ACCESS_CODE=${registrationData.accessCode}
        `.trim();

    fs.writeFileSync(".env", envContent);
    console.log("Saved in .env file");
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message,
    );
  }
}

register();
