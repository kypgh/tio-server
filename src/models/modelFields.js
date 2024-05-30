import _ from "lodash";
import { CTRADER_ORDERS_FIELDS } from "./TradeModels/CtraderOrders.model";
import { CTRADER_POSITIONS_FIELDS } from "./TradeModels/CtraderPositions.model";
import { CTRADER_DEALS_FIELDS } from "./TradeModels/CtraderDeals.model";
import { USER_ACCOUNTS_FIELD } from "./UserAccounts.model";
import { USERS_FIELDS } from "./Users.model";
import { USERS_TRANSACTIONS_FIELDS } from "./UserTransactions.model";

function populatedModelFields(model, prefix) {
  return _.transform(
    model,
    (acc, curr, key) => {
      acc[key] = { ...curr, value: prefix + curr.value };
      return acc;
    },
    {}
  );
}

export const MODEL_FIELDS = {
  users: USERS_FIELDS,
  positions: {
    ...CTRADER_POSITIONS_FIELDS,
    ...populatedModelFields(USERS_FIELDS, "user."),
    ...populatedModelFields(USER_ACCOUNTS_FIELD, "account."),
  },
  orders: CTRADER_ORDERS_FIELDS,
  deals: CTRADER_DEALS_FIELDS,
  userTransactions: {
    ...USERS_TRANSACTIONS_FIELDS,
    ...populatedModelFields(
      {
        userId: USERS_FIELDS.userId,
        firstName: USERS_FIELDS.firstName,
        lastName: USERS_FIELDS.lastName,
        cid: USERS_FIELDS.cid,
      },
      "user."
    ),
    ...populatedModelFields(
      {
        accountId: USER_ACCOUNTS_FIELD.accountId,
        loginId: USER_ACCOUNTS_FIELD.loginId,
      },
      "userAccount."
    ),
  },
};
