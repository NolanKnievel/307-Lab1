import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

function generate_random_id() {
  return Math.random().toString(36).substring(2, 9);
}

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (job != undefined && name != undefined) {
    let result = findUserByName(name);
    result = result.filter((user) => user["job"] === job);
    result = { users_list: result };
    res.send(result);
  } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  // generate id for user
  userToAdd["id"] = generate_random_id();
  // ensure all fields are filled
  if (userToAdd["name"] === undefined || userToAdd["job"] === undefined) {
    res.status(400).send("Invalid request body.");
    return;
  }
  addUser(userToAdd);
  res.status(201).send();
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index === -1) {
    res.status(404).send("Resource not found.");
  } else {
    users["users_list"].splice(index, 1);
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
