import express from "express";
import cors from "cors"
import { connect } from "./db.js";
import user from "./routers/user.js";
import admin from "./routers/admin.js";
import * as dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 4000
const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
user(app);
admin(app);
app.listen(port, () => {
  console.log("Server started on port 4000");
});
