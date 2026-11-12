// Curriculum for the German C2 tutor: units, grammar nodes, tracks and production tasks.
// Unit and node IDs match plan v3 (Appendix B), the Anki tags and the error log.
"use strict";
window.GT = window.GT || {};
GT.sets = GT.sets || {};
// A set belongs to a unit, or to a thread that runs through all units (thread "G" → GT.sets.threadG).
GT.addSet = function (set) { GT.sets[set.thread ? "thread" + set.thread : String(set.unit)] = set; };

// Exercise set files in data/. Add a file here when Claude Code writes a new unit.
GT.BANK_FILES = ["unit01.js", "unit02.js", "unit03.js", "threadG.js"];

GT.NODES = {
  F1: "Tenses: Perfekt, Präteritum, Plusquamperfekt",
  F2: "Modal verbs",
  F3: "Separable, inseparable and reflexive verbs",
  F4: "Subordinate clauses and indirect questions",
  F5: "Comparison and adjective basics",
  N01: "Verb position and sentence bracket",
  N02: "Middle-field order (TeKaMoLo)",
  N03: "Article and adjective declension",
  N04: "n-declension",
  N05: "Genitive and two-way prepositions",
  N06: "Verbs with fixed prepositions, da-/wo- compounds",
  N07: "Konjunktiv II",
  N08: "Passive (process, state, modal, impersonal, double infinitive)",
  N09: "Relative clauses",
  N10: "Infinitive clauses",
  N11: "Connector types and their word order",
  N12: "Two-part connectors",
  N13: "Nominalisation",
  N14: "Verbalisation",
  N15: "Nouns with fixed prepositions, genitive attributes",
  N16: "Funktionsverbgefüge",
  N17: "Extended participle attributes",
  N18: "Gerundive",
  N19: "Konjunktiv I and reported speech",
  N20: "Reporting verbs, laut/zufolge",
  N21: "Alternatives to the passive",
  N22: "Modal verbs of assumption and hearsay, future perfect",
  N23: "Modal particles",
  N24: "Advanced connectors",
  N25: "Word order for emphasis and negation",
  N26: "Genitive verbs and adjectives",
  N27: "Separable and inseparable prefix verbs",
  N28: "Suffixes and compounds",
  N29: "Register shift",
  N30: "Collocations and idioms",
  N31: "Shades of meaning",
  N32: "Cohesion and reference"
};

