import mongoose from "mongoose";
const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  }
);

export default  AddressSchema;
