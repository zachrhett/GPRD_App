function normalizePath(path) {
  if (!path) return '/home';
  const clean = path.replace(/\/+/g, '/').replace(/\/$/, '');
  return clean || '/home';
}

export class Router {
  constructor({ routes, sequences, rootSelector, screenSelector, imageBase }) {
    this.routes = routes;
    this.sequences = sequences;
    this.rootSelector = rootSelector;
    this.screenSelector = screenSelector;
    this.imageBase = imageBase;
    this.byPath = new Map(Object.entries(routes).map(([id, r]) => [normalizePath(r.path), { id, ...r }]));
    this.currentId = null;
    this.previousId = null;
    this.sequenceContext = null;
    this.renderToken = 0;
    window.addEventListener('popstate', () => this.renderPath(location.pathname, { push: false }));
  }

  resolveInitialRoute() {
    return this.byPath.has(normalizePath(location.pathname)) ? normalizePath(location.pathname) : '/home';
  }

  async start(path) {
    await this.renderPath(path, { push: false });
  }

  getRoute(idOrPath) {
    if (this.routes[idOrPath]) return { id: idOrPath, ...this.routes[idOrPath] };
    return this.byPath.get(normalizePath(idOrPath)) || null;
  }

  async go(idOrPath, options = {}) {
    const route = this.getRoute(idOrPath);
    if (!route) throw new Error(`Unknown route: ${idOrPath}`);
    this.previousId = this.currentId;
    if (options.sequence) this.sequenceContext = options.sequence;
    history.pushState({ routeId: route.id }, '', route.path);
    await this.render(route);
  }

  async renderPath(path, options = {}) {
    const route = this.getRoute(path) || this.getRoute('home');
    if (options.push) history.pushState({ routeId: route.id }, '', route.path);
    await this.render(route);
  }

  async render(route) {
    const token = ++this.renderToken;
    const screen = document.querySelector(this.screenSelector) || document.querySelector(this.rootSelector);
    if (!screen) throw new Error(`Missing screen container: ${this.screenSelector}`);

    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.alt = route.title;
    img.className = 'friend-screen-image';
    img.src = this.imageBase + encodeURIComponent(route.image).replaceAll('%2F','/');

    try { await img.decode(); } catch (_) { /* browser fallback */ }
    if (token !== this.renderToken) return;

    screen.replaceChildren(img);
    screen.dataset.routeId = route.id;
    document.title = `${route.title} | F.R.I.E.N.D.`;
    this.currentId = route.id;
    window.dispatchEvent(new CustomEvent('friend:routechange', { detail: route }));
  }

  back() {
    if (history.length > 1) history.back();
    else this.go('home');
  }

  home() { this.go('home'); }
  alerts() { this.go('alerts'); }

  forward() {
    const id = this.currentId;
    if (!id) return this.home();

    for (const [sequenceName, ids] of Object.entries(this.sequences)) {
      const idx = ids.indexOf(id);
      if (idx >= 0) {
        this.sequenceContext = sequenceName;
        if (idx < ids.length - 1) return this.go(ids[idx + 1], { sequence: sequenceName });
        return this.home();
      }
    }
    // Locked universal rule: if forward exists outside a sequence, return Home.
    return this.home();
  }

  openDepartment(slug) {
    const sequence = `associate-${slug}`;
    const ids = this.sequences[sequence];
    if (!ids) throw new Error(`Unknown department: ${slug}`);
    return this.go(ids[0], { sequence });
  }

  openAssociateExperience() {
    return this.go(this.sequences['associate-experience'][0], { sequence: 'associate-experience' });
  }
}
