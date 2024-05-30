import multiparty from "multiparty";

export default function formDataHandler(req) {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}
