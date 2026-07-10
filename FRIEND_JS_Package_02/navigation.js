export class NavigationController {
  constructor(router) { this.router = router; }

  bindGlobalControls(ids) {
    const bind = (idList, handler) => {
      idList.forEach(id => {
        document.addEventListener('click', event => {
          const target = event.target.closest(`#${CSS.escape(id)},[data-action="${id}"]`);
          if (!target) return;
          event.preventDefault();
          handler();
        });
      });
    };

    bind(ids.back, () => this.router.back());
    bind(ids.forward, () => this.router.forward());
    bind(ids.home, () => this.router.home());
    bind(ids.alerts, () => this.router.alerts());

    ids.assistant.forEach(id => document.addEventListener('click', event => {
      if (event.target.closest(`#${CSS.escape(id)},[data-action="${id}"]`)) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('friend:assistant-open'));
      }
    }));

    ids.voice.forEach(id => document.addEventListener('click', event => {
      if (event.target.closest(`#${CSS.escape(id)},[data-action="${id}"]`)) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('friend:voice-start'));
      }
    }));
  }
}
