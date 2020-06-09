
const Bin = require('../models/Bin');

exports.createBin = async (req, res, next) => {
  try {
    const bin = new Bin(req.body);
    const doc = await bin.save();
    // eslint-disable-next-line no-underscore-dangle
    res.status(201).json({ binId: doc._id });
  } catch (error) {
    next(error); // this will go to the error handler in app.js e.g. if there's a db error above
  }
};

exports.getAllBins = async (req, res, next) => {
  try {
    const list = await Bin.find({}).lean().exec();
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

exports.getBin = async (req, res, next) => {
  try {
    const bin = await Bin.findById(req.params.id).lean().exec();
    res.status(200).json(bin);
  } catch (error) {
    next(error);
  }
};

exports.updateBin = async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const updateObj = req.body;
    const result = await Bin.updateOne({ _id: req.params.id }, updateObj).exec();
    if (result.n === 0) {
      res.status(404).json({ message: 'No bin matches that id' });
      return;
    }
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

exports.deleteBin = async (req, res, next) => {
  try {
    const result = await Bin.deleteOne({ _id: req.params.id }).exec();
    if (result.n === 0) {
      res.status(404).json({ message: 'No bin matches that id' });
      return;
    }
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};
