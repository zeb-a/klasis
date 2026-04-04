import { guideEs, guideFr } from './guide_translations';

const HELP_GUIDES = {
  en: {
    'landing': {
      title: 'Welcome to Klasiz.fun',
      body: `### Choose Your Portal

**Teachers**
- Click **Login** to access your Teacher Portal
- Click **Get Started Free** to create your first class

**Students**
- Click **Student** role
- Enter the 5-digit code from your teacher
- View and complete assignments

**Parents**
- Click **Parent** role
- Enter your 5-digit parent code
- View your child's progress report

---

### How to Create a Teacher Account

1. Click **Get Started Free** on the landing page
2. Fill in your email and create a password
3. Verify your email address
4. Complete your profile setup
5. Start creating your first class!

---

### Teacher Login

1. Click **Login** button in the top right corner
2. Enter your email and password
3. Click **Sign In** or use **Google Sign-In** for quick access

### Forgot Password

1. Click **Login** then **Forgot Password?**
2. Enter your email address
3. Check your email for the password reset link
4. Create a new password and log in

---

### Student Login

**How Students Access Their Account**

1. Click **Student** on the landing page
2. Enter the 5-digit access code from your teacher
3. No password needed - just the code!

**What Students Can Do**
- View assigned lessons and worksheets
- Complete assignments and submit answers
- Track their progress and points earned
- See class announcements from teachers

---

### Parent Login

**How Parents View Progress**

1. Click **Parent** on the landing page
2. Enter the unique 5-digit parent code
3. View your child's academic progress
4. See detailed reports and behavior tracking

**What Parents Can See**
- Academic performance and grades
- Behavior reports and feedback
- Attendance records
- Assignments and completion status
- Teacher comments and notes

---

### Features Overview

**Class Management**
- Create and manage multiple classes
- Add students with simple 5-digit codes
- Customize class settings and avatars

**Points & Rewards**
- Award points for good behavior
- Gamified learning system
- Track student achievements

**Assignments**
- Create worksheets and quizzes
- Assign to students or entire classes
- Review and grade submissions
- View detailed submission analytics

**Games & Activities**
- Interactive classroom games (Tornado, Memory Match)
- Gamified participation tools
- Random winner selection
- Timer and buzzer for activities

**Reports & Analytics**
- Detailed student progress reports
- Behavior tracking and feedback
- Attendance records
- Export reports to PDF

**Classroom Tools**
- Digital whiteboard for teaching
- Countdown timer for activities
- Attention buzzer to get class focus
- QR code sharing for easy access

---

### Common Questions

**Is Klasiz.fun free?**
Yes! Teachers can create a free account and start using all core features.

**How do I add students?**
In Class Dashboard, click the access codes icon to generate unique 5-digit codes for each student. Share these codes with your students.

**Can parents track progress?**
Yes! Generate parent access codes in the Class Dashboard to give parents view-only access to their child's progress.

**What devices work with Klasiz.fun?**
Klasiz.fun works on any device with a web browser - computers, tablets, and smartphones.

**Can I use Klasiz.fun offline?**
You need an internet connection to use Klasiz.fun, but most features work well with basic internet.

**How secure is my data?**
Klasiz.fun uses secure encryption to protect all user data and student information.

**Can I export student data?**
Yes! Teachers can export reports to PDF format from the Reports section.

**Is there a limit to class size?**
There's no strict limit - manage as many students as you need in each class.

---

### Getting Help

Click the help bubble icon anytime to get quick answers about any feature or ask a question!

---

*After logging in, teachers see their classes and can click any class card to enter the Class Dashboard.*`
    },
    'teacher-portal': {
      title: 'Teacher Portal',
      body: `### Manage Classes from the Left Rail

The Teacher Portal now uses a **My Classes rail** on the left and the active class workspace on the right.

---

#### **Class Rail Basics**

- Click any class to open it in the workspace.
- Use the **chevron** at the top of the rail to collapse or expand the class list.
- On mobile, tapping outside the rail closes it automatically.
- Use **drag and drop** inside the rail to reorder classes.

---

#### **Add / Edit / Delete a Class**

**Add**
- Click the **+ Add a new class** button in the rail.
- Enter class name, choose avatar style or upload your own image.
- Pick the class dashboard background color and save.

**Edit**
- Use the **⋮ menu** on a class row, then choose **Edit class**.

**Delete**
- Use the **⋮ menu** on a class row, then choose **Delete class** and confirm.

---

#### **Workspace Tools in the Rail**

- Expand **Workspace tools** to open **Lesson Planner**.
- Use **Export backup** to download your class data JSON backup.

---

*Class updates and ordering changes are saved automatically.*`
    },
    'class-dashboard': {
      title: 'Class Dashboard',
      body: `### Your Classroom Command Center

Use this page to manage points, attendance, students, assignments, reports, and classroom tools for one class.

---

#### **Main Navigation (Dock / Sidebar)**

Depending on layout, tools appear in a left sidebar or bottom dock.

| Icon | What it opens |
|---|---|
| 📋 | Assignments |
| 💬 | Inbox / grading |
| 👥 | Attendance |
| 🔳 | Student + parent access codes |
| 📊 | Reports |
| 🎨 | Whiteboard |
| ⚙️ | Point card settings |
| 🎮 | Games hub |

---

#### **Top Toolbar**

- **History**: view class point history.
- **Sort**: Name (A-Z) or Highest points.
- **Display size**: Compact, Regular, Spacious.
- **Fullscreen**: show or exit full screen.
- **Multi-select**: select several students, then award one behavior to all selected.

---

#### **Giving Points**

**Single student**
- Click a student card, then choose a behavior card.

**Whole class**
- Click the **Whole Class** card and pick a behavior.
- Only present students are included in class-wide awards.

**Multi-select**
- Enable multi-select from the toolbar.
- Tap student cards to select.
- Click **Give Points** and choose a behavior.

---

#### **Attendance**

- Turn on attendance mode from the navigation.
- Tap students to mark absent/present.
- Absent students are excluded from whole-class rewards.

---

#### **Student Management**

- **Add student** from the tile at the end of the grid.
- **Edit/Delete** by hovering a student card on desktop, or long-pressing on touch devices to open actions.

---

#### **Class Switching**

- Use the class switcher in the dashboard header to jump between classes quickly.

---

*Changes to points, attendance, students, and settings are saved automatically.*`
    },
    'assignments': {
      title: 'Assignments',
      body: `### Create & Publish Worksheets

**Step 1: Enter Assignment Details**
- Type a title for your worksheet
- Add questions using the right panel

---

#### **Question Type Buttons**

| | |
|---|---|
| 📝 | Free-text responses |
| ☑️ | Students pick from options |
| 🔤 | Type \`[blank]\` where answers go |
| ↔️ | Match items on left to right |
| 📖 | Include a passage with questions |
| ✅ | Simple true or false answers |
| 🔢 | Numbers only |
| ↕️ | Drag parts to reorder sentences |
| 📊 | Categorize items into groups |

---

**Step 2: Add Questions**
- Click a question type button in the right panel
- Type your question
- **Add images:** Click the image icon inside a question
- **Delete questions:** Click the trash icon next to a question

---

**Step 3: Assign & Publish**
- Choose who receives the assignment:
  - **All students** - everyone in the class
  - **Select students** - pick specific students
- Click **Publish to Class**`
    },
    'Messages & Grading': {
      title: 'Inbox — Review Submissions',
      body: `### Grade Student Work

**View Submissions**
- Click the 💬 (messages) icon in the sidebar
- Two sections appear:
  - **Waiting for Review** - submissions needing grades
  - **Recently Graded** - completed reviews

---

**Grade a Submission**
1. Click any submission in the waiting list
2. View the student's answers on the left
3. Enter points/grade in the input field
4. Click the ✅ (check) icon to save

---

**What Happens After Grading**
- Submission moves to "Recently Graded"
- Grade is added to student's total score
- If you regrade, only the difference is added

---

**Exit Inbox**
- Click the close button (X) to return to dashboard

---

*Use the refresh button if students just submitted new work.*`
    },
    'settings': {
      title: 'Settings',
      body: `### Configure Points cards

 Configure Points cards **Add**, **Edit**, **Remove cards**

#### **Point Cards**

These are the rewards and penalties you give students.

**View**
- Each card shows:
  - Emoji icon
  - Card name (e.g., "Great Work")
  - Type (WOW for positive, NO NO for negative)
  - Point value (+1, +2, -1, etc.)

**Add a Card**
- Click **Add Card** (➕) in the header
- Enter card name
- Choose emoji from the sticker picker
- Set point value (positive or negative)
- Click save

**Edit a Card**
- Click the ✏️ (pencil) icon on any card
- Change name, emoji, or points
- Click save icon (✅)

**Delete a Card**
- Click the 🗑️ (trash) icon on any card
- Confirm deletion

---

#### **Reset to Defaults**
- Click **Reset** (🔄) to restore the original set of point cards
- This replaces all your custom cards

---

*Changes save automatically to all your classes.*`
    },
    'access-codes': {
      title: 'Access Codes',
      body: `### Login Codes for Students & Parents

Every student has two 5-digit codes:

| Code Type | Used By | Purpose |
|------------|-----------|---------|
| Student Code | Students | Log in to Student Portal and complete assignments |
| Parent Code | Parents | View their child's reports and progress |

---

#### **QR Codes**

Each code also displays as a QR code.

**Scan a QR Code**
- Point your phone/tablet camera at the QR code
- Automatically logs into the correct portal
- No typing needed!

**Copy a QR Code**
- Click **Copy QR** button next to any student
- QR code is saved to your clipboard as an image
- Paste into emails, documents, or print for sharing

---

#### **Generated Codes**

- Codes are automatically created when this page opens
- Each student gets unique codes
- Codes are permanent and don't change

---

#### **Copy Text Code**

- Click on any 5-digit code to copy it
- Give the code to parent or student
- They enter it on the login screen

---

*Parents can only view their own child's data. Students can only see assignments sent to them.*`
    },
    'settings-cards': {
      title: 'Point Cards',
      body: `### Customize Reward & Penalty Cards

These are the point cards that appear when giving points to students.

---

#### **Card Types**

**WOW Cards (Positive)**
- Give or add points
- Example: "Team Player" +1, "Great Job" +3
- Displayed in green

**NO NO Cards (Negative)**
- Remove or subtract points
- Example: "Too Loud" -1, "Distracted" -2
- Displayed in red

---

#### **Managing Cards**

**Add New Card**
- Click **Add Card** button (top right)
- Enter card name
- Pick an emoji from the sticker picker (100+ options)
- Set point value
- Click save

**Edit Card**
- Click the pencil icon on any card
- Change name, emoji, or points
- Use the sticker picker to change the emoji
- Click save

**Delete Card**
- Click the trash icon on any card
- Confirm deletion

---

#### **Sticker Picker**

When editing a card, click the emoji icon to open the sticker picker:

**Categories:**
- Stars & Rewards (⭐🏆🏅)
- Celebrations (🎉🎊🔥)
- Fun Characters (🤖👽🦄)
- Sports (⚽🏀🎾)
- Nature (☀️🌈🌳)
- Food (🍎🍕🎂)
- Emotions (😊😍😎)
- Actions (👍👏❤️)
- School & Learning (📚💡🎓)
- And many more!

---

*Use "Reset to Defaults" to restore the original card set.*`
    },
    'whiteboard': {
      title: 'Whiteboard',
      body: `### Draw, Write, and Share

The whiteboard is a blank canvas for classroom activities.

---

#### **Drawing Tools** (right side)

| | |
|---|---|
| ✏️ Pencil | Draw freely on the canvas |
| 🖍️ Highlighter | Transparent color overlay |
| 📝 Text | Type text and press Enter to place |
| 🧹 Eraser | Remove drawings |
| 😊 Emoji | Stamp emojis onto the board |

---

#### **Canvas Options**

**Color Picker**
- 10 preset colors available
- Click any color to select

**Line/Stroke Size**
- Adjust how thick your lines are
- Use slider or buttons

**Font Options**
- Family: Modern, Fun, Elegant, Typewriter, Bold
- Size: Make text larger or smaller

**Add Images**
- Click the image icon
- Upload photos from your device
- Resize and position as needed

---

#### **Actions**

**Export PNG**
- Click to download the whiteboard as an image
- Save anywhere on your computer
- Share with students later

**Clear Canvas**
- Click the trash icon
- Wipes the entire board

---

*Use the whiteboard for math problems, diagrams, brainstorming, or any visual lesson.*`
    },
    'parent-portal': {
      title: 'Parent Portal',
      body: `### View Your Child's Progress

Parents use a 5-digit code to see their child's information.

---

#### **Login**

1. Enter your 5-digit parent code (from your child's teacher)
2. Click **Login**

---

#### **What You'll See**

- Your child's current point total
- Daily behavior chart
- Behavior breakdown (positive vs needs work)
- AI-generated teacher feedback
- Attendance records

---

#### **Time Periods**

Change the view to see data for:
- This week
- This month
- This year

---

#### **Language**

Toggle between English and 中文 to change report language.

---

*Your access is read-only. Only teachers can make changes.*`
    },
    'student-portal': {
      title: 'Student Portal',
      body: `### Complete Assignments & Earn Points

Students log in with a 5-digit code to see their work.

---

#### **Login**

1. Enter your 5-digit student code (from your teacher)
2. Click **Login**

---

#### **Assignments**

You'll see all assignments from your teacher:

**Uncompleted** (shown first)
- Newest to oldest
- These are waiting for you
- Click to open and complete

**Completed** (shown below)
- Newest to oldest
- Already finished
- Can hide from view (click hide button)

---

#### **Complete an Assignment**

1. Click any uncompleted assignment
2. Answer all questions
3. Click **Submit**
4. Your work is sent to your teacher
5. You'll get your grade soon!

---

#### **Your Stats**

At the top of the page, you can see:
- **Total Points** - All points you've earned
- **Completed** - Number of assignments done
- **To-Do** - Assignments waiting for you

---

*Refresh the page if your teacher just sent a new assignment.*`
    },
    'inbox': {
      title: 'Messages & Grading',
      body: `### Review & Grade Student Submissions

---

#### **Two Sections**

**Waiting for Review**
- These are new submissions from students
- Click any submission to view answers
- Enter a grade and click save

**Recently Graded**
- These are submissions you've already graded
- Click to review what you gave
- Can regrade if needed

---

#### **Grading Workflow**

1. Click a submission from the waiting list
2. See student answers on the left panel
3. Enter points/grade in the field
4. Click the ✅ icon to save
5. Grade is added to student's total score
6. Submission moves to "Recently Graded"

---

#### **Regading**

If you need to change a grade:
- Click the submission again
- Enter the new grade
- Click save
- Only the difference is added/subtracted

---

#### **Exit**

Click the **X** or close button to return to the dashboard.

---

*The badge on the messages icon shows how many submissions are waiting for review.*`
    },
    'lesson-planner': {
      title: 'Lesson Planner',
      body: `### Plan Your Lessons

Create and organize lessons with calendars and templates.

---

#### **Getting Started**

**Open Lesson Planner**
- From the Teacher Portal, click **Lesson Planner** (or the calendar icon)
- You'll see your monthly view and any saved templates

**Monthly View**
- See all days of the month at a glance
- Click a day to add or edit lessons
- Use arrows to change month

---

#### **Templates**

**Use a Template**
- Pick a template to structure your week or day
- Fill in subjects and activities
- Save to apply the plan to your calendar

**Create Your Own**
- Build custom templates for your schedule
- Reuse them across weeks or months

---

#### **Tips**

- Plan ahead for the whole month
- Duplicate a week to save time
- Export or print your plan if needed

---

*Lesson plans are saved automatically.*`
    },
    'games': {
      title: 'Games',
      body: `### Classroom Games

Play fun games with your class: Tornado, Memory Match, Quiz, and more.

---

#### **Opening Games**

**From the Portal**
- On the Teacher Portal, click **Games** (or the game controller icon)
- Choose a game from the list

**From the Dashboard**
- Some games can be launched from the class dashboard sidebar
- Lucky Draw is in the sidebar; full games open from the portal

---

#### **Game Types**

**Tornado**
- Spin the wheel to pick students or options
- Great for random selection and rewards

**Memory Match**
- Flip cards to find pairs
- Use your own images or default sets

**Quiz**
- Multiple choice or short answer
- Add your own questions

**Others**
- Face Off, Moto Race, Horse Race, Spell the Word, and more
- Each game has its own rules and setup

---

#### **During the Game**

- Fullscreen mode for class display
- Use the back button to return to the game list or portal

---

*Games work best when the whole class can see the screen.*`
    },
    'games-config': {
      title: 'Games Configuration',
      body: `### Set Up Your Games

Configure game options, images, and content before playing.

---

#### **Where to Configure**

**Before Starting a Game**
- Many games show a setup screen where you choose options
- Set number of players, time limits, or topics

**Tornado / Wheel**
- Add or edit segments (names or options)
- Upload images for custom wheels

**Memory Match**
- Choose or upload image pairs
- Set grid size and difficulty

**Quiz**
- Add questions and correct answers
- Choose question type (multiple choice, true/false, etc.)

---

#### **Saving Settings**

- Options are often saved for the current session
- Reopen the same game to reuse your last setup
- Custom images are stored with your account

---

#### **Tips**

- Test a game once before using it in class
- Use clear, simple images for Memory Match
- Keep quiz questions short for on-screen display

---

*Change settings anytime before you start the game.*`
    },
    'tornado-game': {
      title: '🌪️ How to Play',
      body: `### 🎮 How to Play

#### The Objective
Take turns flipping tiles to collect the most points. But be careful—finding a Tornado will blow all your points away!

---

#### Taking Turns

Look for the "🎯 YOUR TURN! 🎯" badge to see whose turn it is.

The student or team must answer a question, read a word, or identify a picture from the board before they are allowed to pick a tile.

Click any unrevealed tile to flip it over and see what's underneath. The game will automatically pass the turn to the next player after a tile is flipped.

---

#### Card Types

**Points (+1 to +10):** Adds standard points to your score.

**Double (x2):** A lucky find! Multiplies the card's hidden value by 2.

**Triple (x3):** A super lucky find! Multiplies the card's hidden value by 3.

**Tornado (🌪️):** Watch out! If you flip this, a tornado animation spins across the screen and your score drops down to exactly 0.

---

#### Teacher Controls (Manual Adjustments)

Did a student give an exceptionally great answer, or do you need to correct a mistake? You can manually adjust any player's score at any time by clicking the + or - buttons located on their player panel.

---

#### Winning the Game

The game ends when every single tile on the board has been flipped.

The player or team with the highest score is crowned the winner with a fun confetti celebration!

On the victory screen, you have the option to instantly award bonus class points (+1, +2, +3, or +5) to the winning student or team before playing again.`
    },
    'tornado-config': {
      title: '🌪️ Setup Guide',
      body: `### 🌪️ Tornado Game: Setup Guide

#### 1. Choose Your Players

**Individual Mode:** Select specific students to play against each other (minimum 2, maximum 4 players).

**Team Mode:** Divide the class into 2, 3, or 4 teams. The game will automatically sort your selected class into groups with their own fun team colors.

---

#### 2. Configure the Game Board

**Number of Tiles:** Use the slider to choose how many tiles will appear on the board, from a quick 10-tile game up to a massive 40-tile board.

**Numbered Tiles:** Toggle this on to display numbers on the back of the cards (great for having students call out the number they want). Toggle it off to show a star icon instead.

**Tornado Count:** Decide how dangerous the board is! Choose exactly how many Tornado cards are hidden (1 to 5), or select "Random" to keep everyone guessing.

---

#### 3. Add Your Lesson Content

**Upload Pictures:** Click or drag-and-drop up to 20 image files into the upload box. The game will display these around the board.

**Enter Words:** Type in vocabulary words separated by commas (e.g., apple, cat, dog) and click Add. These will be framed around the game board alongside your pictures to prompt the students during gameplay.

---

#### 4. Start the Game
Once your players are selected and your content is loaded, the glowing "Start Game" button will unlock at the bottom of the screen.`
    },
    'memorymatch-game': {
      title: '🎮 How to Play',
      body: `### 🎮 How to Play

#### The Objective
Find and match all the pairs hidden behind the cards. The player with the most matches at the end of the game wins!

---

#### Taking Turns

The active player's score panel will glow or pulse, indicating it is their turn.

A player clicks two cards to flip them over.

**If they match:** The cards remain visible (or disappear), the player earns a point, and they get to go again.

**If they don't match:** The cards will shake briefly and then flip back over. The turn then passes to the next player.

---

#### Winning the Game

The game ends when all pairs have been successfully found.

A champion screen will appear with confetti, highlighting the winner(s).

Teacher Bonus: From the victory screen, you can instantly award Class Points (+1, +2, +3, or +5) to the winner's digital profile.

---

#### 💡 Teacher Tips for Memory Match

**Scaffolded Matching (Image-to-Word):** For younger learners or new vocabulary, use an Image-to-Text setup. This forces the student to connect the visual concept with the written spelling, which is more cognitively demanding (and rewarding) than simple image-to-image matching.

**The "Choral Response" Rule:** To keep the whole class engaged during a 1-on-1 match, have the entire class say the word out loud every time a card is flipped. This ensures that even students who aren't currently playing are practicing their pronunciation.

**Intentional Memory Triggers:** If a student flips a card and misses a match, ask them to describe the location (e.g., "Where was the 'Apple'? Top left!"). This encourages the use of positional language (top, bottom, left, right) alongside the lesson vocabulary.

**Adjusting Difficulty:** If the game is moving too slowly, you can reduce the number of pairs in the setup. For advanced students, increase the grid size to test their short-term spatial memory and focus.

**Collaborative Mode:** While the game tracks individual scores, you can treat it as a "Class vs. The Clock" challenge. Have the students work together to find all matches in under two minutes to win a group reward.`
    },
    'memorymatch-config': {
      title: '🧠 Setup Guide',
      body: `### 🧠 Memory Match: Setup Guide

#### 1. Load Your Lesson Content

**Content Items:** You can add vocabulary in two ways:

**Text:** Type a word and click Add. This creates a text-based card.

**Images:** Drag and drop images into the upload zone. These will appear as visual cards.

**Creating Pairs:** The game automatically duplicates your items to create pairs, or you can mix-and-match images with their corresponding words to create "Image-to-Text" challenges.

*(Note: You need at least 2 items to start, but for a standard challenge, 6 to 12 items are recommended.)*

---

#### 2. Select the Competitors

**Player Selection:** Choose between 1 and 4 players.

**Assign Students:** Select students from your class list. Each student will be assigned a unique color and a dedicated score tracker at the top of the screen.

---

#### 3. Choose a Theme

Pick a background color (Sky Blue, Pale Green, Light Pink, or Moccasin) to set the mood for the session.

---

#### 4. Launch the Board

Once your students are selected and content is ready, click the "Start Game" button to generate the grid.`
    },
    'quiz-game': {
      title: '🎮 How to Play',
      body: `### 🎮 How to Play

#### The Objective
Be the first to click the correct answer on your side of the screen.

---

#### The Battle Screen

The screen is split into two identical sides. The question and image appear in the center for both players to see.

When a question appears, both students race to find the correct option on their own side.

---

#### Scoring & Results

**Correct Answer:** The first player to click the right choice gets the point. The game will show a green checkmark and automatically move to the next question.

**Incorrect Answer:** If a player clicks the wrong button, they are briefly locked out, giving their opponent a chance to answer.

---

#### Victory & Rewards

Once all questions are finished, the final scores are displayed.

**Class Points:** You can instantly award Bonus Points (+1, +2, +3, or +5) to the winner's digital profile directly from the trophy screen.

---

#### 💡 Teacher Tips for Quiz Game

**Effective Distractors:** When teaching phonics, use options that look or sound similar (e.g., Question: "Ship" | Options: Sheep, Ship, Chip, Shop). This forces students to look closely at the graphemes rather than just guessing.

**Image-Only Prompts:** For younger learners who can't read well yet, leave the "Question Text" blank and only use an image. Ask the question verbally, and let them race to find the written word in the options.

**The "Wait" Rule:** To prevent students from clicking randomly to "beat" the other player, tell the class that if a student clicks a wrong answer, they have to sit out for the next question too. This encourages accuracy over pure speed.

**Review Mode:** After the game, use the "Back to Setup" button to quickly scroll through the questions and review the ones where students struggled, reinforcing the lesson before moving on.`
    },
    'quiz-config': {
      title: '📝 Setup Guide',
      body: `### 📝 Quiz Game: Setup Guide

#### 1. Build Your Questions

**Question Text:** Type your question or prompt in the text box.

**Add Images:** Click the image icon to upload a picture for the question. This is great for "What is this?" or "Find the [Color/Shape]" tasks.

**Manage Options:** Each question starts with 2 options. Click "+ Add" to add up to 4 choices (A, B, C, and D).

**Set the Answer:** Click the letter bubble (A, B, C, or D) next to the correct choice. It will turn green to show it's saved as the right answer.

**Add More:** Click "➕ Add Question" at the bottom to build a full quiz.

---

#### 2. Select the Contestants

This is a head-to-head battle! Select exactly 2 students from your class list.

Player 1 will be assigned Green and Player 2 will be assigned Pink.

---

#### 3. Validation Check

The "Play" button will only unlock once all your questions have text and a selected correct answer. If a question is incomplete, the game will highlight it for you to fix.`
    },
    'faceoff-game': {
      title: '🎮 How to Play',
      body: `### 🎮 How to Play

#### The Objective
Be the fastest to match the word in the center to the correct image on your side of the screen.

---

#### The Game Screen

The screen is split into two halves (one for each player).

A target word (or image, depending on the mode) will appear in the very center of the screen.

Several different images will appear on both the top and bottom player areas.

---

#### How to Score

Both players look at the center target and race to find the matching image on their own side.

**Tap/Click the correct image:** If you are right, you win the round and get a point!

**Be Careful:** If you click the wrong image, you will be locked out for a moment while your opponent has a chance to find the right answer.

---

#### Winning the Game

The game continues for the number of rounds you chose during setup.

After the final round, the player with the most points is declared the winner with a confetti celebration.

Teacher Bonus: Just like the other games, you can award bonus class points to the winner directly from the victory screen before heading back to the portal.

---

#### 📱 Mobile vs. Desktop

**Desktop Version:** Best played on a smartboard or large screen where two students can stand on either side.

**Mobile Version:** Specifically designed for tablets or phones, allowing two students to sit opposite each other and play on a single device placed flat on a table.`
    },
    'faceoff-config': {
      title: '⚔️ Setup Guide',
      body: `### ⚔️ Face-Off: Setup Guide

#### 1. Create Your Word-Image Pairs

This game uses pairs of words and images. You have two ways to add them:

**Bulk Upload:** Drag and drop a group of images into the upload box. The game will automatically use the filenames as the words for each image!

**Manual Entry:** Click "➕ Add Word-Image Pair" to add a single slot. Type the word and click the image icon to upload a specific picture for it.

*(Note: You need at least 5 pairs to start the game.)*

---

#### 2. Choose Your Rounds

Use the Rounds slider to decide how many matches the students will play (from 5 to 20 rounds).

---

#### 3. Select Your Competitors

Face-Off is a head-to-head battle! Select exactly 2 students from your class list.

One student will be assigned the Green side and the other the Blue side.

---

#### 4. Start the Battle

Once you have 2 students selected and at least 5 pairs ready, the red "Start Game" button will activate.`
    },
    'motorace-game': {
      title: '🏁 How to Play',
      body: `### 🏁 How to Play

#### The Objective
Be the first motorcycle to cross the checkered finish line! The track is automatically divided into steps based on how many words or images you added during setup.

---

#### Displaying the Questions

Click the "🖼️ Slideshow" button at the top of the screen at any time.

This opens a massive, full-screen view of your current word or picture for the whole class to see.

Use the left and right arrows to navigate through your lesson material as the race progresses.

---

#### Moving the Motorcycles

You are the race director! You control the bikes based on the students' answers:

**Move Forward (Accelerate!):** Did a student get the answer right? Single-click (or tap) their motorcycle. You'll hear the engine rev as they pop a wheelie and zoom one space forward.

**Move Backward (Skid!):** Did someone make a mistake, or do you need to issue a penalty? Right-click (or double-tap) their motorcycle to make them skid backward one space.

---

#### Winning the Race

The first player to reach the final step crosses the finish line and wins!

The game will instantly pause and bring up a giant Champion celebration screen complete with falling confetti.

On the victory screen, you can click to instantly award bonus class points (+1, +2, +3, or +5) to the winning student before exiting the race.`
    },
    'motorace-config': {
      title: '🏍️ Setup Guide',
      body: `### 🏍️ MotoRace Game: Setup Guide

#### 1. Choose Your Content Type

Look for the Text / Image toggle at the top.

**Text Mode:** Perfect for spelling, reading, or vocabulary. Type your words into the box (separated by commas) and click Add.

**Image Mode:** Great for visual identification. Click the upload area or drag-and-drop your picture files to add them to the game.

*(Note: You need to add at least 2 words or images to unlock the Start button!)*

---

#### 2. Select Your Racers

**Number of Players:** Choose whether you want a 2, 3, or 4-player race.

**Pick Students:** Click on the names of the students from your class list to assign them a colorful motorcycle. You must select the exact number of students you chose in the previous step.

---

#### 3. Start Your Engines
Once your content is loaded and your racers are selected, the orange "Start Game" button at the bottom will glow. Click it to head to the starting line!`
    },
    'horserace-game': {
      title: '🏁 How to Play',
      body: `### 🏁 How to Play

#### The Objective
Be the first horse to race from the bottom of the screen to the finish line at the top!

---

#### Teaching with the Slideshow

Click the "🖼️ Slideshow" button at the top to show the current word or image in a large, clear format for the whole class.

Use the on-screen arrows to cycle through your vocabulary as students take turns.

---

#### Controlling the Horses
The teacher acts as the referee and moves the horses based on student performance:

**Move Forward (Gallop!):** If a student answers correctly, Single-click (or tap) their horse. They will move one step closer to the finish line with a galloping sound.

**Move Backward (Stumble):** If a student needs a correction or a "do-over," Right-click (or double-tap) their horse to move them back one step.

---

#### The Winner's Circle

The first horse to reach the very top of the track wins.

The game will automatically trigger a confetti celebration and display the winner.

You can instantly award Bonus Class Points (+1, +2, +3, or +5) to the winner's profile directly from the victory screen.

---

#### 💡 Teacher Tips for Horse Race

**The "10 Item" Rule:** If you only have 5 vocabulary words but want a longer race, enter each word twice. This reinforces memory through repetition and ensures the race isn't over too quickly.

**Phonics Drills:** This game is excellent for "Minimal Pairs" (words that sound similar like ship/sheep). Use the Slideshow to toggle quickly between them to see if students can spot the difference.

**Managing Energy:** Because the horses move vertically and the competition is visible, students can get loud! Use the Right-click (Move Backward) mechanic as a gentle "penalty" for students who shout out answers out of turn, encouraging better classroom discipline.

**Dynamic Pacing:** If one student is far ahead, you can focus your questions on the trailing students to keep the race "neck and neck," which maintains high engagement for the whole class until the very end.`
    },
    'horserace-config': {
      title: '🐎 Setup Guide',
      body: `### 🐎 Horse Race: Setup Guide

#### 1. Prepare Your Racing Content

**Minimum Requirement:** You need to add at least 10 items (words or images) to start the race. The track length is determined by how many items you provide.

**Text Mode:** Type words separated by commas or new lines (e.g., cat, bat, hat) and click Add.

**Image Mode:** Drag and drop pictures directly into the upload box.

*(Note: The game works best when you have one item per "step" you want the students to take.)*

---

#### 2. Choose Your Jockeys

**Player Count:** Select whether you want a 2, 3, or 4-horse race.

**Assign Students:** Click student names from your class list to assign them to a colored lane. You must select the exact number of students to match your player count.

---

#### 3. Head to the Tracks

Once you have at least 10 items and your students are selected, the golden "Start Game" button will unlock.`
    },
    'spelltheword-game': {
      title: '🎮 How to Play',
      body: `### 🎮 How to Play

#### The Objective
Look at the image provided and tap the scrambled letters in the correct order to spell the word as fast as possible.

---

#### Spelling the Words

An image appears in the center of the screen.

Scrambled letter tiles are provided below the image.

**To Spell:** Tap or click the letters in the correct sequence.

**Correct Letter:** The letter flies into the word slot with a satisfying "pop" animation.

**Wrong Letter:** The screen will shake briefly to let the student know to try a different letter.

**Skip:** If a student is truly stuck, they can hit the "Skip" button to move to the next word (no points are awarded for skipped words).

---

#### Winning the Game

The game continues until all the words in your list have been spelled.

The player with the most correct words at the end wins the round.

**Class Points:** Just like your other games, you can award Bonus Class Points (+1, +2, +3, or +5) to the winner directly from the final victory screen.

---

#### 💡 Teacher Tips for Spell the Word

**The "Clean Filename" Trick:** Before you upload images in bulk, take a second to rename them on your computer. If you want the students to spell "octopus," make sure the file isn't named "DSC10293.jpg." This saves you from having to manually edit every word in the setup screen!

**Scaffolding Difficulty:** For beginners, start with 3-letter CVC words (cat, dog, bat). As they improve, move to words with "silent e" or "digraphs" (sh, ch, th). Because the game provides the letters for them, it's a great "low-stakes" way to practice difficult spellings.

**Choral Spelling:** While the two students are racing at the board, encourage the rest of the class to spell the word out loud together once it's finished. This reinforces the letter-to-sound connection for everyone, not just the players.

**Focus on Phonemes:** If a student is stuck, instead of telling them the letter (e.g., "Press the P"), give them the sound (e.g., "What's the last sound in 'Map'? /p/"). This helps them use their phonics knowledge to find the right tile.`
    },
    'spelltheword-config': {
      title: '🔠 Setup Guide',
      body: `### 🔠 Spell the Word: Setup Guide

#### 1. Build Your Word List

**Minimum Requirement:** You must add at least 5 words to begin the game.

**Bulk Image Upload:** This is the fastest way to set up. Drag and drop a group of images into the upload box. The game will automatically take the filenames of your images and turn them into the target words (e.g., an image named "apple.png" becomes the word "apple").

**Manual Entry:** Use the "Words" tab to type in specific words and upload matching images one by one.

**Text Processing:** If your filenames have dashes or underscores (like "ice-cream"), the game will automatically clean them up into proper words.

---

#### 2. Choose the Challenge Mode

**1-Player Mode:** Great for individual practice or having one student come to the board while the class helps them.

**2-Player Mode:** A head-to-head spelling race! Select 2 students from your class list to compete. Player 1 is assigned Green and Player 2 is assigned Pink.

---

#### 3. Launch the Spelling Bee

Once you have your words and players ready, the purple "Start Game" button will activate.`
    },
    'reports': {
      title: 'Reports',
      body: `### View Student Progress & Analysis

This page displays detailed reports and analysis for your students.

---

#### **Time Periods**

Change time range to view data:
- **Week** - Last 7 days
- **Month** - Last 30 days
- **Year** - Last 12 months

---

#### **Student Selection**

View reports for all students or select one student:
- Use dropdown to filter specific student
- Each student shows their own report card

---

#### **Exam Scores**

Track and manage exam performance for your class:

**Add Exam Scores**
- Click **Add Exam Scores** button (➕) in header
- Fill in exam details: name, subject, date
- Enter scores for each student
- Set a benchmark score (e.g., 100 points)
- Choose scoring mode:
  - **Brief** - Just the total score
  - **Detailed** - Break down by sections (Reading, Writing, etc.)
- Click **Save Exam** to store your data

**Viewing Exam Scores**
- Exam scores appear in each student's report card
- Shows exam name, subject, date, and score
- Calculates percentage based on your benchmark
- Charts show exam performance over time
- Section breakdowns shown for detailed exams

**Your Data Stays Safe**
- Exam scores are saved automatically
- Data appears whenever you come back
- All exam data loads for your class
- No need to re-enter anything

---

#### **Report Card Contents**

Each student report includes:

**Student Information**
- Student name and ID
- Avatar or character image
- Total points earned

**AI Teacher Feedback**
- Auto-generated summary
- Highlights strengths and areas needing work
- Based on behavior patterns
- Teacher can edit (click edit button)

**Exam Performance**
- List of all exam scores
- Subject-wise performance
- Percentage scores vs benchmark
- Performance trends over time
- Detailed section breakdowns (if applicable)

**Behavior Distribution Chart**
- Daily points for selected time period
- Bar chart showing score trends
- Positive behaviors shown in green
- Needs work behaviors shown in red

**Behavior Ratio**
- Pie chart of positive vs negative
- Visual breakdown of behavior types
- Exact count per category

---

#### **Edit Feedback**

Teachers can customize AI-generated feedback:
- Click **Edit** next to feedback
- Modify text as needed
- Click **Save** to keep changes
- Parents see your edited version

---

#### **Export Options**

**Download PDF**
- Click PDF button (top right)
- Downloads report as PDF file
- Includes all charts and data
- Ready for printing or sharing

**Print**
- Click Print button
- Opens print dialog
- Print directly to paper or PDF
- Optimized for A4 paper

---

#### **Language**

Toggle between English and 中文 to change report language for bilingual families.

---

*Reports help teachers track student progress and communicate with parents.*`
    },
  },

  zh: {
    'landing': {
      title: '欢迎使用 Klasiz.fun',
      body: `### 选择您的门户

**教师**
- 点击 **登录** 进入教师门户
- 点击 **免费注册** 创建第一个班级

**学生**
- 点击 **学生** 角色
- 输入老师提供的 5 位代码
- 查看并完成作业

**家长**
- 点击 **家长** 角色
- 输入 5 位家长代码
- 查看孩子的进度报告

---

### 如何创建教师账户

1. 在首页点击 **免费注册**
2. 填写您的邮箱并创建密码
3. 验证您的邮箱地址
4. 完成个人资料设置
5. 开始创建您的第一个班级！

---

### 教师登录

1. 点击首页右上角的 **登录** 按钮
2. 输入您的邮箱和密码
3. 点击 **登录** 或使用 **Google 登录** 快速访问

---

### 忘记密码

1. 点击 **登录** 然后点击 **忘记密码？**
2. 输入您的邮箱地址
3. 查看邮箱中的密码重置链接
4. 创建新密码并登录

---

### 学生登录

**学生如何登录账户**

1. 在首页点击 **学生**
2. 输入老师提供的 5 位访问代码
3. 无需密码 - 只需代码！

**学生可以做什么**
- 查看分配的课程和作业
- 完成作业并提交答案
- 跟踪他们的进度和获得的积分
- 查看老师发布的班级通知

---

### 家长登录

**家长如何查看进度**

1. 在首页点击 **家长**
2. 输入唯一的 5 位家长代码
3. 查看孩子的学术进度
4. 查看详细报告和行为跟踪

**家长可以看到什么**
- 学业表现和成绩
- 行为报告和反馈
- 出勤记录
- 作业和完成状态
- 老师评论和备注

---

### 功能概览

**班级管理**
- 创建和管理多个班级
- 使用简单的 5 位代码添加学生
- 自定义班级设置和头像

**积分与奖励**
- 为良好行为奖励积分
- 游戏化学习系统
- 跟踪学生成就

**作业管理**
- 创建工作表和测验
- 分配给学生或整个班级
- 审查和评分提交
- 查看详细的提交分析

**游戏与活动**
- 互动课堂游戏（龙卷风、记忆匹配）
- 游戏化参与工具
- 随机选择获奖者
- 活动计时器和蜂鸣器

**报告与分析**
- 详细的学生进度报告
- 行为跟踪和反馈
- 出勤记录
- 导出报告为 PDF

**课堂工具**
- 用于教学的数字白板
- 活动倒计时器
- 注意力蜂鸣器吸引课堂注意力
- 二维码分享以便轻松访问

---

### 常见问题

**Klasiz.fun 是免费的吗？**
是的！教师可以创建免费账户并开始使用所有核心功能。

**如何添加学生？**
在课堂仪表盘中，点击访问代码图标为每个学生生成唯一的 5 位代码。将这些代码分享给您的学生。

**家长可以跟踪进度吗？**
可以！在课堂仪表盘中生成家长访问代码，让家长只能查看其孩子的进度。

**哪些设备可以使用 Klasiz.fun？**
Klasiz.fun 可以在任何有网络浏览器的设备上使用 - 电脑、平板电脑和智能手机。

**我可以离线使用 Klasiz.fun 吗？**
您需要互联网连接才能使用 Klasiz.fun，但大多数功能在基本互联网下也能良好运行。

**我的数据有多安全？**
Klasiz.fun 使用安全加密来保护所有用户数据和学生信息。

**我可以导出学生数据吗？**
可以！教师可以从报告部分将报告导出为 PDF 格式。

**班级大小有限制吗？**
没有严格限制 - 您可以在每个班级中管理任意数量的学生。

---

### 获取帮助

随时点击帮助气泡图标获取有关任何功能的快速解答或提问！

---

*登录后，教师会看到班级卡片，点击任何卡片即可进入课堂仪表盘。*`
    },
    'teacher-portal': {
      title: '教师门户',
      body: `### 从左侧班级栏管理班级

教师门户现在采用左侧 **我的班级** 栏 + 右侧工作区布局。

---

#### **班级栏基础操作**

- 点击任意班级可在右侧打开。
- 使用顶部 **箭头按钮** 展开或收起班级栏。
- 在手机上，点击班级栏外区域会自动收起班级栏。
- 支持拖拽班级条目调整顺序。

---

#### **新增 / 编辑 / 删除班级**

**新增**
- 点击班级栏中的 **+ 添加新班级**。
- 输入班级名称，选择头像风格或上传图片。
- 选择班级仪表盘背景色后保存。

**编辑**
- 点击班级条目右侧 **⋮ 菜单**，选择 **编辑班级**。

**删除**
- 点击 **⋮ 菜单**，选择 **删除班级** 并确认。

---

#### **班级栏工作区工具**

- 展开 **工作区工具** 可打开 **课程计划**。
- 点击 **导出备份** 可下载班级数据 JSON 备份。

---

*班级信息和排序会自动保存。*`
    },
    'class-dashboard': {
      title: '课堂仪表盘',
      body: `### 课堂主控台

在这里可以管理单个班级的积分、考勤、学生、作业、报告和课堂工具。

---

#### **主导航（底部 Dock / 左侧栏）**

根据布局不同，工具会显示在左侧栏或底部 Dock。

| 图标 | 功能 |
|---|---|
| 📋 | 作业 |
| 💬 | 收件箱 / 评分 |
| 👥 | 考勤模式 |
| 🔳 | 学生与家长登录码 |
| 📊 | 报告 |
| 🎨 | 白板 |
| ⚙️ | 积分卡设置 |
| 🎮 | 游戏中心 |

---

#### **顶部工具栏**

- **历史记录**：查看班级积分历史。
- **排序**：姓名（A-Z）或最高积分。
- **显示尺寸**：紧凑 / 常规 / 宽敞。
- **全屏**：进入或退出全屏。
- **多选模式**：选中多个学生一次发分。

---

#### **发放积分**

**单个学生**
- 点击学生卡片，选择行为卡发分。

**全班**
- 点击 **全班** 卡片后选择行为卡。
- 仅在场学生会参与全班发分。

**多选发分**
- 先开启多选模式。
- 点击学生卡片进行选择。
- 点击 **Give Points** 并选择行为卡。

---

#### **考勤模式**

- 在导航中打开考勤模式。
- 点击学生切换缺勤 / 到场状态。
- 缺勤学生不会参与全班奖励。

---

#### **学生管理**

- 网格末尾的卡片可 **添加学生**。
- 桌面端悬停卡片可编辑/删除；触屏设备可长按打开操作按钮。

---

#### **班级切换**

- 可在仪表盘顶部的班级切换器中快速切换班级。

---

*积分、考勤、学生和设置更改都会自动保存。*`
    },
    'assignments': {
      title: '作业',
      body: `### 创建并发布练习

**步骤 1：输入作业详情**
- 输入练习题的标题
- 使用右侧面板添加题目

---

#### **题目类型**

| | |
|---|---|
| 简答题 | 自由文本回答 |
| 选择题 | 从选项中选择 |
| 填空题 | 在答案处输入 \`[blank]\` |
| 连线题 | 将左侧项目与右侧匹配 |
| 阅读理解 | 包含段落和问题 |
| 判断题 | 简单的是/否答案 |
| 数字题 | 仅数字 |
| 句子排序 | 拖动部分重新排序句子 |
| 分类题 | 将项目归类到组别 |

---

**步骤 2：添加题目**
- 点击右侧面板中的题目类型按钮
- 输入您的问题
- **添加图片：** 点击题目中的图片图标
- **删除题目：** 点击题目旁边的垃圾桶图标

---

**步骤 3：分配并发布**
- 选择谁接收作业：
  - **所有学生** - 班级中的每个人
  - **选择学生** - 选择特定学生
- 点击 **发布到班级**

---

*空题目无法发布。先填写必填字段。*`
    },
    'Messages & Grading': {
      title: '消息与评分',
      body: `### 审阅学生提交

**查看提交**
- 点击侧边栏中的 💬（消息）图标
- 出现两个部分：
  - **待审阅** - 需要评分的提交
  - **最近已评分** - 已完成的审阅

---

**评分提交**
1. 点击待审阅列表中的任何提交
2. 在左侧查看学生的答案
3. 在输入字段中输入积分/成绩
4. 点击 ✅（勾选）图标保存

---

**评分后发生什么**
- 提交移动到"最近已评分"
- 积分添加到学生的总分中
- 如果您重新评分，只添加差额

---

**退出收件箱**
- 点击关闭按钮（X）返回仪表盘

---

*如果学生刚刚提交了新作业，请使用刷新按钮。*`
    },
    'settings': {
      title: '设置',
      body: `### 配置您的班级

此页面用于管理班级设置。

---

#### **积分卡**

这些是您给学生提供的奖励和惩罚。

**查看**
- 每张卡片显示：
  - 表情图标
  - 卡片名称（如"做得好"）
  - 类型（WOW 为正分，NO NO 为负分）
  - 积分值（+1、+2、-1 等）

**添加卡片**
- 点击标题中的 **添加卡片**
- 输入卡片名称
- 从贴纸选择器中选择表情符号
- 设置积分值（正或负）
- 点击保存

**编辑卡片**
- 点击任何卡片上的铅笔图标
- 更改名称、表情符号或积分
- 点击保存图标（✅）

**删除卡片**
- 点击任何卡片上的垃圾桶图标
- 确认删除

---

#### **恢复默认值**
- 点击 **重置** 恢复原始积分卡集
- 这将替换所有自定义卡片

---

*更改会自动保存到您的所有班级。*`
    },
    'access-codes': {
      title: '访问码',
      body: `### 学生和家长登录代码

每个学生有两个 5 位代码：

| 代码类型 | 使用者 | 用途 |
|------------|-----------|---------|
| 学生代码 | 学生 | 登录学生门户并完成作业 |
| 家长代码 | 家长 | 查看孩子的报告和进度 |

---

#### **二维码**

每个代码也显示为二维码。

**扫描二维码**
- 用手机/平板相机对准二维码
- 自动登录到正确的门户
- 无需输入！

**复制二维码**
- 点击任何学生旁边的 **复制二维码** 按钮
- 二维码作为图像保存到剪贴板
- 粘贴到电子邮件、文档或打印以分享

---

#### **生成的代码**

- 打开此页面时自动创建代码
- 每个学生获得唯一代码
- 代码是永久的，不会改变

---

#### **复制文本代码**

- 点击任何 5 位代码进行复制
- 将代码提供给家长或学生
- 他们在登录屏幕上输入

---

*家长只能查看自己孩子的数据。学生只能看到发给他们的作业。*`
    },
    'settings-cards': {
      title: '积分卡',
      body: `### 自定义奖励和惩罚卡片

这些是给学生积分时出现的积分卡。

---

#### **卡片类型**

**WOW 卡（正分）**
- 给予或添加积分
- 例如："团队合作者" +1、"做得好" +3
- 以绿色显示

**NO NO 卡（负分）**
- 扣除积分
- 例如："太吵了" -1、"分心了" -2
- 以红色显示

---

#### **管理卡片**

**添加新卡片**
- 点击 **添加卡片** 按钮（右上角）
- 输入卡片名称
- 从贴纸选择器中选择表情符号（100+ 选项）
- 设置积分值
- 点击保存

**编辑卡片**
- 点击任何卡片上的铅笔图标
- 更改名称、表情符号或积分
- 使用贴纸选择器更改表情符号
- 点击保存

**删除卡片**
- 点击任何卡片上的垃圾桶图标
- 确认删除

---

#### **贴纸选择器**

编辑卡片时，点击表情符号图标打开贴纸选择器：

**类别：**
- 星星与奖励（⭐🏆🏅）
- 庆祝（🎉🎊🔥）
- 有趣角色（🤖👽🦄）
- 运动（⚽🏀🎾）
- 自然（☀️🌈🌳）
- 食物（🍎🍕🎂）
- 表情（😊😍😎）
- 动作（👍👏❤️）
- 学校与学习（📚💡🎓）
- 以及更多！

---

*使用"恢复默认值"恢复原始卡片集。*`
    },
    'whiteboard': {
      title: '白板',
      body: `### 绘制、书写和分享

白板是用于课堂活动的空白画布。

---

#### **绘图工具**（右侧）

| | |
|---|---|
| ✏️ 铅笔 | 在画布上自由绘制 |
| 🖍️ 荧光笔 | 半透明颜色覆盖 |
| 📝 文本 | 输入文本并按回车键放置 |
| 🧹 橡皮擦 | 删除绘图 |
| 😊 表情 | 将表情符号印到板上 |

---

#### **画布选项**

**颜色选择器**
- 10 种预设颜色可用
- 点击任何颜色进行选择

**线条/笔触大小**
- 调整线条的粗细
- 使用滑块或按钮

**字体选项**
- 字体系列：现代、趣味、优雅、打字机、粗体
- 大小：使文本更大或更小

**添加图片**
- 点击图片图标
- 从设备上传照片
- 根据需要调整大小和位置

---

#### **操作**

**导出 PNG**
- 点击以将白板下载为图像
- 保存到计算机上的任何位置
- 稍后与学生分享

**清除画布**
- 点击垃圾桶图标
- 擦除整个画布

---

*将白板用于数学题、图表、头脑风暴或任何视觉课程。*`
    },
    'parent-portal': {
      title: '家长门户',
      body: `### 查看孩子的进度

家长使用 5 位代码查看孩子的信息。

---

#### **登录**

1. 输入您的 5 位家长代码（来自孩子的老师）
2. 点击 **登录**

---

#### **您将看到**

- 孩子的当前积分总数
- 每日行为图表
- 行为细分（正分与需改进）
- AI 生成的教师反馈
- 出勤记录

---

#### **时间周期**

更改视图以查看以下数据：
- 本周
- 本月
- 本年

---

#### **语言**

在英语和中文之间切换以更改报告语言。

---

*您的访问是只读的。只有教师可以进行更改。*`
    },
    'student-portal': {
      title: '学生门户',
      body: `### 完成作业并获得积分

学生使用 5 位代码登录查看他们的作业。

---

#### **登录**

1. 输入您的 5 位学生代码（来自老师）
2. 点击 **登录**

---

#### **作业**

您将看到来自老师的所有作业：

**未完成**（首先显示）
- 从新到旧
- 这些在等待您
- 点击打开并完成

**已完成**（下方显示）
- 从新到旧
- 已完成
- 可以隐藏（点击隐藏按钮）

---

#### **完成作业**

1. 点击任何未完成的作业
2. 回答所有问题
3. 点击 **提交**
4. 您的工作发送给老师
5. 您很快就会收到成绩！

---

#### **您的统计**

页面顶部，您可以看到：
- **总积分** - 您获得的所有积分
- **已完成** - 已完成的作业数量
- **待办** - 等待您的作业

---

*如果老师刚刚发送了新作业，请刷新页面。*`
    },
    'inbox': {
      title: '消息与评分',
      body: `### 审阅和评分学生提交

---

#### **两个部分**

**待审阅**
- 这些是来自学生的新提交
- 点击任何提交查看答案
- 输入成绩并点击保存

**最近已评分**
- 这些是您已经评分的提交
- 点击查看您给出的内容
- 如需可以重新评分

---

#### **评分流程**

1. 点击待审阅列表中的提交
2. 在左侧面板查看学生答案
3. 在字段中输入积分/成绩
4. 点击 ✅ 图标保存
5. 积分添加到学生的总分
6. 提交移动到"最近已评分"

---

#### **重新评分**

如果您需要更改成绩：
- 再次点击提交
- 输入新成绩
- 点击保存
- 只添加/减去差额

---

#### **退出**

点击 **X** 或关闭按钮返回仪表盘。

---

*消息图标上的徽章显示有多少提交等待审阅。*`
    },
    'lesson-planner': {
      title: '课程计划',
      body: `### 规划您的课程

使用日历和模板创建和整理课程。

---

#### **入门**

**打开课程计划**
- 在教师门户中点击 **课程计划**（或日历图标）
- 您会看到月视图和已保存的模板

**月视图**
- 一览当月所有日期
- 点击某天添加或编辑课程
- 使用箭头切换月份

---

#### **模板**

**使用模板**
- 选择模板来安排您的一周或一天
- 填写科目和活动
- 保存以将计划应用到日历

**自定义**
- 为您的日程创建自定义模板
- 在周或月中重复使用

---

*课程计划会自动保存。*`
    },
    'games': {
      title: '课堂游戏',
      body: `### 课堂游戏

与班级一起玩趣味游戏： Tornado、记忆配对、测验等。

---

#### **打开游戏**

**从门户**
- 在教师门户点击 **游戏**（或游戏手柄图标）
- 从列表中选择游戏

**游戏类型**
- Tornado：转盘随机选择
- 记忆配对：翻牌配对
- 测验：选择题或简答题
- 其他：Face Off、赛车、拼写等

---

*游戏适合全班一起观看大屏幕。*`
    },
    'games-config': {
      title: '游戏配置',
      body: `### 设置游戏

在开始前配置游戏选项、图片和内容。

---

#### **配置位置**

**开始前**
- 许多游戏在开始前有设置界面
- 设置人数、时间、主题等

**Tornado / 转盘**
- 添加或编辑选项
- 上传自定义图片

**记忆配对**
- 选择或上传图片对
- 设置网格大小

**测验**
- 添加题目和正确答案
- 选择题型

---

*随时在开始游戏前更改设置。*`
    },
    'reports': {
      title: '报告',
      body: `### 查看学生进度与分析

此页面显示学生的详细报告和分析。

---

#### **时间段**

更改时间范围以查看数据：
- **周** - 最近 7 天
- **月** - 最近 30 天
- **年** - 最近 12 个月

---

#### **学生选择**

- 查看所有学生的报告或选择一名学生
- 使用下拉列表筛选特定学生
- 每个学生显示各自的报告卡片

---

#### **考试成绩**

跟踪和管理班级的考试成绩：

**添加考试成绩**
- 点击标题中的 **添加考试成绩**（➕）按钮
- 填写考试详情：名称、科目、日期
- 输入每个学生的分数
- 设置基准分数（例如：100 分）
- 选择评分模式：
  - **简略** - 仅总分
  - **详细** - 按部分细分（阅读、写作等）
- 点击 **保存考试** 存储数据

**查看考试成绩**
- 考试成绩显示在每个学生的报告卡片中
- 显示考试名称、科目、日期和分数
- 根据基准计算百分比
- 图表显示随时间的考试成绩
- 详细考试显示部分细分

**数据自动保存**
- 考试成绩自动保存
- 刷新页面后数据仍然存在
- 所有考试数据为您的班级自动加载
- 无需重新输入任何内容

---

#### **报告卡片内容**

每个学生报告包括：

**学生信息**
- 姓名和 ID
- 头像或角色图片
- 获得的总积分

**AI 教师反馈**
- 自动生成的摘要
- 突出优势和需要改进的领域
- 基于行为模式
- 教师可编辑（点击编辑按钮）

**考试表现**
- 所有考试成绩列表
- 按科目表现
- 相对于基准的百分比分数
- 随时间的表现趋势
- 详细部分细分（如适用）

**行为分布图表**
- 所选时间段内的每日积分
- 显示积分趋势的柱状图
- 积极行为显示为绿色
- 需要改进的行为显示为红色

**行为比例**
- 显示积极与消极的环形图
- 行为类型的视觉分解
- 每个类别的确切计数

---

#### **编辑反馈**

教师可以自定义 AI 生成的反馈：
- 点击反馈旁边的 **编辑**
- 根据需要修改文本
- 点击 **保存** 保留您的更改
- 家长看到您编辑的版本

---

#### **导出选项**

**下载 PDF**
- 点击 PDF 按钮（右上角）
- 将报告下载为 PDF 文件
- 包含所有图表和数据
- 适合打印或分享

**打印**
- 点击打印按钮
- 打开打印对话框
- 直接打印到纸张或 PDF
- 针对 A4 纸优化

---

#### **语言**

在英语和中文之间切换，为双语家庭更改报告语言。

---

*报告帮助教师跟踪学生进度并与家长沟通。*`
    },
    'liveworksheet-config': {
      title: '📄 设置指南',
      body: `### 📄 实时工作表：设置指南

#### 1. 上传您的材料

**支持的格式：** 您可以上传 PDF 文件或 Microsoft Word (.docx) 文档。

**如何上传：** 将文件直接拖到上传区域，或点击"浏览"图标从计算机中选择文件。

**自动提取：** 上传后，工具将自动扫描文档并尝试提取文本并识别潜在问题。

---

#### 2. 审查和编辑问题

**问题列表：** 提取的问题将出现在列表中。如果工具识别出特定格式（如选择题），它将自动分类。

**手动调整：** 您可以编辑问题文本、添加或删除选项以及选择正确答案。

**问题类型：** 您可以使用下拉菜单更改任何问题的类型。选项包括：

**选择题：** 标准 A/B/C/D 格式。

**填空：** 学生输入缺失的单词。

**对错题：** 快速检查理解。

**匹配和排序：** 交互式拖放任务。

**阅读理解：** 最适合较长的故事，后面跟着几个问题。

---

#### 3. 添加新内容

如果提取遗漏了问题或您想添加更多问题，请点击列表底部的"➕ 添加问题"按钮从头开始创建新问题。`
    },
    'liveworksheet-game': {
      title: '🛠️ 如何管理',
      body: `### 🛠️ 如何管理您的工作表

#### 组织流程

**重新排序：** 使用每个问题卡上的向上和向下箭头来更改它们向学生显示的顺序。

**删除：** 使用垃圾桶图标删除任何不必要的文本或在提取过程中错误识别的问题。

---

#### 最终检查

在屏幕底部，工具会跟踪您的有效问题。一旦问题有提示、选项（如果需要）和指定的正确答案，就被认为是有效的。

只有在至少一个问题完全验证后，您才能分配工作表。

---

#### 完成作业

**立即播放：** 这会立即在"课堂模式"中启动工作表，用于在黑板上进行现场活动。

**分配：** 这会将工作表发送到您的学生门户，允许学生在自己的设备上完成。

---

#### 💡 数字工作表的教师提示

**清晰的文档效果最佳：** 为了获得最准确的提取，请尝试使用具有清晰标题和编号问题的文档。如果 PDF 只是图像（如页面照片），文本提取可能无法工作；确保 PDF 包含可选择的文本。

**使用"理解"模式进行脚手架：** 使用故事/理解类型时，保持文本段落简洁。数字阅读比纸质阅读更累，因此将较长的故事分成两个较小的工作表可以帮助保持学生的注意力。

**混合问题类型：** 为了防止"点击疲劳"，将工作表与不同类型混合。在几个"选择题"问题后跟一个"排序"或"分类"任务，以保持学生在不同交互风格中的认知参与。

**"填空"的力量：** 对于拼写和语法练习，使用"空白"类型。它迫使学生产生语言而不仅仅是识别它，使其成为对他们实际写作能力的更严格评估。

**即时反馈：** 由于此工具将工作表数字化，学生在实时播放时会立即获得答案反馈。使用"立即播放"模式在他们完成后一起浏览工作表，重点关注大多数学生犯错的问题。`
    },
    'tornado-game': {
      title: '🌪️ 如何玩',
      body: `### 🎮 如何玩

#### 目标
轮流翻转瓷砖以收集最多的分数。但要小心——找到龙卷风会把你所有的分数都吹走！

---

#### 轮流

寻找"🎯 轮到你了！🎯"徽章以查看轮到谁了。

学生或团队必须回答问题、阅读单词或从黑板上识别图片，然后才能选择瓷砖。

点击任何未揭示的瓷砖将其翻转并查看下面的内容。游戏将在翻转瓷砖后自动将回合传递给下一个玩家。

---

#### 卡片类型

**分数（+1 到 +10）：** 将标准分数添加到您的分数中。

**双倍（x2）：** 幸运发现！将卡片的隐藏值乘以 2。

**三倍（x3）：** 超级幸运发现！将卡片的隐藏值乘以 3。

**龙卷风（🌪️）：** 小心！如果您翻转这个，龙卷风动画会在屏幕上旋转，您的分数会降至正好 0。

---

#### 教师控制（手动调整）

学生给出了特别好的答案，还是您需要纠正错误？您可以随时通过点击玩家面板上的 + 或 - 按钮手动调整任何玩家的分数。

---

#### 赢得游戏

当黑板上的每个瓷砖都被翻转时，游戏结束。

得分最高的玩家或团队将以有趣的五彩纸屑庆祝活动加冕为获胜者！

在胜利屏幕上，您可以选择在再次玩之前立即向获胜的学生或团队奖励奖励班级积分（+1、+2、+3 或 +5）。`
    },
    'tornado-config': {
      title: '🌪️ 设置指南',
      body: `### 🌪️ 龙卷风游戏：设置指南

#### 1. 选择您的玩家

**个人模式：** 选择特定学生相互对战（最少 2 人，最多 4 人）。

**团队模式：** 将班级分成 2、3 或 4 个团队。游戏将自动将您选择的班级分成具有自己有趣团队颜色的组。

---

#### 2. 配置游戏板

**瓷砖数量：** 使用滑块选择黑板上将出现多少瓷砖，从快速的 10 瓷砖游戏到大规模的 40 瓷砖黑板。

**编号瓷砖：** 打开此选项以在卡片背面显示数字（非常适合让学生喊出他们想要的数字）。关闭它以显示星形图标。

**龙卷风计数：** 决定黑板有多危险！选择隐藏多少龙卷风卡（1 到 5），或选择"随机"以保持每个人的猜测。

---

#### 3. 添加您的课程内容

**上传图片：** 点击或拖放最多 20 个图像文件到上传框中。游戏将在黑板周围显示这些。

**输入单词：** 输入用逗号分隔的词汇单词（例如，苹果、猫、狗）并点击添加。这些将与您的图片一起框在游戏板周围，以在游戏过程中提示学生。

---

#### 4. 开始游戏
一旦您的玩家被选中并且您的内容已加载，屏幕底部的发光"开始游戏"按钮将解锁。`
    },
    'memorymatch-game': {
      title: '🎮 如何玩',
      body: `### 🎮 如何玩

#### 目标
找到并匹配隐藏在卡片后面的所有配对。游戏结束时匹配最多的玩家获胜！

---

#### 轮流

活跃玩家的分数面板将发光或脉冲，表示轮到他们了。

玩家点击两张卡片将它们翻转。

**如果它们匹配：** 卡片保持可见（或消失），玩家获得一分，并且他们可以再次进行。

**如果它们不匹配：** 卡片将短暂摇晃，然后翻转回来。然后回合传递给下一个玩家。

---

#### 赢得游戏

当所有配对都成功找到时，游戏结束。

冠军屏幕将出现五彩纸屑，突出显示获胜者。

教师奖励：从胜利屏幕，您可以立即向获胜者的数字档案奖励班级积分（+1、+2、+3 或 +5）。

---

#### 💡 记忆匹配的教师提示

**脚手架匹配（图像到单词）：** 对于年轻学习者或新词汇，使用图像到文本设置。这迫使学生将视觉概念与书面拼写联系起来，这在认知上更具挑战性（和回报）而不是简单的图像到图像匹配。

**"合唱响应"规则：** 为了在 1 对 1 匹配期间保持整个班级的参与，让整个班级在每次翻转卡片时大声说出单词。这确保即使不是当前玩的学生也在练习他们的发音。

**有意的记忆触发器：** 如果学生翻转卡片并错过匹配，请他们描述位置（例如，"'苹果'在哪里？左上角！"）。这鼓励使用位置语言（顶部、底部、左、右）以及课程词汇。

**调整难度：** 如果游戏进展太慢，您可以在设置中减少配对数量。对于高级学生，增加网格大小以测试他们的短期空间记忆和注意力。

**协作模式：** 虽然游戏跟踪个人分数，但您可以将其视为"班级对抗时钟"挑战。让学生一起工作，在两分钟内找到所有匹配以赢得小组奖励。`
    },
    'memorymatch-config': {
      title: '🧠 设置指南',
      body: `### 🧠 记忆匹配：设置指南

#### 1. 加载您的课程内容

**内容项：** 您可以通过两种方式添加词汇：

**文本：** 输入一个单词并点击添加。这将创建一个基于文本的卡片。

**图像：** 将图像拖放到上传区域。这些将显示为视觉卡片。

**创建配对：** 游戏会自动复制您的项目以创建配对，或者您可以混合匹配图像与其相应的单词以创建"图像到文本"挑战。

*（注意：您至少需要 2 个项目才能开始，但对于标准挑战，建议使用 6 到 12 个项目。）*

---

#### 2. 选择竞争者

**玩家选择：** 选择 1 到 4 个玩家。

**分配学生：** 从班级列表中选择学生。每个学生将被分配一个独特的颜色和屏幕顶部的专用分数跟踪器。

---

#### 3. 选择主题

选择背景颜色（天蓝色、淡绿色、浅粉色或鹿皮色）以设置会话的氛围。

---

#### 4. 启动黑板

一旦您的学生被选中并且内容准备就绪，点击"开始游戏"按钮生成网格。`
    },
    'quiz-game': {
      title: '🎮 如何玩',
      body: `### 🎮 如何玩

#### 目标
成为第一个在屏幕上点击正确答案的人。

---

#### 战斗屏幕

屏幕分为两个相同的侧面。问题和图像出现在中心供两个玩家查看。

当问题出现时，两个学生竞相在自己的一侧找到正确的选项。

---

#### 评分和结果

**正确答案：** 第一个点击正确选择的玩家获得分数。游戏将显示绿色复选标记并自动移动到下一个问题。

**错误答案：** 如果玩家点击错误的按钮，他们会被短暂锁定，给对手一个回答的机会。

---

#### 胜利和奖励

一旦所有问题完成，将显示最终分数。

**班级积分：** 您可以直接从奖杯屏幕立即向获胜者的数字档案奖励奖励积分（+1、+2、+3 或 +5）。

---

#### 💡 测验游戏的教师提示

**有效的干扰项：** 在教授语音时，使用看起来或听起来相似的选项（例如，问题："Ship" | 选项：Sheep、Ship、Chip、Shop）。这迫使学生仔细查看字素而不仅仅是猜测。

**仅图像提示：** 对于还不能很好阅读的年轻学习者，将"问题文本"留空并仅使用图像。口头提出问题，让他们竞相在选项中找到书面单词。

**"等待"规则：** 为了防止学生随机点击以"击败"另一个玩家，告诉班级如果学生点击错误答案，他们也必须在下一个问题中坐下。这鼓励准确性而不是纯粹的速度。

**复习模式：** 游戏结束后，使用"返回设置"按钮快速滚动浏览问题并复习学生挣扎的问题，在继续之前加强课程。`
    },
    'quiz-config': {
      title: '📝 设置指南',
      body: `### 📝 测验游戏：设置指南

#### 1. 构建您的问题

**问题文本：** 在文本框中输入您的问题或提示。

**添加图像：** 点击图像图标上传问题的图片。这非常适合"这是什么？"或"找到[颜色/形状]"任务。

**管理选项：** 每个问题从 2 个选项开始。点击"+ 添加"以添加最多 4 个选择（A、B、C 和 D）。

**设置答案：** 点击正确选择旁边的字母气泡（A、B、C 或 D）。它将变为绿色以显示它已保存为正确答案。

**添加更多：** 点击底部的"➕ 添加问题"以构建完整的测验。

---

#### 2. 选择参赛者

这是一场正面交锋的战斗！从班级列表中选择正好 2 名学生。

玩家 1 将被分配绿色，玩家 2 将被分配粉红色。

---

#### 3. 验证检查

只有在所有问题都有文本和选定的正确答案后，"播放"按钮才会解锁。如果问题不完整，游戏将突出显示它以供您修复。`
    },
    'faceoff-game': {
      title: '🎮 如何玩',
      body: `### 🎮 如何玩

#### 目标
成为最快将中心的单词与屏幕上正确图像匹配的人。

---

#### 游戏屏幕

屏幕分为两半（每个玩家一半）。

目标单词（或图像，取决于模式）将出现在屏幕的正中心。

几个不同的图像将出现在顶部和底部玩家区域。

---

#### 如何得分

两个玩家都看着中心目标并竞相在自己的一侧找到匹配的图像。

**点击/点击正确的图像：** 如果您是对的，您将赢得这一轮并获得一分！

**小心：** 如果您点击错误的图像，您将被锁定一会儿，而您的对手有机会找到正确的答案。

---

#### 赢得游戏

游戏将持续您在设置期间选择的回合数。

在最后一轮之后，得分最高的玩家将以五彩纸屑庆祝活动宣布为获胜者。

教师奖励：就像其他游戏一样，您可以在返回门户之前直接从胜利屏幕向获胜者奖励奖励班级积分。

---

#### 📱 移动与桌面

**桌面版本：** 最好在智能板或大屏幕上播放，两个学生可以站在两侧。

**移动版本：** 专为平板电脑或手机设计，允许两个学生坐在彼此对面并在平放在桌子上的单个设备上玩。`
    },
    'faceoff-config': {
      title: '⚔️ 设置指南',
      body: `### ⚔️ 对决：设置指南

#### 1. 创建您的单词-图像对

此游戏使用单词和图像对。您有两种添加方式：

**批量上传：** 将一组图像拖放到上传框中。游戏将自动使用文件名作为每个图像的单词！

**手动输入：** 点击"➕ 添加单词-图像对"以添加单个插槽。输入单词并点击图像图标为其上传特定图片。

*（注意：您至少需要 5 对才能开始游戏。）*

---

#### 2. 选择您的回合

使用回合滑块决定学生将玩多少场比赛（从 5 到 20 回合）。

---

#### 3. 选择您的竞争者

对决是一场正面交锋的战斗！从班级列表中选择正好 2 名学生。

一名学生将被分配绿色一侧，另一名学生将被分配蓝色一侧。

---

#### 4. 开始战斗

一旦您选择了 2 名学生并准备好至少 5 对，红色的"开始游戏"按钮将激活。`
    },
    'motorace-game': {
      title: '🏁 如何玩',
      body: `### 🏁 如何玩

#### 目标
成为第一个越过方格旗终点线的摩托车！赛道会根据您在设置期间添加的单词或图像数量自动分成步骤。

---

#### 显示问题

随时点击屏幕顶部的"🖼️ 幻灯片"按钮。

这会打开您当前单词或图片的大型全屏视图，供全班查看。

使用左右箭头在比赛进行时浏览您的课程材料。

---

#### 移动摩托车

您是比赛总监！您根据学生的答案控制自行车：

**向前移动（加速！）：** 学生答对了吗？单击（或点击）他们的摩托车。您会听到引擎轰鸣，因为他们翘起前轮并向前冲一个空间。

**向后移动（打滑！）：** 有人犯了错误，还是您需要发出惩罚？右键单击（或双击）他们的摩托车使他们向后打滑一个空间。

---

#### 赢得比赛

第一个到达最后一步的玩家越过终点线并获胜！

游戏将立即暂停并带来一个巨大的冠军庆祝屏幕，完整的五彩纸屑下降。

在胜利屏幕上，您可以点击在退出比赛之前立即向获胜学生奖励奖励班级积分（+1、+2、+3 或 +5）。`
    },
    'motorace-config': {
      title: '🏍️ 设置指南',
      body: `### 🏍️ 摩托车比赛游戏：设置指南

#### 1. 选择您的内容类型

在顶部查找文本/图像切换。

**文本模式：** 非常适合拼写、阅读或词汇。将您的单词输入框中（用逗号分隔）并点击添加。

**图像模式：** 非常适合视觉识别。点击上传区域或拖放您的图片文件以将它们添加到游戏中。

*（注意：您需要添加至少 2 个单词或图像才能解锁开始按钮！）*

---

#### 2. 选择您的赛车手

**玩家数量：** 选择您想要 2、3 还是 4 人比赛。

**选择学生：** 从班级列表中点击学生的姓名以为他们分配一辆彩色摩托车。您必须选择与上一步中选择的玩家数量完全相同的学生。

---

#### 3. 启动您的引擎
一旦您的内容加载并且您的赛车手被选中，底部的橙色"开始游戏"按钮将发光。点击它前往起跑线！`
    },
    'horserace-game': {
      title: '🏁 如何玩',
      body: `### 🏁 如何玩

#### 目标
成为第一匹从屏幕底部冲到顶部终点线的马！

---

#### 使用幻灯片教学

点击顶部的"🖼️ 幻灯片"按钮以大而清晰的格式向全班展示当前单词或图像。

使用屏幕上的箭头在学生轮流时循环浏览您的词汇。

---

#### 控制马匹
教师充当裁判并根据学生表现移动马匹：

**向前移动（疾驰！）：** 如果学生回答正确，单击（或点击）他们的马。他们将以疾驰的声音向终点线移动一步。

**向后移动（绊倒）：** 如果学生需要纠正或"重做"，右键单击（或双击）他们的马将他们向后移动一步。

---

#### 获胜者圈

第一匹到达赛道顶部的马获胜。

游戏将自动触发五彩纸屑庆祝活动并显示获胜者。

您可以直接从胜利屏幕立即向获胜者的档案奖励奖励班级积分（+1、+2、+3 或 +5）。

---

#### 💡 赛马的教师提示

**"10 项"规则：** 如果您只有 5 个词汇单词但想要更长的比赛，请输入每个单词两次。这通过重复加强记忆并确保比赛不会太快结束。

**语音练习：** 这个游戏非常适合"最小对"（听起来相似的单词，如 ship/sheep）。使用幻灯片在它们之间快速切换，看看学生是否能发现差异。

**管理能量：** 因为马匹垂直移动并且竞争是可见的，学生可能会变得很吵！使用右键单击（向后移动）机制作为对轮流喊出答案的学生的温和"惩罚"，鼓励更好的课堂纪律。

**动态节奏：** 如果一个学生遥遥领先，您可以将问题集中在落后的学生身上，以保持比赛"势均力敌"，这在整个班级中保持高度参与，直到最后。`
    },
    'horserace-config': {
      title: '🐎 设置指南',
      body: `### 🐎 赛马：设置指南

#### 1. 准备您的比赛内容

**最低要求：** 您需要添加至少 10 个项目（单词或图像）才能开始比赛。赛道长度由您提供的项目数量决定。

**文本模式：** 输入用逗号或新行分隔的单词（例如，cat、bat、hat）并点击添加。

**图像模式：** 将图片直接拖放到上传框中。

*（注意：当您希望学生采取的每个"步骤"都有一个项目时，游戏效果最佳。）*

---

#### 2. 选择您的骑师

**玩家数量：** 选择您想要 2、3 还是 4 匹马比赛。

**分配学生：** 从班级列表中点击学生姓名以将他们分配到彩色车道。您必须选择与玩家数量完全匹配的学生数量。

---

#### 3. 前往赛道

一旦您拥有至少 10 个项目并且您的学生被选中，金色的"开始游戏"按钮将解锁。`
    },
    'spelltheword-game': {
      title: '🎮 如何玩',
      body: `### 🎮 如何玩

#### 目标
查看提供的图像并尽可能快地按正确顺序点击乱序字母以拼写单词。

---

#### 拼写单词

图像出现在屏幕中央。

图像下方提供乱序字母瓷砖。

**拼写：** 按正确顺序点击或点击字母。

**正确的字母：** 字母以令人满意的"弹出"动画飞入单词槽。

**错误的字母：** 屏幕将短暂摇晃，让学生知道尝试不同的字母。

**跳过：** 如果学生真的卡住了，他们可以点击"跳过"按钮移动到下一个单词（跳过的单词不会获得分数）。

---

#### 赢得游戏

游戏将持续到列表中的所有单词都被拼写完毕。

最后拼写正确单词最多的玩家赢得这一轮。

**班级积分：** 就像您的其他游戏一样，您可以直接从最终胜利屏幕向获胜者奖励奖励班级积分（+1、+2、+3 或 +5）。

---

#### 💡 拼写单词的教师提示

**"清洁文件名"技巧：** 在批量上传图像之前，花一秒钟在计算机上重命名它们。如果您希望学生拼写"octopus"，请确保文件不是名为"DSC10293.jpg"。这可以避免您在设置屏幕中手动编辑每个单词！

**脚手架难度：** 对于初学者，从 3 字母 CVC 单词（cat、dog、bat）开始。随着他们的进步，转向带有"无声 e"或"双字母组合"（sh、ch、th）的单词。因为游戏为他们提供了字母，所以这是练习困难拼写的一种很好的"低风险"方式。

**合唱拼写：** 当两个学生在黑板上比赛时，鼓励班级其他人在完成后一起大声拼写单词。这为每个人加强了字母到声音的连接，而不仅仅是玩家。

**专注于音素：** 如果学生卡住了，不要告诉他们字母（例如，"按 P"），而是给他们声音（例如，"'Map'中的最后一个声音是什么？/p/"）。这有助于他们使用语音知识找到正确的瓷砖。`
    },
    'spelltheword-config': {
      title: '🔠 设置指南',
      body: `### 🔠 拼写单词：设置指南

#### 1. 构建您的单词列表

**最低要求：** 您必须添加至少 5 个单词才能开始游戏。

**批量图像上传：** 这是设置的最快方式。将一组图像拖放到上传框中。游戏将自动获取图像的文件名并将它们转换为目标单词（例如，名为"apple.png"的图像变成单词"apple"）。

**手动输入：** 使用"单词"选项卡逐个输入特定单词并上传匹配的图像。

**文本处理：** 如果您的文件名有破折号或下划线（如"ice-cream"），游戏将自动将它们清理为正确的单词。

---

#### 2. 选择挑战模式

**1 人模式：** 非常适合个人练习或让一个学生来到黑板，而班级帮助他们。

**2 人模式：** 正面交锋的拼写比赛！从班级列表中选择 2 名学生进行竞争。玩家 1 被分配绿色，玩家 2 被分配粉红色。

---

#### 3. 启动拼写比赛

一旦您准备好单词和玩家，紫色的"开始游戏"按钮将激活。`
    }
  },

  es: guideEs,
  fr: guideFr,
};

