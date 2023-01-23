import express from "express";
import userController from "../controllers/user.js";

const user = (app) => {
  const router = express.Router();
  app.use("/api/user", router);
  router.post("/signUp", userController.signUp);
  router.get("/getFilm", userController.getFilm);
  router.get("/getFilm/:name", userController.getFilmByName);
  router.post("/register", userController.register);
  router.post("/comment", userController.addComment);
  router.get("/comment", userController.getComment);
  router.get("/getEpisodeFilm", userController.getEpisodeFilm);
  router.get("/getEpisodeFilm/:filmID", userController.getEpisodeFilmById);
  router.get("/getUrlEpisodeFilm/:filmID", userController.getEpisodeFilmByEpisodeId);
};

export default user;
