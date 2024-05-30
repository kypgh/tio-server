import UserSegmentModel from "../models/UserSegment.model";
import errorCodes from "../config/errorCodes";
import UsersModel from "../models/Users.model";
import UsersJoinSegmentsModel from "../models/UsersJoinSegments.model";
import HTTPError from "../utils/HTTPError";
import mongoose from "mongoose";
import utilFunctions from "../utils/util.functions";

const getUsersForSegment = async (filters, segmentId) => {
  // prettier-ignore
  return await UsersModel.aggregate([
    { $lookup: { from: "useraccounts", localField: "_id", foreignField: "user", as: "accounts_info", }, },
    { $lookup: { from: "useraccounts", localField: "_id", foreignField: "user", as: "accounts", pipeline: [ { $group: { _id: "$environment_type", count: { $sum: 1 } } }, ], }, },
    { $lookup: { from: "usertransactions", localField: "_id", foreignField: "user", as: "user_transactions", pipeline: [ { $match: { transaction_status: "approved" } }, { $sort: { createdAt: 1 } }, ], }, },
    { $match: filters, },
    { $project: { _id: 0, user: "$_id", segment: mongoose.Types.ObjectId(segmentId), }, },
  ]);
};

const usersSegmentService = {
  getSegmentUsers: async (segmentId) => {
    return UsersJoinSegmentsModel.find({ segment: segmentId }).populate({
      path: "user",
      select: "ctrader_id",
    });
  },
  getSegmentById: async (segmentId) => {
    return UserSegmentModel.findById(segmentId);
  },
  getSegmentClientsById: async (segmentId, brand, page = 1, limit = 5) => {
    const aggregation = UsersJoinSegmentsModel.aggregate([
      { $match: { segment: mongoose.Types.ObjectId(segmentId), brand } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user1",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$user1", 0] }, "$$ROOT"],
          },
        },
      },
    ]);
    let resutls = UsersJoinSegmentsModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });
    resutls.docs = resutls.docs.map((doc) => {
      utilFunctions.decimal2JSON(doc);
      return doc;
    });
    return resutls;
  },
  createSegment: async (name, filters, filtersString, brand) => {
    //check if segment already exists
    let existingSegment = await UserSegmentModel.findOne({ name, brand });
    if (existingSegment) {
      throw new HTTPError(
        "Segment with that name already exists",
        409,
        errorCodes.segmentAlreadyExists
      );
    }

    let segment = await UserSegmentModel.create({
      filters: filters,
      name: name,
      filtersString: filtersString,
      brand: brand,
    });

    let usersSegment = await getUsersForSegment(filters, segment._id);

    if (usersSegment.length > 0)
      await UsersJoinSegmentsModel.insertMany(usersSegment);
    return segment;
  },
  getAllSegments: async (brand) => {
    let result = await UserSegmentModel.aggregate([
      { $match: { brand: brand } },
      {
        $lookup: {
          from: "usersjoinsegments",
          localField: "_id",
          foreignField: "segment",
          as: "totalUsers",
          pipeline: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);
    result = result.map((seg) => {
      seg.totalUsers = seg.totalUsers.length > 0 ? seg.totalUsers[0].count : 0;
      return seg;
    });
    return result;
  },
  deleteSegment: async (segment_id) => {
    try {
      await UserSegmentModel.deleteOne({ _id: segment_id });
      await UsersJoinSegmentsModel.deleteMany({
        segment: segment_id,
      });
      // TODO: remove ribbons if there is one for this segment.
      return `segment with is ${segment_id} has been deleted`;
    } catch (error) {
      console.error(error);
      throw new HTTPError(
        "Something went wrong",
        404,
        errorCodes.queryValidation
      );
    }
  },
  updateSegment: async (segment_Id, name, filters, filtersString) => {
    let existingSegment = await UserSegmentModel.findOne({
      name,
      _id: { $ne: segment_Id },
    });
    if (existingSegment) {
      throw new HTTPError(
        "Segment with that name already exists",
        409,
        errorCodes.segmentAlreadyExists
      );
    }
    let segment = await UserSegmentModel.findOneAndUpdate(
      { _id: segment_Id },
      {
        $set: {
          name: name,
          filters: filters,
          filtersString: filtersString,
        },
      }
    );

    let usersSegment = await getUsersForSegment(filters, segment_Id);
    if (usersSegment.length > 0) {
      await UsersJoinSegmentsModel.deleteMany({
        user: {
          $in: usersSegment.map((user) => user.user),
        },
        segment: segment_Id,
      });
      await UsersJoinSegmentsModel.insertMany(usersSegment);
    }
    return segment;
  },
};

export default usersSegmentService;
