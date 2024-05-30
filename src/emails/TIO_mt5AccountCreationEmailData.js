import { DateTime } from "luxon";

const templateData = {
  en: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "en" });
    const result = {
      global_variables: params,
      subject: `You've opened a trading account on MetaTrader! (${timeNow})`,
      content: {
        title: `Dear ${params.full_name},`,
        body1: "You've opened a trading account on MetaTrader!",
        body2:
          "Please save these details as you will need them to log into your platform.",
        body3: `Account Number: <b>${params.account_number}</b>`,
        body4: `Password: <b>${params.password}</b>`,
        body5: "<b>Here is a reminder of the account type you chose:</b>",
        body6: `Account Type: <b>${params.account_type}</b><br>Currency: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leverage: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Now all that's left to do is to transfer funds from your ${params.company_name} into your MetaTrader account by clicking</b> <a href="${params.transfer_funds_cta}" target="_blank">here</a>`,
        closing: `Happy trading!<br><br>${params.company_name}<br>Customer Support Team`,
      },
      footer: {
        risk_disclaimer_title: "Risk disclaimer:",
        risk_disclaimer_body1:
          "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Never deposit more than you are prepared to lose. Professional client's losses can exceed their deposit. Please see our risk warning policy and seek independent professional advice if you do not fully understand. This information is not directed or intended for distribution to or use by residents of certain countries/jurisdictions including, but not limited to, USA & OFAC. The Company holds the right to alter the aforementioned list of countries at its own discretion.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. is a Company registered in Saint Vincent and the Grenadines as an International Business Company with registration number 24986 IBC 2018.",
        risk_disclaimer_body3:
          "The registered office of the Company is Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. is authorised by Mwali International Services Authority in Comoros Union with license number T2023224 with registered office at Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets is a trading name of TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. All Rights Reserved.`,
      },
    };
    return result;
  },
  ar: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "ar" });
    const result = {
      global_variables: params,
      subject: `لقد فتحت حساب تداول حقيقي في ميتاتريدر! (${timeNow})`,
      content: {
        title: `عزيزي ${params.full_name},`,
        body1: "لقد فتحت حساب تداول حقيقي في ميتاتريدر!",
        body2:
          "يرجى حفظ هذه البيانات لأنك ستحتاج إليها عند تسجيل الدخول إلى منصتك.",
        body3: `رقم الحساب: <b>${params.account_number}</b>`,
        body4: `كلمة المرور: <b>${params.password}</b>`,
        body5: "<b>فيما يلي إشعار بنوع الحساب الذي اخترته:</b>",
        body6: `العُملة: <b>${
          params.account_type
        }</b><br>عُمْلة مُتَداوَلة: <b>${params.currency}</b>${
          params.leverage
            ? `<br>الرافعة الماليَّة: <b>${params.leverage}</b>`
            : ``
        }<br>نوع الحساب: <b>${params.platform}</b><br>السيرف: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>كل ما تبقى الآن هو تحويل الأموال من ${params.company_name} إلى حسابك في ميتاتريدر الخاص بك عن طريق النقر</b> <a href="${params.transfer_funds_cta}" target="_blank">هنا</a>`,
        closing: `تداول سعيد!<br><br>${params.company_name}<br>فريق دعم العملاء`,
      },
      footer: {
        risk_disclaimer_title: ":إخلاء المسؤولية عن المخاطر",
        risk_disclaimer_body1:
          "العقود مقابل الفروقات هي أدوات معقدة وتتحتوي على مخاطر عالية قد تؤدي لخسارة الأموال بسرعة بسبب الرافعة المالية. يجب أن تفكر فيما إذا كنت تفهم كيفية عمل العقود مقابل الفروقات وما إذا كنت تستطيع تحمل مخاطر عالية التي تؤدي لفقدان أموالك. لا تودع أبدًا أكثر مما أنت مستعد لخسارته. يمكن أن تتجاوز خسائر العميل المحترف إيداعه. يرجى الاطلاع على سياسة التحذير من المخاطر الخاصة بنا والحصول على مشورة مهنية مستقلة إذا كنت لا تفهم تمامًا. هذه المعلومات ليست موجهة أو مخصصة للتوزيع أو الاستخدام من قبل المقيمين في بعض البلدان / الولايات القضائية بما في ذلك ، لكن ليس حصرا ، الولايات المتحدة الأمريكية ومكتب مراقبة الأصول الأجنبية. تحتفظ الشركة بالحق في تغيير قائمة البلدان المذكورة أعلاه وفقًا لتقديرها الخاص.",
        risk_disclaimer_body2:
          "شركة TIO Markets Ltd هي شركة مُسجَّلة في سانت فينسنت والغرينادين كشركة أعمال دولية تحت رقم 24986 IBC 2018.",
        risk_disclaimer_body3:
          "المكتب المسجل للشركة هو Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. مصرح بها من قبل Mwali International Services Authority في Comoros Union برقم ترخيص T2023224 مع مكتب مسجل في Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets هو الاسم التجاري لشركة TIO Markets Ltd.",
        copyright: `©${params.year} شركة TIO Markets Ltd. جميع الحقوق محفوظة.`,
      },
    };
    return result;
  },
  cz: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "cz" });
    const result = {
      global_variables: params,
      subject: `Otevřeli jste nový účet na MetaTrader! (${timeNow})`,
      content: {
        title: `Vážený(á) ${params.full_name},`,
        body1: "Otevřeli jste nový účet na MetaTrader!",
        body2:
          "Uložte si prosím přihlašovací údaje, pomocích kterých se budete přihlašovat do systému.",
        body3: `Číslo účtu: <b>${params.account_number}</b>`,
        body4: `Heslo: <b>${params.password}</b>`,
        body5: "<b>Shrnutí nově otevřeného účtu:</b>",
        body6: `Typ účtu: <b>${params.account_type}</b><br>Měna: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>pákový převod: <b>${params.leverage}</b>` : ``
        }<br>Plošina: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Nyní už jenom zbývá převezt prostředky z ${params.company_name} na váš MetaTrader účet kliknutím na</b> <a href="${params.transfer_funds_cta}" target="_blank">Zde</a>`,
        closing: `Úspěšné obchodování!<br><br>${params.company_name}<br>Tým klientské podpory`,
      },
      footer: {
        risk_disclaimer_title: "Zřeknutí se rizik:",
        risk_disclaimer_body1:
          "CFD jsou složité nástroje, jejichž obchodování je spojeno s vysokým rizikem ztráty kvůli použité páce. Měli byste dobře zvážit, zda rozumíte, jak fungují CFD a zda si můžete dovolit podstoupit vysoké riziko ztráty vašich peněz. Nikdy nevkládejte částku vyšší, než jakou jste ochotni ztratit. Ztráty odborného klienta mohou být vyšší než jeho vklad. Přečtěte si prosím naše zásady upozornění na rizika a vyhledejte nezávislé profesionální poradenství, pokud tomu úplně nerozumíte. Tyto informace nejsou určeny/zamýšleny pro distribuci rezidentům určitých zemí/jurisdikcí, například rezidentům USA a zemí na seznamu Kanceláře pro kontrolu zahraničních aktiv amerického ministerstva financí (OFAC). Společnost má právo změnit.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. je společnost registrovaná na Svatém Vincenci a Grenadinách jako mezinárodní obchodní společnost s registračním číslem 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Sídlo společnosti je Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. je autorizována Mwali International Services Authority v Comoros Union s licencí číslo T2023224 se sídlem na adrese Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets je obchodní název společnosti TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Všechna práva vyhrazena.`,
      },
    };
    return result;
  },
  de: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "de" });
    const result = {
      global_variables: params,
      subject: `Sie haben ein Handelskonto bei MetaTrader-eröffnet! (${timeNow})`,
      content: {
        title: `Sehr geehrter ${params.full_name},`,
        body1: "Sie haben ein Handelskonto bei MetaTrader-eröffnet!",
        body2:
          "Bitte speichern Sie diese Daten, da Sie diese für die Anmeldung bei Ihrer Plattform benötigen.",
        body3: `Kontonummer: <b>${params.account_number}</b>`,
        body4: `Passwort: <b>${params.password}</b>`,
        body5:
          "<b>Hier ist eine Erinnerung zum von Ihnen gewählten Kontotyp:</b>",
        body6: `Kontotyp: <b>${params.account_type}</b><br>Währung: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Hebel: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Alles, was Sie jetzt noch tun müssen, ist die Überweisung von Ihrem ${params.company_name} Wallet zu Ihrem MetaTrader Konto, indem Sie</b> <a href="${params.transfer_funds_cta}" target="_blank">ier klicken</a>`,
        closing: `Viel Erfolg beim Trading!<br><br>${params.company_name}<br>Team für Kundenzufriedenheit`,
      },
      footer: {
        risk_disclaimer_title: "Risikohinweis:",
        risk_disclaimer_body1:
          "CFDs sind komplexe Instrumente und bergen aufgrund des Hebels ein hohes Risiko, schnell Geld zu verlieren. Sie sollten sich überlegen, ob Sie verstehen, wie CFDs funktionieren und ob Sie es sich leisten können, das hohe Risiko einzugehen, Ihr Geld zu verlieren. Zahlen Sie nie mehr ein, als Sie bereit sind, zu verlieren. Die Verluste professioneller Kunden können ihre Einzahlung übersteigen. Bitte lesen Sie unsere Risikohinweise und suchen Sie unabhängigen professionellen Rat, wenn Sie nicht alles verstanden haben. Diese Informationen sind nicht für die Verteilung an oder die Nutzung durch Einwohner bestimmter Länder/Gerichtsbarkeiten bestimmt, einschließlich, aber nicht beschränkt auf die USA und OFAC. Das Unternehmen behält sich das Recht vor, die vorgenannte Liste von Ländern nach eigenem Ermessen zu ändern.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. ist ein in Saint Vincent und den Grenadinen als internationales Geschäftsunternehmen registriertes Unternehmen mit der Registriernummer 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Der eingetragene Sitz des Unternehmens ist Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. ist von der Mwali International Services Authority in Comoros Union unter Lizenznummer T2023224, mit Sitz in Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM autorisiert. TIOmarkets ist ein Handelsname von TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Alle Rechte vorbehalten.`,
      },
    };
    return result;
  },
  es: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "es" });
    const result = {
      global_variables: params,
      subject: `¡Usted ha abierto una cuenta de trading con MetaTrader! (${timeNow})`,
      content: {
        title: `Estimado(a) ${params.full_name},`,
        body1: "¡Usted ha abierto una cuenta de trading con MetaTrader!",
        body2:
          "Guarde estos datos, ya que los necesitará para iniciar sesión en su plataforma.",
        body3: `Número de cuenta: <b>${params.account_number}</b>`,
        body4: `Contraseña: <b>${params.password}</b>`,
        body5:
          "<b>Aquí tiene un recordatorio del tipo de cuenta que ha elegido:</b>",
        body6: `Tipo de cuenta: <b>${params.account_type}</b><br>Divisa: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Apalancamiento: <b>${params.leverage}</b>` : ``
        }<br>Plataforma: <b>${params.platform}</b><br>Servidor: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Ahora todo lo que le falta por hacer es transferir fondos desde su e-Wallet en ${params.company_name} a su cuenta de MetaTrader haciendo clic</b> <a href="${params.transfer_funds_cta}" target="_blank">aquí</a>`,
        closing: `¡Feliz trading!<br><br>${params.company_name}<br>Equipo de felicidad del cliente`,
      },
      footer: {
        risk_disclaimer_title: "Advertencia de riesgo:",
        risk_disclaimer_body1:
          "Los CFD son instrumentos complejos y conllevan un alto riesgo de perder dinero rápidamente debido al apalancamiento. Deberías valorar si entiendes cómo funcionan los CFD y si puedes asumir el alto riesgo de perder tu dinero. Nunca deposites más de lo que estés dispuesto a perder. Los clientes profesionales pueden perder más de la suma depositada. Consulta nuestra política de advertencia de riesgos y busca asesoramiento profesional independiente si no la entiendes del todo. Esta información no está destinada a ser distribuida o utilizada por residentes de ciertos países o jurisdicciones, entre ellos EEUU y los países sancionados por la OFAC. La empresa se reserva el derecho de modificar esta lista de países a su discreción.",
        risk_disclaimer_body2:
          "TIO Markets Ltd es una empresa registrada en San Vicente y las Granadinas como empresa internacional con número 24986 IBC 2018.",
        risk_disclaimer_body3:
          "El domicilio social de la empresa es Suite 305, Griffith Corporate Center, Beachmont, PO Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. está autorizado por Mwali International Services Authority, en Comoros Union, con número de licencia T2023224 y con domicilio social en Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets es un nombre comercial de TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Todos los derechos reservados.`,
      },
    };
    return result;
  },
  fr: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "fr" });
    const result = {
      global_variables: params,
      subject: `Vous avez ouvert un compte de trading sur MetaTrader! (${timeNow})`,
      content: {
        title: `Chère/Cher ${params.full_name},`,
        body1: "Vous avez ouvert un compte de trading sur MetaTrader!",
        body2:
          "Veuillez enregistrer ces informations car vous en aurez besoin pour vous connecter à votre plateforme.",
        body3: `Numéro de compte: <b>${params.account_number}</b>`,
        body4: `Mot de passe: <b>${params.password}</b>`,
        body5: "<b>Voici un rappel du type de compte que vous avez choisi:</b>",
        body6: `Type de compte: <b>${params.account_type}</b><br>Devise: <b>${
          params.currency
        }</b>${
          params.leverage
            ? `<br>Effet de levier: <b>${params.leverage}</b>`
            : ``
        }<br>Plateforme: <b>${params.platform}</b><br>Serveur: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Il ne vous reste plus qu'à transférer des fonds de votre ${params.company_name} vers votre compte MetaTrader en cliquant</b> <a href="${params.transfer_funds_cta}" target="_blank">ici</a>`,
        closing: `Bon trading!<br><br>${params.company_name}<br>Équipe chargée du bonheur des clients`,
      },
      footer: {
        risk_disclaimer_title: "Avis de non-responsabilité:",
        risk_disclaimer_body1:
          "Les CFD sont des instruments complexes et comportent un risque élevé de pertes financières rapides en raison de l'effet de levier. Il convient de vous interroger : avez-vous correctement compris le fonctionnement des C F D et pouvez-vous vous permettre de risquer de perdre votre argent ? Ne placez jamais plus que ce que vous êtes prêt à perdre. Les pertes des clients professionnels peuvent excéder leur dépôt initial. Veuillez consulter notre politique de prévention des risques et demander l'avis d'un professionnel indépendant si vous ne comprenez pas bien. Ces informations ne sont pas destinées à être distribuées ou utilisées par les résidents de certains pays/juridictions, y compris sans toutefois s'y limiter, les États-Unis et l'OFAC. La société se réserve le droit de modifier la liste de pays susmentionnée à sa propre discrétion.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. est constituée à Saint-Vincent-et-les-Grenadines (SVG) en tant que société commerciale internationale sous le numéro d'enregistrement 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Le siège social de la société est Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. est autorisée par Mwali International Services Authority dans Comoros Union avec le numéro de licence T2023224 dont le siège social est situé à Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets est un nom commercial de TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Tous droits réservés.`,
      },
    };
    return result;
  },
  hi: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "hi" });
    const result = {
      global_variables: params,
      subject: `आपने MetaTrader पर ट्रेडिंग अकाउंट ओपन किया है! (${timeNow})`,
      content: {
        title: `प्रिय ${params.full_name},`,
        body1: "आपने MetaTrader पर ट्रेडिंग अकाउंट ओपन किया है!",
        body2:
          "कृपया इन विवरणों को सहेजें क्योंकि MetaTrader में लाॉगिन करने के लिए आपको इनकी जरूरत होगी।",
        body3: `अकाउंट नंबर: <b>${params.account_number}</b>`,
        body4: `पासवर्ड: <b>${params.password}</b>`,
        body5: "<b>आपके द्वारा चुने गए अकाउंट टाईप का यह अनुस्‍मारक है:</b>",
        body6: `प्अकाउंट टाईप: <b>${params.account_type}</b><br>करेंसी: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leverage: <b>${params.leverage}</b>` : ``
        }<br>‍लेटफार्म: <b>${params.platform}</b><br>सर्वर: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>अब केवल इतना करना बाकी है कि <a href="${params.transfer_funds_cta}" target="_blank">यहां</a></b> क्लिक करके अपने ${params.transfer_funds_cta} से अपने मेटाट्रेडर खाते में धनराशि स्थानांतरित करें`,
        closing: `हैप्‍पी ट्रेडिंग!<br><br>${params.company_name}<br>कस्‍टमर हैप्‍पीनेस टीम`,
      },
      footer: {
        risk_disclaimer_title: "जोखिम अस्वीकरण:",
        risk_disclaimer_body1:
          "CFD जटिल इंस्‍टूमेंट हैं और लीवरेज के कारण इनमें तेजी से पैसा खोने का उच्च जोखिम है। आपको विचार करना चाहिए कि C F D कैसे काम करता है क्‍या इसकी आपको जानकारी है और क्या आप अपना पैसा गंवाने का उच्च जोखिम उठा सकते हैं। जितना आप खोने के लिए तैयार हैं उससे अधिक कभी डिपॉजिट न करें। प्रोफेशनल ग्राहक के नुकसान उनके डिपॉजिट से अधिक हो सकते हैं। कृपया हमारी जोखिम चेतावनी नीति देखें और आपके पूरी तरह न सपझ पाने पर निष्‍पक्ष प्रोफेशनल सलाह लें। यह जानकारी यूएसए एवं OFAC सहित कुछ देशों/ क्षेत्राधिकारों के निवासियों के वितरण या उपयोग के लिए नहीं है या उन्‍हें निर्देशित नहीं की जाती, लेकिन यह यहीं तक सीमित नहीं है। कंपनी के पास अपने विवेक से देशों की उपरोक्त सूची में बदलाव करने का अधिकार है।",
        risk_disclaimer_body2:
          "TIO Markets Ltd. ऐसी कंपनी है जो इंटरनेशनल बिजनेस कंपनी के रूप में Saint Vincent और Grenadines में रजिस्‍टर्ड है, जिसका रजिस्‍ट्रेशन नंबर 24986 IBC 2018।",
        risk_disclaimer_body3:
          "ककंपनी का पंजीकृत कार्यालय है Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. को Comoros Union में Mwali International Services Authority द्वारा अधिकृत किया गया है, जिसका लाइसेंस नंबर T2023224 है और पंजीकृत कार्यालय है Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets, TIO Markets Ltdका का ट्रेडिंग नाम है।",
        copyright: `©${params.year} TIO Markets Ltd. सर्वाधिकार सुरक्षित।`,
      },
    };
    return result;
  },
  hu: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "hu" });
    const result = {
      global_variables: params,
      subject: `Megnyitotta MetaTrader kereskedési számláját! (${timeNow})`,
      content: {
        title: `Kedves ${params.full_name},`,
        body1: "Megnyitotta MetaTrader kereskedési számláját!",
        body2:
          "Kérjük, mentse el ezeket az adatokat, mivel szükség lesz rájuk a platformra történő bejeletkezés során.",
        body3: `Számlaszám: <b>${params.account_number}</b>`,
        body4: `Jelszó: <b>${params.password}</b>`,
        body5:
          "<b>Itt egy emlékeztető az Ön által választott kereskedési számlatípusáról:</b>",
        body6: `Számlatípus: <b>${params.account_type}</b><br>Pénznem: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Tőkeáttétel: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Szerver: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Most pedig amit tennie kell, hogy tőkét helyez át a ${params.company_name} számlájáról a MetaTrader számlájára</b> <a href="${params.transfer_funds_cta}" target="_blank">erre</a> a linkre kattintva.`,
        closing: `Sikeres kereskedést!<br><br>${params.company_name}<br>Ügyfél Elégedettségi Csapat`,
      },
      footer: {
        risk_disclaimer_title: "Kockázati figyelmeztetés:",
        risk_disclaimer_body1:
          "A C F D-k összetett eszközök, és a tőkeáttétel miatt nagy a gyors veszteség kockázata. Gondolja át, hogy érti‑e a C F D-k működését, és hogy tudja‑e vállalni azt a komoly kockázatot, hogy elveszíti a pénzét. Soha ne fizessen be többet annál, mint amekkora veszteségre felkészült. A szakmai ügyfelek veszteségei meghaladhatják befizetésük mértékét. Tekintse meg kockázati figyelmeztető szabályzatunkat, és kérje független szakértő tanácsát, ha valamit nem teljesen ért. Ezeknek az információknak a célközönségébe, illetve szándékolt terjesztési vagy felhasználói körébe nem tartoznak bizonyos országok/joghatóságok lakosai. Ideértendők például, de nem kizárólagosan, az Egyesült Államok és az OFAC jegyzékében szereplő országok lakosai. A Vállalat fenntartja magának a jogot, hogy saját belátása szerint módosítsa a fenti országok jegyzékét.",
        risk_disclaimer_body2:
          "A TIO Markets Ltd. a Saint Vincent és Grenadine Szigeteken bejegyzett nemzetközi gazdasági társaság, regisztrációs szám: 24986 IBC 2018.",
        risk_disclaimer_body3:
          "A Cég székhelye Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. A TIO Markets Ltd. a Mwali International Services Authority engedélyével működik a Comoros Union területén T2023224 számú engedéllyel, amelynek székhelye: Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. A TIOmarkets a TIO Markets Ltd. kereskedelmi neve.",
        copyright: `©${params.year} TIO Markets Ltd. Minden jog fenntartva.`,
      },
    };
    return result;
  },
  id: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "id" });
    const result = {
      global_variables: params,
      subject: `Megnyitotta MetaTrader kereskedési számláját! (${timeNow})`,
      content: {
        title: `Kedves ${params.full_name},`,
        body1: "Megnyitotta MetaTrader kereskedési számláját!",
        body2:
          "Kérjük, mentse el ezeket az adatokat, mivel szükség lesz rájuk a platformra történő bejeletkezés során.",
        body3: `Számlaszám: <b>${params.account_number}</b>`,
        body4: `Jelszó: <b>${params.password}</b>`,
        body5:
          "<b>Itt egy emlékeztető az Ön által választott kereskedési számlatípusáról:</b>",
        body6: `Számlatípus: <b>${params.account_type}</b><br>Pénznem: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Tőkeáttétel: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Szerver: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Most pedig amit tennie kell, hogy tőkét helyez át a ${params.company_name} számlájáról a MetaTrader számlájára</b> <a href="${params.transfer_funds_cta}" target="_blank">erre</a> a linkre kattintva.`,
        closing: `Sikeres kereskedést!<br><br>${params.company_name}<br>Ügyfél Elégedettségi Csapat`,
      },
      footer: {
        risk_disclaimer_title: "Kockázati figyelmeztetés:",
        risk_disclaimer_body1:
          "A C F D-k összetett eszközök, és a tőkeáttétel miatt nagy a gyors veszteség kockázata. Gondolja át, hogy érti‑e a C F D-k működését, és hogy tudja‑e vállalni azt a komoly kockázatot, hogy elveszíti a pénzét. Soha ne fizessen be többet annál, mint amekkora veszteségre felkészült. A szakmai ügyfelek veszteségei meghaladhatják befizetésük mértékét. Tekintse meg kockázati figyelmeztető szabályzatunkat, és kérje független szakértő tanácsát, ha valamit nem teljesen ért. Ezeknek az információknak a célközönségébe, illetve szándékolt terjesztési vagy felhasználói körébe nem tartoznak bizonyos országok/joghatóságok lakosai. Ideértendők például, de nem kizárólagosan, az Egyesült Államok és az OFAC jegyzékében szereplő országok lakosai. A Vállalat fenntartja magának a jogot, hogy saját belátása szerint módosítsa a fenti országok jegyzékét.",
        risk_disclaimer_body2:
          "A TIO Markets Ltd. a Saint Vincent és Grenadine Szigeteken bejegyzett nemzetközi gazdasági társaság, regisztrációs szám: 24986 IBC 2018.",
        risk_disclaimer_body3:
          "A Cég székhelye Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. A TIO Markets Ltd. a Mwali International Services Authority engedélyével működik a Comoros Union területén T2023224 számú engedéllyel, amelynek székhelye: Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. A TIOmarkets a TIO Markets Ltd. kereskedelmi neve.",
        copyright: `©${params.year} TIO Markets Ltd. Minden jog fenntartva.`,
      },
    };
    return result;
  },
  it: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "it" });
    const result = {
      global_variables: params,
      subject: `You've opened a trading account on MetaTrader! (${timeNow})`,
      content: {
        title: `Dear ${params.full_name},`,
        body1: "You've opened a trading account on MetaTrader!",
        body2:
          "Please save these details as you will need them to log into your platform.",
        body3: `Account Number: <b>${params.account_number}</b>`,
        body4: `Password: <b>${params.password}</b>`,
        body5: "<b>Here is a reminder of the account type you chose:</b>",
        body6: `Account Type: <b>${params.account_type}</b><br>Currency: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leverage: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Now all that's left to do is to transfer funds from your ${params.company_name} into your MetaTrader account by clicking</b> <a href="${params.transfer_funds_cta}" target="_blank">here</a>`,
        closing: `Happy trading!<br><br>${params.company_name}<br>Customer Support Team`,
      },
      footer: {
        risk_disclaimer_title: "Informativa sul rischio:",
        risk_disclaimer_body1:
          "I CFD sono strumenti complessi e comportano un elevato rischio di perdita del denaro in tempi brevi a causa della leva. Valuta se comprendi come funzionano i CFD e se puoi sostenere l’elevato rischio di perdere denaro. Non depositare mai più di quanto sei disposto a perdere. Le perdite dei clienti professionali possono superare i depositi. Consulta la nostra Politica sul rischio e richiedi una consulenza professionale indipendente se non la comprendi appieno. Queste informazioni non sono destinate o intese per la distribuzione a o all’utilizzo da parte di residenti in certi paesi e certe giurisdizioni, inclusi, senza limiti, Stati Uniti e OFAC. L’azienda si riserva il diritto di alterare l’elenco dei paesi sopra riportati a propria discrezione.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. è una società registrata a Saint Vincent e Grenadine come International Business Company con numero di registrazione 24986 IBC 2018.",
        risk_disclaimer_body3:
          "La sede legale della Società è Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. è autorizzata da Mwali International Services Authority in Comoros Union con numero di licenza T2023224 e sede legale presso Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets è un nome commerciale di TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Tutti i diritti riservati.`,
      },
    };
    return result;
  },
  ms: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "ms" });
    const result = {
      global_variables: params,
      subject: `Anda telah membuka akaun dagangan langsung di MetaTrader! (${timeNow})`,
      content: {
        title: `Dihormati ${params.full_name},`,
        body1: "Anda telah membuka akaun dagangan langsung di MetaTrader!",
        body2:
          "Sila simpan butiran ini kerana anda memerlukannya untuk log masuk ke platform.",
        body3: `Nombor Akaun: <b>${params.account_number}</b>`,
        body4: `Kata Laluan: <b>${params.password}</b>`,
        body5:
          "<b>Berikut ialah peringatan bagi jenis akaun yang anda pilih:</b>",
        body6: `Jenis Akaun: <b>${params.account_type}</b><br>Mata Wang: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leveraj: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Pelayan: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Sekarang anda hanya perlu memindahkan dana daripada dompet ${params.company_name} nda ke dalam akaun MetaTrader anda dengan mengklik di</b> <a href="${params.transfer_funds_cta}" target="_blank">sini</a>`,
        closing: `Selamat berdagang!<br><br>${params.company_name}<br>Pasukan Kepuasan Pelanggan`,
      },
      footer: {
        risk_disclaimer_title: "Penafian risiko:",
        risk_disclaimer_body1:
          "CFD ialah instrumen yang kompleks dan disertakan dengan risiko tinggi untuk kerugian wang dengan cepat kerana leveraj. Anda perlu mempertimbangkan sama ada anda memahami cara CFD berfungsi dan sama ada anda mampu untuk mengambil risiko yang tinggi untuk kerugian wang anda. Jangan mendepositkan dana melebihi jumlah yang anda bersedia untuk kerugian. Kerugian pelanggan profesional boleh melebihi deposit mereka. Sila lihat dasar amaran risiko kami dan dapatkan nasihat profesional bebas jika anda tidak memahami dasar itu sepenuhnya. Maklumat ini tidak diarahkan atau ditujukan untuk pengedaran atau penggunaan oleh penduduk di negara/bidang kuasa tertentu, termasuk tetapi tidak terhad kepada USA & OPEC. Syarikat berhak mengubah senarai negara yang tersebut mengikut budi bicaranya.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. adalah Syarikat yang berdaftar di Saint Vincent dan Grenadines sebagai Syarikat Perniagaan Antarabangsa dengan nombor pendaftaran 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Pejabat berdaftar Syarikat ialah Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. diberi kuasa oleh Mwali International Services Authority di Comoros Union dengan nombor lesen T2023224 dengan pejabat berdaftar di Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets ialah nama dagangan TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Hak Cipta Terpelihara.`,
      },
    };
    return result;
  },
  nl: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "nl" });
    const result = {
      global_variables: params,
      subject: `U heeft een handelsaccount op Meta Trader geopend! (${timeNow})`,
      content: {
        title: `Beste ${params.full_name},`,
        body1: "U heeft een handelsaccount op Meta Trader geopend!",
        body2:
          "Bewaar deze gegevens, aangezien u die nodig heeft om in te loggen op uw platform.",
        body3: `Rekeningnummer: <b>${params.account_number}</b>`,
        body4: `Wachtwoord: <b>${params.password}</b>`,
        body5:
          "<b>Dit is een herinnering in verband met het accounttype dat u heeft gekozen:</b>",
        body6: `Account Type: <b>${params.account_type}</b><br>Valuta: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leverage: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Het enige wat u nu nog hoeft te doen is fondsen overboeken vanuit uw ${params.company_name} naar uw MetaTrader-account door</b> <a href="${params.transfer_funds_cta}" target="_blank">te klikken</a>`,
        closing: `Veel handelsplezier!<br><br>${params.company_name}<br>Klantenondersteuningsteam`,
      },
      footer: {
        risk_disclaimer_title: "Risicodisclaimer:",
        risk_disclaimer_body1:
          "CFD's zijn complexe instrumenten en brengen vanwege de hefboomwerking een hoog risico met zich mee om snel geld te verliezen. U moet overwegen of u begrijpt hoe CFD's werken en of u het zich kunt veroorloven om het hoge risico te lopen uw geld te verliezen. Stort nooit meer dan u bereid bent te verliezen. De verliezen van professionele klanten kunnen groter zijn dan hun aanbetaling. Raadpleeg ons risicowaarschuwingsbeleid en win onafhankelijk professioneel advies in als u het niet helemaal begrijpt. Deze informatie is niet gericht of bedoeld voor distributie aan of gebruik door inwoners van bepaalde landen/rechtsgebieden, inclusief maar niet beperkt tot de VS en OFAC. Het bedrijf behoudt zich het recht voor om de bovengenoemde lijst met landen naar eigen goeddunken te wijzigen.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. is een bedrijf geregistreerd in Saint Vincent en de Grenadines als een internationaal zakenbedrijf met registratienummer 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Het geregistreerde kantoor van het bedrijf is Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. wordt gemachtigd door Mwali International Services Authority in Comoros Union met licentienummer T2023224 met een geregistreerd kantoor op Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets is een handelsnaam van TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Alle rechten voorbehouden.`,
      },
    };
    return result;
  },
  ph: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "ph" });
    const result = {
      global_variables: params,
      subject: `Nakapagbukas ka na ng isang na account sa pangangalakal sa MetaTrader! (${timeNow})`,
      content: {
        title: `Minamahal ${params.full_name},`,
        body1:
          "Nakapagbukas ka na ng isang na account sa pangangalakal sa MetaTrader!",
        body2:
          "Mangyaring i-save ang mga detalyeng ito dahil kakailanganin mo sila upang makapag-log in ka sa iyong plataporma.",
        body3: `Numero ng Account: <b>${params.account_number}</b>`,
        body4: `Password: <b>${params.password}</b>`,
        body5:
          "<b>Narito ang isang paalaala ng uri ng account na pinili mo:</b>",
        body6: `Uri ng Account: <b>${params.account_type}</b><br>Currency: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leverage: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Ngayon ang kailangan na lamang gawin ay maglipat ng mga pondo mula sa iyong ${params.company_name} sa iyong account sa MetaTrader sa pamamagitan ng pag-click</b> <a href="${params.transfer_funds_cta}" target="_blank">here</a>`,
        closing: `Maligayang pangangalakal!<br><br>${params.company_name}<br>Team ng Kaligayahan ng Customer ng`,
      },
      footer: {
        risk_disclaimer_title: "Disclaimer sa panganib:",
        risk_disclaimer_body1:
          "Pagtatatwa sa panganib: Ang mga CFD ay mga kumplikadong instrumento at may mataas na panganib na mabilis na mawalan ng pera dahil sa leverage. Dapat mong isaalang-alang kung naiintindihan mo kung paano gumagana ang mga CFD at kung kaya mong kunin ang mataas na panganib na mawala ang iyong pera. Huwag kailanman magdeposito ng higit sa handa mong mawala. Ang pagkalugi ng propesyonal na kliyente ay maaaring lumampas sa kanilang deposito. Pakitingnan ang aming patakaran sa babala sa panganib at humingi ng independiyenteng propesyonal na payo kung hindi mo lubos na nauunawaan. Ang impormasyong ito ay hindi nakadirekta o inilaan para sa pamamahagi o paggamit ng mga residente ng ilang partikular na bansa/saklaw kabilang ang, ngunit hindi limitado sa, USA at OFAC. Ang Kumpanya ay may karapatan na baguhin ang nabanggit na listahan ng mga bansa sa sarili nitong pagpapasya.",
        risk_disclaimer_body2:
          "Ang TIO Markets Ltd. ay isang Kumpanya na nakarehistro sa Saint Vincent at ang Grenadines bilang isang International Business Company na may numero ng pagpaparehistro 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Ang rehistradong opisina ng Kumpanya ay Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent at ang Grenadines. Ang TIO Markets Ltd. ay pinahintulutan ng Mwali International Services Authority sa Comoros Union na may numero ng lisensya na T2023224 na may rehistradong opisina sa Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. Ang TIOmarkets ay isang pangalan ng kalakalan ng TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Lahat ng Karapatan ay Nakalaan.`,
      },
    };
    return result;
  },
  pl: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "pl" });
    const result = {
      global_variables: params,
      subject: `Otworzyłeś/aś rachunek handlowy na platformie MetaTrader! (${timeNow})`,
      content: {
        title: `Witaj ${params.full_name},`,
        body1: "Otworzyłeś/aś rachunek handlowy na platformie MetaTrader!",
        body2:
          "Proszę zapisać te dane, ponieważ będą one potrzebne do zalogowania się na platformie.",
        body3: `Numer rachunku: <b>${params.account_number}</b>`,
        body4: `Hasło: <b>${params.password}</b>`,
        body5: "<b>Oto wybrany przez Ciebie typ rachunku:</b>",
        body6: `Typ rachunku: <b>${params.account_type}</b><br>Waluta: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Dźwignia: <b>${params.leverage}</b>` : ``
        }<br>Platformie: <b>${params.platform}</b><br>Serwer: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Teraz wystarczy tylko przelać środki z portfela ${params.company_name} na rachunek MetaTrader klikającg</b> <a href="${params.transfer_funds_cta}" target="_blank">tutaj</a>`,
        closing: `Szczęśliwego handlu!<br><br>${params.company_name}<br>Zespół ds. satysfakcji klienta`,
      },
      footer: {
        risk_disclaimer_title: "Ostrzeżenie przed Ryzykiem:",
        risk_disclaimer_body1:
          "CFD są złożonymi instrumentami i wiążą się z wysokim ryzykiem szybkiej utraty pieniędzy z powodu dźwigni finansowej. Powinieneś/Powinnaś rozważyć, czy rozumiesz, jak działają C F D i czy możesz sobie pozwolić na podjęcie wysokiego ryzyka utraty pieniędzy. Nigdy nie wpłacaj więcej, niż jesteś gotów stracić. Straty klienta profesjonalnego mogą przewyższać jego depozyt. Prosimy zapoznać się z naszym ostrzeżeniem przed ryzykiem i zasięgnąć niezależnej porady specjalisty, jeśli nie jesteś w pełni świadomy/a zagrożeń. Informacje te nie są kierowane ani przeznaczone do rozpowszechniania lub wykorzystania przez mieszkańców niektórych krajów/jurysdykcji, w tym, ale nie wyłącznie, USA i OFAC. Spółka ma prawo do zmiany powyższej listy krajów według własnego uznania.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. jest firmą zarejestrowaną w Saint Vincent i Grenadynach jako międzynarodowa firma biznesowa o numerze rejestracyjnym 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Siedziba firmy znajduje się pod adresem Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. jest autoryzowany przez Mwali International Services Authority na Comoros Union z numerem licencji T2023224 i siedzibą pod adrsem Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets jest nazwą handlową TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Wszystkie prawa zastrzeżone.`,
      },
    };
    return result;
  },
  pt: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "pt" });
    const result = {
      global_variables: params,
      subject: `Acabou de abrir uma conta de trading ao na MetaTrader! (${timeNow})`,
      content: {
        title: `Caro(a) ${params.full_name},`,
        body1: "Acabou de abrir uma conta de trading ao na MetaTrader!",
        body2:
          "Aconselhamos que guarde estes dados uma vez que irá precisar deles para fazer o login na sua plataforma.",
        body3: `Account Number: <b>${params.account_number}</b>`,
        body4: `Palavra-passe: <b>${params.password}</b>`,
        body5: "<b>Lembrete do tipo de conta que escolheu:</b>",
        body6: `Tipo de Conta: <b>${params.account_type}</b><br>Moeda: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Alavancagem: <b>${params.leverage}</b>` : ``
        }<br>Plataforma: <b>${params.platform}</b><br>Servidor: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Agora, só precisa de transferir fundos da ${params.company_name} para a sua conta MetaTrader, clicando</b> <a href="${params.transfer_funds_cta}" target="_blank">aqui</a>`,
        closing: `Feliz trading!<br><br>${params.company_name}<br>Equipa de Felicidade do Cliente`,
      },
      footer: {
        risk_disclaimer_title: "Aviso de risco:",
        risk_disclaimer_body1:
          "os CFD são instrumentos complexos e têm um risco elevado de perda rápida de dinheiro devido a alavancagem. Deverá ponderar se compreende como os CFD funcionam e se consegue suportar o risco elevado de perda do seu dinheiro. Nunca deposite mais do que está preparado para perder. As perdas dos clientes profissionais podem exceder o depósito. Consulte a nossa política de alerta de risco e procure aconselhamento profissional independente caso não compreenda totalmente. Esta informação não é orientada/destinada a distribuição a residentes em determinados países/jurisdições incluindo, mas não limitado a, EUA e OFAC. A Empresa detém o direito de alterar as listas de países supramencionados por deliberação própria.",
        risk_disclaimer_body2:
          "A TIO Markets Ltd. é uma empresa registrada em São Vicente e Granadinas como uma empresa de negócios internacionais com o número de registro 24986 IBC 2018.",
        risk_disclaimer_body3:
          "A sede social da empresa é Suite 305, Griffith Corporate Center, Beachmont, PO Box 1510, Kingstown, Saint Vincent and the Grenadines. A TIO Markets Ltd. está autorizada pela Mwali International Services Authority em Comoros Union com a licença N.º T2023224 e com a sede registada em Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. A TIOmarkets  é uma designação comercial da TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Todos os direitos reservados.`,
      },
    };
    return result;
  },
  cn: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "cn" });
    const result = {
      global_variables: params,
      subject: `您已经开设在MetaTrader上的真仓交易账户! (${timeNow})`,
      content: {
        title: `亲爱 ${params.full_name},`,
        body1: "您已经开设在MetaTrader上的真仓交易账户!",
        body2: "请保存这些资料，因为您需要用来登录您的平台。",
        body3: `账号: <b>${params.account_number}</b>`,
        body4: `Password: <b>${params.password}</b>`,
        body5: "<b>我们提醒您选择账户类型:</b>",
        body6: `账户类型: <b>${params.account_type}</b><br>币种: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>杠杆: <b>${params.leverage}</b>` : ``
        }<br>的平台: <b>${params.platform}</b><br>服务器: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>现在剩下要做的就是点击</b> <a href="${params.transfer_funds_cta}" target="_blank">此处</a> 将资金从您的 ${params.company_name} 转入您的 MetaTrader 账户。`,
        closing: `祝交易顺利!<br><br>${params.company_name}<br>客户满意团队`,
      },
      footer: {
        risk_disclaimer_title: "風險免責聲明:",
        risk_disclaimer_body1:
          "差价合约（C F D）是复杂的工具，由于杠杆的作用，具有快速亏损的较高风险。您应该考虑自己是否已经了解C F D的运行机制，以及您是否能够承担可能损失资金的高风险。切勿存入超过您可承受亏损的资金。专业客户的亏损可能超过其入金。如果您没有完全理解，请参阅我们的风险警告政策，并寻求独立的专业建议。本信息不针对或打算分发给特定国家/司法管辖区（包括但不限于美国和OFAC名单）的居民或供其使用。本公司有权自行决定更改上述国家/地区名单。",
        risk_disclaimer_body2:
          "TIO Markets Ltd. 是作为国际商业公司注册于圣文森特岛的公司，注册号为 24986 IBC 2018。",
        risk_disclaimer_body3:
          "该公司注册地址为Suite 305，Griffith Corporate Center，Beachmont，P.O. Box 1510，Kingstown，Saint Vincent and the Grenadines。TIO Markets Ltd.由位于Comoros Union的Mwali International Services Authority授权，许可证编号为T2023224，注册地址为Moheli Corporate Services Ltd，P.B. 1257 Bonovo Road，Fomboni，Comoros，KM。TIOmarkets是TIO Markets Ltd的商号。",
        copyright: `©${params.year} TIO Markets Ltd. 保留全部权利。`,
      },
    };
    return result;
  },
  sk: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "sk" });
    const result = {
      global_variables: params,
      subject: `Otvorili ste si obchodný účet na platforme MetaTrader! (${timeNow})`,
      content: {
        title: `Vážený/-á ${params.full_name},`,
        body1: "Otvorili ste si obchodný účet na platforme MetaTrader!",
        body2:
          "Tieto údaje si uložte, lebo ich budete potrebovať na prihlásenie do platformy.",
        body3: `Číslo účtu: <b>${params.account_number}</b>`,
        body4: `Heslo: <b>${params.password}</b>`,
        body5: "<b>Pripomíname vám, aký typ účtu ste si zvolili:</b>",
        body6: `Typ účtu: <b>${params.account_type}</b><br>Mena: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leverage: <b>${params.leverage}</b>` : ``
        }<br>Platforma: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Teraz už len stačí previesť finančné prostriedky z ${params.company_name} na Váš účet MetaTrader; na prevod kliknite</b> <a href="${params.transfer_funds_cta}" target="_blank">sem</a>`,
        closing: `Veľa šťastia pri obchodovaní!<br><br>${params.company_name}<br>Tím zákazníckeho šťastia`,
      },
      footer: {
        risk_disclaimer_title: "Vyhlásenie o riziku:",
        risk_disclaimer_body1:
          "CFD sú zložité nástroje a prinášajú vysoké riziko rýchlej straty peňazí v dôsledku pákového efektu. Mali by ste zvážiť, či rozumiete fungovaniu CFD a či si môžete dovoliť podstúpiť vysoké riziko straty svojich peňazí. Nikdy nevkladajte viac, ako ste pripravení stratiť. Straty profesionálneho klienta môžu presiahnuť jeho vklad. Prečítajte si naše zásady varovania pred rizikami a ak tomu úplne nerozumiete, vyhľadajte nezávislú odbornú radu. Tieto informácie nie sú určené ani určené na distribúciu alebo použitie obyvateľmi určitých krajín/jurisdikcií vrátane, ale nie výlučne, USA a OFAC. Spoločnosť si vyhradzuje právo zmeniť vyššie uvedený zoznam krajín podľa vlastného uváženia.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. je spoločnosť registrovaná na Svätom Vincente a Grenadinách ako medzinárodná obchodná spoločnosť s registračným číslom 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Sídlo Spoločnosti je Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Svätý Vincent a Grenadíny. TIO Markets Ltd. je autorizovaná Mwali International Services Authority v Komorskej únii s licenčným číslom T2023224 so sídlom Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Komory, KM. TIOmarkets je obchodný názov spoločnosti TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Všetky práva vyhradené.`,
      },
    };
    return result;
  },
  sl: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "sl" });
    const result = {
      global_variables: params,
      subject: `You've opened a trading account on MetaTrader! (${timeNow})`,
      content: {
        title: `Dear ${params.full_name},`,
        body1: "You've opened a trading account on MetaTrader!",
        body2:
          "Please save these details as you will need them to log into your platform.",
        body3: `Account Number: <b>${params.account_number}</b>`,
        body4: `Password: <b>${params.password}</b>`,
        body5: "<b>Here is a reminder of the account type you chose:</b>",
        body6: `Account Type: <b>${params.account_type}</b><br>Currency: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leverage: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Now all that's left to do is to transfer funds from your ${params.company_name} into your MetaTrader account by clicking</b> <a href="${params.transfer_funds_cta}" target="_blank">here</a>`,
        closing: `Happy trading!<br><br>${params.company_name}<br>Customer Support Team`,
      },
      footer: {
        risk_disclaimer_title: "Zavrnitev odgovornosti glede tveganja:",
        risk_disclaimer_body1:
          "CFD-ji so zapleteni instrumenti in prinašajo veliko tveganje hitre izgube denarja zaradi finančnega vzvoda. Razmislite o tem, ali razumete delovanje CFD-jev in ali si lahko privoščite visoko tveganje izgube denarja. Nikoli ne položite več, kot ste pripravljeni izgubiti. Izgube profesionalne stranke lahko presežejo njihov depozit. Oglejte si našo politiko opozarjanja na tveganje in poiščite neodvisen strokovni nasvet, če ne razumete popolnoma. Te informacije niso namenjene distribuciji ali uporabi s strani prebivalcev določenih držav/jurisdikcij, vključno z ZDA in OFAC, vendar ne omejeno nanje. Družba si pridržuje pravico, da po lastni presoji spremeni omenjeni seznam držav.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. je podjetje, registrirano v Saint Vincentu in Grenadinah kot mednarodno poslovno podjetje z registrsko številko 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Registrirani sedež družbe je Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent in Grenadine. TIO Markets Ltd. je pooblaščen s strani Mwali International Services Authority v Komorski uniji s številko licence T2023224 z registriranim sedežem na Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Komori, KM. TIOmarkets je trgovsko ime podjetja TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Vse pravice pridržane.`,
      },
    };
    return result;
  },
  tc: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "tc" });
    const result = {
      global_variables: params,
      subject: `您已在 MetaTrader 開立真倉交易帳戶! (${timeNow})`,
      content: {
        title: `親愛 ${params.full_name},`,
        body1: "您已在 MetaTrader 開立真倉交易帳戶!",
        body2: "請存儲該等資料，因為您需要用來登入您的平台。",
        body3: `帳號: <b>${params.account_number}</b>`,
        body4: `密碼: <b>${params.password}</b>`,
        body5: "<b>我們提醒您選擇帳戶類型:</b>",
        body6: `帳戶類型: <b>${params.account_type}</b><br>幣種: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>槓桿: <b>${params.leverage}</b>` : ``
        }<br>的平台: <b>${params.platform}</b><br>伺服器: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>現在剩下要做的就是點擊</b> <a href="${params.transfer_funds_cta}" target="_blank">此處</a> 將資金從您的 ${params.company_name} 轉入您的 MetaTrader 賬戶。`,
        closing: `祝交易順利!<br><br>${params.company_name}<br>客戶滿意團隊`,
      },
      footer: {
        risk_disclaimer_title: "风险免责声明:",
        risk_disclaimer_body1:
          "差價合約（C F D）乃複雜的工具，並槓桿作用而具有快速虧損的較高風險。您應該考慮自己是否已經瞭解C F D的運行機制，以及您是否能夠承擔可能損失資金的高風險。切勿存入超過您可承受虧損的資金。專業客戶的虧損可能超過其入金。如果您未完全理解，請參閱我們的風險警告政策，並尋求獨立的專業建議。此資訊並非針對或打算分發給特定國家/司法管轄區（包括但不限於美國和OFAC名單）的居民或供其使用。本公司有權酌情決定更改上述國家/地區名單。",
        risk_disclaimer_body2:
          "TIO Markets Ltd. 是作為國際商業公司註冊于聖文森特島的公司，註冊號為 24986 IBC 2018。",
        risk_disclaimer_body3:
          "該公司註冊地址為Suite 305，Griffith Corporate Center，Beachmont，P.O. Box 1510，Kingstown，Saint Vincent and the Grenadines。TIO Markets Ltd.由位於Comoros Union的Mwali International Services Authority授權，許可證編號為T2023224，註冊地址為Moheli Corporate Services Ltd，P.B. 1257 Bonovo Road，Fomboni，Comoros，KM。TIOmarkets是TIO Markets Ltd的商號。",
        copyright: `©${params.year} TIO Markets Ltd. 保留全部權利。`,
      },
    };
    return result;
  },
  th: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "th" });
    const result = {
      global_variables: params,
      subject: `ณได้เปิดบัญชีการเทรดจริงใน MetaTrader! (${timeNow})`,
      content: {
        title: `เรียนคุณ ${params.full_name},`,
        body1: "ณได้เปิดบัญชีการเทรดจริงใน MetaTrader!",
        body2:
          "โปรดบันทึกรายละเอียดเหล่านี้เนื่องจากคุณจะต้องใช้ในการล็อกอินเข้าสู่แพลตฟอร์มของคุณ.",
        body3: `เลขที่บัญชี: <b>${params.account_number}</b>`,
        body4: `รหัสผ่าน: <b>${params.password}</b>`,
        body5: "<b>ี่คือการแจ้งเตือนเกี่ยวกับประเภทบัญชีที่คุณเลือก:</b>",
        body6: `ประเภทบัญชี: <b>${params.account_type}</b><br>สกุลเงิน: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>เลเวอเรจ: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>เซิร์ฟเวอร์: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>ตอนนี้ ทั้งหมดที่คุณต้องทำก็คือการโอนเงินจากวอลเล็ต ${params.company_name} ของคุณไปยังบัญชี MetaTrader ของคุณ</b> <a href="${params.transfer_funds_cta}" target="_blank">โดยคลิกที่นี่</a>`,
        closing: `ขอให้มีความสุขกับการเทรด!<br><br>${params.company_name}<br>ทีมบริการลูกค้าที่มีความสุข`,
      },
      footer: {
        risk_disclaimer_title: "คำเตือนความเสี่ยง:",
        risk_disclaimer_body1:
          "สัญญาการซื้อขายส่วนต่าง เป็นตราสารที่มีความซับซ้อนและมีความเสี่ยงสูงที่จะสูญเสียเงินอย่างรวดเร็วจากเลเวอเรจ คุณควรพิจารณาว่าคุณเข้าใจถึงระบบการทำงานของ สัญญาการซื้อขายส่วนต่าง และพร้อมรับความเสี่ยงสูงที่จะสูญเสียเงินแล้วหรือไม่ อย่าฝากมากกว่าจำนวนเงินที่คุณพร้อมจะสูญเสีย การขาดทุนของลูกค้ามืออาชีพอาจมากกว่าเงินฝากของพวกเขา โปรดดูนโยบายคำเตือนความเสี่ยงของเราและรับคำแนะนำจากผู้เชี่ยวชาญที่เป็นอิสระหากคุณไม่เข้าใจส่วนใด ข้อมูลนี้ไม่ได้ถูกนำมาใช้หรือมีวัตถุประสงค์เพื่อเผยแพร่หรือใช้โดยผู้ที่อาศัยอยู่ในบางประเทศ/เขตอำนาจศาล โดยรวมถึงแต่ไม่จำกัดเพียง สหรัฐอเมริกาและ OFAC บริษัทมีสิทธิ์ในการเปลี่ยนแปลงรายชื่อประเทศข้างต้นตามดุลยพินิจของตนเอง",
        risk_disclaimer_body2:
          "TIO Markets Ltd. เป็น บริษัท ที่จดทะเบียนในเซนต์วินเซนต์และเกรนาดีนส์ในฐานะ บริษัท ธุรกิจระหว่างประเทศโดยมีเลขทะเบียน 24986 IBC 2018",
        risk_disclaimer_body3:
          "สำนักงานที่จดทะเบียนของบริษัทตั้งอยู่ที่ Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. ได้รับอนุญาตจาก Mwali International Services Authority, Comoros Union ใบอนุญาตเลขที่ T2023224 สำนักงานที่จดทะเบียนตั้งอยู่ที่ Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM TIOmarkets เป็นชื่อทางการค้าของ TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. สงวนลิขสิทธิ์`,
      },
    };
    return result;
  },
  tr: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "tr" });
    const result = {
      global_variables: params,
      subject: `You've opened a trading account on MetaTrader! (${timeNow})`,
      content: {
        title: `Dear ${params.full_name},`,
        body1: "You've opened a trading account on MetaTrader!",
        body2:
          "Please save these details as you will need them to log into your platform.",
        body3: `Account Number: <b>${params.account_number}</b>`,
        body4: `Password: <b>${params.password}</b>`,
        body5: "<b>Here is a reminder of the account type you chose:</b>",
        body6: `Account Type: <b>${params.account_type}</b><br>Currency: <b>${
          params.currency
        }</b>${
          params.leverage ? `<br>Leverage: <b>${params.leverage}</b>` : ``
        }<br>Platform: <b>${params.platform}</b><br>Server: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Now all that's left to do is to transfer funds from your ${params.company_name} into your MetaTrader account by clicking</b> <a href="${params.transfer_funds_cta}" target="_blank">here</a>`,
        closing: `Happy trading!<br><br>${params.company_name}<br>Customer Support Team`,
      },
      footer: {
        risk_disclaimer_title: "Risk feragatnamesi:",
        risk_disclaimer_body1:
          "CFD'ler karmaşık enstrümanlar olup, kaldıraçtan dolayı hızla para kaybedilmesi gibi yüksek seviyede risk söz konusudur. CFD'lerin işleyişini ve para kaybetme riskini alma hususunu anlayıp anlamadığınızı gözden geçirmelisiniz. Kesinlikle kaybetmeyi göze alamadığınızdan fazla para yatırmayın. Profesyonel müşterilerin karşı karşıya kaldığı kayıplar, yatırılan parayı aşabilir. Lütfen risk uyarısı politikamızı okuyun ve tam olarak anlamadığınız hususlar varsa, bağımsız profesyonel tavsiye alın. Bu bilgiler, ABD ve OFAC (Yabancı Varlıkları Kontrol Ofisi) dahil ancak bunlarla sınırlı olmamak kaydıyla, belirli ülkelerde/bölgelerde ikâmet edenlere gönderilmek veya bu kişilerce kullanıma yönelik değildir ve bu amaç doğrultusunda hazırlanmamıştır. Şirket, yukarıda belirtilen ülke listesini kendi takdirine bağlı olarak değiştirme hakkını saklı tutar.",
        risk_disclaimer_body2:
          "TIO Markets Ltd., 24986 IBC 2018 sicil numarasına sahip bir Uluslararası Ticaret Kuruluşu olarak St. Vincent ve Grenadinler'de kayıtlı bir şirkettir.",
        risk_disclaimer_body3:
          "Şirketin kayıtlı ofis adresi Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. Mwali International Services Authority tarafından Comoros Union sınırları içinde onaylanmıştır. Lisans numarası T2023224’tür. Onaylayan ofis adresi, Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets, bir TIO Markets Ltd. ticari adıdır.",
        copyright: `©${params.year} TIO Markets Ltd. Her hakkı saklıdır.`,
      },
    };
    return result;
  },
  vi: (params) => {
    const timeNow = DateTime.now().toFormat("LLL dd, HH:mm", { locale: "vi" });
    const result = {
      global_variables: params,
      subject: `Bạn đã mở một tài khoản giao dịch thực trên MetaTrader! (${timeNow})`,
      content: {
        title: `Kính thưa ${params.full_name},`,
        body1: "Bạn đã mở một tài khoản giao dịch thực trên MetaTrader!",
        body2:
          "Vui lòng lưu các thông tin này vì bạn sẽ cần chúng để đăng nhập vào nền tảng của mình.",
        body3: `Số tài khoản: <b>${params.account_number}</b>`,
        body4: `Mật khẩu: <b>${params.password}</b>`,
        body5: "<b>Dưới đây là ghi chú về loại tài khoản bạn đã chọn:</b>",
        body6: `Loại tài khoản: <b>${
          params.account_type
        }</b><br>Đồng tiền: <b>${params.currency}</b>${
          params.leverage ? `<br>Đòn bẩy: <b>${params.leverage}</b>` : ``
        }<br>Nền tảng: <b>${params.platform}</b><br>Máy chủ: <b>${
          params.server
        }</b><br>`,
        //body7: `<b>Giờ đây, tất cả những gì bạn cần làm là chuyển tiền từ ${params.company_name} vào tài khoản MetaTrader của bạn bằng cách nhấp vào</b> <a href="${params.transfer_funds_cta}" target="_blank">đây</a>`,
        closing: `Hhúc bạn có những trải nghiệm giao dịch thú vị!<br><br>${params.company_name}<br>Đội ngũ hỗ trợ khách hàng`,
      },
      footer: {
        risk_disclaimer_title: "Tuyên bố Miễn trừ Rủi ro:",
        risk_disclaimer_body1:
          "CFD là các công cụ phức tạp và có nguy cơ mất tiền nhanh chóng do đòn bẩy. Bạn nên xem xét liệu bạn có hiểu cách thức hoạt động của CFD hay không và liệu bạn có đủ khả năng chấp nhận rủi ro mất tiền cao hay không. Không bao giờ gửi nhiều hơn số tiền bạn sẵn sàng để mất. Khoản lỗ của khách hàng chuyên nghiệp có thể vượt quá số tiền gửi của họ. Vui lòng xem chính sách cảnh báo rủi ro của chúng tôi và tìm tư vấn chuyên nghiệp độc lập nếu bạn không hiểu đầy đủ. Thông tin này không được hướng dẫn hoặc nhằm mục đích phân phối hoặc sử dụng bởi cư dân của một số quốc gia/khu vực tài phán bao gồm nhưng không giới hạn ở Hoa Kỳ & OFAC. Công ty có quyền thay đổi danh sách các quốc gia nói trên theo quyết định riêng của mình.",
        risk_disclaimer_body2:
          "TIO Markets Ltd. là công ty được đăng ký tại Saint Vincent và Grenadines, hoạt động như một Công ty Kinh doanh Quốc tế với số đăng ký 24986 IBC 2018.",
        risk_disclaimer_body3:
          "Văn phòng đăng ký của Công ty là Suite 305, Griffith Corporate Center, Beachmont, P.O. Box 1510, Kingstown, Saint Vincent and the Grenadines. TIO Markets Ltd. được ủy quyền bởi Mwali International Services Authority tại Comoros Union bằng giấy phép số T2023224 có văn phòng đăng ký tại Moheli Corporate Services Ltd, P.B. 1257 Bonovo Road, Fomboni, Comoros, KM. TIOmarkets là tên thương mại của TIO Markets Ltd.",
        copyright: `©${params.year} TIO Markets Ltd. Bảo lưu Mọi quyền.`,
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
const createMt5AccountEmailData = (
  language,
  {
    account_number,
    password,
    platform,
    account_type,
    currency,
    leverage,
    server,
    company_name,
    year,
    full_name,
    support_email,
    transfer_funds_cta,
  }
) => {
  const dynamicTemplateData = (
    templateData[language] ? templateData[language] : templateData["en"]
  )({
    account_number,
    password,
    platform,
    account_type,
    currency,
    leverage,
    server,
    company_name,
    year,
    full_name,
    support_email,
    transfer_funds_cta,
  });

  return {
    templateId: "d-3cf8056d8757478bba275067b33c62b3",
    dynamicTemplateData,
  };
};

export default createMt5AccountEmailData;
