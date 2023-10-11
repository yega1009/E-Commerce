const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// GET route to fetch all products including their categories and tags
router.get("/", async (req, res) => {
  try {
    // Sequelize's findAll method to get all products with included Category and Tag data
    const products = await Product.findAll({
      // The tags associated with each product, as per the ProductTag table, are fetched from the Tag table.
      include: [Category, { model: Tag, through: ProductTag }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route to fetch a product by its ID, including its category and tags
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }],
    });

    if (!product) {
      res.status(404).json({ message: "Product not found!" });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route to create a new product with its tags
router.post("/", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // If there are tags for the product, create entries in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        // Bulk create entries in the ProductTag model
        return ProductTag.bulkCreate(productTagIdArr);
      }
      
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// PUT route to update the product data with its tags
router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // Filter out new tags and removing old tag associations
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // Identify tags to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          
          // Add and remove operations
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE route to remove a product by its ID
router.delete("/:id", async (req, res) => {
  try {
    // Sequelize's destroy method to delete the product
    const deletedRows = await Product.destroy({ where: { id: req.params.id } });

    if (deletedRows === 0) {
      res.status(404).json({ message: "Product not found!" });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
