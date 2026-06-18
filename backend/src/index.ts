import express from 'express';
import { createUser, loginUser } from "./controller/user.controller.ts";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Public Routes
app.post("/api/createUser", createUser);
app.post("/api/loginUser", loginUser);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});