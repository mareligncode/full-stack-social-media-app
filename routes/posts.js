const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");
const { verifyToken, optionallyVerifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Add a root route handler
router.get("/", optionallyVerifyToken, postControllers.getPosts);
router.post("/", verifyToken, upload.single("media"), postControllers.createPost);

router.get("/:id", optionallyVerifyToken, postControllers.getPost);
router.patch("/:id", verifyToken, upload.single("media"), postControllers.updatePost);
router.delete("/:id", verifyToken, postControllers.deletePost);

router.post("/like/:id", verifyToken, postControllers.likePost);
router.delete("/like/:id", verifyToken, postControllers.unlikePost);
router.get("/liked/:id", optionallyVerifyToken, postControllers.getUserLikedPosts);
router.get("/like/:postId/users", postControllers.getUserLikes);

// Add a catch-all for undefined routes
router.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = router;