# golf

GitHub Pages: https://kyupin64.github.io/golf/

Git Log: [log.txt](log.txt)

Background image source: [wallpapers.com](https://wallpapers.com/wallpapers/1920x1080-hd-golf-pg3sbak5sljth8qz.html)

Add a course by clicking on one of the course options on the first screen, then choose the tee and holes you'd like to play on, and finally, add each player who's playing. When selecting options for the new scorecard, you may click a different option and it will update without having to go back. The course will automatically be saved in an unnamed state, click the "Rename Scorecard" button under/to the right of the scorecard name to input a custom name for the scorecard. You can access all saved scorecards with the hamburger menu in the top right corner on the header bar.

Click on one of the stroke input cells in the table (light green background on hover) to input a stroke for any player on any hole, and the in/out totals (and total of both if playing all 18 holes) will automatically update on the far right column(s) of the table. Add new players after the scorecard has already been created by adding names in the input field under the scorecard. Click on the header title (Simple Score) in the top left of the screen to go back to the course selection screen to create a new scorecard.

The page is fully adaptable, so it should work on any screen size.

I didn't add the toastr toasts because I ran out of time. I also wanted to make it so you could edit or delete player names and scorecards and choose whether you wanted the tee row to display yards or meters, but I never got around to those. Also, the popup for adding strokes for players always shows up at the top of the screen, so if you have the list of saved scorecards pulled up or you're on a smaller screen, it shows up way at the top of the page, which I wanted to fix but didn't. Lastly, I didn't actually download Tailwind for this project, I just used the cdn, which isn't a big deal since I didn't need any custom values, but if this was a real project I would definitely need to, so I probably should've. I also could've made a separate css file since some of my Tailwind classes get a bit repetitive, but it didn't feel necessary so I didn't.
