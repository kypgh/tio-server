import CtraderOrdersModel from "../models/TradeModels/CtraderOrders.model";

const ctraderOrdersService = {
  getPaginated: async (page, limit) => {
    return CtraderOrdersModel.paginate(
      {},
      {
        page,
        limit,
        populate: ["account", { path: "user", select: "first_name" }],
      }
    );
  },
  findOrder: async (orderId) => {
    return CtraderOrdersModel.findOne({ orderId });
  },
  createOrUpdateOrder: async (
    order,
    account_id,
    user_id,
    position_id,
    enviroment
  ) => {
    return CtraderOrdersModel.findOneAndUpdate(
      { orderId: order.orderId, account: account_id },
      {
        user: user_id,
        account: account_id,
        position: position_id,
        ...order,
        environment_type: enviroment,
      },
      { upsert: true, returnDocument: "after" }
    );
  },
};

export default ctraderOrdersService;