/** Get help entry for a page (with fallback to en and inbox alias). */
export function getHelpEntry(guides, lang, pageId) {
  let entry = (guides[lang] && guides[lang][pageId]) || (guides.en && guides.en[pageId]);
  if (!entry && pageId === 'inbox') {
    entry = (guides[lang] && guides[lang]['Messages & Grading']) || (guides.en && guides.en['Messages & Grading']);
  }
  return entry || { title: 'Help', body: 'No help available for this page.' };
}

/** Strip ** from heading text for display and suggestions. */
function stripBold(s) {
  return (s || '').replace(/\*\*/g, '').trim();
}

/** Normalize help body so ** in headings don't show as literal asterisks. */
export function normalizeHelpBody(body) {
  if (!body) return '';
  let out = body
    .replace(/^(#{3,4}\s*)\*\*([^*]*)\*\*/gm, '$1$2');
  return out;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'i', 'me', 'my', 'we', 'you', 'your', 'our', 'it', 'is', 'are', 'am',
  'to', 'for', 'from', 'of', 'in', 'on', 'at', 'with', 'by', 'as', 'and', 'or', 'but',
  'what', 'how', 'where', 'when', 'why', 'can', 'do', 'does', 'did', 'need', 'want',
  'please', 'about', 'this', 'that', 'these', 'those', 'be', 'been', 'was', 'were',
  'if', 'then', 'than', 'into', 'out', 'up', 'down'
]);

const SYNONYM_MAP = {
  remove: ['delete', 'erase'],
  delete: ['remove', 'erase'],
  erase: ['delete', 'remove'],
  student: ['students', 'kid', 'learner', 'pupil'],
  students: ['student'],
  class: ['classes', 'classroom'],
  classes: ['class'],
  grade: ['grading', 'score', 'mark'],
  grading: ['grade'],
  score: ['points', 'grade'],
  points: ['score', 'point'],
  reward: ['points'],
  absent: ['attendance'],
  attendance: ['absent', 'present'],
  code: ['codes', 'qr', 'login'],
  codes: ['code'],
  qr: ['code'],
  settings: ['cards', 'point'],
  card: ['cards', 'point'],
  cards: ['card', 'settings'],
  sort: ['order'],
  order: ['sort', 'reorder'],
  reorder: ['order', 'sort'],
  size: ['display', 'compact', 'regular', 'spacious'],
  compact: ['size', 'display'],
  regular: ['size', 'display'],
  spacious: ['size', 'display'],
  fullscreen: ['full', 'screen'],
  dock: ['toolbar', 'sidebar', 'navigation'],
  sidebar: ['dock', 'navigation'],
  rail: ['class', 'list', 'sidebar']
};

function normalizeText(input) {
  return (input || '')
    .toLowerCase()
    .replace(/[`*_#>|[\]{}()]/g, ' ')
    .replace(/[.,!?;:/\\'"“”‘’+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stemToken(token) {
  if (!token) return token;
  if (token.length > 5 && token.endsWith('ing')) return token.slice(0, -3);
  if (token.length > 4 && token.endsWith('ed')) return token.slice(0, -2);
  if (token.length > 4 && token.endsWith('es')) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith('s')) return token.slice(0, -1);
  return token;
}

function tokenize(input) {
  const normalized = normalizeText(input);
  if (!normalized) return [];
  return normalized
    .split(' ')
    .map(stemToken)
    .filter(Boolean)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function expandTokens(tokens) {
  const out = new Set(tokens);
  for (const token of tokens) {
    const synonyms = SYNONYM_MAP[token];
    if (synonyms) {
      for (const s of synonyms) out.add(stemToken(s));
    }
  }
  return Array.from(out);
}

/** Parse entry body into sections (by ### or #### headings). Each section has { title, body } with title stripped of **. */
export function parseSections(entry) {
  if (!entry || !entry.body) return [];
  const sections = [];
  const re = /^(#{3,4})\s+(.+)$/gm;
  let lastHeadingEnd = 0;
  let m;
  let lastTitle = null;
  while ((m = re.exec(entry.body)) !== null) {
    const rawTitle = m[2];
    const title = stripBold(rawTitle);
    const thisHeadingEnd = m.index + m[0].length;
    if (lastTitle !== null) {
      const body = entry.body.slice(lastHeadingEnd, m.index).replace(/^\s+|\s+$/g, '');
      sections.push({ title: lastTitle, body: body || '(No content)' });
    }
    lastTitle = title;
    lastHeadingEnd = thisHeadingEnd;
  }
  if (lastTitle !== null) {
    const body = entry.body.slice(lastHeadingEnd).replace(/^\s+|\s+$/g, '');
    sections.push({ title: lastTitle, body: body || '(No content)' });
  }
  return sections;
}

/** Extract suggested questions (section titles, no **). */
export function getSuggestedQuestions(entry) {
  const sections = parseSections(entry);
  return sections.map(s => s.title).slice(0, 12);
}

/** Find the best matching section for a question (keyword overlap). Returns { title, body } or null. */
export function getMatchingSection(entry, question) {
  if (!entry || typeof entry !== 'object') return null;
  const sections = parseSections(entry);
  if (!sections.length) return null;

  const rawQuestion = normalizeText(question || '');
  if (!rawQuestion) return null;

  const queryTokens = expandTokens(tokenize(rawQuestion));
  if (!queryTokens.length) return null;

  const normalizedSections = sections.map((section) => ({
    title: section.title,
    body: section.body,
    titleLower: normalizeText(section.title),
    bodyLower: normalizeText(section.body)
  }));

  const intents = {
    asksDeleteStudent:
      (rawQuestion.includes('delete') || rawQuestion.includes('remove') || rawQuestion.includes('erase')) &&
      (rawQuestion.includes('student') || rawQuestion.includes('students')),
    asksAddStudent:
      (rawQuestion.includes('add') || rawQuestion.includes('create')) &&
      (rawQuestion.includes('student') || rawQuestion.includes('students')),
    asksClassMgmt:
      rawQuestion.includes('class') &&
      (rawQuestion.includes('edit') || rawQuestion.includes('delete') || rawQuestion.includes('add') || rawQuestion.includes('create'))
  };

  let best = null;
  let bestScore = -1;

  for (const section of normalizedSections) {
    const text = section.titleLower + ' ' + section.bodyLower;
    const titleTokens = new Set(tokenize(section.titleLower));
    const bodyTokens = new Set(tokenize(section.bodyLower));
    let score = 0;
    let hits = 0;

    if (section.titleLower === rawQuestion || rawQuestion === section.titleLower) score += 120;
    if (section.titleLower.includes(rawQuestion) || rawQuestion.includes(section.titleLower)) score += 40;

    for (const token of queryTokens) {
      const inTitle = section.titleLower.includes(token) || titleTokens.has(token);
      const inBody = section.bodyLower.includes(token) || bodyTokens.has(token);
      if (inTitle) {
        score += 10;
        hits += 1;
      }
      if (inBody) {
        score += 4;
        hits += 1;
      }
    }

    const hitRatio = hits / Math.max(queryTokens.length, 1);
    score += Math.round(hitRatio * 20);

    for (let i = 0; i < queryTokens.length - 1; i += 1) {
      const phrase = `${queryTokens[i]} ${queryTokens[i + 1]}`;
      if (phrase.length > 3 && text.includes(phrase)) score += 6;
    }

    if (intents.asksDeleteStudent) {
      if (section.titleLower.includes('student management')) score += 36;
      if (text.includes('delete') && text.includes('student')) score += 20;
    }
    if (intents.asksAddStudent) {
      if (section.titleLower.includes('student management')) score += 28;
      if (text.includes('add') && text.includes('student')) score += 18;
    }
    if (intents.asksClassMgmt) {
      if (section.titleLower.includes('class rail') || section.titleLower.includes('add / edit / delete a class')) score += 24;
    }

    if (score > bestScore) {
      bestScore = score;
      best = { title: section.title, body: section.body };
    }
  }
  return bestScore >= 8 ? best : null;
}

export default HELP_GUIDES;
