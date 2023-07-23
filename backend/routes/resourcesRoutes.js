const express = require('express');
const router = express.Router();
const Resource = require('../models/resources');

// Trova tutte le risorse con il dato isActive corrispondente a true
router.get('/active', async (req, res) => {
  try {
    const activeResources = await Resource.find({ isActive: true });
    res.json(activeResources);
  } catch (error) {
    console.error('Error finding resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Trova tutte le risorse con il dato age maggiore di 26
router.get('/above-age', async (req, res) => {
  try {
    const ageGoal = 26;
    const resourcesAboveAge = await Resource.find({ age: { $gt: ageGoal } });
    res.json(resourcesAboveAge);
  } catch (error) {
    console.error('Error finding resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Trova tutte le risorse con il dato age maggiore di 26 e minore o uguale a 30
router.get('/age-range', async (req, res) => {
  try {
    const ageGreaterThan = 26;
    const ageLessThanOrEqual = 30;
    const resourcesInRange = await Resource.find({ age: { $gt: ageGreaterThan, $lte: ageLessThanOrEqual } });
    res.json(resourcesInRange);
  } catch (error) {
    console.error('Error finding resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Trova tutte le risorse con il dato eyes che sia brown o blue
router.get('/eye-colors', async (req, res) => {
  try {
    const eyeColors = ['brown', 'blue'];
    const resourcesWithEyeColors = await Resource.find({ eyeColor: { $in: eyeColors } });
    res.json(resourcesWithEyeColors);
  } catch (error) {
    console.error('Error finding resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Trova tutte le risorse che non presentano il dato eyes uguale a green
router.get('/non-green-eyes', async (req, res) => {
  try {
    const eyeColorToExclude = 'green';
    const resourcesWithoutGreenEyes = await Resource.find({ eyeColor: { $ne: eyeColorToExclude } });
    res.json(resourcesWithoutGreenEyes);
  } catch (error) {
    console.error('Error finding resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Trova tutte le risorse che non presentano il dato eyes uguale a green e neanche blue
router.get('/non-green-non-blue-eyes', async (req, res) => {
  try {
    const eyeColorsToExclude = ['green', 'blue'];
    const resourcesWithoutGreenOrBlueEyes = await Resource.find({ eyeColor: { $nin: eyeColorsToExclude } });
    res.json(resourcesWithoutGreenOrBlueEyes);
  } catch (error) {
    console.error('Error finding resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Trova tutte le risorse con il dato company uguale a "FITCORE" e ritorna solo l'email
router.get('/fitcore-emails', async (req, res) => {
  try {
    const companyName = 'FITCORE';
    const resourcesWithFitcoreCompany = await Resource.find({ company: companyName }).select('email');
    res.json(resourcesWithFitcoreCompany);
  } catch (error) {
    console.error('Error finding resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;