/*
  app.js — Moteur de composants partagés SIGIF (Navbar + Sidebar)

  Usage dans une page :

    <div id="navbar-mount"></div>
    <aside class="app-sidebar"><nav class="app-nav" id="sidebar-mount"></nav></aside>
    ...
    <script src="shared/app.js"></script>
    <script>
      SIGIF.mountSidebar('#sidebar-mount', [
        { icon: 'orgTree', label: 'Organisation', href: '#', active: true },
        { icon: 'programme', label: 'Programme', href: '#' },
      ], { brandSub: 'Préparation budgétaire' });
      SIGIF.mountNavbar('#navbar-mount', {
        userName: 'Agent DPB',
        userRole: 'Administrateur DPB',
        userInitials: 'AD'
      });
    </script>

  Une seule définition de la Navbar et du moteur de Sidebar : chaque
  écran ne fournit que la liste de ses propres items de navigation.
*/

(function (global) {
  'use strict';

  // ---- Bibliothèque d'icônes (stroke-based, 24 viewBox) --------------
  var ICONS = {
    home:
      '<path d="M3 11l9-8 9 8"></path>' +
      '<path d="M5 10v10h14V10"></path>' +
      '<path d="M9 20v-6h6v6"></path>',
    orgTree:
      '<ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>' +
      '<path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path>' +
      '<path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"></path>',
    programme:
      '<rect x="3" y="4" width="18" height="16" rx="2"></rect>' +
      '<line x1="3" y1="10" x2="21" y2="10"></line>' +
      '<line x1="8" y1="15" x2="14" y2="15"></line>',
    compte:
      '<rect x="3" y="7" width="18" height="13" rx="2"></rect>' +
      '<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
    source:
      '<circle cx="12" cy="12" r="9"></circle>' +
      '<path d="M12 3v18M3 12h18"></path>',
    objectif:
      '<circle cx="12" cy="12" r="9"></circle>' +
      '<circle cx="12" cy="12" r="5"></circle>' +
      '<circle cx="12" cy="12" r="1"></circle>',
    complement:
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>' +
      '<polyline points="14 2 14 8 20 8"></polyline>' +
      '<line x1="9" y1="13" x2="15" y2="13"></line>' +
      '<line x1="9" y1="17" x2="13" y2="17"></line>',
    chart:
      '<path d="M3 3v18h18"></path>' +
      '<path d="M7 16l3.5-5 3 3L19 7"></path>',
    tag:
      '<path d="M9 11l3 3L22 4"></path>' +
      '<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
    message:
      '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.7 8.7 0 0 1-4-1L3 20l1-5.5A8.4 8.4 0 1 1 21 11.5z"></path>',
    doc:
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>' +
      '<polyline points="14 2 14 8 20 8"></polyline>',
    bell:
      '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>' +
      '<path d="M13.7 21a2 2 0 0 1-3.4 0"></path>',
    chevronDown: '<polyline points="6 9 12 15 18 9"></polyline>',
    check: '<polyline points="20 6 9 17 4 12"></polyline>',
    arrowUpRight:
      '<line x1="5" y1="19" x2="19" y2="5"></line>' +
      '<polyline points="9 5 19 5 19 15"></polyline>',
    landmark:
      '<line x1="3" y1="22" x2="21" y2="22"></line>' +
      '<line x1="6" y1="18" x2="6" y2="11"></line>' +
      '<line x1="10" y1="18" x2="10" y2="11"></line>' +
      '<line x1="14" y1="18" x2="14" y2="11"></line>' +
      '<line x1="18" y1="18" x2="18" y2="11"></line>' +
      '<polygon points="12 2 20 7 4 7 12 2"></polygon>',
    search:
      '<circle cx="11" cy="11" r="7"></circle>' +
      '<line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
    filter:
      '<polygon points="4 4 20 4 14 12.5 14 19 10 21 10 12.5 4 4"></polygon>',
    plus:
      '<line x1="12" y1="5" x2="12" y2="19"></line>' +
      '<line x1="5" y1="12" x2="19" y2="12"></line>',
    chevronLeft: '<polyline points="15 18 9 12 15 6"></polyline>',
    chevronRight: '<polyline points="9 18 15 12 9 6"></polyline>',
    dots:
      '<circle cx="12" cy="5" r="1.5"></circle>' +
      '<circle cx="12" cy="12" r="1.5"></circle>' +
      '<circle cx="12" cy="19" r="1.5"></circle>'
  };

  function svg(iconKey, size) {
    var inner = ICONS[iconKey] || '';
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      inner + '</svg>';
  }

  // ---- Sidebar ---------------------------------------------------------
  // items: [{ icon, label, href, active }] ou [{ label, type: 'label' }]
  // brand (optionnel): { logoSrc, brandSub }
  function mountSidebar(targetSelector, items, brand) {
    var el = document.querySelector(targetSelector);
    if (!el) { return; }
    var navHtml = items.map(function (item) {
      if (item.type === 'label') {
        return '<div class="app-nav-label">' + item.label + '</div>';
      }
      var cls = 'app-nav-item' + (item.active ? ' is-active' : '');
      return '<a class="' + cls + '" href="' + (item.href || '#') + '">' +
        svg(item.icon, 17) + '<span class="app-nav-item-label">' + item.label + '</span></a>';
    }).join('');
    el.innerHTML = navHtml;

    if (brand) {
      var logoSrc = brand.logoSrc || 'logo.png';
      var header = document.createElement('div');
      header.className = 'app-sidebar-brand';
      header.innerHTML =
        '<div class="brand-mark"><img src="' + logoSrc + '" alt="Logo SIGIF"></div>' +
        '<div>' +
          '<div class="brand-name">SIGIF</div>' +
          (brand.brandSub ? '<div class="brand-sub">' + brand.brandSub + '</div>' : '') +
        '</div>';
      el.parentNode.insertBefore(header, el);
    }

    // Bouton de compression / décompression de la sidebar — commun à tout le projet
    var sidebarEl = el.closest ? el.closest('.app-sidebar') : el.parentNode;
    if (sidebarEl && !sidebarEl.querySelector('.sidebar-toggle')) {
      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'sidebar-toggle';
      toggle.title = 'Réduire / agrandir le menu';
      toggle.setAttribute('aria-label', 'Réduire ou agrandir le menu');
      toggle.textContent = '‹';
      sidebarEl.insertBefore(toggle, sidebarEl.firstChild);

      var storedCollapsed = false;
      try { storedCollapsed = localStorage.getItem('sigif-sidebar-collapsed') === '1'; } catch (e) {}
      if (storedCollapsed) { sidebarEl.classList.add('is-collapsed'); }

      toggle.addEventListener('click', function () {
        var isCollapsed = sidebarEl.classList.toggle('is-collapsed');
        try { localStorage.setItem('sigif-sidebar-collapsed', isCollapsed ? '1' : '0'); } catch (e) {}
      });
    }
  }

  // ---- Navbar ------------------------------------------------------------
  // opts: { userName, userRole, userInitials }
  function mountNavbar(targetSelector, opts) {
    opts = opts || {};
    var userName = opts.userName || 'Utilisateur connecté';
    var userRole = opts.userRole || '';
    var userInitials = opts.userInitials || 'U';

    var el = document.querySelector(targetSelector);
    if (!el) { return; }

    el.innerHTML =
      '<div class="topbar-wrap">' +
        '<div class="topbar">' +
          '<div class="topbar-actions">' +
            '<div class="icon-btn">' +
              '<span class="dot"></span>' +
              svg('bell', 16) +
            '</div>' +
            '<div class="user-menu-wrap" id="sigif-user-menu-wrap">' +
              '<button class="user-chip" type="button" id="sigif-user-menu-trigger" aria-expanded="false" aria-haspopup="true">' +
                '<div class="user-avatar">' + userInitials + '</div>' +
                '<div class="user-meta">' +
                  '<span class="user-name">' + userName + '</span>' +
                  '<span class="user-role">' + userRole + '</span>' +
                '</div>' +
                svg('chevronDown', 14).replace('<svg ', '<svg class="chevron" ') +
              '</button>' +
              '<div class="user-menu" id="sigif-user-menu">' +
                '<div class="user-menu-label">Thème de couleur</div>' +
                '<div class="theme-option" data-theme-option="blue">' +
                  '<span class="theme-swatch theme-swatch-blue"></span>' +
                  '<span class="theme-option-label">Bleu</span>' +
                  svg('check', 16).replace('<svg ', '<svg class="theme-check" ') +
                '</div>' +
                '<div class="theme-option is-selected" data-theme-option="green">' +
                  '<span class="theme-swatch theme-swatch-green"></span>' +
                  '<span class="theme-option-label">Vert</span>' +
                  svg('check', 16).replace('<svg ', '<svg class="theme-check" ') +
                '</div>' +
                '<div class="user-menu-divider"></div>' +
                '<div class="user-menu-logout" id="sigif-user-menu-logout">Déconnexion</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    wireUserMenu();
  }

  function wireUserMenu() {
    var trigger = document.getElementById('sigif-user-menu-trigger');
    var menu = document.getElementById('sigif-user-menu');
    var wrap = document.getElementById('sigif-user-menu-wrap');
    var logout = document.getElementById('sigif-user-menu-logout');
    if (!trigger || !menu || !wrap) { return; }
    var themeOptions = menu.querySelectorAll('.theme-option');

    function openMenu() { menu.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); }
    function closeMenu() { menu.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); }
    function toggleMenu() { menu.classList.contains('is-open') ? closeMenu() : openMenu(); }

    trigger.addEventListener('click', function (e) { e.stopPropagation(); toggleMenu(); });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) { closeMenu(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); } });

    themeOptions.forEach(function (opt) {
      opt.addEventListener('click', function () {
        themeOptions.forEach(function (o) { o.classList.remove('is-selected'); });
        opt.classList.add('is-selected');
        var theme = opt.getAttribute('data-theme-option');
        if (theme === 'blue') { document.body.setAttribute('data-theme', 'blue'); }
        else { document.body.removeAttribute('data-theme'); }
      });
    });

    if (logout) { logout.addEventListener('click', closeMenu); }
  }

  // ---- Bandeau d'identification (.page-banner) ---------------------------
  // opts: { icon, eyebrow, text }
  function mountBanner(targetSelector, opts) {
    opts = opts || {};
    var icon = opts.icon || 'landmark';
    var eyebrow = opts.eyebrow || 'Portail SIGIF';
    var text = opts.text || '';
    var el = document.querySelector(targetSelector);
    if (!el) { return; }
    el.innerHTML =
      '<div class="page-banner">' +
        '<div class="page-banner-icon">' + svg(icon, 22) + '</div>' +
        '<div class="page-banner-body">' +
          '<div class="page-banner-eyebrow"><span class="page-banner-eyebrow-dot"></span>' + eyebrow + '</div>' +
          '<div class="page-banner-text">' + text + '</div>' +
        '</div>' +
      '</div>';
  }

  // ---- Fil d'ariane (.breadcrumb) -----------------------------------------
  // crumbs: [{ label, href }] — le dernier élément (sans href, ou explicite) est le courant
  function mountBreadcrumb(targetSelector, crumbs) {
    var el = document.querySelector(targetSelector);
    if (!el) { return; }
    var parts = crumbs.map(function (c, i) {
      var isLast = i === crumbs.length - 1;
      if (isLast || !c.href) {
        return '<span class="current">' + c.label + '</span>';
      }
      return '<a href="' + c.href + '">' + c.label + '</a>';
    });
    el.innerHTML = '<div class="breadcrumb">' + parts.join('<span>/</span>') + '</div>';
  }

  // ---- Grille de cartes (.card) --------------------------------------------
  // items: [{ icon, tint, title, desc, href, stat: { value, label }, donut: bool }]
  // - sans `stat` -> carte "domaine" (flèche de navigation)
  // - avec `stat` -> carte "statistique" (valeur chiffrée)
  function mountCards(targetSelector, items) {
    var el = document.querySelector(targetSelector);
    if (!el) { return; }
    el.innerHTML = items.map(function (item) {
      var tintClass = item.tint ? ' ' + item.tint : '';
      var topRight = item.donut
        ? '<svg class="donut" width="34" height="34" viewBox="0 0 36 36">' +
            '<circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--border)" stroke-width="4"></circle>' +
            '<circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--accent)" stroke-width="4" stroke-dasharray="62 100" stroke-dashoffset="25" stroke-linecap="round"></circle>' +
            '<circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--gold)" stroke-width="4" stroke-dasharray="25 100" stroke-dashoffset="-37" stroke-linecap="round"></circle>' +
          '</svg>'
        : '<span class="card-arrow">' + svg('arrowUpRight', 13) + '</span>';

      var body = item.stat
        ? '<div class="stat-value-row">' +
            '<span class="stat-value">' + item.stat.value + '</span>' +
            '<span class="stat-label">' + item.stat.label + '</span>' +
          '</div>'
        : '<div class="card-desc">' + (item.desc || '') + '</div>';

      return '<a class="card' + (item.stat ? ' stat-card' : ' domain-card') + '" href="' + (item.href || '#') + '">' +
        '<div class="card-top">' +
          '<div class="card-icon' + tintClass + '">' + svg(item.icon, 20) + '</div>' +
          '<div class="card-title">' + item.title + '</div>' +
          topRight +
        '</div>' +
        body +
      '</a>';
    }).join('');
  }

  // ---- Barre d'outils liste : recherche + filtre ---------------------------
  // opts: { placeholder, filterLabel }
  function mountToolbar(targetSelector, opts) {
    opts = opts || {};
    var placeholder = opts.placeholder || 'Rechercher…';
    var filterLabel = opts.filterLabel || 'Filtrer';
    var el = document.querySelector(targetSelector);
    if (!el) { return; }
    el.innerHTML =
      '<div class="toolbar">' +
        '<div class="search-box">' +
          svg('search', 16) +
          '<input type="text" placeholder="' + placeholder + '">' +
        '</div>' +
        '<button class="filter-btn" type="button" title="' + filterLabel + '">' +
          svg('filter', 15) + '<span>' + filterLabel + '</span>' +
        '</button>' +
      '</div>';
  }

  // ---- Liste / tableau de référentiel --------------------------------------
  // opts: { title, count, columns: [label...], rows: [[cellHtml...]], page, pageCount }
  function mountTable(targetSelector, opts) {
    opts = opts || {};
    var columns = opts.columns || [];
    var rows = opts.rows || [];
    var page = opts.page || 1;
    var pageCount = opts.pageCount || 1;
    var el = document.querySelector(targetSelector);
    if (!el) { return; }

    var thead = '<thead><tr>' + columns.map(function (c) {
      return '<th>' + c + '</th>';
    }).join('') + '<th></th></tr></thead>';

    var tbody = '<tbody>' + rows.map(function (r) {
      return '<tr>' + r.map(function (cell) {
        return '<td>' + cell + '</td>';
      }).join('') + '<td class="row-actions">' + svg('dots', 16) + '</td></tr>';
    }).join('') + '</tbody>';

    var pageBtns = '';
    for (var i = 1; i <= pageCount; i++) {
      pageBtns += '<button class="page-btn' + (i === page ? ' is-active' : '') + '">' + i + '</button>';
    }

    el.innerHTML =
      '<div class="list-card">' +
        '<div class="list-card-head">' +
          '<div class="list-card-title">' + (opts.title || '') +
            (opts.count != null ? '<span class="badge">' + opts.count + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="table-wrap"><table class="data-table">' + thead + tbody + '</table></div>' +
        '<div class="pagination">' +
          '<button class="page-btn" type="button">' + svg('chevronLeft', 15) + '</button>' +
          pageBtns +
          '<button class="page-btn" type="button">' + svg('chevronRight', 15) + '</button>' +
        '</div>' +
      '</div>';
  }

  global.SIGIF = {
    icons: ICONS,
    svg: svg,
    mountSidebar: mountSidebar,
    mountNavbar: mountNavbar,
    mountBanner: mountBanner,
    mountBreadcrumb: mountBreadcrumb,
    mountCards: mountCards,
    mountToolbar: mountToolbar,
    mountTable: mountTable
  };
})(window);
