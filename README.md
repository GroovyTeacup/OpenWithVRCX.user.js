# Open with VRCX UserJS

This is just a userscript that adds some scuffed buttons that interact with VRCX to websites.

## Installation
- Install a userscript manager like [Violentmonkey](https://violentmonkey.github.io/). (Other userscript managers may work, but are untested)
- Install the script from the [latest release](https://github.com/GroovyTeacup/OpenWithVRCX.user.js/releases/latest/download/openWithVRCX.user.js)

## Current Features
- VRChat: Adds world/user/instance buttons to VRChat website pages that open the respective dialogs in VRCX
- VRChat: A "Local Favorite" button on world pages that... adds the world to your local favorites
- VRCList: Adds VRCX buttons to VRCList world cards that open the world in VRCX; If you shift click the button it will add the world to your local favorites.
- VRCList: Also a "Open with VRCX" button on individual world pages

---

#### Supported Websites
- [VRChat](https://vrchat.com/)
- [VRCList](https://vrclist.com/)

#### Build Instructions
- `npm install`
- `npm run build` / `npm run dev`
- Output is in `dist/`

To auto-rebuild on file changes, run `npm run watch` instead of `npm run build`