GT.UNITS = [
  { id: "F1", block: "F", level: "B1", nodes: ["F1"], name: "Tenses: Perfekt vs. Präteritum, Plusquamperfekt" },
  { id: "F2", block: "F", level: "B1", nodes: ["F2"], name: "Modal verbs, including past and subordinate clauses" },
  { id: "F3", block: "F", level: "B1", nodes: ["F3"], name: "Separable, inseparable and reflexive verbs" },
  { id: "F4", block: "F", level: "B1", nodes: ["F4"], name: "Subordinate clauses and indirect questions" },
  { id: "F5", block: "F", level: "B1", nodes: ["F5"], name: "Comparison and adjective basics" },
  { id: "1", block: "B2", level: "B2", nodes: ["N01", "N02"], name: "Word order: verb second, verb last, sentence bracket, TeKaMoLo" },
  { id: "2", block: "B2", level: "B2", nodes: ["N03", "N04"], name: "Declension: article and adjective endings, n-declension" },
  { id: "3", block: "B2", level: "B2", nodes: ["N05", "N06"], name: "Prepositions; verbs with fixed prepositions; da-/wo-" },
  { id: "4", block: "B2", level: "B2", nodes: ["N07"], name: "Konjunktiv II" },
  { id: "5", block: "B2", level: "B2", nodes: ["N08"], name: "Passive" },
  { id: "6", block: "B2", level: "B2", nodes: ["N09"], name: "Relative clauses" },
  { id: "7", block: "B2", level: "B2", nodes: ["N10"], name: "Infinitive clauses" },
  { id: "8", block: "B2", level: "B2", nodes: ["N11", "N12"], name: "Connectors; checkpoint" },
  { id: "9", block: "C1", level: "C1", nodes: ["N13"], name: "Nominalisation I" },
  { id: "10", block: "C1", level: "C1", nodes: ["N14", "N15"], name: "Nominalisation II, verbalisation; nouns with fixed prepositions" },
  { id: "11", block: "C1", level: "C1", nodes: ["N16"], name: "Funktionsverbgefüge" },
  { id: "12", block: "C1", level: "C1", nodes: ["N17", "N18"], name: "Extended participle attributes; gerundive" },
  { id: "13", block: "C1", level: "C1", nodes: [], name: "Review unit + first timed exam sub-tasks" },
  { id: "14", block: "C1", level: "C1", nodes: ["N19", "N20"], name: "Konjunktiv I and reported speech" },
  { id: "15", block: "C1", level: "C1", nodes: ["N21"], name: "Alternatives to the passive" },
  { id: "16", block: "C1", level: "C1", nodes: ["N22"], name: "Modal verbs of assumption and hearsay" },
  { id: "17", block: "C1", level: "C1", nodes: ["N23"], name: "Modal particles; checkpoint" },
  { id: "18", block: "C2", level: "C2", nodes: ["N24"], name: "Advanced connectors" },
  { id: "19", block: "C2", level: "C2", nodes: ["N25"], name: "Word order for emphasis; negation" },
  { id: "20", block: "C2", level: "C2", nodes: ["N26"], name: "Genitive verbs and adjectives" },
  { id: "21", block: "C2", level: "C2", nodes: ["N27", "N28"], name: "Word formation" },
  { id: "22", block: "C2", level: "C2", nodes: ["N29"], name: "Register change with whole texts" },
  { id: "23", block: "C2", level: "C2", nodes: ["N30"], name: "Collocations and idioms" },
  { id: "24", block: "C2", level: "C2", nodes: ["N31"], name: "Fine shades of meaning" },
  { id: "25", block: "C2", level: "C2", nodes: ["N32"], name: "Cohesion and reference" },
  { id: "26", block: "Exam", level: "C2", nodes: [], name: "First full mock (official C2 Übungssatz) + error analysis" },
  { id: "27", block: "Exam", level: "C2", nodes: [], name: "Schreiben under time pressure" },
  { id: "28", block: "Exam", level: "C2", nodes: [], name: "Sprechen: presentation and discussion" },
  { id: "29", block: "Exam", level: "C2", nodes: [], name: "Lesen and Hören strategies + module mock" },
  { id: "30", block: "Exam", level: "C2", nodes: [], name: "Your weakest module + module mock" },
  { id: "31", block: "Exam", level: "C2", nodes: [], name: "Full mock (exam-prep book) + tutor session" },
  { id: "32", block: "Exam", level: "C2", nodes: [], name: "Clear your error log" },
  { id: "33", block: "Exam", level: "C2", nodes: [], name: "Last full mock + simulated oral exam" },
  { id: "34", block: "Exam", level: "C2", nodes: [], name: "Taper off before the exam" }
];

GT.TRACKS = {
  A: { name: "Track A: C1 → C2", level: "C1", length: "about 8 months", exam: "June–August 2027" },
  B: { name: "Track B: B2 → C2", level: "B2", length: "about 14 months", exam: "January–March 2028" },
  C: { name: "Track C: B1 → C2", level: "B1", length: "about 19 months", exam: "summer 2028" },
  J: { name: "B2 → C1 by June 2027", level: "B2", length: "31 weeks to C1, then C2", exam: "C1 practice exam 14–20 June 2027; C2 in 2028" }
};

// Plan v3 calendar (section 4): week 1 starts on Monday 16 November 2026.
// Each entry is one calendar week: a unit and its week, or a note for weeks without a unit.
GT.PLAN = {
  start: "2026-11-16", goal: "2027-06-20", hours: 7,
  weeks: [
    { u: "1" }, { u: "2" }, { u: "3" }, { u: "4" }, { u: "5" },
    { note: "Holiday: Anki and listening only. Catch up if a unit slipped." },
    { note: "Holiday: Anki and listening only. Catch up if a unit slipped." },
    { u: "6" }, { u: "7" }, { u: "8" },
    { note: "Checkpoint 1 and catch-up: weekly checkpoint, one timed 200-word text, Lesen from the older C1 Übungssatz." },
    { u: "9", w: 1 }, { u: "9", w: 2 }, { u: "10", w: 1 }, { u: "10", w: 2 },
    { u: "11", w: 1 }, { u: "11", w: 2 }, { u: "12", w: 1 }, { u: "12", w: 2 },
    { u: "13", note: "Checkpoint 2: timed C1 writing parts 1 and 2." },
    { u: "14", w: 1 }, { u: "14", w: 2 }, { u: "15", w: 1 }, { u: "15", w: 2 },
    { u: "16", w: 1 }, { u: "16", w: 2 }, { u: "17" },
    { note: "Buffer week: your three weakest points from the Progress page." },
    { note: "C1 exam training: timed writing, speaking, reading and listening strategies." },
    { note: "C1 exam training: timed writing, speaking, reading and listening strategies." },
    { note: "Full C1 practice exam (the modular Modellsatz), all four modules." }
  ]
};

