import { DateTime } from "luxon";

const templateData = {
  en: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "en" });
    const result = {
      global_variables: params,
      subject: `Withdrawal Processed (${timeNow})`,
      intro: "Your withdrawal request has been processed successfully",
      content: {
        title: `Dear ${params.full_name},`,
        body1: `Your withdrawal request for <b>${params.amount} ${params.currency}</b> from account <b>${params.accountLogin}</b> has been successfully processed.`,
        closing: `<br><br>${params.company_name}<br>Customer Support Team`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer:",
        risk_disclaimer_body1:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose. Professional client's losses can exceed their deposit. Please see our risk warning policy and seek independent professional advice if you do not fully understand. This information is not directed or intended for distribution to or use by residents of certain countries/jurisdictions including, but not limited to, USA & OFAC. The Company holds the right to alter the aforementioned list of countries at its own discretion.",
        risk_disclaimer_body2:
          "TIO Markets Ltd is a Company registered and licensed by Mwali International Services Authority in Comoros Union as an International Business Company with registration number HY00423265 and License Number T2023249.",
        risk_disclaimer_body3:
          "The registered office of the Company is Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. Prime Index is a trading name of Prime Index Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. All Rights Reserved.`,
      },
    };
    return result;
  },
};

/**
 *
 * @param {String} language
 * @param {{
 *  full_name: String;
 *  company_name: String;
 *  year: String;
 *  support_email: String;
 *  amount: String;
 *  currency: String;
 *  accountLogin: String;
 * }} emailData
 * @returns {{ templateId: String, dynamicTemplateData: Object }}
 */
const withdrawalEmailProcessed = (language, emailData) => {
  const dynamicTemplateData = (
    templateData[language] ? templateData[language] : templateData["en"]
  )(emailData);

  return {
    templateId: "d-609b3eb87c7c49f0859079b0690f0a7d",
    dynamicTemplateData,
  };
};

export default withdrawalEmailProcessed;
