
const router = require('express').Router();
const {
  createBin, getAllBins, getBin, updateBin, deleteBin
} = require('../controllers/bin');

// create bin
router.post('/', createBin);

// get all bins
router.get('/', getAllBins);

// get specific bin
router.get('/:id', getBin);

// update bin
router.put('/:id', updateBin);

// delete bin
router.delete('/:id', deleteBin);

module.exports = router;
