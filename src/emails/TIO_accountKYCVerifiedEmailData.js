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
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Deposit funds</a></li><li><a href="${params.open_live_account_url}" target="_blank">Open a Live trading account</a></li><li>Download MT4 or MT5 from our <a href="${params.download_platform_url}" target="_blank">download centre</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Happy trading!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer",
        risk_disclaimer_body:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose",
        investment_advice:
          "The content of this email does not constitute investment advice",
        legal_title: "Legal information",
        legal_body:
          "TIOmarkets is a trading name of TIO Markets Ltd 24986IBC 2018, registered in St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Copyright ©${params.year} TIO Markets Ltd. All Rights Reserved.`,
      },
    };
    return result;
  },
  ar: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "ar" });
    const result = {
      global_variables: params,
      subject: `تم توثيق KYC لحسابك بنجاح (${timeNow})`,
      content: {
        title: `عزيزي ${params.full_name},`,
        body1: "أخبار سارة",
        body2: "تم توثيق KYC لحسابك بنجاح.",
        body3:
          "في حال لم تقم بهذا الاجراء بعد، تفضل بزيارة بوابتك الإلكترونية الآن من أجل:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">إيداع الأموال</a></li><li><a href="${params.open_live_account_url}" target="_blank">فتح حساب تداول حقيقي</a></li><li>قم بتنزيل MT4 أو MT5 من <a href="${params.download_platform_url}" target="_blank">منصة التنزيل</a> الخاصة بنا</li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `نتمنى لك تداولًا موفقًا!<br><br>${params.company_name}<br>فريق إسعاد العملاء`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "إخلاء المسئولية بشأن المخاطر:",
        risk_disclaimer_body:
          "عقود الفروقات هي أدوات معقدة وتنطوي على مخاطرة مرتفعة بخسارة الأموال بشكل سريع نتيجة لاستخدام الرافعة المالية. يجب أن تنظر فيما إذا كنت تفهم كيفية عمل عقود الفروقات وما إذا كنت تستطيع تحمل المخاطرة المرتفعة بخسارة أموالك. لا تودع أكثر مما يمكنك تحمل خسارته.",
        investment_advice:
          "لا يشكل محتوي هذه الرسالة الإلكترونية أي مشورة استثمارية.",
        legal_title: "معلومات قانونية:المعلومات القانونية",
        legal_body:
          "TIOmarkets هو الاسم التجاري لشركة TIO Markets Ltd 24986IBC 2018 ، المسجلة في سانت فنسنت وجزر غرينادين",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Copyright ©${params.year} TIO Markets Ltd. جميع الحقوق محفوظة.`,
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
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Vložení prostředků</a></li><li><a href="${params.open_live_account_url}" target="_blank">Otevření živého obchodního účtu</a></li><li>Stáhněte si MT4 nebo MT5 z naší <a href="${params.download_platform_url}" target="_blank">Stahovací Platformy</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Mnoho štěstí při obchodování!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Odmítnutí odpovědnosti za rizika",
        risk_disclaimer_body:
          "C F D jsou složité nástroje, jejichž obchodování je spojeno s vysokým rizikem ztráty kvůli použité páce. Měli byste dobře zvážit, zda rozumíte, jak fungují C F D a zda si můžete dovolit podstoupit vysoké riziko ztráty vašich peněz. Nikdy nevkládejte částku vyšší, než jakou jste ochotni ztratit.",
        investment_advice:
          "Obsah tohoto e-mailu nepředstavuje investiční poradenství",
        legal_title: "Legální informace",
        legal_body:
          "TIO Markets Ltd. je společnost registrovaná na Svatém Vincenci a Grenadinách jako mezinárodní obchodní společnost s registračním číslem 24986 IBC 2018.",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Cautorská práva ©${params.year} TIO Markets Ltd. Všechna práva vyhrazena.`,
      },
    };
    return result;
  },
  de: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "de" });
    const result = {
      global_variables: params,
      subject: `Ihr Konto wurde KYC-verifiziert (${timeNow})`,
      content: {
        title: `Hallo ${params.full_name},`,
        body1: "Gute Nachrichten!",
        body2: "Ihr Konto wurde KYC-verifiziert.",
        body3: "Besuchen Sie jetzt Ihr Portal und:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Zahlen Sie Geld ein</a></li><li><a href="${params.open_live_account_url}" target="_blank">Eröffnen Sie ein Realkonto</a></li><li>Laden Sie MT4 oder MT5 aus unserem <a href="${params.download_platform_url}" target="_blank">Download-Bereich</a> herunter</li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Erfolgreiches Handeln!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Risikohinweis",
        risk_disclaimer_body:
          "CFDs sind komplexe Finanzinstrumente und bergen ein hohes Risiko schneller Verluste aufgrund der Hebelwirkung. Vergewissern Sie sich, dass Sie die Funktionsweise von CFDs verstanden haben, und überdenken Sie, ob Sie es sich leisten können, das hohe Risiko eines Kapitalverlusts einzugehen. Zahlen Sie nur Geldbeträge ein, deren Verlust Sie verschmerzen können.",
        investment_advice:
          "Der Inhalt dieser E-Mail stellt keine Anlageberatung dar",
        legal_title: "Rechtliche Hinweise",
        legal_body:
          "TIOmarkets ist ein Handelsname von TIO Markets Ltd 24986IBC 2018, registriert in St. Vincent & Grenadinen",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Urheberrechte ©${params.year} TIO Markets Ltd. Alle Rechte vorbehalten.`,
      },
    };
    return result;
  },
  es: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "es" });
    const result = {
      global_variables: params,
      subject: `Tu cuenta ha pasado los protocolos KYC y ha sido verificada (${timeNow})`,
      content: {
        title: `Estimado(a) ${params.full_name},`,
        body1: "¡Buenas noticias!",
        body2: "Tu cuenta ha pasado los protocolos KYC y ha sido verificada.",
        body3: "Si todavía no lo has hecho, visita tu portal ahora para:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Depositar fondos</a></li><li><a href="${params.open_live_account_url}" target="_blank">Abrir una cuenta de trading real</a></li><li>Descargar MT4 o MT5 desde nuestro <a href="${params.download_platform_url}" target="_blank">centro de descargas</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `¡Feliz trading!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Aviso de riesgo",
        risk_disclaimer_body:
          " Los CFD son instrumentos complejos y conllevan un riesgo elevado de perder dinero rápidamente debido al apalancamiento. Debes valorar si entiendes cómo funcionan los CFD y si puedes permitirte el alto riesgo de perder tu dinero. Nunca deposites más dinero del que estés dispuesto a perder. ",
        investment_advice:
          "Este email no contiene en ningún caso consejos sobre inversiones.",
        legal_title: "Información legal",
        legal_body:
          "TIO Markets Ltd es una empresa registrada en San Vicente y las Granadinas como empresa internacional con número 24986 IBC 2018.",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Derechos de autor ©${params.year} TIO Markets Ltd. Todos los derechos reservados.`,
      },
    };
    return result;
  },
  fr: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "fr" });
    const result = {
      global_variables: params,
      subject: `Votre compte a été vérifié par KYC (${timeNow})`,
      content: {
        title: `Chère/Cher ${params.full_name},`,
        body1: "Bonne nouvelle!",
        body2: "Votre compte a été vérifié par KYC.",
        body3:
          "Si vous ne l'avez pas encore fait, visitez dès maintenant votre portail pour:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Déposez des fonds</a></li><li><a href="${params.open_live_account_url}" target="_blank">Ouvrez un compte de trading live</a></li><li>Télécharger MT4 ou MT5 depuis notre <a href="${params.download_platform_url}" target="_blank">Centre de Téléchargement</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Bon trading!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Avertissement sur les risques",
        risk_disclaimer_body:
          "Les C F D sont des instruments complexes et comportent un risque élevé de pertes financières rapides en raison de l'effet de levier. Il convient de vous interroger : avez-vous correctement compris le fonctionnement des C F D et pouvez-vous vous permettre de risquer de perdre votre argent ? Ne placez jamais plus que ce que vous êtes prêt à perdre.",
        investment_advice:
          "Le contenu de cet e-mail ne constitue pas un conseil en investissement",
        legal_title: "Information légale",
        legal_body:
          "TIOmarkets est un nom commercial de TIO Markets Ltd 24986IBC 2018, enregistré à St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Droits d'auteur ©${params.year} TIO Markets Ltd. Tous droits réservés.`,
      },
    };
    return result;
  },
  hi: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "hi" });
    const result = {
      global_variables: params,
      subject: `आपका अकाउंट केवाईसी सत्यापित हो गया है (${timeNow})`,
      content: {
        title: `प्रिय ${params.full_name},`,
        body1: "अच्छी खबर!",
        body2: "आपका अकाउंट केवाईसी सत्यापित हो गया है।",
        body3: "यदि पहले से आपने ऐसा न किया हो, तो अभी अपने पोर्टल पर जाएँ:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">फंड डिपॉजिट कर</a></li><li><a href="${params.open_live_account_url}" target="_blank">लाइव ट्रेडिंग अकाउंट ओपन करें<</a></li><li>हमारे <a href="${params.download_platform_url}" target="_blank">डाउनलोड सेंटर</a> से MT4 या MT5 डाउनलोड करें</li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `हैप्पी ट्रेडिंग!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "जोखिम अस्वीकरण",
        risk_disclaimer_body:
          "C F D जटिल इंस्‍टूमेंट हैं और लीवरेज के कारण इनमें तेजी से पैसा खोने का उच्च जोखिम है। आपको विचार करना चाहिए कि C F D कैसे काम करता है क्‍या इसकी आपको जानकारी है और क्या आप अपना पैसा गंवाने का उच्च जोखिम उठा सकते हैं। जितना आप खोने के लिए तैयार हैं उससे अधिक कभी डिपॉजिट न करें। प्रोफेशनल ग्राहक के नुकसान उनके डिपॉजिट से अधिक हो सकते हैं। कृपया हमारी जोखिम चेतावनी नीति देखें और आपके पूरी तरह न सपझ पाने पर निष्‍पक्ष प्रोफेशनल सलाह लें।",
        investment_advice:
          " यह जानकारी यूएसए एवं OFAC सहित कुछ देशों/ क्षेत्राधिकारों के निवासियों के वितरण या उपयोग के लिए नहीं है या उन्‍हें निर्देशित नहीं की जाती, लेकिन यह यहीं तक सीमित नहीं है।",
        legal_title: "कानूनी जानकारी",
        legal_body:
          "TIOmarkets TIO Markets Ltd 24986IBC 2018 का व्यापारिक नाम है, जो सेंट विंसेंट और ग्रेनेडाइंस में पंजीकृत है।",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `कॉपीराइट ©${params.year} TIO Markets Ltd. सर्वाधिक सुरक्षित।`,
      },
    };
    return result;
  },
  hu: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "hu" });
    const result = {
      global_variables: params,
      subject: `Számláját ügyfél-átvilágítással hitelesítette (${timeNow})`,
      content: {
        title: `Kedves ${params.full_name},`,
        body1: "Jó hír!",
        body2: "Számláját ügyfél-átvilágítással hitelesítette.",
        body3: "Ha még nem tette meg, látogasson el most a portálra, ahol:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Fizessen be</a></li><li><a href="${params.open_live_account_url}" target="_blank">Nyisson Éles kereskedési számlát</a></li><li>Töltse le az MT4 vagy MT5 platformot a <a href="${params.download_platform_url}" target="_blank">letöltési központból</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Sikeres kereskedést kívánunk!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Kockázati figyelmeztetés",
        risk_disclaimer_body:
          "A C F D-k összetett eszközök, és a tőkeáttétel miatt nagy a gyors veszteség kockázata. Gondolja át, hogy érti‑e a C F D-k működését, és hogy tudja‑e vállalni azt a komoly kockázatot, hogy elveszíti a pénzét. Soha ne fizessen be többet annál, mint amekkora veszteségre felkészült. A szakmai ügyfelek veszteségei meghaladhatják befizetésük mértékét. Tekintse meg kockázati figyelmeztető szabályzatunkat, és kérje független szakértő tanácsát, ha valamit nem teljesen ért. Ezeknek az információknak a célközönségébe, illetve szándékolt terjesztési vagy felhasználói körébe nem tartoznak bizonyos országok/joghatóságok lakosai.",
        investment_advice:
          "Ideértendők például, de nem kizárólagosan, az Egyesült Államok és az OFAC jegyzékében szereplő országok lakosai.",
        legal_title: "Jogi információk",
        legal_body:
          "A TIOmarkets a TIO Markets Ltd 24986IBC 2018 kereskedelmi neve, bejegyzett St Vincent és Grenadine-szigeteken.",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Szerzői jog ©${params.year} TIO Markets Ltd. Minden Jog Fenntartva.`,
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
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Deposit dana</a></li><li><a href="${params.open_live_account_url}" target="_blank">Membuka akun trading Live</a></li><li>Unduh MT4 atau MT5 dari <a href="${params.download_platform_url}" target="_blank">pusat unduhan</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Selamat trading!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Peringatan risiko",
        risk_disclaimer_body:
          "C F D adalah instrumen kompleks yang membawa risiko tinggi terjadinya kerugian dengan cepat karena penggunaan leverage. Anda harus memastikan bahwa Anda memahami cara kerja C F D dan bahwa Anda dapat menanggung risiko besar kehilangan uang. Pastikan Anda siap menanggung kerugian dari setiap dana yang Anda setorkan. Kerugian klien profesional mungkin lebih besar dari deposit klien. Harap baca kebijakan peringatan risiko dan cari saran independen profesional jika Anda tidak memahami sepenuhnya.",
        investment_advice:
          "Informasi ini tidak ditujukan atau dimaksudkan untuk dibagikan kepada atau digunakan oleh penduduk negara/yurisdiksi tertentu, termasuk namun tidak terbatas pada Amerika Serikat & OFAC.",
        legal_title: "Informasi hukum",
        legal_body:
          "TIOmarkets adalah nama dagang dari TIO Markets Ltd 24986IBC 2018, terdaftar di St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Hak cipta ©${params.year} TIO Markets Ltd. Hak Cipta Dilindungi Undang-Undang.`,
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
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Mendepositkan dana</a></li><li><a href="${params.open_live_account_url}" target="_blank">Membuka akaun dagangan Langsung</a></li><li>Muat turun MT4 atau MT5 dari <a href="${params.download_platform_url}" target="_blank">pusat muat turun</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Selamat berdagang!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Penafian risiko",
        risk_disclaimer_body:
          "CFD ialah instrumen yang kompleks dan mengandungi risiko yang tinggi untuk kerugian wang dengan cepat kerana leveraj. Anda perlu mempertimbangkan sama ada anda memahami cara CFD berfungsi dan sama ada anda mampu untuk mengambil risiko yang tinggi untuk kerugian wang anda. Jangan mendepositkan dana melebihi jumlah yang anda bersedia untuk kerugian.",
        investment_advice: "Kandungan e-mel ini bukan nasihat pelaburan.",
        legal_title: "Maklumat undang-undang",
        legal_body:
          "TIOmarkets ialah nama dagangan TIO Markets Ltd 24986IBC 2018, berdaftar di St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305, P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Hak Cipta ©${params.year} TIO Markets Ltd. Hak Cipta Terpelihara.`,
      },
    };
    return result;
  },
  nl: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "nl" });
    const result = {
      global_variables: params,
      subject: `Uw account is KYC-geverifieerd (${timeNow})`,
      content: {
        title: `Beste ${params.full_name},`,
        body1: "Goed nieuws",
        body2: "Uw account is KYC-geverifieerd.",
        body3: "Als u dat nog niet gedaan heeft, bezoek uw portal nu om:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Geld te storten</a></li><li><a href="${params.open_live_account_url}" target="_blank">Een Live handelsaccount te openen</a></li><li>Download MT4 of MT5 uit ons <a href="${params.download_platform_url}" target="_blank">downloadcentrum</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Veel handelsplezier!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer",
        risk_disclaimer_body:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose",
        investment_advice:
          "The content of this email does not constitute investment advice",
        legal_title: "Legal information",
        legal_body:
          "TIOmarkets is a trading name of TIO Markets Ltd 24986IBC 2018, registered in St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Copyright ©${params.year} TIO Markets Ltd. All Rights Reserved.`,
      },
    };
    return result;
  },
  ph: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "ph" });
    const result = {
      global_variables: params,
      subject: `Naberipika na and KYC ng iyong account (${timeNow})`,
      content: {
        title: `Minamahal na ${params.full_name},`,
        body1: "Magandang balita!",
        body2: "Naberipika na and KYC ng iyong account.",
        body3:
          "Kung hindi mo pa ginagawa ito, puntahan ang iyong portal ngayon para:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Magdeposito ng mga pondo</a></li><li><a href="${params.open_live_account_url}" target="_blank">Magbukas ng Live na account sa pangangalakal</a></li><li>I-download ang MT4 o MT5 mula sa aming <a href="${params.download_platform_url}" target="_blank">download center</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Maligayang pangangalakal!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer",
        risk_disclaimer_body:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose",
        investment_advice:
          "The content of this email does not constitute investment advice",
        legal_title: "Legal information",
        legal_body:
          "TIOmarkets is a trading name of TIO Markets Ltd 24986IBC 2018, registered in St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Copyright ©${params.year} TIO Markets Ltd. All Rights Reserved.`,
      },
    };
    return result;
  },
  pl: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "pl" });
    const result = {
      global_variables: params,
      subject: `Twoje konto zostało zweryfikowane przez KYC (${timeNow})`,
      content: {
        title: `Witaj ${params.full_name},`,
        body1: "Dobra wiadomość!",
        body2: "Twoje konto zostało zweryfikowane przez KYC.",
        body3:
          "Jeśli jeszcze tego nie zrobiłeś, odwiedź teraz swój portal, aby:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Wpłacić środki</a></li><li><a href="${params.open_live_account_url}" target="_blank">Otworzyć rzeczywiste konto handlowe</a></li><li>Pobierz MT4 lub MT5 z naszego <a href="${params.download_platform_url}" target="_blank">centrum pobierania</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Udanego handlu!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Zastrzeżenie dotyczące ryzyka",
        risk_disclaimer_body:
          "CFD są złożonymi instrumentami i wiążą się z wysokim ryzykiem szybkiej utraty pieniędzy ze względu na dźwignię finansową. Powinieneś rozważyć, czy rozumiesz, jak działają kontrakty CFD i czy możesz sobie pozwolić na podjęcie wysokiego ryzyka utraty swoich pieniędzy. Nigdy nie wpłacaj więcej, niż jesteś gotów stracić. Straty klientów profesjonalnych mogą przewyższać ich wpłatę. ",
        investment_advice:
          "Treść tego e-maila nie stanowi porady inwestycyjnej.",
        legal_title: "Informacja prawna",
        legal_body:
          "TIOmarkets jest nazwą handlową TIOmarkets Ltd 24986 IBC 2018, zarejestrowaną w St Vincent & Grenadines.",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Prawo autorskie ©${params.year} TIO Markets Ltd. Wszystkie prawa zastrzeżone.`,
      },
    };
    return result;
  },
  pt: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "en" });
    const result = {
      global_variables: params,
      subject: `A sua conta foi verificada ao abrigo do KYC (${timeNow})`,
      content: {
        title: `Caro(a) ${params.full_name},`,
        body1: "Temos boas notícias!",
        body2: "A sua conta foi verificada ao abrigo do KYC.",
        body3: "Se ainda não o fez, visite o seu portal para:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Depositar fundos</a></li><li><a href="${params.open_live_account_url}" target="_blank">Abrir uma conta de negociação ao vivo</a></li><li>Baixe MT4 ou MT5 do nosso <a href="${params.download_platform_url}" target="_blank">centro de download</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Feliz trading!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Alerta de risco",
        risk_disclaimer_body:
          "os CFD são instrumentos complexos e têm um risco elevado de perda rápida de dinheiro devido a alavancagem. Deverá ponderar se compreende como os CFD funcionam e se consegue suportar o risco elevado de perda do seu dinheiro. Nunca deposite mais do que está preparado para perder. ",
        investment_advice:
          "O teor deste e-mail não constitui aconselhamento de investimento",
        legal_title: "Informação legal",
        legal_body:
          "TIOmarkets é um nome comercial da TIO Markets Ltd 24986IBC 2018, registrada em São Vicente e Granadinas",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Direito autoral ©${params.year} TIO Markets Ltd. Todos os direitos reservados.`,
      },
    };
    return result;
  },
  cn: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "cn" });
    const result = {
      global_variables: params,
      subject: `您的账户已通过KYC验证 (${timeNow})`,
      content: {
        title: `尊敬的 ${params.full_name},`,
        body1: "好消息！",
        body2: "您的账户已通过KYC验证。",
        body3: "如果您还没有这样做，访问您的门户:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">存入资金</a></li><li><a href="${params.open_live_account_url}" target="_blank">开立实时交易账户</a></li><li>从我们的 <a href="${params.download_platform_url}" target="_blank">下载中心</a> 下载 MT4 或 MT5</li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `交易快乐！<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "风险免责声明",
        risk_disclaimer_body:
          "差价合约（C F D）是复杂的工具，由于杠杆的作用，具有快速亏损的较高风险。您应该考虑自己是否已经了解C F D的运行机制，以及您是否能够承担可能损失资金的高风险。切勿存入超过您可承受亏损的资金",
        investment_advice:
          "The content of this email does not constitute investment advice",
        legal_title: "法律信息",
        legal_body:
          "TIO Markets Ltd. 是作为国际商业公司注册于圣文森特岛的公司，注册号为 24986 IBC 2018。",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Copyright ©${params.year} TIO Markets Ltd. 版权所有。`,
      },
    };
    return result;
  },
  sk: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "sk" });
    const result = {
      global_variables: params,
      subject: `Váš účet bol úspešne overený podľa požiadaviek KYC (${timeNow})`,
      content: {
        title: `Vážený/-á ${params.full_name},`,
        body1: "Dobré správy!",
        body2: "Váš účet bol úspešne overený podľa požiadaviek KYC.",
        body3: "Ak ste tak ešte neurobili, navštívte svoj portál a:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Vložte prostriedky</a></li><li><a href="${params.open_live_account_url}" target="_blank">Otvorte si live obchodný účet</a></li><li>Stiahnite si MT4 alebo MT5 z nášho <a href="${params.download_platform_url}" target="_blank">download centra</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Veľa šťastia pri obchodovaní!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer",
        risk_disclaimer_body:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose",
        investment_advice:
          "The content of this email does not constitute investment advice",
        legal_title: "Legal information",
        legal_body:
          "TIOmarkets is a trading name of TIO Markets Ltd 24986IBC 2018, registered in St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Copyright ©${params.year} TIO Markets Ltd. All Rights Reserved.`,
      },
    };
    return result;
  },
  tc: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "tc" });
    const result = {
      global_variables: params,
      subject: `您的帳戶已通過KYC驗證 (${timeNow})`,
      content: {
        title: `尊敬的 ${params.full_name},`,
        body1: "好消息！",
        body2: "您的帳戶已通過KYC驗證。",
        body3: "如果您還沒有這樣做，訪問您的門戶:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">存入資金</a></li><li><a href="${params.open_live_account_url}" target="_blank">開立即時交易帳戶</a></li><li>從我們的 <a href="${params.download_platform_url}" target="_blank">下載中心</a> 下載 MT4 或 MT5</li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `交易快樂！<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer",
        risk_disclaimer_body:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose",
        investment_advice:
          "The content of this email does not constitute investment advice",
        legal_title: "Legal information",
        legal_body:
          "TIOmarkets is a trading name of TIO Markets Ltd 24986IBC 2018, registered in St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Copyright ©${params.year} TIO Markets Ltd. All Rights Reserved.`,
      },
    };
    return result;
  },
  th: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "th" });
    const result = {
      global_variables: params,
      subject: `บัญชีของคุณได้รับการยืนยัน KYC แล้ว (${timeNow})`,
      content: {
        title: `เรียน ${params.full_name},`,
        body1: "ข่าวดี!",
        body2: "บัญชีของคุณได้รับการยืนยัน KYC แล้ว.",
        body3: "หากคุณยังไม่ได้ดำเนินการ โปรดไปที่พอร์ทัลของคุณตอนนี้เพื่อ:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">เงินฝาก</a></li><li><a href="${params.open_live_account_url}" target="_blank">เปิดบัญชีการเทรดจริง</a></li><li>ดาวน์โหลด MT4 หรือ MT5 จาก <a href="${params.download_platform_url}" target="_blank">ศูนย์ดาวน์โหลด</a> ของเรา</li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `ขอให้มีความสุขในการเทรด!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "ข้อปฏิเสธการรับผิดด้านความเสี่ยง",
        risk_disclaimer_body:
          "CFD เป็นตราสารที่มีความซับซ้อนและมีความเสี่ยงสูงที่จะสูญเสียเงินอย่างรวดเร็วจากเลเวอเรจ คุณควรพิจารณาว่าคุณเข้าใจถึงกลไกการทำงานของ CFD และพร้อมรับความเสี่ยงสูงที่จะสูญเสียเงินแล้วหรือไม่ อย่าฝากมากกว่าจำนวนเงินที่คุณพร้อมจะสูญเสีย ",
        investment_advice: "เนื้อหาของอีเมลฉบับนี้ไม่ได้เป็นการแนะนำการลงทุน ",
        legal_title: "ข้อมูลทางกฎหมาย",
        legal_body:
          "TIOmarkets เป็นชื่อทางการค้าของ TIO Markets Ltd 24986IBC 2018 จดทะเบียนใน St Vincent & Grenadines",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Copyright ©${params.year} TIO Markets Ltd. สงวนสิทธิ์ทุกประการ.`,
      },
    };
    return result;
  },
  vi: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "vi" });
    const result = {
      global_variables: params,
      subject: `Tài khoản của bạn đã được xác minh KYC (${timeNow})`,
      content: {
        title: `${params.full_name} thân mến,`,
        body1: "Tin tốt!",
        body2: "Tài khoản của bạn đã được xác minh KYC.",
        body3:
          "Nếu bạn chưa làm như vậy, hãy truy cập cổng thông tin của bạn ngay bây giờ để:",
        body4: `<ul><li><a href="${params.deposit_funds_url}" target="_blank">Nạp tiền</a></li><li><a href="${params.open_live_account_url}" target="_blank">Mở tài khoản giao dịch Live</a></li><li>Tải xuống MT4 hoặc MT5 từ <a href="${params.download_platform_url}" target="_blank">trung tâm tải xuống</a></li></ul>`,
        body5: `We wish to inform you that, having examined your application (submitted to us through our website on <b>${params.tioeu_registration_date}</b> and the subsequent identification and due diligence documents and information provided and being available to us, it is with great pleasure that we accept you as a Client of TIOMARKETS CY LTD (hereinafter, the "Company").`,
        body6:
          'Our relationship and all trading activity between us will be governed under the Client Agreement and the following documents:  "Client Categorisation Policy", "Investor Compensation Fund", "Summary of Conflicts of Interest Policy", "Summary Best Interest and Order Execution Policy", "Risk Disclosure and Warnings Notice", "Complaints Procedure for Clients", which are all found on our website, as amended from time to time, which will be binding on you and us and with which you agreed when you submitted your application to us.',
        body7:
          'In addition, please note that, on the basis of the information provided to us by you or made available to us and on the method of categorisation we use, we have categorised you as a Retail Client (according to the Provision of Investment Services, the Exercise of Investment Activities, the Operation of Regulated Markets and Other Related Matters of Law 87(I)/2017, hereinafter, "the Law") and will treat you as such under the Law when providing investment services to you.',
        body8: `Further to the above, please note that you have the right to request to change your categorisation while the Company reserves the right to reject such request for Professional treatment. Should you wish to do so, you may fill in the "Application to Change Client Status", found on our website or you may direct your request to <a href="mailto:${params.support_email_tioeu}">${params.support_email_tioeu}</a>`,
        body9:
          'For more information on the categories of Clients, the method of categorisation, your rights and procedure to change categorisation and the limitations to the level of protection for each category, please refer to the document "Client Categorisation" found on our website.',
        body10: "We wish you a successful and profitable trading.",
        body11: "We always remain at your disposal.",
        closing: `Chúc bạn giao dịch vui vẻ!<br><br>${params.company_name}<br>Customer Support Team`,
        closing_tioeu: `Yours Sincerely,<br><br>${params.company_name}<br>TIOMARKETS CY LTD`,
      },
      footer: {
        risk_disclaimer_title: "Khước từ trách nhiệm rủi ro",
        risk_disclaimer_body:
          "CFD là công cụ phức tạp và có rủi ro mất tiền cao nhanh chóng do đòn bẩy. Bạn nên cân nhắc xem mình có hiểu cách thức hoạt động của CFD và có đủ khả năng chấp nhận nguy cơ mất tiền cao hay không. Không bao giờ nạp nhiều hơn số tiền bạn sẵn sàng để mất. ",
        investment_advice:
          "Nội dung của email này không cấu thành sự tư vấn đầu tư. ",
        legal_title: "Thông tin pháp lý",
        legal_body:
          "TIOmarkets là tên giao dịch của TIO Markets Ltd 24986 IBC 2018, được đăng ký tại St Vincent & Grenadines.",
        address_left: "Griffith Corporate Centre Suite 305,  P.O. Box 1510",
        address_right: "Kingstown, Beachmont, TIOmarkets Ltd",
        copy_right: `Bản quyền ©${params.year} TIO Markets Ltd. Bảo lưu Mọi quyền.`,
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
    support_email_tioeu,
    branch,
    tioeu_registration_date,
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
    support_email_tioeu,
    branch,
    tioeu_registration_date,
  });

  return {
    templateId: "d-d9c4e378d9084710a15a362fed35f7be",
    dynamicTemplateData,
  };
};

export default createAccountKYCVerifiedNotificationEmailData;
