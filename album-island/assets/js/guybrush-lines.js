(function (global) {
  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function fill(template, album) {
    return template
      .replace(/\{title\}/g, album.title)
      .replace(/\{artist\}/g, album.artist)
      .replace(/\{score\}/g, album.score)
      .replace(/\{index\}/g, String(album.index));
  }

  function scoreValue(album) {
    return parseFloat(album.score);
  }

  function tierFor(album) {
    const score = scoreValue(album);
    if (score >= 9.5) return "legendary";
    if (score >= 8.5) return "great";
    if (score >= 7) return "good";
    if (score >= 5) return "mixed";
    return "low";
  }

  const ALBUM_LINES = {
    legendary: [
      "{score} for “{title}”? LeChuck would trade his beard for that rating.",
      "“{artist}” at {score} — that's Big Whoop-tier listening.",
      "A {score}? Even the map to Monkey Island doesn't score that high.",
      "I'd carry “{title}” through the governor's mansion. {score} earned.",
      "{artist} on {score}. The Scumm Bar would go quiet for this one.",
      "Row {index}: {score}. Stan would try to sell me insurance on the strength of it.",
      "“{title}” deserves {score}. Meathook's tough-guy act would crack.",
      "{score} out of ten? That's a tale worthy of the Voodoo Lady herself.",
      "If {score} were doubloons, “{title}” would buy me a ship and a hat upgrade.",
      "The ghost pirate in me respects {artist} at {score}. Mostly the alive part, though.",
      "{score}! I'd face the pox of LeChuck again for another spin of “{title}”.",
      "“{title}” at {score} — even Wally would stop filing long enough to listen.",
      "{artist} earned that {score}. I once rated grog a 9.9. This is in that league.",
      "A {score} on the ledger? That's legendary booty, mate.",
      "I'd tell Elaine “{title}” got a {score}.” She'd pretend not to care. She would.",
      "{score} on “{title}”? That's the kind of score you frame next to a map of Mêlée Island.",
      "Even the bone song sounds better after a {score} album. Don't ask.",
      "“{artist}” at {score} — I'd name a rubber chicken after this one. High honor.",
      "Row {index}, {score}. The cannibals would pause their recipe for this.",
    ],
    great: [
      "“{title}” at {score} — solid plunder. I'd swagger to it.",
      "{artist} on {score}. Not quite Big Whoop, but I'd sail for it.",
      "{score} is respectable. Better than most tavern sea shanties, anyway.",
      "Row {index}: {score} for {artist}. The ledger speaks well of you.",
      "“{title}” deserves a {score}. I'd hum it while insult sword fighting.",
      "{score} — that's a fine score from a mighty music critic. That's me.",
      "{artist} at {score}? I'd buy it from Stan if he somehow had it on cassette.",
      "A sturdy {score}. Like a good plank at the Scumm Bar — reliable.",
      "“{title}” on {score}. Even the cartographer would nod approvingly.",
      "{score} is good listening. I've had worse nights in the underground tunnels.",
      "{artist} earned {score}. I'd mention it to Herman Toothrot if he cared.",
      "“{title}” at {score} — I'd save it for the long boat ride to Dinky Island.",
      "{score}! Respectable. Not ghost-ship legendary, but I'd replay it.",
      "Row {index} says {score}. The jukebox at Stan's would accept this.",
      "{artist} on {score}. I'd trade three rubber chickens for another listen.",
      "“{title}” at {score} — Herman Toothrot would misplace his keys for it.",
      "A {score} like this could calm even the Largo LaGrande temper. Briefly.",
      "Great score, great album. I'd write a memoir chapter. Chapter one: {artist}.",
    ],
    good: [
      "“{title}” gets a {score}. Decent. I've rated worse while lost in the jungle.",
      "{artist} at {score} — not bad for something that isn't grog.",
      "{score} is fair. Like a map with only two wrong turns.",
      "Row {index}: {score}. I'd listen again if the Voodoo Lady insisted.",
      "“{title}” on {score}. Solid, if not pirate-king material.",
      "{score} — honest score. I respect honesty almost as much as treasure.",
      "{artist} at {score}. Better than the time I confused a sea shanty with a curse.",
      "A {score} for “{title}”. I'd put it on while polishing my insult sword.",
      "{score} is good enough for the long walk to the church on Mêlée.",
      "“{title}” at {score}. Not every album can be a {score}+ masterpiece. Few can.",
      "{artist} on {score} — I'd mention it casually to Carla. She'd raise an eyebrow.",
      "{score}. Respectable middle ground. Like choosing between two reasonable routes.",
      "Row {index} says {score}. I've filed worse opinions in triplicate.",
      "“{title}” earns {score}. I wouldn't sell my ship for it, but I'd keep it.",
      "{artist} at {score} — a fine evening listen after a day of pirating.",
    ],
    mixed: [
      "“{title}” at {score}. Hmm. Even I have off days, and I'm a mighty pirate.",
      "{score} for {artist}. Not cursed, but I wouldn't duel for it.",
      "Row {index}: {score}. I've stumbled into better music in the swamp.",
      "“{title}” on {score} — middling, like a map missing the X.",
      "{score}. Could be worse. I once rated a seagull 4.2. Long story.",
      "{artist} at {score}. I'd listen once, then go look for grog.",
      "A {score} is… fine. The Scumm Bar has seen hotter takes.",
      "“{title}” gets {score}. I won't insult it. I save those for sword fights.",
      "{score} — lukewarm, like grog left out during a cutscene.",
      "{artist} on {score}. Not bad enough to feed to the piranha poodles.",
      "Row {index} at {score}. I'd file this under “maybe on a rainy island day.”",
      "“{title}” at {score}. I've had stronger opinions about rubber chickens.",
      "{score}. The ledger is honest, even when the album isn't thrilling.",
      "{artist} at {score} — I'd shrug, which I do with great pirate dignity.",
      "A {score} for “{title}”. Not every voyage finds treasure.",
    ],
    low: [
      "“{title}” at {score}. Ouch. Even the ghost pirates winced.",
      "{score}? I'd rather navigate the maze of twisty little passages again.",
      "Row {index}: {score} for {artist}. Bold score. Brave score. Low score.",
      "“{title}” on {score} — I'd hide this rating from Stan. He'd sell disappointment.",
      "{score}. Not every album survives the pox of mediocrity.",
      "{artist} at {score}. I've lost insult sword fights with more dignity.",
      "A {score}? The Voodoo Lady would call that a learning experience.",
      "“{title}” gets {score}. I'd still respect your courage posting it.",
      "{score} — rough, like landing face-first on Dinky Island.",
      "{artist} on {score}. Even Wally's paperwork has higher peaks.",
      "Row {index} says {score}. Honest ledger. Harsh seas.",
      "“{title}” at {score}. Not LeChuck-bad, but LeChuck had better theme music.",
      "{score}. I'd rather be stuck in a rubber tree than replay this often.",
      "{artist} at {score} — a reminder that not every map leads to gold.",
      "A {score} for “{title}”. Tomorrow's another voyage, mate.",
    ],
  };

  const CLICK_GENERAL = [
    "I'm Guybrush Threepwood, mighty pirate and part-time album critic.",
    "Click me again and I might spoil a puzzle. Or just complain about grog.",
    "You found the easter egg! Now pretend it was intentional exploration.",
    "I used to want to be a mighty pirate. Now I rate albums. Progress?",
    "Look behind you! A three-headed monkey! …No? Worth a try.",
    "This ledger beats the Scumm Bar jukebox. Fewer sea shanty requests.",
    "I speak when spoken to. Or when I wander. Mostly when I wander.",
    "Ask me about Big Whoop. Actually, don't. Long story.",
    "If you hear ghost pirate music, that's not this page. Probably.",
    "I'm not lost. I'm on a curated tour of your taste.",
    "Insult sword fighting prepared me for hot takes. En garde!",
    "Stan once tried to sell me this website. I haggled him down to free.",
    "The Voodoo Lady said I'd end up reviewing music. She says a lot of things.",
    "Rubber chicken? No. Headphones? Also no. I travel light.",
    "Every click is a dialogue option. This one says “hello.”",
    "I'd trade my fine leather jacket for a higher average score. Almost.",
    "Monkey Island taught me patience. This list taught me numbers.",
    "You can close my speech bubble by waiting. Or clicking. Your adventure.",
    "I'm pixelated and opinionated. The two great P's of the Caribbean.",
    "If I had a dime for every album here, I'd buy the Scumm Bar.",
    "Point-and-click your way through the list. I'll point and comment.",
    "I'm basically a walkthrough hint that wandered off-script.",
    "The governor's mansion has worse wallpaper and better parties.",
    "You can sort by score. I sort by vibes and ghost stories.",
    "I once saved a game right before a bad take. Wise habit.",
  ];

  const CLICK_ALBUM = {
    legendary: [
      "You're staring at row {index}. {score} — elite taste, captain.",
      "“{title}”? You clicked me while THAT'S on screen. Respect.",
      "{artist} at {score}. You and I could share grog and agree.",
      "I was about to praise “{title}” anyway. Great minds, etc.",
    ],
    great: [
      "Ah, {artist}. {score}. You're hovering near the good stuff.",
      "“{title}” is right there. Solid {score}. I see you.",
      "Clicked me near row {index}? {score} — nice neighborhood.",
    ],
    good: [
      "“{title}” at {score}. A reasonable row to click me on.",
      "{artist} on {score} — middle of the chart, middle of the road. Fine.",
    ],
    mixed: [
      "You clicked me near “{title}” ({score}). Brave.",
      "Row {index} is {score}. I'm diplomatic. Mostly.",
    ],
    low: [
      "You clicked me by “{title}” ({score}). I won't pile on. Much.",
      "{artist} at {score}. We can still be friends. Pirate friends.",
    ],
  };

  const EXPAND_LINES = {
    legendary: [
      "“{title}” — {score}! Let me see those track ratings. This is the good stuff.",
      "You opened {artist}? Smart. A {score} album deserves a closer look.",
      "Ah, the crown jewel. {score} on “{title}”. I'll read every track note.",
    ],
    great: [
      "Track time for “{title}”. {score} usually means a few standouts in here.",
      "{artist} at {score} — let's see which songs earned it.",
      "Opening row {index}? Good taste. {score} is nothing to sneeze at.",
    ],
    good: [
      "“{title}” at {score}. Let's browse the track list together.",
      "Curious about {artist}? {score} tells part of the story.",
    ],
    mixed: [
      "“{title}” ({score}). Maybe a hidden gem in the tracks?",
      "You opened it — {score} means the notes might be interesting.",
    ],
    low: [
      "“{title}” at {score}. I'll keep an open mind on the tracks.",
      "Brave click on row {index}. {score} — let's see what's inside.",
    ],
  };

  const CLICK_BUSY = [
    "Hang on — I'm mid-tour. Click again in a moment.",
    "Shhh. I'm walking. Mighty pirates need concentration.",
    "One sec! I almost stepped on a pixel.",
  ];

  const DRAG_LINES = [
    "Thanks for the lift. Mighty pirates appreciate good carriage.",
    "I meant to stand here anyway. Totally intentional.",
    "New coordinates logged. The map was wrong; you were right.",
    "Careful — I'm a mighty pirate, not luggage.",
    "This spot has better grog vibes. I can tell.",
  ];

  global.GuybrushLines = {
    album: function (album) {
      const tier = tierFor(album);
      return fill(pick(ALBUM_LINES[tier]), album);
    },

    expand: function (album) {
      const tier = tierFor(album);
      const lines = EXPAND_LINES[tier] || ALBUM_LINES[tier];
      return fill(pick(lines), album);
    },

    click: function (album, isBusy) {
      if (isBusy) return pick(CLICK_BUSY);
      if (album) {
        const tier = tierFor(album);
        const lines = CLICK_ALBUM[tier];
        if (lines && lines.length) return fill(pick(lines), album);
      }
      return pick(CLICK_GENERAL);
    },

    drag: function () {
      return pick(DRAG_LINES);
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
