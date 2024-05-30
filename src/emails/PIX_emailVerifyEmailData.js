import { DateTime } from "luxon";

const templateData = {
  en: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "en" });
    const result = {
      global_variables: params,
      subject: `Click on the link so that we know your email address is real, and we'll send you to your portal (${timeNow})`,
      content: {
        title: `Dear ${params.full_name},`,
        body1: "You're nearly done!",
        body2: `Click on the link so that we know your email address is real, and we'll send you to your portal.<br>
        <a href="${params.email_verification_url}" target="_blank">Click here</a>`,
        body3: `Having trouble? Reply to this email and we'll give you a helping hand.<br><a href="${params.support_email}" target="_blank">${params.support_email}</a>.`,
        closing: `Happy trading!<br><br>${params.company_name}<br>Customer Support Team`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer:",
        risk_disclaimer_body1:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose. Professional client's losses can exceed their deposit. Please see our risk warning policy and seek independent professional advice if you do not fully understand. This information is not directed or intended for distribution to or use by residents of certain countries/jurisdictions including, but not limited to, USA & OFAC. The Company holds the right to alter the aforementioned list of countries at its own discretion.",
        risk_disclaimer_body2:
          "Prime Index Ltd is a Company registered and licensed by Mwali International Services Authority in Comoros Union as an International Business Company with registration number HY00423265 and License Number T2023249.",
        risk_disclaimer_body3:
          "The registered office of the Company is Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. Prime Index is a trading name of Prime Index Ltd.",
        copyright: `©${params.year} Prime Index Group. All Rights Reserved.`,
      },
    };
    return result;
  },

  cz: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "cz" });
    const result = {
      global_variables: params,
      subject: `Pro dokončení registrace, klikněte na odkaz níže a ověřte Vaší emailovou adresu. Poté budete přesměrován do obchodního portálu. (${timeNow})`,
      content: {
        title: `Vážený ${params.full_name},`,
        body1: "Už jste skoro hotovi!",
        body2: `Pro dokončení registrace, klikněte na odkaz níže a ověřte Vaší emailovou adresu. Poté budete přesměrován do obchodního portálu.<br>
        <a href="${params.email_verification_url}" target="_blank">Click here</a>`,
        body3: `V případě problémů odpovězte na tento e-mail a my Vás kontaktujeme.<br><a href="${params.support_email}" target="_blank">${params.support_email}</a>.`,
        closing: `Úspěšné  obchodování!<br><br>${params.company_name}<br>Tým spokojenosti zákazníků`,
      },
      footer: {
        risk_disclaimer_title: "Zřeknutí se rizik:",
        risk_disclaimer_body1:
          "CFD jsou složité nástroje, jejichž obchodování je spojeno s vysokým rizikem ztráty kvůli použité páce. Měli byste dobře zvážit, zda rozumíte, jak fungují CFD a zda si můžete dovolit podstoupit vysoké riziko ztráty vašich peněz. Nikdy nevkládejte částku vyšší, než jakou jste ochotni ztratit. Ztráty odborného klienta mohou být vyšší než jeho vklad. Přečtěte si prosím naše zásady upozornění na rizika a vyhledejte nezávislé profesionální poradenství, pokud tomu úplně nerozumíte. Tyto informace nejsou určeny/zamýšleny pro distribuci rezidentům určitých zemí/jurisdikcí, například rezidentům USA a zemí na seznamu Kanceláře pro kontrolu zahraničních aktiv amerického ministerstva financí (OFAC). Společnost má právo změnit.",
        risk_disclaimer_body2:
          "Prime Index Ltd je společnost registrovaná a licencovaná úřadem Mwali International Services Authority v Komorské unii jako mezinárodní obchodní společnost s registračním číslem HY00423265 a licenčním číslem T2023249.",
        risk_disclaimer_body3:
          "Sídlo společnosti je Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Komory, KM. Prime Index je obchodní název Prime Index Ltd.",
        copyright: `©${params.year} Prime Index Group. Všechna práva vyhrazena.`,
      },
    };
    return result;
  },

  id: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "id" });
    const result = {
      global_variables: params,
      subject: `Klik tautan guna memastikan bahwa alamat email Anda asli, dan kami akan mengantarkan Anda ke portal Anda (${timeNow})`,
      content: {
        title: `Yang terhormat ${params.full_name},`,
        body1: "Hampir selesai!",
        body2: `Klik tautan guna memastikan bahwa alamat email Anda asli, dan kami akan mengantarkan Anda ke portal Anda.<br>
          <a href="${params.email_verification_url}" target="_blank">Click here</a>`,
        body3: `Ada masalah? Balas email ini dan kami siap membantu Anda.<br><a href="${params.support_email}" target="_blank">${params.support_email}</a>.`,
        closing: `Selamat trading!<br><br>${params.company_name}<br>Tim Kepuasan Klien`,
      },
      footer: {
        risk_disclaimer_title: "Peringatan risiko:",
        risk_disclaimer_body1:
          "CFD adalah instrumen kompleks yang membawa risiko tinggi terjadinya kerugian dengan cepat karena penggunaan leverage. Anda harus memastikan bahwa Anda memahami cara kerja CFD dan bahwa Anda dapat menanggung risiko besar kehilangan uang. Pastikan Anda siap menanggung kerugian dari setiap dana yang Anda setorkan. Kerugian klien profesional mungkin lebih besar dari deposit klien. Harap baca kebijakan peringatan risiko dan cari saran independen profesional jika Anda tidak memahami sepenuhnya. Informasi ini tidak ditujukan atau dimaksudkan untuk dibagikan kepada atau digunakan oleh penduduk negara/yurisdiksi tertentu, termasuk namun tidak terbatas pada Amerika Serikat & OFAC. Perusahaan berhak untuk mengubah daftar negara tersebut berdasarkan kebijaksanaannya sendiri.",
        risk_disclaimer_body1:
          "CFD adalah instrumen yang rumit dan memiliki risiko kehilangan uang yang tinggi dengan cepat karena leverage. Anda harus mempertimbangkan apakah Anda memahami cara kerja CFD dan apakah Anda mampu mengambil risiko tinggi kehilangan uang Anda. Jangan pernah menyetor lebih dari yang siap Anda hilangkan. Kerugian klien profesional bisa melebihi deposit mereka. Silakan lihat kebijakan peringatan risiko kami dan dapatkan saran profesional independen jika Anda tidak sepenuhnya mengerti. Informasi ini tidak diarahkan atau dimaksudkan untuk didistribusikan atau digunakan oleh penduduk negara/yurisdiksi tertentu termasuk, namun tidak terbatas pada, USA & OFAC. Perusahaan berhak mengubah daftar negara yang disebutkan di atas atas kebijakannya sendiri.",
        risk_disclaimer_body2:
          "Prime Index Ltd adalah Perusahaan yang terdaftar dan dilisensikan oleh Mwali International Services Authority di Comoros Union sebagai Perusahaan Bisnis Internasional dengan nomor pendaftaran HY00423265 dan Nomor Lisensi T2023249.",
        risk_disclaimer_body3:
          "Kantor terdaftar Perusahaan adalah Moheli Corporate Services Ltd, P.B. Jalan Bonovo 1257, Fomboni, Komoro, KM. Prime Index adalah nama dagang dari Prime Index Ltd.",
        copyright: `©${params.year} Prime Index Group. Hak Cipta Dilindungi Undang-Undang.`,
      },
    };
    return result;
  },

  ms: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "ms" });
    const result = {
      global_variables: params,
      subject: `Klik pada pautan supaya kami tahu bahawa alamat e-mel anda adalah benar dan kami akan menghantar anda ke portal (${timeNow})`,
      content: {
        title: `Yang dihormati ${params.full_name},`,
        body1: "Anda hampir selesai!",
        body2: `Klik pada pautan supaya kami tahu bahawa alamat e-mel anda adalah benar dan kami akan menghantar anda ke portal.<br>
        <a href="${params.email_verification_url}" target="_blank">Click here</a>`,
        body3: `Ada masalah? Balas e-mel ini dan kami akan membantu anda.<br><a href="${params.support_email}" target="_blank">${params.support_email}</a>.`,
        closing: `Selamat berdagang!<br><br>${params.company_name}<br>Pasukan Kepuasan Pelanggan`,
      },
      footer: {
        risk_disclaimer_title: "Penafian risiko:",
        risk_disclaimer_body1:
          "CFD ialah instrumen yang kompleks dan mempunyai risiko tinggi kehilangan wang dengan cepat disebabkan oleh leverage. Anda harus mempertimbangkan sama ada anda memahami cara CFD berfungsi dan sama ada anda mampu untuk mengambil risiko tinggi kehilangan wang anda. Jangan sekali-kali mendepositkan lebih daripada yang anda bersedia untuk kehilangan. Kerugian pelanggan profesional boleh melebihi deposit mereka. Sila lihat dasar amaran risiko kami dan dapatkan nasihat profesional bebas jika anda tidak faham sepenuhnya. Maklumat ini tidak diarahkan atau bertujuan untuk diedarkan kepada atau digunakan oleh penduduk negara/bidang kuasa tertentu termasuk, tetapi tidak terhad kepada, USA & OFAC. Syarikat mempunyai hak untuk mengubah senarai negara yang disebutkan di atas mengikut budi bicaranya sendiri.",
        risk_disclaimer_body2:
          "Prime Index Ltd ialah Syarikat yang didaftarkan dan dilesenkan oleh Mwali International Services Authority di Comoros Union sebagai Syarikat Perniagaan Antarabangsa dengan nombor pendaftaran HY00423265 dan Nombor Lesen T2023249.",
        risk_disclaimer_body3:
          "Pejabat berdaftar Syarikat ialah Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. Indeks Perdana ialah nama dagangan Prime Index Ltd.",
        copyright: `©${params.year} Prime Index Group. Hak Cipta Terpelihara.`,
      },
    };
    return result;
  },
};
/**
 *
 * @param {String} language
 * @returns {{ templateId: String, dynamicTemplateData: Object }}
 */
const createVerifyEmailData = (
  language,
  { full_name, email_verification_url, company_name, year, support_email }
) => {
  const dynamicTemplateData = (
    templateData[language] ? templateData[language] : templateData["en"]
  )({
    full_name,
    email_verification_url,
    company_name,
    year,
    support_email,
  });

  return {
    templateId: "d-25fca7a02d6a439f8759645ef389fb68",
    dynamicTemplateData,
  };
};

export default createVerifyEmailData;
