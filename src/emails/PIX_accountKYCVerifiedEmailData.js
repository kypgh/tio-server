import { DateTime } from "luxon";

const templateData = {
  en: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "en" });
    const result = {
      global_variables: params,
      subject: `Your account has been KYC verified (${timeNow})`,
      content: {
        title: `Dear ${params.full_name},`,
        body1: "Good news!",
        body2: "Your account has been KYC verified.",
        body3: "If you haven't already done so, visit your portal now to:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Deposit funds</a></li><li><a href="${params.open_live_account_url}" target="_blank">Open a Live trading account</a></li></ul>`,
        closing: `<br><br>${params.company_name}<br>Customer Support Team`,
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
      subject: `Bylo ověřeno KYC pro váš účet (${timeNow})`,
      content: {
        title: `Vážený ${params.full_name},`,
        body1: "Dobré zprávy!",
        body2: "Bylo ověřeno KYC pro váš účet.",
        body3:
          "Pokud jste tak dosud neučinili, navštivte nyní svůj portál pro:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Vložení prostředků</a></li><li><a href="${params.open_live_account_url}" target="_blank">Otevření živého obchodního účtu</a></li></ul>`,
        closing: `<br><br>${params.company_name}<br>Customer Support Team`,
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
      subject: `Akun Anda telah selesai diverifikasi KYC (${timeNow})`,
      content: {
        title: `Yang terhormat ${params.full_name},`,
        body1: "Kabar gembira!",
        body2: "Akun Anda telah selesai diverifikasi KYC.",
        body3: "Jika Anda belum melakukannya, kunjungi portal Anda untuk:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Deposit dana</a></li><li><a href="${params.open_live_account_url}" target="_blank">Membuka akun trading Live</a></li></ul>`,
        closing: `<br><br>${params.company_name}<br>Customer Support Team`,
      },
      footer: {
        risk_disclaimer_title: "Peringatan risiko:",
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
      subject: `KYC bagi akaun anda telah disahkan (${timeNow})`,
      content: {
        title: `Yang dihormati ${params.full_name},`,
        body1: "Berita baik!",
        body2: "KYC bagi akaun anda telah disahkan.",
        body3:
          "Jika anda belum berbuat demikian, layari portal sekarang untuk:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Mendepositkan dana</a></li><li><a href="${params.open_live_account_url}" target="_blank">Membuka akaun dagangan Langsung</a></li></ul>`,
        closing: `<br><br>${params.company_name}<br>Customer Support Team`,
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
const createAccountKYCVerifiedNotificationEmailData = (
  language,
  {
    full_name,
    company_name,
    year,
    support_email,
    deposit_funds_url,
    download_platform_url,
    open_live_account_url,
  }
) => {
  const dynamicTemplateData = (
    templateData[language] ? templateData[language] : templateData["en"]
  )({
    full_name,
    company_name,
    year,
    support_email,
    deposit_funds_url,
    download_platform_url,
    open_live_account_url,
  });

  return {
    templateId: "d-3bec0c828651415081a5bcd6516bfd84",
    dynamicTemplateData,
  };
};

export default createAccountKYCVerifiedNotificationEmailData;
