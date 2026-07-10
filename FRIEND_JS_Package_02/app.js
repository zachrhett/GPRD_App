import { Router } from './router.js';
import { NavigationController } from './navigation.js';
import { HotspotEngine } from './hotspotEngine.js';
import { VoiceEngine } from './voiceEngine.js';
import { FriendAssistant } from './aiAssistant.js';
import { AssetPreloader } from './preload.js';
import { ROUTES, SEQUENCES, GLOBAL_IDS } from './routeRegistry.js';

const config = {
  imageBase: '../04_IMAGES/images/',
  rootSelector: '#app',
  screenSelector: '#screen',
};

const router = new Router({ routes: ROUTES, sequences: SEQUENCES, ...config });
const nav = new NavigationController(router);
const hotspots = new HotspotEngine(router);
const voice = new VoiceEngine(router);
const assistant = new FriendAssistant(router, voice);
const preloader = new AssetPreloader(config.imageBase);

window.FRIEND = { router, nav, hotspots, voice, assistant, preloader };

document.addEventListener('DOMContentLoaded', async () => {
  nav.bindGlobalControls(GLOBAL_IDS);
  hotspots.install();
  assistant.install();
  voice.install();

  const initialRoute = router.resolveInitialRoute();
  await router.start(initialRoute);

  // Preload after first paint so startup stays fast.
  requestAnimationFrame(() => {
    preloader.preload(Object.values(ROUTES).map(route => route.image));
  });
});
