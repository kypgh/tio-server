import { TIO_BRANDS } from "../src/config/enums";
import UserSegmentModel from "../src/models/UserSegment.model";

const migration007 = {
  up: async () => {
    await UserSegmentModel.updateMany({}, { $set: { brand: TIO_BRANDS.TIO } });
  },
  down: async () => {},
};

export default migration007;
