(function() {
  const path = window.location.pathname.toLowerCase();
  
  // Set root prefix depending on whether we are in a subdirectory
  let prefix = './';
  if (
    path.includes('/event-planner/') ||
    path.includes('/pso-drop-charts/') ||
    path.includes('/event-attendance/') ||
    path.includes('/skald/')
  ) {
    prefix = '../';
  }

  // Create header element
  const header = document.createElement('header');
  header.className = 'webworks-header';

  // Determine active tab
  const isPlanner = path.includes('/event-planner/');
  const isCharts = path.includes('/pso-drop-charts/');
  const isRsvp = path.includes('/event-attendance/');
  const isSkald = path.includes('/skald/');

  header.innerHTML = `
    <a href="${prefix}index.html" class="webworks-brand">
      webworks <span class="muted">/ jordan kelly</span>
    </a>
    <nav class="webworks-nav">
      <a href="${prefix}event-planner/index.html" class="webworks-nav-link ${isPlanner ? 'active' : ''}">Event Planner</a>
      <a href="${prefix}pso-drop-charts/index.html" class="webworks-nav-link ${isCharts ? 'active' : ''}">Drop Charts</a>
      <a href="${prefix}event-attendance/index.html" class="webworks-nav-link ${isRsvp ? 'active' : ''}">Event RSVP</a>
      <a href="${prefix}skald/index.html" class="webworks-nav-link ${isSkald ? 'active' : ''}">Skald</a>
    </nav>
  `;

  const inject = () => {
    if (document.querySelector('.webworks-header')) return;
    document.body.insertBefore(header, document.body.firstChild);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
