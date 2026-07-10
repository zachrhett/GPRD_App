export class FriendAssistant {
  constructor(router, voice) {
    this.router = router;
    this.voice = voice;
    this.dialog = null;
  }

  install() {
    window.addEventListener('friend:assistant-open', () => this.open());
    document.addEventListener('submit', e => {
      if (!e.target.matches('#friend-assistant-form')) return;
      e.preventDefault();
      const input = e.target.elements.query;
      this.handle(input.value);
      input.value = '';
    });
  }

  ensureDialog() {
    if (this.dialog) return this.dialog;
    const dialog = document.createElement('dialog');
    dialog.id = 'friend-assistant-dialog';
    dialog.innerHTML = `
      <form method="dialog" class="friend-assistant-header">
        <strong>FRIEND AI Assistant</strong>
        <button aria-label="Close assistant">×</button>
      </form>
      <div id="friend-assistant-log" aria-live="polite"></div>
      <form id="friend-assistant-form">
        <label for="friend-assistant-query">Ask or navigate</label>
        <div class="friend-assistant-input-row">
          <input id="friend-assistant-query" name="query" autocomplete="off"
            placeholder="Example: Open Produce" required>
          <button type="submit">Send</button>
          <button type="button" data-action="voice">🎤</button>
        </div>
      </form>`;
    document.body.appendChild(dialog);
    this.dialog = dialog;
    return dialog;
  }

  open() {
    const d = this.ensureDialog();
    if (!d.open) d.showModal();
    d.querySelector('input')?.focus();
  }

  append(role, message) {
    const log = this.ensureDialog().querySelector('#friend-assistant-log');
    const item = document.createElement('div');
    item.className = `friend-message friend-message-${role}`;
    item.textContent = message;
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
  }

  handle(text) {
    this.append('user', text);
    const matched = this.voice.navigateFromText(text);
    if (matched) {
      this.append('assistant', `Opening ${text.replace(/^(open|show|go to|take me to)\s+/i,'')}.`);
      return;
    }
    this.append('assistant',
      'I can navigate to any mapped SPA module or department. Try “Open Production,” “Show Store Scorecard,” or “Go to Bakery.”');
  }
}
