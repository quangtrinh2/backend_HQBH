import { connect } from "../db.js";
import filmData from "../FILE_URL/film.json"  assert { type: "json" };
import episodeData from "../FILE_URL/episodeFilm.json"  assert { type: "json" };
import * as dotenv from 'dotenv';
dotenv.config();
const adminController = {
  addEpisode: async (req, res) => {
    const { filmID, episodeID, url } = req.body;
    var sql = "INSERT INTO episode_film( filmID, episodeID, url ) VALUES (?,?,?)";
    try {
      const [result] = await connect.query(sql, [filmID, episodeID, url]);
      res.json(true);
    } catch (error) {
      console.log(error);
      res.json(false);
    }
  },

  addFilm: async (req, res) => {
    const {
      filmName,
      status,
      point,
      year,
      duration,
      description,
      category,
      url,
    } = req.body;

    var sql = "INSERT INTO film( filmName, status, point, year, duration, description, category, url ) VALUES (?,?,?,?,?,?,?,?)";
    try {
      const [result] = await connect.query(sql, [filmName, status, point, year, duration, description, category, url]);
      res.json(true);
    } catch (error) {
      console.log(error);
      res.json(false);
    }
  },
  insertData: async (req, res) => {
    if (req.params.passwordInsert === process.env.PASSWORD_INSERT) {
      var sql = "INSERT INTO film( filmName, status, point, year, duration, description, category, url ) VALUES ?";
      try {
        let values = [];
        let valuesEpisode = [];
        for (let i = 0; i < filmData.length; i++) {
          values.push([filmData[i].filmName, filmData[i].status, filmData[i].point, filmData[i].year, filmData[i].duration, filmData[i].description, filmData[i].category, filmData[i].url]);
        }
        const [statusInsertFilm] = await connect.query(sql, [values]);
        try {
          Promise.all(
            episodeData.map(async (episode) => {
              sql = "SELECT filmID FROM film WHERE filmName = ?";
              const [result] = await connect.query(sql, [episode.filmName]);
              if (result[0] != null && valuesEpisode.find((episodeCheck) => { return episodeCheck[0] === result[0].filmID && episodeCheck[1] === episode.episodeID }) === undefined)
                valuesEpisode.push([result[0].filmID, episode.episodeID, episode.url]);
            })
          );
          sql = "INSERT INTO episode_film(filmID, episodeID, url) VALUES ?"
          try {
            const [statusInsertEpisode] = await connect.query(sql, [valuesEpisode]);
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
        res.json(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      res.json("Bạn không có quyền truy cập vào web này");
    }
  },
  deleteFilm: async (req, res) => {
    if (req.params.passwordDelete === process.env.PASSWORD_INSERT) {
      var valuesEpisodeNull = [];
      var sql = "SELECT film.filmID, episode_film.episodeID FROM film LEFT JOIN episode_film ON film.filmID = episode_film.filmID";
      try {
        const [film] = await connect.query(sql);
        film.map(async (film) => {
          if (film.episodeID === null) {
            const url = "https://suckplayer.xyz/video/a1a15170543564de6ec386358b88d6d3";
            const episodeID = 1;
            valuesEpisodeNull.push([film.filmID, episodeID, url]);
          }
        }
        )
        sql = "INSERT INTO episode_film(filmID, episodeID, url) VALUES ?"
        try {
          const [statusInsertEpisode] = await connect.query(sql, [valuesEpisodeNull]);
        } catch (error) {
          console.log(error);
        }
        res.json(true);
      } catch (error) { console.log(error) };
    } else res.json("Bạn không có quyền truy cập trang web này");
  },
};
export default adminController;
