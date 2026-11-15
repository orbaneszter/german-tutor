// Thread W · word order: sentence-building items and reconstruction texts (plan v3, section 6). Batch 1.
GT.addSet(
{
 "thread": "W",
 "version": 1,
 "written": "2026-11-15",
 "reviewed": true,
 "items": [
  {
   "id": "tW-001",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Trotz des Regens",
   "words": [
    "sind",
    "wir",
    "pünktlich",
    "angekommen"
   ],
   "answers": [
    "Trotz des Regens sind wir pünktlich angekommen."
   ],
   "explain": "Trotz des Regens fills position 1, so the finite verb (sind) is second and the subject follows it."
  },
  {
   "id": "tW-002",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Deshalb",
   "words": [
    "konnte",
    "sie",
    "nicht",
    "an",
    "der",
    "Sitzung",
    "teilnehmen"
   ],
   "answers": [
    "Deshalb konnte sie nicht an der Sitzung teilnehmen.",
    "Deshalb konnte sie an der Sitzung nicht teilnehmen."
   ],
   "explain": "Deshalb is an adverb and takes position 1: the verb comes straight after it (deshalb konnte sie), never deshalb sie konnte."
  },
  {
   "id": "tW-003",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Nachdem er gegessen hatte,",
   "words": [
    "ging",
    "er",
    "sofort",
    "ins",
    "Bett"
   ],
   "answers": [
    "Nachdem er gegessen hatte, ging er sofort ins Bett."
   ],
   "explain": "The whole subordinate clause is position 1 of the main clause, so the finite verb (ging) follows the comma."
  },
  {
   "id": "tW-004",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Meiner Meinung nach",
   "words": [
    "ist",
    "das",
    "keine",
    "gute",
    "Lösung"
   ],
   "answers": [
    "Meiner Meinung nach ist das keine gute Lösung."
   ],
   "explain": "Meiner Meinung nach counts as position 1. The verb must follow at once: Meiner Meinung nach ist das …, not … nach das ist."
  },
  {
   "id": "tW-005",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Erst gestern",
   "words": [
    "habe",
    "ich",
    "von",
    "dem",
    "Problem",
    "erfahren"
   ],
   "answers": [
    "Erst gestern habe ich von dem Problem erfahren."
   ],
   "explain": "Erst gestern is one element in position 1; the finite verb (habe) is second, the participle closes the bracket."
  },
  {
   "id": "tW-006",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ob er kommt,",
   "words": [
    "weiß",
    "ich",
    "leider",
    "nicht"
   ],
   "answers": [
    "Ob er kommt, weiß ich leider nicht."
   ],
   "explain": "An ob-clause in front is position 1: verb next (weiß ich). Sentence negation nicht stands at the end here."
  },
  {
   "id": "tW-007",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Zum Glück",
   "words": [
    "hat",
    "niemand",
    "den",
    "Fehler",
    "bemerkt"
   ],
   "answers": [
    "Zum Glück hat niemand den Fehler bemerkt.",
    "Zum Glück hat den Fehler niemand bemerkt."
   ],
   "explain": "Zum Glück fills position 1, so the order is verb (hat), then subject (niemand). An indefinite subject like niemand may also follow the definite object (hat den Fehler niemand bemerkt)."
  },
  {
   "id": "tW-008",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Dieses Buch",
   "words": [
    "habe",
    "ich",
    "noch",
    "nicht",
    "gelesen"
   ],
   "answers": [
    "Dieses Buch habe ich noch nicht gelesen."
   ],
   "explain": "An object can take position 1 for emphasis. The verb stays second, so the subject moves behind it."
  },
  {
   "id": "tW-009",
   "unit": 4,
   "node": "N07",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "An deiner Stelle",
   "words": [
    "würde",
    "ich",
    "das",
    "Angebot",
    "annehmen"
   ],
   "answers": [
    "An deiner Stelle würde ich das Angebot annehmen."
   ],
   "explain": "An deiner Stelle is position 1; würde is second and the infinitive closes the bracket."
  },
  {
   "id": "tW-010",
   "unit": 4,
   "node": "N07",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Hätte ich das gewusst,",
   "words": [
    "wäre",
    "ich",
    "früher",
    "gekommen"
   ],
   "answers": [
    "Hätte ich das gewusst, wäre ich früher gekommen."
   ],
   "explain": "A conditional clause without wenn starts with its verb (Hätte ich …). The main clause then begins with its finite verb (wäre)."
  },
  {
   "id": "tW-011",
   "unit": 3,
   "node": "N06",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "V2",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Worüber",
   "words": [
    "habt",
    "ihr",
    "euch",
    "so",
    "lange",
    "unterhalten"
   ],
   "answers": [
    "Worüber habt ihr euch so lange unterhalten?"
   ],
   "explain": "The question word (worüber) is position 1, the verb second; the reflexive pronoun follows the subject pronoun directly."
  },
  {
   "id": "tW-012",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich weiß nicht, ob",
   "words": [
    "er",
    "die",
    "Nachricht",
    "schon",
    "gelesen",
    "hat"
   ],
   "answers": [
    "Ich weiß nicht, ob er die Nachricht schon gelesen hat.",
    "Ich weiß nicht, ob er schon die Nachricht gelesen hat."
   ],
   "explain": "Subordinate clause: the finite verb (hat) goes to the very end, after the participle."
  },
  {
   "id": "tW-013",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Sie bleibt zu Hause, weil",
   "words": [
    "sie",
    "sich",
    "stark",
    "erkältet",
    "hat"
   ],
   "answers": [
    "Sie bleibt zu Hause, weil sie sich stark erkältet hat."
   ],
   "explain": "After weil the verb is last (erkältet hat). The reflexive pronoun comes right after the subject pronoun."
  },
  {
   "id": "tW-014",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Es ist schade, dass",
   "words": [
    "du",
    "nicht",
    "mitkommen",
    "kannst"
   ],
   "answers": [
    "Es ist schade, dass du nicht mitkommen kannst."
   ],
   "explain": "In a subordinate clause the modal verb is last, after the infinitive: mitkommen kannst."
  },
  {
   "id": "tW-015",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Der Kollege, der",
   "words": [
    "gestern",
    "angerufen",
    "hat",
    "möchte",
    "dich",
    "sprechen"
   ],
   "answers": [
    "Der Kollege, der gestern angerufen hat, möchte dich sprechen.",
    "Der Kollege, der dich sprechen möchte, hat gestern angerufen."
   ],
   "explain": "A relative clause is a subordinate clause: verb last (angerufen hat, or sprechen möchte). The main clause then continues with its finite verb straight after the comma."
  },
  {
   "id": "tW-016",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Sie erklärte, warum",
   "words": [
    "sie",
    "nicht",
    "früher",
    "hatte",
    "kommen",
    "können"
   ],
   "answers": [
    "Sie erklärte, warum sie nicht früher hatte kommen können.",
    "Sie erklärte, warum sie früher nicht hatte kommen können."
   ],
   "explain": "With a double infinitive (kommen können) the finite verb (hatte) stands in front of the two infinitives, not at the end. (früher nicht = 'in the past, not' is also possible.)"
  },
  {
   "id": "tW-017",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich rufe dich an, sobald",
   "words": [
    "ich",
    "im",
    "Hotel",
    "angekommen",
    "bin"
   ],
   "answers": [
    "Ich rufe dich an, sobald ich im Hotel angekommen bin."
   ],
   "explain": "After sobald the verb is last: participle, then the auxiliary (angekommen bin)."
  },
  {
   "id": "tW-018",
   "unit": 4,
   "node": "N07",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Wenn ich mehr Zeit",
   "words": [
    "hätte",
    "würde",
    "ich",
    "öfter",
    "lesen"
   ],
   "answers": [
    "Wenn ich mehr Zeit hätte, würde ich öfter lesen."
   ],
   "explain": "Verb last in the wenn-clause (hätte); the main clause follows with its verb first (würde ich), because the wenn-clause is position 1."
  },
  {
   "id": "tW-019",
   "unit": 4,
   "node": "N07",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Er tut so, als ob",
   "words": [
    "er",
    "alles",
    "verstanden",
    "hätte"
   ],
   "answers": [
    "Er tut so, als ob er alles verstanden hätte."
   ],
   "explain": "als ob introduces a subordinate clause: the finite verb (hätte) is last."
  },
  {
   "id": "tW-020",
   "unit": 4,
   "node": "N07",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Er tut so, als",
   "words": [
    "hätte",
    "er",
    "nichts",
    "gehört"
   ],
   "answers": [
    "Er tut so, als hätte er nichts gehört."
   ],
   "explain": "After als without ob the finite verb comes directly after als (als hätte er …)."
  },
  {
   "id": "tW-021",
   "unit": 4,
   "node": "N07",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Könnten Sie",
   "words": [
    "mir",
    "bitte",
    "erklären",
    "wie",
    "das",
    "Gerät",
    "funktioniert"
   ],
   "answers": [
    "Könnten Sie mir bitte erklären, wie das Gerät funktioniert?"
   ],
   "explain": "The indirect question is a subordinate clause: wie das Gerät funktioniert, with the verb last (not wie funktioniert das Gerät)."
  },
  {
   "id": "tW-022",
   "unit": 5,
   "node": "N08",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich bin sicher, dass",
   "words": [
    "der",
    "Antrag",
    "rechtzeitig",
    "eingereicht",
    "worden",
    "ist"
   ],
   "answers": [
    "Ich bin sicher, dass der Antrag rechtzeitig eingereicht worden ist."
   ],
   "explain": "Passive perfect in a subordinate clause: participle + worden + finite verb (eingereicht worden ist)."
  },
  {
   "id": "tW-023",
   "unit": 5,
   "node": "N08",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Es ist bekannt, dass",
   "words": [
    "das",
    "Gebäude",
    "abgerissen",
    "werden",
    "soll"
   ],
   "answers": [
    "Es ist bekannt, dass das Gebäude abgerissen werden soll."
   ],
   "explain": "Passive with a modal verb in a subordinate clause: participle + werden + modal (abgerissen werden soll)."
  },
  {
   "id": "tW-024",
   "unit": 5,
   "node": "N08",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "VL",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Er fragte, warum",
   "words": [
    "er",
    "nicht",
    "früher",
    "informiert",
    "worden",
    "war"
   ],
   "answers": [
    "Er fragte, warum er nicht früher informiert worden war.",
    "Er fragte, warum er früher nicht informiert worden war."
   ],
   "explain": "Verb cluster at the end of the clause: participle + worden + finite verb (informiert worden war)."
  },
  {
   "id": "tW-025",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Der Zug",
   "words": [
    "kommt",
    "heute",
    "mit",
    "Verspätung",
    "an"
   ],
   "answers": [
    "Der Zug kommt heute mit Verspätung an."
   ],
   "explain": "Separable verb: the finite part is second, the prefix (an) closes the bracket at the very end."
  },
  {
   "id": "tW-026",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Wir",
   "words": [
    "haben",
    "uns",
    "gestern",
    "lange",
    "unterhalten"
   ],
   "answers": [
    "Wir haben uns gestern lange unterhalten."
   ],
   "explain": "Perfect: haben in position 2, the participle at the end. The reflexive pronoun opens the middle field."
  },
  {
   "id": "tW-027",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Sie",
   "words": [
    "scheint",
    "die",
    "Frage",
    "nicht",
    "verstanden",
    "zu",
    "haben"
   ],
   "answers": [
    "Sie scheint die Frage nicht verstanden zu haben."
   ],
   "explain": "scheinen + zu-infinitive forms a bracket: the perfect infinitive (verstanden zu haben) stands at the end."
  },
  {
   "id": "tW-028",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Er",
   "words": [
    "hat",
    "vor",
    "mit",
    "dem",
    "Rauchen",
    "aufzuhören"
   ],
   "answers": [
    "Er hat vor, mit dem Rauchen aufzuhören."
   ],
   "explain": "The prefix vor closes the main clause before the infinitive clause starts. In aufzuhören, zu goes between prefix and verb."
  },
  {
   "id": "tW-029",
   "unit": 1,
   "node": "N01",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich",
   "words": [
    "rufe",
    "dich",
    "an",
    "sobald",
    "ich",
    "Zeit",
    "habe"
   ],
   "answers": [
    "Ich rufe dich an, sobald ich Zeit habe."
   ],
   "explain": "The prefix (an) closes the main clause before the subordinate clause begins: Ich rufe dich an, sobald …"
  },
  {
   "id": "tW-030",
   "unit": 4,
   "node": "N07",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Du",
   "words": [
    "hättest",
    "mich",
    "vorher",
    "fragen",
    "sollen"
   ],
   "answers": [
    "Du hättest mich vorher fragen sollen."
   ],
   "explain": "Konjunktiv II of the past with a modal verb: hättest in position 2, the double infinitive (fragen sollen) at the end."
  },
  {
   "id": "tW-031",
   "unit": 5,
   "node": "N08",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Das Haus",
   "words": [
    "soll",
    "nächstes",
    "Jahr",
    "renoviert",
    "werden"
   ],
   "answers": [
    "Das Haus soll nächstes Jahr renoviert werden."
   ],
   "explain": "Passive with a modal verb: modal in position 2, participle + werden at the end."
  },
  {
   "id": "tW-032",
   "unit": 5,
   "node": "N08",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Die Unterlagen",
   "words": [
    "hätten",
    "schon",
    "gestern",
    "abgegeben",
    "werden",
    "müssen"
   ],
   "answers": [
    "Die Unterlagen hätten schon gestern abgegeben werden müssen.",
    "Die Unterlagen hätten gestern schon abgegeben werden müssen."
   ],
   "explain": "hätten in position 2; at the end the order is participle + werden + modal infinitive (abgegeben werden müssen)."
  },
  {
   "id": "tW-033",
   "unit": 5,
   "node": "N08",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Auf dem Fest",
   "words": [
    "wurde",
    "bis",
    "in",
    "die",
    "Nacht",
    "getanzt"
   ],
   "answers": [
    "Auf dem Fest wurde bis in die Nacht getanzt."
   ],
   "explain": "Impersonal passive: when position 1 is filled (Auf dem Fest), there is no es. wurde is second, the participle closes the bracket."
  },
  {
   "id": "tW-034",
   "unit": 5,
   "node": "N08",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "BR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Der Brief",
   "words": [
    "ist",
    "noch",
    "nicht",
    "abgeschickt",
    "worden"
   ],
   "answers": [
    "Der Brief ist noch nicht abgeschickt worden."
   ],
   "explain": "Passive perfect: ist in position 2, participle + worden at the end; noch nicht stands before them."
  },
  {
   "id": "tW-035",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz in neutraler Reihenfolge.",
   "start": "Ich habe",
   "words": [
    "dem",
    "Chef",
    "den",
    "Bericht",
    "gestern",
    "geschickt"
   ],
   "answers": [
    "Ich habe dem Chef gestern den Bericht geschickt.",
    "Ich habe dem Chef den Bericht gestern geschickt.",
    "Ich habe gestern dem Chef den Bericht geschickt."
   ],
   "explain": "Two noun objects: dative before accusative (dem Chef den Bericht)."
  },
  {
   "id": "tW-036",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich habe",
   "words": [
    "ihn",
    "dem",
    "Chef",
    "gestern",
    "geschickt"
   ],
   "answers": [
    "Ich habe ihn gestern dem Chef geschickt.",
    "Ich habe ihn dem Chef gestern geschickt."
   ],
   "explain": "A pronoun comes before a noun, whatever the case: ihn (accusative) stands before dem Chef (dative). The time adverb usually comes between the pronoun and the noun object."
  },
  {
   "id": "tW-037",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Kannst du",
   "words": [
    "es",
    "mir",
    "bitte",
    "erklären"
   ],
   "answers": [
    "Kannst du es mir bitte erklären?"
   ],
   "explain": "Two personal pronouns: accusative before dative (es mir). Both stand directly after the subject."
  },
  {
   "id": "tW-038",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Gestern hat",
   "words": [
    "mir",
    "mein",
    "Bruder",
    "sein",
    "neues",
    "Auto",
    "gezeigt"
   ],
   "answers": [
    "Gestern hat mir mein Bruder sein neues Auto gezeigt.",
    "Gestern hat mein Bruder mir sein neues Auto gezeigt."
   ],
   "explain": "An object pronoun (mir) may stand before a noun subject (mein Bruder). Both orders are correct."
  },
  {
   "id": "tW-039",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Sie hat",
   "words": [
    "sich",
    "gestern",
    "das",
    "Buch",
    "gekauft"
   ],
   "answers": [
    "Sie hat sich gestern das Buch gekauft.",
    "Sie hat sich das Buch gestern gekauft."
   ],
   "explain": "The reflexive pronoun comes first in the middle field, directly after the finite verb."
  },
  {
   "id": "tW-040",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich weiß, dass",
   "words": [
    "er",
    "es",
    "ihr",
    "schon",
    "gesagt",
    "hat"
   ],
   "answers": [
    "Ich weiß, dass er es ihr schon gesagt hat."
   ],
   "explain": "Pronouns in a row: nominative, accusative, dative (er es ihr); then the adverb, then the verb cluster."
  },
  {
   "id": "tW-041",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz in neutraler Reihenfolge.",
   "start": "Wir fahren",
   "words": [
    "morgen",
    "mit",
    "dem",
    "Zug",
    "nach",
    "Berlin"
   ],
   "answers": [
    "Wir fahren morgen mit dem Zug nach Berlin."
   ],
   "explain": "TeKaMoLo: time (morgen) before manner (mit dem Zug) before place (nach Berlin)."
  },
  {
   "id": "tW-042",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz in neutraler Reihenfolge.",
   "start": "Er ist",
   "words": [
    "wegen",
    "des",
    "Staus",
    "eine",
    "Stunde",
    "zu",
    "spät",
    "gekommen"
   ],
   "answers": [
    "Er ist wegen des Staus eine Stunde zu spät gekommen."
   ],
   "explain": "The cause (wegen des Staus) stands before the complement that belongs closely to the verb (eine Stunde zu spät)."
  },
  {
   "id": "tW-043",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz in neutraler Reihenfolge.",
   "start": "Sie arbeitet",
   "words": [
    "seit",
    "drei",
    "Jahren",
    "als",
    "Ärztin",
    "in",
    "Wien"
   ],
   "answers": [
    "Sie arbeitet seit drei Jahren als Ärztin in Wien.",
    "Sie arbeitet seit drei Jahren in Wien als Ärztin."
   ],
   "explain": "Time comes first in the middle field (seit drei Jahren). Hungarian speakers tend to put the place first."
  },
  {
   "id": "tW-044",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz in neutraler Reihenfolge.",
   "start": "Ich habe",
   "words": [
    "heute",
    "im",
    "Büro",
    "einen",
    "alten",
    "Freund",
    "getroffen"
   ],
   "answers": [
    "Ich habe heute im Büro einen alten Freund getroffen.",
    "Ich habe heute einen alten Freund im Büro getroffen."
   ],
   "explain": "Time first; an object with the indefinite article (new information) stands late in the middle field."
  },
  {
   "id": "tW-045",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Hat",
   "words": [
    "er",
    "sich",
    "schon",
    "bei",
    "dir",
    "entschuldigt"
   ],
   "answers": [
    "Hat er sich schon bei dir entschuldigt?",
    "Hat er sich bei dir schon entschuldigt?"
   ],
   "explain": "Yes/no question: verb first, then subject pronoun and reflexive pronoun together (er sich)."
  },
  {
   "id": "tW-046",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "C1",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Deshalb hat",
   "words": [
    "es",
    "ihm",
    "niemand",
    "gesagt"
   ],
   "answers": [
    "Deshalb hat es ihm niemand gesagt.",
    "Deshalb hat niemand es ihm gesagt."
   ],
   "explain": "Object pronouns (es ihm) usually stand before a subject that is not a personal pronoun (niemand)."
  },
  {
   "id": "tW-047",
   "unit": 2,
   "node": "N04",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Sie hat",
   "words": [
    "dem",
    "neuen",
    "Kollegen",
    "die",
    "Stadt",
    "gezeigt"
   ],
   "answers": [
    "Sie hat dem neuen Kollegen die Stadt gezeigt."
   ],
   "explain": "Two noun objects: dative before accusative. Kollege takes -n in the dative (n-declension)."
  },
  {
   "id": "tW-048",
   "unit": 2,
   "node": "N04",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Der Arzt hat",
   "words": [
    "es",
    "dem",
    "Patienten",
    "genau",
    "erklärt"
   ],
   "answers": [
    "Der Arzt hat es dem Patienten genau erklärt."
   ],
   "explain": "The pronoun (es) stands before the noun (dem Patienten). Patient takes -en in the dative (n-declension)."
  },
  {
   "id": "tW-049",
   "unit": 3,
   "node": "N06",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Sie hat sich",
   "words": [
    "bei",
    "ihm",
    "für",
    "die",
    "Hilfe",
    "bedankt"
   ],
   "answers": [
    "Sie hat sich bei ihm für die Hilfe bedankt."
   ],
   "explain": "sich bedanken bei (person) für (thing): the person comes first. Prepositional objects stand at the end of the middle field."
  },
  {
   "id": "tW-050",
   "unit": 3,
   "node": "N06",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Er hat",
   "words": [
    "lange",
    "auf",
    "eine",
    "Antwort",
    "gewartet"
   ],
   "answers": [
    "Er hat lange auf eine Antwort gewartet."
   ],
   "explain": "A prepositional object (auf eine Antwort) stands late, directly before the closing verb; adverbs come before it."
  },
  {
   "id": "tW-051",
   "unit": 3,
   "node": "N06",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich freue mich",
   "words": [
    "sehr",
    "darauf",
    "euch",
    "bald",
    "wiederzusehen"
   ],
   "answers": [
    "Ich freue mich sehr darauf, euch bald wiederzusehen."
   ],
   "explain": "darauf closes the main clause and points forward to the infinitive clause, where the zu-infinitive is last."
  },
  {
   "id": "tW-052",
   "unit": 5,
   "node": "N08",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "PR",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Mir",
   "words": [
    "wurde",
    "gestern",
    "das",
    "Fahrrad",
    "gestohlen"
   ],
   "answers": [
    "Mir wurde gestern das Fahrrad gestohlen.",
    "Mir wurde das Fahrrad gestern gestohlen."
   ],
   "explain": "The dative (mir) can open a passive sentence; wurde stays second and the subject (das Fahrrad) follows in the middle field."
  },
  {
   "id": "tW-053",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz. Verneint wird der ganze Satz.",
   "start": "Ich habe",
   "words": [
    "den",
    "Film",
    "nicht",
    "gesehen"
   ],
   "answers": [
    "Ich habe den Film nicht gesehen."
   ],
   "explain": "Sentence negation: nicht stands after the definite object and before the closing participle."
  },
  {
   "id": "tW-054",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Er interessiert sich",
   "words": [
    "nicht",
    "für",
    "Politik"
   ],
   "answers": [
    "Er interessiert sich nicht für Politik."
   ],
   "explain": "nicht stands before a prepositional object (für Politik)."
  },
  {
   "id": "tW-055",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Das Wetter",
   "words": [
    "ist",
    "heute",
    "nicht",
    "schön"
   ],
   "answers": [
    "Das Wetter ist heute nicht schön."
   ],
   "explain": "nicht stands before the predicative adjective (schön), after the time adverb."
  },
  {
   "id": "tW-056",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz. Verneint wird der ganze Satz.",
   "start": "Sie kommt",
   "words": [
    "heute",
    "nicht",
    "ins",
    "Büro"
   ],
   "answers": [
    "Sie kommt heute nicht ins Büro."
   ],
   "explain": "nicht stands before a complement of direction (ins Büro) and after the time adverb."
  },
  {
   "id": "tW-057",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich kann",
   "words": [
    "dir",
    "das",
    "leider",
    "nicht",
    "versprechen"
   ],
   "answers": [
    "Ich kann dir das leider nicht versprechen."
   ],
   "explain": "Pronouns first (dir das), then the sentence adverb (leider), then nicht directly before the infinitive."
  },
  {
   "id": "tW-058",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Er hat",
   "words": [
    "nicht",
    "angerufen",
    "sondern",
    "eine",
    "E-Mail",
    "geschrieben"
   ],
   "answers": [
    "Er hat nicht angerufen, sondern eine E-Mail geschrieben.",
    "Er hat nicht eine E-Mail geschrieben, sondern angerufen."
   ],
   "explain": "nicht … sondern: nicht stands directly before the part that is corrected (angerufen)."
  },
  {
   "id": "tW-059",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Wir fahren",
   "words": [
    "nicht",
    "mit",
    "dem",
    "Auto",
    "sondern",
    "mit",
    "dem",
    "Zug"
   ],
   "answers": [
    "Wir fahren nicht mit dem Auto, sondern mit dem Zug.",
    "Wir fahren nicht mit dem Zug, sondern mit dem Auto."
   ],
   "explain": "Partial negation: nicht stands directly before the element that is negated, and sondern gives the correction."
  },
  {
   "id": "tW-060",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich glaube, dass",
   "words": [
    "er",
    "das",
    "nicht",
    "absichtlich",
    "getan",
    "hat"
   ],
   "answers": [
    "Ich glaube, dass er das nicht absichtlich getan hat.",
    "Ich glaube, dass er das absichtlich nicht getan hat."
   ],
   "explain": "nicht stands before the adverb of manner it negates (nicht absichtlich = not on purpose); the verb cluster closes the clause. absichtlich nicht is also correct but means he deliberately left it undone."
  },
  {
   "id": "tW-061",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz. Verneint wird der ganze Satz.",
   "start": "Sie hat",
   "words": [
    "mich",
    "gestern",
    "nicht",
    "angerufen"
   ],
   "answers": [
    "Sie hat mich gestern nicht angerufen."
   ],
   "explain": "Sentence negation: pronoun, time adverb, then nicht directly before the participle."
  },
  {
   "id": "tW-062",
   "unit": 1,
   "node": "N02",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Er wohnt",
   "words": [
    "nicht",
    "mehr",
    "in",
    "Budapest"
   ],
   "answers": [
    "Er wohnt nicht mehr in Budapest."
   ],
   "explain": "nicht mehr stands before the place complement that the verb needs (in Budapest)."
  },
  {
   "id": "tW-063",
   "unit": 3,
   "node": "N06",
   "type": "O",
   "level": "B2",
   "cat": "W",
   "kind": "NG",
   "prompt": "Bilden Sie einen Satz.",
   "start": "Ich habe",
   "words": [
    "mich",
    "noch",
    "nicht",
    "daran",
    "gewöhnt"
   ],
   "answers": [
    "Ich habe mich noch nicht daran gewöhnt.",
    "Ich habe mich daran noch nicht gewöhnt."
   ],
   "explain": "noch nicht usually stands before the prepositional object (daran); the reflexive pronoun comes first."
  }
 ],
 "texts": [
  {
   "id": "tW-r01",
   "unit": 1,
   "title": "Umzug in die Kleinstadt",
   "text": "Seit drei Jahren wohne ich in einer kleinen Stadt am Rhein. Am Anfang fiel es mir schwer, weil ich dort niemanden kannte. Deshalb habe ich mich bei einem Sportverein angemeldet, in dem ich schnell Freunde gefunden habe. Heute kann ich mir kaum vorstellen, wieder in einer Großstadt zu leben. Obwohl die Wege zur Arbeit länger geworden sind, möchte ich von hier nicht mehr wegziehen.",
   "keys": [
    "seit drei Jahren",
    "am Anfang",
    "niemanden",
    "Sportverein",
    "Freunde",
    "kaum vorstellen",
    "Wege zur Arbeit",
    "wegziehen"
   ],
   "points": [
    "Verb second after an opening adverbial: Seit drei Jahren wohne ich …, Deshalb habe ich …, Heute kann ich …",
    "Verb last after weil, in dem and obwohl: … niemanden kannte, … gefunden habe, … geworden sind",
    "After the obwohl-clause the main clause starts with its verb: …, möchte ich …",
    "Unstressed pronouns stand right after the finite verb, a subject pronoun first: fiel es mir schwer, habe ich mich … angemeldet"
   ]
  },
  {
   "id": "tW-r02",
   "unit": 2,
   "title": "Der neue Kollege",
   "text": "Letzte Woche hat unsere Abteilung einen neuen Kollegen bekommen. Der Chef hat ihn uns am Montag in der Besprechung vorgestellt. Weil er vorher bei einem großen Konzern gearbeitet hat, bringt er viel Erfahrung mit. Ich habe ihm gleich am ersten Tag das Büro gezeigt und ihm unsere Abläufe erklärt. Er hat sich bei mir bedankt und mich zum Mittagessen eingeladen. Ich glaube, dass wir gut zusammenarbeiten werden.",
   "keys": [
    "letzte Woche",
    "Abteilung",
    "vorgestellt",
    "Konzern",
    "Erfahrung",
    "das Büro",
    "bedankt",
    "zusammenarbeiten"
   ],
   "points": [
    "Two pronouns: accusative before dative (hat ihn uns … vorgestellt)",
    "Pronoun before noun object: ihm … das Büro gezeigt, ihm unsere Abläufe erklärt",
    "Weil-clause in front, then verb first in the main clause: …, bringt er viel Erfahrung mit",
    "Endings: einen neuen Kollegen, bei einem großen Konzern, am ersten Tag",
    "Verb cluster at the end of the dass-clause: zusammenarbeiten werden"
   ]
  },
  {
   "id": "tW-r03",
   "unit": 3,
   "title": "Vier Tage arbeiten",
   "text": "Viele Menschen träumen davon, weniger zu arbeiten. Ich habe mich lange dagegen gewehrt, weil ich Angst vor finanziellen Problemen hatte. Vor einem Jahr habe ich mich trotzdem dazu entschlossen, meine Stelle auf vier Tage zu reduzieren. Seitdem kümmere ich mich freitags um meinen Garten und nehme mir Zeit für Dinge, auf die ich früher verzichten musste. Auf das Geld kommt es mir heute weniger an als auf die freie Zeit.",
   "keys": [
    "träumen",
    "gewehrt",
    "Angst",
    "entschlossen",
    "vier Tage",
    "Garten",
    "verzichten",
    "Geld"
   ],
   "points": [
    "da-word before an infinitive clause: träumen davon, … zu arbeiten; dazu entschlossen, … zu reduzieren",
    "Verbs with their prepositions: sich wehren gegen, Angst vor + dative, sich kümmern um, verzichten auf, ankommen auf",
    "Relative clause with a preposition, verb last: Dinge, auf die ich früher verzichten musste",
    "Verb second after Vor einem Jahr, Seitdem and Auf das Geld"
   ]
  },
  {
   "id": "tW-r04",
   "unit": 4,
   "title": "Noch einmal zwanzig",
   "text": "Wenn ich noch einmal zwanzig wäre, würde ich vieles anders machen. Ich hätte nach dem Abitur nicht sofort studiert, sondern wäre zuerst ein Jahr ins Ausland gegangen. Dort hätte ich eine Sprache lernen können, ohne dafür Prüfungen ablegen zu müssen. Meine Eltern hätten mich sicher unterstützt, wenn ich sie darum gebeten hätte. An meiner Berufswahl würde ich aber nichts ändern, denn meine Arbeit macht mir bis heute Freude.",
   "keys": [
    "zwanzig",
    "anders machen",
    "Abitur",
    "Ausland",
    "Sprache",
    "Prüfungen",
    "Eltern",
    "Berufswahl"
   ],
   "points": [
    "Wenn-clause with the verb last, then würde first in the main clause: Wenn ich … wäre, würde ich …",
    "Konjunktiv II of the past: hätte … studiert, wäre … gegangen, hätten … unterstützt",
    "Modal verb in the past: hätte … lernen können (double infinitive at the end)",
    "nicht …, sondern …: nicht sofort studiert, sondern … gegangen",
    "denn does not change the word order: denn meine Arbeit macht …"
   ]
  },
  {
   "id": "tW-r05",
   "unit": 5,
   "title": "Das neue Krankenhaus",
   "text": "In unserer Stadt wird seit zwei Jahren ein neues Krankenhaus gebaut. Das alte Gebäude musste abgerissen werden, weil es nicht mehr renoviert werden konnte. Die Kosten werden zum größten Teil vom Land getragen. Ursprünglich sollte der Neubau schon im Frühjahr eröffnet werden, doch der Termin ist mehrmals verschoben worden. Viele Bürger ärgern sich darüber, dass sie über die Gründe kaum informiert worden sind. Nun wird versprochen, dass die ersten Patienten im Herbst aufgenommen werden.",
   "keys": [
    "Krankenhaus",
    "abgerissen",
    "renoviert",
    "Kosten",
    "Frühjahr",
    "verschoben",
    "Gründe",
    "Herbst"
   ],
   "points": [
    "Passive with a modal verb: musste abgerissen werden; in the weil-clause: renoviert werden konnte",
    "Passive perfect: ist … verschoben worden; in the dass-clause: informiert worden sind",
    "The agent with von: vom Land getragen",
    "Verb second after In unserer Stadt, Ursprünglich and Nun; the subject follows the verb",
    "No placeholder es when position 1 is filled: Nun wird versprochen, dass … (but: Es wird versprochen, dass …)"
   ]
  }
 ]
}
);
