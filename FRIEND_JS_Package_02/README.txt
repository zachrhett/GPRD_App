F.R.I.E.N.D. JavaScript Package 02
==================================

This package replaces the placeholder JavaScript Package 01.

Install:
1. Place this folder at 03_JS/
2. Place optimized images at 04_IMAGES/images/
3. Ensure index.html contains:
   <script type="module" src="../03_JS/app.js"></script>
4. Ensure the app contains #app and #screen elements.
5. Add CSS for:
   .friend-screen-image
   .friend-hotspot-overlay
   .friend-hotspot
   #friend-assistant-dialog

Included:
- Route registry for all mapped primary screens
- 18 department workflows, assoc-1 -> assoc-2 -> Home
- Associate Experience temp1 -> temp6 -> Home
- Universal Back, Forward, Home, Alerts behavior
- Composite Focus Area hotspots
- Browser Speech Recognition navigation
- Text-based FRIEND AI Assistant
- Asset preloading
- Browser history support

Hotspot debug:
Append ?hotspots=1 to the URL to display Composite hotspot labels.

Voice support:
Chrome, Edge, and Safari support varies by platform.
When speech recognition is unavailable, typed Assistant navigation remains active.
