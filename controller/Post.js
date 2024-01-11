import DB from "../db/db.js";

export const addPost = (req, res) => {
  const { desc, imgUrl } = req.body;
  DB.query(
    "INSERT INTO posts (`user_id`, `desc`) VALUES (?, ?)",
    [req.user._id, desc],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (imgUrl !== "") {
        DB.query(
          "INSERT INTO post_media (`post_id`, `media_url`, `user_id`) VALUES (?, ?, ?)",
          [result.insertId, imgUrl, req.user._id],
          (err, result) => {
            if (err) return res.status(500).send(err);

            if (result) {
              return res.status(200).send("Post uploaded...");
            }
          }
        );
      }
    }
  );
};

export const getUserPosts = (req, res) => {
  let query =
    "SELECT * FROM posts p JOIN post_media pm ON p.id = pm.post_id WHERE p.user_id = ? ORDER BY date DESC";
  DB.query(query, [req.user._id], (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};
