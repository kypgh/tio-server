import GroupSpreadsModel from "../models/GroupSpreads.model";
import utilFunctions from "../utils/util.functions";

const groupSpreadsService = {
  getGroupSpreads: async ({ group, symbol, platform }) => {
    let filter = { group, symbol, platform };
    filter = utilFunctions.pruneNullOrUndefinedFields(filter);
    return GroupSpreadsModel.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: "$group",
          symbols: {
            $push: {
              symbol: "$symbol",
              spread: "$spread",
              bid: "$bid",
              ask: "$ask",
              digits: "$digits",
              symbolType: "$symbolType",
            },
          },
        },
      },
      { $project: { _id: 0, group: "$_id", symbols: 1 } },
    ]);
  },
};

export default groupSpreadsService;