// Unit pages: rule summary, model sentences and contrast notes for Hungarian speakers.
GT.NOTES = {
  "1": {
    rules: [
      "Main clause: the conjugated verb is the second element. Exactly one element stands before it; if that is not the subject, the subject comes right after the verb: Gestern hat er lange gearbeitet.",
      "Sentence bracket: the conjugated verb is second and the rest of the verb (participle, infinitive, separable prefix) goes to the end: Sie ruft ihn morgen an. Er hat den Zug noch erreicht.",
      "Subordinate clause (dass, weil, wenn, ob, relative clauses): the conjugated verb is last: …, weil er den Zug verpasst hat. With a modal verb: …, weil er früher gehen musste.",
      "A subordinate clause in first position counts as element one, so the main-clause verb follows directly: Weil es regnete, blieben wir zu Hause.",
      "und, aber, oder, denn, sondern stand in position zero and do not change the word order: …, denn er hatte keine Zeit.",
      "Middle field: pronouns before nouns. With two nouns, dative before accusative (Er gibt dem Kind das Buch); with two pronouns, accusative before dative (Er gibt es ihm). Adverbials usually run time – cause – manner – place.",
      "nicht stands before the part it negates. When it negates the whole sentence it goes towards the end, but before the second part of the verb, before a predicative adjective and before a direction: Er hat das Buch nicht gelesen. Sie fährt heute nicht nach Wien."
    ],
    models: [
      "Gestern hat er wegen des Staus nur mit Mühe den Zug erreicht.",
      "Ich weiß, dass sie morgen nicht kommen kann.",
      "Obwohl er müde war, ist er noch ins Büro gefahren.",
      "Sie hat es ihm gestern im Büro gegeben."
    ],
    hu: [
      "Hungarian puts the focused element directly before the verb and has no fixed verb slot. In German the verb slot is fixed; you show emphasis by what you put in first position, not by moving the verb.",
      "After a fronted adverbial, Hungarian speakers often keep subject–verb order (wrong: Gestern ich habe …). In German the verb must come second: Gestern habe ich …",
      "Hungarian has no verb-final rule in subordinate clauses (hogy holnap jön). After dass, weil and ob the German verb goes to the very end.",
      "Hungarian drops the subject pronoun; German needs it, and needs es as a formal subject: Es regnet. …, weil er keine Zeit hat.",
      "Hungarian verbal prefixes (meg-, el-, ki-) move for focus and negation. German prefixes move only by the bracket rule: last in a main clause, attached in subordinate clauses and infinitives."
    ]
  },
  "2": {
    rules: [
      "After der-words (der, dieser, jeder, welcher, alle): the adjective takes -e in the nominative singular (all genders) and in the accusative singular feminine and neuter; everywhere else -en.",
      "After ein-words (ein, kein, mein …): the same, except where ein has no ending. There the adjective shows the gender: ein alter Mann, ein kleines Kind.",
      "No article: the adjective takes the ending the article would have (kalter Kaffee, mit großem Interesse). Exception: genitive masculine and neuter take -en (trotz schlechten Wetters).",
      "Plural: after die, keine, meine, alle → -en. With no article, and after viele, einige, mehrere, wenige (they behave like adjectives) → strong endings: viele junge Leute, einiger bekannter Experten.",
      "Dative plural: the noun adds -n too: mit den kleinen Kindern.",
      "n-declension: some masculine nouns take -(e)n in every form except the nominative singular: nouns in -e for people and animals (der Kollege, der Kunde, der Löwe), foreign words in -ent, -ant, -ist, -at, -oge, -graf (der Student, der Journalist), and a few others (der Mensch, der Nachbar; der Herr: des Herrn, plural die Herren).",
      "Mixed nouns: der Name, der Gedanke, der Glaube, der Wille, der Buchstabe add -ns in the genitive (des Namens). das Herz: dem Herzen, des Herzens.",
      "Gender by ending: -ung, -heit, -keit, -schaft, -ion, -tät, -ik, -ei are feminine; -chen, -lein, -um, mostly -ment, and infinitives used as nouns are neuter; -ling, -ismus, -or, -ant, -ist are masculine. Learn every other noun with its article and plural."
    ],
    models: [
      "die Rede eines bekannten Juristen",
      "Trotz schlechten Wetters kamen viele junge Leute.",
      "Ich habe mit dem neuen Kollegen eines alten Freundes gesprochen.",
      "ein interessantes Angebot – das interessante Angebot – interessante Angebote"
    ],
    hu: [
      "Hungarian has no grammatical gender, so nothing in your first language helps you remember der, die or das. The ending rules cover many nouns; the rest must be learned with the article, every time.",
      "Hungarian adjectives before a noun never change (a nagy házban). In German the adjective always carries an ending before a noun, but none after sein or werden: das Haus ist groß.",
      "Hungarian marks case once, on the noun. German marks it mostly on the article and the adjective, and only sometimes on the noun (genitive -s, dative plural -n, n-declension).",
      "After numbers and quantity words Hungarian uses the singular (sok ember, három könyv); German needs the plural: viele Menschen, drei Bücher."
    ]
  },
  "3": {
    rules: [
      "Genitive prepositions: wegen, trotz, während, statt, aufgrund, infolge, angesichts, hinsichtlich, bezüglich, mithilfe, anhand, innerhalb, außerhalb, mangels. dank takes the genitive or the dative.",
      "Two-way prepositions (an, auf, hinter, in, neben, über, unter, vor, zwischen): accusative for movement to a goal (wohin?), dative for a position (wo?): Ich hänge das Bild an die Wand. Das Bild hängt an der Wand.",
      "Verb pairs: stellen/stehen, legen/liegen, setzen/sitzen, hängen/hängen. The first of each pair places something (accusative); the second describes a position (dative).",
      "With no spatial meaning, the verb fixes the case: warten auf + accusative, denken an + accusative, teilnehmen an + dative, leiden unter + dative. über is then nearly always accusative, auf mostly accusative.",
      "Many verbs, adjectives and nouns take a fixed preposition. Learn it with its case: sich freuen auf/über + accusative, abhängen von + dative, bestehen auf + dative, stolz auf + accusative.",
      "Things: replace preposition + pronoun by da(r)- + preposition (darauf, damit) and ask with wo(r)- (worauf?). People: keep the preposition (auf ihn, auf wen?).",
      "A following dass-clause or infinitive clause is announced by the da-compound: Ich freue mich darauf, dich zu sehen."
    ],
    models: [
      "Worauf kommt es an? – Darauf, dass alle pünktlich sind.",
      "Angesichts der hohen Kosten wurde das Projekt gestoppt.",
      "Er legt das Buch auf den Tisch. Jetzt liegt es auf dem Tisch.",
      "Sie hat sich bei ihm für die Hilfe bedankt."
    ],
    hu: [
      "Hungarian uses case endings and postpositions where German uses prepositions (a házban, a ház mögött), so learn each German preposition together with its case.",
      "Hungarian has three-way endings (-ba, -ban, -ból: where to, where, where from). The German two-way prepositions cover the first two with one word and show the difference only through the case: in die Stadt (-ba), in der Stadt (-ban).",
      "Verb government rarely matches: gondol valamire = denken an + accusative; vár valakire = warten auf + accusative; fél valamitől = Angst haben vor + dative; érdeklődik valami iránt = sich interessieren für + accusative. Don't translate the Hungarian ending.",
      "Hungarian points ahead with arra, abban, attól (arra gondolok, hogy …). German does the same with da-compounds: Ich denke daran, dass …"
    ]
  }
};

