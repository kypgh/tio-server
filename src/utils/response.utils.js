import { ALLOWED_EXPORT_FORMATS } from "../config/enums";
import errorCodes from "../config/errorCodes";
import exportService from "../services/export.service";

const responseUtils = {
  sendExportResponse: async ({ csv, format, res, filename }) => {
    if (format === ALLOWED_EXPORT_FORMATS.CSV) {
      res.setHeader(
        "Content-Disposition",
        `attachment;filename=${filename}.csv`
      );
      res.setHeader("Content-Type", "text/csv");
      res.status(200).send(csv);
    } else if (format === ALLOWED_EXPORT_FORMATS.EXCEL) {
      const excel = exportService.csvToExcel(csv, filename);
      // prettier-ignore
      res.setHeader("Content-Disposition", `attachment;filename=${filename}.xlsx`);
      res.setHeader("Content-Type", "application/vnd.ms-excel");
      res.status(200).send(excel);
    } else if (format === ALLOWED_EXPORT_FORMATS.PDF) {
      const pdf = await exportService.csvToPDF(csv, filename);
      res.setHeader(
        "Content-Disposition",
        `attachment;filename=${filename}.pdf`
      );
      res.setHeader("Content-Type", "application/pdf");
      res.status(200).send(pdf);
    } else {
      res.status(400).json(errorCodes.invalidExportFormat);
    }
  },
};

export default responseUtils;
