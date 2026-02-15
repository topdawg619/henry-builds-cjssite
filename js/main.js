const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// before/after slider
const slider = document.getElementById('sliderRange');
const afterImage = document.querySelector('.after-image');
const handle = document.getElementById('sliderHandle');

if (slider && afterImage && handle) {
  const updateSlider = (value) => {
    const percentage = `${value}%`;
    afterImage.style.clipPath = `inset(0 0 0 ${percentage})`;
    handle.style.left = percentage;
  };

  slider.addEventListener('input', (e) => updateSlider(e.target.value));
  updateSlider(slider.value);
}

// price estimator + table sync
const estimateEl = document.getElementById('estimate');
const sizeSelect = document.getElementById('vehicleSize');
const packageSelect = document.getElementById('packageType');

const priceMatrix = {
  sedan: {
    signature: 320,
    interior: 210,
    exterior: 190,
    ceramic: 950,
  },
  suv: {
    signature: 380,
    interior: 260,
    exterior: 240,
    ceramic: 1150,
  },
};

const modeMultipliers = {
  standard: 1,
  member: 0.85,
};

let priceMode = 'standard';
const priceSpans = document.querySelectorAll('[data-package][data-size]');
const priceToggleButtons = document.querySelectorAll('[data-price-mode]');

const updateEstimate = () => {
  if (!estimateEl || !sizeSelect || !packageSelect) return;
  const size = sizeSelect.value;
  const pkg = packageSelect.value;
  const price = priceMatrix[size]?.[pkg] ?? 0;
  estimateEl.textContent = price ? `$${price.toLocaleString()}` : 'Custom quote';
};

const updateTablePrices = () => {
  priceSpans.forEach((span) => {
    const pkg = span.dataset.package;
    const size = span.dataset.size;
    const base = priceMatrix[size]?.[pkg];
    if (!base) {
      span.textContent = 'Custom';
      return;
    }
    const multiplier = modeMultipliers[priceMode] ?? 1;
    const value = Math.round(base * multiplier);
    span.textContent = `$${value.toLocaleString()}`;
  });
};

const setActiveToggle = () => {
  priceToggleButtons.forEach((btn) => {
    const isActive = btn.dataset.priceMode === priceMode;
    btn.classList.toggle('bg-accent', isActive);
    btn.classList.toggle('text-white', isActive);
    btn.classList.toggle('shadow-glow', isActive);
    btn.classList.toggle('bg-transparent', !isActive);
    btn.classList.toggle('text-slate-300', !isActive);
  });
};

if (priceToggleButtons.length) {
  priceToggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      priceMode = btn.dataset.priceMode;
      setActiveToggle();
      updateTablePrices();
    });
  });
  setActiveToggle();
  updateTablePrices();
}

if (sizeSelect && packageSelect) {
  sizeSelect.addEventListener('change', updateEstimate);
  packageSelect.addEventListener('change', updateEstimate);
  updateEstimate();
}
