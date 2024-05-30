import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import Joi from "joi";
import { countryDataCodes } from "../../../../config/countries";
import usersService from "../../../../services/users.service";

const verifyUserDetailsSchema = Joi.object({
  title: Joi.string().valid("Mrs", "Mr", "Ms", "Dr").required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dob: Joi.string().isoDate().required(),
  country: Joi.string()
    .valid(...countryDataCodes.map((c) => c.iso2.toUpperCase()))
    .required(),
  nationality: Joi.string()
    .valid(...countryDataCodes.map((c) => c.iso2.toUpperCase()))
    .required(),
  identificationNumber: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  postcode: Joi.string().required(),
  houseNumber: Joi.string().required(),
  unitNumber: Joi.string().allow("").default(""),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = verifyUserDetailsSchema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }

  const result = await usersService.updateUserExtraDetails(req.user._id, value);

  res.status(200).json({ message: "Success" });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
