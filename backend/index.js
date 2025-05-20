import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();
const port = 4000;
dotenv.config();
const secret = process.env.SECRET_KEY;
app.use(cors());
app.use(bodyParser.json());

function roomReader() {
  let users = fs.readFileSync("rooms.json", "utf-8");
  return JSON.parse(users);
}
function roomWriter(rooms) {
  fs.writeFileSync("rooms.json", JSON.stringify(rooms));
}
function reader() {
  let users = fs.readFileSync("users.json", "utf-8");
  return JSON.parse(users);
}
function writer(users) {
  fs.writeFileSync("users.json", JSON.stringify(users));
}

function generateToken(username) {
  let token = jwt.sign({ username }, secret, { expiresIn: "1h" });
  return token;
}

function authentication(req, res, next) {
  let val = req.headers.authorization;
  if (val) {
    let token = val.split(" ")[1];
    jwt.verify(token, secret, (err, decodedMessage) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decodedMessage;
      next();
    });
  } else res.sendStatus(401);
}

function handleSignup(req, res) {
  let { username, password } = req.body;
  let users = reader();
  var existing = users.find((u) => u.username === username);
  if (existing) {
    res.status(409).send("User exists");
  } else {
    let Obj = {
      username: username,
      password: password,
      handles: {},
      myTodos: [],
      roomIds: [],
    };
    users.push(Obj);
    writer(users);
    res.json({
      Message: "succesfull",
      token: generateToken(username),
    });
  }
}

app.post("/signup", handleSignup);

function handleLogin(req, res) {
  let { username, password } = req.body;
  let users = reader();
  var check = users.find(
    (u) => u.username === username && u.password === password
  );
  if (check) {
    res.json({
      Message: "succesfull",
      token: generateToken(username),
    });
  } else {
    res.status(404).send("User Not Found");
  }
}

app.post("/login", handleLogin);

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
    return -1;
  }

  const { rating, globalRanking, totalParticipants, attendedContestsCount } =
    result.data.userContestRanking;

  var finalRating = Math.floor(rating);
  return finalRating;
}

async function handleRatings(req, res) {
  const { codeChefUsername, codeForcesUsername, leetCodeUsername } = req.body;
  const initial = req.headers.initial;
  var val1 = await getCodeChefRating(codeChefUsername);
  var val2 = await getCodeforcesRating(codeForcesUsername);
  var val3 = await getLeetcodeRating(leetCodeUsername);
  if (initial === "1") {
    let users = reader();
    let user = users.find((u) => u.username === req.user.username);
    let Obj = {
      codeChefUsername: codeChefUsername,
      codeForcesUsername: codeForcesUsername,
      leetCodeUsername: leetCodeUsername,
    };
    user.handles = Obj;
    writer(users);
  }
  res.status(200).json({
    CodeChefRating: val1,
    CodeforcesRating: val2,
    LeetcodeRating: val3,
  });
}

app.post("/getRatings", authentication, handleRatings);

function generateRoomId() {
  return Math.floor(100000 + Math.random() * 900000);
}

function handleCreateRoom(req, res) {
  const username = req.user.username;
  let users = reader();

  let user = users.find((u) => u.username === username);
  if (!user) return res.status(404).json({ message: "User not found" });

  let roomId = generateRoomId();
  let newRoom = { id: roomId, people: [username], todos: [] };
  let rooms = roomReader();

  rooms.push(newRoom);
  user.roomIds.push(roomId);
  writer(users);
  roomWriter(rooms);

  res.status(200).json({
    message: "created room successfully",
    id: roomId,
  });
}

app.post("/createRoom", authentication, handleCreateRoom);

function handleJoinRoom(req, res) {
  const roomId = req.params.id;
  const username = req.user.username;

  let users = reader();
  let rooms = roomReader();

  let user = users.find((u) => u.username === username);
  let room = rooms.find((r) => r.id == roomId);

  if (!room) return res.status(404).send("Room Not Found");

  user.roomIds.push(roomId);
  room.people.push(username);

  writer(users);
  roomWriter(rooms);

  res.status(200).json({
    message: "Joined room successfully",
    id: roomId,
  });
}

app.post("/joinRoom/:id", authentication, handleJoinRoom);

function handleFetchRooms(req, res) {
  const username = req.user.username;
  let users = reader();
  let user = users.find((u) => u.username === username);
  let rooms = user.roomIds;

  const roomIds = rooms.map((room) => ({ id: room }));
  res.status(200).json(roomIds);
}

app.post("/fetchRooms", authentication, handleFetchRooms);

function temp(req, res) {
  res.send("Hello World!");
}

app.get("/", temp);

function started() {
  console.log(`Server started on port ${port}`);
}
app.listen(port, started);
