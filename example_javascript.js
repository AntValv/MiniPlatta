// Questionnaire: Student Health Questionnaire – for Minors (form 	2272)
// AVal

/*jslint browser:true, for:true, white: true, long: true */
/*global libEBMEDS, libDiagnoses, libMeasurements, libMedication, libVaccinations, libProcedures, libPatient, libUser, libRisks, libCommon, libSharedFunctions, libQuestions, reminder, ebdeb*/

function scr05133() {
  if (!libEBMEDS.initScript("scr05133", "nafi", "fm2272")) {
    return;
  }

  var language = libUser.getLanguageCode();

  // === OPISKELU / STUDY ===

  // 2) Asuminen [7648]
  const livingNow = {
    withParents: libQuestions.hasAnswerId(7648, 9938),
    withPartnerOrFriend: libQuestions.hasAnswerId(7648, 9939),
    alone: libQuestions.hasAnswerId(7648, 9940),
    other: libQuestions.hasAnswerId(7648, 9941),
  };

  // 3) Lähiomaisen tai yhteyshenkilön nimi ja puhelinnumero [7989]
  const relativeContactInfo = libQuestions.getAnswerValue(7989);

  // 4) Henkilö on [7990]
  const relativeRelation = {
    closeRelative: libQuestions.hasAnswerId(7990, 10553),
    otherContact: libQuestions.hasAnswerId(7990, 10554),
  };

  // 5) Mikä on henkilön suhde vastaajaan? [8010]
  const relationToRespondent = libQuestions.getAnswerValue(8010);

  // 3) Opiskeluun vaikuttavat [7649]
  const studyImpacts = {
    learningDifficulty: libQuestions.hasAnswerId(7649, 9943),
    concentrationDifficulty: libQuestions.hasAnswerId(7649, 9944),
    noneOfAbove: libQuestions.hasAnswerId(7649, -1),
  };

  // 4) Vaikeuksien kuvaus (vapaateksti) [7650]
  const studyDifficultyText = libQuestions.getAnswerValue(7650);

  // 6) Riittävästi apua oppimisvaikeuteen
  const supportStudyDifficulty = {
    no: libQuestions.hasAnswerId(7992, 10506),
    yes: libQuestions.hasAnswerId(7992, 10505),
  };

  // 5) Opiskelujen aloitus [7651]
  const studyStart = {
    good: libQuestions.hasAnswerId(7651, 9946),
    moderate: libQuestions.hasAnswerId(7651, 9947),
    poor: libQuestions.hasAnswerId(7651, 9948),
  };

  // 6) Aiemmat opinnot [7652]
  const priorStudies = {
    no: libQuestions.hasAnswerId(7652, 9949),
    yes: libQuestions.hasAnswerId(7652, 9950),
  };

  // 7) Aiemmat opinnot – mitä (vapaateksti) [7653]
  const priorStudiesText = libQuestions.getAnswerValue(7653);

  // 8) Töissäkäynti [7654]
  const worksAlongStudy = {
    no: libQuestions.hasAnswerId(7654, 10336),
    yes: libQuestions.hasAnswerId(7654, 10337),
  };
  // === TERVEYS ===

  // 10) Terveydentila [7657]
  const healthStatus = {
    good: libQuestions.hasAnswerId(7657, 9951),
    fair: libQuestions.hasAnswerId(7657, 9952),
    poor: libQuestions.hasAnswerId(7657, 9953),
  };

  // 13) Pitkäaikaissairaus – muu (vapaateksti) [7660] --- POISTA
  const chronicOtherText = libQuestions.getAnswerValue(7660);

  // 11) Pitkäaikaissairaus? [7658]
  const hasChronicCondition = {
    no: libQuestions.hasAnswerId(7658, 9954),
    yes: libQuestions.hasAnswerId(7658, 9955),
  };

  // 12) Pitkäaikaissairauden tyyppi (monivalinta) [7659]
  const chronicTypes = {
    adhdAdd: libQuestions.hasAnswerId(7659, 9956),
    autismSpectrum: libQuestions.hasAnswerId(7659, 9957),
    asthmaOrRespiratory: libQuestions.hasAnswerId(7659, 9958),
    diabetes: libQuestions.hasAnswerId(7659, 9959),
    epilepsyOrNeuro: libQuestions.hasAnswerId(7659, 9960),
    skinDisease: libQuestions.hasAnswerId(7659, 9961),
    thyroid: libQuestions.hasAnswerId(7659, 9962),
    earOrHearingLoss: libQuestions.hasAnswerId(7659, 9963),
    depressionAnxietyPsych: libQuestions.hasAnswerId(7659, 9964),
    migraine: libQuestions.hasAnswerId(7659, 9965),
    giOrDigestive: libQuestions.hasAnswerId(7659, 9966),
    cardioVascular: libQuestions.hasAnswerId(7659, 9967),
    visionRefractionOrEye: libQuestions.hasAnswerId(7659, 9968),
    musculoskeletal: libQuestions.hasAnswerId(7659, 9969),
    hypertension: libQuestions.hasAnswerId(7659, 9970),
    other: libQuestions.hasAnswerId(7659, 9971),
  };

  // 14) Hoitopaikka / missä todettu (vapaateksti) [7661]

  const chronicCareSiteByDisease = {
    adhdAdd: libQuestions.getAnswerValue(7853), // ADHD
    autismSpectrum: libQuestions.getAnswerValue(7859), // Asperger / autismikirjo
    asthmaOrRespiratory: libQuestions.getAnswerValue(7861), // Astma / hengitystiet
    diabetes: libQuestions.getAnswerValue(7862),
    epilepsyOrNeuro: libQuestions.getAnswerValue(7863), // Epilepsia / neuro
    skinDisease: libQuestions.getAnswerValue(7864),
    thyroid: libQuestions.getAnswerValue(7865),
    earOrHearingLoss: libQuestions.getAnswerValue(7866),
    depressionAnxietyPsych: libQuestions.getAnswerValue(7867), // Mielenterveys
    migraine: libQuestions.getAnswerValue(7868),
    giOrDigestive: libQuestions.getAnswerValue(7869), // Ruoansulatus
    cardioVascular: libQuestions.getAnswerValue(7870), // Sydän
    visionRefractionOrEye: libQuestions.getAnswerValue(7871), // Taittovika / silmät
    musculoskeletal: libQuestions.getAnswerValue(7872), // TULES
    hypertension: libQuestions.getAnswerValue(7873), // Verenpainetauti
    other: libQuestions.getAnswerValue(7874), // Muu, mikä?
  };

  // Sairaalahoitoa (kyllä/ei)
  const surgeriesOrHospital = {
    no: libQuestions.hasAnswerId(8288, 11016),
    yes: libQuestions.hasAnswerId(8288, 11017),
  };
  // Toimenpiteiden tarkenteet (vapaatekstit) [7663–7665]
  const surgeriesOrHospitalText = libQuestions.getAnswerValue(8000);

  // 20) Oireiden kysymykset

  const symptomTypes = {
    dyspneaWhenExercising: {
      yes: libQuestions.hasAnswerId(7846, 10270),
      no: libQuestions.hasAnswerId(7846, 10269),
    }, // Hengenahdistusta rasituksessa

    dizziness: {
      yes: libQuestions.hasAnswerId(7847, 10272),
      no: libQuestions.hasAnswerId(7847, 10271),
    }, // Huimaus

    skinRashIssues: {
      yes: libQuestions.hasAnswerId(7848, 10274),
      no: libQuestions.hasAnswerId(7848, 10273),
    }, // Ihottuma- tai muut iho-oireet

    jointPain: {
      yes: libQuestions.hasAnswerId(7849, 10276),
      no: libQuestions.hasAnswerId(7849, 10275),
    }, // Nivelkipua

    neckShoulderPain: {
      yes: libQuestions.hasAnswerId(7850, 10278),
      no: libQuestions.hasAnswerId(7850, 10277),
    }, // Niska- tai hartiaseudun kipua

    headache: {
      yes: libQuestions.hasAnswerId(7851, 10280),
      no: libQuestions.hasAnswerId(7851, 10279),
    }, // Päänsärky

    prolongedRhinitisOrCough: {
      yes: libQuestions.hasAnswerId(7852, 10282),
      no: libQuestions.hasAnswerId(7852, 10281),
    }, // Pitkittynyt nuha tai yskä

    backPain: {
      yes: libQuestions.hasAnswerId(7854, 10284),
      no: libQuestions.hasAnswerId(7854, 10283),
    }, // Selkäkipua

    palpitationsArrhythmia: {
      yes: libQuestions.hasAnswerId(7855, 10286),
      no: libQuestions.hasAnswerId(7855, 10285),
    }, // Sydämen tykytys tai rytmihäiriöt

    hearingDifficulty: {
      yes: libQuestions.hasAnswerId(7856, 10288),
      no: libQuestions.hasAnswerId(7856, 10287),
    }, // Vaikeuksia kuulla

    visionDifficulty: {
      yes: libQuestions.hasAnswerId(7857, 10290),
      no: libQuestions.hasAnswerId(7857, 10289),
    }, // Vaikeuksia nähdä

    abdominalPain: {
      yes: libQuestions.hasAnswerId(7858, 10292),
      no: libQuestions.hasAnswerId(7858, 10291),
    }, // Vatsakipua tai vatsan toiminnan häiriö

    otherChronicSymptom: {
      yes: libQuestions.hasAnswerId(7860, 10294),
      no: libQuestions.hasAnswerId(7860, 10293),
    }, // Muita minulla olevan pitkäaikaissairauden oireita
  };

  // 21–33) Oireiden jatkokysymykset: "Onko jo tutkittu?" (binääriset)
  const symptomFollowups = {
    dyspneaWhenExercising: {
      no: libQuestions.hasAnswerId(7875, 10510),
      yes: libQuestions.hasAnswerId(7875, 10509),
    },
    dizziness: {
      no: libQuestions.hasAnswerId(7673, 10512),
      yes: libQuestions.hasAnswerId(7673, 10511),
    }, // huimaus
    skinRashIssues: {
      no: libQuestions.hasAnswerId(7675, 10514),
      yes: libQuestions.hasAnswerId(7675, 10513),
    }, // iho
    neckShoulderPain: {
      no: libQuestions.hasAnswerId(7677, 10518),
      yes: libQuestions.hasAnswerId(7677, 10517),
    }, // niska/hartiat
    jointPain: {
      no: libQuestions.hasAnswerId(7679, 10516),
      yes: libQuestions.hasAnswerId(7679, 10515),
    }, // nivelkipu
    headache: {
      no: libQuestions.hasAnswerId(7671, 10520),
      yes: libQuestions.hasAnswerId(7671, 10519),
    }, // päänsärky (HUOM: poikkeava ID)
    prolongedRhinitisOrCough: {
      no: libQuestions.hasAnswerId(7681, 10522),
      yes: libQuestions.hasAnswerId(7681, 10521),
    }, // nuha/yskä
    backPain: {
      no: libQuestions.hasAnswerId(7683, 10524),
      yes: libQuestions.hasAnswerId(7683, 10523),
    }, // selkäkipu
    palpitationsArrhythmia: {
      no: libQuestions.hasAnswerId(7685, 10528),
      yes: libQuestions.hasAnswerId(7685, 10527),
    }, // sydän
    hearingDifficulty: {
      no: libQuestions.hasAnswerId(7687, 10526),
      yes: libQuestions.hasAnswerId(7687, 10525),
    }, // kuulo
    visionDifficulty: {
      no: libQuestions.hasAnswerId(7689, 10530),
      yes: libQuestions.hasAnswerId(7689, 10529),
    }, // näkö
    abdominalPain: {
      no: libQuestions.hasAnswerId(7691, 10532),
      yes: libQuestions.hasAnswerId(7691, 10531),
    }, // vatsa
    otherChronicSymptom: {
      no: libQuestions.hasAnswerId(7694, 10534),
      yes: libQuestions.hasAnswerId(7694, 10533),
    }, // muu HOITO (binääri)
  };

  // unresolvedSymptoms - Lasketaan kuinka monta oiretta käyttäjä on valinnut,
  // mutta joita ei ole vielä hoidettu tai tutkittu (jatkokysymyksen vastaus = "ei").
  const unresolvedSymptoms = Object.keys(symptomTypes).filter((key) => {
    // Tarkistetaan että oire on valittu (yes = true)
    const symptomSelected = symptomTypes[key] && symptomTypes[key].yes === true;

    // Tarkistetaan että jatkokysymyksen vastaus on "ei"
    const notTreatedOrInvestigated =
      symptomFollowups[key] && symptomFollowups[key].no === true;

    return symptomSelected && notTreatedOrInvestigated;
  }).length;

  // Muu oire - vapaateksti
  const otherChronicSymptomText = libQuestions.getAnswerValue(7693);

  // 35) Ahdistuneisuus? [7696]
  const hasAnxiety = {
    no: libQuestions.hasAnswerId(7696, 10338),
    yes: libQuestions.hasAnswerId(7696, 10339),
  };

  // 36) 7697 on asteikko-otsikko -> ei vastausvaihtoehtoja: ei sidontaa

  // 37–38) AHDISTUNEISUUS – asteikkoväittämät
  const anxietyNervousTense = {
    none: libQuestions.hasAnswerId(7698, 9989),
    severalDays: libQuestions.hasAnswerId(7698, 9990),
    mostDays: libQuestions.hasAnswerId(7698, 9991),
    nearlyEveryDay: libQuestions.hasAnswerId(7698, 9992),
  };
  const anxietyUncontrollableWorry = {
    none: libQuestions.hasAnswerId(7699, 9993),
    severalDays: libQuestions.hasAnswerId(7699, 9994),
    mostDays: libQuestions.hasAnswerId(7699, 9995),
    nearlyEveryDay: libQuestions.hasAnswerId(7699, 9996),
  };

  // 39) Ahdistusoireet hoidossa? [7700]
  const anxietyInTreatment = {
    no: libQuestions.hasAnswerId(7700, 10536),
    yes: libQuestions.hasAnswerId(7700, 10535),
  };

  // 40–44) Masentuneisuus ja hoito  [7701–7703, 7747–7748]
  const hasDepression = {
    no: libQuestions.hasAnswerId(7701, 10340),
    yes: libQuestions.hasAnswerId(7701, 10341),
  };
  const lowMoodOften = {
    no: libQuestions.hasAnswerId(7702, 10360),
    yes: libQuestions.hasAnswerId(7702, 10361),
  };
  const depressionInTreatment = {
    no: libQuestions.hasAnswerId(7703, 10538),
    yes: libQuestions.hasAnswerId(7703, 10537),
  };
  const lowInterestOften = {
    no: libQuestions.hasAnswerId(7747, 10358),
    yes: libQuestions.hasAnswerId(7747, 10359),
  };
  const lowInterestInTreatment = {
    no: libQuestions.hasAnswerId(7748, 10540),
    yes: libQuestions.hasAnswerId(7748, 10539),
  };

  // 45–51) Syöminen ja muu psyykkinen (binääriset + vapaateksti)
  const eatingIssue = {
    no: libQuestions.hasAnswerId(7704, 10344),
    yes: libQuestions.hasAnswerId(7704, 10345),
  };
  const concernEatingWeight = {
    no: libQuestions.hasAnswerId(7705, 10362),
    yes: libQuestions.hasAnswerId(7705, 10363),
  };

  const suspectedEatingDisorder = {
    no: libQuestions.hasAnswerId(7706, 10364),
    yes: libQuestions.hasAnswerId(7706, 10365),
  };

  const eatingIssueInTreatment = {
    no: libQuestions.hasAnswerId(7707, 10542),
    yes: libQuestions.hasAnswerId(7707, 10541),
  };
  const otherPsychIssue = {
    no: libQuestions.hasAnswerId(7708, 10346),
    yes: libQuestions.hasAnswerId(7708, 10347),
  };
  const otherPsychIssueText = libQuestions.getAnswerValue(7709);
  const otherPsychIssueInTreatment = {
    no: libQuestions.hasAnswerId(7710, 10544),
    yes: libQuestions.hasAnswerId(7710, 10543),
  };

  // 52) Lääkitys [7711]
  const medsUse = {
    prescription: libQuestions.hasAnswerId(7711, 10118),
    otc: libQuestions.hasAnswerId(7711, 10117),
    none: libQuestions.hasAnswerId(7711, -1),
  };
  // 53–54) Lääkkeiden nimet (vapaatekstit)
  const medsPrescriptionText = libQuestions.getAnswerValue(7712);
  const medsOtcText = libQuestions.getAnswerValue(7713);

  // 55–61) Allergiat ja tarkenteet

  const foodAllergy = libQuestions.hasAnswerId(7714, 10136);
  const foodAllergyText = libQuestions.getAnswerValue(7716);
  const drugAllergy = libQuestions.hasAnswerId(7714, 10137);
  const drugAllergyText = libQuestions.getAnswerValue(7718);
  const otherAllergy = libQuestions.hasAnswerId(7714, 10138);
  const otherAllergyText = libQuestions.getAnswerValue(7720);
  let hasAllergy = undefined;
  if (foodAllergy || drugAllergy || otherAllergy) hasAllergy = true;
  else if (libQuestions.hasAnswerId(7714, -1)) hasAllergy = false;

  // 62–63) Erityisruokavalio [7721–7722]
  const hasSpecialDiet = {
    no: libQuestions.hasAnswerId(7721, 10350),
    yes: libQuestions.hasAnswerId(7721, 10351),
  };
  const specialDietText = libQuestions.getAnswerValue(7722);

  // === TERVEYSTOTTUMUKSET ===

  // 66) Heräämisaika arkipäivinä [7725]
  const wakeTimeWeekdays = {
    before0500: libQuestions.hasAnswerId(7725, 10199), // noin klo 05 tai aikaisemmin
    at0600: libQuestions.hasAnswerId(7725, 10201), // noin klo 06
    at0700: libQuestions.hasAnswerId(7725, 10203), // noin klo 07
    at0800: libQuestions.hasAnswerId(7725, 10205), // noin klo 08
    at0900: libQuestions.hasAnswerId(7725, 10207), // noin klo 09
    after1000: libQuestions.hasAnswerId(7725, 10209), // noin klo 10 tai myöhemmin
  };

  // 65) Nukkumaanmenoaika arkipäivinä [7724]
  const bedTimeWeekdays = {
    before20: libQuestions.hasAnswerId(7724, 10187), // noin klo 20 tai aikaisemmin
    at2100: libQuestions.hasAnswerId(7724, 10189), // noin klo 21
    at2200: libQuestions.hasAnswerId(7724, 10191), // noin klo 22
    at2300: libQuestions.hasAnswerId(7724, 10193), // noin klo 23
    at2400: libQuestions.hasAnswerId(7724, 10195), // noin klo 24
    at0100: libQuestions.hasAnswerId(7724, 10197), // noin klo 01
    after0200: libQuestions.hasAnswerId(7724, 10198), // noin klo 02 tai myöhemmin
  };

  // 69) Univaikeudet [7726]
  const hasSleepProblems = {
    no: libQuestions.hasAnswerId(7726, 10185),
    yes: libQuestions.hasAnswerId(7726, 10186),
  };

  // 70) Paino – mielipide [7727]
  const weightOpinion = {
    tooThin: libQuestions.hasAnswerId(7727, 10008),
    slightlyThin: libQuestions.hasAnswerId(7727, 10009),
    normal: libQuestions.hasAnswerId(7727, 10010),
    slightlyOverweight: libQuestions.hasAnswerId(7727, 10297),
    tooFat: libQuestions.hasAnswerId(7727, 10298),
  };

  // 71–73) Paino/pituus/liikunta
  const weightKg = libQuestions.getAnswerValue(7728);
  const height = libQuestions.getAnswerValue(7729);
  const exerciseHoursPerWeek = libQuestions.getAnswerValue(7730);

  // 74) Ruokavalion terveellisyys [7731]
  const dietHealthiness = {
    unhealthy: libQuestions.hasAnswerId(7731, 10011),
    somewhatUnhealthy: libQuestions.hasAnswerId(7731, 10012),
    mostlyHealthy: libQuestions.hasAnswerId(7731, 10013),
  };

  // 75) Suun terveys – ongelmat? (binäärinen) [7732]
  const hasDentalIssues = {
    no: libQuestions.hasAnswerId(7732, 10348),
    yes: libQuestions.hasAnswerId(7732, 10349),
  };

  // 77) Viime hammastarkastus [7734]
  const lastDentalCheck = {
    under2y: libQuestions.hasAnswerId(7734, 10014),
    y2to4: libQuestions.hasAnswerId(7734, 10015),
    over4y: libQuestions.hasAnswerId(7734, 10016),
  };

  // 79) Hampaiden pesu [7736]
  const toothBrushing = {
    twiceDaily: libQuestions.hasAnswerId(7736, 10017),
    onceDaily: libQuestions.hasAnswerId(7736, 10018),
    lessOften: libQuestions.hasAnswerId(7736, 10019),
  };

  const screenTimeHoursPerDay = libQuestions.getAnswerValue(7877);

  // 80) Netti/some/pelaaminen haittaa [7737]
  const screenTimeHarm = {
    no: libQuestions.hasAnswerId(7737, 10020),
    sometimes: libQuestions.hasAnswerId(7737, 10021),
    often: libQuestions.hasAnswerId(7737, 10022),
  };

  // 81) Nikotiinikysymys (binäärinen) [7738]
  const usesAnyNicotine = {
    no: libQuestions.hasAnswerId(7738, 10354),
    yes: libQuestions.hasAnswerId(7738, 10355),
  };

  // 82–85) Nikotiinituotteet (tilanne) [7739–7742]
  const tobaccoUse = {
    none: libQuestions.hasAnswerId(7739, 10023),
    tried: libQuestions.hasAnswerId(7739, 10024),
    occasional: libQuestions.hasAnswerId(7739, 10025),
    daily: libQuestions.hasAnswerId(7739, 10026),
    quit: libQuestions.hasAnswerId(7739, 10027),
  };
  const snusUse = {
    none: libQuestions.hasAnswerId(7740, 10028),
    tried: libQuestions.hasAnswerId(7740, 10029),
    occasional: libQuestions.hasAnswerId(7740, 10030),
    daily: libQuestions.hasAnswerId(7740, 10031),
    quit: libQuestions.hasAnswerId(7740, 10032),
  };
  const nicotinePouchUse = {
    none: libQuestions.hasAnswerId(7741, 10033),
    tried: libQuestions.hasAnswerId(7741, 10034),
    occasional: libQuestions.hasAnswerId(7741, 10035),
    daily: libQuestions.hasAnswerId(7741, 10036),
    quit: libQuestions.hasAnswerId(7741, 10037),
  };
  const vapeUse = {
    none: libQuestions.hasAnswerId(7742, 10038),
    tried: libQuestions.hasAnswerId(7742, 10369),
    occasional: libQuestions.hasAnswerId(7742, 10039),
    daily: libQuestions.hasAnswerId(7742, 10040),
    quit: libQuestions.hasAnswerId(7742, 10041),
  };

  // 86–87) Muu nikotiinituote
  const otherUse = {
    none: libQuestions.hasAnswerId(7743, 10356),
    tried: libQuestions.hasAnswerId(7743, 10357),
    occasional: libQuestions.hasAnswerId(7743, 10366),
    daily: libQuestions.hasAnswerId(7743, 10367),
    quit: libQuestions.hasAnswerId(7743, 10368),
  };

  const otherNicotineProductText = libQuestions.getAnswerValue(7744);

  // 88) Alkoholi (binäärinen) [7751]
  const usesAlcohol = {
    no: libQuestions.hasAnswerId(7751, 10181),
    yes: libQuestions.hasAnswerId(7751, 10182),
  };

  // 89) AUDIT 1 [7752]
  const auditQ1 = {
    never: libQuestions.hasAnswerId(7752, 10058),
    monthlyOrLess: libQuestions.hasAnswerId(7752, 10059),
    twoToFourPerMonth: libQuestions.hasAnswerId(7752, 10060),
    twoToThreePerWeek: libQuestions.hasAnswerId(7752, 10061),
    fourOrMorePerWeek: libQuestions.hasAnswerId(7752, 10062),
  };

  // 90) AUDIT 2 [7753]
  const auditQ2 = {
    oneToTwo: libQuestions.hasAnswerId(7753, 10063),
    threeToFour: libQuestions.hasAnswerId(7753, 10064),
    fiveToSix: libQuestions.hasAnswerId(7753, 10065),
    sevenToNine: libQuestions.hasAnswerId(7753, 10066),
    tenOrMore: libQuestions.hasAnswerId(7753, 10067),
  };

  // 91) AUDIT 3 [7754]
  const auditQ3 = {
    never: libQuestions.hasAnswerId(7754, 10068),
    lessThanMonthly: libQuestions.hasAnswerId(7754, 10069),
    monthly: libQuestions.hasAnswerId(7754, 10070),
    weekly: libQuestions.hasAnswerId(7754, 10071),
    dailyOrAlmost: libQuestions.hasAnswerId(7754, 10072),
  };

  // 92–93) Huumausaineet [7755–7756]
  const usesDrugs = {
    no: libQuestions.hasAnswerId(7755, 10179),
    yes: libQuestions.hasAnswerId(7755, 10180),
  };
  const drugsFrequency = {
    tried: libQuestions.hasAnswerId(7756, 10073),
    occasionally: libQuestions.hasAnswerId(7756, 10074),
    regularly: libQuestions.hasAnswerId(7756, 10075),
  };

  // 94–95) Keskustelutarve (sukupuoli-id / ehkäisy) [7757–7758]
  const wantsTalkGenderIdentity = {
    no: libQuestions.hasAnswerId(7757, 10178),
    yes: libQuestions.hasAnswerId(7757, 10177),
  };

  const wantsTalkContraceptionSti = {
    no: libQuestions.hasAnswerId(7758, 10175),
    yes: libQuestions.hasAnswerId(7758, 10176),
  };
  // === IHMISSUHTEET ===

  // 97–98) Yksinäisyys / keskustelukumppani (binääriset) [7760–7761]
  const feelsLonely = {
    no: libQuestions.hasAnswerId(7760, 10171),
    yes: libQuestions.hasAnswerId(7760, 10172),
  };
  const hasSomeoneToTalk = {
    no: libQuestions.hasAnswerId(7761, 10173),
    yes: libQuestions.hasAnswerId(7761, 10174),
  };

  // 99–105) Kokemukset (monivalinnat id:llä)
  const bullying = {
    none: libQuestions.hasAnswerId(7762, 10076),
    last6mo: libQuestions.hasAnswerId(7762, 10077),
    earlier: libQuestions.hasAnswerId(7762, 10078),
  };
  const harassment = {
    none: libQuestions.hasAnswerId(7763, 10079),
    last6mo: libQuestions.hasAnswerId(7763, 10080),
    earlier: libQuestions.hasAnswerId(7763, 10081),
  };
  const partnerViolence = {
    none: libQuestions.hasAnswerId(7764, 10082),
    last6mo: libQuestions.hasAnswerId(7764, 10083),
    earlier: libQuestions.hasAnswerId(7764, 10084),
  };
  const familyViolence = {
    none: libQuestions.hasAnswerId(7765, 10085),
    last6mo: libQuestions.hasAnswerId(7765, 10086),
    earlier: libQuestions.hasAnswerId(7765, 10087),
  };
  const otherViolence = {
    none: libQuestions.hasAnswerId(7766, 10088),
    last6mo: libQuestions.hasAnswerId(7766, 10089),
    earlier: libQuestions.hasAnswerId(7766, 10090),
  };
  const seriousIllnessOrDeathCloseOne = {
    none: libQuestions.hasAnswerId(7767, 10091),
    last6mo: libQuestions.hasAnswerId(7767, 10092),
    earlier: libQuestions.hasAnswerId(7767, 10093),
  };
  const closeOneSubstanceIssues = {
    none: libQuestions.hasAnswerId(7768, 10094),
    last6mo: libQuestions.hasAnswerId(7768, 10095),
    earlier: libQuestions.hasAnswerId(7768, 10096),
  };

  // === LOPUKSI ===

  // 107) Mistä olet tyytyväinen? (vapaateksti) [7770]
  const satisfactionText = libQuestions.getAnswerValue(7770);

  // 108–109) Huoli ja muu asia (binääriset) [7771–7772]
  const wantsFastNurseCheck = {
    no: libQuestions.hasAnswerId(7771, 10169),
    yes: libQuestions.hasAnswerId(7771, 10170),
  };

  const hasOtherIssueForCheck = {
    no: libQuestions.hasAnswerId(7772, 10352),
    yes: libQuestions.hasAnswerId(7772, 10353),
  };

  // 110) Muu asia – mikä? (vapaateksti) [7773]
  const otherIssueText = libQuestions.getAnswerValue(7773);

  // AVUSTAVAT MUUTTUJAT PUNAISTEN RISKIPISTEIDEN LASKENTAAN

  // Punaisten riskien määrä
  let redRiskCount = 0;

  // Laskee kuinka hankalaa ahdistusta opiskelija kokee
  let anxietySeverityPoints = 0;
  if (anxietyNervousTense.severalDays) anxietySeverityPoints += 1;
  if (anxietyNervousTense.mostDays) anxietySeverityPoints += 2;
  if (anxietyNervousTense.nearlyEveryDay) anxietySeverityPoints += 3;

  if (anxietyUncontrollableWorry.severalDays) anxietySeverityPoints += 1;
  if (anxietyUncontrollableWorry.mostDays) anxietySeverityPoints += 2;
  if (anxietyUncontrollableWorry.nearlyEveryDay) anxietySeverityPoints += 3;

  // --- PUNAISET KRITEERIT ---

  //Punaisten kriteerien apumuuttujat
  //BMI
  let bmi = null;
  const toNum = (v) => {
    if (v === null || v === undefined) return NaN;
    if (typeof v === "number") return v;
    // vaihdetaan pilkku pisteeksi varmuuden vuoksi
    const s = String(v).replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  };

  const w = toNum(weightKg);
  const hCm = toNum(height);
  if (Number.isFinite(w) && Number.isFinite(hCm) && hCm > 0) {
    const hM = hCm / 100;
    bmi = w / (hM * hM);
  }

  // Tämä taulukko listaa punaiset kriteerit ja ammattilaisen palautteen @1-merkin kohdalle tulevan kuvauksen kriteeristä.

  const redRiskConditions = [
    [studyStart.poor, "opiskelujen käynnistyminen heikosti"],
    [healthStatus.poor, "koettu terveydentila huono"],
    [
      unresolvedSymptoms >= 3,
      "useita (≥3) jatkuvia/toistuvia oireita, joihin vastaaja ei koe saavansa riittävästi apua",
    ],
    [
      anxietySeverityPoints >= 3 &&
        (anxietyInTreatment.no === true ||
          (!anxietyInTreatment.yes && !anxietyInTreatment.no)),
      "merkittäviä ahdistukseen liittyviä oireita, joihin vastaaja ei maininnut olevan hoitokontaktia",
    ],
    [
      typeof bmi === "number" && bmi <= 17,
      "vastaajan ilmoittamien tietojen perusteella alipainoa (BMI on 17 tai vähemmän)",
    ],
    [
      lowMoodOften.yes &&
        (depressionInTreatment.no === true ||
          (!depressionInTreatment.yes && !depressionInTreatment.no)),
      "kuvaa olleensa usein huolissaan alakulosta, masentuneisuudesta tai toivottomuudesta, johon vastaaja ei maininnut olevan hoitokontaktia",
    ],
    [
      lowInterestOften.yes &&
        (lowInterestInTreatment.no === true ||
          (!lowInterestInTreatment.yes && !lowInterestInTreatment.no)),
      "kuvaa olleensa usein huolissaan kokemastaan mielenkiinnon puutteesta tai haluttomuudesta, johon vastaaja ei maininnut olevan hoitokontaktia",
    ],
    [
      suspectedEatingDisorder.yes &&
        (eatingIssueInTreatment.no === true ||
          (!eatingIssueInTreatment.yes && !eatingIssueInTreatment.no)),
      "kuvaa, että hän itse tai joku muu on epäillyt hänellä syömishäiriötä, johon vastaaja ei maininnut olevan hoitokontaktia",
    ],
    [
      usesDrugs.yes &&
        (drugsFrequency.occasionally || drugsFrequency.regularly),
      "huumausaineiden käyttö (satunnaista tai säännöllistä)",
    ],
    [bullying.last6mo, "kiusaamista viimeisimmän 6 kuukauden aikana"],
    [
      harassment.last6mo,
      "seksuaalista häirintää tai painostusta viimeisimmän 6 kuukauden aikana",
    ],
    [
      partnerViolence.last6mo,
      "fyysistä tai henkistä väkivaltaa seurustelusuhteessa viimeisimmän 6 kuukauden aikana",
    ],
    [
      familyViolence.last6mo,
      "fyysistä tai henkistä väkivaltaa perheenjäsenten välillä viimeisimmän 6 kuukauden aikana",
    ],
    [
      otherViolence.last6mo,
      "fyysistä tai henkistä väkivaltaa muussa yhteydessä viimeisimmän 6 kuukauden aikana",
    ],
    [
      wantsFastNurseCheck.yes,
      "toivoo pääsyä terveystarkastukseen mahdollisimman pian",
    ],
  ];

  // Kuinka moni ehto täyttyy (punaiset)
  redRiskCount = redRiskConditions.filter(([cond]) => Boolean(cond)).length;

  ///APUMUUTTUJIA KELTAIDEN RISKIPISTEIDEN LASKENTAAN

  // AUDIT 1–3 pisteytys (AUDIT-C)

  // AUDIT Q1: Alkoholin käyttötiheys
  let auditQ1Points = 0;
  if (auditQ1.never) auditQ1Points = 0;
  else if (auditQ1.monthlyOrLess) auditQ1Points = 1;
  else if (auditQ1.twoToFourPerMonth) auditQ1Points = 2;
  else if (auditQ1.twoToThreePerWeek) auditQ1Points = 3;
  else if (auditQ1.fourOrMorePerWeek) auditQ1Points = 4;

  // AUDIT Q2: Annokset tyypillisesti
  let auditQ2Points = 0;
  if (auditQ2.oneToTwo) auditQ2Points = 0;
  else if (auditQ2.threeToFour) auditQ2Points = 1;
  else if (auditQ2.fiveToSix) auditQ2Points = 2;
  else if (auditQ2.sevenToNine) auditQ2Points = 3;
  else if (auditQ2.tenOrMore) auditQ2Points = 4;

  // AUDIT Q3: Suuret annokset
  let auditQ3Points = 0;
  if (auditQ3.never) auditQ3Points = 0;
  else if (auditQ3.lessThanMonthly) auditQ3Points = 1;
  else if (auditQ3.monthly) auditQ3Points = 2;
  else if (auditQ3.weekly) auditQ3Points = 3;
  else if (auditQ3.dailyOrAlmost) auditQ3Points = 4;

  // Audit kokonaispisteet
  const auditCTotal = auditQ1Points + auditQ2Points + auditQ3Points;

  // Audit riskirajat
  const riskLimit = 4;
  const auditRiskConsumption = auditCTotal >= riskLimit;

  // Unituntien määrä

  function computeWeekdaySleepHours(bedTimeWeekdays, wakeTimeWeekdays) {
    if (!bedTimeWeekdays || !wakeTimeWeekdays) return null;

    // Valintojen järjestys (ensimmäinen true voittaa)
    const BED_KEYS = [
      "before20",
      "at2100",
      "at2200",
      "at2300",
      "at2400",
      "at0100",
      "after0200",
    ];
    const WAKE_KEYS = [
      "before0500",
      "at0600",
      "at0700",
      "at0800",
      "at0900",
      "after1000",
    ];

    // Kellonajat tunneiksi (desimaalina)
    const BED_HOURS = {
      before20: 20,
      at2100: 21,
      at2200: 22,
      at2300: 23,
      at2400: 24,
      at0100: 25,
      after0200: 26,
    };
    const WAKE_HOURS = {
      before0500: 5,
      at0600: 6,
      at0700: 7,
      at0800: 8,
      at0900: 9,
      after1000: 10,
    };

    // Poimi valitut tunnit (vain yksi voi olla true)
    let bedHour = null;
    for (const k of BED_KEYS) {
      if (bedTimeWeekdays[k]) {
        bedHour = BED_HOURS[k];
        break;
      }
    }
    let wakeHour = null;
    for (const k of WAKE_KEYS) {
      if (wakeTimeWeekdays[k]) {
        wakeHour = WAKE_HOURS[k];
        break;
      }
    }

    if (bedHour == null || wakeHour == null) return null;

    // Yö yli puolenyön
    if (wakeHour <= bedHour) wakeHour += 24;

    return wakeHour - bedHour; // tuntia desimaalina
  }

  const weekdaySleepHours = computeWeekdaySleepHours(
    bedTimeWeekdays,
    wakeTimeWeekdays,
  );

  /// KELTAISEN RISKIPISTEIDEN LASKENTA

  // Tämä taulukko listaa keltaiset kriteerit ja ammattilaisen palautteen @1-merkin kohdalle tulevan kuvauksen kriteeristä.

  // --- KELTAISET KRITEERIT ---
  const yellowRiskConditions = [
    [
      (studyImpacts.learningDifficulty ||
        studyImpacts.concentrationDifficulty) &&
        supportStudyDifficulty.no === true,
      "oppimis- tai keskittymisvaikeuksia, joihin ei koe saavansa riittävästi apua",
    ],

    [
      otherPsychIssue.yes &&
        (otherPsychIssueInTreatment.no === true ||
          (!otherPsychIssueInTreatment.yes && !otherPsychIssueInTreatment.no)),
      "muu psyykkinen oire, johon vastaaja ei maininnut olevan hoitokontaktia",
    ],
    [
      concernEatingWeight.yes &&
        (eatingIssueInTreatment.no === true ||
          (!eatingIssueInTreatment.yes && !eatingIssueInTreatment.no)),
      "kuvaa huolta syömiseen tai painoon liittyen, johon vastaaja ei maininnut olevan hoitokontaktia",
    ],
    [
      typeof weekdaySleepHours === "number" && weekdaySleepHours < 6,
      "arkisin yöunen määrä alle 6 tuntia",
    ],
    [
      typeof bmi === "number" && bmi >= 30,
      "vastaajan ilmoittamien tietojen perusteella lihavuutta (BMI on 30 tai enemmän)",
    ],
    [
      screenTimeHarm.often,
      "netti/some/ruutuaika haittaa usein (ihmissuhteita, unta tai opiskelua)",
    ],
    [auditRiskConsumption, "alkoholin riskikäyttö (AUDIT-C riskiraja ylittyy)"],
    [
      seriousIllnessOrDeathCloseOne.last6mo,
      "läheisen vakava sairaus tai kuolema viimeisimmän 6 kuukauden aikana",
    ],
    [
      closeOneSubstanceIssues.last6mo,
      "läheisen ongelmallinen päihteiden käyttö viimeisimmän 6 kuukauden aikana",
    ],
    [
      wantsTalkGenderIdentity.yes,
      "halu keskustella seksuaalisesta suuntautumisesta tai sukupuoli-identiteetistä",
    ],
  ];

  // Kuinka moni ehto täyttyy (keltaiset)
  const yellowRiskCount = yellowRiskConditions.filter(([cond]) =>
    Boolean(cond),
  ).length;

  /*******************************
   * OTH – potilasasiakirjamerkintä (Markdown, ilman "Vastaaja..."-toistoa)
   *******************************/

  /* ===== Phrase building functions ===== */

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

  /* ===== Utility functions ===== */

  // Create Date Object
  var d = new Date();
  var dayMonthYear = d
    .toLocaleString("en-US", { hour12: false, timeZone: "Europe/Helsinki" })
    .replace(/\//g, ".")
    .replace(",", " klo")
    .split(".");
  var dayToSwap = dayMonthYear[1];
  dayMonthYear[1] = dayMonthYear[0];
  dayMonthYear[0] = dayToSwap;
  var strDate =
    " (tiedot opiskelijan ilmoittamia " + dayMonthYear.join(".") + " )";

  function textOrMissing(txt, lead = "", tail = "") {
    if (typeof txt === "string") {
      const val = txt.trim();
      return val.length > 0 ? lead + val + tail : "ei vastannut";
    }
    if (typeof txt === "number" && !isNaN(txt)) return lead + txt + tail;
    return "ei vastannut";
  }

  /* ===== Otsikot Markdownina ===== */
  function h1(title) {
    return "\n\n## " + title + "\n";
  }
  function h2(title) {
    return "\n\n## " + title + "\n";
  }
  function h3(title) {
    return "\n\n### " + title + "\n";
  }

  /* ===== Listalause ===== */
  function listSentence(pairs, leadIfAny, missingText) {
    if (!checkAliasList(pairs)) return missingText;
    return leadIfAny + createPhraseAliases(pairs) + ".";
  }
  ///////////////////////////////////
  /* ===== MAIN NOTE BUILDER ===== */
  function buildOTHNote() {
    const out = [];

    // --- Apufunktio: lisää lause ja hoitaa välilyönnin väliin mutta ei kappaleen alkuun ---
    function pushS(s) {
      if (!s) return;
      const txt = String(s).replace(/^\s+/, ""); // poista johtavat välilyönnit lauseesta
      const prev = out.length ? out[out.length - 1] : "";
      const isParagraphBreak =
        prev === "" || /\n\n$/.test(prev) || prev.endsWith("\n");

      // jos ei kappaleen alku, esivälilyönti
      if (!isParagraphBreak && txt.length > 0) {
        out.push(" " + txt);
      } else {
        out.push(txt);
      }
    }

    // --- Apufunktio: lisää kappaleen loppuun "ei vastattu" -lista ---
    function pushMissingList(title, arr) {
      if (!arr || arr.length === 0) return;
      out.push(`\n\n**${title} – näihin kysymyksiin ei vastattu:**\n`);
      out.push(arr.map((q) => "- " + q).join("\n"));
    }

    // Pääotsikko
    out.push(h1("Terveyskyselyn tiivistelmä: ") + strDate);

    /* ---------------- Opiskelu ---------------- */
    out.push(h2("Lähiomaisen tai yhteyshenkilön tiedot"));

    const missingRelative = [];

    // 9–11. Lähiomaisen tai yhteyshenkilön tiedot

    // nimi ja puhelinnumero
    if (relativeContactInfo && relativeContactInfo.trim() !== "") {
      pushS(
        "Ilmoitettu lähiomaisen tai yhteyshenkilön nimi ja puhelinnumero: " +
          relativeContactInfo.trim() +
          ".",
      );
    } else {
      missingRelative.push("Lähiomaisen/yhteyshenkilön nimi ja puhelinnumero");
    }

    // suhde
    if (
      relativeRelation &&
      (relativeRelation.closeRelative === true ||
        relativeRelation.otherContact === true)
    ) {
      if (relativeRelation.closeRelative) {
        pushS("Henkilö on ilmoitettu lähiomaiseksi.");
      } else if (relativeRelation.otherContact) {
        pushS("Henkilö on ilmoitettu muuksi yhteyshenkilöksi.");

        // jos muu yhteyshenkilö, haetaan tarkempi suhde
        if (relationToRespondent && relationToRespondent.trim() !== "") {
          pushS(
            "Vastaajan ilmoittama suhde henkilöön: " +
              relationToRespondent.trim() +
              ".",
          );
        } else {
          missingRelative.push("Muun yhteyshenkilön suhde vastaajaan");
        }
      }
    } else {
      // jos kumpaakaan ei ole valittu, lisätään puuttuvaksi
      missingRelative.push("Henkilön suhde (lähiomainen / muu yhteyshenkilö)");
    }

    // Opiskelu – puuttuvat
    pushMissingList("Lähiomaisen tai yhteyshenkilön tiedot", missingRelative);

    /* ---------------- Opiskelu ---------------- */
    out.push(h2("Opiskelu"));
    const missingStudy = [];

    // 2. Asuminen
    if (livingNow) {
      const livingPairs = [
        [livingNow.withParents, "vanhempien/huoltajan kanssa"],
        [
          livingNow.withPartnerOrFriend,
          "seurustelukumppanin, ystävän tai puolison kanssa",
        ],
        [livingNow.alone, "yksin"],
        [
          livingNow.other,
          "muulla tavalla kuin yksin, huoltajan tai läheisen kanssa",
        ],
      ];
      if (checkAliasList(livingPairs)) {
        pushS("Asuu " + createPhraseAliases(livingPairs) + ".");
      } else {
        missingStudy.push("Asumismuoto");
      }
    } else {
      missingStudy.push("Asumismuoto");
    }

    // 3. Oppimiseen ja keskittymiseen liittyvät vaikeudet
    if (studyImpacts) {
      if (studyImpacts.noneOfAbove) {
        pushS(
          "Vastaaja ei ilmoita oppimiseen tai keskittymiseen liittyviä vaikeuksia.",
        );
      } else {
        const impactsPairs = [
          [studyImpacts.learningDifficulty, "oppimisvaikeuksia"],
          [studyImpacts.concentrationDifficulty, "keskittymisvaikeuksia"],
        ];
        if (checkAliasList(impactsPairs)) {
          pushS(
            "Ilmoittaa oppimiseen tai keskittymiseen vaikeutena: " +
              createPhraseAliases(impactsPairs) +
              ".",
          );
        } else {
          missingStudy.push("Oppimiseen/keskittymiseen liittyvät vaikeudet");
        }
      }
    } else {
      missingStudy.push("Oppimiseen/keskittymiseen liittyvät vaikeudet");
    }

    // 4. Oppimisvaikeuksien kuvaus

    if (
      (studyImpacts && studyImpacts.learningDifficulty === true) ||
      (studyImpacts && studyImpacts.concentrationDifficulty === true)
    ) {
      if (studyDifficultyText && studyDifficultyText.trim() !== "") {
        pushS(
          "Vastaajan kuvaus oppimis- tai keskittymisvaikeudesta: " +
            studyDifficultyText +
            ".",
        );
      } else {
        missingStudy.push("Oppimis- tai keskittymisvaikeuden tarkempi kuvaus");
      }
      if (supportStudyDifficulty.yes === true) {
        pushS(
          "Vastaaja ilmoittaa saavansa riittävästi apua oppimis- tai keskittymisvaikeuteensa.",
        );
      } else if (supportStudyDifficulty.no === true) {
        pushS(
          "Vastaaja ilmoittaa, ettei saa riittävästi apua oppimis- tai keskittymisvaikeuteensa.",
        );
      } else {
        missingStudy.push(
          "Saako riittävästi apua oppimis- tai keskittymisvaikeuteensa (kyllä/ei)",
        );
      }
    }

    // 5. Opintojen käynnistyminen
    if (studyStart) {
      const startPairs = [
        [studyStart.good, "hyvin"],
        [studyStart.moderate, "kohtalaisesti"],
        [studyStart.poor, "heikosti"],
      ];
      if (checkAliasList(startPairs)) {
        pushS(
          "Arvioi opintojen käynnistyneen " +
            createPhraseAliases(startPairs) +
            ".",
        );
      } else {
        missingStudy.push("Arvio opintojen käynnistymisestä");
      }
    } else {
      missingStudy.push("Arvio opintojen käynnistymisestä");
    }

    // 6–7. Aiemmat opinnot
    if (priorStudies) {
      if (priorStudies.yes) {
        pushS("On opiskellut peruskoulun jälkeen.");
        if (
          priorStudiesText === undefined ||
          priorStudiesText === null ||
          priorStudiesText === ""
        ) {
          missingStudy.push("Aiemmat opinnot – tarkennus");
        } else {
          pushS("Tarkennus: " + priorStudiesText + ".");
        }
      } else if (priorStudies.no) {
        pushS("Ei aiempia opintoja peruskoulun jälkeen.");
      } else {
        missingStudy.push("Aiemmat opinnot");
      }
    } else {
      missingStudy.push("Aiemmat opinnot");
    }

    // 8. Töissäkäynti
    if (worksAlongStudy.yes === true) pushS("Käy töissä opiskelun ohessa.");
    else if (worksAlongStudy.no === true)
      pushS("Ei käy töissä opiskelun ohessa.");
    else missingStudy.push("Töissäkäynti opiskelun ohella");

    // Opiskelu – puuttuvat
    pushMissingList("Opiskelu", missingStudy);

    /* ---------------- Terveys ---------------- */
    out.push(h2("Terveys"));
    const missingHealth = [];

    // 10. Terveydentilan oma arvio
    if (healthStatus) {
      const hsPairs = [
        [healthStatus.good, "hyvä"],
        [healthStatus.fair, "tyydyttävä"],
        [healthStatus.poor, "huono"],
      ];
      if (checkAliasList(hsPairs)) {
        pushS(
          "Arvioi terveydentilansa olevan " +
            createPhraseAliases(hsPairs) +
            ".",
        );
      } else {
        missingHealth.push("Terveydentilan itsearvio");
      }
    } else {
      missingHealth.push("Terveydentilan itsearvio");
    }

    // 11–14. Pitkäaikaissairaus, tyypit, hoitopaikka
    if (hasChronicCondition && hasChronicCondition.yes === true) {
      // Kokoa valitut sairaudet
      var selected = [];

      if (chronicTypes && chronicTypes.adhdAdd === true) {
        selected.push({ key: "adhdAdd", label: "ADHD/ADD" });
      }
      if (chronicTypes && chronicTypes.autismSpectrum === true) {
        selected.push({
          key: "autismSpectrum",
          label: "Asperger tai muu autismikirjon häiriö",
        });
      }
      if (chronicTypes && chronicTypes.asthmaOrRespiratory === true) {
        selected.push({
          key: "asthmaOrRespiratory",
          label: "astma tai muu hengityselinsairaus",
        });
      }
      if (chronicTypes && chronicTypes.diabetes === true) {
        selected.push({ key: "diabetes", label: "diabetes" });
      }
      if (chronicTypes && chronicTypes.epilepsyOrNeuro === true) {
        selected.push({
          key: "epilepsyOrNeuro",
          label: "epilepsia tai muu hermostosairaus",
        });
      }
      if (chronicTypes && chronicTypes.skinDisease === true) {
        selected.push({ key: "skinDisease", label: "ihosairaus" });
      }
      if (chronicTypes && chronicTypes.thyroid === true) {
        selected.push({ key: "thyroid", label: "kilpirauhasen sairaus" });
      }
      if (chronicTypes && chronicTypes.earOrHearingLoss === true) {
        selected.push({
          key: "earOrHearingLoss",
          label: "korvasairaus tai kuulonalenema",
        });
      }
      if (chronicTypes && chronicTypes.depressionAnxietyPsych === true) {
        selected.push({
          key: "depressionAnxietyPsych",
          label: "masennus/ahdistuneisuushäiriö tai muu psyykkinen sairaus",
        });
      }
      if (chronicTypes && chronicTypes.migraine === true) {
        selected.push({ key: "migraine", label: "migreeni" });
      }
      if (chronicTypes && chronicTypes.giOrDigestive === true) {
        selected.push({
          key: "giOrDigestive",
          label: "suoliston tai ruoansulatuselimistön sairaus",
        });
      }
      if (chronicTypes && chronicTypes.cardioVascular === true) {
        selected.push({
          key: "cardioVascular",
          label: "sydän- tai verisuonisairaus",
        });
      }
      if (chronicTypes && chronicTypes.visionRefractionOrEye === true) {
        selected.push({
          key: "visionRefractionOrEye",
          label: "taittovika (silmälasit) tai silmäsairaus",
        });
      }
      if (chronicTypes && chronicTypes.musculoskeletal === true) {
        selected.push({
          key: "musculoskeletal",
          label: "tuki- ja liikuntaelimistön sairaus",
        });
      }
      if (chronicTypes && chronicTypes.hypertension === true) {
        selected.push({ key: "hypertension", label: "verenpainetauti" });
      }
      if (chronicTypes && chronicTypes.other === true) {
        var otherLabel = "muu sairaus tai vamma";
        if (
          typeof chronicOtherText === "string" &&
          chronicOtherText.trim().length > 0
        ) {
          otherLabel = "muu sairaus tai vamma: " + chronicOtherText.trim();
        } else {
          // jos vaaditaan tarkennus
          missingHealth.push("Muu pitkäaikaissairaus – tarkennus");
        }
        selected.push({ key: "other", label: otherLabel });
      }

      if (!selected.length) {
        // Vastattu kyllä, mutta yhtään tyyppiä ei valittu
        pushS(
          "Ilmoittaa, että todettu pysyvä tai pitkäkestoinen sairaus tai vamma.",
        );
        missingHealth.push("Pitkäaikaissairauden/vamman kuvaus");
      } else {
        // Sairaus + per-sairaus hoitopaikka (omille riveilleen)
        var lines = [];
        var sites = chronicCareSiteByDisease || {};
        for (var i = 0; i < selected.length; i++) {
          var s = selected[i];
          var raw = sites[s.key];
          var site = "";

          if (raw !== undefined && raw !== null) {
            site = String(raw).trim();
          }

          if (!site) {
            missingHealth.push(
              "Pitkäaikaissairauden hoitopaikka (" + s.label + ")",
            );
          }

          lines.push(
            "- " +
              s.label +
              ", vastaajan ilmoittama toteamispaikka/nykyinen hoitopaikka: " +
              (site || "—") +
              ".",
          );
        }

        // Otsikko + rivit (uusi kappale)
        out.push(
          "\nVastaaja ilmoittaa seuraavat sairaudet/vammat:\n" +
            lines.join("\n") +
            "\n",
        );
      }
    } else if (hasChronicCondition && hasChronicCondition.no === true) {
      pushS(
        "Ilmoittaa, ettei ole todettu pysyvää tai pitkäkestoista sairautta tai vammaa.",
      );
    } else {
      // ei vastattu kyllä/ei
      missingHealth.push("Pitkäaikaissairaus/vamma (kyllä/ei)");
    }

    // Leikkaukset ja sairaalahoidot
    // Onko taustalla leikkauksia tai sairaalahoitoja
    if (surgeriesOrHospital.yes === true) {
      pushS(
        "Vastaaja ilmoittaa aiemmin olleensa leikkauksissa tai sairaalahoidoissa.",
      );
    } else if (surgeriesOrHospital.no === true) {
      pushS(
        "Vastaaja ilmoittaa, ettei ole ollut leikkauksissa tai sairaalahoidoissa.",
      );
    } else {
      missingHealth.push("Leikkaukset/sairaalahoidot (kyllä/ei)");
    }

    if (surgeriesOrHospital.yes && surgeriesOrHospitalText) {
      pushS(
        "Kuvaus mahdollisista aiemmista sairaalahoidoista ja leikkauksista: " +
          surgeriesOrHospitalText +
          ".",
      );
    } else {
      missingHealth.push(
        "Kuvaus mahdollisista aiemmista leikkauksista/sairaalahoidoista",
      );
    }

    // OIREET

    // Apufunktio: palauttaa selitteen jatkokysymyksen mukaan
    function symptomStatusSuffix(val) {
      if (val === "yes") return "(saa riittävästi apua)";
      if (val === "no") return "(ei saa riittävästi apua)";
      return "(ei vastannut saako riittävästi apua)";
    }

    // Oireiden perusmappi (label + key)
    const symptomMap = [
      { label: "hengenahdistusta rasituksessa", key: "dyspneaWhenExercising" },
      { label: "huimaus", key: "dizziness" },
      { label: "ihottuma tai muut iho-oireet", key: "skinRashIssues" },
      { label: "niska- tai hartiakipu", key: "neckShoulderPain" },
      { label: "nivelkipu", key: "jointPain" },
      { label: "päänsärky", key: "headache" },
      { label: "pitkittynyt nuha tai yskä", key: "prolongedRhinitisOrCough" },
      { label: "selkäkipu", key: "backPain" },
      {
        label: "sydämen tykytys tai rytmihäiriöt",
        key: "palpitationsArrhythmia",
      },
      { label: "vaikeuksia kuulla", key: "hearingDifficulty" },
      {
        label:
          "vaikeuksia nähdä ilman silmälaseja tai nykyisillä silmälaseilla",
        key: "visionDifficulty",
      },
      { label: "vatsakipua tai vatsan toiminnan häiriö", key: "abdominalPain" },
      {
        label: "pitkäaikaissairauteen liittyvä muu oire",
        key: "otherChronicSymptom",
      },
    ];

    // Rakennetaan oirelistat: kyllä- ja ei-vastaukset erikseen
    const positiveSymptoms = [];
    const negativeSymptoms = [];

    symptomMap.forEach((s) => {
      const symptom = symptomTypes[s.key];
      const followup = symptomFollowups ? symptomFollowups[s.key] : undefined;

      // Jos käyttäjä ei vastannut tähän oireeseen ollenkaan → lisätään puuttuvaksi
      if (!symptom || (symptom.yes !== true && symptom.no !== true)) {
        missingHealth.push(`Oirekysymys vastaamatta: ${s.label}`);
        return;
      }

      // Jos käyttäjä vastasi "kyllä" → lisätään positiivisten listaan
      if (symptom.yes === true) {
        // Päätellään followup-arvo
        const followupVal = followup
          ? followup.yes === true
            ? "yes"
            : followup.no === true
              ? "no"
              : undefined
          : undefined;

        // Rakennetaan seliteteksti
        let label = `${s.label} ${symptomStatusSuffix(followupVal)}`;

        // Lisätään vapaateksti, jos "muu krooninen oire"
        if (
          s.key === "otherChronicSymptom" &&
          typeof otherChronicSymptomText === "string" &&
          otherChronicSymptomText.trim().length > 0
        ) {
          label += `; vastaajan kuvaus oireesta: ${otherChronicSymptomText.trim()}`;
        }

        positiveSymptoms.push([true, label]);
        return;
      }

      // Jos käyttäjä vastasi "ei" → lisätään erikseen ei-oireisiin
      if (symptom.no === true) {
        const label = s.label;
        negativeSymptoms.push([true, label]);
      }
    });

    // Luodaan lopullinen teksti tai puuttuva tieto
    if (checkAliasList(positiveSymptoms)) {
      out.push("\n\n");
      pushS(
        "Opiskelija ilmoittaa seuraavia jatkuvia tai toistuvia oireita: \n - " +
          createPhraseAliases(positiveSymptoms, "\n - ", "\n - ") +
          ".",
      );
    }

    if (checkAliasList(negativeSymptoms)) {
      out.push("\n\n");
      pushS(
        "Opiskelija ilmoittaa, ettei hänellä ole seuraavia jatkuvia tai toistuvia oireita: \n - " +
          createPhraseAliases(negativeSymptoms, "\n - ", "\n - ") +
          ".",
      );
    }

    out.push(h3("Mielenterveys"));

    // 35–39. Ahdistuneisuus

    // 1) Onko ahdistuneisuutta
    if (hasAnxiety.yes === true) {
      pushS("Vastaaja ilmoittaa ahdistuneisuutta.");
    } else if (hasAnxiety.no === true) {
      pushS("Vastaaja ilmoittaa, ettei koe ahdistuneisuutta.");
    } else {
      missingHealth.push("Ahdistuneisuus (kyllä/ei)");
    }

    // Apufunktio asteikkovastauksen hakemiseen
    function selectedScaleKey(scaleObj) {
      if (!scaleObj) return null;
      var keys = [];
      for (var k in scaleObj) {
        if (scaleObj.hasOwnProperty(k) && scaleObj[k] === true) {
          keys.push(k);
        }
      }
      return keys.length === 1 ? keys[0] : null;
    }

    function selectedScaleLabel(scaleObj, labels) {
      var key = selectedScaleKey(scaleObj);
      return key ? labels[key] : null;
    }

    // Asteikkoarvot
    var nervousLabels = {
      none: "ei ollenkaan",
      severalDays: "muutamina päivinä",
      mostDays: "suurimpana osana päivistä",
      nearlyEveryDay: "melkein joka päivä",
    };

    // spread-operaattorin sijaan kopioidaan manuaalisesti
    var worryLabels = {
      none: nervousLabels.none,
      severalDays: nervousLabels.severalDays,
      mostDays: nervousLabels.mostDays,
      nearlyEveryDay: nervousLabels.nearlyEveryDay,
    };

    // Käsitellään asteikkoväittämät vain jos ahdistuneisuutta on ilmoitettu
    var severeAnxiety = false;

    if (hasAnxiety.yes === true) {
      // 37) Olen ollut hermostunut, ahdistunut tai kireä
      var nervousAnswerKey = selectedScaleKey(anxietyNervousTense);
      var nervousAnswerLabel = selectedScaleLabel(
        anxietyNervousTense,
        nervousLabels,
      );

      if (nervousAnswerLabel) {
        pushS(
          "Vastaaja kertoo olleensa viimeisen kahden viikon aikana hermostunut, ahdistunut tai kireä: " +
            nervousAnswerLabel +
            ".",
        );
        if (
          nervousAnswerKey === "mostDays" ||
          nervousAnswerKey === "nearlyEveryDay"
        ) {
          severeAnxiety = true;
        }
      } else {
        missingHealth.push(
          "Ahdistusoireet: hermostuneisuus/ahdistuneisuus (asteikko)",
        );
      }

      // 38) En ole voinut lopettaa tai hallita huolestumistani
      var worryAnswerKey = selectedScaleKey(anxietyUncontrollableWorry);
      var worryAnswerLabel = selectedScaleLabel(
        anxietyUncontrollableWorry,
        worryLabels,
      );

      if (worryAnswerLabel) {
        pushS(
          "Viimeisen kahden viikon aikana vastaajaa on vaivannut hallitsematon huolestuminen: " +
            worryAnswerLabel +
            ".",
        );
        if (
          worryAnswerKey === "mostDays" ||
          worryAnswerKey === "nearlyEveryDay"
        ) {
          severeAnxiety = true;
        }
      } else {
        missingHealth.push("Ahdistusoireet: huolestumisen hallinta (asteikko)");
      }

      // 39) Ahdistusoireiden hoito – tarkastetaan vain jos oireet usein
      if (severeAnxiety === true) {
        if (anxietyInTreatment.yes === true) {
          pushS("Ahdistusoireisiin on hoitokontakti.");
        } else if (anxietyInTreatment.no === true) {
          pushS("Ahdistusoireisiin ei ole hoitokontaktia.");
        } else {
          missingHealth.push("Ahdistusoireisiin hoitokontakti (kyllä/ei)");
        }
      }
    }

    // 40–44. Masentuneisuus
    // Masentuneisuus ja siihen liittyvät jatkokysymykset
    if (hasDepression.yes === true) pushS("Kokee masentuneisuutta.");
    else if (hasDepression.no === true) pushS("Ei koe masentuneisuutta.");
    else missingHealth.push("Masentuneisuus (kyllä/ei)");

    if (hasDepression.yes === true) {
      // Alakulko / toivottomuus
      if (lowMoodOften.yes === true) {
        pushS(
          "Viimeisen kuukauden aikana usein huolta alakulosta, masennuksesta tai toivottomuudesta.",
        );
        // Masennusoireiden hoitokontakti
        if (depressionInTreatment.yes === true)
          pushS("Masennusoireisiin on hoitokontakti.");
        else if (depressionInTreatment.no === true)
          pushS("Masennusoireisiin ei ole hoitokontaktia.");
        else missingHealth.push("Masennusoireisiin hoitokontakti (kyllä/ei)");
      } else if (lowMoodOften.no === true)
        pushS(
          "Ei usein huolta alakulosta, masennuksesta tai toivottomuudesta viimeisen kuukauden aikana.",
        );
      else missingHealth.push("Alakulko/toivottomuus (jatkokysymys)");

      // Mielenkiinnon puute / haluttomuus
      if (lowInterestOften.yes === true) {
        pushS(
          "Viimeisen kuukauden aikana usein huolta mielenkiinnon puutteesta tai haluttomuudesta.",
        );
        // Hoitokontakti mielenkiinnon puutteeseen
        if (lowInterestInTreatment.yes === true)
          pushS(
            "Mielenkiinnon puutteeseen tai haluttomuuteen on hoitokontakti.",
          );
        else if (lowInterestInTreatment.no === true)
          pushS(
            "Mielenkiinnon puutteeseen tai haluttomuuteen ei ole hoitokontaktia.",
          );
        else
          missingHealth.push(
            "Mielenkiinnon puutteeseen/haluttomuuteen hoitokontakti (kyllä/ei)",
          );
      } else if (lowInterestOften.no === true)
        pushS(
          "Ei usein mielenkiinnon puutetta tai haluttomuutta viimeisen kuukauden aikana.",
        );
      else missingHealth.push("Mielenkiinnon puute/haluttomuus (jatkokysymys)");
    }

    // 45–48. Syöminen
    if (eatingIssue.yes === true)
      pushS("Ilmoittaa syömiseen liittyviä huolia tai oireita.");
    else if (eatingIssue.no === true)
      pushS("Ilmoittaa, ettei syömiseen liittyviä huolia tai oireita.");
    else
      missingHealth.push("Syömiseen liittyviä huolia tai oireita (kyllä/ei)");

    if (eatingIssue.yes === true) {
      if (concernEatingWeight.yes === true)
        pushS(
          "Vastaaja ilmoittaa, että hän itse tai joku muu on ollut huolissaan hänen syömisestään tai painostaan.",
        );
      else if (concernEatingWeight.no === true)
        pushS(
          "Ilmoittaa, ettei hän itse eikä kukaan muu ole ollut huolissaan hänen syömisestään tai painostaan.",
        );
      else missingHealth.push("Syömiseen/painoon liittyvä huoli (kyllä/ei)");

      if (suspectedEatingDisorder.yes === true)
        pushS(
          "Ilmoittaa, että hän itse tai joku muu on epäillyt hänellä syömishäiriötä.",
        );
      else if (suspectedEatingDisorder.no === true)
        pushS(
          "Ilmoittaa, ettei hän itse eikä kukaan muukaan ole epäillyt vastaajalla syömishäiriötä.",
        );
      else missingHealth.push("Syömishäiriöepäily (kyllä/ei)");

      if (eatingIssueInTreatment.yes === true)
        pushS("Syömiseen liittyviin oireisiin on hoitokontakti.");
      else if (eatingIssueInTreatment.no === true)
        pushS("Syömiseen liittyviin oireisiin ei ole hoitokontaktia.");
      else if (
        concernEatingWeight.yes === true ||
        suspectedEatingDisorder.yes === true
      ) {
        missingHealth.push("Syömiseen liittyvän oireilun hoito (kyllä/ei)");
      }
    }

    // 49–51. Muu psyykkinen oire
    if (otherPsychIssue.yes === true) pushS("Vastannut: Muu psyykkinen oire.");
    else if (otherPsychIssue.no === true) pushS("Ei muita psyykkisiä oireita.");
    else missingHealth.push("Muu psyykkinen oire (kyllä/ei)");

    if (otherPsychIssue.yes === true) {
      if (
        !otherPsychIssueText ||
        typeof otherPsychIssueText !== "string" ||
        otherPsychIssueText.trim() === ""
      )
        missingHealth.push("Muu psyykkinen oire – kuvaus");
      else pushS("Oireen kuvaus: " + otherPsychIssueText + ".");
      if (otherPsychIssueInTreatment.yes === true)
        pushS("Muuhun psyykkiseen oireeseen on hoitokontakti.");
      else if (otherPsychIssueInTreatment.no === true)
        pushS("Muuhun psyykkiseen oireeseen ei ole hoitokontaktia.");
      else
        missingHealth.push(
          "Muuhun psyykkiseen oireeseen hoitokontakti (kyllä/ei)",
        );
    }

    // Terveys – puuttuvat
    pushMissingList("Terveys", missingHealth);

    /* ---------------- Lääkitys, allergiat ja ruokavalio ---------------- */
    out.push(h2("Lääkitys, allergiat ja ruokavalio"));
    const missingMedsAllergyDiet = [];

    // 52–54. Lääkitys
    if (medsUse) {
      const medsPairs = [
        [medsUse.prescription, "käyttää reseptilääkettä"],
        [medsUse.otc, "käyttää itsehoitolääkettä"],
        [medsUse.none, "ei säännöllistä tai usein käytettyä lääkitystä"],
      ];
      if (checkAliasList(medsPairs)) {
        pushS("Lääkityksen käyttö: " + createPhraseAliases(medsPairs) + ".");
      } else {
        missingMedsAllergyDiet.push("Lääkityksen käyttö");
      }
    } else {
      missingMedsAllergyDiet.push("Lääkityksen käyttö");
    }
    if (medsUse && medsUse.prescription === true) {
      pushS("Reseptilääkkeet: " + textOrMissing(medsPrescriptionText) + ".");
    }
    if (medsUse && medsUse.otc === true) {
      pushS("Itsehoitolääkkeet: " + textOrMissing(medsOtcText) + ".");
    }

    // 55–61. Allergiat
    if (hasAllergy === true) pushS("Ilmoittaa allergioita.");
    else if (hasAllergy === false) pushS("Ilmoittaa, että ei ole allergioita.");
    else missingMedsAllergyDiet.push("Allergiat");

    if (hasAllergy === true) {
      if (foodAllergy === true) pushS("Ruoka-aineallergia: kyllä.");
      else if (foodAllergy === false) pushS("Ruoka-aineallergia: ei.");
      else missingMedsAllergyDiet.push("Ruoka-aineallergia (kyllä/ei)");
      if (foodAllergy === true)
        pushS("Ruoka-aineet: " + textOrMissing(foodAllergyText) + ".");

      if (drugAllergy === true) pushS("Lääkeaineallergia: kyllä.");
      else if (drugAllergy === false) pushS("Lääkeaineallergia: ei.");
      else missingMedsAllergyDiet.push("Lääkeaineallergia (kyllä/ei)");
      if (drugAllergy === true)
        pushS(
          "Vastaajan ilmoittamat lääkeaineallergiat: " +
            textOrMissing(drugAllergyText) +
            ".",
        );

      if (otherAllergy === true) pushS("Muu allergia: kyllä.");
      else if (otherAllergy === false) pushS("Muu allergia: ei.");
      else missingMedsAllergyDiet.push("Muu allergia (kyllä/ei)");
      if (otherAllergy === true)
        pushS("Muu allergia (mikä): " + textOrMissing(otherAllergyText) + ".");
    }

    // 62–63. Erityisruokavalio
    if (hasSpecialDiet.yes === true) pushS("Erityisruokavalio.");
    else if (hasSpecialDiet.no === true) pushS("Ei erityisruokavaliota.");
    else missingMedsAllergyDiet.push("Erityisruokavalio (kyllä/ei)");
    if (hasSpecialDiet.yes === true)
      pushS(
        "Erityisruokavalion kuvaus: " + textOrMissing(specialDietText) + ".",
      );

    // Lääkitys/allergiat/ruokavalio – puuttuvat
    pushMissingList(
      "Lääkitys, allergiat ja ruokavalio",
      missingMedsAllergyDiet,
    );

    /* ---------------- Terveystottumukset ---------------- */
    out.push(h2("Terveystottumukset"));

    out.push(h3("Uni"));
    const missingHabits = [];

    // 65–67. Uni arkena: ilmoita nukkumaanmeno/heräämisajat ja laske tarvittaessa nukuttu aika
    (() => {
      // Label-parit (näytettävä teksti)
      const bedLabelPairs = bedTimeWeekdays
        ? [
            [bedTimeWeekdays.before20, "kello 20 tai aikaisemmin"],
            [bedTimeWeekdays.at2100, "kello 21"],
            [bedTimeWeekdays.at2200, "kello 22"],
            [bedTimeWeekdays.at2300, "kello 23"],
            [bedTimeWeekdays.at2400, "kello 24"],
            [bedTimeWeekdays.at0100, "kello 01"],
            [bedTimeWeekdays.after0200, "kello 02 tai myöhemmin"],
          ]
        : [];

      const wakeLabelPairs = wakeTimeWeekdays
        ? [
            [wakeTimeWeekdays.before0500, "kello 05 tai aikaisemmin"],
            [wakeTimeWeekdays.at0600, "kello 06"],
            [wakeTimeWeekdays.at0700, "kello 07"],
            [wakeTimeWeekdays.at0800, "kello 08"],
            [wakeTimeWeekdays.at0900, "kello 09"],
            [wakeTimeWeekdays.after1000, "kello 10 tai myöhemmin"],
          ]
        : [];

      // Numeraaliset parit (laskentaa varten; tunnit desimaalimuodossa; nukkumaanmeno > 24 = yön yli)
      const bedNumericPairs = bedTimeWeekdays
        ? [
            [bedTimeWeekdays.before20, 20],
            [bedTimeWeekdays.at2100, 21],
            [bedTimeWeekdays.at2200, 22],
            [bedTimeWeekdays.at2300, 23],
            [bedTimeWeekdays.at2400, 24],
            [bedTimeWeekdays.at0100, 25],
            [bedTimeWeekdays.after0200, 26],
          ]
        : [];

      const wakeNumericPairs = wakeTimeWeekdays
        ? [
            [wakeTimeWeekdays.before0500, 5],
            [wakeTimeWeekdays.at0600, 6],
            [wakeTimeWeekdays.at0700, 7],
            [wakeTimeWeekdays.at0800, 8],
            [wakeTimeWeekdays.at0900, 9],
            [wakeTimeWeekdays.after1000, 10],
          ]
        : [];

      // Poimi valittu label (näyttö) ja tunti (laskenta)
      const bedLabel =
        bedLabelPairs.length && checkAliasList(bedLabelPairs)
          ? createPhraseAliases(bedLabelPairs)
          : null;
      const wakeLabel =
        wakeLabelPairs.length && checkAliasList(wakeLabelPairs)
          ? createPhraseAliases(wakeLabelPairs)
          : null;

      let bedHour = null;
      let wakeHour = null;

      for (const [flag, val] of bedNumericPairs) {
        if (flag) bedHour = val;
      }
      for (const [flag, val] of wakeNumericPairs) {
        if (flag) wakeHour = val;
      }

      // Puuttuvat vastaukset listalle
      if (!bedTimeWeekdays || bedLabel === null || bedHour === null) {
        missingHabits.push(
          "Nukkumaanmenoaika, kun seuraavana aamuna on opiskelupäivä",
        );
      }
      if (!wakeTimeWeekdays || wakeLabel === null || wakeHour === null) {
        missingHabits.push("Heräämisaika opiskeluaamuisin");
      }

      // Rakennetaan "Arkisin ..." -lause
      const parts = [];
      if (bedLabel) parts.push("menee keskimäärin nukkumaan " + bedLabel);
      if (wakeLabel) parts.push("herää keskimäärin " + wakeLabel);
      if (parts.length > 0) pushS("Arkisin " + parts.join(" ja ") + ".");

      // Jos molemmat ajat tiedossa → laske nukuttu aika (käytetään samaa funktiota)
      const noteSleepHours = computeWeekdaySleepHours(
        bedTimeWeekdays,
        wakeTimeWeekdays,
      );

      if (typeof noteSleepHours === "number") {
        if (
          // Keskimäärin nukuttua tuntimäärää ei voida luotettavasti laskea mikäli ilmoitettu heräämis tai nukahtamisaika on asteikon ulkopuolella
          wakeTimeWeekdays.before0500 !== true &&
          wakeTimeWeekdays.after1000 !== true &&
          bedTimeWeekdays.before20 !== true &&
          bedTimeWeekdays.after0200 !== true
        ) {
          pushS(
            "Nukkuu keskimäärin arkisin " +
              noteSleepHours.toFixed(0) +
              " tuntia yössä.",
          );
        }
      }
    })();

    // 69. Unihäiriöt
    if (hasSleepProblems.yes) {
      pushS("Unihäiriöitä (esim. nukahtamisvaikeus tai yöheräily).");
    } else if (hasSleepProblems.no) {
      pushS("Ei unihäiriöitä.");
    } else {
      missingHabits.push("Unihäiriöt (kyllä/ei)");
    }

    out.push(h3("Paino, ravinto, liikunta"));

    // 70–73. Paino/pituus/liikunta
    if (weightOpinion) {
      const wPairs = [
        [weightOpinion.tooThin, "Kokee olevansa liian laiha."],
        [weightOpinion.slightlyThin, "Kokee olevansa hieman liian laiha."],
        [weightOpinion.normal, "Kokee olevansa sopivan painoinen."],
        [
          weightOpinion.slightlyOverweight,
          "Kokee olevansa hieman ylipainoinen.",
        ],
        [weightOpinion.tooFat, "Kokee olevansa liian lihava."],
      ];
      if (checkAliasList(wPairs)) {
        pushS(createPhraseAliases(wPairs));
      } else {
        missingHabits.push("Kokemus omasta painosta");
      }
    } else {
      missingHabits.push("Kokemus omasta painosta");
    }

    // Paino
    let parsedWeight = null;

    if (typeof weightKg === "number" && Number.isFinite(weightKg)) {
      parsedWeight = weightKg;
    } else if (typeof weightKg === "string") {
      const trimmed = weightKg.trim().replace(",", "."); // salli pilkku desimaalierottimena
      const num = Number(trimmed);

      if (Number.isFinite(num)) {
        parsedWeight = num;
      }
    }

    if (parsedWeight !== null) {
      pushS("Vastaajan ilmoittama paino: " + parsedWeight + " kg.");
    } else {
      missingHabits.push("Paino");
    }

    // Pituus
    let parsedHeight = null;

    if (typeof height === "number" && Number.isFinite(height)) {
      parsedHeight = height;
    } else if (typeof height === "string") {
      const trimmed = height.trim().replace(",", ".");
      const num = Number(trimmed);

      if (Number.isFinite(num)) {
        parsedHeight = num;
      }
    }

    if (parsedHeight !== null) {
      pushS("Vastaajan ilmoittama pituus: " + parsedHeight + " cm.");
    } else {
      missingHabits.push("Pituus");
    }

    // BMI (näytetään vain jos laskettu aikaisemmin)
    if (typeof bmi === "number" && !isNaN(bmi)) {
      pushS(
        "Vastaajan ilmoittamien tietojen perusteella laskettu BMI: " +
          bmi.toFixed(1) +
          ".",
      );
    }

    // Liikunta
    if (
      typeof exerciseHoursPerWeek === "number" &&
      !isNaN(exerciseHoursPerWeek)
    ) {
      pushS(
        "Liikunta (hengästyttävä), viikoittain: " +
          exerciseHoursPerWeek +
          " h.",
      );
    } else if (
      typeof exerciseHoursPerWeek === "string" &&
      exerciseHoursPerWeek.trim() !== ""
    ) {
      pushS(
        "Liikunta (hengästyttävä), viikoittain: " +
          exerciseHoursPerWeek.trim() +
          " h.",
      );
    } else {
      missingHabits.push("Liikunta (hengästyttävä), viikoittain");
    }

    // 74. Ruokavalio
    if (dietHealthiness) {
      const dPairs = [
        [
          dietHealthiness.unhealthy,
          "Arvioi ruokavalionsa olevan epäterveellinen.",
        ],
        [
          dietHealthiness.somewhatUnhealthy,
          "Arvioi ruokavalionsa olevan jonkin verran epäterveellinen.",
        ],
        [
          dietHealthiness.mostlyHealthy,
          "Arvioi ruokavalionsa olevan pääosin terveellinen.",
        ],
      ];
      if (checkAliasList(dPairs)) {
        pushS(createPhraseAliases(dPairs));
      } else {
        missingHabits.push("Oma arvio ruokavalion terveellisyydestä");
      }
    } else {
      missingHabits.push("Oma arvio ruokavalion terveellisyydestä");
    }
    out.push(h3("Suun terveys"));
    // 75–79. Suun terveys
    if (hasDentalIssues.yes === true)
      pushS("Suun terveyteen liittyviä oireita tai ongelmia.");
    else if (hasDentalIssues.no === true)
      pushS("Ei suun terveyteen liittyviä oireita tai ongelmia.");
    else missingHabits.push("Suun terveyden oireet/ongelmat (kyllä/ei)");

    if (lastDentalCheck) {
      const dcPairs = [
        [lastDentalCheck.under2y, "alle 2 vuotta sitten"],
        [lastDentalCheck.y2to4, "2–4 vuotta sitten"],
        [lastDentalCheck.over4y, "yli 4 vuotta sitten"],
      ];
      if (checkAliasList(dcPairs)) {
        pushS(
          "Viimeisin hammastarkastus: " + createPhraseAliases(dcPairs) + ".",
        );
      } else {
        missingHabits.push("Viimeisimmän hammastarkastuksen ajankohta");
      }
    } else {
      missingHabits.push("Viimeisimmän hammastarkastuksen ajankohta");
    }

    if (toothBrushing) {
      const tbPairs = [
        [toothBrushing.twiceDaily, "vähintään 2 kertaa päivässä"],
        [toothBrushing.onceDaily, "kerran päivässä"],
        [toothBrushing.lessOften, "harvemmin kuin kerran päivässä"],
      ];
      if (checkAliasList(tbPairs)) {
        pushS(
          "Hampaiden harjaus fluorihammastahnalla: " +
            createPhraseAliases(tbPairs) +
            ".",
        );
      } else {
        missingHabits.push("Hampaiden harjaustiheys");
      }
    } else {
      missingHabits.push("Hampaiden harjaustiheys");
    }
    out.push(h3("Päihteet ja ruutuaika"));
    // 80. Ruutuajan/netin haitta
    // Ruutuajan määrä tunteina / vrk
    let rawScreenTime = "";

    if (screenTimeHoursPerDay !== undefined && screenTimeHoursPerDay !== null) {
      rawScreenTime = screenTimeHoursPerDay.toString().trim();
    }

    if (rawScreenTime !== "" && /^[0-9]+([.,][0-9]+)?$/.test(rawScreenTime)) {
      const num = Number(rawScreenTime.replace(",", "."));
      pushS(
        "Ruutuaikaa netissä, somessa, ruudun ääressä tai pelatessa keskimäärin: " +
          num +
          " tuntia päivässä.",
      );
    } else {
      missingHabits.push(
        "Ruutuajan määrä (tuntia päivässä netissä/somessa/ruudun ääressä/pelatessa)",
      );
    }

    if (screenTimeHarm) {
      const stPairs = [
        [screenTimeHarm.no, "ei koe haittaa"],
        [screenTimeHarm.sometimes, "kokee joskus haittaa"],
        [screenTimeHarm.often, "kokee usein haittaa"],
      ];
      if (checkAliasList(stPairs)) {
        pushS(
          "Ruutuajan tai netinkäytön vaikutus arkeen: " +
            createPhraseAliases(stPairs) +
            ".",
        );
      } else {
        missingHabits.push("Ruutuajan/netinkäytön vaikutus arkeen");
      }
    } else {
      missingHabits.push("Ruutuajan/netinkäytön vaikutus arkeen");
    }

    // 81–87. Nikotiini
    if (usesAnyNicotine.yes === true)
      pushS("Käyttää tai on käyttänyt tupakka- tai nikotiinituotteita.");
    else if (usesAnyNicotine.no === true)
      pushS("Ei käytä eikä ole käyttänyt tupakka- tai nikotiinituotteita.");
    else
      missingHabits.push("Tupakka- tai nikotiinituotteiden käyttö (kyllä/ei)");

    if (usesAnyNicotine.yes) {
      const tobPairs = [
        [tobaccoUse.none, "ei käytä tupakkaa"],
        [tobaccoUse.tried, "kokeillut tupakkaa"],
        [tobaccoUse.occasional, "tupakoi satunnaisesti"],
        [tobaccoUse.daily, "tupakoi päivittäin"],
        [tobaccoUse.quit, "lopettanut tupakoinnin"],
      ];
      pushS(listSentence(tobPairs, "Tupakka: ", "Tupakka: ei vastausta."));
      const snPairs = [
        [snusUse.none, "ei käytä nuuskaa"],
        [snusUse.tried, "kokeillut nuuskaa"],
        [snusUse.occasional, "käyttää nuuskaa satunnaisesti"],
        [snusUse.daily, "käyttää nuuskaa päivittäin"],
        [snusUse.quit, "lopettanut nuuskan käytön"],
      ];
      pushS(listSentence(snPairs, "Nuuska: ", "Nuuska: ei vastausta."));
      const npPairs = [
        [nicotinePouchUse.none, "ei käytä nikotiinipusseja"],
        [nicotinePouchUse.tried, "kokeillut nikotiinipusseja"],
        [nicotinePouchUse.occasional, "käyttää nikotiinipusseja satunnaisesti"],
        [nicotinePouchUse.daily, "käyttää nikotiinipusseja päivittäin"],
        [nicotinePouchUse.quit, "lopettanut nikotiinipussien käytön"],
      ];
      pushS(
        listSentence(
          npPairs,
          "Nikotiinipussit: ",
          "Nikotiinipussit: ei vastausta.",
        ),
      );
      const vpPairs = [
        [vapeUse.none, "ei käytä sähkösavukkeita"],
        [vapeUse.occasional, "käyttää sähkösavuketta satunnaisesti"],
        [vapeUse.daily, "käyttää sähkösavuketta päivittäin"],
        [vapeUse.tried, "kokeillut sähkösavukkeita"],
        [vapeUse.quit, "lopettanut sähkösavukkeen käytön"],
      ];
      pushS(
        listSentence(
          vpPairs,
          "Sähkötupakka/vape: ",
          "Sähkötupakka/vape: ei vastausta.",
        ),
      );

      const otherPairs = [
        [otherUse.none, "ei käytä muita nikotiinituotteita"],
        [otherUse.tried, "kokeillut muita nikotiinituotteita"],
        [otherUse.occasional, "käyttää muita nikotiinituotteita satunnaisesti"],
        [otherUse.daily, "käyttää muita nikotiinituotteita päivittäin"],
        [otherUse.quit, "lopettanut muiden nikotiinituotteiden käytön"],
      ];
      pushS(
        listSentence(
          otherPairs,
          "Muut nikotiinituotteet: ",
          "Muut nikotiinituotteet: ei vastausta.",
        ),
      );

      if (
        otherUse.tried === true ||
        otherUse.occasional === true ||
        otherUse.daily === true ||
        otherUse.quit === true
      ) {
        pushS("Muu tuote: " + textOrMissing(otherNicotineProductText) + ".");
      }
    }

    // 88–91. Alkoholi + AUDIT
    if (usesAlcohol.yes) {
      pushS("Käyttää alkoholia.");

      // AUDIT 1 – käyttötiheys
      const hasQ1Answer =
        auditQ1 &&
        (auditQ1.never ||
          auditQ1.monthlyOrLess ||
          auditQ1.twoToFourPerMonth ||
          auditQ1.twoToThreePerWeek ||
          auditQ1.fourOrMorePerWeek);

      if (hasQ1Answer) {
        const a1 = auditQ1.never
          ? "ei käytä alkoholia koskaan"
          : auditQ1.monthlyOrLess
            ? "noin kerran kuukaudessa tai harvemmin"
            : auditQ1.twoToFourPerMonth
              ? "2–4 kertaa kuukaudessa"
              : auditQ1.twoToThreePerWeek
                ? "2–3 kertaa viikossa"
                : "neljä kertaa viikossa tai useammin";

        pushS("Alkoholin käyttötiheys: " + a1 + ".");
      } else {
        missingHabits.push("AUDIT-kysymys 1: alkoholin käyttötiheys");
      }

      // AUDIT 2 – annosmäärä käyttöpäivinä
      const hasQ2Answer =
        auditQ2 &&
        (auditQ2.oneToTwo ||
          auditQ2.threeToFour ||
          auditQ2.fiveToSix ||
          auditQ2.sevenToNine ||
          auditQ2.tenOrMore);

      if (hasQ2Answer) {
        const a2 = auditQ2.oneToTwo
          ? "1–2 annosta"
          : auditQ2.threeToFour
            ? "3–4 annosta"
            : auditQ2.fiveToSix
              ? "5–6 annosta"
              : auditQ2.sevenToNine
                ? "7–9 annosta"
                : "10 annosta tai enemmän";

        pushS("Tavallinen alkoholiannosten määrä käyttöpäivinä: " + a2 + ".");
      } else {
        missingHabits.push(
          "AUDIT-kysymys 2: alkoholiannosten määrä käyttöpäivinä",
        );
      }

      // AUDIT 3 – humalahakuisuus
      const hasQ3Answer =
        auditQ3 &&
        (auditQ3.never ||
          auditQ3.lessThanMonthly ||
          auditQ3.monthly ||
          auditQ3.weekly ||
          auditQ3.dailyOrAlmost);

      if (hasQ3Answer) {
        const a3 = auditQ3.never
          ? "ei koskaan"
          : auditQ3.lessThanMonthly
            ? "harvemmin kuin kerran kuukaudessa"
            : auditQ3.monthly
              ? "kerran kuukaudessa"
              : auditQ3.weekly
                ? "kerran viikossa"
                : "päivittäin tai lähes päivittäin";

        pushS("Kerralla runsaasti (≥6 annosta) juominen: " + a3 + ".");
      } else {
        missingHabits.push(
          "AUDIT-kysymys 3: kerralla kuusi tai useampia annoksia",
        );
      }
    } else if (usesAlcohol.no) {
      pushS("Ei käytä alkoholia.");
    } else {
      missingHabits.push("Alkoholinkäyttö (kyllä/ei)");
    }

    // Tulostetaan AUDIT-pisteet vain jos kaikkiin kolmeen kysymykseen on vastattu
    if (
      (auditQ1.never ||
        auditQ1.monthlyOrLess ||
        auditQ1.twoToFourPerMonth ||
        auditQ1.twoToThreePerWeek ||
        auditQ1.fourOrMorePerWeek) &&
      (auditQ2.oneToTwo ||
        auditQ2.threeToFour ||
        auditQ2.fiveToSix ||
        auditQ2.sevenToNine ||
        auditQ2.tenOrMore) &&
      (auditQ3.never ||
        auditQ3.lessThanMonthly ||
        auditQ3.monthly ||
        auditQ3.weekly ||
        auditQ3.dailyOrAlmost)
    ) {
      pushS("AUDIT-C pisteet: " + auditCTotal + ".");
    }

    // 92–93. Huumausaineet
    if (usesDrugs.yes)
      pushS(
        "Käyttää kannabista tai muuta huumetta/lääkettä päihtymistarkoituksessa.",
      );
    else if (usesDrugs.no)
      pushS("Ei käytä huumausaineita tai lääkkeitä päihtymistarkoituksessa.");
    else missingHabits.push("Huumausaineiden käyttö (kyllä/ei)");
    if (usesDrugs.yes) {
      const df = drugsFrequency.tried
        ? "kokeillut"
        : drugsFrequency.occasionally
          ? "satunnaisesti"
          : drugsFrequency.regularly
            ? "säännöllisesti"
            : undefined;
      pushS("Käytön tiheys: " + (df || "ei vastannut") + ".");
    }

    // Terveystottumukset – puuttuvat
    pushMissingList("Terveystottumukset", missingHabits);

    /* ---------------- Ihmissuhteet ja kuormitustekijät ---------------- */
    out.push(h2("Ihmissuhteet ja kuormitustekijät"));
    const missingRelationships = [];

    // Kokeeko yksinäisyyttä (kappale)
    if (feelsLonely.yes) {
      pushS("Vastaaja kokee itsensä yksinäiseksi.");
    } else if (feelsLonely.no) {
      pushS("Vastaaja ei koe itseään yksinäiseksi.");
    } else {
      missingRelationships.push("Kokeeko itsensä yksinäiseksi");
    }

    // Onko luotettava keskustelukumppani (kappale)
    if (hasSomeoneToTalk.yes) {
      pushS(
        "Vastaajalla on henkilö, jonka kanssa puhua mieltä painavista asioista.",
      );
    } else if (hasSomeoneToTalk.no) {
      pushS(
        "Vastaajalla ei ole henkilöä, jonka kanssa puhua mieltä painavista asioista.",
      );
    } else {
      missingRelationships.push(
        "Onko henkilöä, jonka kanssa puhua mieltä painavista asioista",
      );
    }

    // Poista yksi ylimääräinen rivinvaihto viimeisestä elementistä
    out[out.length - 1] = out[out.length - 1].replace(/\n\n$/, "\n");

    // Kolmiportaiset kysymykset (none / last6mo / earlier)
    function normalizeTri(obj, labelBase, labelNone) {
      if (!obj) return { label: labelBase, status: "noAnswer" };
      if (obj.last6mo)
        return { label: labelBase, status: "has", timeframe: "last6mo" };
      if (obj.earlier)
        return { label: labelBase, status: "has", timeframe: "earlier" };
      if (obj.none) return { label: labelNone, status: "none" };
      return { label: labelBase, status: "noAnswer" };
    }

    // Muotoilu Markdownina
    function formatFinding(f) {
      if (f.status === "has" && f.timeframe === "last6mo")
        return `- ${f.label} (viimeisen 6 kk aikana)`;
      if (f.status === "has" && f.timeframe === "earlier")
        return `- ${f.label} (aiemmin, ei viimeisen 6 kk aikana)`;
      if (f.status === "none") return `- ${f.label}`;
      if (f.status === "noAnswer") return `- ${f.label}`;
      return `- ${f.label}`;
    }

    // Koottavat tiedot (HUOM: EI sisällä kahta ensimmäistä, ne on jo kappaleena yllä)
    const data = [
      normalizeTri(bullying, "Kiusaamista", "Ei kiusaamista"),
      normalizeTri(
        harassment,
        "Seksuaalista häirintää tai painostusta",
        "Ei seksuaalista häirintää tai painostusta",
      ),
      normalizeTri(
        partnerViolence,
        "Fyysistä tai henkistä väkivaltaa seurustelusuhteessa",
        "Ei fyysistä tai henkistä väkivaltaa seurustelusuhteessa",
      ),
      normalizeTri(
        familyViolence,
        "Fyysistä tai henkistä väkivaltaa perheenjäsenten välillä",
        "Ei fyysistä tai henkistä väkivaltaa perheenjäsenten välillä",
      ),
      normalizeTri(
        otherViolence,
        "Fyysistä tai henkistä väkivaltaa muussa yhteydessä",
        "Ei fyysistä tai henkistä väkivaltaa muussa yhteydessä",
      ),
      normalizeTri(
        seriousIllnessOrDeathCloseOne,
        "Läheisen vakavaa sairautta tai kuolemaa",
        "Ei läheisen vakavaa sairautta tai kuolemaa",
      ),
      normalizeTri(
        closeOneSubstanceIssues,
        "Läheisen ongelmallista päihteiden käyttöä",
        "Ei läheisen ongelmallista päihteiden käyttöä",
      ),
    ];

    // Ryhmittely listaksi
    const hasList = data.filter((f) => f.status === "has").map(formatFinding);
    const noneList = data.filter((f) => f.status === "none").map(formatFinding);
    let noAnswerList = data
      .filter((f) => f.status === "noAnswer")
      .map(formatFinding);

    // Lisää kappaleen kahden ensimmäisen kysymyksen mahdolliset “puuttuu”-merkinnät noAnswer-listaan
    noAnswerList = noAnswerList.concat(
      missingRelationships.map((q) => `- ${q}`),
    );

    // Tulostus Markdownina
    if (hasList.length) {
      out.push(
        "\n### Opiskelija ilmoittaa seuraavat tekijät:\n" + hasList.join("\n"),
      );
    }
    if (noneList.length) {
      out.push(
        "\n### Opiskelija ilmoittaa, ettei hänellä ole seuraavia tekijöitä:\n" +
          noneList.join("\n"),
      );
    }
    if (noAnswerList.length) {
      out.push(
        "\n\n**Ihmissuhteet ja kuormitustekijät – näihin kysymyksiin ei vastattu:**\n" +
          noAnswerList.join("\n"),
      );
    }

    /* ---------------- Lopuksi ---------------- */
    out.push(h2("Lopuksi"));
    const missingFinal = [];

    // 107. Tyytyväisyys
    if (typeof satisfactionText === "string" && satisfactionText.trim()) {
      pushS(
        "Tällä hetkellä tyytyväinen seuraaviin asioihin: " +
          satisfactionText.trim() +
          ".",
      );
    } else {
      missingFinal.push("Tämänhetkiset tyytyväisyyden kohteet");
    }

    // 108. Toive nopeasta vastaanotosta
    if (wantsFastNurseCheck.yes)
      pushS("Toivoo vastaanottoa mahdollisimman pian.");
    else if (wantsFastNurseCheck.no)
      pushS("Ei koe tarvetta mahdollisimman pikaiseen vastaanottoon.");
    else missingFinal.push("Vastaanoton kiireellisyystoive");

    // 94–95. Keskustelutarpeet
    if (wantsTalkGenderIdentity.yes)
      pushS(
        "Haluaa keskustella seksuaalisesta suuntautumisesta tai sukupuoli-identiteetistä.",
      );
    else if (wantsTalkGenderIdentity.no)
      pushS(
        "Ei koe tarvetta keskustella seksuaalisesta suuntautumisesta tai sukupuoli-identiteetistä.",
      );
    else
      missingFinal.push(
        "Keskustelutarve: seksuaalinen suuntautuminen/sukupuoli-identiteetti",
      );

    if (wantsTalkContraceptionSti.yes)
      pushS("Haluaa keskustella ehkäisystä tai seksitaudeista.");
    else if (wantsTalkContraceptionSti.no)
      pushS("Ei koe tarvetta keskustella ehkäisystä tai seksitaudeista.");
    else missingFinal.push("Keskustelutarve: ehkäisy/seksitaudit");

    // 109–110. Muu asia + tarkennus
    if (hasOtherIssueForCheck.yes === true) {
      pushS(
        "Ilmoittaa, että on muu terveyteen tai hyvinvointiin liittyvä asia, josta haluaisi keskustella terveystarkastuksessa.",
      );
      if (typeof otherIssueText === "string" && otherIssueText.trim()) {
        pushS("Vastaajan kuvaus asiasta: " + otherIssueText.trim() + ".");
      } else {
        // tarkennus puuttuu
        missingFinal.push("Muu asia – tarkennus");
      }
    } else if (hasOtherIssueForCheck.no === true) {
      pushS(
        "Ei ilmoita muita asioita, joista haluaisi keskustella terveystarkastuksessa.",
      );
    } else {
      // ei vastausta kyllä/ei -kysymykseen
      missingFinal.push("Muu asia terveystarkastuksessa (kyllä/ei)");
    }

    // Lopuksi – puuttuvat
    pushMissingList("Lopuksi", missingFinal);

    return out.join("");
  }

  // MUUT PLACEHOLDERIN TILALLE GENEROITUVAT TEKSTIT

  function buildUrgencyText(
    urgencyNumber,
    redRiskConditions,
    yellowRiskConditions,
  ) {
    switch (urgencyNumber) {
      case 1:
        return [
          "## Merkittävä riskitekijä",
          `Kyselyn vastausten perusteella opiskelija on sijoitettu korkeimman prioriteetin (1/5) ryhmään. Syy: ${createPhraseAliases(
            redRiskConditions,
          )}. Opiskelijalla on merkittäviä terveydellisiä riskejä tai tarve päästä tarkastukseen nopeasti, ja hänen tilanteensa tulee arvioida ensimmäisen ryhmän prioriteetin mukaisesti.`,
        ].join("\n\n");

      case 2:
        return [
          "## Merkittävä riskitekijä",
          `Kyselyn vastausten perusteella opiskelija on sijoitettu toiseksi korkeimman prioriteetin (2/5) ryhmään. Syy: ${createPhraseAliases(
            redRiskConditions,
          )}. Opiskelijalla on merkittäviä terveydellisiä huolia tai riskejä, ja hänen tilanteensa tulee arvioida ryhmän kaksi prioriteetin mukaisesti.`,
        ].join("\n\n");

      case 3:
        return [
          "## Usea kohtalainen riskitekijä",
          `Kyselyn vastausten perusteella opiskelija on sijoitettu kolmanneksi korkeimman prioriteetin (3/5) ryhmään. Syy: ${createPhraseAliases(
            yellowRiskConditions,
          )}. Opiskelijan tilanne tulee arvioida kolmannen ryhmän prioriteetin mukaisesti.`,
        ].join("\n\n");

      case 4:
        return [
          "## Yksittäinen kohtalainen riskitekijä",
          `Kyselyn vastausten perusteella opiskelija on sijoitettu neljänneksi korkeimman prioriteetin (4/5) ryhmään. Syy: ${createPhraseAliases(
            yellowRiskConditions,
          )}. Opiskelijan tilanne tulee arvioida neljännen ryhmän prioriteetin mukaisesti.`,
        ].join("\n\n");

      case 5:
        return [
          "## Matala prioriteetti",
          "Kyselyn vastausten perusteella opiskelija on sijoitettu matalimman prioriteetin (5/5) ryhmään. Opiskelija ei ilmoittanut merkittäviä terveydellisiä riskejä. Opiskelijan tilanne voidaan arvioida viidennen ryhmän prioriteetin mukaisesti. ",
        ].join("\n\n");

      default:
        return [
          "## Virhe arvioitaessa prioriteettia",
          "Valitettavasti kysely ei pystynyt antamaan oppilaan tilanteeseen sopivaa ohjeistusta valittujen vastausten perusteella. Kyselyn sisältö tulee käydä ammattilaisen toimesta läpi.",
        ].join("\n\n");
    }
  }

  // SUUN TERVEYDENHUOLLON MUISTUTE OPISKELIJALLE

  // Kokoa dynaaminen tekstisisältö
  let strDentalPhraseAlias = "";
  {
    const parts = [];

    if (language === "sv") {
      // --- Svenska ---
      // Symptom/problem
      if (hasDentalIssues && hasDentalIssues.yes === true) {
        parts.push(
          "Du svarade att du har symtom och problem med anknytning till tand- eller munhälsan. Om ditt munsymtom ännu inte har bedömts eller om det har förvärrats efter den föregående bedömningen ska du utan dröjsmål kontakta mun- och tandvården i ditt välfärdsområde.",
        );
      }

      // Senaste tandkontroll
      if (lastDentalCheck && lastDentalCheck.over4y) {
        parts.push(
          `<p>Du svarade att det har gått fyra år eller längre sedan din senaste tandkontroll. Boka tid för en munhälsoundersökning under det första studieåret.</p>`,
        );
      } else if (lastDentalCheck && lastDentalCheck.y2to4) {
        parts.push(
          `<p>Du svarade att din föregående tandkontroll var för 2–4 år sedan. Boka tid för en munhälsoundersökning under det andra studieåret.</p>`,
        );
      } else if (lastDentalCheck && lastDentalCheck.under2y) {
        parts.push(
          `<p>Du svarade att din föregående tandkontroll var för mindre än två år sedan. Boka tid för en munhälsoundersökning under det tredje studieåret.</p>`,
        );
      } else {
        parts.push(
          `<p>Du svarade inte på frågan om tidpunkten för din senaste tandkontroll. Boka tid för en munhälsoundersökning under dina studier.</p>`,
        );
      }

      strDentalPhraseAlias = parts.join("\n\n");
    } else if (language === "en") {
      // --- English ---
      // Symptoms/problems
      if (hasDentalIssues && hasDentalIssues.yes === true) {
        parts.push(
          "You indicated that you have symptoms or problems related to your teeth or mouth. If your symptoms have not yet been assessed, or if they have worsened since your last evaluation, please contact your wellbeing services county’s oral health care without delay.",
        );
      }

      // Last dental check-up
      if (lastDentalCheck && lastDentalCheck.over4y) {
        parts.push(
          `<p>You answered that your last dental check-up was four years ago or earlier. Please book a dental examination during your first year of studies.</p>`,
        );
      } else if (lastDentalCheck && lastDentalCheck.y2to4) {
        parts.push(
          `<p>You answered that your last dental check-up was 2–4 years ago. Please book a dental examination during your second year of studies.</p>`,
        );
      } else if (lastDentalCheck && lastDentalCheck.under2y) {
        parts.push(
          `<p>You answered that your last dental check-up was less than two years ago. Please book a dental examination during your third year of studies.</p>`,
        );
      } else {
        parts.push(
          `<p>You did not answer the question about when your last dental check-up was. Please book a dental examination during your studies.</p>`,
        );
      }

      strDentalPhraseAlias = parts.join("\n\n");
    } else {
      // --- Suomi (oletus) ---
      // Oireet/ongelmat – näytetään vain jos hasDentalIssues.yes
      if (hasDentalIssues && hasDentalIssues.yes === true) {
        parts.push(
          "Vastasit, että sinulla on hampaiden ja suun terveyteen liittyviä oireita ja ongelmia. Mikäli suun oirettasi ei ole vielä arvioitu tai se on edellisen arvion jälkeen pahentunut, ota viipymättä yhteyttä hyvinvointialueesi suunterveydenhuoltoon.",
        );
      }

      // Viimeisin tarkastus – aina yksi seuraavista (tai oletus jos ei vastattu)
      if (lastDentalCheck && lastDentalCheck.over4y) {
        parts.push(
          `<p>Vastasit, että edellisestä hammastarkastuksestasi on kulunut neljä vuotta tai kauemmin. Varaa aika suun terveystarkastukseen ensimmäisenä opiskeluvuonna.</p>`,
        );
      } else if (lastDentalCheck && lastDentalCheck.y2to4) {
        parts.push(
          `<p>Vastasit, että edellinen hammastarkastuksesi on ollut 2–4 vuotta sitten. Varaa aika suun terveystarkastukseen toisena opiskeluvuonna.</p>`,
        );
      } else if (lastDentalCheck && lastDentalCheck.under2y) {
        parts.push(
          `<p>Vastasit, että edellisen hammastarkastuksesi on ollut alle kaksi vuotta sitten. Varaa aika suun terveystarkastukseen kolmantena opiskeluvuonna.</p>`,
        );
      } else {
        parts.push(
          `<p>Et vastannut kysymykseen edellisen hammastarkastuksesi ajankohdasta. Varaa aika suun terveystarkastukseen opiskelujesi aikana.</p>`,
        );
      }

      strDentalPhraseAlias = parts.join("\n\n");
    }
  }

  // DECISION LOGIC - BEGINS HERE

  // #1 - Red - High Priority
  if (
    // Ahdistuneisuus - ei hoidossa (tai ei vastattu että hoidossa)
    (anxietySeverityPoints >= 3 &&
      (anxietyInTreatment.no === true ||
        (!anxietyInTreatment.yes && !anxietyInTreatment.no))) ||
    //Matala mieliala - ei hoitokontaktia ilmoitettu
    //Huom. sisällytetty myös masentuneisuus seulonta kysymys itsessään punaiseksi riskiksi
    (lowMoodOften.yes &&
      (depressionInTreatment.no === true ||
        (!depressionInTreatment.yes && !depressionInTreatment.no))) ||
    //Masennus oire - ei hoitokontaktia ilmoitettu
    (lowInterestOften.yes &&
      (lowInterestInTreatment.no === true ||
        (!lowInterestInTreatment.yes && !lowInterestInTreatment.no))) ||
    // Syömishäiriö epäily - ei hoitokontaktia ilmoitettu
    // Huom., pelkkä eatingIssue && !eatingIssueInTreatment johtaa keltaiseen riskiin
    (suspectedEatingDisorder.yes &&
      (eatingIssueInTreatment.no === true ||
        (!eatingIssueInTreatment.yes && !eatingIssueInTreatment.no))) ||
    //Huumeiden käyttö (ei pelkkä kokeilu)
    (usesDrugs.yes &&
      (drugsFrequency.occasionally || drugsFrequency.regularly)) ||
    // Kaksi punaista riskiä tai enemmän
    redRiskCount >= 2 ||
    //Opiskelija toivoo itse nopeaa hoitoa
    wantsFastNurseCheck.yes
  ) {
    // #1 - Red - High Priority
    let strFinalPhraseAlias =
      buildUrgencyText(1, redRiskConditions, yellowRiskConditions) +
      buildOTHNote();
    libEBMEDS.createScriptRecommendation("scr05133", 1, 1);
    // Create summary text for professional
    libEBMEDS.createScriptRecommendation("scr05133", 8, 0, strFinalPhraseAlias);
    // Create reminder to guide user to dental check/dental care
    libEBMEDS.createScriptRecommendation(
      "scr05133",
      9,
      0,
      strDentalPhraseAlias,
    );

    //#2 - Red - Priority
  } else if (redRiskCount >= 1) {
    let strFinalPhraseAlias =
      buildUrgencyText(2, redRiskConditions, yellowRiskConditions) +
      buildOTHNote();
    libEBMEDS.createScriptRecommendation("scr05133", 2, 1);
    // Create summary text for professional
    libEBMEDS.createScriptRecommendation("scr05133", 8, 0, strFinalPhraseAlias);
    // Create reminder to guide user to dental check/dental care
    libEBMEDS.createScriptRecommendation(
      "scr05133",
      9,
      0,
      strDentalPhraseAlias,
    );

    //#3 - Yellow - Many risks
  } else if (yellowRiskCount >= 2) {
    let strFinalPhraseAlias =
      buildUrgencyText(3, redRiskConditions, yellowRiskConditions) +
      buildOTHNote();
    libEBMEDS.createScriptRecommendation("scr05133", 3, 0);
    // Create summary text for professional
    libEBMEDS.createScriptRecommendation("scr05133", 8, 0, strFinalPhraseAlias);
    // Create reminder to guide user to dental check/dental care
    libEBMEDS.createScriptRecommendation(
      "scr05133",
      9,
      0,
      strDentalPhraseAlias,
    );

    // #4 - Yellow - One risk
  } else if (yellowRiskCount >= 1) {
    let strFinalPhraseAlias =
      buildUrgencyText(4, redRiskConditions, yellowRiskConditions) +
      buildOTHNote();
    libEBMEDS.createScriptRecommendation("scr05133", 4, 0);
    // Create summary text for professional
    libEBMEDS.createScriptRecommendation("scr05133", 8, 0, strFinalPhraseAlias);
    // Create reminder to guide user to dental check/dental care
    libEBMEDS.createScriptRecommendation(
      "scr05133",
      9,
      0,
      strDentalPhraseAlias,
    );
  }
  // #5 - Green
  else if (yellowRiskCount === 0 && redRiskCount === 0) {
    let strFinalPhraseAlias =
      buildUrgencyText(5, redRiskConditions, yellowRiskConditions) +
      buildOTHNote();
    libEBMEDS.createScriptRecommendation("scr05133", 5, 0);
    // Create summary text for professional
    libEBMEDS.createScriptRecommendation("scr05133", 8, 0, strFinalPhraseAlias);
    // Create reminder to guide user to dental check/dental care
    libEBMEDS.createScriptRecommendation(
      "scr05133",
      9,
      0,
      strDentalPhraseAlias,
    );
  }
  // 9. - FAILSAFE
  else {
    let strFinalPhraseAlias =
      buildUrgencyText(null, redRiskConditions, yellowRiskConditions) +
      buildOTHNote();
    libEBMEDS.createScriptRecommendation("scr05133", 6, 1);
    // Create summary text for professiona.
    libEBMEDS.createScriptRecommendation("scr05133", 8, 0, strFinalPhraseAlias);
    // Create reminder to guide user to dental check/dental care
    libEBMEDS.createScriptRecommendation(
      "scr05133",
      9,
      0,
      strDentalPhraseAlias,
    );
  }

  //#10 - Additional reminder: Need to discuss STDs or prevention
  if (wantsTalkContraceptionSti.yes) {
    libEBMEDS.createScriptRecommendation("scr05133", 10, 0);
  }
}
