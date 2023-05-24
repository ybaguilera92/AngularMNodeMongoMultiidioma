import catchAsync from "../utils/catchAsyncUtil.js";
import AppError from "../utils/appErrorUtil.js";
import APIFeatures from "../utils/apiFeaturesUtil.js";
import { logact } from "./logactController.js";
import i18n from "../utils/i18.js";
const deleteOne = (Model, Module) =>
  catchAsync(async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params._id);

      if (!doc) {
        logact(req, Module, "Delete", "err: no document found with that Id!");
        return next(new AppError("No document found with that ID", 404));
      }

      logact(req, Module, "Delete", "succ: register was delete successfull!");
      res.status(204).json(doc);
    } catch (e) {
      logact(req, Module, "Delete", "err: fatal error with that Id!");
      return res.status(404).json({ msg: "Fatal error with that ID!" });
    }
  });

const updateOne = (Model, Module) =>
  catchAsync(async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        logact(req, Module, "Update", "err: no document found with that Id!");
        return next(new AppError("No document found with that ID", 404));
      }

      logact(req, Module, "Update", "succ: register was update successfull!");
      res.status(200).json(doc);
    } catch (e) {
      logact(req, Module, "Update", "err: fatal error with that Id!");
      return res.status(404).json({ msg: "Fatal error with that ID!" });
    }
  });

const createOne = (Model, Module) =>
  catchAsync(async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);

      logact(req, Module, "Update", "succ: register was create successfull!");
      res.status(201).json(doc);
    } catch (e) {
      logact(req, Module, "Create", "err: fatal error!");
      return res.status(404).json({ msg: "Fatal error!" });
    }
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    try {
      let query = Model.findById(req.params._id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;

      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json( doc );
    } catch (e) {
      return res.status(404).json({ msg: "Fatal error with that ID!" });
    }
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    try {
      // To allow for nested GET reviews on tour (hack)
      let filter = {};
      // if (req.params.tourId) filter = { tour: req.params.tourId };

      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      // const doc = await features.query.explain();
      const doc = await features.query;

      // SEND RESPONSE
      console.log(i18n.__('Authenticate'));
      res.status(200).json( doc );
    } catch (e) {
      return res.status(404).json({ msg: "Fatal error with that ID!" });
    }
  });

export { createOne, updateOne, deleteOne, getAll, getOne };
