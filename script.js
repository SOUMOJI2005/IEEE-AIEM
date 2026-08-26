// Robotics & Electronics Student Chapter — shared behavior

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Running electron orbits in the homepage hero.
  const electronCanvas = document.querySelector('.electron-field');
  if (electronCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const context = electronCanvas.getContext('2d');
    const animationStage = electronCanvas.closest('.hero, .page-hero, .electron-stage');
    const activityPanel = animationStage.querySelector('.activity-panel');
    const pointer = { x: 0, y: 0, active: false };
    const orbits = [
      { radiusX: 0.22, radiusY: 0.11, angle: 0.2, speed: 0.018, phase: 0 },
      { radiusX: 0.22, radiusY: 0.11, angle: -0.2, speed: -0.014, phase: 2.1 },
      { radiusX: 0.22, radiusY: 0.11, angle: 0, speed: 0.011, phase: 4.2 }
    ];
    let animationFrame;
    let width = 0;
    let height = 0;

    const resizeField = () => {
      const scale = window.devicePixelRatio || 1;
      width = animationStage.clientWidth;
      height = animationStage.clientHeight;
      electronCanvas.width = width * scale;
      electronCanvas.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const drawField = () => {
      context.clearRect(0, 0, width, height);
      const isRosterHero = animationStage.classList.contains('roster-hero');
      const canvasBounds = electronCanvas.getBoundingClientRect();
      const panelBounds = activityPanel && activityPanel.getBoundingClientRect();
      const defaultCenterX = panelBounds ? panelBounds.left - canvasBounds.left + panelBounds.width / 2 : width * 0.5;
      const defaultCenterY = panelBounds ? panelBounds.top - canvasBounds.top + panelBounds.height / 2 : height * 0.5;
      const centerX = defaultCenterX + (pointer.active ? (pointer.x - defaultCenterX) * 0.04 : 0);
      const centerY = defaultCenterY + (pointer.active ? (pointer.y - defaultCenterY) * 0.04 : 0);
      const orbitPoints = [];

      context.save();
      context.translate(centerX, centerY);
      orbits.forEach((orbit, index) => {
        const radiusX = panelBounds ? panelBounds.width / 2 + 54 + index * 16 : Math.min(width * orbit.radiusX, 250);
        const radiusY = panelBounds ? panelBounds.height / 2 + 30 + index * 10 : Math.min(height * orbit.radiusY, 130);
        context.save();
        context.rotate(orbit.angle);
        context.beginPath();
        context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(30, 77, 73, 0.28)';
        context.lineWidth = 1;
        context.stroke();
        const electronAngle = orbit.phase;
        const electronX = Math.cos(electronAngle) * radiusX;
        const electronY = Math.sin(electronAngle) * radiusY;
        orbitPoints.push({ x: centerX + electronX, y: centerY + electronY });
        context.beginPath();
        context.arc(electronX, electronY, 6, 0, Math.PI * 2);
        context.fillStyle = '#D85B36';
        context.shadowColor = '#D85B36';
        context.shadowBlur = 14;
        context.fill();
        context.restore();
        orbit.phase += orbit.speed;
      });
      context.restore();

      orbitPoints.forEach((point, index) => {
        const nextPoint = orbitPoints[(index + 1) % orbitPoints.length];
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(nextPoint.x, nextPoint.y);
        context.strokeStyle = 'rgba(216, 91, 54, 0.18)';
        context.stroke();
      });
      animationFrame = requestAnimationFrame(drawField);
    };

    electronCanvas.addEventListener('pointermove', (event) => {
      const bounds = electronCanvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    });
    electronCanvas.addEventListener('pointerleave', () => {
      pointer.active = false;
    });
    window.addEventListener('resize', resizeField);
    resizeField();
    drawField();
    window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame), { once: true });
  }

  // Run a matching electron orbit inside the secondary IEEE artwork.
  const artCanvas = document.querySelector('.electron-art-field');
  if (artCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const context = artCanvas.getContext('2d');
    const artStage = artCanvas.closest('.activity-art');
    const orbits = [
      { radiusX: 0.42, radiusY: 0.3, angle: 0.2, speed: 0.018, phase: 0 },
      { radiusX: 0.42, radiusY: 0.3, angle: -0.2, speed: -0.014, phase: 2.1 },
      { radiusX: 0.42, radiusY: 0.3, angle: 0, speed: 0.011, phase: 4.2 }
    ];
    let width = 0;
    let height = 0;
    let animationFrame;

    const resizeArt = () => {
      const scale = window.devicePixelRatio || 1;
      width = artStage.clientWidth;
      height = artStage.clientHeight;
      artCanvas.width = width * scale;
      artCanvas.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const drawArt = () => {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width * 0.5, height * 0.5);
      orbits.forEach((orbit) => {
        const radiusX = width * orbit.radiusX;
        const radiusY = height * orbit.radiusY;
        context.save();
        context.rotate(orbit.angle);
        context.beginPath();
        context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(247, 243, 234, 0.42)';
        context.stroke();
        const electronX = Math.cos(orbit.phase) * radiusX;
        const electronY = Math.sin(orbit.phase) * radiusY;
        context.beginPath();
        context.arc(electronX, electronY, 5, 0, Math.PI * 2);
        context.fillStyle = '#F2C078';
        context.shadowColor = '#F2C078';
        context.shadowBlur = 12;
        context.fill();
        context.restore();
        orbit.phase += orbit.speed;
      });
      context.restore();
      animationFrame = requestAnimationFrame(drawArt);
    };

    window.addEventListener('resize', resizeArt);
    resizeArt();
    drawArt();
    window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame), { once: true });
  }

  // Event tabs
  const eventTabs = document.querySelectorAll('.event-tab');
  eventTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      eventTabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', selected ? 'true' : 'false');
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
      });
    });
  });

  // Move dated events to the archive after their date has passed.
  const upcomingPanel = document.querySelector('#upcoming-events');
  const pastPanel = document.querySelector('#past-events');
  if (upcomingPanel && pastPanel) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    upcomingPanel.querySelectorAll('[data-event-date]').forEach((eventRow) => {
      const eventDate = new Date(`${eventRow.dataset.eventDate}T00:00:00`);
      if (!Number.isNaN(eventDate.getTime()) && eventDate < today) {
        const registrationLink = eventRow.querySelector('.event-status.open');
        if (registrationLink) {
          registrationLink.removeAttribute('href');
          registrationLink.removeAttribute('target');
          registrationLink.removeAttribute('rel');
          registrationLink.classList.remove('open');
          registrationLink.setAttribute('aria-disabled', 'true');
          registrationLink.setAttribute('tabindex', '-1');
          registrationLink.textContent = 'Registration closed';
        }
        pastPanel.appendChild(eventRow);
      }
    });
  }

  // Stagger reveal delays for items that share a grid/strip parent
  document.querySelectorAll('.grid, .stat-strip').forEach((group) => {
    const items = group.querySelectorAll(':scope > .reveal');
    items.forEach((el, i) => el.style.setProperty('--reveal-delay', `${Math.min(i * 0.08, 0.4)}s`));
  });

  // Scroll reveal + count-up stats
  const revealEls = document.querySelectorAll('.reveal');
  const animateCount = (el) => {
    const target = el.querySelector('.num');
    if (!target || !target.dataset.count) return;
    const end = parseInt(target.dataset.count, 10);
    const suffix = target.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      target.textContent = Math.round(eased * end) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          if (entry.target.classList.contains('stat')) animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => {
      el.classList.add('in');
      if (el.classList.contains('stat')) animateCount(el);
    });
  }

  // Join form (frontend-only placeholder — wire up to a backend/Google Form when ready)
  const form = document.querySelector('#join-form');
  const status = document.querySelector('#form-status');
  if (form && status && !form.action.includes('script.google.com')) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = 'Submitted. We will reach out on the email you provided.';
      status.className = 'success';
      form.reset();
    });
  }
});