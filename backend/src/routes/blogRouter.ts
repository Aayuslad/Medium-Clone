import { Hono } from "hono";
// controllers
import { getBlog, getAllBlogs, createBlog, updateBlog, deleteBlog } from "../controller/blogController";
const router = new Hono();

router.get("/bulk", getAllBlogs);
router.get("/:id", getBlog);
router.post("/", createBlog);
router.put("/", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
