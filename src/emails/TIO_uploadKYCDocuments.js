import { DateTime } from "luxon";

const templateData = {
  en: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "en" });
    const result = {
      global_variables: params,
      subject: `KYC documents upload (${timeNow})`,
      intro: "Upload KYC documents",
      content: {
        title: `Dear ${params.full_name},`,
        body1: "test!",
        body2: "test.",
        body3: "If you haven't already done so, visit your portal now to:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Deposit funds</a></li><li><a href="${params.open_live_account_url}" target="_blank">Open a Live trading account</a></li></ul>`,
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
 * @param {Object} param1
 * @returns {{ templateId: String, dynamicTemplateData: Object }}
 */
const uploadKYCDocuments = (
  language,
  { full_name, company_name, year, support_email }
) => {
  const dynamicTemplateData = (
    templateData[language] ? templateData[language] : templateData["en"]
  )({
    full_name,
    company_name,
    year,
    support_email,
  });

  return {
    templateId: "d-e764de2a1191432a88429c6956e0a8ff",
    dynamicTemplateData,
  };
};

export default uploadKYCDocuments;
