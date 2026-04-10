const express = require("express");
const Todo = require("../models/Todo");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const filter = req.query.filter; 

    const query = { user: req.user._id };

    const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const safeSearch = escapeRegex(search || "");

    if (safeSearch.trim()) {
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (filter === "completed") query.isCompleted = true;
    if (filter === "pending") query.isCompleted = false;

    const total = await Todo.countDocuments(query);
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      todos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Server error"
});
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
    });

    res.status(201).json(todo);
  } catch (err) {
    console.error(err)
    res.status(500).json({
       message: "Server error"
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json(todo);
  } catch (err) {
    console.error(err)
    res.status(500).json({
     message: "Server error"
    });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { title, description, isCompleted, dueDate, priority } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (isCompleted !== undefined) todo.isCompleted = isCompleted;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (priority !== undefined) todo.priority = priority;

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err)
    res.status(500).json({
       message: "Server error"
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error(err)
    res.status(500).json({
       message: "Server error"
    });
  }
});

router.patch("/mark-all-completed", async (req, res) => {
  try {
    await Todo.updateMany({ user: req.user._id }, { isCompleted: true });
    res.json({ message: "All todos marked as completed" });
  } catch (err) {
    console.error(err)
    res.status(500).json({ 
      message: "Server error"
    });
  }
});

module.exports = router;
