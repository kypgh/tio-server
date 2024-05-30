import UserRibbonsModel, {
  SegmentRibbonsModel,
} from "../models/UserRibbons.model";
import errorCodes from "../config/errorCodes";
import HTTPError from "../utils/HTTPError";
import UsersJoinSegmentsModel from "../models/UsersJoinSegments.model";
import usersService from "./users.service";
import QueueService from "./queue.service";
import usersSegmentService from "./usersSegment.service";

const ribbonsService = {
  getRibbonsForUser: async (user_id) => {
    const userSegments = await UsersJoinSegmentsModel.find({ user: user_id });
    const segmentRibbons = await SegmentRibbonsModel.find({
      segment: { $in: userSegments.map((s) => s.segment) },
    }).sort({ updatedAt: -1 });
    const userRibbons = await UserRibbonsModel.find({ user: user_id });
    return { userRibbons, segmentRibbons };
  },
  getRibbonsForSegment: async (segment_id) => {
    return SegmentRibbonsModel.find({ segment: segment_id });
  },
  /**
   * @param {{ user_id: String, color: String, title: String, url: String, isExternal: Boolean, enabled: Boolean, closable: Boolean }} ribbon
   */
  createRibbonForUser: async (ribbon) => {
    const existingRibbon = await UserRibbonsModel.findOne({
      user: ribbon.user_id,
    }).populate("user");
    if (existingRibbon) {
      throw new HTTPError(
        "User already has a ribbon",
        409,
        errorCodes.userHasRibbon
      );
    }

    const { ctrader_id } = await usersService.getUserById(ribbon.user_id);
    const ribbonDoc = new UserRibbonsModel({ ...ribbon, user: ribbon.user_id });
    await QueueService.usersRibbon([ctrader_id]);
    return ribbonDoc.save();
  },
  /**
   * @param {{ segment_id: String, color: String, title: String, url: String, isExternal: Boolean, enabled: Boolean, closable: Boolean }} ribbon
   * @returns
   */
  createRibbonForSegment: async (ribbon) => {
    const existingRibbon = await SegmentRibbonsModel.findOne({
      segment: ribbon.segment_id,
    });
    if (existingRibbon) {
      throw new HTTPError(
        "Segment already has a ribbon",
        409,
        errorCodes.segmentHasRibbon
      );
    }
    const users = await usersSegmentService.getSegmentUsers(ribbon.segment_id);
    const ribbonDoc = new SegmentRibbonsModel({
      ...ribbon,
      segment: ribbon.segment_id,
    });
    await QueueService.usersRibbon(users.map((u) => u.user.ctrader_id));
    return ribbonDoc.save();
  },
  /**
   *
   * @param {String} ribbonId
   * @param {{ color: String, title: String, url: String, isExternal: Boolean, enabled: Boolean, closable: Boolean }} ribbon
   */
  updateRibbonForUser: async (ribbonId, ribbon) => {
    const ribbonDoc = await UserRibbonsModel.findOneAndUpdate(
      { _id: ribbonId },
      { $set: ribbon },
      { returnDocument: "after" }
    ).populate({
      path: "user",
      select: "ctrader_id",
    });
    if (!ribbonDoc) {
      throw new HTTPError("Ribbon not found", 404, errorCodes.ribbonNotFound);
    }

    await QueueService.usersRibbon([ribbonDoc.user.ctrader_id]);
    return ribbonDoc;
  },
  /**
   *
   * @param {String} ribbonId
   * @param {{ color: String, title: String, url: String, isExternal: Boolean, enabled: Boolean, closable: Boolean }} ribbon
   */
  updateRibbonForSegment: async (ribbonId, ribbon) => {
    const ribbonDoc = await SegmentRibbonsModel.findOneAndUpdate(
      { _id: ribbonId },
      { $set: ribbon },
      { returnDocument: "after" }
    );
    if (!ribbonDoc) {
      throw new HTTPError("Ribbon not found", 404, errorCodes.ribbonNotFound);
    }
    const users = await usersSegmentService.getSegmentUsers(ribbonDoc.segment);
    await QueueService.usersRibbon(users.map((u) => u.user.ctrader_id));
    return ribbonDoc;
  },
};

export default ribbonsService;
