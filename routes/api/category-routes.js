const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// GET request to find all categories along with the products associated with each category
router.get("/", async (req, res) => {
  try {
    // Sequelize's findAll method
    // Include associated products for each category using the 'include' option
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    
    // Send a successful response with the categories
    res.status(200).json(categories);
  } catch (err) {
    // Send an error response when exception
    res.status(500).json(err);
  }
});

// GET request to find a single category by its ID, along with its associated products
router.get("/:id", async (req, res) => {
  try {
    // Sequelize's findByPk method to find the category by its ID
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    // Checking if the category exists, if not sending a 404 response
    if (!category) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST request to create a new category
router.post("/", async (req, res) => {
  try {
    // Sequelize's create method to add a new category with the provided data
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
    
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT request to update a category by its ID
router.put("/:id", async (req, res) => {
  try {
    // Sequelize's update method to update the category with the provided data
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedCategory[0]) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    res.status(200).json({ message: "Category updated successfully!" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE request to delete a category by its ID
router.delete('/:id', async (req, res) => {
  try {
    // Sequelize's destroy method to delete the category
    const categoryToDelete = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryToDelete) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Exporting the router to be used in other parts of the application
module.exports = router;
