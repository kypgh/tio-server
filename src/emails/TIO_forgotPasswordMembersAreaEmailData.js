import { DateTime } from "luxon";

const templateData = {
  en: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "en" });
    const result = {
      global_variables: params,
      subject: `Request to reset members area password (${timeNow})`,
      content: {
        title: `Dear ${params.full_name},`,
        body1: `Click the link below to reset your password:`,
        body2: `<a href="${params.reset_password_link}" target="_blank">Click here</a>`,
        body3: `If you didn't request a password change, please reply to this email so that we can investigate what happened <a href="mailto:${params.support_email}">${params.support_email}</a>`,
        closing: `Kind Regards,<br><br>${params.company_name}`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer:",
        risk_disclaimer_body1:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose. Professional client's losses can exceed their deposit. Please see our risk warning policy and seek independent professional advice if you do not fully understand. This information is not directed or intended for distribution to or use by residents of certain countries/jurisdictions including, but not limited to, USA & OFAC. The Company holds the right to alter the aforementioned list of countries at its own discretion.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. is a Company registered in Saint Vincent and the Grenadines as an International Business Company with registration number 24986 IBC 2018.",
        risk_disclaimer_body3:
          "The registered office of the Company is Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. is authorised by Mwali International Services Authority in Comoros Union with license number T2023224 with registered office at Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets is a trading name of TIO Markets Ltd.",
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
const createForgotPasswordMembersAreaEmailData = (
  language,
  { full_name, reset_password_link, company_name, year, support_email }
) => {
  const dynamicTemplateData = (
    templateData[language] ? templateData[language] : templateData["en"]
  )({
    full_name,
    reset_password_link,
    company_name,
    year,
    support_email,
  });

  return {
    templateId: "d-94ee6cbcffac4a90b8b0fb2830ec60e1",
    dynamicTemplateData,
  };
};

export default createForgotPasswordMembersAreaEmailData;
