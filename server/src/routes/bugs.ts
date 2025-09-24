import { Router } from "express";

const router = Router();

// GET /api/bugs - Get all bugs
router.get("/", (req, res) => {
  res.json({
    message: "Get all bugs endpoint",
    bugs: [], // Empty for now
  });
});

// POST /api/bugs - Create a new bug
router.post("/", (req, res) => {
  res.json({
    message: "Create bug endpoint",
    data: req.body,
  });
});

// GET /api/bugs/:id - Get single bug
router.get("/:id", (req, res) => {
  res.json({
    message: `Get bug ${req.params.id} endpoint`,
    id: req.params.id,
  });
});

export default router;
