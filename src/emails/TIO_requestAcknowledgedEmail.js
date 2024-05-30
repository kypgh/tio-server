import { DateTime } from "luxon";

const templateData = {
  en: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "en" });
    const result = {
      global_variables: params,
      subject: `${params.request_type} request received (${timeNow})`,
      intro: `Your ${params.request_type} request has been received`,
      content: {
        title: `Dear ${params.full_name},`,
        body1: "We have recevied your request with the following details:",
        body2: params.request_text,
        body3: "Our team will review your request and get back to you soon.",
        closing: `<br><br>${params.company_name}<br>Customer Support Team`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer:",
        risk_disclaimer_body1:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose. Professional client's losses can exceed their deposit. Please see our risk warning policy and seek independent professional advice if you do not fully understand. This information is not directed or intended for distribution to or use by residents of certain countries/jurisdictions including, but not limited to, USA & OFAC. The Company holds the right to alter the aforementioned list of countries at its own discretion.",
        risk_disclaimer_body2:
          "Prime Index Ltd is a Company registered and licensed by Mwali International Services Authority in Comoros Union as an International Business Company with registration number HY00423265 and License Number T2023249.",
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
 *  request_text: String;
 *  request_type: String;
 *  }} emailData
 * @returns {{ templateId: String, dynamicTemplateData: Object }}
 */
const requestAcknowledgementEmail = (language, emailData) => {
  const dynamicTemplateData = (
    templateData[language] ? templateData[language] : templateData["en"]
  )(emailData);

  return {
    templateId: "d-9562cd9ee90e4b988866d000a9c1f6f1",
    dynamicTemplateData,
  };
};

export default requestAcknowledgementEmail;
