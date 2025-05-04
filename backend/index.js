import express from "express";
import cors from "cors";
const app = express();
import bodyParser from "body-parser";
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

function temp(req, res) {
  res.send("Hello World!");
}

app.get("/", temp);

function started() {
  console.log(`Server started on port ${port}`);
}
app.listen(port, started);

async function getCodeChefRating(username) {
  let result = -1;
  let url = `https://codechef-api.vercel.app/handle/${username}`;
  var sendgetCodeChefRatingObj = { method: "GET" };
  let fecthResult = await fetch(url, sendgetCodeChefRatingObj).catch(
    (error) => {
      console.error("Error:", error);
      return -1;
    }
  );
  if (fecthResult === -1 || fecthResult.status != 200) {
    return -1;
  }
  result = await fecthResult.json();
  if (result.status == 404) {
    return -1;
  }
  return result.currentRating;
}

async function getCodeforcesRating(username) {
  let result = -1;
  let url = `https://codeforces.com/api/user.info?handles=${username}`;
  var sendCodeforcesResult = { method: "GET" };
  let fetchResult = await fetch(url, sendCodeforcesResult).catch((error) => {
    console.error("Error:", error);
    return -1;
  });
  if (fetchResult === -1 || fetchResult.status != 200) {
    return -1;
  }
  result = await fetchResult.json();
  if (result.status === "error") {
    return -1;
  }
  return result.result[0].rating;
}

async function getLeetcodeRating(username) {
  let result = -1;
  let url = `https://leetcode.com/graphql`;
  const query = `
    query getContestRanking($username: String!) {
      userContestRanking(username: $username) {
        rating
        globalRanking
        totalParticipants
        attendedContestsCount
      } }`;
  var sendgetLeetCodeRatingObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  };
  let fetchResult = await fetch(url, sendgetLeetCodeRatingObj).catch(
    (error) => {
      console.error("Fetch Error:", error);
      return -1;
    }
  );

  if (fetchResult === -1 || fetchResult.status !== 200) {
    console.error("Request failed or returned non-200 status");
    return -1;
  }

  result = await fetchResult.json();

  if (
    !result.data ||
    !result.data.userContestRanking ||
    result.data.userContestRanking === null
  ) {
    console.error("Invalid username or no contest data found");
    return -1;
  }

  const { rating, globalRanking, totalParticipants, attendedContestsCount } =
    result.data.userContestRanking;

  var finalRating = Math.floor(rating);
  return finalRating;
}

var codeChefUsername = "rishithabattu";
var val1 = await getCodeChefRating(codeChefUsername).then((result) => {
  console.log("codechef rating:", result);
});

var codeForcesUsername = "M_Abhiram";
var val2 = await getCodeforcesRating(codeForcesUsername).then((result) => {
  console.log("codeforces rating:", result);
});

var leetCodeUsername = "22h51a6610";
var val3 = await getLeetcodeRating(leetCodeUsername).then((result) => {
  console.log("leetcode rating:", result);
});
