const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class VoiceEngine {
  constructor(router) {
    this.router = router;
    this.recognition = null;
    this.aliases = this.buildAliases();
  }

  buildAliases() {
    const aliases = new Map();
    const add = (terms, route) => terms.forEach(t => aliases.set(this.normalize(t), route));

    add(['home','dashboard','home screen'], 'home');
    add(['pro','top pro','priority review'], 'pro');
    add(['pro view'], 'pro-view');
    add(['temperature compliance'], 'tempcomp');
    add(['mission value'], 'mission-value');
    add(['store scorecard'], 'store-scorecard');
    add(['composite','store composite overview'], 'composite');
    add(['operations and quality','operations quality'], 'operations-quality');
    add(['sales and financial','sales financial'], 'sales-financial');
    add(['people and leadership','people leadership'], 'people-leadership');
    add(['store alerts','alerts and risks'], 'store-alerts');
    add(['maximo'], 'maximo');
    add(['production'], 'production');
    add(['replenishment'], 'replenishment');
    add(['inventory'], 'inventory');
    add(['shrink'], 'shrink');
    add(['sales'], 'sales');
    add(['food safety'], 'food-safety');
    add(['safety'], 'safety');
    add(['labor'], 'labor');
    add(['labor health'], 'labor-health');
    add(['ordering','order management'], 'ordering');
    add(['compliance'], 'compliance');
    add(['associate department','associate department module'], 'associate-home');
    add(['associate experience','temperature experience'], 'associate-experience-1');
    add(['alerts'], 'alerts');

    const departmentRoutes = {
      bakery:'associate-bakery-1', dairy:'associate-dairy-1', deli:'associate-deli-1',
      ecommerce:'associate-ecommerce-1', 'e commerce':'associate-ecommerce-1',
      'front end':'associate-front-end-1', frozen:'associate-frozen-1',
      'general merchandise':'associate-general-merchandise-1', grocery:'associate-grocery-1',
      hbc:'associate-hbc-1', 'home department':'associate-home-department-1',
      liquor:'associate-liquor-1', management:'associate-management-1',
      meat:'associate-meat-1', murrays:'associate-murrays-1', produce:'associate-produce-1',
      receiving:'associate-receiving-1', seafood:'associate-seafood-1', starbucks:'associate-starbucks-1'
    };
    Object.entries(departmentRoutes).forEach(([term, route]) => add([term, `open ${term}`, `show ${term}`], route));
    return aliases;
  }

  normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
      .replace(/^(open|show|go to|take me to|find)\s+/, '');
  }

  match(text) {
    const n = this.normalize(text);
    if (this.aliases.has(n)) return this.aliases.get(n);
    for (const [term, route] of this.aliases) if (n.includes(term)) return route;
    return null;
  }

  navigateFromText(text) {
    const route = this.match(text);
    if (route) {
      this.router.go(route);
      window.dispatchEvent(new CustomEvent('friend:voice-result', { detail: { text, route, matched: true } }));
      return true;
    }
    window.dispatchEvent(new CustomEvent('friend:voice-result', { detail: { text, matched: false } }));
    return false;
  }

  install() {
    window.addEventListener('friend:voice-start', () => this.start());
  }

  start() {
    if (!SpeechRecognition) {
      window.dispatchEvent(new CustomEvent('friend:voice-error', {
        detail: { message: 'Voice recognition is not supported in this browser. Use the AI Assistant text box instead.' }
      }));
      return;
    }

    this.recognition?.abort();
    const recognition = new SpeechRecognition();
    this.recognition = recognition;
    recognition.lang = document.documentElement.lang || 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = event => {
      const text = event.results[0][0].transcript;
      this.navigateFromText(text);
    };
    recognition.onerror = event => {
      window.dispatchEvent(new CustomEvent('friend:voice-error', { detail: { message: event.error } }));
    };
    recognition.start();
  }
}
