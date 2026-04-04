// ESL Games Data
export const ESL_GAMES_CATEGORIES = [
  { id: 'flashcard', name: 'Flashcard Games', emoji: '🎴', color: '#667eea' },
  { id: 'circle', name: 'Circle Games', emoji: '⭕', color: '#f093fb' },
  { id: 'cup', name: 'Cup Games', emoji: '🥤', color: '#f97316' },
  { id: 'blindfold', name: 'Blindfold Games', emoji: '🙈', color: '#8b5cf6' },
  { id: 'hoop', name: 'Hoop Games', emoji: '⭕', color: '#06b6d4' },
  { id: 'dice', name: 'Dice Games', emoji: '🎲', color: '#eab308' },
  { id: 'ball', name: 'Ball Games', emoji: '⚽', color: '#dc2626' },
  { id: 'warmup', name: 'Warm-Up Songs & Chants', emoji: '🎵', color: '#ec4899' },
  { id: 'phonics', name: 'Phonics Games', emoji: '🔤', color: '#14b8a6' },
  { id: 'numbers', name: 'Number & Counting Games', emoji: '🔢', color: '#f59e0b' },
  { id: 'board', name: 'Board & Card Games', emoji: '🃏', color: '#6366f1' },
  { id: 'online', name: 'Online Games', emoji: '💻', color: '#3b82f6' },
  { id: 'roleplay', name: 'Role-Play & Speaking', emoji: '🎭', color: '#8b5cf6' },
  { id: 'parents', name: 'Parents Day Games', emoji: '👨‍👩‍👧‍👦', color: '#db2777' },
  { id: 'outdoor', name: 'Outdoor & Movement Games', emoji: '🌳', color: '#16a34a' },
  { id: 'holiday', name: 'Holiday & Special Occasions', emoji: '🎉', color: '#dc2626' },
  { id: 'misc', name: 'Miscellaneous Games', emoji: '🎲', color: '#4b5563' },
  { id: 'grammar', name: 'Grammar Games', emoji: '📚', color: '#4ade80' },
  { id: 'vocabulary', name: 'Vocabulary Games', emoji: '📖', color: '#60a5fa' },
  { id: 'listening', name: 'Listening Games', emoji: '👂', color: '#f472b6' },
  { id: 'speaking', name: 'Speaking Games', emoji: '🗣️', color: '#fb923c' },
  { id: 'reading', name: 'Reading Games', emoji: '📄', color: '#a78bfa' },
  { id: 'writing', name: 'Writing Games', emoji: '✍️', color: '#34d399' },
  { id: 'pronunciation', name: 'Pronunciation Games', emoji: '🎤', color: '#fbbf24' },
  { id: 'icebreaker', name: 'Icebreaker Games', emoji: '🤝', color: '#2dd4bf' },
  { id: 'team', name: 'Team Competition', emoji: '🏆', color: '#f87171' }
];

