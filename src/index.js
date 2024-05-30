import express from "express";
import { PORT } from "./config/envs";
import folderRouter from "./utils/folderRouter";
import path from "path";
import mongooseService from "./services/mongoose.service";
import { loggerConsole, loggerLogtail } from "./config/logger";
import cors from "cors";
import axios from "axios";
import emailService from "./services/email.service";
import usersService from "./services/users.service";
import twilioSmsService from "./services/twilioSms.service";
import statusPageService from "./services/statuspage.service";
import { TIO_BRANDS } from "./config/enums";

const app = express();

app.use(
  cors({
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(loggerConsole);
app.use(loggerLogtail);
app.use(express.json());

mongooseService.connect().then(() => {
  folderRouter(app, path.resolve(__dirname, "./routes")).then(() => {
    app.use("*", (req, res) => {
      // 404 -- When no route is matched
      res.status(404).json({ message: "Route not found" });
    });

    app.use((err, req, res, next) => {
      if (err instanceof URIError) {
        return res.status(400).json({ message: "Invalid URI" });
      }
      if (err.name === "HTTPError") {
        if (err.responseBody?.code !== 25) {
          console.error(err.message);
        }
        res.status(err.status).json(err.responseBody);
        return;
      }
      if (typeof err?.toJSON === "function") {
        console.error(err.toJSON());
      } else {
        console.error(err);
      }

      if (req.path.startsWith("/api/dashboard")) {
        statusPageService.floCrmIncident({
          method: req.method,
          path: req.path,
          message: err.message,
        });
      } else if (req.path.startsWith("/api/membersArea")) {
        if (req.user?.brand === TIO_BRANDS.TIO) {
          statusPageService.clientAreaTioIncident({
            method: req.method,
            path: req.path,
            message: err.message,
          });
        } else if (req.user?.brand === TIO_BRANDS.PIX) {
          statusPageService.clientAreaPixIncident({
            method: req.method,
            path: req.path,
            message: err.message,
          });
        }
      }
      // 500 -- When an error is thrown
      res.status(500).json({ message: "Internal server error" });
    });

    app.listen(PORT, () =>
      console.log(`App listening at port http://localhost:${PORT}`)
    );
  });
});
