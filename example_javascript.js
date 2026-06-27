//  Questionnaire: Sexually tranmitted diseases symptom checker (form 42)
//  JL

/*jslint browser:true, for:true, white: true, long: true */
/*global libEBMEDS, libDiagnoses, libMeasurements, libMedication, libVaccinations, libProcedures, libPatient, libUser, libRisks, libCommon, libSharedFunctions, libQuestions, reminder, ebdeb*/

function scr01762() {
  // 0. Initialization
  if (!libEBMEDS.initScript("scr01762", "nafi", "fm42")) {
    return;
  }

  // **** Declare variables ****

  var unprotectedSex = libQuestions.getAnswerValue(428);
  var possibleSTDsymptoms = libQuestions.getAnswerValue(210);

  var hasFever = libQuestions.getAnswerValue(38);
  var degreesFever = libQuestions.getAnswerValue(7);

  var symptomsCommon = {
    abdominalPain: libQuestions.hasAnswerId(424, 658),
    swollenGlands: libQuestions.hasAnswerId(424, 653),
    jointPain: libQuestions.hasAnswerId(424, 654),
    musclePain: libQuestions.hasAnswerId(424, 655),
    rash: libQuestions.hasAnswerId(424, 1807),
    scalingSpotsInPalmsOrSoles: libQuestions.hasAnswerId(424, 1808),
    noneOfTheAbove: libQuestions.hasAnswerId(424, -1),
  };

  // Failsafe VAS ver 1.1
  function failsafeVAS() {
    // Uses AnswerID as a failsafe, if return value is not available
    for (var i = 1; i <= 10; i += 1) {
      if (libQuestions.hasAnswerId(5, 5 + i)) {
        return i;
      }
    }
    return 0;
  }

  var intensityVAS =
    Number(libQuestions.getAnswerValue(5)) >= 0 &&
    libQuestions.getAnswerValue(5) != null
      ? Number(libQuestions.getAnswerValue(5))
      : failsafeVAS();

  var lethargy = {
    bedridden: libQuestions.hasAnswerId(35, 2571),
    onlyCompulsoryActivities: libQuestions.hasAnswerId(35, 2572),
    normalActivities: libQuestions.hasAnswerId(35, 2573),
  };

  var symptomsOral = {
    roundSoreInThroat: libQuestions.hasAnswerId(1126, 1866),
    wartsInThroat: libQuestions.hasAnswerId(1126, 1863),
    groupOfPainfulBlistersInThroat: libQuestions.hasAnswerId(1126, 1864),
    fungalInfection: libQuestions.hasAnswerId(1126, 1865),
    noneOfTheAbove: libQuestions.hasAnswerId(1126, -1),
  };

  var symptomsFemale = {
    leukorrhea:
      libQuestions.hasAnswerId(238, 336) ||
      libQuestions.hasAnswerId(2396, 3581),
    dysuria:
      libQuestions.hasAnswerId(238, 337) ||
      libQuestions.hasAnswerId(2396, 3578),
    urinaryFrequency:
      libQuestions.hasAnswerId(238, 338) ||
      libQuestions.hasAnswerId(2396, 3579),
    urethralDischarge:
      libQuestions.hasAnswerId(238, 435) ||
      libQuestions.hasAnswerId(2396, 3580),
    abnormalVaginalDischarge:
      libQuestions.hasAnswerId(238, 339) ||
      libQuestions.hasAnswerId(2396, 3582),
    postCoitalBleeding:
      libQuestions.hasAnswerId(238, 357) ||
      libQuestions.hasAnswerId(2396, 3583),
    ulcerInLabia:
      libQuestions.hasAnswerId(238, 341) ||
      libQuestions.hasAnswerId(2396, 3584),
    ulcerInAnus:
      libQuestions.hasAnswerId(238, 343) ||
      libQuestions.hasAnswerId(2396, 3593),
    wartsInLabia:
      libQuestions.hasAnswerId(238, 345) ||
      libQuestions.hasAnswerId(2396, 3585),
    wartsInVagina:
      libQuestions.hasAnswerId(238, 346) ||
      libQuestions.hasAnswerId(2396, 3586),
    wartsInAnus:
      libQuestions.hasAnswerId(238, 347) ||
      libQuestions.hasAnswerId(2396, 3594),
    wartsInAnalCleft:
      libQuestions.hasAnswerId(238, 349) ||
      libQuestions.hasAnswerId(2396, 3595),
    groupOfBlistersInLabia:
      libQuestions.hasAnswerId(238, 351) ||
      libQuestions.hasAnswerId(2396, 3587),
    painlessPimple:
      libQuestions.hasAnswerId(238, 352) ||
      libQuestions.hasAnswerId(2396, 3596),
    noneOfTheAbove:
      libQuestions.hasAnswerId(238, -1) || libQuestions.hasAnswerId(2396, -1),
  };

  var symptomsMale = {
    dysuria: libQuestions.hasAnswerId(423, 642),
    urinaryFrequency: libQuestions.hasAnswerId(423, 643),
    urethralDischarge: libQuestions.hasAnswerId(423, 644),
    testisPain:
      libQuestions.hasAnswerId(423, 645) ||
      libQuestions.hasAnswerId(2396, 3588),
    ulcerInPenis:
      libQuestions.hasAnswerId(423, 646) ||
      libQuestions.hasAnswerId(2396, 3589),
    ulcerInAnus: libQuestions.hasAnswerId(423, 647),
    wartsInPenis:
      libQuestions.hasAnswerId(423, 648) ||
      libQuestions.hasAnswerId(2396, 3590),
    wartsInTestis:
      libQuestions.hasAnswerId(423, 649) ||
      libQuestions.hasAnswerId(2396, 3591),
    wartsInAnus: libQuestions.hasAnswerId(423, 656),
    wartsInAnalCleft: libQuestions.hasAnswerId(423, 657),
    groupOfBlistersInPenis:
      libQuestions.hasAnswerId(423, 650) ||
      libQuestions.hasAnswerId(2396, 3592),
    painlessPimple: libQuestions.hasAnswerId(423, 651),
    noneOfTheAbove: libQuestions.hasAnswerId(423, -1),
  };

  var contactHasSTD = {
    yes: libQuestions.hasAnswerId(219, 421),
    possibly: libQuestions.hasAnswerId(219, 423),
    no: libQuestions.hasAnswerId(219, 422),
    notKnown: libQuestions.hasAnswerId(219, 424),
  };

  var contactSTDType = {
    unknown: libQuestions.hasAnswerId(221, 669),
    chlamydia: libQuestions.hasAnswerId(221, 670),
    gonnarrhea: libQuestions.hasAnswerId(221, 671),
    syphilis: libQuestions.hasAnswerId(221, 672),
    herpes: libQuestions.hasAnswerId(221, 673),
    HIV: libQuestions.hasAnswerId(221, 674),
    hepatitisB: libQuestions.hasAnswerId(221, 675),
    hepatitisC: libQuestions.hasAnswerId(221, 676),
    other: libQuestions.hasAnswerId(221, 677),
  };

  var strContactSTDtypeOther = libQuestions.getAnswerValue(435)
    ? libQuestions.getAnswerValue(435)
    : "jokin muu"; // Prefill if textfield is empty

  var contactHasHIV = libQuestions.hasAnswerId(221, 674);

  var contactHasBeenMedicated = {
    yes: libQuestions.hasAnswerId(222, 425),
    no: libQuestions.hasAnswerId(222, 426),
    unknown: libQuestions.hasAnswerId(222, 427),
  };

  var typeOfSex = {
    vaginalSex:
      libQuestions.hasAnswerId(1634, 2474) ||
      libQuestions.hasAnswerId(1066, 1843),
    oralSex:
      libQuestions.hasAnswerId(1634, 2475) ||
      libQuestions.hasAnswerId(1066, 1803),
    analSexMan: libQuestions.hasAnswerId(1066, 1804),
    analSexRecevingFemale: libQuestions.hasAnswerId(1634, 2476),
    paidSex:
      libQuestions.hasAnswerId(8008, 10497) ||
      libQuestions.hasAnswerId(8009, 10501),
    sexWithUnknownPartner:
      libQuestions.hasAnswerId(8008, 10498) ||
      libQuestions.hasAnswerId(8009, 10502),
    sexWithIvDrugUser:
      libQuestions.hasAnswerId(8008, 10499) ||
      libQuestions.hasAnswerId(8009, 10503),
    sexBetweenMen: libQuestions.hasAnswerId(8008, 10496),
    dontWantToAnswerSexType:
      libQuestions.hasAnswerId(1634, 2479) ||
      libQuestions.hasAnswerId(1066, 1810),
    dontWantToAnswerRiskCategory:
      libQuestions.hasAnswerId(8008, 10500) ||
      libQuestions.hasAnswerId(8009, 10504),
    noneOfTheAbove:
      libQuestions.hasAnswerId(1634, -1) || libQuestions.hasAnswerId(1066, -1),
  };

  var pregnancyFemale = {
    yes: libQuestions.hasAnswerId(25, 414),
    no: libQuestions.hasAnswerId(25, 415),
    maybe: libQuestions.hasAnswerId(25, 416),
  };

  var pregnancyTransgender = {
    yes: libQuestions.hasAnswerId(5406, 7114),
    no: libQuestions.hasAnswerId(5406, 7115),
    maybe: libQuestions.hasAnswerId(5406, 7116),
  };

  var pregnancy = {
    yes: pregnancyFemale.yes || pregnancyTransgender.yes,
    no: pregnancyFemale.no || pregnancyTransgender.no,
    maybe: pregnancyFemale.maybe || pregnancyTransgender.maybe,
  };

  var testsAlreadyTaken = libQuestions.getAnswerValue(214);
  var testsPositive = libQuestions.getAnswerValue(430);

  var symptomsDuration = libQuestions.getAnswerValue(590);

  var syphilisSore =
    symptomsFemale.ulcerInAnus ||
    symptomsFemale.ulcerInLabia ||
    symptomsMale.ulcerInAnus ||
    symptomsMale.ulcerInPenis ||
    symptomsOral.roundSoreInThroat;

  // Exclusion syptom lists
  var nonSyphilisSymptom =
    symptomsCommon.abdominalPain ||
    symptomsCommon.swollenGlands ||
    symptomsCommon.jointPain ||
    symptomsCommon.musclePain ||
    symptomsCommon.rash ||
    symptomsCommon.scalingSpotsInPalmsOrSoles ||
    symptomsOral.wartsInThroat ||
    symptomsOral.groupOfPainfulBlistersInThroat ||
    symptomsOral.fungalInfection ||
    degreesFever > 37 ||
    symptomsFemale.leukorrhea ||
    symptomsFemale.dysuria ||
    symptomsFemale.urinaryFrequency ||
    symptomsFemale.urethralDischarge ||
    symptomsFemale.abnormalVaginalDischarge ||
    symptomsFemale.postCoitalBleeding ||
    symptomsFemale.wartsInLabia ||
    symptomsFemale.wartsInVagina ||
    symptomsFemale.wartsInAnus ||
    symptomsFemale.wartsInAnalCleft ||
    symptomsFemale.groupOfBlistersInLabia ||
    symptomsFemale.painlessPimple ||
    symptomsMale.dysuria ||
    symptomsMale.urinaryFrequency ||
    symptomsMale.urethralDischarge ||
    symptomsMale.testisPain ||
    symptomsMale.wartsInPenis ||
    symptomsMale.wartsInTestis ||
    symptomsMale.wartsInAnus ||
    symptomsMale.wartsInAnalCleft ||
    symptomsMale.groupOfBlistersInPenis ||
    symptomsMale.painlessPimple;

  var nonSelfTestableSymptoms =
    symptomsCommon.abdominalPain ||
    symptomsCommon.swollenGlands ||
    symptomsCommon.jointPain ||
    symptomsCommon.musclePain ||
    symptomsCommon.rash ||
    symptomsCommon.scalingSpotsInPalmsOrSoles ||
    symptomsOral.roundSoreInThroat ||
    symptomsOral.wartsInThroat ||
    symptomsOral.groupOfPainfulBlistersInThroat ||
    symptomsOral.fungalInfection ||
    degreesFever > 37 ||
    symptomsFemale.leukorrhea ||
    symptomsFemale.postCoitalBleeding ||
    symptomsFemale.wartsInLabia ||
    symptomsFemale.wartsInVagina ||
    symptomsFemale.wartsInAnus ||
    symptomsFemale.wartsInAnalCleft ||
    symptomsFemale.groupOfBlistersInLabia ||
    symptomsFemale.painlessPimple ||
    symptomsMale.testisPain ||
    symptomsMale.wartsInPenis ||
    symptomsMale.wartsInTestis ||
    symptomsMale.wartsInAnus ||
    symptomsMale.wartsInAnalCleft ||
    symptomsMale.groupOfBlistersInPenis ||
    symptomsMale.painlessPimple;

  var seriousAbdominalPain =
    symptomsCommon.abdominalPain &&
    (intensityVAS >= 6 ||
      lethargy.bedridden ||
      lethargy.onlyCompulsoryActivities ||
      degreesFever >= 38 ||
      symptomsMale.dysuria ||
      symptomsMale.urinaryFrequency ||
      symptomsMale.urethralDischarge ||
      symptomsMale.ulcerInPenis ||
      symptomsMale.ulcerInAnus ||
      symptomsFemale.leukorrhea ||
      symptomsFemale.dysuria ||
      symptomsFemale.urinaryFrequency ||
      symptomsFemale.urethralDischarge ||
      symptomsFemale.abnormalVaginalDischarge ||
      symptomsFemale.ulcerInLabia ||
      symptomsFemale.ulcerInAnus ||
      symptomsFemale.groupOfBlistersInLabia);

  var ivDrugUse = libQuestions.getAnswerValue(1815);
  var ivDrugExposure = typeOfSex.sexWithIvDrugUser || ivDrugUse;
  var isInPepWindow = libQuestions.hasAnswerId(5266, 7014);
  var aprTimeOfExposure = {
    underThreeDays: libQuestions.hasAnswerId(5266, 7014),
    threeToFiveDays: libQuestions.hasAnswerId(5266, 7015),
    fiveDaysThreeWeeks: libQuestions.hasAnswerId(5266, 7016),
    overThreeWeeks: libQuestions.hasAnswerId(5266, 8814),
  };

  // Contact variables
  var strDateOfExposure = libQuestions.getAnswerValue(216);
  var strDateOfLastTests = libQuestions.getAnswerValue(431);
  var hasDrugAllergy = libQuestions.getAnswerValue(26);
  var strAntibioticAllergy = libQuestions.getAnswerValue(27);

  var language = libUser.getLanguageCode();

  // Combination variables
  var someCommonSymptom =
    symptomsCommon.abdominalPain ||
    symptomsCommon.swollenGlands ||
    symptomsCommon.jointPain ||
    symptomsCommon.musclePain ||
    symptomsCommon.rash ||
    symptomsCommon.scalingSpotsInPalmsOrSoles;

  var selfTestableSymptoms =
    symptomsMale.dysuria ||
    symptomsMale.urinaryFrequency ||
    symptomsMale.urethralDischarge ||
    symptomsFemale.abnormalVaginalDischarge ||
    symptomsFemale.dysuria ||
    symptomsFemale.urinaryFrequency ||
    symptomsFemale.urethralDischarge;

  var selfTestableNonUTISymptoms =
    symptomsMale.urethralDischarge ||
    symptomsFemale.abnormalVaginalDischarge ||
    symptomsFemale.urethralDischarge;

  var nonSelfTestableSexTypes =
    typeOfSex.oralSex ||
    (typeOfSex.analSexMan && typeOfSex.sexBetweenMen) ||
    typeOfSex.analSexRecevingFemale ||
    typeOfSex.sexBetweenMen ||
    typeOfSex.paidSex ||
    typeOfSex.sexWithIvDrugUser ||
    typeOfSex.dontWantToAnswerRiskCategory;

  var noSymptomsOfAnyKind =
    !possibleSTDsymptoms ||
    (!hasFever &&
      symptomsFemale.noneOfTheAbove &&
      symptomsOral.noneOfTheAbove &&
      symptomsCommon.noneOfTheAbove) ||
    (symptomsMale.noneOfTheAbove &&
      symptomsOral.noneOfTheAbove &&
      symptomsCommon.noneOfTheAbove);

  var infectionFromContact = contactHasSTD.yes || contactHasSTD.possibly;

  // Declare functions
  // Function to generate phrases - Version 1.1
  function createPhraseAliases(symptomsList, lastSeparator, middleSeparator) {
    // List has to be a two dimensional array where first value is condition(s) and second a string. Separator has to be a string
    lastSeparator =
      lastSeparator === undefined || lastSeparator === null
        ? " ja "
        : lastSeparator;
    // Fill in "ja" if no seprator is given
    middleSeparator =
      middleSeparator === undefined || middleSeparator === null
        ? ", "
        : middleSeparator;
    // Fill in ", " if no seprator is given
    var arrPhraseAliases = [];
    for (var i = 0; i < symptomsList.length; i += 1) {
      if (symptomsList[i][0]) {
        arrPhraseAliases.push(symptomsList[i][1]);
      }
    }

    var resultString = "";
    if (arrPhraseAliases.length > 0 && arrPhraseAliases[0] !== undefined) {
      // Join all the strings in arrPhraseAliases using middleSeparator, except for the last one,
      resultString = arrPhraseAliases
        .slice(0, arrPhraseAliases.length - 1)
        .join(middleSeparator);
      if (arrPhraseAliases.length > 1) {
        // If arrPhraseAliases has more than one element, append lastSeparator to resultString.
        resultString += lastSeparator;
      }
      // Append the last string in arrPhraseAliases to resultString
      resultString += arrPhraseAliases[arrPhraseAliases.length - 1];
    }
    return resultString;
  }

  function checkAliasList(symptomsList) {
    for (var i = 0; i < symptomsList.length; i += 1) {
      if (symptomsList[i][0]) {
        return true;
      }
    }
    return false;
  }

  // Phrase alias lists
  var strPregnancyDurationText =
    libQuestions.getAnswerValue(1636) > 0
      ? " viikolla " + libQuestions.getAnswerValue(1636)
      : "";

  var arrListGeneralAttributes = [
    [unprotectedSex, "on ollut suojaamattomassa seksikontaktissa"],
    [
      unprotectedSex === false,
      "ei ole ollut suojaamattomassa seksikontaktissa",
    ],
    [pregnancy.yes, "on raskaana" + strPregnancyDurationText],
    [pregnancy.no, "ei ole raskaana"],
    [pregnancy.maybe, "raskaudesta ei ole varmuutta"],
    [testsAlreadyTaken, "potilaalta on aiemmin otettu sukupuolitautinäytteet"],
    [
      testsAlreadyTaken === false,
      "potilaalta ei ole aiemmin otettu sukupuolitautinäytteitä",
    ],
    [testsPositive, "näytteet ovat positiiviset"],
    [
      testsAlreadyTaken && testsPositive === false,
      "näytteet ovat negatiiviset",
    ],
    [ivDrugUse, "hän on käyttänyt suonensisäisiä huumeita"],
  ];

  var arrListSymptoms = [
    // Common
    [symptomsCommon.abdominalPain, "alavatsakipu"],
    [symptomsCommon.swollenGlands, "turvonneet imusolmukkeet"],
    [symptomsCommon.jointPain, "nivelsärky"],
    [symptomsCommon.musclePain, "lihassärky"],
    [symptomsCommon.rash, "ihottuma"],
    [
      symptomsCommon.scalingSpotsInPalmsOrSoles,
      "hilseileviä näppylöitä kämmenissä tai jalkapohjissa",
    ],

    // Oral
    [symptomsOral.roundSoreInThroat, "haavauma nielussa"],
    [symptomsOral.wartsInThroat, "syylä nielussa"],
    [symptomsOral.groupOfPainfulBlistersInThroat, "kipeitä rakkuloita suussa"],
    [
      symptomsOral.fungalInfection,
      "kipua tai vaaleita laikkuja suun limakalvolla",
    ],

    // Female
    [symptomsFemale.leukorrhea, "poikkeavaa valkovuotoa"],
    [symptomsFemale.abnormalVaginalDischarge, "verinen tihkuvuoto emättimestä"],
    [symptomsFemale.postCoitalBleeding, "yhdynnän jälkeistä veristä vuotoa"],
    [
      symptomsFemale.groupOfBlistersInLabia,
      "ryhmä kipeitä rakkuloita häpyhuulessa",
    ],
    [symptomsFemale.ulcerInLabia, "haavauma häpyhuulessa"],
    [symptomsFemale.wartsInLabia, "syylä häpyhuulessa"],
    [symptomsFemale.wartsInVagina, "syylä emättimessä"],

    // Male
    [symptomsMale.testisPain, "kipua kivesten alueella"],
    [
      symptomsMale.groupOfBlistersInPenis,
      "ryhmä kipeitä rakkuloita siittimessä",
    ],
    [symptomsMale.ulcerInPenis, "haavauma siittimessä"],
    [symptomsMale.wartsInPenis, "syylä siittimessä"],
    [symptomsMale.wartsInTestis, "syylä kivespussissa"],

    // Either gender
    [symptomsMale.dysuria || symptomsFemale.dysuria, "kirvelyä virtsatessa"],
    [
      symptomsMale.urinaryFrequency || symptomsFemale.urinaryFrequency,
      "tihentynyt virtsaamistarve",
    ],
    [
      symptomsMale.urethralDischarge || symptomsFemale.urethralDischarge,
      "vuoto virtsaputkesta",
    ],
    [
      symptomsMale.ulcerInAnus || symptomsFemale.ulcerInAnus,
      "haavauma peräaukossa",
    ],
    [
      symptomsMale.wartsInAnus || symptomsFemale.wartsInAnus,
      "syylä peräaukossa",
    ],
    [
      symptomsMale.wartsInAnalCleft || symptomsFemale.wartsInAnalCleft,
      "syylä pakaravaossa",
    ],
    [
      symptomsMale.painlessPimple || symptomsFemale.painlessPimple,
      "kivuton märkänäppy",
    ],

    [degreesFever > 37, "kuumetta " + degreesFever + " C"],
  ];

  //Not included in summary
  /*
var arrListSexTypes = [
    [typeOfSex.vaginalSex, "emätinseksiä"],
    [typeOfSex.oralSex, "suuseksiä"],
    [typeOfSex.analSexMan, "anaaliseksiä"],
    [typeOfSex.sexBetweenMen, "miesten välistä seksiä"],
    [typeOfSex.sexWithUnknownPartner, "seksiä tuntemattoman kumppanin kanssa"],
    [typeOfSex.sexWithIvDrugUser, "seksiä suonensisäisten huumeiden käyttäjän kanssa"],
    [typeOfSex.paidSex, "ostettua seksiä"]
];
*/

  var arrListRiskySexTypes = [
    [typeOfSex.sexBetweenMen, "miesten välistä seksiä"],
    [typeOfSex.sexWithUnknownPartner, "seksiä tuntemattoman kumppanin kanssa"],
    [
      typeOfSex.sexWithIvDrugUser,
      "seksiä suonensisäisten huumeiden käyttäjän kanssa",
    ],
    [typeOfSex.paidSex, "ostettua seksiä"],
  ];

  var strContactHasHIV = contactHasHIV ? " (HIV)" : "";

  var arrContactSTDType = [
    [contactSTDType.unknown, "ei tiedossa"],
    [contactSTDType.chlamydia, "klamydia"],
    [contactSTDType.gonnarrhea, "tippuri"],
    [contactSTDType.syphilis, "kuppa"],
    [contactSTDType.herpes, "herpes"],
    [contactSTDType.HIV, "HIV"],
    [contactSTDType.hepatitisB, "hepatiitti B"],
    [contactSTDType.hepatitisC, "hepatiitti C"],
    [contactSTDType.other, strContactSTDtypeOther],
  ];

  var strContactStdTypeList =
    " (" + createPhraseAliases(arrContactSTDType) + ")";

  var arrContactHasBeenMedicated = [
    [
      contactHasBeenMedicated.yes,
      " Partneri on saanut lääkityksen sukupuolitautiin.",
    ],
    [
      contactHasBeenMedicated.no,
      " Partneri EI ole saanut lääkitystä sukupuolitautiin.",
    ],
    [
      contactHasBeenMedicated.unknown,
      " Ei tiedossa, onko partneri saanut lääkityksen sukupuolitautiin.",
    ],
  ];

  var strContactHasBeenMedicated = createPhraseAliases(
    arrContactHasBeenMedicated,
  );

  var arrContactHasSTD = [
    [
      contactHasSTD.yes,
      " Partnerilla on todettu sukupuolitauti" +
        strContactStdTypeList +
        "." +
        strContactHasBeenMedicated,
    ],
    [
      contactHasSTD.possibly,
      " Epäilee, että partnerilla on todettu sukupuolitauti" +
        strContactStdTypeList +
        "." +
        strContactHasBeenMedicated,
    ],
    [
      contactHasSTD.no,
      " Partnerilla ei ole todettu sukupuolitautia." +
        strContactHasBeenMedicated,
    ],
    [
      contactHasSTD.notKnown,
      " Ei ole varma, onko partnerilla todettu sukupuolitauti." +
        strContactHasBeenMedicated,
    ],
  ];

  var strPhraseAliasGeneral =
    " Potilas " + createPhraseAliases(arrListGeneralAttributes) + ".";

  var strPhraseAliasRiskySexType = checkAliasList(arrListRiskySexTypes)
    ? " Seksityypin takia tavallista laajemmat näytteet ovat tarpeen."
    : "";
  var strPhraseAliasSymptoms = checkAliasList(arrListSymptoms)
    ? " Oireina potilaalla on " + createPhraseAliases(arrListSymptoms) + "."
    : " Potilas ei ole valinnut mitään oireita.";
  var strPhraseAliasContactSTD = checkAliasList(arrContactHasSTD)
    ? createPhraseAliases(arrContactHasSTD, "")
    : "";
  var strPhraseAliasDuration =
    symptomsDuration > 0
      ? " Oireet ovat kestäneet " + symptomsDuration + " päivää."
      : "";

  // Drug allergy
  var strDrugAllergy =
    hasDrugAllergy === true && strAntibioticAllergy !== null
      ? " Potilas on ilmoittanut lääkeallergian: " + strAntibioticAllergy + "."
      : "";
  var strUnspecifiedDrugAllergy =
    hasDrugAllergy === true && strAntibioticAllergy === null
      ? " Potilas on ilmoittanut lääkeallergian, mutta lääkeaineen nimi ei ole tiedossa."
      : "";
  var strNoDrugAllergy =
    hasDrugAllergy === false
      ? " Ei potilaan ilmoittamia lääkeallergioita."
      : "";

  var phraseAprTimeOfExposure = aprTimeOfExposure.underThreeDays
    ? " Mahdollinen tartunta on tapahtunut korkeintaan 3 vuorokautta sitten."
    : aprTimeOfExposure.threeToFiveDays
      ? " Mahdollisesta tartunnasta on yli 3, mutta alle 5 vuorokautta."
      : aprTimeOfExposure.fiveDaysThreeWeeks
        ? " Mahdollisesta tartunnasta on yli 5 vuorokautta, mutta alle 3 viikkoa."
        : aprTimeOfExposure.overThreeWeeks
          ? " Mahdollisesta tartunnasta on 3 viikkoa tai enemmän."
          : "";

  var phraseDateOfExposureText =
    strDateOfExposure != null
      ? " Mahdollisen tartunnan tarkempi ajankohta: " + strDateOfExposure + "."
      : "";

  var phraseDateOfLastTests =
    strDateOfLastTests != null
      ? " Edelliset näytteet on otettu: " + strDateOfLastTests + "."
      : "";

  var strTwinrixRecommendedShort =
    typeOfSex.sexBetweenMen || typeOfSex.sexWithIvDrugUser || ivDrugUse
      ? " Suositellaan Twinrix-rokotteen ottamista."
      : "";
  var strSyphilisTestRecommendedShort = typeOfSex.paidSex
    ? " Kuppakoe kannattaa ottaa 3-4 viikon kuluttua mahdollisesta tartunnasta."
    : "";

  // Phrases for reminders
  var phrasePreventiveHIVMedication = "";
  if (
    unprotectedSex &&
    ((typeOfSex.analSexMan && typeOfSex.sexBetweenMen) ||
      typeOfSex.paidSex ||
      typeOfSex.sexWithIvDrugUser ||
      contactHasHIV)
  ) {
    phrasePreventiveHIVMedication =
      language === "sv"
        ? " Om vårdpersonal rekommenderar medicinering (PEP) för att förebygga HIV infektion, skulle medicinen tas inom 72 timmar från samlaget."
        : language === "en"
          ? " If a health care professional recommends medication for preventing HIV infection (PEP), it should be started within 72 hours from the intercourse."
          : " Jos terveydenhuollon ammattilainen suosittelee mahdollisen HIV-tartunnan takia ennalta ehkäisevää lääkitystä (PEP), se tulisi aloittaa 72 tunnin kuluessa yhdynnästä.";
  }

  // Create Date Object
  var d = new Date();
  var dayMonthYear = d
    .toLocaleString("en-US", {
      hour12: false,
      timeZone: "Europe/Helsinki",
    })
    .replace(/\//g, ".")
    .replace(",", " klo")
    .split(".");
  var dayToSwap = dayMonthYear[1];
  dayMonthYear[1] = dayMonthYear[0];
  dayMonthYear[0] = dayToSwap;
  var strDate = " (" + dayMonthYear.join(".") + ")";

  // **** Create final phrase aliases ****

  var strFinalPhraseAlias =
    strDate +
    ":" +
    strPhraseAliasGeneral +
    strPhraseAliasSymptoms +
    strPhraseAliasDuration +
    strPhraseAliasContactSTD +
    phraseAprTimeOfExposure +
    phraseDateOfExposureText +
    phraseDateOfLastTests +
    strPhraseAliasRiskySexType +
    strTwinrixRecommendedShort +
    strSyphilisTestRecommendedShort +
    strDrugAllergy +
    strUnspecifiedDrugAllergy +
    strNoDrugAllergy;

  // **** Start of inference logic ****

  // 1. If preventive HIV medication might be necessary and time from exposure is 72 hours or less, immediate consultation.
  if (
    isInPepWindow &&
    unprotectedSex &&
    ((typeOfSex.analSexMan && typeOfSex.sexBetweenMen) ||
      typeOfSex.paidSex ||
      typeOfSex.sexWithIvDrugUser ||
      contactHasHIV)
  ) {
    strFinalPhraseAlias += " Suositellaan arvioimaan PEP-lääkityksen tarve.";
    libEBMEDS.createScriptRecommendation("scr01762", 16, 2);
    // Contains suggestedAction code: "ADA001-P1"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 2. Immediate consultation needed
  else if (
    seriousAbdominalPain ||
    lethargy.bedridden ||
    intensityVAS >= 9 || // Intense pain
    symptomsMale.testisPain ||
    (symptomsFemale.groupOfBlistersInLabia &&
      (pregnancy.yes || pregnancy.maybe)) // Female specific symptoms
  ) {
    libEBMEDS.createScriptRecommendation("scr01762", 18, 2);
    // Contains suggestedAction code: "ADA001-P1"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 2. Rapid consultation needed
  else if (
    degreesFever >= 38 || // Generic symptomsn
    (symptomsMale.groupOfBlistersInPenis && intensityVAS >= 7) || // Male specific symptoms
    (symptomsFemale.groupOfBlistersInLabia && intensityVAS >= 7) // Female specific symptoms
  ) {
    libEBMEDS.createScriptRecommendation("scr01762", 1, 2);
    // Contains suggestedAction code: "ADA001-P2"
    // Contains suggestedAction code: "4594-P2"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 3. Rapid consultation (P3) needed.
  // Note: This section duplicates the reminder found in "6. Tests recommended, other than low risk symptoms".
  // This duplication is necessary because the Self-testing section complicates the priority logic.
  // Keeping general P3 criteria before the self-testing section simplifies the current implementation.
  // Future improvement: Completely refactoring the logic to follow descending priority in every step would eliminate this duplication.
  else if (
    symptomsCommon.abdominalPain ||
    symptomsMale.groupOfBlistersInPenis || // Male specific symptoms
    symptomsFemale.groupOfBlistersInLabia // Female specific symptoms
  ) {
    // Includes all symptoms not listed above
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      3,
      1,
      phrasePreventiveHIVMedication,
    );
    // Contains suggestedAction code: "EDA-P3"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 4. Syphilis sore? Consultation needed on weekday
  else if (syphilisSore) {
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      11,
      1,
      phrasePreventiveHIVMedication,
    );
    // Contains suggestedAction code: "ADA001-P4"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 5. Self-testing suggested
  else if (
    ((possibleSTDsymptoms === false && unprotectedSex) || // No symptoms, but unprotected sex OR
      (possibleSTDsymptoms === true &&
        selfTestableNonUTISymptoms &&
        !nonSelfTestableSymptoms && // Only low risk symptoms
        symptomsCommon.noneOfTheAbove && // No common or oral symptoms
        symptomsOral.noneOfTheAbove)) &&
    // Exclusion criteria:
    !ivDrugExposure &&
    hasFever !== true &&
    !nonSelfTestableSexTypes &&
    !infectionFromContact
  ) {
    libEBMEDS.createScriptRecommendation("scr01762", 4, 0);
    // Contains suggestedAction code: "EDA-P4"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 6. Tests recommended, other than low risk symptoms
  else if (
    infectionFromContact ||
    (possibleSTDsymptoms &&
      // Negation of reminder 7
      !(
        (hasFever || someCommonSymptom) &&
        ((symptomsFemale.noneOfTheAbove && symptomsOral.noneOfTheAbove) ||
          (symptomsMale.noneOfTheAbove && symptomsOral.noneOfTheAbove))
      ))
  ) {
    // Includes all symptoms not listed above
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      3,
      1,
      phrasePreventiveHIVMedication,
    );
    // Contains suggestedAction code: "EDA-P3"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 7. Tests recommended, unprotected sex or risk contacts
  else if (unprotectedSex || ivDrugExposure) {
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      15,
      1,
      phrasePreventiveHIVMedication,
    );
    // Contains suggestedAction code: "EDA-P4"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 8. Mild (under 38) fever or general symptoms as the only symptom
  else if (
    (hasFever || someCommonSymptom) && // Excluding fever over 38 C or abdominal pain
    // No specific symptoms
    ((symptomsFemale.noneOfTheAbove && symptomsOral.noneOfTheAbove) ||
      (symptomsMale.noneOfTheAbove && symptomsOral.noneOfTheAbove))
  ) {
    libEBMEDS.createScriptRecommendation("scr01762", 5, 1);
    // Contains suggestedAction code: "BAB-L2"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 9. Only previously positive tests, but no symptoms or other reason for testing
  else if (testsAlreadyTaken && testsPositive) {
    libEBMEDS.createScriptRecommendation("scr01762", 17, 1);
    // Contains suggestedAction code: "BAB-L2"
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 10. No consultation needed
  else if (
    unprotectedSex === false &&
    // No symptoms
    noSymptomsOfAnyKind &&
    // No positive tests
    !testsPositive &&
    // No risk contacts
    !infectionFromContact &&
    !ivDrugExposure
  ) {
    libEBMEDS.createScriptRecommendation("scr01762", 2, 0);
    libEBMEDS.createScriptRecommendation(
      "scr01762",
      13,
      0,
      strFinalPhraseAlias,
    ); // Create summary text for professional
    return;
  }

  // 11. Failsafe
  libEBMEDS.createScriptRecommendation("scr01762", 12, 1);
  // Contains suggestedAction code: "BAB-P4"
  libEBMEDS.createScriptRecommendation("scr01762", 13, 0, strFinalPhraseAlias); // Create summary text for professional
  return;

  // **** End of inference logic ****
}
