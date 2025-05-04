const express = require("express");

const app = express();
const PORT = 3000;

app.get("/api/leetcode-rating/:username", async (req, res) => {
  const { username } = req.params;
  const query = `
    query getContestRanking($username: String!) {
      userContestRanking(username: $username) {
        rating
        globalRanking
        totalParticipants
        attendedContestsCount
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const result = await response.json();

    if (
      !result.data ||
      !result.data.userContestRanking ||
      result.data.userContestRanking === null
    ) {
      return res
        .status(404)
        .json({ error: "Invalid username or no contest data found" });
    }

    const { rating, globalRanking, totalParticipants, attendedContestsCount } =
      result.data.userContestRanking;

    return res.json({
      username,
      rating,
      globalRanking,
      totalParticipants,
      attendedContestsCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
