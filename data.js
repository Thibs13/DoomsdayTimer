// Liste de visionnage. `seen: true` = coché sur la liste d'origine (état initial).
// `wiki` = titres de pages Wikipedia (EN) essayés dans l'ordre pour trouver l'affiche.
// `type` : "film" | "serie" | "special". `out` = date de sortie (FR) si à venir.

const SECTIONS = [
  {
    id: "p1", title: "Phase 1", items: [
      { id: "iron-man", t: "Iron Man", y: 2008, type: "film", seen: true, wiki: ["Iron Man (2008 film)"] },
      { id: "hulk", t: "The Incredible Hulk", y: 2008, type: "film", seen: true, wiki: ["The Incredible Hulk (film)"] },
      { id: "iron-man-2", t: "Iron Man 2", y: 2010, type: "film", seen: true, wiki: ["Iron Man 2"] },
      { id: "thor", t: "Thor", y: 2011, type: "film", seen: true, wiki: ["Thor (film)"] },
      { id: "cap-1", t: "Captain America: The First Avenger", y: 2011, type: "film", seen: true, wiki: ["Captain America: The First Avenger"] },
      { id: "avengers", t: "The Avengers", y: 2012, type: "film", seen: true, wiki: ["The Avengers (2012 film)"] },
    ]
  },
  {
    id: "p2", title: "Phase 2", items: [
      { id: "iron-man-3", t: "Iron Man 3", y: 2013, type: "film", seen: true, wiki: ["Iron Man 3"] },
      { id: "thor-2", t: "Thor: The Dark World", y: 2013, type: "film", seen: true, wiki: ["Thor: The Dark World"] },
      { id: "cap-2", t: "Captain America: The Winter Soldier", y: 2014, type: "film", seen: true, wiki: ["Captain America: The Winter Soldier"] },
      { id: "gotg", t: "Guardians of the Galaxy", y: 2014, type: "film", seen: true, wiki: ["Guardians of the Galaxy (film)"] },
      { id: "ultron", t: "Avengers: Age of Ultron", y: 2015, type: "film", seen: true, wiki: ["Avengers: Age of Ultron"] },
      { id: "ant-man", t: "Ant-Man", y: 2015, type: "film", seen: true, wiki: ["Ant-Man (film)"] },
    ]
  },
  {
    id: "p3", title: "Phase 3", items: [
      { id: "civil-war", t: "Captain America: Civil War", y: 2016, type: "film", seen: true, wiki: ["Captain America: Civil War"] },
      { id: "doctor-strange", t: "Doctor Strange", y: 2016, type: "film", seen: true, wiki: ["Doctor Strange (2016 film)"] },
      { id: "gotg-2", t: "Guardians of the Galaxy Vol. 2", y: 2017, type: "film", seen: true, wiki: ["Guardians of the Galaxy Vol. 2"] },
      { id: "homecoming", t: "Spider-Man: Homecoming", y: 2017, type: "film", seen: true, wiki: ["Spider-Man: Homecoming"] },
      { id: "ragnarok", t: "Thor: Ragnarok", y: 2017, type: "film", seen: true, wiki: ["Thor: Ragnarok"] },
      { id: "black-panther", t: "Black Panther", y: 2018, type: "film", seen: true, wiki: ["Black Panther (film)"] },
      { id: "infinity-war", t: "Avengers: Infinity War", y: 2018, type: "film", seen: true, wiki: ["Avengers: Infinity War"] },
      { id: "ant-man-2", t: "Ant-Man and the Wasp", y: 2018, type: "film", seen: true, wiki: ["Ant-Man and the Wasp"] },
      { id: "captain-marvel", t: "Captain Marvel", y: 2019, type: "film", seen: true, wiki: ["Captain Marvel (film)"] },
      { id: "endgame", t: "Avengers: Endgame", y: 2019, type: "film", seen: true, wiki: ["Avengers: Endgame"] },
      { id: "far-from-home", t: "Spider-Man: Far From Home", y: 2019, type: "film", seen: true, wiki: ["Spider-Man: Far From Home"] },
    ]
  },
  {
    id: "p4", title: "Phase 4", items: [
      { id: "wandavision", t: "WandaVision", y: 2021, type: "serie", seen: true, wiki: ["WandaVision"] },
      { id: "falcon", t: "The Falcon and the Winter Soldier", y: 2021, type: "serie", seen: true, wiki: ["The Falcon and the Winter Soldier"] },
      { id: "loki-1", t: "Loki — Saison 1", y: 2021, type: "serie", seen: true, wiki: ["Loki season 1", "Loki (TV series)"] },
      { id: "black-widow", t: "Black Widow", y: 2021, type: "film", seen: true, wiki: ["Black Widow (2021 film)"] },
      { id: "what-if-1", t: "What If...? — Saison 1", y: 2021, type: "serie", seen: false, wiki: ["What If...? season 1", "What If...? (TV series)"] },
      { id: "shang-chi", t: "Shang-Chi and the Legend of the Ten Rings", y: 2021, type: "film", seen: true, wiki: ["Shang-Chi and the Legend of the Ten Rings"] },
      { id: "eternals", t: "Eternals", y: 2021, type: "film", seen: true, wiki: ["Eternals (film)"] },
      { id: "hawkeye", t: "Hawkeye", y: 2021, type: "serie", seen: true, wiki: ["Hawkeye (2021 TV series)"] },
      { id: "no-way-home", t: "Spider-Man: No Way Home", y: 2021, type: "film", seen: true, wiki: ["Spider-Man: No Way Home"] },
      { id: "moon-knight", t: "Moon Knight", y: 2022, type: "serie", seen: true, wiki: ["Moon Knight (miniseries)", "Moon Knight (TV series)"] },
      { id: "multiverse-madness", t: "Doctor Strange in the Multiverse of Madness", y: 2022, type: "film", seen: true, wiki: ["Doctor Strange in the Multiverse of Madness"] },
      { id: "ms-marvel", t: "Ms. Marvel", y: 2022, type: "serie", seen: false, wiki: ["Ms. Marvel (miniseries)", "Ms. Marvel (TV series)"] },
      { id: "love-thunder", t: "Thor: Love and Thunder", y: 2022, type: "film", seen: true, wiki: ["Thor: Love and Thunder"] },
      { id: "groot-1", t: "I Am Groot — Saison 1", y: 2022, type: "serie", seen: false, wiki: ["I Am Groot"] },
      { id: "she-hulk", t: "She-Hulk: Attorney at Law", y: 2022, type: "serie", seen: true, wiki: ["She-Hulk: Attorney at Law"] },
      { id: "werewolf", t: "Werewolf by Night", y: 2022, type: "special", seen: false, wiki: ["Werewolf by Night (film)", "Werewolf by Night (TV special)"] },
      { id: "wakanda-forever", t: "Black Panther: Wakanda Forever", y: 2022, type: "film", seen: true, wiki: ["Black Panther: Wakanda Forever"] },
      { id: "gotg-holiday", t: "The Guardians of the Galaxy Holiday Special", y: 2022, type: "special", seen: false, wiki: ["The Guardians of the Galaxy Holiday Special"] },
    ]
  },
  {
    id: "p5", title: "Phase 5", items: [
      { id: "quantumania", t: "Ant-Man and the Wasp: Quantumania", y: 2023, type: "film", seen: true, wiki: ["Ant-Man and the Wasp: Quantumania"] },
      { id: "gotg-3", t: "Guardians of the Galaxy Vol. 3", y: 2023, type: "film", seen: true, wiki: ["Guardians of the Galaxy Vol. 3"] },
      { id: "secret-invasion", t: "Secret Invasion", y: 2023, type: "serie", seen: true, wiki: ["Secret Invasion (miniseries)", "Secret Invasion (TV series)"] },
      { id: "groot-2", t: "I Am Groot — Saison 2", y: 2023, type: "serie", seen: false, wiki: ["I Am Groot"] },
      { id: "loki-2", t: "Loki — Saison 2", y: 2023, type: "serie", seen: true, wiki: ["Loki season 2", "Loki (TV series)"] },
      { id: "the-marvels", t: "The Marvels", y: 2023, type: "film", seen: false, wiki: ["The Marvels"] },
      { id: "what-if-2", t: "What If...? — Saison 2", y: 2023, type: "serie", seen: false, wiki: ["What If...? season 2", "What If...? (TV series)"] },
      { id: "echo", t: "Echo", y: 2024, type: "serie", seen: true, wiki: ["Echo (miniseries)"] },
      { id: "deadpool-wolverine", t: "Deadpool & Wolverine", y: 2024, type: "film", seen: true, wiki: ["Deadpool & Wolverine"] },
      { id: "agatha", t: "Agatha All Along", y: 2024, type: "serie", seen: false, wiki: ["Agatha All Along"] },
      { id: "what-if-3", t: "What If...? — Saison 3", y: 2024, type: "serie", seen: false, wiki: ["What If...? season 3", "What If...? (TV series)"] },
      { id: "brave-new-world", t: "Captain America: Brave New World", y: 2025, type: "film", seen: true, wiki: ["Captain America: Brave New World"] },
      { id: "daredevil-ba-1", t: "Daredevil: Born Again — Saison 1", y: 2025, type: "serie", seen: false, wiki: ["Daredevil: Born Again season 1", "Daredevil: Born Again"] },
      { id: "thunderbolts", t: "Thunderbolts*", y: 2025, type: "film", seen: true, wiki: ["Thunderbolts*"] },
      { id: "ironheart", t: "Ironheart", y: 2025, type: "serie", seen: false, wiki: ["Ironheart (miniseries)", "Ironheart (TV series)"] },
    ]
  },
  {
    id: "p6", title: "Phase 6", items: [
      { id: "fantastic-four", t: "The Fantastic Four: First Steps", y: 2025, type: "film", seen: true, wiki: ["The Fantastic Four: First Steps"] },
      { id: "wonder-man", t: "Wonder Man", y: 2026, type: "serie", seen: false, wiki: ["Wonder Man (miniseries)", "Wonder Man (TV series)"] },
      { id: "daredevil-ba-2", t: "Daredevil: Born Again — Saison 2", y: 2026, type: "serie", seen: false, wiki: ["Daredevil: Born Again season 2", "Daredevil: Born Again"] },
      { id: "punisher", t: "The Punisher: One Last Kill", y: 2026, type: "special", seen: false, wiki: ["The Punisher: One Last Kill"] },
      { id: "brand-new-day", t: "Spider-Man: Brand New Day", y: 2026, type: "film", seen: false, wiki: ["Spider-Man: Brand New Day"] },
      { id: "visionquest", t: "VisionQuest", y: 2026, type: "serie", seen: false, wiki: ["VisionQuest"] },
      { id: "doomsday", t: "Avengers: Doomsday", y: 2026, type: "film", seen: false, out: "2026-12-16", wiki: ["Avengers: Doomsday"] },
      { id: "secret-wars", t: "Avengers: Secret Wars", y: 2027, type: "film", seen: false, out: "2027-12-17", wiki: ["Avengers: Secret Wars"] },
    ]
  },
  {
    id: "fox-ff", title: "Fantastic Four (Fox)", items: [
      { id: "ff-2005", t: "Fantastic Four", y: 2005, type: "film", seen: false, wiki: ["Fantastic Four (2005 film)"] },
      { id: "ff-silver-surfer", t: "Fantastic Four: Rise of the Silver Surfer", y: 2007, type: "film", seen: false, wiki: ["Fantastic Four: Rise of the Silver Surfer"] },
      { id: "ff-2015", t: "Fantastic Four", y: 2015, type: "film", seen: false, wiki: ["Fantastic Four (2015 film)"] },
    ]
  },
  {
    id: "fox-xmen", title: "X-Men (20th Century Fox)", items: [
      { id: "x-men", t: "X-Men", y: 2000, type: "film", seen: true, wiki: ["X-Men (film)"] },
      { id: "x2", t: "X2: X-Men United", y: 2003, type: "film", seen: true, wiki: ["X2 (film)"] },
      { id: "last-stand", t: "X-Men: The Last Stand", y: 2006, type: "film", seen: true, wiki: ["X-Men: The Last Stand"] },
      { id: "origins-wolverine", t: "X-Men Origins: Wolverine", y: 2009, type: "film", seen: true, wiki: ["X-Men Origins: Wolverine"] },
      { id: "first-class", t: "X-Men: First Class", y: 2011, type: "film", seen: true, wiki: ["X-Men: First Class"] },
      { id: "the-wolverine", t: "The Wolverine", y: 2013, type: "film", seen: true, wiki: ["The Wolverine (film)"] },
      { id: "dofp", t: "X-Men: Days of Future Past", y: 2014, type: "film", seen: true, wiki: ["X-Men: Days of Future Past"] },
      { id: "deadpool", t: "Deadpool", y: 2016, type: "film", seen: true, wiki: ["Deadpool (film)"] },
      { id: "apocalypse", t: "X-Men: Apocalypse", y: 2016, type: "film", seen: true, wiki: ["X-Men: Apocalypse"] },
      { id: "logan", t: "Logan", y: 2017, type: "film", seen: true, wiki: ["Logan (film)"] },
      { id: "deadpool-2", t: "Deadpool 2", y: 2018, type: "film", seen: true, wiki: ["Deadpool 2"] },
      { id: "dark-phoenix", t: "Dark Phoenix", y: 2019, type: "film", seen: true, wiki: ["Dark Phoenix (film)"] },
      { id: "new-mutants", t: "The New Mutants", y: 2020, type: "film", seen: true, wiki: ["The New Mutants (film)"] },
    ]
  },
  {
    id: "sony", title: "Sony's Spider-Man Universe", items: [
      { id: "venom", t: "Venom", y: 2018, type: "film", seen: true, wiki: ["Venom (2018 film)"] },
      { id: "venom-2", t: "Venom: Let There Be Carnage", y: 2021, type: "film", seen: true, wiki: ["Venom: Let There Be Carnage"] },
      { id: "morbius", t: "Morbius", y: 2022, type: "film", seen: false, wiki: ["Morbius (film)"] },
      { id: "madame-web", t: "Madame Web", y: 2024, type: "film", seen: false, wiki: ["Madame Web (film)"] },
      { id: "kraven", t: "Kraven the Hunter", y: 2024, type: "film", seen: false, wiki: ["Kraven the Hunter (film)"] },
      { id: "venom-3", t: "Venom: The Last Dance", y: 2024, type: "film", seen: false, wiki: ["Venom: The Last Dance"] },
    ]
  },
  {
    id: "raimi", title: "Spider-Man de Sam Raimi", items: [
      { id: "spider-man-2002", t: "Spider-Man", y: 2002, type: "film", seen: true, wiki: ["Spider-Man (2002 film)"] },
      { id: "spider-man-2", t: "Spider-Man 2", y: 2004, type: "film", seen: true, wiki: ["Spider-Man 2"] },
      { id: "spider-man-3", t: "Spider-Man 3", y: 2007, type: "film", seen: true, wiki: ["Spider-Man 3"] },
    ]
  },
  {
    id: "amazing", title: "The Amazing Spider-Man", items: [
      { id: "amazing-1", t: "The Amazing Spider-Man", y: 2012, type: "film", seen: true, wiki: ["The Amazing Spider-Man (film)"] },
      { id: "amazing-2", t: "The Amazing Spider-Man 2", y: 2014, type: "film", seen: true, wiki: ["The Amazing Spider-Man 2"] },
    ]
  },
  {
    id: "spider-verse", title: "Spider-Verse (animation)", items: [
      { id: "into-sv", t: "Spider-Man: Into the Spider-Verse", y: 2018, type: "film", seen: true, wiki: ["Spider-Man: Into the Spider-Verse"] },
      { id: "across-sv", t: "Spider-Man: Across the Spider-Verse", y: 2023, type: "film", seen: true, wiki: ["Spider-Man: Across the Spider-Verse"] },
      { id: "beyond-sv", t: "Spider-Man: Beyond the Spider-Verse", y: 2027, type: "film", seen: false, out: "2027-06-18", wiki: ["Spider-Man: Beyond the Spider-Verse"] },
    ]
  },
];

const DOOMSDAY_RELEASE = "2026-12-16T00:00:00+01:00"; // sortie France