export const ESL_GAMES = {
  flashcard: [
    {
      id: 'f-001',
      name: 'Flashcard Path Game',
      materials: 'Flashcards',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      description: 'Place flashcards in a path on floor. Young students crawl along path.',
      instructions: [
        'Place flashcards in a path on floor',
        'Young students crawl along path',
        'At each card, stop and say word',
        'Before crawling to next',
        'Very engaging for young learners'
      ],
      variations: 'Different paths. Older students hop instead of crawl.'
    },
    {
      id: 'm-004',
      name: 'Hanging Flashcards',
      materials: 'Flashcards, string, clothespins',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Hang flashcards from a string at different heights. Students jump to reach and grab.',
      instructions: [
        'Hang flashcards from a string at different heights',
        'Students jump to reach and grab cards',
        'Must say word on card they grabbed',
        'Fun physical activity',
        'Combine movement with vocabulary'
      ],
      variations: 'Different heights. Multiple strings.'
    },
    {
      id: 'm-005',
      name: 'Chair Race',
      materials: 'Chairs, flashcards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place chairs with flashcards in a line. Two students race from one end to other.',
      instructions: [
        'Place chairs with flashcards in a line',
        'Two students race from one end to other',
        'Saying each word as they pass',
        'First to finish with all correct words wins',
        'Exciting race format',
        'Practice speaking under pressure'
      ],
      variations: 'Team race. More cards.'
    },
    {
      id: 'm-006',
      name: 'Railway Track Game',
      materials: 'Flashcards in two parallel lines',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place flashcards in two rows on floor like train tracks. Students walk along tracks.',
      instructions: [
        'Place flashcards in two rows on floor like train tracks',
        'Students walk along "tracks"',
        'Saying each word',
        'If they step off track, say a bonus word',
        'Imaginative train journey',
        'Practice vocabulary'
      ],
      variations: 'Different track shapes. Obstacles.'
    },
    {
      id: 'm-007',
      name: 'Magic Game / Magic Bad Flashcard',
      materials: 'Flashcards, a special "magic" card',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Include one special card in a set (the "magic" card). Fan out cards.',
      instructions: [
        'Include one special card in a set',
        'This is the "magic" card',
        'Fan out cards',
        'A student picks one',
        'If it\'s magic card — everyone claps!',
        'Otherwise, say the word'
      ],
      variations: 'Multiple magic cards. Different magic effects.'
    },
    {
      id: 'm-008',
      name: 'Blow Away Cards',
      materials: 'Flashcards, table',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '5-10 min',
      players: 'Whole class',
      description: 'Place flashcards on edge of a table. Students blow them off one at a time.',
      instructions: [
        'Place flashcards on edge of a table',
        'Students blow them off table one at a time',
        'As each card falls, say the word',
        'Fun for very young learners',
        'Playful and engaging',
        'Practice vocabulary'
      ],
      variations: 'Different breath strengths. Distance challenge.'
    },
    {
      id: 'm-009',
      name: 'Hungry Crocodile',
      materials: 'Flashcards, a "crocodile" (drawing or toy)',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Draw a crocodile on board (mouth open). Place flashcards around crocodile.',
      instructions: [
        'Draw a crocodile on board (mouth open)',
        'Place flashcards around crocodile',
        '"Feed" crocodile by saying the word',
        'Put the card in the crocodile\'s mouth',
        'Fun story element',
        'Practice vocabulary'
      ],
      variations: 'Different animals. Different "hungry" characters.'
    },
    {
      id: 'm-010',
      name: 'Gorilla Chest Beating',
      materials: 'Flashcards',
      difficulty: 'Beginner',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students act like gorillas — beat their chest and walk around saying words.',
      instructions: [
        'Students act like gorillas',
        'Beat their chest and walk around',
        'When they reach a flashcard, stop beating',
        'Say the word',
        'Continue gorilla-walking to next card',
        'Fun movement + vocabulary'
      ],
      variations: 'Different animals. Different movements.'
    },
    {
      id: 'm-011',
      name: 'Monkey in the Middle (Cup Version)',
      materials: 'Cups, flashcard',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place a flashcard under one cup among several. Students take turns guessing.',
      instructions: [
        'Place a flashcard under one cup among several',
        'Students take turns guessing which cup has the card',
        '"Monkey" in the middle tries to distract or trick them',
        'Reveal and say the word',
        'Fun guessing game',
        'Practice vocabulary'
      ],
      variations: 'More cups. Multiple cards.'
    },
    {
      id: 'm-012',
      name: 'Tap Tap Speak',
      materials: 'Flashcards on the board',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Student comes to board, closes their eyes. Teacher taps a flashcard with a pointer.',
      instructions: [
        'Student comes to board, closes their eyes',
        'Teacher taps a flashcard with a pointer',
        'Student opens eyes, taps the same card',
        'Says the word',
        'Variation: Tap multiple cards — student must say all of them',
        'Memory + vocabulary',
        'Challenge focus'
      ],
      variations: 'More cards. Faster tapping.'
    },
    {
      id: 'm-013',
      name: '10 Finger Game',
      materials: 'Flashcards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Teacher holds up 10 fingers. Students see 10 flashcards briefly. Lower one finger.',
      instructions: [
        'Teacher holds up 10 fingers',
        'Students see 10 flashcards briefly',
        'Lower one finger (remove one card)',
        'Students guess which word is missing',
        'Continue until all 10 fingers (cards) are gone',
        'Memory challenge',
        'Practice vocabulary'
      ],
      variations: 'Different number of fingers. Team competition.'
    },
    {
      id: 'm-014',
      name: 'Brain Booster Warmup',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-14',
      duration: '5-10 min',
      players: 'Whole class',
      description: 'Quick mental exercises to wake up the brain. Combine actions with vocabulary.',
      instructions: [
        'Quick mental exercises to wake up the brain',
        '"Touch your nose and say \'apple\'!"',
        '"Clap three times and say \'banana\'!"',
        'Combine physical actions with vocabulary recall',
        'Fast-paced thinking',
        'Warm up the class'
      ],
      variations: 'Different actions. Different complexity.'
    },
    {
      id: 'm-015',
      name: 'Words Matching Activity',
      materials: 'Word cards and picture cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Spread word cards on one side, picture cards on other. Students match each word.',
      instructions: [
        'Spread word cards on one side',
        'Picture cards on the other',
        'Students match each word to its picture',
        'Say the word when making the match',
        'Visual association',
        'Practice reading and recognition'
      ],
      variations: 'Different categories. Timed challenge.'
    },
    {
      id: 'm-016',
      name: 'Teach Various Topics Using Balloons',
      materials: 'Balloons, marker',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Write letters, CVCs, or numbers on balloons. Toss balloons around.',
      instructions: [
        'Write letters, CVCs, or numbers on balloons',
        'Toss balloons around the room',
        'Students catch one and say what\'s on it',
        'Pop balloons at the end for a fun finale',
        'High energy activity',
        'Practice different topics'
      ],
      variations: 'Different writing. Different balloon games.'
    },
    {
      id: 'm-017',
      name: 'Magic Colors',
      materials: 'Color flashcards, color objects',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Show a color card. Students find something of that color in the room.',
      instructions: [
        'Show a color card',
        'Students find something of that color in the room',
        '"Red! I see a red book!"',
        'Touch the object while saying the color word',
        'Real-world connection',
        'Practice colors vocabulary'
      ],
      variations: 'Different colors. Different objects.'
    },
    {
      id: 'm-018',
      name: 'Parachute Umbrella Game (Colors)',
      materials: 'A play parachute or large cloth, colored balls',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students hold parachute edges. Throw colored balls on top. Call a color.',
      instructions: [
        'Students hold parachute edges',
        'Throw colored balls on top',
        'Call a color',
        'Students lift the parachute to make that color ball fly off',
        'Say the color word together',
        'Cooperative activity',
        'Practice colors vocabulary'
      ],
      variations: 'Different colored objects. Team colors.'
    },
    {
      id: 'm-019',
      name: 'Tunnel Play Game',
      materials: 'A pop-up tunnel or desks with blankets',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Set up a tunnel in the classroom. Place flashcards inside.',
      instructions: [
        'Set up a tunnel in the classroom',
        'Place flashcards inside the tunnel',
        'Students crawl through, collecting and saying each word',
        'Very engaging for young learners',
        'Adventure element',
        'Practice vocabulary in fun context'
      ],
      variations: 'Different tunnels. Obstacles inside.'
    },
    {
      id: 'm-020',
      name: 'Lunch Box Game',
      materials: 'A lunch box, small food flashcards or toy food',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place food items in a lunch box. Students reach in without looking.',
      instructions: [
        'Place food items in a lunch box',
        'Students reach in without looking',
        'Pull out an item',
        'Say: "I have a sandwich!"',
        'Practice food vocabulary',
        'Surprise element',
        'Fun for younger students'
      ],
      variations: 'Different lunch boxes. Different food.'
    },
    {
      id: 'm-021',
      name: 'Go to Blue Triangle',
      materials: 'Colored shape flashcards on floor',
      difficulty: 'Beginner',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place colored shapes around the room. Teacher calls: "Go to the blue triangle!"',
      instructions: [
        'Place colored shapes around the room',
        '"Go to the blue triangle!"',
        'Students run to the correct shape',
        'Practice colors + shapes + listening comprehension',
        'Movement + learning',
        'Combine multiple concepts'
      ],
      variations: 'Different shapes. Different colors.'
    },
    {
      id: 'm-022',
      name: 'Color the Clothes',
      materials: 'Clothing outline worksheets, crayons',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Give each student a worksheet with clothing outlines. Teacher calls colors.',
      instructions: [
        'Give each student a worksheet with clothing outlines',
        'Teacher calls: "Color the shirt RED!"',
        'Students color accordingly',
        'Then say: "The shirt is red."',
        'Creative + vocabulary',
        'Practice colors + clothing'
      ],
      variations: 'Different clothing. Different coloring.'
    },
    {
      id: 'm-023',
      name: 'Underpass Game',
      materials: 'Desks or chairs arranged as an underpass, flashcards',
      difficulty: 'Beginner',
      ageGroup: '5-10',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Create a low "underpass" with desks. Students crawl under.',
      instructions: [
        'Create a low "underpass" with desks',
        'Place flashcards along the path',
        'Students crawl under while flashcards are placed',
        'Say each word as they crawl past it',
        'Adventure element',
        'Fun physical activity'
      ],
      variations: 'Different underpass designs. Obstacles.'
    },
    {
      id: 'm-024',
      name: 'Cup Rate Game',
      materials: 'Cups, flashcards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students flip cups. Under each cup is a flashcard.',
      instructions: [
        'Students flip cups',
        'Under each cup is a flashcard',
        'They must say the word',
        'Rate it (like/dislike): "Apple — I like apples!"',
        'Quick-paced review game',
        'Express opinions'
      ],
      variations: 'Different rating scales. Different categories.'
    },
    {
      id: 'm-025',
      name: 'Chair Bridge',
      materials: 'Chairs arranged as a bridge, flashcards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place chairs in a row to create a "bridge." Students walk across.',
      instructions: [
        'Place chairs in a row to create a "bridge"',
        'Students walk across the bridge',
        'Saying a word at each chair',
        'If they "fall off," answer a question to get back on',
        'Imaginative bridge crossing',
        'Practice vocabulary'
      ],
      variations: 'Different bridge designs. Different challenges.'
    },
    {
      id: 'm-026',
      name: 'Muxi Finger Game (Family Topic)',
      materials: 'Hand-drawn family finger puppets',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Draw faces on fingers — each finger is a family member.',
      instructions: [
        'Draw faces on fingers',
        'Each finger is a family member',
        'Wiggle a finger and say',
        '"This is my father. This is my mother."',
        'Great for family vocabulary with very young learners',
        'Cute and engaging',
        'Hands-on learning'
      ],
      variations: 'Different finger puppets. Different families.'
    },
    {
      id: 'm-027',
      name: 'ESL Game for Body Parts',
      materials: 'None (or body parts flashcards)',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: '"Touch your nose! Touch your ears! Touch your knees!" Students follow instructions.',
      instructions: [
        'Give instructions: "Touch your nose! Touch your ears! Touch your knees!"',
        'Students follow instructions',
        'Variation: "Simon says touch your ___"',
        'Only do it if teacher says "Simon says"',
        'TPR body parts practice',
        'Kinesthetic learning'
      ],
      variations: 'Different body parts. Simon Says variations.'
    },
    {
      id: 'm-028',
      name: 'ESL Activity for Shapes/Numbers/Colors',
      materials: 'Shape/number/color cards, objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Combine three topics: "Find a red circle!" "Find two blue triangles!"',
      instructions: [
        'Combine three topics',
        '"Find a red circle!"',
        '"Find two blue triangles!"',
        'Students search room for matching objects',
        'Practice multiple concepts together',
        'Build complexity',
        'Real-world application'
      ],
      variations: 'Different combinations. More concepts.'
    },
    {
      id: 'm-029',
      name: 'Make a Sentence Warm-Up (Ting Dong)',
      materials: 'Bell or chime',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '5-10 min',
      players: 'Whole class',
      description: 'Ring the bell: "Ting dong!" Students must immediately make a sentence.',
      instructions: [
        'Ring the bell: "Ting dong!"',
        'Students must immediately make a sentence',
        'Using a target word',
        'Quick thinking + sentence construction practice',
        'Fast-paced',
        'Improve fluency'
      ],
      variations: 'Different bells. Different word requirements.'
    },
    {
      id: 'm-030',
      name: 'What is Under Basket',
      materials: 'Flashcards, Basket',
      difficulty: 'Beginner',
      ageGroup: '3-7',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place flashcards face down under basket, lift briefly for students to identify.',
      instructions: [
        'Place cards face down under basket',
        'Lift briefly - students identify',
        'First correct gets point'
      ],
      variations: 'More baskets. Faster lifting.'
    },
    {
      id: 'm-031',
      name: 'What is Missing Game',
      materials: 'Flashcards 5-8',
      difficulty: 'Beginner',
      ageGroup: '3-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Show cards, close eyes, remove one, guess which missing.',
      instructions: [
        'Show all cards openly',
        'Students close eyes',
        'Teacher removes one card',
        'Students call out missing card'
      ],
      variations: 'More cards. Remove two cards.'
    },
    {
      id: 'm-032',
      name: 'Flyswatter Race',
      materials: 'Flashcards, 2 Flyswatters',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Two teams race to swat correct card when word called.',
      instructions: [
        'Divide class into two teams',
        'Stick cards on board in grid',
        'One student per team with swatter',
        'Teacher calls word - first to swat wins'
      ],
      variations: 'Team competition. Different grid layouts.'
    },
    {
      id: 'm-033',
      name: 'Peek-a-Boo Cards',
      materials: 'Flashcards, Cloth',
      difficulty: 'Beginner',
      ageGroup: '3-7',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Slowly reveal covered card while students guess.',
      instructions: [
        'Cover card completely with cloth',
        'Slowly reveal one side',
        'Students guess before fully shown',
        'Correct guesser holds next card'
      ],
      variations: 'Faster reveals. Multiple cards.'
    },
    {
      id: 'm-034',
      name: 'Memory Memorizer',
      materials: 'Flashcards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Show cards 15 seconds, hide, recall as many as possible.',
      instructions: [
        'Show set of cards for 15 seconds',
        'Hide all cards completely',
        'Students recall from memory',
        'Point for each correctly recalled word'
      ],
      variations: 'Different time limits. More cards.'
    },
    {
      id: 'm-035',
      name: 'Flip-Flop Match',
      materials: 'Flashcard pairs',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Memory game flipping two cards to find matches.',
      instructions: [
        'Cards face down in grid pattern',
        'Student flips two at a time',
        'Match = keep the pair',
        'Most pairs wins game'
      ],
      variations: 'More pairs. Different grid sizes.'
    },
    {
      id: 'm-036',
      name: 'Turn the Card',
      materials: 'Large Flashcards',
      difficulty: 'Beginner',
      ageGroup: '4-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Turn face-down card on board and say word/sentence.',
      instructions: [
        'Cards stuck face down on board',
        'Student turns one over',
        'Must say word or use in sentence',
        'Correct stays up, wrong goes back down'
      ],
      variations: 'More cards. Team turns.'
    },
    {
      id: 'm-037',
      name: 'Token Placement',
      materials: 'Flashcards, Tokens/chips',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place token on correct card when teacher says word.',
      instructions: [
        'Cards lined up on table',
        'Each student has tokens',
        'Teacher says word - place token on correct card',
        'Check answers together, score points'
      ],
      variations: 'Different tokens. Point system.'
    },
    {
      id: 'm-038',
      name: 'Stick on Board Race',
      materials: 'Flashcards, Tape/blu-tack',
      difficulty: 'Beginner',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Race to find called card and stick it on board.',
      instructions: [
        'Teacher calls out a word',
        'Students race to find that card',
        'First to stick it on board wins point',
        'Variation: call category name instead'
      ],
      variations: 'Different board locations. Team races.'
    },
    {
      id: 'm-039',
      name: 'New Word Introduction',
      materials: 'Flashcards',
      difficulty: 'Beginner',
      ageGroup: 'All ages',
      duration: '5-10 min',
      players: 'Whole class',
      description: 'Systematic presentation of new vocabulary with repetition.',
      instructions: [
        'Hold up card clearly visible',
        'Say word clearly with emphasis',
        'Whole class repeats chorally',
        'Show again - students say without model',
        'Use word in simple sentence'
      ],
      variations: 'Different presentation styles. Group repetition.'
    },
    {
      id: 'm-040',
      name: 'Word Elaboration Map',
      materials: 'Flashcards, Whiteboard',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '7-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Build mind map expanding vocabulary around each card.',
      instructions: [
        'Show card e.g. apple',
        'Ask: What color? Where buy? Like it?',
        'Build word map on whiteboard around card',
        'Practice making sentences with expanded vocab'
      ],
      variations: 'Different word types. Class mapping.'
    },
    {
      id: 'm-041',
      name: 'Bazaar Scramble',
      materials: 'Many Flashcards spread out',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Cards spread like market, run to find called word.',
      instructions: [
        'Spread flashcards all over room like market',
        'Teacher calls word or description',
        'Students run to find correct card',
        'Bring back to teacher first = winner'
      ],
      variations: 'Different spread patterns. Team races.'
    },
    {
      id: 'm-042',
      name: 'Hide and Seek Card',
      materials: '1 Flashcard hidden',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Hide card somewhere in room while eyes closed.',
      instructions: [
        'All students close eyes',
        'Teacher hides one card somewhere in room',
        'Students open eyes and search',
        'Finder must say word in full sentence'
      ],
      variations: 'Multiple hidden cards. Time limit.'
    },
    {
      id: 'm-043',
      name: 'Boys vs Girls Teams',
      materials: 'Flashcards',
      difficulty: 'Beginner',
      ageGroup: '5-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Team competition - first side to say word gets point.',
      instructions: [
        'Divide class into Boys vs Girls (or Team A/B)',
        'Show flashcard - first team to say correctly scores',
        'Keep running score on board',
        'Variation: must use word in sentence for older kids'
      ],
      variations: 'Different team divisions. Sentence requirement.'
    },
    {
      id: 'm-044',
      name: 'Teacher Guess the Card',
      materials: 'Cards + sticky notes covering words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '7-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students give clues so others can guess their card.',
      instructions: [
        'Each student gets card covered by sticky note',
        'Walk around showing card to classmates',
        'Give clues: actions, sounds, descriptions',
        'Teacher tries to guess by listening'
      ],
      variations: 'Different clue types. Time limits.'
    },
    {
      id: 'm-045',
      name: 'Identical Pairs Draw',
      materials: 'Two identical sets of cards',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Draw from both sets, match to keep pair.',
      instructions: [
        'Shuffle both sets separately',
        'Draw one card from each set',
        'If they match - say word and keep pair',
        'If no match - pass to next student'
      ],
      variations: 'More sets. Different matching rules.'
    },
    {
      id: 'm-046',
      name: 'Circle Point To Game',
      materials: 'Cards arranged in circle on floor',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Cards in circle, point or jump to correct one.',
      instructions: [
        'Place flashcards in circle on floor',
        'Students stand around circle',
        'Teacher calls a vocabulary word',
        'Students must point to or jump on correct card'
      ],
      variations: 'Different circle sizes. Jump vs point.'
    },
    {
      id: 'm-047',
      name: 'Large Review Challenge',
      materials: 'Many large flashcards 10-15',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Memorize many large cards then recall all.',
      instructions: [
        'Spread 10-15 large flashcards visibly',
        'Give students 30 seconds to memorize',
        'Remove all cards completely',
        'Students write down or call out all remembered words'
      ],
      variations: 'Different time limits. More cards.'
    },
    {
      id: 'm-048',
      name: 'Dramatic Shuffle Pick',
      materials: 'Flashcards fanned out',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Shuffle dramatically, pick card and say word.',
      instructions: [
        'Fan out cards face down',
        'Shuffle them dramatically while students watch',
        'A student picks one card randomly',
        'They must say the word and/or use it in sentence'
      ],
      variations: 'Different shuffle styles. Multiple picks.'
    },
    {
      id: 'm-049',
      name: 'Birds Nest Hoop Game',
      materials: 'Flashcards, Hoops/circles as nests',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '4-9',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Hoops as nests with cards inside, run on command.',
      instructions: [
        'Place several hoops on floor as birds\' nests',
        'Put flashcard face down in each hoop',
        'Students walk around the nests',
        'On \'Go home!\' they run to nest, pick card, say word'
      ],
      variations: 'Different nest designs. More hoops.'
    },
    {
      id: 'm-050',
      name: 'Basket Reach Game',
      materials: 'Flashcards, Basket/container',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Reach into basket blind, pull out and say word.',
      instructions: [
        'Place flashcard inside basket',
        'Teacher walks around classroom with basket',
        'Students reach in and pull out card',
        'Immediately say word and/or make sentence'
      ],
      variations: 'Different baskets. More students picking.'
    },
    {
      id: 'm-051',
      name: 'Playing Card Style Deal',
      materials: 'Card-style flashcards with numbers',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '7-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Deal cards, play when category is called.',
      instructions: [
        'Deal 3-5 cards to each student',
        'Teacher calls a category name',
        'Students who have matching card play it saying word',
        'First to play all their cards wins'
      ],
      variations: 'Different card games. More cards dealt.'
    },
    {
      id: 'm-052',
      name: 'Between Hoops Sort',
      materials: 'Flashcards, 2 Hoops apart',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-11',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Sort cards into correct hoop by category.',
      instructions: [
        'Place two hoops some distance apart',
        'Student stands between hoops holding card',
        'Teacher calls category (e.g., animals)',
        'If matches throw into hoop A, if not hoop B'
      ],
      variations: 'More hoops. Different categories.'
    },
    {
      id: 'm-053',
      name: 'Hoop Basket Toss Points',
      materials: 'Cards, Hoops at distances, Basket center',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pick card say word, toss into hoop for points.',
      instructions: [
        'Basket in center with cards spread around',
        'Hoops placed at different distances',
        'Pick card say word then throw into hoop',
        'Farther hoops = more points earned'
      ],
      variations: 'Different hoop distances. Different point values.'
    },
    {
      id: 'm-054',
      name: 'Flipping Hoop Roll Land',
      materials: 'Cards face down line, Hula hoop',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-11',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Roll hoop along line of cards, say word landed on.',
      instructions: [
        'Place flashcards face down in line on floor',
        'Student rolls or throws hula hoop along line',
        'Whatever card hoop lands on/near - say that word'
      ],
      variations: 'Different rolling techniques. More cards.'
    },
    {
      id: 'm-055',
      name: 'Travelling Hoop Path',
      materials: 'Multiple hoops path, Cards between hoops',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Jump between hoops collecting cards along way.',
      instructions: [
        'Place hoops in path across room with cards between',
        'Students must jump from hoop to hoop',
        'Pick up flashcards along the jumping path',
        'At end say all collected words'
      ],
      variations: 'Different path designs. More hoops.'
    },
    {
      id: 'm-056',
      name: 'Under Chair Pass Music',
      materials: 'Flashcards',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass cards under chairs to music, stop and use.',
      instructions: [
        'Students sit in circle formation',
        'Start passing flashcards under chairs while music plays',
        'When music stops - each takes nearby card',
        'Must say word and make sentence with it'
      ],
      variations: 'Different music speeds. Multiple cards.'
    },
    {
      id: 'm-057',
      name: 'Move Move Move Run',
      materials: 'Cards placed around room at spots',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Run to called flashcard location around room.',
      instructions: [
        'Place flashcards at different spots around room',
        'Teacher calls out a specific word',
        'All students run to that flashcard location',
        'Variation: call sentence instead of single word'
      ],
      variations: 'Different room layouts. Team races.'
    },
    {
      id: 'm-058',
      name: 'Q&A Context Practice',
      materials: 'Question-answer paired flashcards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '7-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Use question and answer cards for dialogue practice.',
      instructions: [
        'Show flashcard with question prompt',
        'Student answers using another flashcard',
        'Practice full Q&A exchanges using cards as prompts',
        'Good for dialogue building'
      ],
      variations: 'Different Q&A topics. Pair work.'
    },
    {
      id: 'm-059',
      name: 'Q&A Speed Drill',
      materials: 'Flashcards',
      difficulty: 'Beginner',
      ageGroup: '5-14',
      duration: '5-10 min',
      players: 'Whole class',
      description: 'Rapid fire Q&A practice increasing speed.',
      instructions: [
        'Teacher holds up card asks question',
        'Students answer chorally then individually',
        'Gradually increase speed for fluency',
        'Students can then ask each other questions'
      ],
      variations: 'Different question types. Team competition.'
    },
    {
      id: 'm-060',
      name: 'Sentence Builder Circle',
      materials: 'Flashcards, Sentence prompts optional',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '7-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Make different sentences with same word, no repeats.',
      instructions: [
        'Student picks a flashcard',
        'Must make sentence using that word',
        'Pass card to next who makes different sentence',
        'Continue around circle - no repeated sentences allowed'
      ],
      variations: 'Different sentence structures. Time limits.'
    },
    {
      id: 'm-061',
      name: 'Monster Feed Game',
      materials: 'Flashcards, Monster drawing/picture on board',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: '\'Feed\' hungry monster by saying words correctly.',
      instructions: [
        'Draw simple monster on board (or show picture)',
        'Monster is hungry - only eats correct words',
        'Show cards one by one - students say word to feed monster',
        'Wrong answer = monster growls, right = monster eats card'
      ],
      variations: 'Different monsters. Hungry characters.'
    },
    {
      id: 'm-062',
      name: 'Alligator River Cross',
      materials: 'Flashcards in line as river stones',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-11',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Cross river stepping on cards saying each word.',
      instructions: [
        'Place flashcards in line on floor = river',
        'One student is alligator standing in middle',
        'Others must step on cards saying word to cross',
        'Can\'t say word = alligator catches you'
      ],
      variations: 'Wider rivers. More alligators.'
    },
    {
      id: 'm-063',
      name: 'Googly Eyes Fun Faces',
      materials: 'Cards with googly eyes attached',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Say word with funny expression for extra fun.',
      instructions: [
        'Attach googly eyes to flashcards for fun twist',
        'Hold up a card showing it to class',
        'Students must say word with funny expression/face',
        'Funniest pronunciation and face gets extra point'
      ],
      variations: 'Different eye sizes. Funny voice challenges.'
    },
    {
      id: 'm-064',
      name: 'Lost Duck Find Special',
      materials: 'Cards in grid, One special duck card',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Find special lost duck card among all others.',
      instructions: [
        'Place flashcards face down in grid pattern',
        'One card is special \'lost duck\' card',
        'Students take turns flipping cards naming each',
        'Whoever finds the lost duck wins the game'
      ],
      variations: 'Different special cards. Larger grids.'
    },
    {
      id: 'm-065',
      name: 'String Forest Pull Down',
      materials: 'Cards tied to strings at heights',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pull down hanging cards from string forest.',
      instructions: [
        'Tie strings to several flashcards',
        'Hang them at different heights around room',
        'Students walk through pulling down cards',
        'Must say word on each card pulled down'
      ],
      variations: 'Different string layouts. More cards.'
    },
    {
      id: 'm-066',
      name: 'Playhouse Igloo Adventure',
      materials: 'Cards, Table with blanket as igloo',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Crawl into playhouse get card come out say word.',
      instructions: [
        'Create small playhouse/igloo using table + blanket',
        'Place flashcards inside the structure',
        'Students crawl in pick a card come back out',
        'Say the word on their chosen card'
      ],
      variations: 'Different playhouse designs. Adventure themes.'
    },
    {
      id: 'm-067',
      name: 'Animal Sounds Say Name',
      materials: 'Animal flashcards only',
      difficulty: 'Beginner',
      ageGroup: '3-7',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Make animal sound AND say English name.',
      instructions: [
        'Show an animal flashcard',
        'Students make that animal\'s sound',
        'AND say the English name of animal',
        'Variation: also act out how animal moves'
      ],
      variations: 'Different animals. Sound challenges.'
    },
    {
      id: 'm-068',
      name: 'Family Member Point Say',
      materials: 'Family member flashcards',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Say family word and point to person or tree.',
      instructions: [
        'Show family member card (mom, dad, brother...)',
        'Say family word aloud',
        'Point to corresponding person in class or on family tree',
        'Practice: This is my ___'
      ],
      variations: 'Different family members. Extended family.'
    },
    {
      id: 'm-071',
      name: 'Action Race',
      materials: 'Chairs, action cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Teams race to perform actions and say sentences.',
      instructions: [
        'Split class into two teams',
        'Students sit in lines with chairs',
        'Teacher calls action: "Jump!"',
        'Students race to other side and back',
        'Sit down and say: "I can jump!"',
        'First team to finish gets point'
      ],
      variations: 'Different actions. More complex sentences.'
    },
    {
      id: 'm-072',
      name: 'Adverb Action',
      materials: 'Adverb cards, activity cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students perform activities with adverbs for others to guess.',
      instructions: [
        'Teacher writes activity on board: "Brush teeth"',
        'Student comes to front',
        'Teacher shows adverb card: "slowly"',
        'Student performs activity slowly',
        'Others guess the adverb',
        'Correct guesser gets point and next turn'
      ],
      variations: 'Different activities. More complex adverbs.'
    },
    {
      id: 'm-073',
      name: 'Airplane Competition',
      materials: 'Paper, classroom objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '7-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Make paper airplanes and throw for points after answering questions.',
      instructions: [
        'Students make paper airplanes',
        'Test fly planes first',
        'Assign points to classroom objects',
        'Ask student a question',
        'Correct answer = throw plane at targets',
        'Hit object = win points for team'
      ],
      variations: 'Different point values. Team competition.'
    },
    {
      id: 'm-074',
      name: 'Apple Pass',
      materials: 'Fake apple or ball',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass apple around circle saying different English words.',
      instructions: [
        'Students sit in circle',
        'Pass fake apple to another student',
        'Must say one English word as you pass',
        'Next student says different word',
        'If dropped, student is out',
        'Last student wins'
      ],
      variations: 'Different categories (food, animals, etc.)'
    },
    {
      id: 'm-075',
      name: 'Art Gallery',
      materials: 'Whiteboard, markers',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Draw vocabulary words on board and score pictures.',
      instructions: [
        'Draw squares on board for each student',
        'Students write names above squares',
        'Teacher calls out vocabulary word',
        'Students draw the word in their square',
        'Give scores for each drawing',
        'Highest score wins'
      ],
      variations: 'Different word types. Team drawing.'
    },
    {
      id: 'm-076',
      name: 'Attention Commands',
      materials: 'None',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '5-10 min',
      players: 'Whole class',
      description: 'Call out commands for students to follow.',
      instructions: [
        'Call commands: "Attention! Salute! March!"',
        'Students follow commands',
        'Add more: "Stop! Sit down! Stand up!"',
        'Students should eventually do without copying',
        'Practice listening and actions',
        'Fun warm-up activity'
      ],
      variations: 'Faster commands. More complex sequences.'
    },
    {
      id: 'm-077',
      name: 'Backs to Board Game',
      materials: 'Whiteboard, vocabulary words',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Students with backs to board guess words from team descriptions.',
      instructions: [
        'Write vocabulary words on board',
        'One student from each team stands with back to board',
        'Team describes word without saying it',
        'Student guesses the word',
        'Correct guess gets point',
        'Teams take turns'
      ],
      variations: 'Time limits. Different word categories.'
    },
    {
      id: 'm-078',
      name: 'Badminton',
      materials: 'Paper badminton birdies, vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Pairs',
      description: 'Hit paper birdies back and forth saying vocabulary.',
      instructions: [
        'Make paper badminton birdies',
        'Students pair up',
        'Hit birdie back and forth',
        'Each hit must include a vocabulary word',
        'Drop the birdie = lose point',
        'Practice vocabulary while playing'
      ],
      variations: 'Different vocabulary themes. Team play.'
    },
    {
      id: 'm-079',
      name: 'Banana Race',
      materials: 'Vocabulary cards, "banana" tokens',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Race to collect bananas by answering vocabulary questions.',
      instructions: [
        'Set up vocabulary cards around room',
        'Divide class into teams',
        'Teams race to collect cards',
        'Each card collected is a "banana"',
        'Must say word to collect banana',
        'Team with most bananas wins'
      ],
      variations: 'Different token types. More complex vocabulary.'
    },
    {
      id: 'm-080',
      name: 'Bang!',
      materials: 'Vocabulary cards, special "Bang!" cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Draw cards and say words, but "Bang!" cards lose points.',
      instructions: [
        'Mix vocabulary cards with special "Bang!" cards',
        'Students take turns drawing cards',
        'If vocabulary card - say the word and keep card',
        'If "Bang!" card - lose all cards',
        'Student with most cards at end wins'
      ],
      variations: 'Different special cards. Point systems.'
    },
    {
      id: 'm-081',
      name: 'Basketball Vocabulary',
      materials: 'Basketball hoop, ball, vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Answer vocabulary questions to shoot basketball.',
      instructions: [
        'Set up basketball hoop in classroom',
        'Divide class into teams',
        'Ask vocabulary question to team',
        'Correct answer = chance to shoot basket',
        'Made basket = points for team',
        'Practice vocabulary with physical activity'
      ],
      variations: 'Different point values. Distance challenges.'
    },
    {
      id: 'm-082',
      name: 'Bet You Can\'t',
      materials: 'Challenge cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Challenge students to complete English tasks.',
      instructions: [
        'Teacher challenges: "Bet you can\'t spell "beautiful"!"',
        'Student attempts the challenge',
        'Success = points for student',
        'Failure = points for teacher',
        'Fun competitive element',
        'Practice various skills'
      ],
      variations: 'Different challenges. Team challenges.'
    },
    {
      id: 'm-083',
      name: 'Blind Toss',
      materials: 'Soft ball, blindfold',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Blindfolded student tosses ball to others who must say words.',
      instructions: [
        'One student wears blindfold',
        'Tosses soft ball to classmates',
        'Student who catches ball must say vocabulary word',
        'Blindfolded student guesses who caught it',
        'Practice listening and speaking',
        'Fun and engaging'
      ],
      variations: 'Different objects. More complex vocabulary.'
    },
    {
      id: 'm-084',
      name: 'Blindfold Course',
      materials: 'Blindfolds, classroom objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '7-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Navigate obstacle course blindfolded with directions.',
      instructions: [
        'Set up simple obstacle course',
        'Student A wears blindfold',
        'Student B gives directions in English',
        '"Walk forward. Turn left. Stop."',
        'Navigate through course',
        'Practice directions and listening'
      ],
      variations: 'More complex courses. Role reversal.'
    },
    {
      id: 'm-085',
      name: 'Blindfold Guess',
      materials: 'Blindfold, objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Blindfolded students guess objects by touch.',
      instructions: [
        'Blindfold student',
        'Give them an object to feel',
        'Student must guess object in English',
        'Use descriptive language',
        '"It\'s soft. It\'s round. It\'s a ball."',
        'Practice vocabulary and descriptions'
      ],
      variations: 'Different objects. Time limits.'
    },
    {
      id: 'm-086',
      name: 'Blindfold Questions',
      materials: 'Blindfold, question cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Blindfolded student answers questions from classmates.',
      instructions: [
        'Blindfold one student',
        'Classmates ask questions',
        'Blindfolded student must answer',
        'Can use voice recognition to guess who asked',
        'Practice listening and speaking',
        'Fun communication game'
      ],
      variations: 'Different question types. Team questions.'
    },
    {
      id: 'm-087',
      name: 'Board Scramble',
      materials: 'Whiteboard, markers, vocabulary words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Teams race to write vocabulary words on board.',
      instructions: [
        'Write vocabulary words scattered on board',
        'Divide class into teams',
        'Call out a definition or clue',
        'Teams race to find and circle correct word',
        'First team to find gets point',
        'Practice reading and vocabulary recognition'
      ],
      variations: 'More words. Faster pace.'
    },
    {
      id: 'm-088',
      name: 'Buzz',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Count around circle replacing certain numbers with "Buzz".',
      instructions: [
        'Students count around circle',
        'Choose buzz numbers (multiples of 3, 5, 7)',
        'Instead of saying buzz numbers, say "Buzz"',
        'Student who makes mistake is out',
        'Practice numbers and concentration',
        'Fast-paced counting game'
      ],
      variations: 'Different buzz numbers. Multiple buzz words.'
    },
    {
      id: 'm-089',
      name: 'Can You Actions',
      materials: 'Action cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students ask "Can you...?" questions and demonstrate actions.',
      instructions: [
        'Student draws action card',
        'Asks class: "Can you jump?"',
        'Class responds: "Yes, I can jump!"',
        'Everyone performs the action',
        'Practice "Can you...?" questions',
        'Physical activity + language'
      ],
      variations: 'Different actions. More complex questions.'
    },
    {
      id: 'm-090',
      name: 'Category Spin',
      materials: 'Spinner, category cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Spin to select category, then name words in that category.',
      instructions: [
        'Spin the spinner',
        'Land on category (animals, food, etc.)',
        'Students take turns naming words in category',
        'Can\'t repeat words',
        'Last student to think of word wins',
        'Practice vocabulary categories'
      ],
      variations: 'Different categories. Time limits.'
    },
    {
      id: 'm-091',
      name: 'Category Tag',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Play tag with category rules.',
      instructions: [
        'Choose category (colors, animals, etc.)',
        'One student is "it"',
        'To avoid being tagged, student must say word from category',
        'If tagged, must say 3 words from category to rejoin',
        'Physical activity + vocabulary practice',
        'Fun and energetic'
      ],
      variations: 'Different categories. More complex rules.'
    },
    {
      id: 'm-092',
      name: 'Category Writing Game',
      materials: 'Paper, pencils, category cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Teams race to write words in given categories.',
      instructions: [
        'Give each team paper and pencil',
        'Call out category and starting letter',
        'Teams race to write words fitting both',
        '"Category: Animals, Letter: C"',
        'Cat, cow, crocodile, etc.',
        'Most words in time limit wins'
      ],
      variations: 'Different categories. Letter restrictions.'
    },
    {
      id: 'm-093',
      name: 'Clothes Fun',
      materials: 'Clothing items, vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Practice clothing vocabulary with dress-up activities.',
      instructions: [
        'Show clothing vocabulary cards',
        'Students touch corresponding clothing',
        'Practice: "This is a shirt. These are pants."',
        'Can include dress-up element',
        'Practice clothing vocabulary',
        'Real-world connection'
      ],
      variations: 'Different clothing. Fashion show theme.'
    },
    {
      id: 'm-094',
      name: 'Colors in the Air',
      materials: 'Color flashcards',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '5-10 min',
      players: 'Whole class',
      description: 'Throw color cards in air and students identify them.',
      instructions: [
        'Throw color flashcards in air',
        'Students shout out color names',
        'Catch the cards and show to class',
        'Practice color vocabulary',
        'Exciting and visual',
        'Great for young learners'
      ],
      variations: 'Different colors. More cards at once.'
    },
    {
      id: 'm-095',
      name: 'Color Circles',
      materials: 'Colored paper circles',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place colored circles on floor for students to stand on.',
      instructions: [
        'Spread colored circles on floor',
        'Call out color: "Stand on red!"',
        'Students run to correct color circle',
        'Practice color recognition',
        'Physical activity + learning',
        'Fun for young students'
      ],
      variations: 'Different colors. Add shapes.'
    },
    {
      id: 'm-096',
      name: 'Color Game',
      materials: 'Color cards, classroom objects',
      difficulty: 'Beginner',
      ageGroup: '4-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Find objects of called colors in classroom.',
      instructions: [
        'Show color card',
        'Students find objects of that color',
        '"Red! I see a red book!"',
        'Touch object while saying color',
        'Practice colors vocabulary',
        'Classroom exploration'
      ],
      variations: 'Different colors. Race format.'
    },
    {
      id: 'm-097',
      name: 'Count-off',
      materials: 'None',
      difficulty: 'Beginner',
      ageGroup: '5-10',
      duration: '5-10 min',
      players: 'Whole class',
      description: 'Practice counting with group activities.',
      instructions: [
        'Students count off around circle',
        'Each student says next number',
        'Can count by 1s, 2s, 5s, 10s',
        'Practice number vocabulary',
        'Group coordination',
        'Math + English practice'
      ],
      variations: 'Different counting patterns. Faster pace.'
    },
    {
      id: 'm-098',
      name: 'Cross the River',
      materials: 'Paper "stones", vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Cross "river" by stepping on stones and saying words.',
      instructions: [
        'Place paper stones on floor as river',
        'Put vocabulary cards on stones',
        'Students step on stones saying words',
        'Wrong pronunciation = fall in river',
        'Safe crossing = all words correct',
        'Adventure theme + vocabulary'
      ],
      variations: 'Wider rivers. More challenging words.'
    },
    {
      id: 'm-099',
      name: 'Days of the Week March',
      materials: 'Days of week cards',
      difficulty: 'Beginner',
      ageGroup: '5-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'March around room saying days of week.',
      instructions: [
        'Students march in place or around room',
        'Call out days of week in order',
        'Students repeat while marching',
        'Can add actions for each day',
        'Practice days of week vocabulary',
        'Physical activity + learning'
      ],
      variations: 'Different marching styles. Add months.'
    },
    {
      id: 'm-100',
      name: 'Directions Game',
      materials: 'Classroom objects, direction cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Give and follow directions to find objects.',
      instructions: [
        'Student A hides object',
        'Student B gives directions to find it',
        '"Go forward. Turn left. Look under the desk."',
        'Practice direction vocabulary',
        'Listening and speaking practice',
        'Real-world application'
      ],
      variations: 'More complex directions. School map navigation.'
    },
    {
      id: 'm-101',
      name: 'Do as I Say, Not as I Do',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students must follow spoken instructions, not demonstrated actions.',
      instructions: [
        'Teacher says one action but does different',
        '"Touch your nose" (while touching head)',
        'Students must follow spoken instruction',
        'Wrong action = out of game',
        'Practice listening comprehension',
        'Fun and challenging'
      ],
      variations: 'Students take turns as leader. Faster pace.'
    },
    {
      id: 'm-102',
      name: 'Dog & Cat Chase',
      materials: 'Animal flashcards',
      difficulty: 'Beginner',
      ageGroup: '4-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Role-play animal chase with vocabulary.',
      instructions: [
        'Assign students as dogs or cats',
        'Show animal flashcards',
        'Dogs chase cats when dog card shown',
        'Cats chase dogs when cat card shown',
        'Practice animal vocabulary',
        'Fun physical activity'
      ],
      variations: 'Different animals. More complex rules.'
    },
    {
      id: 'm-103',
      name: 'Draw and Roll',
      materials: 'Dice, paper, pencils',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Roll dice to determine what to draw.',
      instructions: [
        'Create drawing categories for each dice number',
        '1 = animal, 2 = food, 3 = house, etc.',
        'Student rolls dice',
        'Draw something from that category',
        'Say what they drew in English',
        'Practice vocabulary + drawing'
      ],
      variations: 'Different categories. More dice.'
    },
    {
      id: 'm-104',
      name: 'Exercises',
      materials: 'Exercise cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Do exercises while counting in English.',
      instructions: [
        'Show exercise card (jumping jacks, etc.)',
        'Students do exercise while counting',
        'Count in English: "One, two, three..."',
        'Practice numbers + physical activity',
        'Energy burner + learning',
        'Classroom exercise'
      ],
      variations: 'Different exercises. Count by different numbers.'
    },
    {
      id: 'm-105',
      name: 'Explosion',
      materials: 'Vocabulary cards, timer',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Teams race to say as many words as possible before "explosion".',
      instructions: [
        'Set timer for random intervals',
        'Teams take turns saying vocabulary words',
        'Can\'t repeat words',
        'Timer goes off = "explosion"',
        'Team speaking when timer explodes loses',
        'Practice vocabulary under pressure'
      ],
      variations: 'Different time limits. Category restrictions.'
    },
    {
      id: 'm-106',
      name: 'Fish Game',
      materials: 'Paper fish, vocabulary words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Go fishing for vocabulary words.',
      instructions: [
        'Attach vocabulary words to paper fish',
        'Spread fish around room',
        'Students go fishing with makeshift rods',
        'Catch fish and say the word',
        'Correct pronunciation = keep fish',
        'Fun fishing theme + vocabulary'
      ],
      variations: 'Different fishing methods. Point system.'
    },
    {
      id: 'm-107',
      name: 'Follow the Leader',
      materials: 'None',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Follow leader actions while saying vocabulary.',
      instructions: [
        'One student is leader',
        'Leader does actions around room',
        'Others follow and copy actions',
        'Leader says vocabulary words',
        'Students repeat words',
        'Practice vocabulary + movement'
      ],
      variations: 'Different leaders. More complex actions.'
    },
    {
      id: 'm-108',
      name: 'Get Dressed!',
      materials: 'Clothing items, weather cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Dress for weather while practicing clothing vocabulary.',
      instructions: [
        'Show weather card (sunny, rainy, cold)',
        'Students must dress appropriately',
        'Put on hat, coat, boots, etc.',
        'Say: "It\'s cold. I need a coat."',
        'Practice weather + clothing vocabulary',
        'Real-world application'
      ],
      variations: 'Different weather conditions. Race format.'
    },
    {
      id: 'm-109',
      name: 'Give Me Game',
      materials: 'Classroom objects',
      difficulty: 'Beginner',
      ageGroup: '4-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Practice "Give me..." requests with classroom objects.',
      instructions: [
        'Teacher says: "Give me a pen!"',
        'Students find and give pen to teacher',
        'Practice: "Here is a pen."',
        'Can reverse roles with students',
        'Practice classroom vocabulary',
        'Polite requests practice'
      ],
      variations: 'Different objects. Student requests.'
    },
    {
      id: 'm-110',
      name: 'Hangman Classic',
      materials: 'Whiteboard, markers',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Classic word guessing game with hangman drawing.',
      instructions: [
        'Think of vocabulary word',
        'Draw dashes for each letter',
        'Students guess letters',
        'Correct letters go on dashes',
        'Wrong letters add hangman parts',
        'Guess word before hangman complete'
      ],
      variations: 'Different themes. Parachute version.'
    },
    {
      id: 'm-111',
      name: 'I Spy',
      materials: 'Classroom objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Classic "I spy with my little eye" game.',
      instructions: [
        'Leader says: "I spy with my little eye something..."',
        'Describe color or first letter',
        '"...red." or "...something that starts with B."',
        'Students guess objects',
        'Practice descriptions and vocabulary',
        'Observation skills + language'
      ],
      variations: 'Different description types. Classroom vs outdoor.'
    },
    {
      id: 'm-112',
      name: 'Juice Game',
      materials: 'Juice bottles, vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass juice bottles while saying vocabulary.',
      instructions: [
        'Students sit in circle',
        'Pass juice bottles around',
        'When music stops, student with bottle says word',
        'Can use empty bottles for safety',
        'Practice vocabulary',
        'Fun passing game'
      ],
      variations: 'Different passing objects. Faster music.'
    },
    {
      id: 'm-113',
      name: 'Knock-Knock',
      materials: 'Door props, joke cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Practice knock-knock jokes and conversation.',
      instructions: [
        'Teach knock-knock joke structure',
        'Students pair up',
        'Practice joke conversations',
        '"Knock, knock." "Who\'s there?" etc.',
        'Can create vocabulary-based jokes',
        'Practice conversation patterns'
      ],
      variations: 'Different joke types. Create original jokes.'
    },
    {
      id: 'm-114',
      name: 'Label It',
      materials: 'Sticky notes, classroom objects',
      difficulty: 'Beginner',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Label classroom objects with English names.',
      instructions: [
        'Give students sticky notes',
        'Write English names on notes',
        'Stick labels on classroom objects',
        'Practice reading labels around room',
        'Create English-rich environment',
        'Vocabulary reinforcement'
      ],
      variations: 'Different categories. Color-coded labels.'
    },
    {
      id: 'm-115',
      name: 'Last Letter First Letter',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Word chain game using last and first letters.',
      instructions: [
        'First student says any word',
        'Next student must say word starting with last letter',
        '"Apple" → "Elephant" → "Tiger"',
        'Continue around circle',
        'Can\'t repeat words',
        'Practice vocabulary and spelling'
      ],
      variations: 'Themed words. Time limits.'
    },
    {
      id: 'm-116',
      name: 'Line True or False',
      materials: 'Statement cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students move to true/false sides based on statements.',
      instructions: [
        'Draw line down middle of room',
        'One side = True, other = False',
        'Read statement about vocabulary or grammar',
        'Students move to correct side',
        'Practice comprehension',
        'Physical movement + learning'
      ],
      variations: 'Different statement types. Speed rounds.'
    },
    {
      id: 'm-117',
      name: 'Machine Game',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Create human machine with sounds and actions.',
      instructions: [
        'Students become parts of a machine',
        'Each student has sound and action',
        'Connect movements to create machine',
        'Add vocabulary to describe machine',
        'Practice descriptive language',
        'Creative and collaborative'
      ],
      variations: 'Different machines. More complex movements.'
    },
    {
      id: 'm-118',
      name: 'Make Words Game',
      materials: 'Letter cards, vocabulary lists',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Create words from letter cards.',
      instructions: [
        'Give teams letter cards',
        'Call out vocabulary category',
        'Teams race to make words from letters',
        'Longest correct word gets points',
        'Practice spelling and vocabulary',
        'Team competition'
      ],
      variations: 'Different letter sets. Time limits.'
    },
    {
      id: 'm-119',
      name: 'Months March',
      materials: 'Months cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'March around room saying months of year.',
      instructions: [
        'Students march around room',
        'Say months of year in order',
        'Can add actions for each month',
        'Practice months vocabulary',
        'Physical activity + learning',
        'Calendar practice'
      ],
      variations: 'Different marching styles. Add seasons.'
    },
    {
      id: 'm-120',
      name: 'Name Game',
      materials: 'None',
      difficulty: 'Beginner',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Learn and practice names with adjectives.',
      instructions: [
        'First student says name with adjective',
        '"I\'m Funny Frank"',
        'Next student repeats all previous names',
        'Then adds their own',
        'Continue around circle',
        'Practice names + adjectives'
      ],
      variations: 'Different adjective themes. Alliteration.'
    },
    {
      id: 'm-121',
      name: 'Name Memorizing Game',
      materials: 'Name tags',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Practice remembering and saying classmates\' names.',
      instructions: [
        'Students wear name tags',
        'Walk around room introducing selves',
        'After mingling, test name recall',
        '"What\'s her name?" "She\'s Maria."',
        'Practice name vocabulary',
        'Classroom community building'
      ],
      variations: 'Time limits. Team competition.'
    },
    {
      id: 'm-122',
      name: 'Number Codes',
      materials: 'Number code cards, messages',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Create and decode number-based messages.',
      instructions: [
        'Create simple number code (A=1, B=2, etc.)',
        'Write messages in code',
        'Students decode messages',
        'Can create their own codes',
        'Practice numbers and spelling',
        'Problem solving + language'
      ],
      variations: 'Different codes. More complex messages.'
    },
    {
      id: 'm-123',
      name: 'Number Group Game',
      materials: 'Number cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Form groups based on called numbers.',
      instructions: [
        'Call out a number',
        'Students must form groups of that size',
        'Students left out answer question',
        'Practice number vocabulary',
        'Quick thinking and cooperation',
        'Fun grouping activity'
      ],
      variations: 'Different numbers. Math problems.'
    },
    {
      id: 'm-124',
      name: 'Odd-One-Out',
      materials: 'Picture cards or objects',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Identify which item doesn\'t belong in a group.',
      instructions: [
        'Show 3-4 related items',
        'One doesn\'t belong with others',
        'Students must identify odd one out',
        'Explain why in English',
        'Practice categorization and reasoning',
        'Critical thinking + vocabulary'
      ],
      variations: 'More complex groupings. Abstract concepts.'
    },
    {
      id: 'm-125',
      name: 'Pass Game',
      materials: 'Object to pass, music',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass object while music plays, stop and answer.',
      instructions: [
        'Students sit in circle',
        'Pass object while music plays',
        'When music stops, student with object answers',
        'Ask vocabulary or grammar question',
        'Practice under pressure',
        'Fun and suspenseful'
      ],
      variations: 'Different objects. Different questions.'
    },
    {
      id: 'm-126',
      name: 'Pictionary',
      materials: 'Whiteboard, markers, vocabulary cards',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Draw vocabulary words for team to guess.',
      instructions: [
        'Student draws vocabulary word on board',
        'Team guesses what it is',
        'No speaking or letters allowed',
        'Time limit for each drawing',
        'Practice vocabulary and descriptions',
        'Visual and creative'
      ],
      variations: 'Different categories. Charades combination.'
    },
    {
      id: 'm-127',
      name: 'Picture Fun',
      materials: 'Picture cards, description cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Pairs',
      description: 'Describe and match pictures with descriptions.',
      instructions: [
        'Give students picture cards',
        'Also give description cards',
        'Match pictures to descriptions',
        'Practice reading comprehension',
        'Vocabulary matching',
        'Visual language connection'
      ],
      variations: 'More complex descriptions. Create descriptions.'
    },
    {
      id: 'm-128',
      name: 'Preposition Treasure Hunt',
      materials: 'Classroom objects, preposition cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Find objects using preposition clues.',
      instructions: [
        'Hide objects around room',
        'Give preposition clues',
        '"It\'s under the desk. It\'s behind the book."',
        'Students follow clues to find treasure',
        'Practice prepositions and directions',
        'Active learning + vocabulary'
      ],
      variations: 'More complex prepositions. Outdoor version.'
    },
    {
      id: 'm-129',
      name: 'Puppet Conversation',
      materials: 'Puppets, conversation prompts',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Have conversations using puppets.',
      instructions: [
        'Students use puppets to talk',
        'Practice conversation patterns',
        '"Hello, how are you?" "I\'m fine, thank you."',
        'Puppets reduce speaking anxiety',
        'Practice dialogue skills',
        'Creative expression'
      ],
      variations: 'Different puppet characters. Complex conversations.'
    },
    {
      id: 'm-130',
      name: 'Question Ball',
      materials: 'Ball with questions written on it',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Throw ball and answer question under thumb.',
      instructions: [
        'Write questions all over ball',
        'Student catches ball',
        'Look under right thumb',
        'Answer that question',
        'Throw to next student',
        'Practice speaking and comprehension'
      ],
      variations: 'Different question types. Grammar focus.'
    },
    {
      id: 'm-131',
      name: 'Question Chain',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Create chain of questions and answers.',
      instructions: [
        'First student asks question',
        'Second student answers',
        'Then asks new question to third student',
        'Continue chain around room',
        'Practice question formation',
        'Listening and responding'
      ],
      variations: 'Themed questions. Faster pace.'
    },
    {
      id: 'm-132',
      name: 'Rope Jump',
      materials: 'Jump rope, vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Jump rope while saying vocabulary words.',
      instructions: [
        'Students take turns jumping rope',
        'Must say vocabulary word with each jump',
        'Count successful jumps and words',
        'Practice vocabulary while exercising',
        'Physical coordination + language',
        'Energy burner + learning'
      ],
      variations: 'Different jumping styles. Team jumping.'
    },
    {
      id: 'm-133',
      name: 'Rhythmic Reading',
      materials: 'Reading texts, rhythm instruments',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Read texts with rhythm and beat.',
      instructions: [
        'Give students reading texts',
        'Add rhythm with clapping or instruments',
        'Read text in rhythm',
        'Practice pronunciation and fluency',
        'Make reading fun and musical',
        'Performance element'
      ],
      variations: 'Different rhythms. Group performances.'
    },
    {
      id: 'm-134',
      name: 'Secret S',
      materials: 'Vocabulary cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Guess secret word starting with S.',
      instructions: [
        'Teacher thinks of secret word starting with S',
        'Students ask yes/no questions',
        '"Is it an animal?" "Is it big?"',
        'Teacher answers questions',
        'Students try to guess word',
        'Practice question formation'
      ],
      variations: 'Different letters. Time limits.'
    },
    {
      id: 'm-135',
      name: 'Shirt Game',
      materials: 'Shirt or cloth, vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass shirt under chairs while music plays.',
      instructions: [
        'Students sit on chairs in circle',
        'Pass shirt under chairs while music plays',
        'When music stops, student with shirt stands',
        'Answers question or says vocabulary word',
        'Exciting passing game',
        'Practice vocabulary'
      ],
      variations: 'Different passing objects. More chairs.'
    },
    {
      id: 'm-136',
      name: 'Shopping Game',
      materials: 'Play money, item cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Practice shopping conversations and vocabulary.',
      instructions: [
        'Set up shop with item cards and prices',
        'Students are shoppers and shopkeepers',
        'Practice shopping dialogues',
        '"How much is this?" "It\'s five dollars."',
        'Practice money vocabulary',
        'Real-world application'
      ],
      variations: 'Different shops. Budget limits.'
    },
    {
      id: 'm-137',
      name: 'Shopping List',
      materials: 'Shopping lists, item cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Find items on shopping lists.',
      instructions: [
        'Give students shopping lists',
        'Hide item cards around room',
        'Students find items on their lists',
        'Practice food and shopping vocabulary',
        '"I need apples. Where are the apples?"',
        'Practical vocabulary practice'
      ],
      variations: 'Different list types. Budget challenges.'
    },
    {
      id: 'm-138',
      name: 'Silent Ball',
      materials: 'Soft ball',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass ball silently, make noise = out.',
      instructions: [
        'Students stand or sit around room',
        'Pass soft ball to each other',
        'Must stay completely silent',
        'Make any noise = out of game',
        'Drop ball = out of game',
        'Practice focus and non-verbal communication'
      ],
      variations: 'Different passing rules. Team competition.'
    },
    {
      id: 'm-139',
      name: 'Simon Says',
      materials: 'None',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Classic Simon Says game with actions.',
      instructions: [
        'Teacher gives commands starting with "Simon says"',
        'Students only follow commands with "Simon says"',
        '"Simon says touch your nose" = touch nose',
        '"Touch your head" = don\'t move',
        'Practice listening and body parts',
        'Classic and effective'
      ],
      variations: 'Students take turns as Simon. Faster pace.'
    },
    {
      id: 'm-140',
      name: 'Slam',
      materials: 'Vocabulary cards on table',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Slam correct card when called.',
      instructions: [
        'Spread vocabulary cards on table',
        'Teacher calls out word or definition',
        'Students race to slam correct card',
        'First to slam gets point',
        'Practice vocabulary recognition',
        'Fast and exciting'
      ],
      variations: 'More cards. Team competition.'
    },
    {
      id: 'm-141',
      name: 'Smells Game',
      materials: 'Containers with different smells',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Guess objects by smell.',
      instructions: [
        'Put strong-smelling items in containers',
        'Students smell and guess contents',
        'Use descriptive words',
        '"It smells sweet. It\'s a banana."',
        'Practice sensory vocabulary',
        'Engaging sensory experience'
      ],
      variations: 'Different smells. Blindfold element.'
    },
    {
      id: 'm-142',
      name: 'Snowballs',
      materials: 'Paper, vocabulary words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Write words on paper, make snowballs, throw and read.',
      instructions: [
        'Write vocabulary words on paper',
        'Crumple into snowballs',
        'Have snowball fight',
        'When teacher says stop, pick up snowball',
        'Read word and make sentence',
        'Fun and active vocabulary practice'
      ],
      variations: 'Different paper colors. Team competition.'
    },
    {
      id: 'm-143',
      name: 'Spelling Bee',
      materials: 'Vocabulary lists',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Classic spelling competition.',
      instructions: [
        'Students stand and spell words',
        'Teacher says vocabulary word',
        'Student spells it out loud',
        'Correct spelling = stay in game',
        'Wrong spelling = sit down',
        'Last student standing wins'
      ],
      variations: 'Different difficulty levels. Team spelling.'
    },
    {
      id: 'm-144',
      name: 'Spin the Bottle',
      materials: 'Bottle, question cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Spin bottle to ask questions to classmates.',
      instructions: [
        'Students sit in circle',
        'Place bottle in center',
        'Spin bottle',
        'When it stops, ask question to person it points to',
        'Practice conversation skills',
        'Fun social interaction'
      ],
      variations: 'Different question types. Truth or dare element.'
    },
    {
      id: 'm-145',
      name: 'Squeeze',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass squeeze around circle to count.',
      instructions: [
        'Students hold hands in circle',
        'One student starts squeeze',
        'Pass squeeze around circle',
        'Count how long it takes',
        'Practice counting vocabulary',
        'Team coordination',
        'Non-verbal communication'
      ],
      variations: 'Different squeeze patterns. Eyes closed.'
    },
    {
      id: 'm-146',
      name: 'Stand Up Questions',
      materials: 'Question cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Stand up to answer questions, sit down when wrong.',
      instructions: [
        'All students stand up',
        'Teacher asks questions',
        'Students who know answer raise hand',
        'Correct answer = stay standing',
        'Wrong answer = sit down',
        'Last student standing wins'
      ],
      variations: 'Different question types. Team competition.'
    },
    {
      id: 'm-147',
      name: 'Stop the Bus',
      materials: 'Category cards, letters',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Race to write words for categories starting with given letter.',
      instructions: [
        'Write categories on board (animals, food, etc.)',
        'Call out a letter',
        'Teams race to write words for each category',
        'All words must start with given letter',
        'First team to finish shouts "Stop the bus!"',
        'Practice vocabulary categories'
      ],
      variations: 'Different categories. More letters.'
    },
    {
      id: 'm-148',
      name: 'Story Pass',
      materials: 'Story starters',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Build story by adding sentences around circle.',
      instructions: [
        'Start with story starter sentence',
        'Pass story around circle',
        'Each student adds one sentence',
        'Keep story coherent',
        'Practice creative writing',
        'Collaborative storytelling'
      ],
      variations: 'Different story genres. Writing instead of speaking.'
    },
    {
      id: 'm-149',
      name: 'There is/There are',
      materials: 'Classroom objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Practice "There is/There are" with classroom objects.',
      instructions: [
        'Students look around classroom',
        'Make sentences using "There is/There are"',
        '"There is a book on the desk."',
        '"There are students in the class."',
        'Practice sentence structure',
        'Observation skills'
      ],
      variations: 'Different locations. More complex sentences.'
    },
    {
      id: 'm-150',
      name: 'Time Bomb',
      materials: 'Timer, object to pass',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass object before timer goes off.',
      instructions: [
        'Set timer for random time',
        'Pass object around circle',
        'Student holding object when timer explodes answers question',
        'Practice quick thinking',
        'Exciting and suspenseful',
        'Practice under pressure'
      ],
      variations: 'Different time limits. Different questions.'
    },
    {
      id: 'm-151',
      name: 'Tingo Tango',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Counting game with Tingo and Tango.',
      instructions: [
        'Students count around circle',
        'Instead of multiples of 3, say "Tingo"',
        'Instead of multiples of 5, say "Tango"',
        'Instead of multiples of both, say "Tingo Tango"',
        'Practice numbers and concentration',
        'Fun counting variation'
      ],
      variations: 'Different numbers. Different words.'
    },
    {
      id: 'm-152',
      name: 'Touch Game',
      materials: 'Classroom objects',
      difficulty: 'Beginner',
      ageGroup: '4-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Touch called objects around classroom.',
      instructions: [
        'Teacher calls out object name',
        'Students race to touch correct object',
        '"Touch the window! Touch the door!"',
        'Practice vocabulary and listening',
        'Physical activity + learning',
        'Classroom exploration'
      ],
      variations: 'Different objects. Team competition.'
    },
    {
      id: 'm-153',
      name: 'Train Ride Game',
      materials: 'Chairs as train, vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Ride train and say vocabulary at each stop.',
      instructions: [
        'Arrange chairs as train',
        'Students sit on train',
        'Teacher is train conductor',
        'Train stops at stations',
        'Students must say vocabulary word to get off',
        'Fun imaginative play'
      ],
      variations: 'Different destinations. Ticket system.'
    },
    {
      id: 'm-154',
      name: 'Uhm Game',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Avoid saying "uhm" while speaking.',
      instructions: [
        'Students talk about given topic',
        'Must avoid saying filler words like "uhm"',
        'If they say "uhm", they are out',
        'Practice fluency and confidence',
        'Reduce filler words',
        'Improve speaking skills'
      ],
      variations: 'Different forbidden words. Time limits.'
    },
    {
      id: 'm-155',
      name: 'Unscramble',
      materials: 'Scrambled word cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Unscramble letters to make vocabulary words.',
      instructions: [
        'Show scrambled letters of vocabulary word',
        'Teams race to unscramble correctly',
        'First team to solve gets point',
        'Practice spelling and vocabulary',
        'Problem solving + language',
        'Team competition'
      ],
      variations: 'More complex words. Sentence unscrambling.'
    },
    {
      id: 'm-156',
      name: 'Vanishing Objects Game',
      materials: 'Classroom objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Remember objects that disappear.',
      instructions: [
        'Show several objects to students',
        'Students close eyes',
        'Remove one object',
        'Students open eyes and guess what vanished',
        'Practice observation and vocabulary',
        'Memory challenge'
      ],
      variations: 'More objects. Remove multiple objects.'
    },
    {
      id: 'm-157',
      name: 'Vocab Tic-Tac-Toe',
      materials: 'Tic-tac-toe grid, vocabulary words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Pairs',
      description: 'Play tic-tac-toe with vocabulary words.',
      instructions: [
        'Draw tic-tac-toe grid on board',
        'Put vocabulary word in each square',
        'To claim square, must use word correctly',
        'Make sentence or define word',
        'First to get 3 in a row wins',
        'Practice vocabulary use'
      ],
      variations: 'Different grid sizes. Grammar focus.'
    },
    {
      id: 'm-158',
      name: 'Word Chain',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Create word chain with related words.',
      instructions: [
        'First student says any word',
        'Next student says related word',
        '"Apple" → "Fruit" → "Tree" → "Leaf"',
        'Explain connection between words',
        'Practice vocabulary connections',
        'Creative thinking'
      ],
      variations: 'Themed chains. Speed rounds.'
    },
    {
      id: 'm-159',
      name: 'What Time is it Mr. Wolf?',
      materials: 'None',
      difficulty: 'Beginner',
      ageGroup: '4-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Practice time vocabulary with classic game.',
      instructions: [
        'One student is Mr. Wolf facing away',
        'Other students ask: "What time is it Mr. Wolf?"',
        'Mr. Wolf says time: "It\'s 3 o\'clock"',
        'Students take 3 steps forward',
        'Sometimes Mr. Wolf says "Dinner time!" and chases',
        'Practice time vocabulary'
      ],
      variations: 'Different times. More complex time expressions.'
    },
    {
      id: 'm-160',
      name: 'Whisper Game',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Whisper message around circle and compare.',
      instructions: [
        'Teacher whispers message to first student',
        'Message passed around circle by whispering',
        'Last student says message aloud',
        'Compare with original message',
        'Shows how messages change',
        'Practice listening and speaking'
      ],
      variations: 'Different message types. Longer messages.'
    },
    {
      id: 'm-161',
      name: 'Whiteboard Draw Relay',
      materials: 'Whiteboard, markers, vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Relay race to draw and guess vocabulary.',
      instructions: [
        'Divide class into teams',
        'Teams line up facing whiteboard',
        'First student runs to board, draws vocabulary word',
        'Team must guess what it is',
        'When guessed, next student runs to draw',
        'Race to finish all words',
        'Team competition + drawing'
      ],
      variations: 'Different vocabulary. More complex drawings.'
    },
    {
      id: 'm-162',
      name: 'Window Game',
      materials: 'Classroom windows',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Describe what can be seen from window.',
      instructions: [
        'Students look out classroom window',
        'Describe what they see in English',
        '"I see a car. I see a tree. I see a building."',
        'Practice observation and vocabulary',
        'Connect classroom to outside world',
        'Descriptive language practice'
      ],
      variations: 'Different windows. More complex descriptions.'
    },
    {
      id: 'm-163',
      name: 'Word Recognition Game',
      materials: 'Word cards, fly swatters',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Race to swat called words.',
      instructions: [
        'Spread word cards on table or floor',
        'Teacher calls out word',
        'Students race to swat correct word',
        'First to swat gets point',
        'Practice word recognition',
        'Fast-paced and exciting'
      ],
      variations: 'More cards. Team competition.'
    },
    {
      id: 'm-164',
      name: 'Yogurt Pots Vocabulary',
      materials: 'Yogurt pots, vocabulary words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Stack pots with vocabulary words.',
      instructions: [
        'Write vocabulary words on yogurt pots',
        'Students stack pots while saying words',
        'Higher stack = more words learned',
        'Can knock down stack at end',
        'Practice vocabulary',
        'Fun building activity'
      ],
      variations: 'Different containers. More complex stacking.'
    },
    {
      id: 'm-165',
      name: 'Animal Sound Guessing Game',
      materials: 'Animal sound recordings or teacher making sounds',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Teacher makes animal sounds, students guess which animal.',
      instructions: [
        'Make animal sounds (moo, woof, meow, etc.)',
        'Students raise hands to guess animal',
        'Can act like animal too',
        '"Moo! It\'s a cow!"',
        'Practice animal vocabulary'
      ],
      variations: 'Different animals. Habitat themes.'
    },
    {
      id: 'm-166',
      name: 'Color Hunt',
      materials: 'Classroom objects, color cards',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students find objects of specific colors around classroom.',
      instructions: [
        'Show color card (red, blue, green, etc.)',
        'Students find and point to objects of that color',
        'Say color and object name',
        '"Red book. Blue chair."',
        'Practice color vocabulary and observation'
      ],
      variations: 'Different colors. Speed challenge.'
    },
    {
      id: 'm-167',
      name: 'Shape Finder',
      materials: 'Shape cards, classroom objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students find objects with specific shapes.',
      instructions: [
        'Show shape card (circle, square, triangle, etc.)',
        'Students find objects with that shape',
        'Say shape and object name',
        '"Circle clock. Square book."',
        'Practice shape vocabulary and recognition'
      ],
      variations: 'Different shapes. Complex shapes.'
    },
    {
      id: 'm-168',
      name: 'Number Jump',
      materials: 'Number cards, floor space',
      difficulty: 'Beginner',
      ageGroup: '4-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students jump number of times shown on card.',
      instructions: [
        'Show number card',
        'Students jump that many times',
        'Count jumps together',
        'Practice numbers and counting',
        'Physical activity and learning'
      ],
      variations: 'Different number ranges. Different actions.'
    },
    {
      id: 'm-169',
      name: 'Weather Report',
      materials: 'Weather pictures, weather words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students describe weather using vocabulary.',
      instructions: [
        'Show weather picture (sunny, rainy, cloudy, etc.)',
        'Students describe weather in English',
        '"It\'s sunny today." "It\'s raining."',
        'Practice weather vocabulary',
        'Daily conversation practice'
      ],
      variations: 'Different weather conditions. Forecasting.'
    },
    {
      id: 'm-170',
      name: 'Food Sorting',
      materials: 'Food pictures, sorting categories',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Students sort food pictures into categories.',
      instructions: [
        'Give groups food pictures and category cards',
        'Categories: fruits, vegetables, drinks, etc.',
        'Students sort pictures into correct categories',
        'Say food names and categories',
        'Practice food vocabulary and categorization'
      ],
      variations: 'Different food types. More categories.'
    },
    {
      id: 'm-171',
      name: 'Transportation Sounds',
      materials: 'Vehicle pictures, sound effects',
      difficulty: 'Beginner',
      ageGroup: '3-8',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students identify vehicles from sounds and pictures.',
      instructions: [
        'Play vehicle sound or show picture',
        'Students identify vehicle',
        'Make vehicle sounds together',
        '"Car goes vroom! Plane goes whoosh!"',
        'Practice transportation vocabulary'
      ],
      variations: 'Different vehicles. Sound matching.'
    },
    {
      id: 'm-172',
      name: 'Classroom Objects',
      materials: 'Classroom objects, word cards',
      difficulty: 'Beginner',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students learn and identify classroom objects.',
      instructions: [
        'Show classroom object (pen, book, chair, etc.)',
        'Students say object name in English',
        'Pass objects around for touching',
        'Practice classroom vocabulary',
        'Real-world object recognition'
      ],
      variations: 'Different objects. Memory game.'
    },
    {
      id: 'm-173',
      name: 'Emotion Faces',
      materials: 'Emotion cards, mirror optional',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students make faces for different emotions.',
      instructions: [
        'Show emotion card (happy, sad, angry, etc.)',
        'Students make corresponding facial expression',
        'Say emotion word',
        '"I am happy. I am sad."',
        'Practice emotion vocabulary and expression'
      ],
      variations: 'Different emotions. Emotion charades.'
    },
    {
      id: 'm-174',
      name: 'Daily Routine',
      materials: 'Routine pictures, time cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students describe daily activities and routines.',
      instructions: [
        'Show daily routine picture (wake up, eat, play, etc.)',
        'Students describe activity and time',
        '"I wake up at 7 o\'clock."',
        'Practice daily routine vocabulary',
        'Time expression practice'
      ],
      variations: 'Different routines. Student schedules.'
    },
    {
      id: 'm-175',
      name: 'Clothing Identification',
      materials: 'Clothing items, clothing cards',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students identify and name clothing items.',
      instructions: [
        'Show clothing item or picture',
        'Students say clothing name',
        'Point to clothing they\'re wearing',
        '"This is a shirt. I wear pants."',
        'Practice clothing vocabulary'
      ],
      variations: 'Different clothing items. Seasonal clothes.'
    },
    {
      id: 'm-176',
      name: 'Preposition Practice',
      materials: 'Box, ball, classroom objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students practice prepositions with objects.',
      instructions: [
        'Use box and ball to demonstrate prepositions',
        '"The ball is IN the box."',
        '"The ball is ON the box."',
        'Students practice with different objects',
        'Practice preposition vocabulary'
      ],
      variations: 'Different prepositions. More objects.'
    },
    {
      id: 'm-177',
      name: 'Action Verbs',
      materials: 'Action cards, space to move',
      difficulty: 'Beginner',
      ageGroup: '4-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students perform and identify action verbs.',
      instructions: [
        'Show action card (jump, run, sleep, etc.)',
        'Students perform the action',
        'Say action word',
        '"I can jump. I can run."',
        'Practice action verb vocabulary'
      ],
      variations: 'Different actions. Team competition.'
    },
    {
      id: 'm-178',
      name: 'Opposite Words',
      materials: 'Opposite word cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students match and say opposite words.',
      instructions: [
        'Show word card (big, hot, happy, etc.)',
        'Students say opposite word',
        '"Big is opposite of small."',
        'Practice opposite vocabulary',
        'Word relationship understanding'
      ],
      variations: 'Different opposites. More complex words.'
    },
    {
      id: 'm-179',
      name: 'Position Words',
      materials: 'Classroom objects, position cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students describe object positions.',
      instructions: [
        'Place object in different positions',
        'Students describe position',
        '"The book is on the desk."',
        '"The pen is under the chair."',
        'Practice position vocabulary'
      ],
      variations: 'Different positions. More objects.'
    },
    {
      id: 'm-180',
      name: 'Question Words',
      materials: 'Question word cards, answer prompts',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students practice forming questions with question words.',
      instructions: [
        'Show question word card (What, Where, Who, etc.)',
        'Give answer prompt',
        'Students form appropriate question',
        '"Where is the book? It\'s on the desk."',
        'Practice question formation'
      ],
      variations: 'Different question types. More complex questions.'
    },
    {
      id: 'm-181',
      name: 'Time Telling',
      materials: 'Clock faces, time cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students practice telling time.',
      instructions: [
        'Show clock face or time card',
        'Students say the time',
        '"It\'s three o\'clock." "It\'s half past four."',
        'Practice time vocabulary',
        'Real-world skill practice'
      ],
      variations: 'Different times. Digital and analog.'
    },
    {
      id: 'm-182',
      name: 'Classroom Commands',
      materials: 'Command cards, classroom space',
      difficulty: 'Beginner',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students follow and give classroom commands.',
      instructions: [
        'Show command card (stand up, sit down, etc.)',
        'Students follow the command',
        'Students can give commands to others',
        'Practice classroom vocabulary',
        'Following instructions'
      ],
      variations: 'Different commands. Student-led.'
    },
    {
      id: 'm-183',
      name: 'Seasonal Activities',
      materials: 'Season pictures, activity cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Students match activities with seasons.',
      instructions: [
        'Show season picture (spring, summer, etc.)',
        'Students name activities for that season',
        '"In summer we go swimming."',
        'Practice seasonal vocabulary',
        'Cultural understanding'
      ],
      variations: 'Different seasons. More activities.'
    },
    {
      id: 'm-184',
      name: 'School Subjects',
      materials: 'Subject pictures, school vocabulary',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students learn school subject vocabulary.',
      instructions: [
        'Show subject picture (math, science, etc.)',
        'Students say subject name',
        'Discuss what they learn in each subject',
        'Practice school vocabulary',
        'Educational context'
      ],
      variations: 'Different subjects. Student preferences.'
    },
    {
      id: 'm-185',
      name: 'Hobby Matching',
      materials: 'Hobby pictures, equipment cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students match hobbies with equipment.',
      instructions: [
        'Give pairs hobby pictures and equipment cards',
        'Match hobbies with needed equipment',
        'Say hobby and equipment names',
        '"For football, you need a ball."',
        'Practice hobby vocabulary'
      ],
      variations: 'Different hobbies. More complex matching.'
    },
    {
      id: 'm-186',
      name: 'Community Places',
      materials: 'Place pictures, community vocabulary',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students learn community place vocabulary.',
      instructions: [
        'Show community place picture (hospital, school, etc.)',
        'Students say place name and what happens there',
        '"This is a hospital. Doctors work here."',
        'Practice community vocabulary',
        'Real-world context'
      ],
      variations: 'Different places. Student experiences.'
    },
    {
      id: 'm-187',
      name: 'Occupation Guessing',
      materials: 'Job pictures, tool cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students guess occupations from tools or descriptions.',
      instructions: [
        'Show tools or give job description',
        'Students guess the occupation',
        'Say job name and what they do',
        '"A doctor helps sick people."',
        'Practice job vocabulary'
      ],
      variations: 'Different jobs. More complex descriptions.'
    },
    {
      id: 'm-188',
      name: 'Nature Walk',
      materials: 'Nature pictures, outdoor vocabulary',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students learn nature and outdoor vocabulary.',
      instructions: [
        'Show nature picture (tree, flower, river, etc.)',
        'Students say what they see',
        'Describe colors, sizes, locations',
        'Practice nature vocabulary',
        'Environmental awareness'
      ],
      variations: 'Different nature scenes. Seasonal changes.'
    },
    {
      id: 'm-189',
      name: 'Party Planning',
      materials: 'Party items, planning cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students plan parties using vocabulary.',
      instructions: [
        'Groups plan birthday parties or celebrations',
        'List needed items and activities',
        'Present party plans to class',
        'Practice planning vocabulary',
        'Group collaboration and speaking'
      ],
      variations: 'Different party types. Budget constraints.'
    },
    {
      id: 'm-190',
      name: 'Recipe Reading',
      materials: 'Simple recipes, food vocabulary',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students read and understand simple recipes.',
      instructions: [
        'Give pairs simple recipes',
        'Read and identify ingredients and steps',
        'Explain recipes to each other',
        'Practice food and cooking vocabulary',
        'Reading comprehension and speaking'
      ],
      variations: 'Different recipe types. More complex recipes.'
    },
    {
      id: 'm-192',
      name: 'Map Directions',
      materials: 'Maps, direction cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students give and follow directions on maps.',
      instructions: [
        'Give pairs maps and destination cards',
        'One student gives directions to another',
        'Practice direction vocabulary',
        '"Go straight. Turn left. It\'s next to the bank."',
        'Map reading and communication skills'
      ],
      variations: 'Different map types. More complex routes.'
    },
    {
      id: 'm-193',
      name: 'Phone Conversation',
      materials: 'Phone scenarios, dialogue prompts',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students practice phone conversations.',
      instructions: [
        'Give pairs phone conversation scenarios',
        'Practice making appointments, ordering food, etc.',
        'Focus on phone etiquette and phrases',
        'Role-play conversations back-to-back',
        'Practical communication skills'
      ],
      variations: 'Different call types. More formal conversations.'
    },
    {
      id: 'm-194',
      name: 'Restaurant Ordering',
      materials: 'Menus, ordering scenarios',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students practice restaurant vocabulary and ordering.',
      instructions: [
        'Set up restaurant role-play',
        'Some students are customers, some are staff',
        'Practice ordering, asking questions, paying',
        'Use restaurant vocabulary naturally',
        'Real-world dining communication'
      ],
      variations: 'Different restaurant types. Dietary restrictions.'
    },
    {
      id: 'm-195',
      name: 'Medical Emergency',
      materials: 'Medical scenario cards, symptom descriptions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students practice medical emergency communication.',
      instructions: [
        'Role-play medical emergency scenarios',
        'Practice describing symptoms and asking questions',
        'Focus on clear, urgent communication',
        'Medical vocabulary and emergency phrases',
        'Important life skills practice'
      ],
      variations: 'Different emergencies. More complex symptoms.'
    },
    {
      id: 'm-196',
      name: 'Job Interview',
      materials: 'Job descriptions, interview questions',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Pairs',
      description: 'Students practice job interview skills.',
      instructions: [
        'One student is interviewer, one is candidate',
        'Practice common interview questions and answers',
        'Focus on professional language and confidence',
        'Discuss strengths, experience, goals',
        'Career and professional communication'
      ],
      variations: 'Different job types. Group interviews.'
    },
    {
      id: 'm-197',
      name: 'Hotel Check-in',
      materials: 'Hotel scenarios, reservation cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students practice hotel check-in conversations.',
      instructions: [
        'Role-play hotel receptionist and guest',
        'Practice booking, checking in, asking questions',
        'Use hotel and travel vocabulary',
        'Customer service communication',
        'Travel and hospitality language'
      ],
      variations: 'Different hotel types. More complex requests.'
    },
    {
      id: 'm-198',
      name: 'Airport Travel',
      materials: 'Airport scenarios, travel documents',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students practice airport travel communication.',
      instructions: [
        'Role-play airport scenarios (check-in, security, boarding)',
        'Practice travel vocabulary and procedures',
        'Focus on clear communication in stressful situations',
        'Travel preparation and safety language',
        'International travel communication'
      ],
      variations: 'Different travel scenarios. More complex situations.'
    },
    {
      id: 'm-199',
      name: 'Bank Transactions',
      materials: 'Bank scenarios, transaction forms',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students practice banking communication.',
      instructions: [
        'Role-play bank teller and customer',
        'Practice opening accounts, asking about services',
        'Use financial and banking vocabulary',
        'Professional and clear communication',
        'Financial literacy and language'
      ],
      variations: 'Different banking services. More complex transactions.'
    },
    {
      id: 'm-200',
      name: 'Emergency Services',
      materials: 'Emergency scenarios, service cards',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students practice calling emergency services.',
      instructions: [
        'Role-play emergency calls (police, fire, ambulance)',
        'Practice giving clear information under pressure',
        'Focus on essential details and calm communication',
        'Emergency vocabulary and procedures',
        'Critical life-saving communication skills'
      ],
      variations: 'Different emergencies. Time pressure challenges.'
    },
    {
      id: 'm-201',
      name: 'Public Transportation',
      materials: 'Transport maps, scenario cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students practice using public transportation.',
      instructions: [
        'Role-play asking for directions and help',
        'Practice bus, train, subway vocabulary',
        'Ask about schedules, prices, routes',
        'Navigation and assistance communication',
        'Urban travel and independence skills'
      ],
      variations: 'Different transport types. Tourist scenarios.'
    },
    {
      id: 'm-202',
      name: 'Library Visit',
      materials: 'Library scenarios, book categories',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students practice library communication.',
      instructions: [
        'Role-play librarian and student',
        'Practice asking for books, using computers',
        'Library rules and procedures vocabulary',
        'Educational and cultural communication',
        'Academic and research language'
      ],
      variations: 'Different library services. More complex requests.'
    },
    {
      id: 'm-203',
      name: 'Post Office Visit',
      materials: 'Mail scenarios, postal vocabulary',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students practice post office communication.',
      instructions: [
        'Role-play postal worker and customer',
        'Practice sending mail, buying stamps, asking questions',
        'Postal vocabulary and procedures',
        'International mail and package shipping',
        'Everyday practical communication'
      ],
      variations: 'Different postal services. More complex shipping.'
    },
    {
      id: 'm-204',
      name: 'Doctor Appointment',
      materials: 'Medical scenarios, symptom cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students practice doctor-patient communication.',
      instructions: [
        'Role-play doctor and patient',
        'Practice describing symptoms, asking questions',
        'Medical vocabulary and clear explanations',
        'Health communication and understanding',
        'Medical literacy and advocacy'
      ],
      variations: 'Different medical issues. More complex cases.'
    },
    {
      id: 'm-205',
      name: 'Parent-Teacher Conference',
      materials: 'School scenarios, progress reports',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students practice parent-teacher conferences.',
      instructions: [
        'Role-play teacher and parent',
        'Practice discussing student progress and concerns',
        'Educational vocabulary and diplomatic language',
        'Constructive communication about learning',
        'Educational partnership communication'
      ],
      variations: 'Different student issues. More complex conferences.'
    },
    {
      id: 'm-206',
      name: 'Business Meeting',
      materials: 'Business scenarios, agenda cards',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students practice business meeting communication.',
      instructions: [
        'Role-play business meeting scenarios',
        'Practice professional language and etiquette',
        'Discuss projects, problems, solutions',
        'Business vocabulary and formal communication',
        'Professional workplace communication'
      ],
      variations: 'Different meeting types. More formal presentations.'
    },
    {
      id: 'm-207',
      name: 'Customer Service',
      materials: 'Service scenarios, complaint cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students practice customer service communication.',
      instructions: [
        'Role-play customer service representative and customer',
        'Practice handling complaints, requests, inquiries',
        'Polite and professional language',
        'Problem-solving communication',
        'Service industry communication skills'
      ],
      variations: 'Different service types. More difficult customers.'
    },
    {
      id: 'm-208',
      name: 'Social Media Interaction',
      materials: 'Social media scenarios, communication cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '14-Adult',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Students practice social media communication.',
      instructions: [
        'Role-play social media interactions',
        'Practice online etiquette and language',
        'Discuss appropriate online communication',
        'Digital communication and safety',
        'Modern social communication skills'
      ],
      variations: 'Different platforms. More complex interactions.'
    },
    {
      id: 'm-209',
      name: 'Cultural Exchange',
      materials: 'Culture scenarios, custom cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students practice cross-cultural communication.',
      instructions: [
        'Role-play cultural exchange scenarios',
        'Practice explaining customs and asking questions',
        'Cultural awareness and respectful communication',
        'Intercultural understanding and language',
        'Global communication skills'
      ],
      variations: 'Different cultures. More complex exchanges.'
    },
    {
      id: 'm-210',
      name: 'Environmental Action',
      materials: 'Environmental scenarios, action cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students discuss environmental issues and solutions.',
      instructions: [
        'Discuss environmental problems and solutions',
        'Practice environmental vocabulary',
        'Plan environmental actions and campaigns',
        'Advocacy and persuasive communication',
        'Environmental awareness and action'
      ],
      variations: 'Different environmental topics. Community projects.'
    },
    {
      id: 'm-211',
      name: 'Technology Help',
      materials: 'Tech problems, solution cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students practice technical support communication.',
      instructions: [
        'Role-play tech support and user',
        'Practice explaining technical problems clearly',
        'Technical vocabulary and step-by-step instructions',
        'Problem-solving communication',
        'Technical literacy and communication'
      ],
      variations: 'Different tech problems. More complex solutions.'
    },
    {
      id: 'm-212',
      name: 'Volunteer Coordination',
      materials: 'Volunteer scenarios, project cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students practice organizing volunteer activities.',
      instructions: [
        'Plan volunteer projects and activities',
        'Practice coordination and delegation language',
        'Discuss community needs and solutions',
        'Leadership and teamwork communication',
        'Community engagement and service'
      ],
      variations: 'Different volunteer projects. Community needs.'
    },
    {
      id: 'm-213',
      name: 'Financial Planning',
      materials: 'Budget scenarios, planning tools',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Pairs',
      description: 'Students practice financial planning discussions.',
      instructions: [
        'Role-play financial advisor and client',
        'Practice financial vocabulary and concepts',
        'Discuss budgeting, saving, and investing',
        'Financial literacy and planning communication',
        'Money management and future planning'
      ],
      variations: 'Different financial scenarios. More complex planning.'
    },
    {
      id: 'm-214',
      name: 'Conflict Resolution',
      materials: 'Conflict scenarios, resolution strategies',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students practice resolving conflicts through communication.',
      instructions: [
        'Role-play conflict scenarios',
        'Practice peaceful resolution strategies',
        'Use "I" statements and active listening',
        'Mediation and negotiation language',
        'Peace-building and communication skills'
      ],
      variations: 'Different conflict types. More complex resolutions.'
    },
    {
      id: 'm-215',
      name: 'Health and Wellness',
      materials: 'Health scenarios, wellness topics',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students discuss health and wellness topics.',
      instructions: [
        'Discuss health topics and wellness strategies',
        'Practice health vocabulary and concepts',
        'Share health tips and experiences',
        'Health education and awareness communication',
        'Wellness and lifestyle communication'
      ],
      variations: 'Different health topics. More complex discussions.'
    },
    {
      id: 'm-216',
      name: 'Art Appreciation',
      materials: 'Art reproductions, art vocabulary',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students discuss and analyze artworks.',
      instructions: [
        'Show art reproductions to groups',
        'Students describe what they see and feel',
        'Practice art vocabulary and expressions',
        'Discuss artist techniques and meanings',
        'Cultural and artistic communication'
      ],
      variations: 'Different art styles. Museum visits.'
    },
    {
      id: 'm-217',
      name: 'Music Discussion',
      materials: 'Music samples, music vocabulary',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Students discuss music and share preferences.',
      instructions: [
        'Play different music samples',
        'Students describe music and feelings',
        'Practice music vocabulary and genres',
        'Share cultural music experiences',
        'Musical and emotional communication'
      ],
      variations: 'Different music genres. Cultural music.'
    },
    {
      id: 'm-218',
      name: 'Film Analysis',
      materials: 'Film clips, cinema vocabulary',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students analyze and discuss film clips.',
      instructions: [
        'Show short film clips',
        'Students discuss plot, characters, themes',
        'Practice cinema and storytelling vocabulary',
        'Analyze camera techniques and acting',
        'Film criticism and discussion skills'
      ],
      variations: 'Different film genres. Student films.'
    },
    {
      id: 'm-219',
      name: 'Book Club',
      materials: 'Book excerpts, literature vocabulary',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students discuss book excerpts and stories.',
      instructions: [
        'Read book excerpts together',
        'Discuss characters, plot, themes',
        'Practice literature analysis vocabulary',
        'Share personal interpretations and feelings',
        'Literary discussion and analysis skills'
      ],
      variations: 'Different book genres. Student writing.'
    },
    {
      id: 'm-220',
      name: 'Current Events',
      materials: 'News articles, discussion prompts',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students discuss current news events.',
      instructions: [
        'Read news articles on current events',
        'Students discuss opinions and implications',
        'Practice news and current events vocabulary',
        'Develop critical thinking about news',
        'Informed citizen communication skills'
      ],
      variations: 'Different news topics. Local news.'
    },
    {
      id: 'm-221',
      name: 'Science Discovery',
      materials: 'Science topics, experiment descriptions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students discuss scientific concepts and discoveries.',
      instructions: [
        'Present science topics or experiments',
        'Students explain concepts in simple terms',
        'Practice scientific vocabulary and explanations',
        'Discuss real-world applications',
        'Science communication and literacy'
      ],
      variations: 'Different science fields. Simple experiments.'
    },
    {
      id: 'm-222',
      name: 'History Discussion',
      materials: 'Historical topics, timeline cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students discuss historical events and their impact.',
      instructions: [
        'Present historical events or periods',
        'Students discuss causes and effects',
        'Practice historical vocabulary and concepts',
        'Connect history to present day',
        'Historical thinking and communication'
      ],
      variations: 'Different historical periods. Local history.'
    },
    {
      id: 'm-223',
      name: 'Geography Exploration',
      materials: 'Maps, geography vocabulary',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students explore and discuss geographical features.',
      instructions: [
        'Study maps and geographical features',
        'Students describe locations and characteristics',
        'Practice geography and direction vocabulary',
        'Discuss climate and culture connections',
        'Geographic literacy and communication'
      ],
      variations: 'Different regions. Virtual field trips.'
    },
    {
      id: 'm-224',
      name: 'Technology Trends',
      materials: 'Tech articles, technology vocabulary',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students discuss technology trends and impacts.',
      instructions: [
        'Read about current technology trends',
        'Students discuss benefits and concerns',
        'Practice technology and innovation vocabulary',
        'Consider ethical and social implications',
        'Technology literacy and future thinking'
      ],
      variations: 'Different tech fields. Student tech experiences.'
    },
    {
      id: 'm-225',
      name: 'Career Exploration',
      materials: 'Career information, profession vocabulary',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students explore and discuss different careers.',
      instructions: [
        'Research different career options',
        'Students discuss requirements and benefits',
        'Practice career and workplace vocabulary',
        'Share personal interests and goals',
        'Career planning and communication skills'
      ],
      variations: 'Different career fields. Guest speakers.'
    },
    {
      id: 'm-226',
      name: 'Global Issues',
      materials: 'Global topics, discussion materials',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '30-35 min',
      players: 'Small groups',
      description: 'Students discuss important global issues.',
      instructions: [
        'Present global issues (climate, poverty, etc.)',
        'Students discuss causes and solutions',
        'Practice global citizenship vocabulary',
        'Consider different perspectives and cultures',
        'Global awareness and communication skills'
      ],
      variations: 'Different global topics. Solution planning.'
    },
    {
      id: 'm-227',
      name: 'Entrepreneurship',
      materials: 'Business ideas, planning materials',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students develop and discuss business ideas.',
      instructions: [
        'Brainstorm business ideas and solutions',
        'Students discuss business plans and strategies',
        'Practice entrepreneurship and business vocabulary',
        'Present business pitches to class',
        'Business communication and innovation skills'
      ],
      variations: 'Different business types. Market research.'
    },
    {
      id: 'm-228',
      name: 'Philosophy Discussion',
      materials: 'Philosophical questions, thinking prompts',
      difficulty: 'Advanced',
      ageGroup: '16-Adult',
      duration: '30-35 min',
      players: 'Small groups',
      description: 'Students discuss philosophical questions and concepts.',
      instructions: [
        'Present philosophical questions and scenarios',
        'Students discuss different viewpoints',
        'Practice abstract thinking and vocabulary',
        'Develop logical reasoning and argumentation',
        'Philosophical thinking and communication'
      ],
      variations: 'Different philosophical topics. Ethical dilemmas.'
    },
    {
      id: 'm-229',
      name: 'Creative Writing Workshop',
      materials: 'Writing prompts, sharing time',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '30-35 min',
      players: 'Small groups',
      description: 'Students write and share creative pieces.',
      instructions: [
        'Provide creative writing prompts',
        'Students write stories, poems, or essays',
        'Share writing with group for feedback',
        'Practice creative expression and vocabulary',
        'Writing workshop communication skills'
      ],
      variations: 'Different writing genres. Peer review.'
    },
    {
      id: 'm-230',
      name: 'Debate Club',
      materials: 'Debate topics, argument structure',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '30-35 min',
      players: 'Teams',
      description: 'Students practice formal debate skills.',
      instructions: [
        'Assign debate topics and positions',
        'Students research and prepare arguments',
        'Practice formal debate structure and etiquette',
        'Develop persuasive speaking and reasoning',
        'Debate and critical communication skills'
      ],
      variations: 'Different debate topics. Tournament format.'
    },
    {
      id: 'm-231',
      name: 'Language Exchange',
      materials: 'Language materials, cultural items',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Pairs',
      description: 'Students practice teaching and learning languages.',
      instructions: [
        'Students teach each other phrases from their languages',
        'Practice language learning vocabulary',
        'Share cultural insights and expressions',
        'Develop teaching and learning communication',
        'Cross-cultural language exchange skills'
      ],
      variations: 'Different language pairs. Cultural activities.'
    },
    {
      id: 'm-232',
      name: 'Media Literacy',
      materials: 'Media examples, analysis tools',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students analyze and discuss media messages.',
      instructions: [
        'Analyze various media (ads, news, social media)',
        'Students discuss messages and techniques',
        'Practice media literacy and critical thinking vocabulary',
        'Develop media awareness and analysis skills',
        'Digital citizenship and communication'
      ],
      variations: 'Different media types. Current examples.'
    },
    {
      id: 'm-233',
      name: 'Innovation Lab',
      materials: 'Problem cards, brainstorming tools',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '30-35 min',
      players: 'Small groups',
      description: 'Students brainstorm innovative solutions to problems.',
      instructions: [
        'Present real-world problems to solve',
        'Students brainstorm creative solutions',
        'Practice innovation and problem-solving vocabulary',
        'Develop design thinking and collaboration',
        'Innovation and creative communication skills'
      ],
      variations: 'Different problem types. Prototyping.'
    },
    {
      id: 'm-234',
      name: 'Leadership Training',
      materials: 'Leadership scenarios, skill-building activities',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '30-35 min',
      players: 'Small groups',
      description: 'Students practice and develop leadership skills.',
      instructions: [
        'Present leadership challenges and scenarios',
        'Students practice leading group activities',
        'Develop leadership and communication vocabulary',
        'Practice motivation and delegation skills',
        'Leadership and team communication skills'
      ],
      variations: 'Different leadership styles. Real challenges.'
    },
    {
      id: 'm-235',
      name: 'Community Project',
      materials: 'Community needs, planning materials',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '30-35 min',
      players: 'Small groups',
      description: 'Students plan community improvement projects.',
      instructions: [
        'Identify community needs and problems',
        'Students plan community service projects',
        'Practice project planning and communication vocabulary',
        'Develop civic engagement and leadership',
        'Community action and communication skills'
      ],
      variations: 'Different community issues. Implementation planning.'
    },
    {
      id: 'm-236',
      name: 'Digital Storytelling',
      materials: 'Digital tools, story prompts',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students create and share digital stories.',
      instructions: [
        'Use digital tools to create stories',
        'Students combine images, text, and audio',
        'Practice digital storytelling vocabulary',
        'Share stories and discuss techniques',
        'Digital creativity and communication skills'
      ],
      variations: 'Different digital tools. Story themes.'
    },
    {
      id: 'm-237',
      name: 'Mindfulness Practice',
      materials: 'Mindfulness exercises, reflection materials',
      difficulty: 'Beginner-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Students practice mindfulness and share experiences.',
      instructions: [
        'Guide students through mindfulness exercises',
        'Practice mindfulness and emotion vocabulary',
        'Students share experiences and feelings',
        'Develop emotional awareness and expression',
        'Mindfulness and emotional communication skills'
      ],
      variations: 'Different mindfulness techniques. Reflection journals.'
    },
    {
      id: 'm-238',
      name: 'Future Planning',
      materials: 'Goal-setting materials, planning tools',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Individuals/Small groups',
      description: 'Students set and discuss future goals and plans.',
      instructions: [
        'Guide students in goal-setting exercises',
        'Practice future planning and aspiration vocabulary',
        'Students share goals and action plans',
        'Develop motivation and planning communication',
        'Future planning and aspiration skills'
      ],
      variations: 'Different goal areas. Timeline planning.'
    },
    {
      id: 'm-240',
      name: 'Problem-Solving Challenge',
      materials: 'Challenge cards, solution materials',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '30-35 min',
      players: 'Small groups',
      description: 'Students solve complex problems collaboratively.',
      instructions: [
        'Present complex challenges and problems',
        'Students work together to find solutions',
        'Practice problem-solving and collaboration vocabulary',
        'Develop critical thinking and teamwork',
        'Advanced problem-solving communication skills'
      ],
      variations: 'Different problem types. Competition format.'
    }
  ],

  // ============================================
  // CIRCLE GAMES
  // ============================================
  'circle': [
    {
      id: 'c-001',
      name: 'Hot Potato',
      materials: 'Small object (soft ball, toy)',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students pass a "hot potato" around in a circle while music plays. When music stops, student holding it answers.',
      instructions: [
        'Students sit in a circle',
        'Pass a small object around',
        'Play music or count aloud',
        'When music stops or count ends',
        'Student holding the potato answers a question',
        'Fun and fast-paced'
      ],
      variations: 'Different questions. Faster music.'
    },
    {
      id: 'c-002',
      name: 'Circle Time Sharing',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Each student shares something in turn around the circle. Practice speaking and listening.',
      instructions: [
        'Students sit in a circle',
        'Each student shares when it\'s their turn',
        'Topics: weekend, favorite food, hobbies',
        'Everyone listens to each person',
        'Practice speaking and listening',
        'Build classroom community'
      ],
      variations: 'Different topics. Time limit per person.'
    },
    {
      id: 'c-003',
      name: 'Memory Circle',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'First student says a word. Next student repeats and adds one. Continue around circle.',
      instructions: [
        'First student says a word',
        'Second student repeats and adds one more',
        'Third student repeats both and adds another',
        'Continue around the circle',
        'Memory challenge',
        'Vocabulary practice',
        'Fun when someone forgets!'
      ],
      variations: 'Themed words. Longer lists.'
    },
    {
      id: 'c-004',
      name: 'Pass the Message',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Whisper a message around the circle. Compare final message with original.',
      instructions: [
        'Teacher whispers message to first student',
        'Pass message around the circle by whispering',
        'Last student says the message aloud',
        'Compare with original',
        'Shows how messages change',
        'Listening practice'
      ],
      variations: 'Different message lengths.'
    },
    {
      id: 'c-004',
      name: 'Circle Story',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Build a story around the circle with each student adding one sentence.',
      instructions: [
        'Start with one student saying one sentence',
        'Each student adds one sentence',
        'Build the story around the circle',
        'Keep it coherent and interesting',
        'Practice speaking',
        'Creativity',
        'Listening to others'
      ],
      variations: 'Themed stories. Different genres.'
    },
    {
      id: 'c-005',
      name: 'Word Association Circle',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students say words related to previous word around circle.',
      instructions: [
        'First student says any word',
        'Next student says related word',
        'Explain connection briefly',
        'Continue around circle',
        'Practice vocabulary',
        'Quick thinking',
        'Word relationships'
      ],
      variations: 'Themed words only. Speed rounds.'
    },
    {
      id: 'c-006',
      name: 'Circle Questions',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students ask and answer questions in circle format.',
      instructions: [
        'Students sit in circle',
        'First student asks question to next',
        'Next student answers and asks new question',
        'Continue around circle',
        'Practice question formation',
        'Answering skills',
        'Turn-taking'
      ],
      variations: 'Different question topics. Time limits.'
    },
    {
      id: 'c-007',
      name: 'Circle Mime',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students mime actions for others to guess in circle.',
      instructions: [
        'Students sit in circle',
        'One student mimes an action',
        'Others guess what they\'re doing',
        'Correct guess takes next turn',
        'Practice vocabulary',
        'Non-verbal communication',
        'Observation skills'
      ],
      variations: 'Different action categories. Team guessing.'
    },
    {
      id: 'c-008',
      name: 'Circle Counting',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Count around circle with variations.',
      instructions: [
        'Students count sequentially around circle',
        'Add variations: skip numbers, count backwards',
        'Say numbers in English',
        'Practice counting',
        'Number vocabulary',
        'Concentration'
      ],
      variations: 'Different counting patterns. Faster pace.'
    },
    {
      id: 'c-009',
      name: 'Circle Categories',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Name items in categories around circle.',
      instructions: [
        'Announce category (animals, food, etc.)',
        'Each student names one item in category',
        'Can\'t repeat items',
        'Student who hesitates or repeats is out',
        'Practice vocabulary',
        'Categories',
        'Quick thinking'
      ],
      variations: 'Different categories. More complex themes.'
    },
    {
      id: 'c-010',
      name: 'Circle Spelling',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Spell words around circle, one letter per student.',
      instructions: [
        'Teacher announces vocabulary word',
        'Students spell word one letter at a time',
        'Go around circle with letters',
        'Wrong letter = student sits out',
        'Practice spelling',
        'Letter recognition',
        'Concentration'
      ],
      variations: 'Different word difficulties. Team spelling.'
    },
    {
      id: 'c-011',
      name: 'Circle Rhymes',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Create rhyming chains around circle.',
      instructions: [
        'First student says a word',
        'Next student says rhyming word',
        'Continue around circle',
        'Can\'t repeat rhymes',
        'Practice pronunciation',
        'Rhyming skills',
        'Creativity'
      ],
      variations: 'Different word types. Speed rounds.'
    },
    {
      id: 'c-012',
      name: 'Circle Descriptions',
      materials: 'Object to describe',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students describe objects around circle.',
      instructions: [
        'Show object to class',
        'Each student describes one feature',
        'Build complete description together',
        'Practice descriptive language',
        'Observation skills',
        'Vocabulary building'
      ],
      variations: 'Different objects. More complex descriptions.'
    },
    {
      id: 'c-013',
      name: 'Circle Emotions',
      materials: 'Emotion cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students express and identify emotions in circle.',
      instructions: [
        'Student draws emotion card',
        'Acts out emotion for others to guess',
        'Discuss situations that cause emotions',
        'Practice emotion vocabulary',
        'Expression skills',
        'Empathy building'
      ],
      variations: 'Different emotions. Complex scenarios.'
    },
    {
      id: 'c-014',
      name: 'Circle Directions',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Follow and give directions in circle format.',
      instructions: [
        'Students give directions to next student',
        '"Stand up and turn around"',
        'Next student follows and gives new direction',
        'Practice following instructions',
        'Direction vocabulary',
        'Listening skills'
      ],
      variations: 'More complex directions. Multi-step instructions.'
    },
    {
      id: 'c-015',
      name: 'Circle Alphabet',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Go through alphabet with words around circle.',
      instructions: [
        'First student says "A is for apple"',
        'Next student says "B is for ball"',
        'Continue through alphabet',
        'Practice alphabet',
        'Vocabulary',
        'Letter-sound correspondence'
      ],
      variations: 'Different themes. Faster pace.'
    }
  ],

  // ============================================
  // GRAMMAR GAMES
  // ============================================
  'grammar': [
    {
      id: 'g-001',
      name: 'Grammar Race',
      materials: 'Whiteboard, markers, grammar sentences',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Two teams race to complete grammar sentences on the whiteboard.',
      instructions: [
        'Write incomplete sentences on whiteboard',
        'Two teams race to complete them correctly',
        'Focus on specific grammar point',
        'First to complete all correctly wins',
        'Competitive grammar practice',
        'Review and reinforce'
      ],
      variations: 'Different grammar points. Team relay.'
    },
    {
      id: 'g-002',
      name: 'Find the Mistake',
      materials: 'Sentences with grammar mistakes, whiteboard',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Write sentences with grammar mistakes on board. Students find and correct them.',
      instructions: [
        'Write sentences with grammar mistakes on board',
        'Students find and correct the mistakes',
        'Raise hand to answer',
        'Discuss why it\'s wrong',
        'Learn from common errors',
        'Practice error correction'
      ],
      variations: 'Different error types. Team competition.'
    },
    {
      id: 'g-003',
      name: 'Grammar Noughts and Crosses',
      materials: '3x3 grid on board, grammar questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Draw 3x3 grid. Each square has a grammar question. Teams compete to get 3 in a row.',
      instructions: [
        'Draw a 3x3 grid on the board',
        'Each square has a grammar question',
        'Teams take turns answering',
        'Correct answer = claim the square',
        'First to get 3 in a row wins',
        'Review grammar topics',
        'Competitive and fun'
      ],
      variations: 'Larger grids. Different grammar topics.'
    },
    {
      id: 'g-004',
      name: 'Sentence Building Race',
      materials: 'Word cards, whiteboard',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Give teams word cards. Race to build correct sentences.',
      instructions: [
        'Give teams scrambled word cards',
        'Race to build correct sentences',
        'Focus on specific grammar structure',
        'First to build all correctly wins',
        'Hands-on sentence construction',
        'Practice word order'
      ],
      variations: 'Different sentence structures. More words.'
    },
    {
      id: 'g-005',
      name: 'Preposition Hunt',
      materials: 'Objects around the room, preposition flashcards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Place objects around the room. Students use prepositions to describe locations.',
      instructions: [
        'Place objects around the room',
        'Students use prepositions to describe locations',
        '"The book is on the table"',
        '"The pen is under the chair"',
        'Practice prepositions',
        'Real-world context',
        'Spatial awareness'
      ],
      variations: 'More objects. More prepositions.'
    },
    {
      id: 'g-006',
      name: 'Tense Transformation',
      materials: 'Sentence cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Give students sentences in one tense. They transform them to another tense.',
      instructions: [
        'Give students sentences in one tense',
        'Transform them to another tense',
        'Past to present, present to future, etc.',
        'Practice tense changes',
        'Understand tense usage',
        'Verb conjugation practice'
      ],
      variations: 'Different tenses. More complex sentences.'
    },
    {
      id: 'g-007',
      name: 'Question Word Order',
      materials: 'Question word cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students arrange word cards to form correct questions.',
      instructions: [
        'Give students scrambled question word cards',
        'Arrange to form correct questions',
        'Practice question word order',
        '"Where do you live?"',
        'Review question formation',
        'Practice speaking questions'
      ],
      variations: 'Different question types. More complex.'
    },
    {
      id: 'g-008',
      name: 'Conditional Practice',
      materials: 'None',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Practice conditionals: "If I were a bird, I would fly."',
      instructions: [
        'Practice conditional structures',
        '"If I were a bird, I would fly."',
        '"If I had a million dollars, I would..."',
        'Complete the sentences',
        'Practice conditionals',
        'Imaginative language',
        'Advanced grammar'
      ],
      variations: 'Different conditionals. Creative scenarios.'
    },
    {
      id: 'g-009',
      name: 'Grammar Tic-Tac-Toe',
      materials: 'Tic-tac-toe grid, grammar questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Play tic-tac-toe by answering grammar questions correctly.',
      instructions: [
        'Draw tic-tac-toe grid on board',
        'Put grammar question in each square',
        'Players take turns answering questions',
        'Correct answer claims square with X or O',
        'First to get three in a row wins',
        'Practice grammar in competitive format'
      ],
      variations: 'Different grammar topics. Larger grids.'
    },
    {
      id: 'g-011',
      name: 'Parts of Speech Sort',
      materials: 'Word cards, sorting mats',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Sort words into parts of speech categories.',
      instructions: [
        'Give groups word cards and sorting mats',
        'Students sort words by parts of speech',
        'Nouns, verbs, adjectives, adverbs, etc.',
        'Explain sorting reasoning',
        'Practice parts of speech',
        'Word analysis',
        'Grammar awareness'
      ],
      variations: 'Different word types. More complex categories.'
    },
    {
      id: 'g-012',
      name: 'Grammar Hot Seat',
      materials: 'Grammar sentences, chair',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Student in hot seat identifies grammar in sentences.',
      instructions: [
        'One student sits in hot seat',
        'Write sentence on board',
        'Class asks student to identify grammar elements',
        'Student finds verbs, nouns, adjectives, etc.',
        'Practice grammar identification',
        'Quick thinking',
        'Grammar analysis'
      ],
      variations: 'Different sentence types. Time limits.'
    },
    {
      id: 'g-014',
      name: 'Question Formation',
      materials: 'Answer sentences, whiteboard',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Create questions from given answers.',
      instructions: [
        'Provide answer sentences to pairs',
        'Students must create appropriate questions',
        'Questions must match answers grammatically',
        'Share questions with class',
        'Practice question structure',
        'Grammar accuracy',
        'Logical thinking'
      ],
      variations: 'Different answer types. More complex questions.'
    },
    {
      id: 'g-016',
      name: 'Article Race',
      materials: 'Noun cards, article cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Race to match nouns with correct articles (a/an/the).',
      instructions: [
        'Give teams noun and article cards',
        'Teams race to match correctly',
        'Focus on a/an/the rules',
        'First team to finish wins',
        'Practice article usage',
        'Grammar rules',
        'Speed and accuracy'
      ],
      variations: 'Different noun types. More complex article rules.'
    },
    {
      id: 'g-017',
      name: 'Subject-Verb Agreement',
      materials: 'Sentence strips, whiteboard',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Practice making subjects and verbs agree.',
      instructions: [
        'Write sentences with incorrect agreement',
        'Teams must correct the sentences',
        'Focus on singular/plural agreement',
        'Correct sentences get points',
        'Practice subject-verb agreement',
        'Grammar accuracy',
        'Sentence structure'
      ],
      variations: 'Different sentence types. More complex subjects.'
    },
    {
      id: 'g-018',
      name: 'Punctuation Practice',
      materials: 'Unpunctuated sentences, punctuation cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Add correct punctuation to sentences.',
      instructions: [
        'Give pairs unpunctuated sentences',
        'Students must add correct punctuation',
        'Periods, commas, question marks, etc.',
        'Explain punctuation choices',
        'Practice punctuation rules',
        'Writing mechanics',
        'Grammar accuracy'
      ],
      variations: 'Different sentence types. More complex punctuation.'
    },
    {
      id: 'g-019',
      name: 'Comparative/Superlative',
      materials: 'Adjective cards, comparison cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Practice making comparisons with adjectives.',
      instructions: [
        'Give groups adjective cards',
        'Students create comparative and superlative forms',
        '"Big" → "Bigger" → "Biggest"',
        'Use in sentences',
        'Practice comparison structures',
        'Adjective forms',
        'Grammar patterns'
      ],
      variations: 'Different adjectives. Irregular comparisons.'
    },
    {
      id: 'g-020',
      name: 'Passive Voice Practice',
      materials: 'Active sentences, whiteboard',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Transform active sentences to passive voice.',
      instructions: [
        'Give pairs active voice sentences',
        'Students transform to passive voice',
        '"The cat chased the mouse" → "The mouse was chased by the cat"',
        'Explain transformation process',
        'Practice passive voice structure',
        'Verb forms',
        'Advanced grammar'
      ],
      variations: 'Different sentence types. More complex transformations.'
    }
  ],

  // ============================================
  // VOCABULARY GAMES
  // ============================================
  'vocabulary': [
    {
      id: 'v-001',
      name: 'Word Chain',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Last letter of first word becomes first letter of next word. Chain continues.',
      instructions: [
        'Start with any word',
        'Last letter becomes first letter of next word',
        '"Apple" → "Elephant" → "Tiger" → "Rabbit"',
        'Continue the chain',
        'Cannot repeat words',
        'Practice vocabulary and spelling',
        'Quick thinking'
      ],
      variations: 'Themed words (animals, food, etc.).'
    },
    {
      id: 'v-002',
      name: 'Categories Game',
      materials: 'Category cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Name a category. Teams race to list as many words as possible.',
      instructions: [
        'Name a category (e.g., fruit)',
        'Teams race to list as many words as possible',
        'Time limit (1-2 minutes)',
        'Most unique words wins',
        'Practice vocabulary categories',
        'Brainstorming skills',
        'Team cooperation'
      ],
      variations: 'Different categories. Letter restrictions (words starting with A).'
    },
    {
      id: 'v-003',
      name: 'Synonym Match',
      materials: 'Word cards (synonyms)',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Match word cards with their synonyms. Explain differences.',
      instructions: [
        'Match word cards with their synonyms',
        '"Big" matches "large"',
        'Explain any subtle differences',
        'Practice vocabulary expansion',
        'Understand word nuances',
        'Synonym recognition'
      ],
      variations: 'More complex synonyms. Context matching.'
    },
    {
      id: 'v-004',
      name: 'Antonym Race',
      materials: 'Word cards (antonyms)',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-14',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Race to match antonyms. First team to match all wins.',
      instructions: [
        'Race to match antonyms',
        '"Hot" matches "cold"',
        '"Fast" matches "slow"',
        'First team to match all wins',
        'Practice opposite vocabulary',
        'Speed and accuracy',
        'Team competition'
      ],
      variations: 'More complex antonyms. Time challenge.'
    },
    {
      id: 'v-005',
      name: 'Word Association',
      materials: 'Word cards',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Say a word. Next student says a word associated with it. Continue the chain.',
      instructions: [
        'Start with any word',
        'Next student says associated word',
        '"Water" → "Ocean" → "Beach" → "Sand"',
        'Explain the association',
        'Practice vocabulary connections',
        'Quick thinking',
        'Creativity'
      ],
      variations: 'Themed associations. Speed rounds.'
    },
    {
      id: 'v-006',
      name: 'Definitions Game',
      materials: 'Vocabulary cards, dictionary (optional)',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Student defines a word without saying it. Others guess.',
      instructions: [
        'Student defines a word without saying it',
        'Others try to guess the word',
        '"You use this to write with ink and paper"',
        '"Pen!"',
        'Practice definitions',
        'Speaking skills',
        'Vocabulary precision'
      ],
      variations: 'More complex words. Time limit.'
    },
    {
      id: 'v-007',
      name: 'Charades with Words',
      materials: 'Vocabulary cards',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Act out a word without speaking. Team guesses.',
      instructions: [
        'Act out a word without speaking',
        'Team guesses the word',
        'Use gestures and actions',
        'No speaking allowed',
        'Practice vocabulary',
        'Non-verbal communication',
        'Fun and engaging'
      ],
      variations: 'Different word types. Team competition.'
    }
  ],

  // ============================================
  // LISTENING GAMES
  // ============================================
  'listening': [
    {
      id: 'l-001',
      name: 'Telephone Game',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Whisper a message from student to student. Compare final with original.',
      instructions: [
        'Form a line or circle',
        'Teacher whispers a message to first student',
        'Pass message down the line by whispering',
        'Last student says message aloud',
        'Compare with original',
        'Shows how messages change',
        'Listening practice',
        'Fun to see the difference'
      ],
      variations: 'Different message types. Longer messages.'
    },
    {
      id: 'l-002',
      name: 'Listen and Draw',
      materials: 'Paper, pencils',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Student A describes a picture. Student B draws without seeing.',
      instructions: [
        'Student A describes a picture',
        'Student B draws without seeing it',
        'Use descriptive vocabulary',
        'Give detailed instructions',
        'Compare drawings at the end',
        'Practice listening and describing',
        'Communication skills'
      ],
      variations: 'Different pictures. Time limit.'
    },
    {
      id: 'l-003',
      name: 'True or False Listening',
      materials: 'Statements (true/false)',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Teacher reads statements. Students decide if true or false.',
      instructions: [
        'Teacher reads statements',
        'Students decide if true or false',
        'Hold up thumbs (up=true, down=false)',
        'Keep score',
        'Practice listening comprehension',
        'Quick decision making',
        'Competitive and fun'
      ],
      variations: 'Different statement types. Faster reading.'
    },
    {
      id: 'l-004',
      name: 'Dictation Practice',
      materials: 'Paper, pencils',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Teacher reads sentences. Students write exactly what they hear.',
      instructions: [
        'Teacher reads sentences',
        'Students write exactly what they hear',
        'Read slowly first, then normal speed',
        'Check together',
        'Practice listening accuracy',
        'Spelling and grammar',
        'Focus on details'
      ],
      variations: 'Different sentence types. Faster dictation.'
    },
    {
      id: 'l-005',
      name: 'Sound Bingo',
      materials: 'Bingo cards with sounds',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Teacher makes sounds. Students mark the corresponding word on their bingo card.',
      instructions: [
        'Give students bingo cards with words',
        'Teacher makes sounds (e.g., animal sounds)',
        'Students mark the corresponding word',
        'First to get bingo wins',
        'Practice listening',
        'Sound recognition',
        'Fun and engaging'
      ],
      variations: 'Different sound types. Different bingo patterns.'
    }
  ],

  // ============================================
  // SPEAKING GAMES
  // ============================================
  'speaking': [
    {
      id: 's-001',
      name: 'Just a Minute',
      materials: 'Timer, topic cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-30 min',
      players: 'Whole class',
      description: 'Students speak for 1 minute on a topic without hesitation or repetition.',
      instructions: [
        'Give students a topic',
        'Speak for 1 minute continuously',
        'No hesitation or repetition',
        'Partner times and listens',
        'Practice fluency',
        'Speaking confidence',
        'Quick thinking'
      ],
      variations: 'Different time limits. Different topics.'
    },
    {
      id: 's-002',
      name: 'Two Truths and a Lie',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Student tells 3 statements: 2 true, 1 false. Others guess which is the lie.',
      instructions: [
        'Student tells 3 statements',
        '2 are true, 1 is false',
        'Others guess which is the lie',
        'Practice speaking',
        'Question formation',
        'Get to know each other',
        'Fun icebreaker'
      ],
      variations: 'More statements. Themed statements.'
    },
    {
      id: 's-003',
      name: 'Picture Description',
      materials: 'Pictures',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Pairs',
      description: 'Describe a picture to your partner without showing it.',
      instructions: [
        'Describe a picture to your partner',
        'Without showing it',
        'Use descriptive language',
        'Partner draws or describes back',
        'Compare at the end',
        'Practice speaking and listening',
        'Descriptive vocabulary'
      ],
      variations: 'Different picture types. Time limit.'
    },
    {
      id: 's-004',
      name: 'Debate Teams',
      materials: 'Debate topics',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Teams',
      description: 'Divide class into teams. Debate a topic with clear arguments.',
      instructions: [
        'Divide class into teams',
        'Assign a debate topic',
        'Each team prepares arguments',
        'Debate with structured turns',
        'Practice speaking',
        'Persuasion skills',
        'Critical thinking'
      ],
      variations: 'Different topics. Different debate formats.'
    },
    {
      id: 's-005',
      name: 'Story Circle',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students build a story one sentence at a time around the circle.',
      instructions: [
        'Start with one student',
        'Each student adds one sentence',
        'Build the story around the circle',
        'Keep it coherent',
        'Practice speaking',
        'Creativity',
        'Listening to others'
      ],
      variations: 'Themed stories. Different genres.'
    },
    {
      id: 's-007',
      name: 'Vocabulary Showcase Game Show',
      materials: 'Whiteboard, timer, vocabulary list',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Teams describe vocabulary words for teammates to guess without saying the word.',
      instructions: [
        'Review vocabulary words if needed',
        'Divide class into two teams',
        'Team A chooses contestant to start',
        'Student stands with back to whiteboard',
        'Teacher writes vocabulary word and starts timer',
        'Team describes word without using it or spelling it',
        'Student guesses - correct answer gets point',
        'Switch teams and repeat'
      ],
      variations: 'Time limits. Different word categories.'
    },
    {
      id: 's-008',
      name: 'How\'s Yours?',
      materials: 'None (optional: word cards)',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students guess secret objects by asking "How\'s yours?" and getting 2-3 word responses.',
      instructions: [
        'Select student to be guesser (send them out)',
        'Teacher chooses secret word (body part, clothing, object)',
        'Guesser returns and asks each student: "How\'s yours?"',
        'Students respond in 2-3 words (no pointing)',
        'Guesser collects all responses then guesses',
        'Correct guesser becomes next game leader'
      ],
      variations: 'Different word categories. Team guessing.'
    },
    {
      id: 's-009',
      name: 'Fly Swat Vocabulary',
      materials: 'Fly swatters, PowerPoint/projector or whiteboard',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Race to swat correct vocabulary word on board when definition is read.',
      instructions: [
        'Prepare slide or board with scattered vocabulary words',
        'Split class into two teams',
        'Each team sends one student to board with fly swatter',
        'Read definition/question aloud',
        'First student to swat correct word wins round',
        'Students can only swat one word per turn'
      ],
      variations: 'Synonyms/antonyms. More complex definitions.'
    },
    {
      id: 's-010',
      name: 'Shiritori Showdown',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Word chain game where each word starts with last letter of previous word.',
      instructions: [
        'First student says any vocabulary word',
        'Next student must say word starting with last letter',
        'Continue around circle or down line',
        'Can\'t repeat words already used',
        'Student who hesitates or uses wrong letter is out',
        'Last student remaining wins'
      ],
      variations: ' themed categories only. Time limits.'
    },
    {
      id: 's-011',
      name: 'Backdraw',
      materials: 'Whiteboard, markers',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Draw on teammate\'s back for them to guess the word/drawing.',
      instructions: [
        'Students stand in lines facing backward',
        'Last student in each line sees vocabulary word',
        'Draws word on back of student in front',
        'Drawing continues down the line',
        'First student in line draws on board and guesses word',
        'Correct guess gets points for team'
      ],
      variations: 'Different drawing styles. More complex words.'
    },
    {
      id: 's-012',
      name: 'Sparkle Spelling Game',
      materials: 'Vocabulary words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Spelling game where students say letters one by one, last letter says "Sparkle!"',
      instructions: [
        'Students stand in circle',
        'Teacher announces vocabulary word',
        'Students spell word one letter at a time around circle',
        'Student after last letter says "Sparkle!"',
        'Next student is out and sits down',
        'Continue until one student remains'
      ],
      variations: 'Different word difficulties. Team version.'
    },
    {
      id: 's-013',
      name: 'Squat Vocabulary',
      materials: 'Vocabulary cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students squat and stand when they hear vocabulary words in categories.',
      instructions: [
        'Assign vocabulary categories to students',
        'Teacher calls out vocabulary words',
        'Students squat if word is in their category',
        'Stand if word is not in their category',
        'Wrong movement = out of game',
        'Last student standing wins'
      ],
      variations: 'Different categories. Faster pace.'
    },
    {
      id: 's-014',
      name: 'Flash Art Drawing',
      materials: 'Paper, pencils, vocabulary cards',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Quick drawing game where students draw vocabulary words for partners to guess.',
      instructions: [
        'Students pair up with paper and pencils',
        'Show vocabulary word to one student',
        'Student draws quickly while partner guesses',
        'Time limit for each drawing (30 seconds)',
        'Correct guess gets point',
        'Switch roles and repeat'
      ],
      variations: 'Different time limits. Team competition.'
    },
    {
      id: 's-015',
      name: 'Find Someone Who...',
      materials: 'Find someone who worksheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Students mingle to find classmates who match descriptions on worksheet.',
      instructions: [
        'Give each student a worksheet with descriptions',
        'Students walk around asking questions',
        '"Find someone who likes pizza"',
        'Students ask classmates: "Do you like pizza?"',
        'If yes, write classmate\'s name on worksheet',
        'First to complete worksheet wins'
      ],
      variations: 'Different themes. More complex questions.'
    },
    {
      id: 's-016',
      name: 'Telephone Message Game',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass whispered message around circle and compare to original.',
      instructions: [
        'Students sit or stand in circle',
        'Teacher whispers message to first student',
        'Message passed around circle by whispering',
        'Last student says message aloud',
        'Compare with original message',
        'Discuss how messages change'
      ],
      variations: 'Different message lengths. Complex sentences.'
    },
    {
      id: 's-017',
      name: 'Song Puzzle Lyrics',
      materials: 'Song lyrics, cut into strips',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Teams race to arrange song lyric strips in correct order.',
      instructions: [
        'Choose song with English lyrics',
        'Cut lyrics into strips and mix up',
        'Give each team a set of lyric strips',
        'Teams race to arrange lyrics in correct order',
        'First team to finish gets points',
        'Can sing song together after'
      ],
      variations: 'Different songs. More lyric strips.'
    },
    {
      id: 's-018',
      name: 'Question Volley',
      materials: 'Ball or soft object',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Toss ball while asking and answering questions.',
      instructions: [
        'Students stand in circle',
        'One student starts with ball',
        'Student asks question while tossing ball to another',
        'Catching student must answer the question',
        'Then asks new question while tossing ball',
        'Practice question formation and answering'
      ],
      variations: 'Different question topics. Time limits.'
    },
    {
      id: 's-019',
      name: 'My Name is X, and I Like X',
      materials: 'None',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Memory game using names and preferences with same letter.',
      instructions: [
        'First student says: "My name is Alex, and I like apples"',
        'Second student repeats first student\'s info',
        'Then adds their own: "His name is Alex and he likes apples. My name is Betty and I like bananas"',
        'Continue around circle with increasing memory challenge'
      ],
      variations: 'Different themes (foods, hobbies, etc.)'
    },
    {
      id: 's-020',
      name: 'Reporter Interview Game',
      materials: 'Interview questions, optional microphone prop',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students role-play reporters interviewing celebrities or experts.',
      instructions: [
        'Students pair up as reporter and interviewee',
        'Assign roles (celebrity, doctor, teacher, etc.)',
        'Reporter prepares interview questions',
        'Conduct interview using proper question forms',
        'Practice speaking and listening skills',
        'Can present interviews to class'
      ],
      variations: 'Different roles. Group interviews.'
    },
    {
      id: 's-021',
      name: 'Secrets Game',
      materials: 'Paper strips with secrets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students receive secret information and others guess by asking questions.',
      instructions: [
        'Give each student a secret paper strip',
        'Secrets could be: "I have a pet cat", "I can cook"',
        'Other students ask yes/no questions to guess secrets',
        'Student with secret answers questions',
        'First to guess correctly gets point',
        'Practice question formation'
      ],
      variations: 'Different secret types. Team guessing.'
    },
    {
      id: 's-022',
      name: 'Find a Partner',
      materials: 'Matching cards (words/definitions, questions/answers)',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students find matching partners by asking questions.',
      instructions: [
        'Give each student one card from matching pair',
        'Students mingle asking questions to find match',
        'Word card students ask: "What does this mean?"',
        'Definition card students ask: "What word is this?"',
        'When match found, partners sit together',
        'Practice question formation and vocabulary'
      ],
      variations: 'Different matching types. More complex pairs.'
    },
    {
      id: 's-023',
      name: 'What Sweet Treat Am I?',
      materials: 'Food picture cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students guess food items by asking yes/no questions.',
      instructions: [
        'One student gets food picture card (doesn\'t show others)',
        'Other students ask yes/no questions',
        '"Is it sweet?" "Is it round?" "Do you eat it for breakfast?"',
        'Food card student answers questions',
        'Students try to guess the food',
        'Practice descriptive questions and food vocabulary'
      ],
      variations: 'Different food categories. More complex questions.'
    },
    {
      id: 's-024',
      name: 'Who Am I? What Am I?',
      materials: 'Name/object cards taped to backs',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Students guess identity of person/object on their back by asking questions.',
      instructions: [
        'Tape name/object cards to students\' backs',
        'Students don\'t know what their card says',
        'Students walk around asking yes/no questions',
        '"Am I alive?" "Am I famous?" "Do I work in a school?"',
        'Other students answer questions',
        'First to guess their identity wins'
      ],
      variations: 'Different categories. Team guessing.'
    },
    {
      id: 's-025',
      name: 'Question Master',
      materials: 'Question cards or topics',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students take turns being question master asking questions to classmates.',
      instructions: [
        'One student becomes question master',
        'Question master asks question to class or individual',
        'Students must answer correctly',
        'Correct answerer becomes next question master',
        'Practice both asking and answering questions',
        'Develop speaking confidence'
      ],
      variations: 'Different question topics. Time limits.'
    },
    {
      id: 's-026',
      name: 'Time Trials Speaking',
      materials: 'Timer, topic cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Students speak on topics for set time without stopping.',
      instructions: [
        'Set timer for 1-2 minutes',
        'Student draws topic card',
        'Student must speak continuously about topic',
        'Can\'t pause, repeat, or use filler words',
        'Classmates listen for mistakes or pauses',
        'Successful speakers get points'
      ],
      variations: 'Different time limits. Team competition.'
    },
    {
      id: 's-027',
      name: 'Balloon Truth or Dare',
      materials: 'Balloons, truth/dare prompts',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Pop balloons and complete truth or dare speaking challenges.',
      instructions: [
        'Put truth/dare prompts inside balloons',
        'Students take turns popping balloons',
        'Complete truth question or speaking dare',
        'Truth: "Tell us about your favorite hobby"',
        'Dare: "Describe this room without using the word room"',
        'Practice speaking in fun, low-pressure way'
      ],
      variations: 'Different prompt types. Team version.'
    },
    {
      id: 's-028',
      name: 'Word Warm Ups',
      materials: 'Word cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Quick speaking warm-up with word associations.',
      instructions: [
        'Teacher shows vocabulary word',
        'Students must say first word that comes to mind',
        'Go around room quickly for responses',
        'Can do word chains or categories',
        'Keep pace fast and energetic',
        'Practice quick thinking and vocabulary'
      ],
      variations: 'Different word types. Speed rounds.'
    },
    {
      id: 's-029',
      name: 'Mayor Game (Don\'t Vote for Me)',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Students campaign for mayor while others try to vote them out.',
      instructions: [
        'One student is mayoral candidate',
        'Other students are voters',
        'Candidate gives speech about why they should be mayor',
        'Voters ask challenging questions',
        'Voters try to find reasons not to vote for candidate',
        'Practice persuasive speaking and critical thinking'
      ],
      variations: 'Different offices. Team campaigns.'
    },
    {
      id: 's-030',
      name: 'Reading Race',
      materials: 'Reading texts, race track on board',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Teams race to read texts and answer questions correctly.',
      instructions: [
        'Draw race track on board with team markers',
        'Give teams reading texts',
        'Ask comprehension questions about texts',
        'Correct answer moves team forward one space',
        'First team to finish race wins',
        'Practice reading comprehension and speaking'
      ],
      variations: 'Different text types. More complex questions.'
    },
    {
      id: 's-031',
      name: 'I Took a Trip to the USA',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Memory game about taking trips and listing items brought back.',
      instructions: [
        'First student says: "I took a trip to the USA and I brought back apples"',
        'Second student repeats and adds: "I took a trip to the USA and I brought back apples and bananas"',
        'Continue around circle adding items',
        'Practice alphabet order and memory',
        'Can use different destinations'
      ],
      variations: 'Different destinations. Category restrictions.'
    },
    {
      id: 's-032',
      name: 'Storytelling Memory Game',
      materials: 'Picture cards or objects',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Build and remember stories using picture prompts.',
      instructions: [
        'Show picture card to first student',
        'Student starts story incorporating picture',
        'Next student adds new picture and continues story',
        'Each student must recall previous story parts',
        'Practice storytelling and memory skills',
        'Creative and collaborative'
      ],
      variations: 'Different story themes. Writing version.'
    },
    {
      id: 's-034',
      name: 'Funny Papers Comic Strips',
      materials: 'Comic strips with dialogue removed',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students create dialogue for comic strip scenes.',
      instructions: [
        'Give pairs comic strips with empty dialogue bubbles',
        'Students create funny or appropriate dialogue',
        'Practice conversational English and humor',
        'Present completed comics to class',
        'Vote on funniest or most creative',
        'Practice writing and speaking dialogue'
      ],
      variations: 'Different comic types. Group collaboration.'
    },
    {
      id: 's-035',
      name: 'Dictionary Game',
      materials: 'Dictionary, vocabulary words',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Create fake definitions for real words to fool other teams.',
      instructions: [
        'Look up unusual word in dictionary',
        'Write real definition secretly',
        'Each team creates fake definition',
        'All definitions read aloud',
        'Teams vote for definition they think is real',
        'Points for fooling others and guessing correctly'
      ],
      variations: 'Different word sources. Team writing.'
    },
    {
      id: 's-036',
      name: 'Oral Storytelling',
      materials: 'Story starter prompts',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Students create and tell stories orally.',
      instructions: [
        'Give students story starter prompts',
        'Students develop stories mentally',
        'Each student tells their story to class',
        'Practice narrative structure and speaking',
        'Can include sound effects or gestures',
        'Build storytelling confidence'
      ],
      variations: 'Different genres. Time limits.'
    },
    {
      id: 's-037',
      name: 'Written Storytelling Circle',
      materials: 'Paper, pencils',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '25-30 min',
      players: 'Whole class',
      description: 'Collaborative story writing around circle.',
      instructions: [
        'Each student starts with paper and writes story beginning',
        'Pass papers to right after set time',
        'Next student continues story',
        'Continue passing until stories return to original writers',
        'Read final stories aloud',
        'Practice writing and story structure'
      ],
      variations: 'Different time limits. Story themes.'
    },
    {
      id: 's-038',
      name: 'Would You Rather',
      materials: 'Would you rather questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students discuss and explain preferences in would you rather scenarios.',
      instructions: [
        'Present would you rather question',
        '"Would you rather be able to fly or be invisible?"',
        'Students choose and explain why',
        'Practice expressing opinions and reasoning',
        'Can debate in pairs or small groups',
        'Develop persuasive speaking skills'
      ],
      variations: 'Different question types. Formal debates.'
    },
    {
      id: 's-039',
      name: 'Conjugation Pyramid',
      materials: 'Whiteboard, verbs',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Teams race to conjugate verbs in pyramid formation.',
      instructions: [
        'Draw pyramid on board with verb spaces',
        'Teams take turns conjugating verbs',
        'Start with simple present, move up pyramid',
        'More difficult tenses higher in pyramid',
        'Correct conjugation gets points',
        'First team to top wins'
      ],
      variations: 'Different verbs. More complex tenses.'
    },
    {
      id: 's-040',
      name: 'Tic-Tac-Toe Grammar',
      materials: 'Tic-tac-toe grid, grammar questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Play tic-tac-toe by answering grammar questions correctly.',
      instructions: [
        'Draw tic-tac-toe grid on board',
        'Put grammar question in each square',
        'Players take turns answering questions',
        'Correct answer claims square with X or O',
        'First to get three in a row wins',
        'Practice grammar in competitive format'
      ],
      variations: 'Different grammar topics. Larger grids.'
    },
    {
      id: 's-041',
      name: 'Shootin\' Hoops Grammar',
      materials: 'Basketball hoop, ball, grammar cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Answer grammar questions to shoot basketball.',
      instructions: [
        'Set up basketball hoop in classroom',
        'Teams take turns answering grammar questions',
        'Correct answer = chance to shoot basket',
        'Made basket = points for team',
        'Wrong answer = no shot',
        'Combine physical activity with grammar practice'
      ],
      variations: 'Different point values. Distance challenges.'
    },
    {
      id: 's-042',
      name: 'Hot Potato Grammar',
      materials: 'Object to pass, music, grammar questions',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass object while music plays, answer grammar question when music stops.',
      instructions: [
        'Students sit in circle and pass object',
        'Play music while passing',
        'When music stops, student with object answers grammar question',
        'Correct answer stays in, wrong answer sits out',
        'Continue until one student remains',
        'Practice grammar under pressure'
      ],
      variations: 'Different objects. Different question types.'
    },
    {
      id: 's-043',
      name: 'Word Chain Speaking',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Create word chain with related words and explanations.',
      instructions: [
        'First student says any word',
        'Next student says related word and explains connection',
        '"Apple" → "Fruit (because apple is a fruit)" → "Tree (because fruit grows on trees)"',
        'Continue around circle',
        'Practice vocabulary connections and speaking',
        'Develop quick thinking skills'
      ],
      variations: 'Themed chains only. Time limits.'
    },
    {
      id: 's-044',
      name: 'Role-Play Scenarios',
      materials: 'Scenario cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students act out real-life situations.',
      instructions: [
        'Give pairs scenario cards',
        'Scenarios: restaurant, doctor\'s office, job interview',
        'Students prepare and perform role-plays',
        'Focus on appropriate language and responses',
        'Class can provide feedback',
        'Practice practical English skills'
      ],
      variations: 'Different scenarios. Group role-plays.'
    },
    {
      id: 's-046',
      name: 'News Report',
      materials: 'News articles or current events',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Teams',
      description: 'Students create and present news reports.',
      instructions: [
        'Teams choose current event or create news story',
        'Prepare news report with different roles',
        'Anchor, reporter, eyewitness, expert',
        'Present news reports to class',
        'Practice formal speaking and presentation skills',
        'Develop journalism vocabulary'
      ],
      variations: 'Different news types. Video recordings.'
    },
    {
      id: 's-047',
      name: 'Podcast Creation',
      materials: 'Recording device, topic ideas',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '30-35 min',
      players: 'Small groups',
      description: 'Students create podcast episodes on topics.',
      instructions: [
        'Groups choose podcast topic and format',
        'Plan episode structure and content',
        'Record podcast discussions or interviews',
        'Practice conversational speaking',
        'Focus on fluency and natural speech',
        'Share finished podcasts with class'
      ],
      variations: 'Different podcast formats. Series creation.'
    },
    {
      id: 's-048',
      name: 'Sales Pitch',
      materials: 'Random objects, sales criteria',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students create and deliver sales pitches for random objects.',
      instructions: [
        'Give each student a random object',
        'Student must create persuasive sales pitch',
        'Highlight features, benefits, uses',
        'Deliver pitch to class (customers)',
        'Practice persuasive language and presentation',
        'Vote on most convincing pitch'
      ],
      variations: 'Different objects. Team sales competition.'
    },
    {
      id: 's-049',
      name: 'Travel Agent',
      materials: 'Travel brochures, destination cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      description: 'Students role-play travel agents and customers.',
      instructions: [
        'Half students are travel agents, half are customers',
        'Customers have travel preferences and budget',
        'Travel agents recommend destinations',
        'Practice persuasive speaking and customer service',
        'Role-play booking conversations',
        'Negotiate prices and details'
      ],
      variations: 'Different travel types. Group bookings.'
    },
    {
      id: 's-050',
      name: 'TED Talk Mini',
      materials: 'Topic cards, timer',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Individuals',
      description: 'Students prepare and deliver short inspirational talks.',
      instructions: [
        'Students choose topics they\'re passionate about',
        'Prepare 3-5 minute inspirational talk',
        'Practice presentation skills and storytelling',
        'Include personal stories and messages',
        'Deliver talks to class',
        'Practice formal presentation skills'
      ],
      variations: 'Different time limits. Group feedback.'
    },
    {
      id: 's-051',
      name: 'News Reporter',
      materials: 'Current events, camera optional',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students act as news reporters reporting on events.',
      instructions: [
        'Assign current events or news stories',
        'Students prepare news reports',
        'Practice journalistic language and tone',
        'Present reports as if on TV news',
        'Include interviews and updates',
        'Practice formal speaking and reporting'
      ],
      variations: 'Different news types. Weather reports.'
    },
    {
      id: 's-052',
      name: 'Talk Show Host',
      materials: 'Interview topics, guest cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students role-play talk show hosts and guests.',
      instructions: [
        'One student is host, one is guest',
        'Host prepares interview questions',
        'Guest prepares character/background',
        'Conduct talk show interview',
        'Practice conversational speaking',
        'Spontaneous responses and engagement'
      ],
      variations: 'Different show formats. Group interviews.'
    },
    {
      id: 's-053',
      name: 'Radio DJ',
      materials: 'Music, song requests, microphone',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Students act as radio DJs introducing music.',
      instructions: [
        'Students prepare DJ introductions',
        'Introduce songs with background information',
        'Practice smooth transitions between songs',
        'Use radio language and tone',
        'Practice speaking fluency and confidence',
        'Entertainment speaking skills'
      ],
      variations: 'Different music genres. Call-in segments.'
    },
    {
      id: 's-054',
      name: 'Museum Guide',
      materials: 'Art pictures, museum information',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students act as museum guides describing artworks.',
      instructions: [
        'Provide artwork images and information',
        'Students prepare guide presentations',
        'Describe artworks to "visitors"',
        'Practice descriptive language',
        'Art vocabulary and public speaking',
        'Guided tour experience'
      ],
      variations: 'Different art types. Group tours.'
    },
    {
      id: 's-055',
      name: 'Cooking Show Host',
      materials: 'Recipe cards, props optional',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students host cooking shows explaining recipes.',
      instructions: [
        'Students choose recipes to present',
        'Practice cooking show presentation style',
        'Explain steps clearly and engagingly',
        'Use cooking vocabulary and techniques',
        'Practice instructional speaking',
        'Entertainment and education'
      ],
      variations: 'Different cuisine types. Team cooking shows.'
    },
    {
      id: 's-056',
      name: 'Sports Commentator',
      materials: 'Sports videos, commentary scripts',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students commentate on sports action.',
      instructions: [
        'Show sports videos without sound',
        'Students provide live commentary',
        'Practice sports vocabulary and excitement',
        'Work in pairs for play-by-play and color commentary',
        'Practice spontaneous speaking',
        'Energy and enthusiasm'
      ],
      variations: 'Different sports. Solo commentary.'
    },
    {
      id: 's-057',
      name: 'Auctioneer',
      materials: 'Objects to auction, bidding paddles',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students act as auctioneers selling items.',
      instructions: [
        'Student auctioneer presents items for sale',
        'Practice auctioneer speech patterns and speed',
        'Class members bid on items',
        'Practice persuasive speaking',
        'Quick thinking and crowd control',
        'Sales techniques and showmanship'
      ],
      variations: 'Different auction types. Charity auctions.'
    },
    {
      id: 's-058',
      name: 'Stand-up Comedy',
      materials: 'Comedy prompts, microphone optional',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students prepare and deliver short comedy routines.',
      instructions: [
        'Students write short comedy routines',
        'Practice timing and delivery',
        'Use observational humor about learning English',
        'Practice confidence and stage presence',
        'Humor and cultural awareness',
        'Entertainment speaking skills'
      ],
      variations: 'Different comedy styles. Group comedy.'
    },
    {
      id: 's-059',
      name: 'Motivational Speaker',
      materials: 'Speech topics, podium optional',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Individuals',
      description: 'Students deliver motivational speeches.',
      instructions: [
        'Students choose motivational topics',
        'Prepare inspiring speeches',
        'Practice rhetorical devices and storytelling',
        'Use emotional appeal and persuasion',
        'Practice formal presentation skills',
        'Inspiration and leadership speaking'
      ],
      variations: 'Different topics. Audience interaction.'
    },
    {
      id: 's-060',
      name: 'Storyteller',
      materials: 'Story prompts, props optional',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Students tell stories to the class.',
      instructions: [
        'Students choose or create stories',
        'Practice storytelling techniques',
        'Use voice variation and gestures',
        'Engage audience with narrative skills',
        'Practice narrative speaking',
        'Cultural storytelling traditions'
      ],
      variations: 'Different story types. Audience participation.'
    },
    {
      id: 's-061',
      name: 'Game Show Host',
      materials: 'Quiz questions, buzzers',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Students host quiz game shows.',
      instructions: [
        'Student hosts prepare quiz questions',
        'Practice game show host personality',
        'Manage contestants and timing',
        'Use entertainment language and energy',
        'Practice hosting and crowd control',
        'Educational entertainment'
      ],
      variations: 'Different game show formats. Team hosting.'
    },
    {
      id: 's-062',
      name: 'Tour Guide',
      materials: 'Location information, maps',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students act as tour guides showing locations.',
      instructions: [
        'Assign locations or landmarks',
        'Students research and prepare tours',
        'Guide "tourists" around classroom',
        'Practice descriptive and informative speaking',
        'Use location and direction vocabulary',
        'Public speaking and hospitality'
      ],
      variations: 'Different location types. Group tours.'
    },
    {
      id: 's-063',
      name: 'Judge',
      materials: 'Case descriptions, courtroom setup',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students role-play courtroom proceedings.',
      instructions: [
        'Assign roles: judge, lawyers, witnesses, jury',
        'Present case for mock trial',
        'Practice formal legal language',
        'Practice persuasive arguments',
        'Professional speaking and debate',
        'Critical thinking and speaking'
      ],
      variations: 'Different case types. Simplified procedures.'
    },
    {
      id: 's-064',
      name: 'Poetry Slam',
      materials: 'Poems, performance space',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students perform poetry with emotion and style.',
      instructions: [
        'Students choose or write poems',
        'Practice performance poetry techniques',
        'Use voice, rhythm, and emotion',
        'Perform for class audience',
        'Practice expressive speaking',
        'Artistic performance and confidence'
      ],
      variations: 'Different poetry styles. Team slams.'
    },
    {
      id: 's-065',
      name: 'Voice Actor',
      materials: 'Scripts, recording device optional',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students practice voice acting for different characters.',
      instructions: [
        'Provide scripts with character dialogue',
        'Students practice different voices and accents',
        'Record and review performances',
        'Practice voice modulation and expression',
        'Character development and vocal skills',
        'Performance and confidence building'
      ],
      variations: 'Different script types. Animation voices.'
    }
  ],

  // ============================================
  // READING GAMES
  // ============================================
  'reading': [
    {
      id: 'r-001',
      name: 'Reading Race Relay',
      materials: 'Reading texts, race track on board',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Teams race to read texts and answer comprehension questions.',
      instructions: [
        'Draw race track on board with team markers',
        'Give teams reading passages at appropriate level',
        'Ask comprehension questions about texts',
        'Correct answer moves team forward one space',
        'First team to finish race wins',
        'Practice reading speed and comprehension'
      ],
      variations: 'Different text types. More complex questions.'
    },
    {
      id: 'r-002',
      name: 'Jigsaw Reading',
      materials: 'Text cut into sections, comprehension questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students work in groups to read different parts of a text and teach each other.',
      instructions: [
        'Divide text into equal sections',
        'Each group reads one section',
        'Groups prepare to teach their section to others',
        'Form new groups with one member from each original group',
        'Students teach their section to new group members',
        'Practice reading and teaching skills'
      ],
      variations: 'Different text types. Group presentations.'
    },
    {
      id: 'r-003',
      name: 'Running Dictation',
      materials: 'Short texts posted around room, paper, pencils',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'One student runs to read text, runs back to dictate to partner.',
      instructions: [
        'Post short texts around classroom walls',
        'Students work in pairs (runner and writer)',
        'Runner runs to text, memorizes part, runs back',
        'Runner dictates text to writer',
        'First pair to complete text accurately wins',
        'Practice reading, memory, and writing'
      ],
      variations: 'Longer texts. Group competition.'
    },
    {
      id: 'r-004',
      name: 'Information Gap Reading',
      materials: 'Texts with missing information, completion sheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students have different versions of text with missing information they must get from partner.',
      instructions: [
        'Give each partner different version of text',
        'Each version has different missing information',
        'Students must ask questions to fill gaps',
        'Cannot show their text to partner',
        'Practice reading comprehension and communication',
        'Complete accurate text together'
      ],
      variations: 'Different text types. More complex gaps.'
    },
    {
      id: 'r-005',
      name: 'Reading Bingo',
      materials: 'Bingo cards with reading tasks, texts',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '20-25 min',
      players: 'Whole class',
      description: 'Students complete reading tasks to get bingo.',
      instructions: [
        'Create bingo cards with reading tasks',
        'Tasks: "Find a verb", "Find a food word", etc.',
        'Students read texts and mark off tasks',
        'First to get line or full bingo wins',
        'Practice scanning and specific reading skills',
        'Make reading competitive and fun'
      ],
      variations: 'Different task types. Text themes.'
    },
    {
      id: 'r-006',
      name: 'Text Reconstruction',
      materials: 'Cut up texts, envelopes',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Groups reconstruct cut up texts in correct order.',
      instructions: [
        'Cut texts into sentences or paragraphs',
        'Put pieces in envelopes',
        'Groups must piece text back together',
        'Focus on coherence and logical flow',
        'First group to correctly reconstruct wins',
        'Practice reading comprehension and text structure'
      ],
      variations: 'Different text lengths. More complex pieces.'
    },
    {
      id: 'r-007',
      name: 'Reading Aloud Chain',
      materials: 'Story text',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Students read story aloud one sentence at a time around circle.',
      instructions: [
        'Students sit or stand in circle',
        'Start reading story from beginning',
        'Each student reads one sentence clearly',
        'Next student continues with following sentence',
        'Helps with pronunciation and fluency',
        'Practice reading aloud and listening'
      ],
      variations: 'Different story types. Character voices.'
    },
    {
      id: 'r-008',
      name: 'Find the Word Reading',
      materials: 'Reading texts, word lists',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Individuals',
      description: 'Students find specific words in reading texts.',
      instructions: [
        'Give students word lists to find',
        'Students scan texts to locate words',
        'Circle or highlight found words',
        'Time limit for added challenge',
        'Practice scanning and word recognition',
        'Build vocabulary and reading speed'
      ],
      variations: 'Different word types. Competition element.'
    },
    {
      id: 'r-009',
      name: 'Reading Comprehension Game Show',
      materials: 'Reading texts, comprehension questions, buzzers',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Teams answer comprehension questions in game show format.',
      instructions: [
        'Teams read short texts or passages',
        'Teacher asks comprehension questions',
        'Teams buzz in to answer questions',
        'Correct answers get points',
        'Wrong answers give other teams chance',
        'Practice reading comprehension under pressure'
      ],
      variations: 'Different question types. Point values.'
    },
    {
      id: 'r-010',
      name: 'Story Prediction Reading',
      materials: 'Story texts with endings removed',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students read stories and predict endings.',
      instructions: [
        'Give groups stories with missing endings',
        'Groups read and discuss possible endings',
        'Each group writes their predicted ending',
        'Share predictions with class',
        'Reveal actual ending',
        'Practice reading comprehension and prediction'
      ],
      variations: 'Different story genres. Group voting.'
    },
    {
      id: 'r-011',
      name: 'Reading Role-Play',
      materials: 'Dialogue texts, character cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students read and perform dialogues.',
      instructions: [
        'Give groups dialogue texts to read',
        'Assign character roles to students',
        'Groups practice reading dialogues with expression',
        'Perform dialogues for class',
        'Focus on intonation and emotion',
        'Practice reading aloud and performance'
      ],
      variations: 'Different dialogue types. Original writing.'
    },
    {
      id: 'r-012',
      name: 'Text Feature Hunt',
      materials: 'Non-fiction texts, feature lists',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students find text features in non-fiction reading.',
      instructions: [
        'Provide non-fiction texts (articles, textbooks)',
        'Give list of text features to find',
        'Features: headings, captions, bold words, etc.',
        'Students locate and label features',
        'Discuss purpose of each feature',
        'Practice text analysis and comprehension'
      ],
      variations: 'Different text types. Feature categories.'
    },
    {
      id: 'r-013',
      name: 'Reading Memory Game',
      materials: 'Text cards, memory grid',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Memory game with reading comprehension.',
      instructions: [
        'Create cards with short texts and questions',
        'Place cards face down in grid',
        'Students flip two cards looking for matches',
        'Match text with correct comprehension question',
        'Keep matched pairs, most pairs wins',
        'Practice memory and reading skills'
      ],
      variations: 'Different text lengths. Question types.'
    },
    {
      id: 'r-014',
      name: 'Timed Reading Challenge',
      materials: 'Reading passages, timer',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Students read passages against time and answer questions.',
      instructions: [
        'Set timer for reading passage',
        'Students read for speed and comprehension',
        'After reading, answer comprehension questions',
        'Track reading speed and accuracy',
        'Challenge personal best times',
        'Practice reading fluency and speed'
      ],
      variations: 'Different time limits. Passage difficulties.'
    },
    {
      id: 'r-015',
      name: 'Context Clue Detective',
      materials: 'Texts with difficult vocabulary, detective notebooks',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students use context clues to figure out word meanings.',
      instructions: [
        'Give texts with unfamiliar vocabulary',
        'Students act as word detectives',
        'Use context clues to guess meanings',
        'Write findings in detective notebooks',
        'Share discoveries with class',
        'Practice vocabulary inference skills'
      ],
      variations: 'Different text types. More complex vocabulary.'
    },
    {
      id: 'r-016',
      name: 'Reading Theater',
      materials: 'Script texts, props optional',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Groups read and perform scripts as theater.',
      instructions: [
        'Give groups script texts to read',
        'Assign speaking roles and simple actions',
        'Groups rehearse reading with expression',
        'Perform reading theater for class',
        'Focus on fluency and expression',
        'Practice reading performance skills'
      ],
      variations: 'Different script types. Original writing.'
    },
    {
      id: 'r-017',
      name: 'Main Idea Sort',
      materials: 'Short texts, main idea cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Students match texts with their main ideas.',
      instructions: [
        'Give groups short texts to read',
        'Separate cards with main ideas',
        'Groups match each text with correct main idea',
        'Explain reasoning for matches',
        'Practice identifying main ideas',
        'Develop reading comprehension skills'
      ],
      variations: 'Different text types. More complex ideas.'
    },
    {
      id: 'r-018',
      name: 'Reading Scavenger Hunt',
      materials: 'Various texts, scavenger hunt lists',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Teams hunt for specific items in various texts.',
      instructions: [
        'Create scavenger hunt lists with text items',
        'Items: "Find a past tense verb", "Find a food", etc.',
        'Teams search through various texts',
        'First team to complete list wins',
        'Practice text scanning and recognition',
        'Make reading exploration fun'
      ],
      variations: 'Different hunt items. Text themes.'
    },
    {
      id: 'r-019',
      name: 'Sequence Stories',
      materials: 'Story sentences cut apart, envelopes',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Groups arrange story sentences in correct sequence.',
      instructions: [
        'Cut stories into individual sentences',
        'Place sentences in envelopes',
        'Groups must arrange sentences in story order',
        'Focus on time order and story logic',
        'First group to correctly sequence wins',
        'Practice reading comprehension and sequencing'
      ],
      variations: 'Different story lengths. More complex plots.'
    },
    {
      id: 'r-020',
      name: 'Fact vs Opinion Reading',
      materials: 'Texts with facts and opinions, sorting mats',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Students identify facts and opinions in texts.',
      instructions: [
        'Provide texts containing facts and opinions',
        'Students read and identify each statement',
        'Sort statements into fact and opinion categories',
        'Explain reasoning for classifications',
        'Practice critical reading skills',
        'Develop analytical thinking'
      ],
      variations: 'Different text types. More complex statements.'
    },
    {
      id: 'r-021',
      name: 'Reading Interview',
      materials: 'Biography texts, interview questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students read biographies and conduct interviews.',
      instructions: [
        'One student reads biography of famous person',
        'Other student prepares interview questions',
        'Conduct interview based on biography information',
        'Switch roles and repeat',
        'Practice reading comprehension and speaking',
        'Connect reading with real communication'
      ],
      variations: 'Different biography types. Group interviews.'
    },
    {
      id: 'r-022',
      name: 'Cloze Reading Race',
      materials: 'Texts with missing words, word banks',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Teams race to complete cloze reading passages.',
      instructions: [
        'Prepare texts with missing words',
        'Provide word banks for each team',
        'Teams race to complete texts correctly',
        'First team to finish accurately wins',
        'Practice reading comprehension and vocabulary',
        'Competitive reading practice'
      ],
      variations: 'Different text types. No word banks challenge.'
    },
    {
      id: 'r-023',
      name: 'Reading Map Creation',
      materials: 'Descriptive texts, paper, markers',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students read descriptive texts and create maps.',
      instructions: [
        'Give groups descriptive texts about places',
        'Students read and visualize descriptions',
        'Create maps based on text information',
        'Include details mentioned in text',
        'Share maps and explain choices',
        'Practice reading visualization and comprehension'
      ],
      variations: 'Different text types. Map complexity levels.'
    },
    {
      id: 'r-024',
      name: 'Character Analysis Reading',
      materials: 'Story texts, character analysis sheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students read stories and analyze characters.',
      instructions: [
        'Provide stories with interesting characters',
        'Students read and analyze characters',
        'Complete character analysis sheets',
        'Discuss traits, motivations, actions',
        'Share analysis with class',
        'Practice literary analysis skills'
      ],
      variations: 'Different story types. More complex characters.'
    },
    {
      id: 'r-025',
      name: 'Reading Problem Solving',
      materials: 'Problem-solving texts, solution sheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Groups read problems and work on solutions.',
      instructions: [
        'Give groups texts describing problems',
        'Students read and understand problems',
        'Brainstorm possible solutions in groups',
        'Write proposed solutions with reasoning',
        'Present solutions to class',
        'Practice reading and critical thinking'
      ],
      variations: 'Different problem types. Individual solutions.'
    },
    {
      id: 'r-027',
      name: 'Speed Reading Challenge',
      materials: 'Reading passages, timer, comprehension questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Challenge students to read quickly while comprehending.',
      instructions: [
        'Set timer for reading passage',
        'Students read for maximum speed',
        'After reading, answer comprehension questions',
        'Track words per minute and accuracy',
        'Challenge personal records',
        'Practice reading speed and efficiency'
      ],
      variations: 'Different time limits. Passage difficulties.'
    },
    {
      id: 'r-028',
      name: 'Reading Inference',
      materials: 'Short stories with implied meanings, inference sheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students make inferences from reading texts.',
      instructions: [
        'Provide texts that require inference',
        'Students read and discuss possible meanings',
        'Complete inference sheets with evidence',
        'Share inferences and reasoning',
        'Practice critical reading and analysis',
        'Develop inferential thinking'
      ],
      variations: 'Different text types. More complex inferences.'
    },
    {
      id: 'r-029',
      name: 'Reading Comparison',
      materials: 'Two similar texts, comparison charts',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students compare and contrast two reading texts.',
      instructions: [
        'Provide pairs with two similar texts',
        'Students read both texts carefully',
        'Complete comparison charts',
        'Identify similarities and differences',
        'Share comparisons with class',
        'Practice analytical reading skills'
      ],
      variations: 'Different text types. More complex comparisons.'
    },
    {
      id: 'r-030',
      name: 'Reading Summary',
      materials: 'Longer texts, summary sheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '25-30 min',
      players: 'Individuals',
      description: 'Students read texts and write summaries.',
      instructions: [
        'Provide longer reading passages',
        'Students read and identify main points',
        'Write concise summaries',
        'Include key information only',
        'Share summaries and discuss',
        'Practice reading comprehension and writing'
      ],
      variations: 'Different text lengths. Group summaries.'
    },
    {
      id: 'r-031',
      name: 'Reading Visualization',
      materials: 'Descriptive texts, drawing paper',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Students read descriptive texts and draw what they visualize.',
      instructions: [
        'Provide descriptive passages',
        'Students read and visualize scenes',
        'Draw what they imagine from text',
        'Share drawings and explain choices',
        'Practice reading imagery and visualization',
        'Connect reading with visual thinking'
      ],
      variations: 'Different text types. More complex descriptions.'
    },
    {
      id: 'r-032',
      name: 'Reading Question Creation',
      materials: 'Reading texts, question paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students read texts and create comprehension questions.',
      instructions: [
        'Provide reading passages to pairs',
        'Students read and create questions',
        'Questions should test comprehension',
        'Exchange questions with other pairs',
        'Answer each other\'s questions',
        'Practice reading analysis and question creation'
      ],
      variations: 'Different text types. Question categories.'
    },
    {
      id: 'r-033',
      name: 'Reading Connection',
      materials: 'Multiple texts on same topic, connection sheets',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students read multiple texts and find connections.',
      instructions: [
        'Provide multiple texts about same topic',
        'Groups read all texts',
        'Identify connections between texts',
        'Complete connection sheets',
        'Discuss findings with class',
        'Practice synthesis and analysis'
      ],
      variations: 'Different topic types. More complex connections.'
    },
    {
      id: 'r-034',
      name: 'Reading Evaluation',
      materials: 'Various texts, evaluation criteria',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students evaluate texts based on specific criteria.',
      instructions: [
        'Provide evaluation criteria (clarity, accuracy, etc.)',
        'Groups read and evaluate texts',
        'Use criteria to assess text quality',
        'Provide evidence for evaluations',
        'Share evaluations and reasoning',
        'Practice critical reading and evaluation'
      ],
      variations: 'Different criteria types. More complex evaluations.'
    },
    {
      id: 'r-035',
      name: 'Reading Adaptation',
      materials: 'Stories, adaptation templates',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '25-30 min',
      players: 'Small groups',
      description: 'Students read stories and adapt them to different formats.',
      instructions: [
        'Provide stories to groups',
        'Groups adapt stories to different formats',
        'Formats: comic strip, play, news report, etc.',
        'Share adaptations with class',
        'Practice reading comprehension and creativity',
        'Connect reading with other skills'
      ],
      variations: 'Different adaptation types. Original stories.'
    },
    {
      id: 'r-036',
      name: 'Reading Debate',
      materials: 'Controversial texts, debate guidelines',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '30-35 min',
      players: 'Teams',
      description: 'Students read texts and debate issues.',
      instructions: [
        'Provide controversial reading materials',
        'Divide class into debate teams',
        'Teams read and prepare arguments',
        'Conduct structured debate',
        'Use evidence from texts',
        'Practice reading and persuasive speaking'
      ],
      variations: 'Different debate topics. Various formats.'
    },
    {
      id: 'r-037',
      name: 'Reading Translation',
      materials: 'Bilingual texts, translation sheets',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Pairs',
      description: 'Students read texts and practice translation skills.',
      instructions: [
        'Provide bilingual reading materials',
        'Students practice translating between languages',
        'Focus on meaning and nuance',
        'Compare translations and discuss',
        'Practice reading comprehension and translation',
        'Develop bilingual skills'
      ],
      variations: 'Different language pairs. Text difficulties.'
    },
    {
      id: 'r-038',
      name: 'Reading Research',
      materials: 'Research topics, source texts, note sheets',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '30-35 min',
      players: 'Individuals',
      description: 'Students read multiple sources and synthesize information.',
      instructions: [
        'Assign research topics to students',
        'Provide multiple source texts',
        'Students read and take notes',
        'Synthesize information from sources',
        'Present research findings',
        'Practice research reading and synthesis'
      ],
      variations: 'Different research topics. Source types.'
    },
    {
      id: 'r-039',
      name: 'Reading Reflection',
      materials: 'Thought-provoking texts, reflection journals',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students read texts and write personal reflections.',
      instructions: [
        'Provide meaningful reading passages',
        'Students read and reflect personally',
        'Write reflections in journals',
        'Connect texts to personal experiences',
        'Share reflections voluntarily',
        'Practice reading and personal expression'
      ],
      variations: 'Different text types. Reflection prompts.'
    },
    {
      id: 'r-040',
      name: 'Reading Performance',
      materials: 'Poetry and dramatic texts, performance space',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '25-30 min',
      players: 'Individuals/Small groups',
      description: 'Students read and perform texts dramatically.',
      instructions: [
        'Provide poetry or dramatic texts',
        'Students rehearse readings with expression',
        'Perform readings for class',
        'Focus on voice, emotion, and pacing',
        'Practice reading fluency and performance',
        'Develop presentation skills'
      ],
      variations: 'Different text types. Group performances.'
    }
  ],

  // ============================================
  // WRITING GAMES
  // ============================================
  'writing': [
    {
      id: 'w-001',
      name: 'Story Writing Relay',
      materials: 'Paper, pencils, story starters',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Teams write stories in relay format, each student adding one sentence.',
      instructions: [
        'Divide class into teams',
        'Give each team a story starter',
        'First student writes one sentence',
        'Pass paper to next student who adds sentence',
        'Continue until story complete',
        'Share stories with class'
      ],
      variations: 'Different story themes. Time limits.'
    },
    {
      id: 'w-002',
      name: 'Descriptive Writing Challenge',
      materials: 'Pictures, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Students write descriptive paragraphs about pictures.',
      instructions: [
        'Give each student a picture',
        'Students write descriptive paragraph',
        'Focus on sensory details and vivid language',
        'Share descriptions with class',
        'Vote on most descriptive',
        'Practice descriptive writing skills'
      ],
      variations: 'Different picture types. Group writing.'
    },
    {
      id: 'w-003',
      name: 'Dialogue Writing',
      materials: 'Scenario cards, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students write dialogues for given scenarios.',
      instructions: [
        'Give pairs scenario cards',
        'Scenarios: restaurant, job interview, argument',
        'Students write natural dialogue',
        'Focus on conversation flow and character voice',
        'Perform dialogues for class',
        'Practice dialogue writing skills'
      ],
      variations: 'Different scenarios. Group dialogues.'
    },
    {
      id: 'w-004',
      name: 'Poetry Writing',
      materials: 'Poetry prompts, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students write poems on given themes.',
      instructions: [
        'Provide poetry prompts or themes',
        'Students write original poems',
        'Can be any style (haiku, free verse, etc.)',
        'Share poems with class',
        'Discuss meaning and technique',
        'Practice creative writing and expression'
      ],
      variations: 'Different poetry forms. Group poems.'
    },
    {
      id: 'w-005',
      name: 'Letter Writing',
      materials: 'Letter scenarios, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students write various types of letters.',
      instructions: [
        'Assign letter writing tasks',
        'Tasks: friendly letter, business letter, email',
        'Teach proper letter format',
        'Students write letters',
        'Practice formal and informal writing',
        'Real-world writing application'
      ],
      variations: 'Different letter types. Email writing.'
    },
    {
      id: 'w-006',
      name: 'Journal Writing',
      materials: 'Journals, writing prompts',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Students write journal entries on prompts.',
      instructions: [
        'Provide journal writing prompts',
        'Students write personal responses',
        'Focus on expression and reflection',
        'Can share voluntarily',
        'Practice personal writing',
        'Develop writing fluency'
      ],
      variations: 'Different prompt types. Group journals.'
    },
    {
      id: 'w-007',
      name: 'Sentence Building',
      materials: 'Word cards, writing paper',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Small groups',
      description: 'Groups build sentences using word cards.',
      instructions: [
        'Give groups word cards',
        'Groups arrange cards to make sentences',
        'Must be grammatically correct',
        'Write sentences on paper',
        'Share sentences with class',
        'Practice sentence structure'
      ],
      variations: 'Different word types. Complex sentences.'
    },
    {
      id: 'w-008',
      name: 'Comic Strip Writing',
      materials: 'Blank comic strips, writing prompts',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Students write stories in comic strip format.',
      instructions: [
        'Give students blank comic strip templates',
        'Provide story prompts or let students choose',
        'Students write and draw comic stories',
        'Focus on narrative and dialogue',
        'Share comics with class',
        'Practice visual storytelling'
      ],
      variations: 'Different comic formats. Group comics.'
    },
    {
      id: 'w-009',
      name: 'Advertisement Writing',
      materials: 'Product cards, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Groups write advertisements for products.',
      instructions: [
        'Give groups product cards or let them choose',
        'Groups write persuasive advertisements',
        'Include slogans, descriptions, benefits',
        'Present ads to class',
        'Vote on most persuasive',
        'Practice persuasive writing'
      ],
      variations: 'Different product types. Radio/TV ads.'
    },
    {
      id: 'w-010',
      name: 'News Article Writing',
      materials: 'News events, writing paper',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Individuals',
      description: 'Students write news articles about events.',
      instructions: [
        'Provide news events or let students choose',
        'Teach news article structure',
        'Students write articles following journalism format',
        'Include headline, lead, body, quotes',
        'Share articles with class',
        'Practice journalistic writing'
      ],
      variations: 'Different news types. School newspaper.'
    },
    {
      id: 'w-011',
      name: 'Creative Story Prompts',
      materials: 'Story prompt cards, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Write creative stories from unusual prompts.',
      instructions: [
        'Give students creative story prompts',
        'Prompts: "You woke up with superpowers", "Found a mysterious door"',
        'Students write imaginative stories',
        'Focus on creativity and storytelling',
        'Share stories with class',
        'Practice creative writing',
        'Narrative skills'
      ],
      variations: 'Different prompt types. Genre restrictions.'
    },
    {
      id: 'w-012',
      name: 'Recipe Writing',
      materials: 'Recipe templates, food vocabulary',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Write recipes for favorite foods.',
      instructions: [
        'Teach recipe format and vocabulary',
        'Students write recipes for favorite dishes',
        'Include ingredients and step-by-step instructions',
        'Practice sequencing vocabulary',
        'Food vocabulary',
        'Instructional writing'
      ],
      variations: 'Different food types. More complex recipes.'
    },
    {
      id: 'w-013',
      name: 'Email Writing',
      materials: 'Email scenarios, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Write and respond to emails in various situations.',
      instructions: [
        'Provide email scenarios (job application, inquiry, complaint)',
        'Students write appropriate emails',
        'Focus on email format and tone',
        'Practice formal and informal writing',
        'Professional communication',
        'Digital literacy'
      ],
      variations: 'Different email types. More complex scenarios.'
    },
    {
      id: 'w-015',
      name: 'Instruction Writing',
      materials: 'Objects or processes, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Write clear instructions for tasks or processes.',
      instructions: [
        'Give pairs objects or processes to explain',
        'Students write step-by-step instructions',
        'Focus on clarity and sequencing',
        'Test instructions by following them',
        'Practice technical writing',
        'Clarity and precision',
        'Sequential thinking'
      ],
      variations: 'Different complexity levels. Group instructions.'
    },
    {
      id: 'w-016',
      name: 'Blog Post Writing',
      materials: 'Blog topics, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Individuals',
      description: 'Write blog posts on topics of interest.',
      instructions: [
        'Choose blog topics or assign them',
        'Teach blog post structure and style',
        'Students write engaging blog posts',
        'Include headlines, introduction, body, conclusion',
        'Practice informal but engaging writing',
        'Digital communication',
        'Audience awareness'
      ],
      variations: 'Different blog topics. Word count requirements.'
    },
    {
      id: 'w-017',
      name: 'Social Media Post Writing',
      materials: 'Social media scenarios, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Write social media posts for different platforms.',
      instructions: [
        'Assign different social media platforms',
        'Students write appropriate posts for each platform',
        'Consider character limits and audience',
        'Practice concise writing',
        'Digital communication styles',
        'Platform awareness',
        'Modern communication'
      ],
      variations: 'Different platforms. More complex campaigns.'
    },
    {
      id: 'w-018',
      name: 'Review Writing',
      materials: 'Products/movies/books, writing paper',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Write reviews of products, movies, or books.',
      instructions: [
        'Students choose items to review',
        'Teach review structure and criteria',
        'Write balanced reviews with opinions and evidence',
        'Practice persuasive writing',
        'Critical thinking',
        'Opinion expression',
        'Supporting arguments'
      ],
      variations: 'Different review types. Rating systems.'
    },
    {
      id: 'w-019',
      name: 'Resume Writing',
      materials: 'Resume templates, job descriptions',
      difficulty: 'Advanced',
      ageGroup: '14-Adult',
      duration: '25-30 min',
      players: 'Individuals',
      description: 'Write professional resumes for job applications.',
      instructions: [
        'Teach resume structure and sections',
        'Students write their own or sample resumes',
        'Focus on professional language and formatting',
        'Practice formal writing',
        'Professional communication',
        'Self-presentation',
        'Career vocabulary'
      ],
      variations: 'Different job types. More complex formats.'
    },
    {
      id: 'w-020',
      name: 'Script Writing',
      materials: 'Script templates, dialogue examples',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Pairs',
      description: 'Write scripts for plays or videos.',
      instructions: [
        'Teach script format and dialogue writing',
        'Pairs write short scripts for scenes',
        'Include character names, dialogue, stage directions',
        'Practice dialogue writing',
        'Creative storytelling',
        'Dramatic structure',
        'Performance writing'
      ],
      variations: 'Different script types. Group script writing.'
    }
  ],

  // ============================================
  // LISTENING GAMES
  // ============================================
  'listening': [
    {
      id: 'l-001',
      name: 'Telephone Game',
      materials: 'None',
      difficulty: 'Beginner-Advanced',
      ageGroup: '6-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Pass whispered message around circle and compare to original.',
      instructions: [
        'Students sit or stand in circle',
        'Teacher whispers message to first student',
        'Message passed around circle by whispering',
        'Last student says message aloud',
        'Compare with original message',
        'Practice listening and speaking'
      ],
      variations: 'Different message lengths. Complex sentences.'
    },
    {
      id: 'l-002',
      name: 'Following Instructions',
      materials: 'Instruction cards, classroom objects',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students follow multi-step instructions.',
      instructions: [
        'Give verbal instructions with multiple steps',
        '"Pick up the red pen, write your name, and give it to your partner"',
        'Students must listen and follow all steps',
        'Increase complexity as students improve',
        'Practice listening comprehension',
        'Following directions'
      ],
      variations: 'More complex instructions. Written instructions.'
    },
    {
      id: 'l-003',
      name: 'Story Listening Recall',
      materials: 'Short stories, questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Listen to stories and answer comprehension questions.',
      instructions: [
        'Teacher reads short story aloud',
        'Students listen carefully',
        'Ask comprehension questions about story',
        'Students answer from memory',
        'Practice listening comprehension',
        'Memory skills'
      ],
      variations: 'Longer stories. Note-taking allowed.'
    },
    {
      id: 'l-004',
      name: 'Sound Identification',
      materials: 'Sound recordings or objects making sounds',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '5-10',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Identify sounds and describe them.',
      instructions: [
        'Play sounds or make sounds with objects',
        'Students identify what made the sound',
        'Describe the sound in English',
        '"It\'s loud. It\'s a bell."',
        'Practice listening and descriptive language',
        'Sound vocabulary'
      ],
      variations: 'Different sound types. Environmental sounds.'
    },
    {
      id: 'l-005',
      name: 'Song Lyrics Gap Fill',
      materials: 'Song lyrics with missing words, audio',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Listen to songs and fill in missing lyrics.',
      instructions: [
        'Give students lyrics with missing words',
        'Play song and students fill gaps',
        'Check answers together',
        'Discuss meaning of lyrics',
        'Practice listening for specific words',
        'Song vocabulary'
      ],
      variations: 'Different song types. More gaps.'
    },
    {
      id: 'l-006',
      name: 'Dictation Practice',
      materials: 'Short passages, writing paper',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Listen and write down what is heard.',
      instructions: [
        'Teacher reads short passages',
        'Students write exactly what they hear',
        'Focus on spelling and punctuation',
        'Check work together',
        'Practice listening and writing',
        'Dictation skills'
      ],
      variations: 'Different passage lengths. Speed variations.'
    },
    {
      id: 'l-007',
      name: 'Minimal Pairs',
      materials: 'Word cards with similar sounds',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Pairs',
      description: 'Distinguish between similar sounding words.',
      instructions: [
        'Prepare minimal pair word cards',
        'Teacher says one word from pair',
        'Students identify which word was said',
        'Practice sound discrimination',
        'Pronunciation awareness',
        'Listening for subtle differences'
      ],
      variations: 'Different sound pairs. More complex words.'
    },
    {
      id: 'l-008',
      name: 'Information Gap Listening',
      materials: 'Information gap worksheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Students get missing information by listening to partners.',
      instructions: [
        'Give partners different incomplete information',
        'Students must ask questions to get missing info',
        'Cannot show papers to each other',
        'Practice listening and speaking',
        'Question formation',
        'Information exchange'
      ],
      variations: 'Different information types. Complex gaps.'
    },
    {
      id: 'l-009',
      name: 'Podcast Comprehension',
      materials: 'Short podcast episodes, comprehension questions',
      difficulty: 'Advanced',
      ageGroup: '12-Adult',
      duration: '25-30 min',
      players: 'Individuals',
      description: 'Listen to podcasts and answer comprehension questions.',
      instructions: [
        'Play short podcast episode',
        'Students listen and take notes',
        'Answer comprehension questions',
        'Discuss main ideas and details',
        'Practice listening for extended periods',
        'Note-taking skills'
      ],
      variations: 'Different podcast topics. Note-taking guides.'
    },
    {
      id: 'l-010',
      name: 'Audio Story Prediction',
      materials: 'Audio stories, prediction sheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Listen to story beginnings and predict endings.',
      instructions: [
        'Play beginning of audio story',
        'Groups discuss and predict ending',
        'Write predictions',
        'Listen to actual ending',
        'Compare predictions',
        'Practice listening and prediction skills'
      ],
      variations: 'Different story types. Group presentations.'
    },
    {
      id: 'l-011',
      name: 'Listening Drawing',
      materials: 'Audio descriptions, drawing paper',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Students draw what they hear in audio descriptions.',
      instructions: [
        'Play audio descriptions of scenes or objects',
        'Students draw what they visualize',
        'Focus on listening to details',
        'Share drawings and compare',
        'Practice listening comprehension',
        'Visual interpretation skills'
      ],
      variations: 'Different description types. Group drawing.'
    },
    {
      id: 'l-012',
      name: 'Song Meaning',
      materials: 'Song lyrics, audio recordings',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Students listen to songs and discuss meanings.',
      instructions: [
        'Play songs with meaningful lyrics',
        'Students listen and note key phrases',
        'Groups discuss song meanings and themes',
        'Share interpretations with class',
        'Practice listening for meaning',
        'Cultural and emotional understanding'
      ],
      variations: 'Different music genres. Song analysis.'
    },
    {
      id: 'l-013',
      name: 'Audio Instructions',
      materials: 'Instruction audio, task materials',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Students follow audio instructions to complete tasks.',
      instructions: [
        'Play audio instructions for tasks',
        'Students listen and follow steps',
        'Tasks: drawing, building, arranging objects',
        'Check completed work against instructions',
        'Practice listening comprehension',
        'Following multi-step directions'
      ],
      variations: 'Different task complexities. Speed challenges.'
    },
    {
      id: 'l-014',
      name: 'News Listening',
      materials: 'News audio recordings, comprehension sheets',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '12-Adult',
      duration: '20-25 min',
      players: 'Individuals',
      description: 'Listen to news reports and answer questions.',
      instructions: [
        'Play short news audio reports',
        'Students listen for key information',
        'Answer who, what, when, where, why questions',
        'Discuss current events',
        'Practice listening for information',
        'Current events vocabulary'
      ],
      variations: 'Different news topics. Note-taking practice.'
    },
    {
      id: 'l-015',
      name: 'Emotion Listening',
      materials: 'Audio clips with emotions, emotion cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Students identify emotions in audio clips.',
      instructions: [
        'Play audio clips with different emotions',
        'Students identify the emotions heard',
        'Discuss what clues indicate emotion',
        'Practice emotional vocabulary',
        'Listening for tone and feeling',
        'Emotional awareness'
      ],
      variations: 'Different emotion types. Context clues.'
    },
    {
      id: 'l-016',
      name: 'Number Listening',
      materials: 'Audio number sequences, answer sheets',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Individuals',
      description: 'Students listen to and write down number sequences.',
      instructions: [
        'Read number sequences aloud',
        'Students write down what they hear',
        'Include phone numbers, prices, dates',
        'Check answers together',
        'Practice number vocabulary',
        'Listening accuracy for numbers'
      ],
      variations: 'Different number types. Speed challenge.'
    },
    {
      id: 'l-017',
      name: 'Story Sequencing',
      materials: 'Audio story parts, sequencing cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '20-25 min',
      players: 'Small groups',
      description: 'Listen to story parts and put in correct order.',
      instructions: [
        'Play story parts out of order',
        'Groups listen and identify sequence',
        'Arrange story parts in correct order',
        'Explain sequencing reasoning',
        'Practice listening for story structure',
        'Logical thinking and organization'
      ],
      variations: 'Different story complexities. Time limits.'
    },
    {
      id: 'l-018',
      name: 'Audio Scavenger Hunt',
      materials: 'Audio clues, answer sheets',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '8-14',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Teams listen to audio clues and find answers.',
      instructions: [
        'Play audio clues describing objects or concepts',
        'Teams race to identify what\'s described',
        'Write answers on answer sheets',
        'First team to complete all clues wins',
        'Practice listening comprehension',
        'Team competition and speed'
      ],
      variations: 'Different clue types. Point values.'
    },
    {
      id: 'l-019',
      name: 'Conversation Listening',
      materials: 'Conversation audio, comprehension questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Listen to conversations and answer comprehension questions.',
      instructions: [
        'Play audio conversations between people',
        'Students listen for key information',
        'Answer comprehension questions',
        'Discuss conversation content',
        'Practice listening to natural speech',
        'Understanding conversational English'
      ],
      variations: 'Different conversation types. Note-taking.'
    },
    {
      id: 'l-020',
      name: 'Sound Story Creation',
      materials: 'Sound effects, story paper',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Students listen to sounds and create stories.',
      instructions: [
        'Play sequence of sound effects',
        'Groups create stories based on sounds',
        'Stories must incorporate all sounds in order',
        'Share stories with class',
        'Practice creative listening',
        'Imagination and storytelling'
      ],
      variations: 'Different sound types. Individual stories.'
    }
  ],

  // ============================================
  // VOCABULARY GAMES
  // ============================================
  'vocabulary': [
    {
      id: 'v-001',
      name: 'Vocabulary Bingo',
      materials: 'Bingo cards, word lists',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-14',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Play bingo with vocabulary words.',
      instructions: [
        'Create bingo cards with vocabulary words',
        'Teacher calls out definitions',
        'Students mark matching words',
        'First to get line wins',
        'Practice word recognition',
        'Fun vocabulary review'
      ],
      variations: 'Different card sizes. Picture bingo.'
    },
    {
      id: 'v-002',
      name: 'Word Chain Race',
      materials: 'None',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Teams race to create word chains.',
      instructions: [
        'First team says any vocabulary word',
        'Next team must say word starting with last letter',
        'Continue between teams',
        'Can\'t repeat words',
        'Practice vocabulary and quick thinking',
        'Team competition'
      ],
      variations: 'Themed words only. Time limits.'
    },
    {
      id: 'v-003',
      name: 'Category Challenge',
      materials: 'Category cards, timer',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Teams name words in categories against time.',
      instructions: [
        'Announce category (animals, food, etc.)',
        'Teams take turns naming words in category',
        'Set timer for added pressure',
        'Can\'t repeat words',
        'Practice vocabulary categories',
        'Quick thinking'
      ],
      variations: 'Different categories. More complex themes.'
    },
    {
      id: 'v-004',
      name: 'Vocabulary Pictionary',
      materials: 'Whiteboard, markers, vocabulary cards',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Draw vocabulary words for team to guess.',
      instructions: [
        'Student draws vocabulary word on board',
        'Team guesses what it is',
        'No speaking or letters allowed',
        'Time limit for each drawing',
        'Practice vocabulary and descriptions',
        'Visual learning'
      ],
      variations: 'Different categories. Charades combination.'
    },
    {
      id: 'v-005',
      name: 'Word Scramble Race',
      materials: 'Scrambled word cards, timer',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Teams race to unscramble vocabulary words.',
      instructions: [
        'Show scrambled vocabulary word',
        'Teams race to unscramble correctly',
        'First team to solve gets point',
        'Practice spelling and vocabulary',
        'Problem solving',
        'Team competition'
      ],
      variations: 'More complex words. Sentence unscrambling.'
    },
    {
      id: 'v-006',
      name: 'Synonym/Antonym Match',
      materials: 'Word cards, matching mats',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Pairs',
      description: 'Match words with synonyms or antonyms.',
      instructions: [
        'Give pairs word cards and matching mats',
        'Students match synonyms or antonyms',
        'Explain relationships between words',
        'Practice word relationships',
        'Vocabulary expansion',
        'Critical thinking'
      ],
      variations: 'Different word types. More complex relationships.'
    },
    {
      id: 'v-007',
      name: 'Vocabulary Charades',
      materials: 'Vocabulary word cards',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Act out vocabulary words for team to guess.',
      instructions: [
        'Student draws vocabulary word card',
        'Acts out word without speaking',
        'Team guesses the word',
        'Time limit for each turn',
        'Practice vocabulary and non-verbal communication',
        'Physical activity'
      ],
      variations: 'Different word categories. Team charades.'
    },
    {
      id: 'v-008',
      name: 'Word Association Game',
      materials: 'Word cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Whole class',
      description: 'Create word chains with related words.',
      instructions: [
        'First student says any word',
        'Next student says related word',
        'Explain connection between words',
        'Continue around circle',
        'Practice vocabulary connections',
        'Creative thinking'
      ],
      variations: 'Themed chains only. Speed rounds.'
    },
    {
      id: 'v-009',
      name: 'Vocabulary Quiz Show',
      materials: 'Buzzer system, vocabulary questions',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Quiz show format with vocabulary questions.',
      instructions: [
        'Set up teams with buzzers',
        'Ask vocabulary questions',
        'Teams buzz in to answer',
        'Correct answers get points',
        'Wrong answers give other teams chance',
        'Competitive vocabulary review'
      ],
      variations: 'Different question types. Point values.'
    },
    {
      id: 'v-010',
      name: 'Crossword Puzzle Race',
      materials: 'Crossword puzzles, word lists',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Pairs',
      description: 'Race to complete crossword puzzles.',
      instructions: [
        'Give pairs crossword puzzles',
        'Provide word lists for help',
        'First pair to complete wins',
        'Practice vocabulary and spelling',
        'Problem solving',
        'Team cooperation'
      ],
      variations: 'Different puzzle sizes. No word lists challenge.'
    },
    {
      id: 'v-011',
      name: 'Vocabulary Memory Match',
      materials: 'Word cards, definition cards',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Pairs',
      description: 'Match vocabulary words with definitions.',
      instructions: [
        'Lay word and definition cards face down',
        'Students take turns flipping two cards',
        'Match word with correct definition',
        'Keep matched pairs',
        'Most pairs wins',
        'Practice vocabulary recognition'
      ],
      variations: 'Different word types. More cards.'
    },
    {
      id: 'v-012',
      name: 'Word Building Race',
      materials: 'Letter tiles, vocabulary lists',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Race to build vocabulary words from letters.',
      instructions: [
        'Give teams letter tiles and vocabulary lists',
        'Teams race to build words from letters',
        'Longest words get more points',
        'Practice spelling and vocabulary',
        'Team competition',
        'Word formation skills'
      ],
      variations: 'Different letter sets. Time limits.'
    },
    {
      id: 'v-013',
      name: 'Category Word Search',
      materials: 'Word search puzzles, category lists',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Individuals',
      description: 'Find words in word search puzzles by category.',
      instructions: [
        'Give students category-based word searches',
        'Find all words in category',
        'Circle found words',
        'Practice word recognition',
        'Category vocabulary',
        'Visual scanning'
      ],
      variations: 'Different categories. More complex puzzles.'
    },
    {
      id: 'v-014',
      name: 'Vocabulary Relay Race',
      materials: 'Vocabulary cards, race track',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '15-20 min',
      players: 'Teams',
      description: 'Relay race to identify and use vocabulary words.',
      instructions: [
        'Set up race track on board',
        'Teams take turns drawing vocabulary cards',
        'Student must say word and use in sentence',
        'Correct answer moves team forward',
        'First team to finish wins',
        'Practice vocabulary usage'
      ],
      variations: 'Different vocabulary. More complex sentences.'
    },
    {
      id: 'v-015',
      name: 'Guess the Word',
      materials: 'Vocabulary cards, timer',
      difficulty: 'Beginner-Advanced',
      ageGroup: '8-Adult',
      duration: '10-15 min',
      players: 'Teams',
      description: 'Teams guess vocabulary words from clues.',
      instructions: [
        'One student gives clues without saying word',
        'Team guesses the vocabulary word',
        'Set timer for each round',
        'Most words guessed wins',
        'Practice descriptive language',
        'Team communication'
      ],
      variations: 'Different clue types. Drawing clues.'
    },
    {
      id: 'v-016',
      name: 'Vocabulary Tic-Tac-Toe',
      materials: 'Tic-tac-toe grid, vocabulary words',
      difficulty: 'Beginner-Intermediate',
      ageGroup: '6-12',
      duration: '10-15 min',
      players: 'Pairs',
      description: 'Play tic-tac-toe using vocabulary words.',
      instructions: [
        'Draw tic-tac-toe grid with vocabulary words',
        'To claim square, must define or use word',
        'First to get three in a row wins',
        'Practice vocabulary definitions',
        'Strategic thinking',
        'Fun competition'
      ],
      variations: 'Different grid sizes. Sentence requirements.'
    },
    {
      id: 'v-017',
      name: 'Word Family Sort',
      materials: 'Word cards, sorting mats',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '8-Adult',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Sort words into word families.',
      instructions: [
        'Give groups word cards from various families',
        'Students sort words by word families',
        'Explain sorting reasoning',
        'Practice word patterns',
        'Phonics awareness',
        'Vocabulary relationships'
      ],
      variations: 'Different word families. More complex patterns.'
    },
    {
      id: 'v-018',
      name: 'Vocabulary Hot Seat',
      materials: 'Vocabulary cards, chair',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Whole class',
      description: 'Student in hot seat guesses vocabulary from clues.',
      instructions: [
        'One student sits in hot seat facing away',
        'Write vocabulary word on board',
        'Class gives clues without saying word',
        'Hot seat student guesses word',
        'Practice descriptive language',
        'Quick thinking',
        'Class participation'
      ],
      variations: 'Different clue types. Time limits.'
    },
    {
      id: 'v-019',
      name: 'Prefix/Suffix Game',
      materials: 'Prefix/suffix cards, root word cards',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '15-20 min',
      players: 'Small groups',
      description: 'Build words using prefixes, suffixes, and roots.',
      instructions: [
        'Give groups prefix, suffix, and root cards',
        'Students combine to make real words',
        'Define words they create',
        'Practice word building',
        'Morphology awareness',
        'Vocabulary expansion'
      ],
      variations: 'Different affixes. More complex roots.'
    },
    {
      id: 'v-020',
      name: 'Vocabulary Auction',
      materials: 'Vocabulary words, play money',
      difficulty: 'Intermediate-Advanced',
      ageGroup: '10-Adult',
      duration: '20-25 min',
      players: 'Teams',
      description: 'Teams bid on vocabulary words they can define.',
      instructions: [
        'Give teams play money',
        'Auction vocabulary words',
        'Teams bid on words they can define',
        'Winning team must define word correctly',
        'Practice vocabulary definitions',
        'Strategic thinking',
        'Risk assessment'
      ],
      variations: 'Different money amounts. Team bidding.'
    }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get games by age group
export function getGamesByAgeGroup(ageGroup) {
  const allGames = [];
  
  Object.values(ESL_GAMES).forEach(categoryGames => {
    categoryGames.forEach(game => {
      if (game.ageGroup.includes(ageGroup)) {
        allGames.push(game);
      }
    });
  });
  
  return allGames;
}

// Get random games
export function getRandomGames(count = 5) {
  const allGames = [];
  
  Object.values(ESL_GAMES).forEach(categoryGames => {
    allGames.push(...categoryGames);
  });
  
  // Shuffle array
  const shuffled = allGames.sort(() => 0.5 - Math.random());
  
  // Return first count games
  return shuffled.slice(0, count);
}

// Get games by category
export function getGamesByCategory(categoryId) {
  return ESL_GAMES[categoryId] || [];
}

// Get game by ID
export function getGameById(gameId) {
  const [categoryId] = gameId.split('-');
  const categoryGames = ESL_GAMES[categoryId];
  
  if (categoryGames) {
    return categoryGames.find(game => game.id === gameId);
  }
  
  return null;
}

// Search games by name or description
export function searchGames(query) {
  const allGames = [];
  const lowerQuery = query.toLowerCase();
  
  Object.values(ESL_GAMES).forEach(categoryGames => {
    categoryGames.forEach(game => {
      if (game.name.toLowerCase().includes(lowerQuery) ||
          game.description.toLowerCase().includes(lowerQuery)) {
        allGames.push(game);
      }
    });
  });
  
  return allGames;
}

// Get games by difficulty
export function getGamesByDifficulty(difficulty) {
  const allGames = [];
  
  Object.values(ESL_GAMES).forEach(categoryGames => {
    categoryGames.forEach(game => {
      if (game.difficulty === difficulty) {
        allGames.push(game);
      }
    });
  });
  
  return allGames;
}

// Get games by duration (max duration in minutes)
export function getGamesByDuration(maxDuration) {
  const allGames = [];
  
  Object.values(ESL_GAMES).forEach(categoryGames => {
    categoryGames.forEach(game => {
      const duration = parseInt(game.duration.split('-')[0].replace(' min', '').trim());
      if (duration <= maxDuration) {
        allGames.push(game);
      }
    });
  });
  
  return allGames;
}

// Get games by player count
export function getGamesByPlayerCount(playerType) {
  const allGames = [];
  
  Object.values(ESL_GAMES).forEach(categoryGames => {
    categoryGames.forEach(game => {
      if (game.players && (game.players === playerType || game.players.includes(playerType))) {
        allGames.push(game);
      }
    });
  });
  
  return allGames;
}

// ============================================
// STATISTICS
// ============================================

export const ESL_GAMES_STATS = {
  totalCategories: ESL_GAMES_CATEGORIES.length,
  totalGames: Object.values(ESL_GAMES).reduce((sum, category) => sum + category.length, 0),
  gamesByCategory: Object.entries(ESL_GAMES).reduce((stats, [categoryId, games]) => {
    stats[categoryId] = games.length;
    return stats;
  }, {})
};

// ============================================
// EXPORTS
// ============================================

export default ESL_GAMES;
