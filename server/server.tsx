const express = require("express");
const cookieSession = require("cookie-session");
const jwt = require("jsonwebtoken");

const app = express();

// just one user
const userFiles = [];
const jwt_secret = "My secret id";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);
app.use(
  cookieSession({
    secret: jwt_secret,
    resave: true,
    saveUninitialized: false,
    signed: false,
    secure: true,
  })
);

app.post("/api/saveFile", (req, res) => {
  userFiles.push(req.body.csvFiles);

  const userJWT = jwt.sign(
    {
      id: "gshbsjbsj",
      csvFiles: userFiles,
    },
    "qwerty"
  );

  req.session = { jwt: userJWT };
  res.end(JSON.stringify({ Love: "Hello!", token: userJWT }));
});

// This was to save the new file
app.post("/api/updateFile", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) {
      console.log(err);
    } else console.log(decoded);
  });
  res.end();
});

app.listen(4000, () => {
  console.log("App listeing on port 4000");
});
