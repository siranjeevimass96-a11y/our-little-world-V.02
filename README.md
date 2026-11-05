# Sunshine’s Journey to Her Kingdom — Saved Progress Edition

For Neha / Sunshine, turning 25 on 16 November 2026. Original photographs, wishes, letter, games and personal content are retained.

## Start on Windows

1. Right-click the ZIP and choose **Extract All**. Wait until extraction finishes.
2. Open the extracted `sunshine-kingdom` folder.
3. Double-click **Start-Website-Windows.bat**. Node.js 22 or newer must be installed.
4. Visit **http://localhost:4173**. Refresh if the browser opens before the server starts.
5. Keep the command window open while using the website.

The finished website is included in `dist`. Starting it does **not** require npm install or any video downloads. Do not open `dist/index.html` by double-clicking it; use the launcher or `npm start`.

## What is included

- **47 connected MP4 scenes:** 33 journey scenes and D01–D14.
- Speaking scenes for Lumi, Rosie, Selene, Ember, Aster and Clover before their games.
- Royal welcome, carpet walk, throne seating and coronation.
- Lumi’s secret → Siran’s entrance → Siran presents the cake → Sunshine’s reaction → friends gather → Lumi’s wish → Rosie’s message.
- **Make a wish**, then hold a gentle breath to extinguish the candles one by one, or choose individual flames. A short pause lets the smoke settle before D12 and the birthday celebration. The skip option remains available.
- 10 chapters, all original companions, 41 photos, 25 wishes, the personal letter and downloadable keepsake.
- Separate **Voice**, **Music**, **Captions**, and **Reduce motion** controls; pause, replay, next scene and skip.

D13 and D14 are the exact approved uploaded files: no edits or regeneration. Other clips use 1080p web copies with their original audio retained. The landscape videos are shown in full on phones rather than cropped into portrait. Rotate your phone for a larger movie view.

**Captions are short story descriptions, not verified verbatim dialogue transcripts.** Voice switches the videos’ complete original soundtrack on/off, including any sound effects or music already inside the clip. Background music is a separate control. Browser autoplay rules may require tapping **Play** for sound. Reduced motion prevents automatic film playback.

## The unhurried experience

- Gentle pace plays story clips at 0.85× and dialogue at 0.95×, preserving voice pitch. Original pace is one click away. The video files themselves are unchanged.
- A 1.1-second cross dissolve overlaps playing videos before the outgoing clip ends. The next clip preloads automatically. Adjacent film phases and new-chapter arrivals retain the incoming player and playback position.
- No timed holds or text handoff screen. A small gold star stays visible over the movies; page handoffs reveal the next page immediately, with no center-screen star.
- Dissolve progress follows media playback, so pause/resume and slow browser frames do not leave a stuck transition. Browser buffering and autoplay restrictions can still require waiting or pressing Play.
- Completed games remain visible briefly so their final glow and growth can be enjoyed.
- Background music fades between volumes instead of jumping. Hidden tabs and dialogs pause active play.
- Garden care saves between visits. The rose uses a rounded, layered-petal WebGL model with a shallow flower center, curved stem, and veined leaves. A matching botanical vector illustration appears when WebGL is unavailable.
- Reduced motion, keyboard alternatives, companion assistance and skip controls remain available.

## Continue where you left off

The website automatically reopens at the last saved section. Completed games reopen on their completed screen; unfinished games retain their saved progress. The final ending also stays completed. Completion is saved immediately, before any reward-film delay, and a backup copy can recover a damaged primary save. Existing version-3 progress is retained.

Use the **same browser profile and the same website address** each time. With the Windows launcher, keep using **http://localhost:4173**. A different browser, device, port, or address has separate storage. Private browsing, cleared website data, or blocked storage can prevent progress from surviving. Progress is stored in the browser, not inside the ZIP; there is no cross-device synchronization. A video interrupted mid-clip restarts that cinematic section rather than restoring its exact playback time.

Only **Journey → Start a fresh journey → Reset and begin again** deliberately clears the saved journey. Updating the website files does not erase browser progress.

## The journey

| Chapter | Interaction |
|---|---|
| Whispering Forest | Guide fireflies into a lantern by dragging or selecting and placing |
| Woodland Crossing | Watch and repeat three progressively longer glowing stone patterns |
| Garden of Memories | Drag or swap photo pieces with smooth movement and a short peek |
| Crystal Lake | Draw a continuous glowing constellation or connect stars individually |
| Lantern Valley | Navigate around wind and hold a steady flame beside each lantern |
| Dragon’s Hill | Smooth basket steering, catch particles, streak bonuses and a golden-heart wave |
| Royal Gardens | Plant, nourish three root zones, align sunlight and pull weeds before a gradual bloom |
| Palace Gates | Drag keepsakes, rotate rings toward their guiding stars and slide the key |
| Queen’s Welcome | Coronation, Siran’s cake surprise, wish and birthday celebration |
| Letter for the Queen | Open the personal letter and download a keepsake |

