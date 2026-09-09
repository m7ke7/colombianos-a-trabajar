const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { requireAdmin } = require('../middleware/adminMiddleware');

// GET: Obtener todas las ofertas
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find().sort({ postedDate: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las ofertas', error: err.message });
  }
});

// GET: Obtener una oferta por ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la oferta', error: err.message });
  }
});

// POST: Crear una nueva oferta
router.post('/', requireAdmin, async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (err) {
    res.status(400).json({ message: 'Error al guardar la oferta', error: err.message });
  }
});

// PATCH: Actualizar una oferta existente
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedOffer) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json(updatedOffer);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar la oferta', error: err.message });
  }
});

// DELETE: Eliminar una oferta existente
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);

    if (!deletedOffer) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar la oferta', error: err.message });
  }
});

module.exports = router;