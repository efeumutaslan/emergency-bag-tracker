// backend/controllers/itemController.js
const Item = require('../models/itemModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all items for a user
// @route   GET /api/items
// @access  Private
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ userId: req.user._id });
  res.json(items);
});

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  const { name, expirationDate, category, weight, weightUnit, quantity, notes, isEssential } = req.body;

  const item = await Item.create({
    userId: req.user._id,
    name,
    expirationDate,
    category,
    weight,
    weightUnit,
    quantity,
    notes,
    isEssential
  });

  if (item) {
    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error('Invalid item data');
  }
});

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Private
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item && item.userId.toString() === req.user._id.toString()) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  const { name, expirationDate, category, weight, weightUnit, quantity, notes, isEssential } = req.body;

  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Check if the user owns the item
  if (item.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this item');
  }

  // Update the item
  item.name = name || item.name;
  item.expirationDate = expirationDate || item.expirationDate;
  item.category = category || item.category;
  item.weight = weight || item.weight;
  item.weightUnit = weightUnit || item.weightUnit;
  item.quantity = quantity || item.quantity;
  item.notes = notes !== undefined ? notes : item.notes;
  item.isEssential = isEssential !== undefined ? isEssential : item.isEssential;

  const updatedItem = await item.save();
  res.json(updatedItem);
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Check if the user owns the item
  if (item.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this item');
  }

  await item.remove();
  res.json({ message: 'Item removed' });
});

module.exports = {
  getItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem
};