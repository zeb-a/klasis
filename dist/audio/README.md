# Audio Clips for Behavior Cards

This document lists all the audio clips that should be added to the `/public/audio/` directory for the behavior card sound effects feature.

## How to Add Audio Files

1. Download the audio files from sources like myinstants.com or similar safe, school-appropriate audio sites
2. Ensure all files are under 3 seconds in duration
3. Save them to `/workspace/public/audio/` directory
4. Files should be in MP3 format for best browser compatibility

## Audio Clips List

### Positive / Reward Sounds

| ID | Name | File Name | Emoji | Source Suggestion |
|----|------|-----------|-------|-------------------|
| amazing | Amazing! | amazing.mp3 | 🌟 | Search "amazing sound effect" |
| awesome | Awesome! | awesome.mp3 | ⚡ | Search "awesome sound effect" |
| rockstar | Rockstar! | rockstar.mp3 | 🎸 | Search "rockstar sound" |
| superstar | Superstar! | superstar.mp3 | 👑 | Search "superstar sound" |
| excellent | Excellent! | excellent.mp3 | ✨ | Search "excellent sound" |
| bravo | Bravo! | bravo.mp3 | 👏 | Search "bravo applause" |
| fantastic | Fantastic! | fantastic.mp3 | 🎉 | Search "fantastic sound" |
| goodjob | Good Job! | goodjob.mp3 | 👍 | Search "good job sound" |
| wellplayed | Well Played! | wellplayed.mp3 | 🏆 | Search "well done sound" |
| winner | Winner! | winner.mp3 | 🥇 | Search "winner fanfare" |
| yes | Yes! | yes.mp3 | ✅ | Search "yes sound effect" |
| ding | Ding! | ding.mp3 | 🔔 | Search "ding sound" |
| chime | Chime | chime.mp3 | 🎵 | Search "chime sound" |
| cheer | Cheer! | cheer.mp3 | 📣 | Search "cheer sound" |
| yay | Yay! | yay.mp3 | 🎊 | Search "yay sound" |
| woohoo | Woohoo! | woohoo.mp3 | 🙌 | Search "woohoo sound" |
| highfive | High Five! | highfive.mp3 | ✋ | Search "celebration sound" |
| applause | Applause | applause.mp3 | 👏 | Search "applause sound" |
| perfect | Perfect! | perfect.mp3 | 💯 | Search "perfect sound" |

### Chinese Positive Sounds (Chinese schools)

| ID | Name | File Name | Emoji | Description |
|----|------|-----------|-------|-------------|
| hao | 好! | hao.mp3 | 👍 | Chinese for "Good!" |
| bang | 棒! | bang.mp3 | 💪 | Chinese for "Great!" |
| zhenbang | 真棒! | zhenbang.mp3 | ⭐ | Chinese for "Really great!" |
| ganhao | 干得好! | ganhao.mp3 | 🏆 | Chinese for "Well done!" |
| jiayou | 加油! | jiayou.mp3 | 💪 | Chinese for "Keep going!" |
| youyi | 优异! | youyi.mp3 | 🌟 | Chinese for "Excellent!" |

### Correction / Gentle Reminders (Negative)

| ID | Name | File Name | Emoji | Source Suggestion |
|----|------|-----------|-------|-------------------|
| tryagain | Try Again | try_again.mp3 | 🔄 | Search "try again sound" |
| oops | Oops | oops.mp3 | 😅 | Search "oops sound" |
| hmm | Hmm | hmm.mp3 | 🤔 | Search "hmm sound" |
| payattention | Pay Attention | payattention.mp3 | 👀 | Search "attention sound" |
| notyet | Not Yet | notyet.mp3 | ⏳ | Search "not yet sound" |
| thinkagain | Think Again | thinkagain.mp3 | 🧠 | Search "think again sound" |
| frowny | Frowny | cry.mp3 | 😔 | Search "sad sound" |
| buzzer | Buzzer | buzzer.mp3 | 🔔 | Search "buzzer sound" |
| uhoh | Uh-oh | uhoh.mp3 | 😬 | Search "uh oh sound" |
| careful | Be Careful | careful.mp3 | ⚠️ | Search "warning sound" |

### Chinese Correction Sounds

| ID | Name | File Name | Emoji | Description |
|----|------|-----------|-------|-------------|
| zhuqi | 注意! | zhuqi.mp3 | 👀 | Chinese for "Pay attention!" |
| zaizai | 再再 | zaizai.mp3 | 🔄 | Chinese for "Try again" |
| xinxin | 细心 | xinxin.mp3 | 🧐 | Chinese for "Be careful" |

### Fun / Funny Sounds

| ID | Name | File Name | Emoji | Source Suggestion |
|----|------|-----------|-------|-------------------|
| boing | Boing! | boing.mp3 | 🌀 | Search "boing sound" |
| pop | Pop! | pop.mp3 | 💥 | Search "pop sound" |
| slide | Slide! | slide.mp3 | 🎢 | Search "slide whistle" |
| whoosh | Whoosh! | whoosh.mp3 | 💨 | Search "whoosh sound" |
| magic | Magic! | magic.mp3 | 🪄 | Search "magic sound" |
| sparkle | Sparkle! | sparkle_sound.mp3 | ✨ | Search "sparkle sound" |
| tada | Tada! | tada.mp3 | 🎺 | Search "tada sound" |
| laugh | Laugh! | laugh.mp3 | 😄 | Search "laugh sound" |
| giggle | Giggle | giggle.mp3 | 😊 | Search "giggle sound" |
| snort | Snort | snort.mp3 | 🤭 | Search "snort sound" |

## Audio Sources

### Recommended Safe Sources:
- **myinstants.com** - Search for the sound names above
- **freesound.org** - Check for CC0 licensed sounds
- **zapsplat.com** - Free sound effects for education
- **mixkit.co** - Free sound effects

### Content Guidelines:
- All sounds must be under 3 seconds
- Appropriate for school/classroom environment
- No offensive language or content
- Low file size (preferably under 500KB per file)

## File Format Specifications
- **Format**: MP3
- **Bitrate**: 128-192 kbps
- **Sample Rate**: 44.1 kHz
- **Duration**: < 3 seconds
- **Size**: < 500 KB

## Testing Audio Files

After adding audio files to `/public/audio/`, test them in the Settings page:
1. Go to Settings > Edit Point Cards
2. Add or Edit a card
3. Click "Choose Sound Effect..."
4. Preview sounds by clicking the speaker icon
5. Select a sound and save the card

## Notes
- Audio files are optional - cards can work without them
- Existing audio files like `amazing.mp3`, `awesome.mp3` are already in use
- The UI shows a placeholder "Custom Sound" if a file doesn't match our predefined list
