import express from 'express';
import cors from 'cors';
import { createUser, loginUser } from "./controller/user.controller.ts";
import { createShow, getAllShows } from "./controller/show.controller.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Public Routes
app.post("/api/createUser", createUser);
app.post("/api/loginUser", loginUser);

app.post("/api/createShow", createShow);
app.get("/api/shows", getAllShows);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});