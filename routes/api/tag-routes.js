const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// GET route to find all tags with their products
router.get("/", async (req, res) => {
  // Use sequelize to find all tags with their product data through the ProductTag join table
  try {
    const tags = await Tag.findAll({
      include: {
        model: Product,
        through: ProductTag,
      },
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route to find a tag by its ID with its products
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: {
        model: Product,
        through: ProductTag,
      },
    });

    if (!tag) {
      res.status(404).json({ message: "Tag not found!" });
      return;
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route to create a new tag
router.post("/", async (req, res) => {
  try {
    // Use Sequelize to create a new tag with the request body
    const newTag = await Tag.create(req.body);
    // Send a successful response with the newly created tag data
    res.status(200).json(newTag);
  } catch (err) {
    // Handle errors and send an error response
    res.status(400).json(err);
  }
});

// PUT route to update a tag's name by its ID
router.put("/:id", async (req, res) => {
  try {
    // Use Sequelize to update a tag's data where the ID matches the request parameters ID
    const updatedTag = await Tag.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedTag[0] === 0) {
      res.status(404).json({ message: "Tag not found!" });
      return;
    }

    res.status(200).json({ message: "Tag updated successfully!" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE route to delete a tag by its ID
router.delete("/:id", async (req, res) => {
  try {
    // Use Sequelize to delete a tag where the ID matches the request parameters ID
    const deletedRows = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      res.status(404).json({ message: "Tag not found!" });
      return;
    }

    res.status(200).json({ message: "Tag deleted successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
