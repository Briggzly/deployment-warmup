const express = require("express");
const path = require("path");
const Rollbar = require("rollbar");

let rollbar = new Rollbar({
  accessToken: "0a8627f809f741be9667e63bf04ec900",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const students = []
const app = express();
app.use(express.json());
app.use("/style", express.static("./index.css"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
  rollbar.info("HTML file served successfully!");
});

app.get("/index.css", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.css"));
  rollbar.info("CSS added successfully");
});

app.post("/api/student", (req, res) => {
    let { name } = req.body;
    name = name.trim();
  
    const index = students.findIndex((studentName) => studentName === name);
  
    if (index === -1 && name !== "") {
      students.push(name);
      rollbar.log("Student added successfully", {
        author: "Scott",
        type: "manual entry",
      });
      res.status(200).send(students);
    } else if (name === "") {
      rollbar.error("No name given");
      res.status(400).send("must provide a name.");
    } else {
      rollbar.error("student already exists");
      rollbar.critical("This is critical!")
      res.status(400).send("that student already exists");
    }
  });


const port = process.env.PORT || 4005;

app.use(rollbar.errorHandler());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
