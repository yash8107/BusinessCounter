import db from '../models/index.js';
const { Product } = db;

// ✅ Create a Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, basePrice, salePrice, currency, quantityInStock } = req.body;
    const user_providerId = req.user.id;

    if (!user_providerId) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    const newProduct = await Product.create({
      name, description, category, basePrice, salePrice, currency, quantityInStock, user_providerId,
    });

    res.status(201).json({ status: 'success', data: newProduct });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ✅ Update a Product
export const updateProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, description, category, basePrice, salePrice, currency, quantityInStock } = req.body;
    const user_providerId = req.user.id;

    if (!user_providerId) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    const product = await Product.findOne({ where: { uuid, user_providerId } });
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    await product.update({ name, description, category, basePrice, salePrice, currency, quantityInStock });

    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ✅ Delete a Product
export const deleteProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user_providerId = req.user.id;

    if (!user_providerId) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    const product = await Product.findOne({ where: { uuid, user_providerId } });
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    await product.destroy();

    res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ✅ Get Product(s)
export const getProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user_providerId = req.user.id;

    if (uuid) {
      const product = await Product.findOne({ where: { uuid, user_providerId } });
      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }
      return res.status(200).json({ status: 'success', data: product });
    } else {
      if (!user_providerId) {
        return res.status(400).json({ status: 'error', message: 'User ID is required' });
      }
      const products = await Product.findAll({ where: { user_providerId } });
      return res.status(200).json({ status: 'success', data: products });
    }
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
