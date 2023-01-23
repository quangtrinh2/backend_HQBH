import { connect } from "../db.js";

const userController = {
  signUp: async (req, res) => {
    const { account, password } = req.body;
    var sql =
      "SELECT userID, userName, avatar FROM login_user WHERE account = ? AND password = ?";
    try {
      const [result] = await connect.query(sql, [account, password]);
      if (result[0] != null) {
        res.json({
          login: true,
          id: result[0].userID,
          userName: result[0].userName,
          avatar: result[0].avatar,
        })
      } else res.json({ login: false })
    }
    catch (error) {
      console.log(error);
    }
  },

  register: async (req, res) => {
    const { account, password, userName, dateOfBirth, avatarUrl } = req.body;
    var sql = "SELECT userID FROM login_user WHERE account = ? "
    try {
      const [accountConflict] = await connect.query(sql, [account]);
      if (accountConflict[0] != null) res.json({ register: false });
      else {
        sql = "INSERT INTO login_user(account, password, userName, dateOfBirth, avatar, status) VALUES(?,?,?,?,?,0)"
        try {
          const [result] = await connect.query(sql, [account, password, userName, dateOfBirth, avatarUrl]);
          console.log(result);
          res.json({ register: true });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  addComment: async (req, res) => {
    const { comment, userID, commentParentID, likeCount, filmID, episodeID } = req.body;

    var sql = "INSERT INTO comment( comment, userID, commentParentID, likeCount, filmID, episodeID ) VALUES (?,?,?,?,?,?)";
    try {
      const [result] = await connect.query(sql, [comment, userID, commentParentID, likeCount, filmID, episodeID]);
      res.json(true);
    } catch (error) {
      console.log(error);
      res.json(false);
    }
  },

  getComment: async (req, res) => {
    const filmID = req.query?.filmID;
    const episodeID = req.query?.episodeID !== "undefined" ? req.query.episodeID : null;
    var sql;
    if (episodeID === null) {
      sql = "SELECT commentID, comment, comment.userID, login_user.avatar, userName, commentParentID, DATE_FORMAT(time, '%H:%i %d-%m-%Y') AS time, likeCount, filmID, episodeID FROM comment JOIN login_user ON comment.userID = login_user.userID AND comment.filmID = ? AND comment.episodeID IS ? ORDER BY comment.time DESC";
    }
    else {
      sql = "SELECT commentID, comment, comment.userID, login_user.avatar, userName, commentParentID, DATE_FORMAT(time, '%H:%i %d-%m-%Y') AS time, likeCount, filmID, episodeID FROM comment JOIN login_user ON comment.userID = login_user.userID AND comment.filmID = ? AND comment.episodeID = ? ORDER BY comment.time DESC";
    }
    try {
      const [result] = await connect.query(sql, [filmID, episodeID]);
      var comment = [];
      const commentParent = result.filter((comment) => {
        return comment.commentParentID === null;
      });
      commentParent.map((commentParent) => {
        const commentChild = result.filter((comment) => {
          return comment.commentParentID === commentParent.commentID;
        });
        comment.push({
          commentParent,
          commentChild,
        });
      });
      res.json(comment);
    } catch (error) {
      console.log(error);
    }
  },

  getFilm: async (req, res) => {
    var sql = "SELECT film.*, COUNT(episode_film.filmID) as episodeCount FROM film, episode_film WHERE film.filmID = episode_film.filmID GROUP BY episode_film.filmID order by COUNT(episode_film.filmID) DESC";
    try {
      const [result] = await connect.query(sql);
      res.json(result)
    } catch (error) {
      console.log(error);
    }

  },

  getFilmByName: async (req, res) => {
    const filmName = req.params.name;
    var sql = "SELECT * FROM film WHERE filmName = " + "'" + filmName + "'";
    try {
      const [result] = await connect.query(sql);
      res.json(result[0]);
    } catch (error) { console.log(error) };
  },

  getEpisodeFilm: async (req, res) => {
    var sql = "SELECT * FROM episode_film ";
    const [result] = await connect.query(sql);
    res.json(result);
  },

  getEpisodeFilmById: async (req, res) => {
    const filmID = req.params.filmID;
    var sql = "SELECT * FROM episode_film WHERE filmID = " + filmID +" ORDER BY episodeID DESC";
    try {
      const [result] = await connect.query(sql);
      res.json(result);
    } catch (error) { console.log(error); }
  },

  getEpisodeFilmByEpisodeId: async (req, res) => {
    const filmID = req.params.filmID;
    const episodeID = req.query.episodeID;

    var sql = "SELECT * FROM episode_film WHERE filmID = " + filmID + " AND episodeID = " + episodeID;
    try {
      const [result] = await connect.query(sql);
      res.json(result)
    } catch (error) { console.log(error) };
  }
};
export default userController;
