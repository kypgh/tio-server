import { Parser } from "json2csv";
import PdfPrinter from "pdfmake";
import XLSX from "sheetjs-style";

function getHeaderKeys(sheet) {
  var headers = [];
  var range = XLSX.utils.decode_range(sheet["!ref"]);
  var C,
    R = range.s.r; /* start in the first row */
  /* walk every column in the range */
  for (C = range.s.c; C <= range.e.c; ++C) {
    headers.push(XLSX.utils.encode_cell({ c: C, r: R }));
  }
  return headers;
}

const exportService = {
  csvToExcel: (csv, sheetName) => {
    const wb = XLSX.read(csv, { type: "string" });
    wb.Sheets[sheetName] = wb.Sheets[wb.SheetNames[0]];
    delete wb.Sheets[wb.SheetNames[0]];
    wb.SheetNames[0] = sheetName;
    for (const key of getHeaderKeys(wb.Sheets[sheetName])) {
      wb.Sheets[sheetName][key].s = {
        font: {
          sz: 14,
          bold: true,
          outline: true,
          shadow: true,
        },
        fill: { fgColor: { rgb: "FFD3D3D3" } },
      };
    }
    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  },
  csvToPDF: async (csv, title) =>
    new Promise((resolve, reject) => {
      const printer = new PdfPrinter({
        Roboto: {
          normal: "backend/fonts/Roboto-Regular.ttf",
          bold: "backend/fonts/Roboto-Medium.ttf",
          italics: "backend/fonts/Roboto-Italic.ttf",
          bolditalics: "backend/fonts/Roboto-MediumItalic.ttf",
        },
      });
      const result = [];
      const pdfDoc = printer.createPdfKitDocument(
        {
          content: [
            { text: title, style: "header" },
            {
              style: "tableExample",
              layout: "lightHorizontalLines",
              table: {
                body: csv.split(/\r?\n/).map((row, i) => {
                  // header row
                  if (i === 0)
                    return row.split(",").map((cell) => ({
                      text: cell.charAt(0).toUpperCase() + cell.slice(1), // Capitalize first letter
                      style: "tableHeader",
                    }));
                  return row.split(",");
                }),
              },
            },
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 0, 0, 10],
            },
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: "black",
            },
            tableExample: {
              margin: [0, 5, 0, 15],
            },
          },
        },
        {}
      );
      pdfDoc.on("data", (chunk) => result.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(result)));
      pdfDoc.on("error", reject);
      pdfDoc.end();
    }),
  jsonToCSV: (json, fields) => {
    return new Parser({
      fields,
    }).parse(json);
  },
};

export default exportService;
