import { DateTime } from "luxon";
import UserTransactionsDailyStatsModel from "../models/UserTransactionsDailyStats.model";
import userTransactionsService from "./userTransactions.service";

const userTransactionsDailyStatsService = {
  getMonthTransactionsStats: async (brand, allowedCountries) => {
    const lastDoc = await UserTransactionsDailyStatsModel.findOne({
      brand: brand,
      ...(allowedCountries
        ? {
            allowed_countries: {
              $size: allowedCountries.length,
              $in: allowedCountries,
            },
          }
        : { allowed_countries: [] }),
    }).sort({
      date: -1,
    });
    const cacheTimeout = DateTime.now()
      .setZone("Asia/Nicosia")
      .minus({ minutes: 5 })
      .toJSDate();
    if (!lastDoc || lastDoc.createdAt < cacheTimeout) {
      const twoMonthsAgo = DateTime.now()
        .setZone("Asia/Nicosia")
        .startOf("month")
        .minus({ months: 1 })
        .toJSDate();
      const transactionsDailyStats =
        await userTransactionsService.calculateDailyTransactionStats(
          twoMonthsAgo,
          null,
          brand,
          allowedCountries
        );
      await UserTransactionsDailyStatsModel.deleteMany({
        brand,
        ...(allowedCountries
          ? {
              allowed_countries: {
                $size: allowedCountries.length,
                $in: allowedCountries,
              },
            }
          : { allowed_countries: [] }),
      });
      await UserTransactionsDailyStatsModel.insertMany(transactionsDailyStats);
    }
    // prettier-ignore
    const startOfLastMonth = DateTime.now().setZone("Asia/Nicosia").startOf("month").minus({ months: 1 }).toJSDate();
    // prettier-ignore
    const [thisMonth, secondLast] = await UserTransactionsDailyStatsModel.aggregate([
      { $match: { date: { $gte: startOfLastMonth }, brand, ...(allowedCountries ? { allowed_countries: { $size: allowedCountries.length, $in: allowedCountries, } } : { allowed_countries: [] }) } },
      { $group: { _id: { month: {$month: {date: "$date"}}, year: {$year: {date:"$date"}} }, total_deposits: { $sum: "$total_deposits" }, total_deposits_amount: { $sum: "$total_deposits_amount" }, total_withdrawals: { $sum: "$total_withdrawals" }, total_withdrawals_amount: { $sum: "$total_withdrawals_amount" }, daily_transactions: { $push: "$$ROOT" }, }, },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);
    if (!thisMonth) return {};
    thisMonth.total_deposits_amount = Number(
      thisMonth.total_deposits_amount
    ).toFixed(2);
    thisMonth.total_withdrawals_amount = Number(
      thisMonth.total_withdrawals_amount
    );
    if (!secondLast) {
      thisMonth.deposits_performance_increase = "NA";
      thisMonth.withdrawals_performance_increase = "NA";
    } else {
      const prev_deposit = Number(secondLast?.total_deposits_amount);
      const prev_withdrawal = Number(secondLast?.total_withdrawals_amount);
      thisMonth.deposits_performance_increase =
        prev_deposit === 0
          ? "NA"
          : ((thisMonth.total_deposits_amount - prev_deposit) / prev_deposit) *
            100;
      thisMonth.withdrawals_performance_increase =
        prev_withdrawal === 0
          ? "NA"
          : ((thisMonth.total_withdrawals_amount - prev_withdrawal) /
              prev_withdrawal) *
            100;
    }
    thisMonth.daily_transactions = thisMonth.daily_transactions.map((t) => {
      t.total_deposits_amount = Number(t.total_deposits_amount).toFixed(2);
      t.total_withdrawals_amount = Number(t.total_withdrawals_amount).toFixed(
        2
      );
      return t;
    });
    //Format transactions for the month!
    const { year: currentYear, month: currentMonth } = thisMonth._id;
    const tempArr = Array.from(
      {
        length: DateTime.fromObject({ year: currentYear, month: currentMonth })
          .daysInMonth,
      },
      (_) => 0
    );
    const formatted = {
      labels: tempArr.map(
        (_, i) =>
          `${currentYear}-${currentMonth}-${i + 1 < 10 ? "0" : ""}${i + 1}`
      ),
      deposits: tempArr,
      withdrawals: tempArr,
      deposit_amounts: tempArr.map((_) => "0.00"),
      withdrawal_amounts: tempArr.map((_) => "0.00"),
    };
    thisMonth.daily_transactions.forEach((t) => {
      const idx = formatted.labels.indexOf(t.date_id);
      formatted.deposits[idx] = t.total_deposits;
      formatted.withdrawals[idx] = t.total_withdrawals;
      formatted.deposit_amounts[idx] = t.total_deposits_amount;
      formatted.withdrawal_amounts[idx] = t.total_withdrawals_amount;
    });
    thisMonth.daily_transactions_month_format = formatted;
    return thisMonth;
  },
};

export default userTransactionsDailyStatsService;
