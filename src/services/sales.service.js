import mongoose from "mongoose";
import UsersModel from "../models/Users.model";
import CRMPermissionsModel from "../models/CRMPermissions.model";
import { DEFAULT_SALES_AGENT_ID } from "../config/envs";

const salesService = {
  getSalesRepIdForUser: async (user) => {
    const qualifiedCRMAgents = await CRMPermissionsModel.find({
      department: "sales",
      sales_rotation_countries: user.country,
      brand: user.brand,
      suspended: false,
    });
    if (qualifiedCRMAgents.length === 0) return DEFAULT_SALES_AGENT_ID; // Stefanos Mitsi CRM User ID
    // prettier-ignore
    const usersPerAgent = await UsersModel.aggregate([
      { $match: { sales_agent: { $in: qualifiedCRMAgents.map((agent) => mongoose.Types.ObjectId(agent.crmuserId)) } } },
      { $group: { _id:  "$sales_agent", count: { $sum: 1 } } },
    ]);
    let leastUsers = 10000000;
    let leastUsersAgent;
    for (const agent of qualifiedCRMAgents) {
      let usersOnAgent = usersPerAgent.find(
        (v) => String(v._id) == agent.crmuserId
      );
      if (!usersOnAgent) return agent.crmuserId;
      if (usersOnAgent.count < leastUsers) {
        leastUsers = usersOnAgent.count;
        leastUsersAgent = agent;
      }
    }
    return leastUsersAgent.crmuserId;
  },
};

export default salesService;
