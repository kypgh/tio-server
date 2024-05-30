import twilio from "twilio";
import { TWILLIO_MAPPED_LOCALES } from "../config/enums";
import { TWILIO_SID, TWILIO_TOKEN } from "../config/envs";
import errorCodes from "../config/errorCodes";
import HTTPError from "../utils/HTTPError";

const VERIFY_SERVICE_SID = "VA68bad02770fdb72e9ea058bcfee4dfe3";
const twilio_client = twilio(TWILIO_SID, TWILIO_TOKEN);

const twilioSmsService = {
  genOTP: async (phone, locale = "en") => {
    locale = TWILLIO_MAPPED_LOCALES[locale] ?? "en";
    phone = phone.substring(1) === "+" ? phone : `+${phone}`;
    return twilio_client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms", locale })
      .catch((err) => {
        console.error(err);
        throw new HTTPError("Twillio error", 500, errorCodes.twillioError);
      });
  },
  verifyOTP: async (phone, phone_otp) => {
    phone = phone.substring(1) === "+" ? phone : `+${phone}`;
    return twilio_client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: phone_otp })
      .catch((err) => {
        console.error(err);
        Promise.reject(
          new HTTPError("Invalid OTP", 400, errorCodes.invalidPhoneOTP)
        );
      });
  },
  sendResetPasswordLink: async (phone, token, locale = "en") => {
    phone = phone.substring(1) === "+" ? phone : `+${phone}`;
    return twilio_client.messages
      .create({
        to: phone,
        from: "TIOMarkets",
        body: `To reset your password use the following code:\n${token}`,
      })
      .catch((err) => {
        console.error(err);
        return Promise.reject(
          new HTTPError("Twillio error", 500, errorCodes.twillioError)
        );
      });
  },
};

export default twilioSmsService;