Games retain their hint, help and skip options. The journey saves in the same browser. The new wish and candle progress also survives refresh. A film restarts from the beginning after refresh; its playback position is not saved. An existing saved journey can revisit Chapter 9 from **Journey** and choose **Replay your cake surprise**. Choose **Journey → Start a fresh journey** to see everything from the beginning.

## Edit the website

With Node installed, open a terminal in `sunshine-kingdom`:

```sh
npm ci
npm run dev
```

Use the URL printed by Vite. For a phone on the same Wi-Fi, use the computer’s network address and the displayed port. `npm start` also listens on the local network at port 4173.

To check and rebuild:

```sh
npm test
npm run check:assets
npm run build
```

The ZIP stores MP4 files **once**, under `dist/cinematics`, to avoid duplicating hundreds of megabytes. Before development, tests or a rebuild, the npm scripts automatically copy them into `public/cinematics`. Keep `dist` until this restoration has run. If using tools directly, first run `node scripts/restore-source-videos.mjs`.

Upload the complete contents of `dist` to a static host when you are ready. This ZIP update does not publish the website.

## Editable content and records

- `src/content.js`: personal content, original letter and preferences.
- `src/story.js`: chapters, companions, wishes and photo definitions.
- `src/CakeSurprise.jsx`: cake interaction and Siran’s dedication.
- `public/cinematics/manifest.json`: clip order, story captions and media paths.
- `production/INCLUDED-VIDEOS.json`: exact source-to-website mapping and SHA-256 checksums for all 47 included clips.
- Other files in `production` are the earlier planning pack; the manifest and included-video inventory describe this edition.

The unnamed forest-arrival and garden-departure clips were matched visually. The later gate-opening and birthday-celebration variants are used. Unused alternate takes and the personal ME.mp4 reference are not bundled.

## Verification

Production build, 37 automated checks and asset validation passed. All 47 videos, 41 gallery photographs and the personal content file match the previous video edition byte for byte. Both archives pass ZIP integrity checks.

Browser checks during development covered the garden from seed through watering, sunlight, weed removal and bloom; bridge memory rounds; firefly collection; photo swapping; constellation completion; lantern navigation and warming; heart catching and pause; gate locks; and candle blowing. The full site was inspected at desktop and a 390-pixel iframe viewport, including its game-to-reward transition. The browser lacked WebGL, so the illustrated rose path was tested; hardware WebGL rendering and real phone performance remain device checks. Video playback, pace, within-playlist dissolves, uninterrupted player reuse across a chapter boundary, automatic exit into gameplay, pause and replay were checked. Subjective audio quality was not assessed.

## Optional small update ZIP

Sunshine-Kingdom-Saved-Progress-Update.zip requires the previously downloaded **47-video edition**. Extract it beside the existing sunshine-kingdom folder and allow matching files to be replaced. It updates the code and compiled app while keeping the existing videos, photos and audio. Restart the launcher and refresh the browser. If you do not already have that edition, use the full ZIP.

## Flower and transition update

The center-screen transition star is removed. Video crossfades remain unchanged. The Grow Flower rose has rounded, overlapping pink petals, a recessed center, curved stem and veined green leaves. It still supports all care stages and drag rotation, with a matching SVG fallback. Stationary flowers no longer redraw continuously.

Checked with all 37 existing tests, a production build and asset validation. Browser checks covered the full garden flow, WebGL rendering with software graphics, rotation, a 390-pixel viewport and the SVG fallback. Physical phone/GPU testing was not performed.

## Melody and wishes update — 29 October 2026 (3.2.3)

- **Echo the melody:** press **Play the melody** to unlock browser audio and hear the three bell notes in sync with the stones. Your stone taps play the matching notes. Replay, a melody-only sound switch, and **Watch without sound** are available. Background music and video voices keep their separate controls.
- **25 Wishes:** read any number, including zero. **Continue to your coronation / birthday surprise / Wisp’s letter** appears above the tree, at the chapter footer, and inside the wish dialogs. It takes you to the appropriate next story scene. Wish 25 no longer loops back to wish 1; wishes remain available through Journey.
- The last chapter now has a clearly labelled **Watch the kingdom ending** button. **Read your letter again** on the ending opens the letter.
- Moving on immediately after a game completes no longer depends on waiting for the reward timer. Existing saved chapters, wishes, and photo choices are retained.

Extract this full ZIP into a fresh folder. Close the previous server, then run **Start-Website-Windows.bat** in the extracted `sunshine-kingdom` folder. Keep the same browser and `http://localhost:4173` address to retain your progress. Refresh with **Ctrl+F5** if the old buttons are still visible. No npm install is needed to run the included build.

Current verification: 40 automated tests pass; production build and all asset checks pass. Browser checks cover a ten-chapter journey using game skip/help paths and all three melody rounds, coronation, cake candles, leaving wishes early, letter, ending, saved ending reload and rereading the letter. Separate checks cover zero, two and all 25 wishes; wrong melody input; dialog pause/resume; saved melody rounds; a 390px mobile wish dialog; and automatic playback/dissolve from palace departure to letter arrival, letter reward, and ending. Audio was measured as a nonzero, unclipped browser waveform. All 47 MP4s were probed and retain video and audio tracks. Physical phone speakers and subjective audio quality remain device checks.