// GDS module timings and pass marks, used by the exam tools.
GT.EXAM = [
  { id: "lesen", name: "Lesen", minutes: 80 },
  { id: "hoeren", name: "Hören", minutes: 35 },
  { id: "schreiben", name: "Schreiben", minutes: 80 },
  { id: "sprechen", name: "Sprechen", minutes: 15, prep: 15 }
];

// Production tasks (Thursday). kind: write | speak | register. week 2 tasks are for
// two-week units on Tracks B and C. Word and time targets follow plan v2.
GT.TASKS = {
  F1: [{ id: "tF1", kind: "write", week: 1, words: 150, minutes: 30, title: "E-Mail: ein Wochenende",
    prompt: "Schreiben Sie einer Freundin eine E-Mail (ca. 150 Wörter) über ein Wochenende, an dem vieles schiefging.",
    focus: "Perfekt in der E-Mail, Präteritum bei sein, haben und Modalverben, mindestens dreimal Plusquamperfekt mit nachdem." }],
  F2: [{ id: "tF2", kind: "write", week: 1, words: 150, minutes: 30, title: "E-Mail: eine Absage",
    prompt: "Sie konnten an der Geburtstagsfeier eines Kollegen nicht teilnehmen. Entschuldigen Sie sich per E-Mail (ca. 150 Wörter) und erklären Sie, warum.",
    focus: "Modalverben im Präteritum und im Nebensatz (…, weil ich nicht kommen konnte)." }],
  F3: [{ id: "tF3", kind: "write", week: 1, words: 150, minutes: 30, title: "Mein Tagesablauf",
    prompt: "Beschreiben Sie einen typischen Arbeitstag (ca. 150 Wörter).",
    focus: "Mindestens sechs trennbare und vier reflexive Verben (aufstehen, sich beeilen, sich erinnern an …)." }],
  F4: [{ id: "tF4", kind: "write", week: 1, words: 180, minutes: 35, title: "Meinungstext: Handy in der Schule",
    prompt: "Sollten Handys in der Schule verboten werden? Schreiben Sie Ihre Meinung (ca. 180 Wörter).",
    focus: "Nebensätze mit dass, weil, wenn, als, ob und mindestens zwei indirekte Fragen." }],
  F5: [{ id: "tF5", kind: "write", week: 1, words: 180, minutes: 35, title: "Stadt oder Land?",
    prompt: "Vergleichen Sie das Leben in der Stadt und auf dem Land (ca. 180 Wörter).",
    focus: "Komparativ und Superlativ, so … wie, je … desto, mindestens zehn Adjektive." }],
  "1": [{ id: "t01", kind: "write", week: 1, words: 150, minutes: 30, title: "E-Mail: eine verschobene Reise",
    prompt: "Sie mussten eine Reise kurzfristig verschieben. Schreiben Sie einer Freundin eine E-Mail (ca. 150 Wörter): was passiert ist, wann, warum, wie und wo.",
    focus: "Beginnen Sie mindestens fünf Hauptsätze nicht mit dem Subjekt. Mindestens drei Nebensätze. Achten Sie auf die Satzklammer und auf TeKaMoLo." }],
  "2": [{ id: "t02", kind: "write", week: 1, words: 150, minutes: 30, title: "Porträt einer Person",
    prompt: "Beschreiben Sie eine Person, die Sie bewundern (ca. 150 Wörter).",
    focus: "Mindestens acht Adjektive vor Nomen in allen vier Kasus, mit und ohne Artikel, und mindestens zwei Nomen der n-Deklination (Kollege, Kunde, Experte …)." }],
  "3": [{ id: "t03", kind: "write", week: 1, words: 150, minutes: 30, title: "Forumsbeitrag: Ängste und Hoffnungen",
    prompt: "Ein Forum fragt: Wovor haben junge Menschen heute Angst, und worauf hoffen sie? Schreiben Sie einen Beitrag (ca. 150 Wörter).",
    focus: "Mindestens sechs Verben mit festen Präpositionen, drei da-/wo-Wörter und zwei Genitivpräpositionen (angesichts, aufgrund, hinsichtlich …)." }],
  "4": [{ id: "t04", kind: "write", week: 1, words: 150, minutes: 35, title: "Formelle Beschwerde",
    prompt: "Ihr Hotelzimmer entsprach nicht der Beschreibung im Internet. Schreiben Sie eine formelle Beschwerde an das Hotel (ca. 150 Wörter).",
    focus: "Konjunktiv II für höfliche Bitten (Könnten Sie …, Ich wäre Ihnen dankbar, wenn …), für irreale Bedingungen in der Vergangenheit (Hätten Sie mich informiert, …) und einmal als ob." }],
  "5": [{ id: "t05", kind: "write", week: 1, words: 180, minutes: 35, title: "Ein Projekt im Rückblick",
    prompt: "Beschreiben Sie, wie in Ihrer Firma oder Stadt ein Projekt geplant und umgesetzt wurde, und was dabei schiefging (ca. 180 Wörter).",
    focus: "Vorgangs- und Zustandspassiv, Passiv mit Modalverben, ein unpersönliches Passiv und einmal …, dass das hätte vermieden werden können." }],
  "6": [{ id: "t06", kind: "write", week: 1, words: 180, minutes: 35, title: "Drei Dinge, ohne die ich nicht leben könnte",
    prompt: "Stellen Sie drei Dinge vor, ohne die Sie nicht leben könnten, und begründen Sie Ihre Wahl (ca. 180 Wörter).",
    focus: "Relativsätze mit dessen/deren, mit Präposition + Relativpronomen, mit was/wo(r)- und einmal wer …, der …" }],
  "7": [{ id: "t07", kind: "write", week: 1, words: 180, minutes: 35, title: "Eine unglaubliche Geschichte",
    prompt: "Ein Bekannter behauptet etwas Unglaubliches über sich. Berichten Sie darüber und kommentieren Sie es (ca. 180 Wörter).",
    focus: "Infinitivsätze mit um/ohne/anstatt … zu, Infinitiv Perfekt (behauptet, … gesehen zu haben) und Infinitiv Passiv (… gefragt zu werden)." }],
  "8": [{ id: "t08", kind: "write", week: 1, words: 250, minutes: 45, title: "Erörterung: autofreie Innenstädte",
    prompt: "Sollten Großstädte private Autos aus den Innenstädten verbannen? Schreiben Sie eine Erörterung (ca. 250 Wörter) mit Pro und Contra und Ihrer begründeten Meinung.",
    focus: "Mindestens sechs verschiedene Konnektoren aus allen drei Gruppen (Nebensatz, Hauptsatz, Adverb), darunter zwei zweiteilige (zwar … aber, je … desto, weder … noch)." }],
  "9": [
    { id: "t09", kind: "write", week: 1, words: 180, minutes: 35, title: "Kurzbericht im Nominalstil",
      prompt: "Fassen Sie die Entwicklung Ihrer Stadt oder Branche in den letzten zehn Jahren in einem sachlichen Kurzbericht zusammen (ca. 180 Wörter).",
      focus: "Präpositionalgruppen statt Nebensätzen: wegen/aufgrund, trotz, bei, nach, vor, seit, infolge + Nominalisierung." },
    { id: "r09", kind: "register", week: 1, words: 0, minutes: 10, title: "Register: verbal → nominal",
      prompt: "Formulieren Sie im Nominalstil:\n1. Weil die Mieten stark gestiegen sind, ziehen viele Familien aus der Stadt weg.\n2. Nachdem das Gesetz verabschiedet worden war, protestierten mehrere Verbände.\n3. Wenn man die Regeln nicht einhält, muss man mit einer Strafe rechnen.\n4. Obwohl die Kosten gesunken sind, bleibt die Nachfrage gering.",
      focus: "Nominalisierung (N13)." },
    { id: "t09b", kind: "write", week: 2, words: 250, minutes: 50, title: "Stellungnahme im Nominalstil",
      prompt: "Ein Verband fordert, Kurzstreckenflüge zu verbieten. Schreiben Sie eine sachliche Stellungnahme (ca. 250 Wörter).",
      focus: "Mindestens acht Nominalisierungen; wechseln Sie bewusst zwischen Nominal- und Verbalstil." }],
  "10": [
    { id: "t10", kind: "write", week: 1, words: 200, minutes: 40, title: "Zeitungsbericht: Entscheidung des Stadtrats",
      prompt: "Schreiben Sie einen kurzen Zeitungsbericht über eine umstrittene Entscheidung Ihres Stadtrats (ca. 200 Wörter).",
      focus: "Nomen mit festen Präpositionen (Kritik an, Interesse an, Forderung nach, Einfluss auf) und Genitivattribute. Formulieren Sie danach drei Ihrer Sätze verbal." },
    { id: "r10", kind: "register", week: 1, words: 0, minutes: 10, title: "Register: Amtsdeutsch → verständlich",
      prompt: "Erklären Sie einem Freund in einfachen Sätzen (Verbalstil):\n1. Nach Prüfung Ihres Antrags erhalten Sie eine schriftliche Mitteilung.\n2. Bei Nichterscheinen zum Termin wird eine Gebühr fällig.\n3. Trotz intensiver Bemühungen der Stadtverwaltung konnte keine Einigung erzielt werden.\n4. Die Kritik der Opposition an der Verzögerung des Projekts wächst.",
      focus: "Verbalisierung (N14), Nomen mit Präpositionen (N15)." },
    { id: "t10b", kind: "write", week: 2, words: 250, minutes: 50, title: "Beschwerde an eine Behörde",
      prompt: "Ihr Antrag auf einen Anwohnerparkausweis wurde ohne Begründung abgelehnt. Schreiben Sie an die Behörde (ca. 250 Wörter).",
      focus: "Formeller Nominalstil mit Nomen + Präposition; mindestens zwei Genitivattribute in Folge (die Begründung der Ablehnung des Antrags)." }],
  "11": [
    { id: "t11", kind: "write", week: 1, words: 200, minutes: 40, title: "Pressemitteilung",
      prompt: "Ihre Firma führt ein neues Angebot für Kunden ein. Schreiben Sie eine Pressemitteilung (ca. 200 Wörter).",
      focus: "Mindestens sechs Funktionsverbgefüge (zur Verfügung stellen, in Kraft treten, zum Abschluss bringen, in Betrieb nehmen, Anwendung finden …)." },
    { id: "r11", kind: "register", week: 1, words: 0, minutes: 10, title: "Register: Verb → Funktionsverbgefüge",
      prompt: "Formulieren Sie mit einem Funktionsverbgefüge:\n1. Die neue Regelung gilt ab Januar.\n2. Wir müssen diese Annahme bezweifeln.\n3. Die Firma stellt den Mitarbeitern Laptops bereit.\n4. Das Projekt wurde im Mai abgeschlossen.",
      focus: "Funktionsverbgefüge (N16)." },
    { id: "t11b", kind: "write", week: 2, words: 250, minutes: 50, title: "Bericht über eine Reform",
      prompt: "Berichten Sie sachlich über eine Reform in Ihrem Land, die kürzlich in Kraft getreten ist (ca. 250 Wörter).",
      focus: "Funktionsverbgefüge mit passivischer Bedeutung (zur Anwendung kommen, in Kritik geraten, Zustimmung finden)." }],
  "12": [
    { id: "t12", kind: "write", week: 1, words: 150, minutes: 35, title: "Interview → Zeitungsmeldung",
      prompt: "Machen Sie aus diesem Interview eine Zeitungsmeldung im Nominalstil (ca. 150 Wörter):\n\n„Also, wir haben ja letztes Jahr angefangen, die Busse in der Innenstadt auf Strom umzustellen. Das hat erst mal ziemlich viel gekostet, klar. Am Anfang haben sich die Leute total beschwert, weil die Busse oft ausgefallen sind. Inzwischen läuft das aber richtig gut. Wir haben die Fahrer geschult, und die Werkstatt haben wir auch umgebaut. Nächstes Jahr wollen wir dann auch die Linien in die Vororte umstellen, wenn der Stadtrat das Geld bewilligt.“ (Verkehrsdezernentin Maria Keller)",
      focus: "Erweiterte Partizipialattribute (die im letzten Jahr begonnene Umstellung), Gerundiv (die noch umzustellenden Linien), Nominalisierungen, Passiv." },
    { id: "r12", kind: "register", week: 1, words: 0, minutes: 10, title: "Register: Relativsatz → Partizipialattribut",
      prompt: "Formulieren Sie mit einem Partizipialattribut oder Gerundiv:\n1. Die Reform, die von der Regierung beschlossen wurde, stößt auf Kritik.\n2. Die Probleme, die gelöst werden müssen, sind zahlreich.\n3. Die Zahl der Menschen, die in Armut leben, steigt.\n4. Der Bericht, der gestern veröffentlicht wurde, enthält neue Zahlen.",
      focus: "Partizipialattribute (N17), Gerundiv (N18)." },
    { id: "t12b", kind: "write", week: 2, words: 250, minutes: 50, title: "Fachtext zusammenfassen",
      prompt: "Fassen Sie einen Artikel aus DW oder einer Zeitung über ein wissenschaftliches Thema in einem sachlichen Text zusammen (ca. 250 Wörter). Fügen Sie den Link oder den Titel des Artikels hinzu.",
      focus: "Mindestens vier erweiterte Partizipialattribute und zwei Gerundive." }],
  "13": [{ id: "t13", kind: "write", week: 1, words: 200, minutes: 30, title: "Mini-Prüfung: Schreiben unter Zeitdruck",
    prompt: "Immer mehr Städte führen eine Tourismusabgabe ein. Schreiben Sie einen argumentativen Text (ca. 200 Wörter, 30 Minuten).",
    focus: "Alles aus den Einheiten 1–12, unter Prüfungsbedingungen: kein Wörterbuch, keine Pause." }],
  "14": [{ id: "t14", kind: "write", week: 1, words: 200, minutes: 40, title: "Interview in indirekter Rede",
    prompt: "Wählen Sie ein Interview (DW, Deutschlandfunk, eine Zeitung) und geben Sie die wichtigsten Aussagen in indirekter Rede wieder (ca. 200 Wörter). Nennen Sie die Quelle.",
    focus: "Konjunktiv I, Wechsel zu Konjunktiv II wo nötig, mindestens vier verschiedene Redeeinleitungsverben (einräumen, betonen, bestreiten …), einmal laut und einmal zufolge." }],
  "15": [{ id: "t15", kind: "write", week: 1, words: 200, minutes: 40, title: "Hausordnung",
    prompt: "Schreiben Sie eine Hausordnung für ein Studentenwohnheim mit einer kurzen Begründung der Regeln (ca. 200 Wörter).",
    focus: "Passiversatz: sich lassen, sein + zu, -bar/-lich, bekommen-Passiv und gehören + Partizip II (umgangssprachlich, einmal gekennzeichnet)." }],
  "16": [{ id: "t16", kind: "write", week: 1, words: 200, minutes: 40, title: "Gerüchte",
    prompt: "Über eine bekannte Person kursieren Gerüchte. Geben Sie wieder, was sie getan haben soll oder selbst getan haben will, und stellen Sie Vermutungen an (ca. 200 Wörter).",
    focus: "soll/will + Infinitiv Perfekt, dürfte, mag, muss … gewesen sein und Futur II als Vermutung." }],
  "17": [{ id: "t17", kind: "speak", week: 1, words: 0, minutes: 3, prep: 5, title: "Sprechen: Nachricht zusammenfassen und kommentieren",
    prompt: "Wählen Sie eine DW-Nachricht. Fassen Sie sie in indirekter Rede zusammen und kommentieren Sie sie dann 3 Minuten lang laut. Nehmen Sie sich mit dem Handy auf und tippen Sie das Transkript hier ein (oder lassen Sie es transkribieren).",
    focus: "Modalpartikeln (doch, ja, eben, halt, wohl, schon, eigentlich) im Kommentar, Konjunktiv I in der Zusammenfassung." }],
  "18": [{ id: "t18", kind: "write", week: 1, words: 250, minutes: 45, title: "Kommentar",
    prompt: "Schreiben Sie einen Zeitungskommentar zur Frage, ob das Wahlalter auf 16 gesenkt werden sollte (ca. 250 Wörter).",
    focus: "insofern (als), zumal, sofern, es sei denn, geschweige denn, wohingegen, indem, ohne dass, zu …, als dass." }],
  "19": [{ id: "t19", kind: "write", week: 1, words: 250, minutes: 45, title: "Leserbrief",
    prompt: "Antworten Sie mit einem Leserbrief auf einen Artikel, der behauptet, Homeoffice mache Menschen einsam (ca. 250 Wörter).",
    focus: "Hervorhebung durch Wortstellung: Vorfeld bewusst besetzen, Mittelfeld nach Thema–Rhema, Ausklammerung, Position von nicht." }],
  "20": [{ id: "t20", kind: "write", week: 1, words: 200, minutes: 40, title: "Offizielle Stellungnahme",
    prompt: "Ein Verein nimmt offiziell Stellung zu einer geplanten Kürzung seiner Fördermittel (ca. 200 Wörter).",
    focus: "Genitivverben und -adjektive: bedürfen, sich enthalten, sich bedienen, gedenken, sich einer Sache bewusst/sicher/würdig sein." }],
  "21": [{ id: "t21", kind: "write", week: 1, words: 350, minutes: 60, title: "Erörterung, 60 Minuten",
    prompt: "Sollten Universitäten Studiengebühren erheben? Schreiben Sie einen diskutierenden Text (ca. 350 Wörter, 60 Minuten).",
    focus: "Untrennbare und trennbare Präfixverben (übersetzen/übersetzen, umgehen/umgehen), Ableitungen und Komposita." }],
  "22": [{ id: "t22", kind: "register", week: 1, words: 200, minutes: 40, title: "Blogpost → formelles Schreiben",
    prompt: "Formulieren Sie diesen Blogpost als formelles Schreiben an die Hausverwaltung (ca. 200 Wörter):\n\n„Leute, ich bin echt sauer. Seit drei Wochen wird bei uns im Haus renoviert, und keiner hat uns vorher was gesagt. Morgens um sieben geht's los mit Bohren, und abends liegt überall Staub. Ich hab den Vermieter schon zweimal angerufen, aber der meldet sich einfach nicht. Wenn das so weitergeht, zahl ich nächsten Monat weniger Miete. Das ist doch kein Zustand!“",
    focus: "Registerwechsel (Schreiben Teil 2): formelle Anrede, Nominalstil, Konjunktiv II für Forderungen, keine Umgangssprache." }],
  "23": [{ id: "t23", kind: "write", week: 1, words: 250, minutes: 45, title: "Glosse",
    prompt: "Schreiben Sie eine humorvolle Glosse über Meetings, die eine E-Mail hätten sein können (ca. 250 Wörter).",
    focus: "Mindestens acht Kollokationen und Redewendungen (ins Gewicht fallen, auf der Hand liegen, in Kauf nehmen …)." }],
  "24": [{ id: "t24", kind: "write", week: 1, words: 250, minutes: 45, title: "Rezension",
    prompt: "Schreiben Sie eine Rezension eines Buches oder Films, den Sie zwiespältig fanden (ca. 250 Wörter).",
    focus: "Bedeutungsnuancen: scheinbar/anscheinend, lediglich/bloß, zumal/weil, wäre/sei; präzise statt vage Wörter." }],
  "25": [{ id: "t25", kind: "speak", week: 1, words: 0, minutes: 4, prep: 15, title: "Präsentation, 4 Minuten",
    prompt: "Halten Sie eine Präsentation (4 Minuten, 15 Minuten Vorbereitung): Sollte Wohnraum stärker staatlich reguliert werden? Nehmen Sie sich auf und tippen Sie das Transkript hier ein.",
    focus: "Kohäsion: Verweiswörter (ersterer/letzterer, derselbe, jener), Pro-Formen, Redemittel zur Gliederung." }]
};
