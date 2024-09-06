# UI Specification for the Echoes App

## 1. Splash Screen
- **Purpose**: Welcome users with a brief introduction to the app.
- **Features**:
  - **App Logo**: Centered on the screen with the name "Echoes" below it.
  - **Subheading**: A tagline like "Discover voices, share stories."
  - **Loading Animation**: A subtle animation or progress bar to show app loading.
  - **Background**: Simple gradient or soundwave-themed visual.
  - **Duration**: Appears for 2-3 seconds before transitioning to the Home Screen.

## 2. Home Screen (Echo Feed)
- **Purpose**: Central hub where users can browse and listen to echoes based on themes, popularity, and newness.
- **Features**:
  - **Echo Cards**: Each echo is presented as a card in a scrollable vertical feed. Cards contain:
    - **Echo Title**: Brief description of the echo (e.g., "Best Advice I Ever Received").
    - **Play Button**: Central button to play/pause the echo.
    - **Playback Duration**: Display the echo length (e.g., "1:30").
    - **Like Icon**: Heart icon with the number of likes next to it.
    - **Reply Icon**: Microphone icon to record a response.
    - **Share Icon**: A share button to send the echo to other social media platforms.
  - **Category Tabs or Filter Bar**: A horizontal scrollable bar above the feed to filter echoes by category (e.g., Confessions, Life Advice, Love Stories).
  - **Sort Option**: A button at the top right to toggle between sorting methods (Trending, Newest, Most Liked).
  - **Daily Featured Echoes Banner**: Optional, displayed at the top with special, curated echoes (e.g., "Today's Top Echoes").
  - **Refresh Button**: Pull-to-refresh mechanism to update the feed with new echoes.
  - **Background Color**: Clean, minimal background, with slight distinctions between echo cards to make them stand out.

## 3. Echo Playback Overlay
- **Purpose**: To offer an immersive experience while listening to an echo.
- **Features**:
  - **Full-Screen Modal**: When the user taps "Play" on an echo, the echo opens in full-screen.
  - **Echo Title**: Displayed at the top, along with the echo category.
  - **Audio Waveform Animation**: Visual representation of the sound wave as the echo plays.
  - **Playback Controls**: Play/Pause button at the bottom center, with fast-forward and rewind options (e.g., skip 10 seconds forward/back).
  - **Like Button**: Large like button near the bottom left to interact with the echo.
  - **Reply Button**: Prominently displayed microphone icon allowing users to leave a voice response.
  - **Close Button**: "X" button at the top left to exit playback mode and return to the feed.
  - **Time Progress Bar**: Visual indicator of the echo's progress at the bottom.
  - **Background Animation**: Subtle, moving animation or gradient in the background to create an immersive, audio-focused experience.

## 4. Echo Creation Screen
- **Purpose**: To allow users to record and share their own echoes.
- **Features**:
  - **Recording Interface**:
    - **Record Button**: Large, central microphone button to start/stop recording.
    - **Timer**: Displays elapsed recording time (e.g., "00:30") at the top.
    - **Pause/Resume Button**: Allows users to pause and resume recording.
    - **Stop and Save Button**: Once finished, a "Stop & Save" button appears to proceed.
  - **Title and Category**:
    - **Echo Title Field**: Text field where users can input a short description or title for their echo.
    - **Category Dropdown**: Users select the appropriate category (Confession, Story, Advice, etc.) from a dropdown or list of icons.
  - **Anonymous Toggle**: Switch allowing users to post anonymously.
  - **Preview and Re-record Option**: Users can play back their echo before posting and re-record if necessary.
  - **Submit Button**: A prominent button at the bottom labeled "Share Echo" to submit the recording.
  - **Background Color**: Minimal design with a clean interface, and microphone iconography for visual clarity.

## 5. Echo Reply (Response) Screen
- **Purpose**: To enable users to respond to other echoes with their own voice.
- **Features**:
  - **Reply Recording Interface**:
    - **Record Button**: Central microphone button to record a reply.
    - **Timer**: Displaying recording length.
    - **Pause and Resume**: Ability to pause and resume during recording.
  - **Submit Button**: "Submit Reply" button to post the response.
  - **Cancel Button**: A "Cancel" option to discard the reply and return to the echo screen.

## 6. Echo Categories Screen
- **Purpose**: A full-screen list where users can explore specific echo categories.
- **Features**:
  - **Category Tiles**: Each category is represented as a tile or button with an icon and label (e.g., "Confessions," "Travel Stories").
  - **Category Search Bar**: A search field at the top to quickly find categories.
  - **Top Categories Section**: Highlights popular or trending categories for quick access.
  - **Background**: Simple, clean design with subtle category-related icons or illustrations.

## 7. Notifications Screen
- **Purpose**: To inform users about new replies, likes, and trending echoes.
- **Features**:
  - **Notification List**: A scrollable list of notifications, each one briefly describing the interaction (e.g., "Your echo received a new like!" or "You have a new reply").
  - **Echo Playback Shortcut**: Tapping on a notification opens the associated echo in the playback screen.
  - **Clear All Button**: Option to clear all notifications at the top.
  - **Date Grouping**: Notifications grouped by date (e.g., Today, Yesterday).

## 8. Profile (Anonymous Interaction)
- **Purpose**: To allow users to manage their echoes and view their stats.
- **Features**:
  - **Anonymous Label**: Displays "Anonymous User" or "Guest" at the top (since there's no login).
  - **Echoes Created**: List of echoes the user has recorded, with interaction stats (likes, replies).
  - **Badges Section**: Displays earned badges based on interaction metrics (optional, to gamify the experience).
  - **Settings Button**: Provides access to app settings (notifications, privacy, etc.).
  - **Background Color**: Clean and minimal with icons or illustrations representing anonymity.

## 9. Settings Screen
- **Purpose**: To allow users to customize their app experience.
- **Features**:
  - **Notifications**: Toggle notifications for likes, replies, and new echoes.
  - **Language Preferences**: Option to set preferred language for discovering echoes.
  - **Privacy Settings**: Manage anonymous settings or clear cached data.
  - **About Section**: Includes app information, FAQs, and feedback.
  - **Terms of Service**: Button to view terms and conditions.
  - **Background**: Simple layout with icons for each setting category.

## 10. Share Echo Screen
- **Purpose**: To enable users to easily share echoes to social media or messaging apps.
- **Features**:
  - **Share Buttons**: Horizontal row of icons for common platforms (Instagram, Twitter, WhatsApp, etc.).
  - **Copy Link Button**: Allows users to copy a direct link to the echo.
  - **Background**: Minimal with subtle icons indicating shareability (e.g., soundwave or message bubble icons).

## 11. Badges & Achievements Screen
- **Purpose**: To gamify the app and reward users for creating and interacting with echoes.
- **Features**:
  - **Badge Tiles**: Grid layout of badges, showing which ones have been earned (colored) and which ones are still locked (grayed out).
  - **Badge Descriptions**: Tapping on a badge provides more details (e.g., "You earned this badge for creating 5 echoes!").
  - **Progress Bar**: A visual progress bar showing how close the user is to earning the next badge.
  - **Background**: Bright and motivational design with playful, colorful icons representing each achievement.

## 12. Error and Offline Screens
- **Purpose**: To handle cases where there are errors or lack of connectivity.
- **Features**:
  - **Error Message**: Simple, concise error message with a retry button (e.g., "Something went wrong. Try again.").
  - **Offline Mode Notification**: A screen that notifies users when they are offline with an option to retry once the connection is restored.
  - **Background**: Simple design, possibly using a sad face or disconnected plug icon to indicate the issue.