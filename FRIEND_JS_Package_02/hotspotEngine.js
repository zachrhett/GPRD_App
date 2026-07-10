const compositeHotspots = [
  { label: 'Sales & Financial', route: 'sales-financial', x: 0.02, y: 0.70, w: 0.23, h: 0.18 },
  { label: 'Operations & Quality', route: 'operations-quality', x: 0.26, y: 0.70, w: 0.23, h: 0.18 },
  { label: 'People & Leadership', route: 'people-leadership', x: 0.50, y: 0.70, w: 0.23, h: 0.18 },
  { label: 'Alerts & Risks', route: 'store-alerts', x: 0.74, y: 0.70, w: 0.24, h: 0.18 }
];

export class HotspotEngine {
  constructor(router) {
    this.router = router;
    this.overlay = null;
    this.debug = new URLSearchParams(location.search).get('hotspots') === '1';
  }

  install() {
    window.addEventListener('friend:routechange', e => this.renderForRoute(e.detail.id));
    document.addEventListener('click', e => {
      const route = e.target.closest('[data-route]')?.dataset.route;
      if (route) this.router.go(route);

      const department = e.target.closest('[data-department]')?.dataset.department;
      if (department) this.router.openDepartment(department);

      if (e.target.closest('[data-associate-experience]')) this.router.openAssociateExperience();
    });
  }

  renderForRoute(routeId) {
    document.querySelector('.friend-hotspot-overlay')?.remove();
    const screen = document.querySelector('#screen');
    if (!screen) return;
    const specs = routeId === 'composite' ? compositeHotspots : [];
    if (!specs.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'friend-hotspot-overlay';
    overlay.setAttribute('aria-label', 'Interactive regions');
    specs.forEach(spec => {
      const button = document.createElement('button');
      button.className = 'friend-hotspot';
      button.type = 'button';
      button.setAttribute('aria-label', spec.label);
      button.dataset.route = spec.route;
      Object.assign(button.style, {
        left: `${spec.x * 100}%`, top: `${spec.y * 100}%`,
        width: `${spec.w * 100}%`, height: `${spec.h * 100}%`
      });
      if (this.debug) button.textContent = spec.label;
      overlay.appendChild(button);
    });
    screen.appendChild(overlay);
  }
}
