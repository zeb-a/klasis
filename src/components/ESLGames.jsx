import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Clock, Users, Package, BookOpen, ChevronDown, ChevronUp, Filter, Moon, Sun } from 'lucide-react';

// Parse the markdown content into game data
const parseGamesData = (markdown) => {
  const games = [];
  const lines = markdown.split('\n');
  let currentGame = null;
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect section headers
    if (line.match(/^## \d+\./)) {
      currentSection = line.replace(/^## \d+\.\s*/, '');
      continue;
    }
    
    // Detect game titles
    if (line.match(/^### \d+\.\d+/)) {
      if (currentGame) {
        games.push(currentGame);
      }
      currentGame = {
        id: games.length + 1,
        title: line.replace(/^### \d+\.\d+\s*/, ''),
        section: currentSection,
        materials: '',
        instructions: [],
        variations: []
      };
      continue;
    }
    
    // Detect materials
    if (line.startsWith('**Materials:**')) {
      if (currentGame) {
        currentGame.materials = line.replace('**Materials:**', '').trim();
      }
      continue;
    }
    
    // Detect numbered instructions
    if (line.match(/^\d+\./) && currentGame) {
      const instruction = line.replace(/^\d+\.\s*/, '');
      currentGame.instructions.push(instruction);
      continue;
    }
    
    // Detect variations
    if (line.startsWith('**Variation:**') && currentGame) {
      currentGame.variations.push(line.replace('**Variation:**', '').trim());
      continue;
    }
  }
  
  if (currentGame) {
    games.push(currentGame);
  }
  
  return games;
};

// Import the markdown content (we'll need to import it or pass it as prop)
const gamesMarkdown = `# 📚 Complete ESL Teaching Games Collection
## From: English Teaching Games by Muxi (@EnglishTeachingGamesByMuxi)

---

## 1. Flashcard Games

### 1.1 What's Under the Basket
**Materials:** Flashcards, a basket/box
1. Place several flashcards face down on the floor or table.
2. Cover them with a basket (or box).
3. Lift the basket briefly — students try to identify and call out the card they saw.
4. The student who names it correctly gets a point or becomes the next "hider."
5. **Variation:** Use a cloth instead of a basket for more suspense.

### 1.2 What's Missing (Elephant Memory)
**Materials:** Flashcards (5-8)
1. Place flashcards face up on the board or floor where all students can see them.
2. Have students close their eyes (or turn around).
3. Remove one card.
4. Students open their eyes and call out which card is missing.
5. **Variation:** Remove 2-3 cards for older students.

### 1.3 Flyswatter Game
**Materials:** Flashcards stuck to the board, two flyswatters
1. Divide the class into two teams.
2. Stick flashcards on the board in a grid.
3. One student from each team stands at the front, each holding a flyswatter.
4. Teacher calls out a word (or gives a clue/sentence).
5. The first student to swat the correct flashcard wins a point.
6. **Variation:** For younger kids, use picture cards. For older, use word-only cards.

### 1.4 Peek-a-Boo Flashcard Game
**Materials:** Flashcards, a large cloth or blanket
1. Hold up a flashcard and cover it with a cloth.
2. Slowly reveal the card from one side.
3. Students try to guess the card before it's fully revealed.
4. The first correct guesser gets to hold the next card.

### 1.5 Flashcard Memorizer Game
**Materials:** Flashcards
1. Show students a set of flashcards for 10-15 seconds.
2. Hide them all.
3. Ask students to recall as many cards as they can remember.
4. Award points for each correctly recalled card.

### 1.6 Flashcard Flip-Flop
**Materials:** Flashcards
1. Place all flashcards face down in a grid on the table/floor.
2. Students take turns flipping two cards.
3. If the two cards match (or if the student can name both), they keep the pair.
4. If not, flip them back. The student with the most pairs wins.

### 1.7 Turn the Flashcard
**Materials:** Large flashcards
1. Stick flashcards on the board, face down.
2. A student comes up and turns one card.
3. They must say the word or use it in a sentence.
4. If correct, the card stays face up. If wrong, it goes back face down.
5. Continue until all cards are face up.

### 1.8 Flashcards Token Game
**Materials:** Flashcards, tokens (coins, chips, small objects)
1. Place flashcards in a line on the table.
2. Give each student tokens.
3. Teacher says a word or sentence. Students place a token on the correct card.
4. Students check each other's answers. Correct placements score a point.

### 1.9 Stick the Cards on the Board
**Materials:** Flashcards, tape/blu-tack
1. Call out a word. The first student to find that flashcard and stick it on the board wins.
2. **Variation:** Call out a category (e.g., "animals") and students stick all animal cards.

### 1.10 Introducing New Words (Flashcard Presentation)
**Materials:** Flashcards
1. Hold up one card at a time clearly.
2. Say the word clearly with pronunciation emphasis.
3. Students repeat chorally.
4. Show the card again — students say it without teacher modeling.
5. Use the word in a simple sentence.
6. Gradually increase speed for a fun challenge.

### 1.11 Elaborating New Words
**Materials:** Flashcards, whiteboard
1. Show a flashcard (e.g., "apple").
2. Ask students: "What color? Where do we buy it? Do you like it?"
3. Build a word map on the board around each flashcard.
4. Students practice making sentences using the expanded vocabulary.

### 1.12 Flashcards Bazaar (Quick Review)
**Materials:** Many flashcards spread across the room
1. Spread flashcards all over the floor/tables like a market.
2. Teacher calls out a word or description.
3. Students run to find the correct card and bring it back.
4. **Variation:** Give students a shopping list of 5 words to find.

### 1.13 Hide the Flashcard
**Materials:** One flashcard
1. All students close their eyes.
2. Hide one flashcard somewhere in the classroom (under a desk, behind a curtain, etc.).
3. Students open their eyes and search for it.
4. The finder must say the word on the card in a sentence.

### 1.14 Flashcard Game: Boys vs Girls
**Materials:** Flashcards
1. Divide class into boys and girls (or Team A / Team B).
2. Show a flashcard. The first side to say the word correctly gets a point.
3. Keep a running score on the board.
4. **Variation:** Must use the word in a sentence for older students.

### 1.15 Teacher Guess the Card
**Materials:** Flashcards, sticky notes
1. Give each student a flashcard and a sticky note to cover the word.
2. Students walk around showing each other their card.
3. They must give clues (actions, sounds, descriptions) so others can guess.
4. Teacher tries to guess by listening to student conversations.

### 1.16 Identical Cards Game
**Materials:** Two sets of identical flashcards
1. Shuffle both sets separately.
2. Students draw one card from each set.
3. If they match, the student says the word and keeps the pair.
4. If not, pass to the next student.

### 1.17 Flashcards Game: Circle Game / Point To
**Materials:** Flashcards placed in a circle on the floor
1. Students stand in a circle around the cards.
2. Teacher calls out a word.
3. Students must point to or jump onto the correct card.
4. The slowest student is out (or does a fun penalty like a silly dance).

### 1.18 Large Flashcards Review Game
**Materials:** Many large flashcards
1. Spread 10-15 large flashcards on the board or floor.
2. Give students 30 seconds to memorize them.
3. Remove all cards.
4. Students write down or call out as many words as they remember.
5. Review any forgotten words.

### 1.19 Flashcard Shuffle and Guess
**Materials:** Flashcards
1. Fan out a set of flashcards face down.
2. Shuffle them dramatically while students watch.
3. A student picks one. They must say the word and/or use it in a sentence.
4. **Variation:** The class gives hints if the student struggles.

### 1.20 Birds Nest Flashcard Game
**Materials:** Flashcards, hoops or circles on the floor (as "nests")
1. Place several hoops on the floor (these are "birds' nests").
2. Put a flashcard face down in each hoop.
3. Students (birds) walk around. When teacher says "Go home!" they run to a nest.
4. They pick up the flashcard and say the word. If correct, they get a point.

### 1.21 Flashcard Game: Using Basket
**Materials:** Flashcards, a basket
1. Place a flashcard in the basket.
2. Walk around the class. Students reach in and pull out the card.
3. They must immediately say the word and/or use it in a sentence.
4. **Variation:** Place multiple cards and students must find a specific one by touch only.

### 1.22 Flashcard Game: Playing Cards
**Materials:** Flashcards designed like playing cards (or regular flashcards with numbers)
1. Deal 3-5 cards to each student.
2. Teacher calls out a word/category.
3. Students who have a matching card play it and say the word.
4. The first to play all their cards wins.

### 1.23 Flashcard Game: Cards Between Hoops
**Materials:** Flashcards, two hoops on the floor
1. Place two hoops on the floor, some distance apart.
2. A student stands between the hoops, holding a flashcard.
3. Teacher calls a category (e.g., "animals"). If the card matches, student throws it into hoop A. If not, hoop B.

### 1.24 Flashcard Game: Hoops and Basket
**Materials:** Flashcards, hoops, a basket
1. Place a basket in the center with flashcards spread around it.
2. Place hoops at different distances.
3. Students pick a card, say the word, then throw the card into a hoop.
4. Farther hoops = more points.

### 1.25 Flashcard Game: Flipping Hoop
**Materials:** Flashcards, a hula hoop
1. Place flashcards face down in a line on the floor.
2. Student rolls/throws a hula hoop along the line.
3. Whatever card the hoop lands on, the student must say the word.

### 1.26 Flashcard Game: Travelling Hoops
**Materials:** Flashcards, multiple hoops
1. Place hoops in a path across the room, with flashcards between them.
2. Students must jump from hoop to hoop, picking up flashcards along the way.
3. At the end, they say all the words they collected.

### 1.27 Flashcard Game: Pass the Cards Under the Chair
**Materials:** Flashcards
1. Students sit in a circle.
2. Start passing flashcards under the chairs while music plays.
3. When music stops, each student picks up the card under/near their chair.
4. They must say the word and make a sentence.

### 1.28 Flashcard Game: Move Move Move
**Materials:** Flashcards
1. Place flashcards at different spots around the room.
2. Teacher calls out a word. All students run to that flashcard.
3. **Variation:** Call out a sentence instead of just a word for more challenge.

### 1.29 Q&A Practice in Context
**Materials:** Flashcards with question-answer pairs
1. Show a flashcard with a question (e.g., "What's this?").
2. Student answers using another flashcard (e.g., "It's an apple").
3. Practice full Q&A exchanges using the cards as prompts.

### 1.30 Q&A Drilling
**Materials:** Flashcards
1. Teacher holds up a card and asks a question.
2. Students answer chorally, then individually.
3. Speed up for fluency practice.
4. Students can then ask each other.

### 1.31 Practice Sentence Flashcard Game
**Materials:** Flashcards, sentence cards
1. Students pick a flashcard and must make a sentence using that word.
2. Pass the card to the next student who makes a different sentence.
3. Continue around the circle. No repeated sentences allowed.

### 1.32 Muxi Monster Game
**Materials:** Flashcards, drawn "monster" on the board
1. Draw a simple monster on the board (or use a picture).
2. The monster is "hungry" and only eats cards that students name correctly.
3. Show flashcards one by one. Students say the word to "feed" the monster.
4. If wrong, the monster growls. If correct, the monster "eats" the card.

### 1.33 Scary Alligator Flashcard Game
**Materials:** Flashcards
1. Place flashcards in a line on the floor (this is the "river").
2. One student is the alligator (stands in the middle).
3. Other students must step on cards and say the word to cross.
4. If they can't say the word, the alligator catches them.

### 1.34 Googly Eyes Game
**Materials:** Flashcards with googly eyes attached (or drawn)
1. Attach googly eyes to flashcards for a fun twist.
2. Hold up a card — students must say the word with a funny expression.
3. The funniest pronunciation/face gets extra points.

### 1.35 Lost Duck Flashcard Game
**Materials:** Flashcards, a toy duck (optional)
1. Place flashcards face down in a grid.
2. One card is the "lost duck" (or a special card).
3. Students take turns flipping cards. They must name each card.
4. Whoever finds the lost duck wins.

### 1.36 Puppet String Flashcard Game
**Materials:** Flashcards, string/yarn
1. Tie string to several flashcards and hang them at different heights.
2. Students walk through the "string forest" pulling down cards.
3. They must say the word on each card they pull down.

### 1.37 Inside the Playhouse / Igloo
**Materials:** Flashcards, a playhouse or table with blanket (as an igloo)
1. Create a small "playhouse" or igloo using tables and blankets.
2. Place flashcards inside.
3. Students crawl in, pick a card, come out, and say the word.
4. Makes vocabulary practice feel like an adventure.

### 1.38 Flashcards Game for Teaching Animals
**Materials:** Animal flashcards
1. Show an animal card.
2. Students make the animal sound AND say the English name.
3. **Variation:** Students act out how the animal moves.

### 1.39 Flashcard Game for Family
**Materials:** Family member flashcards
1. Show family member cards (mom, dad, brother, sister, etc.).
2. Students say the word and point to the corresponding person in the class or on a family tree drawing.
3. Practice sentences: "This is my mom."

### 1.40 Shuffle and Guess (Flashcards Practice)
**Materials:** Flashcards in a stack
1. Shuffle cards thoroughly.
2. Take the top card and slowly reveal it.
3. Students raise hands to guess. First correct guess gets the card.
4. Most cards at the end wins.

---

## 2. Circle Games

### 2.1 Hot Potato
**Materials:** A ball or soft object (the "hot potato"), flashcards
1. Students sit in a circle.
2. Play music. Students pass the hot potato around the circle.
3. When music stops, the student holding the potato picks a flashcard and says the word/sentence.
4. If correct, they stay. If wrong, they do a fun action or sit in the center.

### 2.2 Duck Duck Goose
**Materials:** None
1. Students sit in a circle.
2. One student (the "fox") walks around the outside, tapping heads saying "duck, duck, duck..."
3. When they say "GOOSE!" the tapped student chases the fox around the circle.
4. The fox tries to sit in the goose's spot before being caught.
5. **ESL variation:** Use vocabulary words instead of "duck" (e.g., "apple, apple, BANANA!").

### 2.3 Seat Swap
**Materials:** Flashcards (optional)
1. Students sit in a circle.
2. Teacher calls out a category or word (e.g., "Everyone wearing RED, swap!").
3. All matching students must find a new seat.
4. The student left standing answers a question or says a word.
5. **Variation:** Use flashcards — show a card, students whose card matches must swap.

### 2.4 Cat in the Middle
**Materials:** Flashcards
1. One student is the "cat" and stands in the center of the circle.
2. Other students sit in a circle, each holding a flashcard.
3. The cat tries to name a student's flashcard. If correct, that student becomes the cat.
4. **Variation:** The cat asks "What's this?" and the student must answer.

### 2.5 Alligator in the Middle
**Materials:** Flashcards
1. Similar to Cat in the Middle but with an "alligator" theme.
2. Students pass flashcards around the circle.
3. When the alligator (in the middle) says "CHOMP!" the student holding the card must say the word.
4. If wrong, they become the alligator.

### 2.6 Sheep in the Middle
**Materials:** Flashcards
1. One student is the "shepherd" in the center.
2. Others are "sheep" sitting in a circle with flashcards.
3. The shepherd calls a word. The sheep with that card holds it up.
4. The shepherd then asks that sheep a question using the word.

### 2.7 Monkey in the Middle
**Materials:** A ball, flashcards
1. Students stand in a circle. One is the monkey in the middle.
2. Students pass a ball around the circle while the monkey tries to intercept.
3. When the ball is caught, the catcher must say a word from their flashcard.
4. If the monkey catches it, the thrower becomes the monkey.

### 2.8 Musical Chairs
**Materials:** Chairs (one fewer than students), flashcards
1. Arrange chairs in a circle, facing outward.
2. Students walk around the chairs while music plays.
3. When music stops, students sit down. The student left standing must answer using a flashcard.
4. Remove one chair each round.
5. **Variation:** Instead of sitting, students must touch a specific flashcard on the board.

### 2.9 New Style Musical Chairs
**Materials:** Chairs, flashcards
1. Like regular musical chairs, but when music stops, the standing student doesn't get out.
2. Instead, they must perform a task: say a word, make a sentence, or answer a question.
3. No one is eliminated — everyone keeps practicing.

### 2.10 Chairs in the Middle
**Materials:** Chairs, flashcards
1. Place several chairs in the center of the room with flashcards on them.
2. Students walk around the chairs.
3. When teacher signals, students grab a chair and say the word on the flashcard.
4. Students without a chair do a quick speaking task.

### 2.11 Move in a Circle and Stop
**Materials:** Flashcards placed around the room
1. Students walk/march in a circle.
2. When teacher says "STOP!" students freeze.
3. Teacher shows a flashcard. The nearest student must say the word.
4. Continue with different movements (hop, skip, tiptoe).

### 2.12 Elephant Talk
**Materials:** None
1. Students stand in a circle.
2. One student starts by making an elephant trunk (arm extended) and saying a vocabulary word.
3. They "pass" the trunk to another student by pointing at them.
4. That student makes their trunk and says a different word.
5. Go faster and faster for a fun challenge.

### 2.13 Lion Tail, Cowboy, Mystery Voice
**Materials:** Flashcards, a "tail" (string/ribbon)
**Lion Tail:**
1. One student is the lion with a tail (string tucked in waistband).
2. Others try to grab the tail while the lion protects it.
3. Whoever grabs it gets to hold a flashcard and say a word.

**Mystery Voice:**
1. Students close their eyes.
2. Teacher holds a flashcard near one student who says the word.
3. Others open their eyes and guess who said it.

### 2.14 Go Around the Chairs
**Materials:** Chairs arranged in rows
1. Students stand in rows behind chairs with flashcards on them.
2. On "Go!" students walk around the row of chairs.
3. At the signal, they return to their chair and say the word on it.
4. First row to all say their words correctly wins.

### 2.15 Try Your Luck Game
**Materials:** Flashcards, a spinner or dice
1. Students sit in a circle.
2. A student spins/rolls. The number tells them which category of flashcard to attempt.
3. They pick a card from that category and must say/use the word.
4. Correct = points. Build suspense with a countdown.

---

## 3. Cup Games

### 3.1 Grab the Cup
**Materials:** Paper/plastic cups, flashcards
1. Place cups upside down on the table, one per student.
2. Place a flashcard under each cup.
3. Teacher calls a word. Students race to find the cup with that card and grab it.
4. First to grab and say the word wins.

### 3.2 Cup Tower Game
**Materials:** Paper cups, flashcards
1. Students build a tower by stacking cups.
2. Before placing each cup, they must say a word from a flashcard.
3. If the word is wrong, the tower must be restarted.
4. Highest tower wins.

### 3.3 Cup Cup Tap (Cup Game for Clothes)
**Materials:** Cups, clothing flashcards
1. Place three cups upside down. Hide a flashcard under one.
2. Shuffle the cups around while students watch.
3. Students guess which cup has the card.
4. They must then say the clothing word and make a sentence: "I'm wearing a ___."

### 3.4 Move Your Cup
**Materials:** Cups, flashcards
1. Line up cups in a row, each with a flashcard.
2. On "Go!" students pick up cups one by one, say the word, and pass the cup to the next person.
3. The cup moves down the line like a relay race.

### 3.5 Speed-Breaker Flashcard Cup Game
**Materials:** Cups arranged as "speed bumps," flashcards
1. Set up cups in a line on the floor (speed breakers).
2. Students hop over each cup.
3. After each hop, teacher shows a flashcard. Student must say the word before hopping again.

### 3.6 Cross the River (Cup Game)
**Materials:** Cups, flashcards
1. Place cups in a line to create "stepping stones" across the "river."
2. Place a flashcard on each cup.
3. Students step on each cup, say the word, and move to the next.
4. If they can't say the word, they "fall in the river" and start over.

### 3.7 Monkey Walk (Cup Game)
**Materials:** Cups, flashcards
1. Set up a path of cups on the floor.
2. Students walk along the path like a monkey (arms swinging, funny walk).
3. At each cup, they pick up a flashcard and say the word.
4. Fun movement + vocabulary practice combined.

### 3.8 Chicken Walk (Cup Game)
**Materials:** Cups, flashcards
1. Like Monkey Walk, but students walk like chickens (arms flapping, bobbing head).
2. Pick up cards along the way and say the words.
3. Younger kids love the silly movements.

### 3.9 Paper Cups Counting Game
**Materials:** Paper cups with numbers written inside
1. Stack cups with numbers inside.
2. Students take turns picking a cup and saying the number.
3. They then count that many objects or do that many claps.
4. Stack the cups in order from 1-10 (or higher).

### 3.10 Phonics Cups Game
**Materials:** Cups with letters written on them
1. Write individual letters on cups.
2. Students stack/spin cups to make CVC words (c-a-t, d-o-g, etc.).
3. They say the word they made. Teacher checks pronunciation.

### 3.11 ESL Math Game Using Cups
**Materials:** Cups with numbers, small balls/objects
1. Place numbered cups in a row.
2. Students toss balls into cups and add up the numbers.
3. They say the math equation in English: "Three plus five equals eight."

### 3.12 Cups Balls Race
**Materials:** Cups, balls, flashcards
1. Set up cups at one end of the room, flashcards at the other.
2. Students pick a flashcard, say the word, then race to stack a ball on top of a cup.
3. First to complete the task wins.

### 3.13 Flashcards Using Cups and Balls (for Numbers)
**Materials:** Cups, balls
1. Number the cups 1-10.
2. Students toss a ball into a cup, then say the number and count up to it.
3. **Variation:** Toss two balls and add the numbers.

### 3.14 Online ESL Game Using Cups
**Materials:** Cups (for in-person) or digital cups (for online)
1. Show 3 cups on screen, hide a card under one.
2. Students watch as cups shuffle (teacher moves them).
3. Students guess which cup has the card.

### 3.15 Make a Telescope (Cup Activity)
**Materials:** Two paper cups per student
1. Students tape two cups together to make a "telescope."
2. They look through it and find objects in the classroom matching flashcard words.
3. "I see a book! I see a pencil!"

---

## 4. Blindfold Games

### 4.1 Blindfold Turn Around
**Materials:** A blindfold, flashcards
1. Blindfold a student. Give them a flashcard.
2. Spin them around gently (3 times).
3. They must walk toward the board and stick the flashcard in the correct spot.
4. Classmates give directions: "Left! Right! Straight!"

### 4.2 Blindfolded Detective
**Materials:** Blindfold, objects/flashcards
1. Blindfold a student. Place an object or flashcard in front of them.
2. They must feel the object (or the card's texture) and guess what it is in English.
3. "Is it an apple?" — classmates answer "Yes!" or "No!"

### 4.3 Topic Tag (Blindfold)
**Materials:** Blindfold
1. Blindfold one student (the tagger).
2. Teacher calls a topic (e.g., "animals").
3. The tagger walks toward other students. When they tag someone, that student must name an animal.
4. If they can't, they become the tagger.

### 4.4 Blindfold Game with Beanbags
**Materials:** Blindfold, beanbags, flashcards on the floor
1. Blindfold a student.
2. Place flashcards on the floor in front of them.
3. Teacher calls a word. The blindfolded student throws a beanbag to hit the correct card.
4. Classmates help with directions.

### 4.5 Spin Around (Blindfold)
**Materials:** Blindfold, flashcards
1. Blindfold a student and spin them.
2. Place a flashcard somewhere in the room.
3. Classmates guide the student to the card using English directions.
4. When they find it, they must say the word.

### 4.6 Blindfold Flashcard Game (Circle Time)
**Materials:** Blindfold, flashcards
1. Students sit in a circle. One is blindfolded in the center.
2. Pass a flashcard around the circle silently.
3. When teacher says "Stop!" the card holder must say the word.
4. The blindfolded student guesses who said it.

---

## 5. Hoop Games

### 5.1 Pass the Hoops
**Materials:** Hula hoops
1. Students stand in a line holding hands.
2. Pass a hula hoop from one end to the other without letting go of hands.
3. Students must step/climb through the hoop.
4. Say a vocabulary word each time the hoop passes through you.

### 5.2 Drag the Hoop
**Materials:** Hula hoops, flashcards
1. Place flashcards in a scattered path on the floor.
2. Student must drag a hula hoop along the path using a foot or hand.
3. At each flashcard, stop and say the word.
4. Race against a partner or the clock.

### 5.3 Hoops Tunnel
**Materials:** Several hula hoops, flashcards
1. Set up hula hoops in a line to create a "tunnel."
2. Place flashcards inside each hoop.
3. Students crawl through the tunnel, saying each word as they pass it.

### 5.4 Hoop Basketball
**Materials:** Hula hoop, soft ball, flashcards
1. Hang a hula hoop or hold it up as a "basket."
2. Show a flashcard. Student says the word, then throws the ball through the hoop.
3. Correct word + basket = 2 points.

### 5.5 Cross the Hurdles
**Materials:** Hula hoops laid flat on the floor, flashcards
1. Lay hoops flat as "hurdles" on the floor.
2. Students jump over each hurdle.
3. After each jump, teacher shows a flashcard. Student says the word.
4. Increase height by propping hoops for more challenge.

### 5.6 Flipping Hoop Game
**Materials:** Hula hoop, flashcards on the ground
1. Toss/roll the hula hoop across the floor.
2. Whatever flashcard it lands on (or nearest to), the student must say.

### 5.7 ESL Hoops Game (Using Chair, Table, and Chairs)
**Materials:** Hoops, chairs, table, flashcards
1. Create an obstacle course with hoops over chairs, under tables, etc.
2. Students navigate the course, picking up flashcards along the way.
3. At the end, say all the words collected.

### 5.8 Drag the Hoop and Balls
**Materials:** Hula hoop, small balls, flashcards
1. Place balls inside a hoop on the floor with flashcards around it.
2. Students drag the hoop to collect balls, saying flashcard words as they go.

### 5.9 ESL Hula-Hoop Game
**Materials:** Hula hoops, flashcards
1. Toss a hula hoop to a student while showing a flashcard.
2. The student catches the hoop and says the word.
3. They then toss it to another student with a new flashcard.

### 5.10 Hula Race (Parents Day Game)
**Materials:** Hula hoops
1. Students and parents race while hula-hooping.
2. At each checkpoint, they must say a vocabulary word.
3. Fun collaborative game for parents' day events.

---

## 6. Dice Games

### 6.1 ESL Dice Game for Kids
**Materials:** Large soft dice, flashcards
1. Prepare flashcards numbered 1-6 in stacks.
2. Student rolls the dice. Whatever number they get, they pick a card from that stack.
3. They must say the word and/or use it in a sentence.

### 6.2 Monster, Tiger, Bomb Dice Game
**Materials:** Large dice with faces: Monster, Tiger, Bomb (or written on regular dice)
1. Roll the dice.
2. **Monster (1):** Student must act like a monster and roar a vocabulary word.
3. **Tiger (2):** Student acts like a tiger and says a word.
4. **Bomb (3-6):** Safe! Student just says a word normally.
5. **Variation:** Bomb means all students must duck and hide!

### 6.3 Monster Bomb Dice Game (Large Flashcard Version)
**Materials:** Dice, large flashcards
1. Spread large flashcards face up on the floor.
2. Roll the dice. The number determines how many words the student must say.
3. If they roll a 6 (bomb), they must say ALL the words!

### 6.4 Roll and Read CVCs (Phonics Dice Game)
**Materials:** Dice, CVC word cards
1. Prepare cards with CVC words (cat, dog, sun, etc.).
2. Student rolls dice, picks that many cards, and reads each one.
3. Correct reading = keep the card. Most cards wins.

### 6.5 Toss the Dice
**Materials:** Dice, flashcards
1. Place flashcards in a grid on the table.
2. Roll the dice twice (for row and column).
3. Student says the word at that position.
4. **Variation:** Roll once for the number of words to say from the grid.

### 6.6 Flashcard Dice Game (Use 2 Dice)
**Materials:** Two dice, flashcards
1. Roll both dice and add the numbers.
2. Student must find a flashcard matching that total (number cards) or say that many words.
3. Fast-paced and fun for number practice.

### 6.7 ESL Game for Phonics Using Dice
**Materials:** Dice with letters on each face, paper
1. Roll two dice showing different letters.
2. Student combines the letters with a vowel to make a CVC word.
3. They read the word aloud. If it's a real word, they get a point.

---

## 7. Ball Games

### 7.1 Pass the Ball
**Materials:** A soft ball
1. Students stand or sit in a circle.
2. Pass the ball while music plays.
3. When music stops, the ball holder answers a question or says a word.
4. **Variation:** Instead of music, teacher calls "Stop!"

### 7.2 Catch Me If You Can (Using Chair)
**Materials:** A ball, a chair
1. One student sits on the chair with their back to the class.
2. Another student walks up with the ball.
3. The seated student turns around and tries to tag the ball holder before they return to their seat.
4. The tagged student must say a vocabulary word.

### 7.3 Throw the Bean Bag
**Materials:** Bean bags, flashcards on the floor
1. Place flashcards spread out on the floor.
2. Students throw a bean bag at a flashcard.
3. They must say the word on whatever card the bean bag lands closest to.

### 7.4 Ring the Bell
**Materials:** A bell or small cymbal, flashcards
1. Place a bell in the center with flashcards around it.
2. Teacher calls a word. Two students race to find the card and ring the bell.
3. First to ring + correct word = point.

### 7.5 Sticky Balls Flashcard Game
**Materials:** Sticky balls (small adhesive balls), flashcards on the board
1. Stick flashcards to the board at different heights.
2. Students throw sticky balls at the board.
3. Whatever card the ball sticks to, they must say the word.
4. Kids love the satisfying "stick" sound!

### 7.6 Shoot the Ball, Hit the Card
**Materials:** Small soft balls, flashcards stuck to the board
1. Stick flashcards on the board.
2. Students throw balls at the board, trying to hit specific flashcards.
3. Teacher calls a word. Student throws and tries to hit that card.
4. Hit + correct word = point.

### 7.7 Balloon Volleyball
**Materials:** A balloon
1. Divide class into two teams.
2. Keep a balloon in the air by hitting it back and forth.
3. Each time a student hits the balloon, they must say a vocabulary word.
4. If the balloon touches the floor, the other team gets a point.

### 7.8 Cups and Balls (Counting)
**Materials:** Cups, balls
1. Place numbered cups in a row.
2. Student throws balls into cups.
3. Count how many balls landed in cups: "One, two, three balls!"
4. Great for young learners practicing numbers.

### 7.9 Carrying a Ball Flashcard Game
**Materials:** Ball, flashcards
1. Place flashcards in a path on the floor.
2. Students must carry a ball (on a spoon, between knees, or on their head) along the path.
3. At each flashcard, stop and say the word without dropping the ball.

### 7.10 Counting Game Using Balls
**Materials:** Balls (lots of them), a basket
1. Scatter balls around the room.
2. Call out a number: "Five!"
3. Students race to find and bring back exactly that many balls.
4. Count together: "One, two, three, four, five!"

### 7.11 ESL Bottle Games
**Materials:** Empty plastic bottles, flashcards
1. Set up bottles in a triangle (like bowling pins) with flashcards on them.
2. Students roll a ball to knock over bottles.
3. They must say the words on the knocked-over bottles.

### 7.12 Jump with the Ball (Sentence Warm-Up)
**Materials:** A bouncy ball
1. Student bounces a ball while saying a sentence: "I like... apples!"
2. They must complete the sentence before the ball stops bouncing.
3. Pass to the next student who must make a different sentence.

---

## 8. Warm-Up Songs & Chants

### 8.1 Busy Feet Song
**Materials:** None
1. Sing: "Busy feet, busy feet, everybody walking, walking!"
2. Students march/walk around the room.
3. Change actions: jumping, running, tiptoeing, clapping.
4. "Stop!" — all freeze. Say a vocabulary word before moving again.

### 8.2 Row Row Your Boat
**Materials:** None
1. Students sit in pairs facing each other, holding hands.
2. Sing "Row row row your boat" while rocking back and forth.
3. At the end, teacher asks a question. Pairs discuss the answer.

### 8.3 Pinocchio Song
**Materials:** None
1. Sing the Pinocchio song with actions.
2. Students touch their nose (like Pinocchio's growing nose) each time they say an English word.
3. Great for body parts vocabulary.

### 8.4 London Bridge Is Falling Down
**Materials:** None (or flashcard bridge)
1. Two students hold hands up to make a "bridge."
2. Others walk under while singing.
3. When the song ends, the bridge "falls" (hands drop) catching a student.
4. The caught student answers a question or says a word.

### 8.5 A Tooti Ta (Warm-Up Song)
**Materials:** None
1. A rhythmic clapping/stomping warm-up song.
2. Students follow the beat with body percussion.
3. Insert vocabulary words into the rhythm.

### 8.6 Walking Walking Song
**Materials:** None
1. "Walking, walking, walking, walking. Hop hop hop!"
2. Students follow the actions: walk, hop, run, jump, sleep.
3. "Are you sleeping?" — students pretend to sleep, then wake up and say a word.

### 8.7 Walking in the Jungle
**Materials:** None
1. "Walking in the jungle, walking in the jungle. We're not afraid, we're not afraid!"
2. Stomp like elephants, jump like frogs, swing like monkeys.
3. Animal vocabulary practice through movement.

### 8.8 If You're Happy and You Know It
**Materials:** None
1. "If you're happy and you know it, clap your hands!"
2. Continue with: stamp your feet, shout "Hooray!", say a word.
3. Insert vocabulary: "If you have an apple, show it to me!"

### 8.9 Ram Sam Sam (Warm-Up)
**Materials:** None
1. A rhythmic group chant: "Ram sam sam, ram sam sam, guli guli guli ram sam sam."
2. Add clapping and body movements on the beat.
3. Great for getting energy up before a lesson.

### 8.10 Hello Hello Song
**Materials:** None
1. "Hello, hello, hello, how are you?"
2. Students greet each other using different emotions: happy, sad, angry, excited.
3. Practice: "I'm happy! I'm sad! I'm excited!"

### 8.11 We All Clap Hands Together
**Materials:** None
1. "We all clap hands together, together, together."
2. Change actions: stamp feet, nod heads, wave hands.
3. Simple and effective for young learners.

### 8.12 See You Later Alligator
**Materials:** None
1. "See you later, alligator! After while, crocodile!"
2. Fun goodbye song with animal pairs.
3. Students can add their own animal rhymes.

### 8.13 Elephant Dance Song
**Materials:** None
1. Students make elephant trunks with their arms and dance.
2. Say elephant-related and other animal words while dancing.
3. Great warm-up for an animal-themed lesson.

### 8.14 Clap Clap Sound (Warm-Up with Parents)
**Materials:** None
1. Parents and students face each other.
2. Clap rhythms together, then add words on the beat.
3. "Clap clap — apple! Clap clap — banana!"

### 8.15 Mix ESL Songs Warm-Up
**Materials:** None
1. Combine snippets of several warm-up songs.
2. Keep changing songs to maintain energy and surprise.
3. 2-3 minutes of mixed songs to start the class.

### 8.16 Rhyming Chant (Brown Bear)
**Materials:** None (or Brown Bear book)
1. "Brown bear, brown bear, what do you see?"
2. Students respond: "I see a red bird looking at me!"
3. Practice colors and animals through rhythm.

### 8.17 Phonics Chant / Vowel Chant
**Materials:** None
1. Chant vowel sounds with rhythm: "A, a, a — apple! E, e, e — elephant!"
2. Associate each vowel sound with a word.
3. Clap on each beat for TPR engagement.

---

## 9. Phonics Games

### 9.1 ESL Phonics CVC Game
**Materials:** CVC word cards (cat, dog, sun, etc.)
1. Show a CVC word card.
2. Students sound it out: "c-a-t... cat!"
3. **Variation:** Students build CVC words using letter cards.

### 9.2 Phonics Tower (Spell and Read)
**Materials:** Blocks or cups with letters
1. Students build a tower by stacking letter blocks/cups.
2. Each block has a letter. They arrange them to spell a word.
3. Read the word, then add to the tower.

### 9.3 Easy Alphabets Games (ABCs Review)
**Materials:** Alphabet flashcards
1. Show a letter. Students say the letter AND a word starting with it: "A — apple!"
2. Go through the alphabet in order or randomly.
3. **Variation:** Speed round — go as fast as possible.

### 9.4 ABC Phonics Song with Actions
**Materials:** None
1. Sing the ABC song with a phonics focus.
2. Each letter has an associated action and word.
3. "A is for apple — [bite action]. B is for ball — [throw action]."

### 9.5 Snails Make Trails (Phonics)
**Materials:** Letter cards, paper, crayons
1. Give each student a letter card.
2. They draw a "snail trail" (curvy line) connecting letters to make a word.
3. Say the word at the end of the trail.

### 9.6 ESL Spellings Practice
**Materials:** Whiteboard, flashcards
1. Show a flashcard. Students try to spell the word.
2. Write it on their mini whiteboards (or in the air with fingers).
3. Reveal the correct spelling. Self-check.

### 9.7 Talking Letters
**Materials:** Letter cards
1. Give each student a letter card.
2. Students must find partners to make a word.
3. "I'm 'C'. Who has 'A' and 'T'?"
4. Groups form words and say them together.

---

## 10. Number & Counting Games

### 10.1 Number Buzz
**Materials:** None
1. Students count in a circle: 1, 2, 3...
2. Decide on a "buzz number" (e.g., 5). Every time a student should say that number, they say "BUZZ!" instead.
3. Anyone who says the actual number is out.
4. **Variation:** Buzz on multiples: buzz on 5, 10, 15, 20...

### 10.2 ESL Math Games (Addition)
**Materials:** Number cards, whiteboard
1. Show two number cards.
2. Students add them: "Three plus four equals seven!"
3. Write the equation on the board. Practice reading equations in English.

### 10.3 Number Blocks
**Materials:** Number blocks or numbered cards
1. Students build with number blocks, stacking them in order.
2. Each time they add a block, say the number: "One, two, three..."
3. Knock them down and start again — kids love the demolition!

### 10.4 ESL Game for Numbers Using Chopsticks
**Materials:** Chopsticks, small objects (beans, beads, etc.)
1. Students use chopsticks to pick up objects one by one.
2. Count in English as they pick up each one.
3. Great for fine motor skills + number practice.

### 10.5 Number Buzz ESL Game
**Materials:** None
1. Similar to regular Buzz but with a vocabulary twist.
2. Count around the circle. On "buzz" numbers, student must say a vocabulary word instead.
3. Combines number and vocabulary practice.

### 10.6 What Time Is It?
**Materials:** A clock (or drawn on the board)
1. Draw a clock on the board.
2. Teacher moves the hands. Students say the time: "It's three o'clock!"
3. **Variation:** Students move the hands and ask each other.

### 10.7 Fun O'clock (Time Activity)
**Materials:** Paper plate clocks (one per student)
1. Students make clocks from paper plates.
2. Teacher calls a time. Students set their clocks.
3. Hold up clocks and check: "It's five o'clock?"

---

## 11. Board & Card Games

### 11.1 ESL Ludo Game
**Materials:** Ludo board, dice, flashcards
1. Play a modified Ludo: instead of just rolling to move, students must answer a question or say a word to move.
2. Use topic-specific flashcards that match the current lesson.

### 11.2 ESL Card Game BINGO
**Materials:** BINGO cards with vocabulary words, tokens
1. Give each student a BINGO card with words instead of numbers.
2. Teacher calls out words (or gives clues).
3. Students mark the word. First to get BINGO wins!
4. **Variation:** Students must use the word in a sentence to mark it.

### 11.3 Bingo-Snap (Circle Time Card Game)
**Materials:** Pairs of matching cards
1. Deal cards face down to all students.
2. Students take turns flipping a card into the center pile.
3. If two consecutive cards match, the first to yell "SNAP!" wins the pile.
4. Must say the word on the matching card.

### 11.4 ESL Board Games (Flash Games)
**Materials:** Simple board game (printed or drawn), dice, tokens
1. Create a simple board game path with squares.
2. Some squares have tasks (say a word, make a sentence, answer a question).
3. Some squares have bonuses (move forward) or penalties (go back).
4. Roll and move — great for small group practice.

### 11.5 Jigsaw ESL Game
**Materials:** Jigsaw puzzles with vocabulary pictures
1. Students work in pairs to complete a jigsaw puzzle.
2. As they fit pieces together, they identify and say the vocabulary word for each piece.
3. Complete the puzzle, review all the words.

### 11.6 Multi-Player Flashcard Game (Playing Cards in ESL Class)
**Materials:** Playing cards with vocabulary
1. Deal 5 cards to each student.
2. Teacher calls a category. Students play matching cards and say the word.
3. Most cards played = most practice. Collect points for correct usage.

---

## 12. Online Games

### 12.1 Online ESL Game Using Coin
**Materials:** A coin (for online/physical class)
1. Show a flashcard. Student guesses heads or tails.
2. Flip the coin. If correct, they must say the word.
3. If wrong, they do a quick review activity.

### 12.2 Online ESL Cups Game
**Materials:** 3 cups (or digital), flashcard
1. Show 3 cups on camera. Hide a flashcard under one.
2. Slowly move cups around. Students guess which cup has the card.
3. Reveal and say the word together.

### 12.3 Mystery Box PPT Game
**Materials:** PowerPoint presentation
1. Create a PPT with colored boxes on each slide.
2. Each box hides a picture/word. Student picks a box.
3. Click to reveal — student must say the word or make a sentence.
4. **Variation:** Some boxes have bonus points, some have challenges.

### 12.4 Blast Off PPT Game
**Materials:** PowerPoint
1. A rocket on the PPT moves up with each correct answer.
2. Students answer vocabulary questions to "fuel" the rocket.
3. When the rocket reaches the top — BLAST OFF! Fun celebration.

### 12.5 Phonics Song Actions (Online)
**Materials:** None
1. Sing phonics songs with actions over video call.
2. Students mirror the teacher's actions.
3. Hold up letter cards to the camera.

### 12.6 Online Story Teaching
**Materials:** Digital storybook or screen share
1. Share a simple story on screen.
2. Read with expression. Pause at key words.
3. Students call out the word or predict what comes next.

### 12.7 Quick Sentence Drilling (One Minute)
**Materials:** Flashcards shown on camera
1. Show flashcards rapidly (one every 3-4 seconds).
2. Students must say the word immediately.
3. Count how many they get right in one minute.
4. Try to beat the record each time.

---

## 13. Role-Play & Speaking Activities

### 13.1 Restaurant Activity (Order Food)
**Materials:** Menu cards, play money (optional)
1. Set up a "restaurant" — some students are waiters, others are customers.
2. Customers order food: "I'd like a hamburger, please."
3. Waiters take orders: "What would you like?"
4. Practice food vocabulary and polite requests.

### 13.2 Store / Shopkeeper Activity
**Materials:** Flashcards as "products," play money
1. One student is the shopkeeper. Others are customers.
2. Customers ask: "Do you have any apples?"
3. Shopkeeper answers: "Yes, here you are. That's three yuan."
4. Practice asking for things and numbers.

### 13.3 Parents Are the Shopkeeper
**Materials:** Products/flashcards, play money
1. Parents participate as shopkeepers during parents' day.
2. Students buy items from their parents using English.
3. "Mom, can I have an apple, please?"

### 13.4 Role-Play for Toys
**Materials:** Toy flashcards
1. Students practice conversations about toys.
2. "Do you like dolls?" — "Yes, I do! / No, I don't."
3. Pair work with flashcard prompts.

### 13.5 Role-Play Story (Drama)
**Materials:** Simple story script or prompt cards
1. Assign roles from a simple story.
2. Students act out the story in front of the class.
3. Encourage them to improvise and use their own words.

### 13.6 Presenting a Story (Fat Cats)
**Materials:** Story cards or book
1. Tell a simple story with picture prompts.
2. Students retell the story in their own words.
3. Add TPR actions to make it memorable.

### 13.7 ESL Speaking Practice (Conversation)
**Materials:** Topic cards
1. Give pairs a conversation topic card.
2. Students practice a short dialogue.
3. Swap partners and topics. Build confidence through repetition.

### 13.8 How to Get Students Talking More
**Materials:** Flashcards as conversation prompts
1. Show a flashcard (e.g., a house).
2. Ask open-ended questions: "What rooms are in a house?" "What do you do in the bedroom?"
3. Encourage full sentences, not just single words.

### 13.9 How to Teach Big Sentences
**Materials:** Word cards
1. Start with a simple sentence: "I like apples."
2. Add words one at a time: "I like red apples." → "I like eating red apples."
3. Students build longer and longer sentences step by step.

### 13.10 English Speaking Practice in 6 Steps
**Materials:** Flashcards, cups
1. Step 1: Show the word (recognition).
2. Step 2: Say the word (pronunciation).
3. Step 3: Use in a phrase (context).
4. Step 4: Make a full sentence.
5. Step 5: Ask a partner a question.
6. Step 6: Have a short conversation using the word.

### 13.11 PUPPET Asking Questions
**Materials:** Hand puppets
1. Teacher uses a puppet to ask students questions.
2. "Hello! My name is Leo. What's your name?"
3. Students answer the puppet (less intimidating than answering the teacher directly).

### 13.12 Match Toys and Flashcards
**Materials:** Toy objects, matching flashcards
1. Place real toys and flashcards on a table.
2. Students match each toy to its flashcard.
3. Say the word and make a sentence: "This is a car. I like cars."

### 13.13 Act and Say (with Parents)
**Materials:** Flashcards
1. Parents and children face each other.
2. Show a flashcard. The parent acts it out (without speaking).
3. The child guesses and says the word in English.
4. Swap roles.

---

## 14. Parents Day Games

### 14.1 Hot Potato (Parents Version)
**Materials:** A ball or soft object
1. Parents and children sit in a big circle.
2. Pass the hot potato while music plays.
3. When music stops, the parent-child pair holding it must say a word together.

### 14.2 Pass the Cups (Parents Game)
**Materials:** Cups
1. Parents and children form two lines facing each other.
2. Pass cups down the line while saying vocabulary words.
3. Race between teams. First team to pass all cups wins.

### 14.3 Hula Race (Parents Day)
**Materials:** Hula hoops
1. Parents and children take turns hula-hooping.
2. While hooping, they must say a vocabulary word.
3. Longest hoop + correct word = winner.

### 14.4 Rolling Chair (Parents Game)
**Materials:** Rolling office chairs, flashcards
1. A parent sits in a rolling chair. The child pushes them to a flashcard.
2. Parent picks up the card and says the word.
3. Swap roles. Fun and collaborative!

### 14.5 Time Camera Game
**Materials:** Flashcards, a "camera" (made of hands or a prop)
1. Parents and children pair up.
2. One holds up a flashcard and "takes a photo" (frames it with hands).
3. The other says what the photo shows: "It's a dog!"

### 14.6 Push the Rolling Chair
**Materials:** Rolling chair, flashcards placed around the room
1. Student sits in the rolling chair.
2. Teacher (or parent) pushes them to different flashcards around the room.
3. Student says each word they reach.

### 14.7 Open Class / Graduation Games
**Materials:** Various
1. Parents watch as students demonstrate games they've learned.
2. Students explain the rules in English.
3. Parents join in for the final round.

---

## 15. Outdoor & Movement Games

### 15.1 Snake Game
**Materials:** None
1. One student is the "head" of the snake.
2. They run around trying to tag others.
3. Tagged students join the snake by holding hands.
4. The snake grows longer! Last student standing wins.

### 15.2 Let's Go Jogging
**Materials:** Flashcards placed around the outdoor area
1. Students jog around the area.
2. When they pass a flashcard, they must say the word.
3. Teacher calls "Stop!" — nearest student must say the last word they saw.

### 15.3 Stepping Stone
**Materials:** Hoops or paper squares on the ground, flashcards
1. Place hoops/squares as "stepping stones" with flashcards on them.
2. Students jump from stone to stone saying each word.
3. If they fall off (miss), they start over.

### 15.4 Train Ride
**Materials:** Chairs in a row (train), flashcards
1. Arrange chairs in a row like a train.
2. Students sit and "ride" while teacher shows flashcards out the "window."
3. Students call out what they see: "I see a tree! I see a dog!"

### 15.5 Spin Around (Movement Game)
**Materials:** Flashcards
1. Place flashcards in a large circle on the ground.
2. Students spin in the center. When they stop, they say the word on the nearest card.
3. Add running or hopping to get to the card.

### 15.6 Chinese Dragon Game
**Materials:** None
1. Students line up, each holding the waist of the person in front.
2. The "head" leads the dragon around, trying not to break the chain.
3. The "tail" tries to dodge obstacles (flashcards on the ground — say the word when near one).

### 15.7 Wheelbarrow
**Materials:** Flashcards spread on the ground
1. Pair up. One student holds the other's legs (wheelbarrow style).
2. The "wheelbarrow" student crawls on hands to collect flashcards.
3. Say each word collected.

### 15.8 Cushion Race
**Materials:** Cushions, flashcards
1. Place cushions in a line as stepping stones.
2. Students jump from cushion to cushion, saying a word at each stop.
3. Race to the end of the cushion path.

### 15.9 Gorilla Chest Beating
**Materials:** Flashcards
1. Students act like gorillas — beat their chest and walk around.
2. When they reach a flashcard, they stop beating and say the word.
3. Then continue gorilla-walking to the next card.

---

## 16. Holiday & Special Occasion Games

### 16.1 Halloween Party Games
**Materials:** Halloween-themed flashcards, decorations
1. **Mummy Wrap:** Teams wrap a student in toilet paper like a mummy while saying Halloween words.
2. **Pumpkin Toss:** Toss balls into carved pumpkin buckets, saying the word on each ball.
3. **Trick or Treat Song:** Sing and act out the trick-or-treat song.

### 16.2 Christmas Tree Song
**Materials:** None
1. "Dancing Christmas tree" — students stand like trees and dance.
2. Add ornament vocabulary: star, bell, ball, lights.
3. Fun holiday-themed movement activity.

### 16.3 Mother's Day Song
**Materials:** None
1. "I love my mommy" song with actions.
2. Students make sentences about their mothers.
3. "My mom is kind. My mom is beautiful."

### 16.4 Birthday ESL Activity
**Materials:** Birthday props, flashcards
1. Role-play a birthday party.
2. Sing "Happy Birthday." Practice: "How old are you?" "I'm __ years old."
3. "What do you want for your birthday?" — "I want a ___."

---

## 17. Miscellaneous Games

### 17.1 Blindfold Game (Basic)
**Materials:** Blindfold, objects
1. Blindfold a student. Place objects on the table.
2. Student feels the objects and names them in English.
3. Great for sensory vocabulary learning.

### 17.2 Step on Paper Game
**Materials:** Paper squares with words written on them
1. Spread paper squares on the floor with words facing down.
2. Students walk across the papers.
3. Teacher calls "Stop!" — student lifts the paper under their foot and says the word.

### 17.3 Crawling Game
**Materials:** Flashcards on the floor
1. Place flashcards in a path on the floor.
2. Young students crawl along the path.
3. At each card, stop and say the word before crawling to the next.

### 17.4 Hanging Flashcards
**Materials:** Flashcards, string, clothespins
1. Hang flashcards from a string at different heights.
2. Students jump to reach and grab cards.
3. They must say the word on the card they grabbed.

### 17.5 Chair Race
**Materials:** Chairs, flashcards
1. Place chairs with flashcards in a line.
2. Two students race from one end to the other, saying each word as they pass.
3. First to finish with all correct words wins.

### 17.6 Railway Track Game
**Materials:** Flashcards in two parallel lines (train tracks)
1. Place flashcards in two rows on the floor like train tracks.
2. Students walk along the "tracks" saying each word.
3. If they step off the track, they must say a bonus word.

### 17.7 Magic Game / Magic Bad Flashcard
**Materials:** Flashcards, a special "magic" card
1. Include one special card in a set (the "magic" card).
2. Fan out the cards. A student picks one.
3. If it's the magic card — everyone claps! Otherwise, say the word.

### 17.8 Blow the Cards
**Materials:** Flashcards, table
1. Place flashcards on the edge of a table.
2. Students blow them off the table, one at a time.
3. As each card falls, say the word.
4. Fun for very young learners.

### 17.9 Hungry Crocodile
**Materials:** Flashcards, a "crocodile" (drawing or toy)
1. Draw a crocodile on the board (mouth open).
2. Place flashcards around the crocodile.
3. "Feed" the crocodile by saying the word on the card and putting it in the mouth.

### 17.10 Gorilla Chest Beating
*(See 15.9)*

### 17.11 Monkey in the Middle (Cup Version)
**Materials:** Cups, flashcard
1. Place a flashcard under one cup among several.
2. Students take turns guessing which cup has the card.
3. "Monkey" in the middle tries to distract or trick them.

### 17.12 Tap Tap Speak
**Materials:** Flashcards on the board
1. Student comes to the board, closes their eyes.
2. Teacher taps a flashcard with a pointer.
3. Student opens eyes, taps the same card, and says the word.
4. **Variation:** Tap multiple cards — student must say all of them.

### 17.13 10 Finger Game
**Materials:** Flashcards
1. Teacher holds up 10 fingers. Students see 10 flashcards briefly.
2. Lower one finger (remove one card). Students guess which word is missing.
3. Continue until all 10 fingers (cards) are gone.

### 17.14 Brain Booster Warmup
**Materials:** None
1. Quick mental exercises to wake up the brain.
2. "Touch your nose and say 'apple'!" "Clap three times and say 'banana'!"
3. Combine physical actions with vocabulary recall.

### 17.15 Words Matching Activity
**Materials:** Word cards and picture cards
1. Spread word cards on one side, picture cards on the other.
2. Students match each word to its picture.
3. Say the word when making the match.

### 17.16 Teach Various Topics Using Balloons
**Materials:** Balloons, marker
1. Write letters, CVCs, or numbers on balloons.
2. Toss balloons around. Students catch one and say what's on it.
3. Pop balloons at the end for a fun finale.

### 17.17 Magic Colors
**Materials:** Color flashcards, color objects
1. Show a color card. Students find something of that color in the room.
2. "Red! I see a red book!"
3. Touch the object while saying the color word.

### 17.18 Parachute Umbrella Game (Colors)
**Materials:** A play parachute or large cloth, colored balls
1. Students hold the parachute edges.
2. Throw colored balls on top.
3. Call a color. Students lift the parachute to make that color ball fly off.
4. Say the color word together.

### 17.19 Tunnel Play Game
**Materials:** A pop-up tunnel or desks with blankets
1. Set up a tunnel in the classroom.
2. Place flashcards inside the tunnel.
3. Students crawl through, collecting and saying each word.
4. Very engaging for young learners.

### 17.20 Lunch Box Game
**Materials:** A lunch box, small food flashcards or toy food
1. Place food items in the lunch box.
2. Students reach in without looking, pull out an item, and say: "I have a sandwich!"
3. Practice food vocabulary in a fun context.

### 17.21 Go to the Blue Triangle
**Materials:** Colored shape flashcards on the floor
1. Place colored shapes (red circle, blue triangle, etc.) around the room.
2. Teacher calls: "Go to the blue triangle!"
3. Students run to the correct shape.
4. Practice colors + shapes + listening comprehension.

### 17.22 Color the Clothes
**Materials:** Clothing outline worksheets, crayons
1. Give each student a worksheet with clothing outlines.
2. Teacher calls: "Color the shirt RED!"
3. Students color accordingly, then say: "The shirt is red."

### 17.23 Underpass Game
**Materials:** Desks or chairs arranged as an underpass, flashcards
1. Create a low "underpass" with desks.
2. Students crawl under while flashcards are placed along the path.
3. Say each word as they crawl past it.

### 17.24 Cup Rate Game
**Materials:** Cups, flashcards
1. Students flip cups. Under each cup is a flashcard.
2. They must say the word and rate it (like/dislike): "Apple — I like apples!"
3. Quick-paced review game.

### 17.25 Chair Bridge
**Materials:** Chairs arranged as a bridge, flashcards
1. Place chairs in a row to create a "bridge."
2. Students walk across the bridge, saying a word at each chair.
3. If they "fall off," they answer a question to get back on.

### 17.26 Roll and Read
*(See 6.4)*

### 17.27 SNAKE Game
*(See 15.1)*

### 17.28 Muxi Finger Game (Family Topic)
**Materials:** Hand-drawn family finger puppets
1. Draw faces on fingers — each finger is a family member.
2. Wiggle a finger and say: "This is my father. This is my mother."
3. Great for family vocabulary with very young learners.

### 17.29 ESL Game for Body Parts
**Materials:** None (or body parts flashcards)
1. "Touch your nose! Touch your ears! Touch your knees!"
2. Students follow instructions.
3. **Variation:** "Simon says touch your ___" — only do it if teacher says "Simon says."

### 17.30 ESL Activity for Shapes/Numbers/Colors
**Materials:** Shape/number/color cards, objects
1. Combine three topics: "Find a red circle!"
2. "Find two blue triangles!"
3. Students search the room for matching objects.

### 17.31 Make a Sentence Warm-Up (Ting Dong)
**Materials:** Bell or chime
1. Ring the bell: "Ting dong!"
2. Students must immediately make a sentence using a target word.
3. Quick thinking + sentence construction practice.
`;

const ESLGames = ({ isOpen, onClose }) => {
  const [games] = useState(() => parseGamesData(gamesMarkdown));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [expandedGame, setExpandedGame] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Get unique sections
  const sections = useMemo(() => {
    const secs = ['All', ...new Set(games.map(game => game.section))];
    return secs.filter(sec => sec && sec.trim() !== '');
  }, [games]);

  // Filter games based on search and section
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = !searchTerm || 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.materials.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.instructions.join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSection = selectedSection === 'All' || game.section === selectedSection;
      
      return matchesSearch && matchesSection;
    });
  }, [games, searchTerm, selectedSection]);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    },
    modal: {
      width: '95%',
      maxWidth: '1200px',
      height: '90vh',
      maxHeight: '900px',
      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      padding: '20px 24px',
      borderBottom: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: darkMode ? '#fff' : '#1f2937',
      margin: 0
    },
    controls: {
      padding: '20px 24px',
      borderBottom: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchContainer: {
      position: 'relative',
      flex: 1,
      minWidth: '200px'
    },
    searchInput: {
      width: '100%',
      padding: '10px 16px 10px 40px',
      border: `1px solid ${darkMode ? '#444' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: darkMode ? '#2a2a2a' : '#f9fafb',
      color: darkMode ? '#fff' : '#1f2937'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: darkMode ? '#888' : '#6b7280'
    },
    sectionFilter: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    sectionButton: {
      padding: '8px 16px',
      border: `1px solid ${darkMode ? '#444' : '#d1d5db'}`,
      borderRadius: '20px',
      backgroundColor: darkMode ? '#2a2a2a' : '#f9fafb',
      color: darkMode ? '#fff' : '#1f2937',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    sectionButtonActive: {
      backgroundColor: '#3b82f6',
      color: '#fff',
      borderColor: '#3b82f6'
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '24px'
    },
    gamesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px'
    },
    gameCard: {
      border: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
      borderRadius: '12px',
      padding: '16px',
      backgroundColor: darkMode ? '#252525' : '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    gameCardHover: {
      borderColor: '#3b82f6',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
    },
    gameTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: darkMode ? '#fff' : '#1f2937',
      marginBottom: '8px'
    },
    gameSection: {
      fontSize: '12px',
      color: '#3b82f6',
      fontWeight: '500',
      marginBottom: '12px'
    },
    gameMaterials: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      color: darkMode ? '#aaa' : '#6b7280',
      marginBottom: '12px'
    },
    gameInstructions: {
      fontSize: '14px',
      color: darkMode ? '#ccc' : '#4b5563',
      lineHeight: '1.5'
    },
    expandedContent: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`
    },
    instructionList: {
      margin: '0',
      paddingLeft: '20px',
      color: darkMode ? '#ccc' : '#4b5563'
    },
    variationText: {
      fontStyle: 'italic',
      color: '#059669',
      marginTop: '8px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: darkMode ? '#fff' : '#1f2937',
      padding: '4px'
    },
    themeToggle: {
      background: 'none',
      border: `1px solid ${darkMode ? '#444' : '#d1d5db'}`,
      borderRadius: '8px',
      padding: '8px',
      cursor: 'pointer',
      color: darkMode ? '#fff' : '#1f2937'
    },
    stats: {
      fontSize: '14px',
      color: darkMode ? '#aaa' : '#6b7280'
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h1 style={styles.title}>📚 Muxi ESL Games Collection</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={styles.stats}>{filteredGames.length} games</span>
            <button
              style={styles.themeToggle}
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button style={styles.closeButton} onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={styles.controls}>
          <div style={styles.searchContainer}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search games, materials, instructions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.sectionFilter}>
            {sections.map(section => (
              <button
                key={section}
                style={{
                  ...styles.sectionButton,
                  ...(selectedSection === section ? styles.sectionButtonActive : {})
                }}
                onClick={() => setSelectedSection(section)}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.gamesGrid}>
            {filteredGames.map(game => (
              <div
                key={game.id}
                style={{
                  ...styles.gameCard,
                  ...(expandedGame === game.id ? styles.gameCardHover : {})
                }}
                onClick={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
              >
                <h3 style={styles.gameTitle}>{game.title}</h3>
                <div style={styles.gameSection}>{game.section}</div>
                
                <div style={styles.gameMaterials}>
                  <Package size={14} />
                  <span>{game.materials}</span>
                </div>

                <div style={styles.gameInstructions}>
                  {game.instructions.slice(0, 2).map((instruction, index) => (
                    <div key={index} style={{ marginBottom: '4px' }}>
                      {index + 1}. {instruction}
                    </div>
                  ))}
                  {game.instructions.length > 2 && (
                    <div style={{ color: '#3b82f6', fontSize: '12px' }}>
                      +{game.instructions.length - 2} more steps...
                    </div>
                  )}
                </div>

                {expandedGame === game.id && (
                  <div style={styles.expandedContent}>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '12px',
                      color: darkMode ? '#fff' : '#1f2937'
                    }}>
                      Full Instructions:
                    </h4>
                    <ol style={styles.instructionList}>
                      {game.instructions.map((instruction, index) => (
                        <li key={index} style={{ marginBottom: '8px' }}>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                    
                    {game.variations.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <h4 style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          marginBottom: '8px',
                          color: darkMode ? '#fff' : '#1f2937'
                        }}>
                          Variations:
                        </h4>
                        {game.variations.map((variation, index) => (
                          <div key={index} style={styles.variationText}>
                            {variation}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESLGames;
