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


const trackEvent = (eventName, label = null, payload = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    label,
    ...payload,
    timestamp: Date.now(),
  });
};

document.querySelectorAll('[data-analytics-event]').forEach((el) => {
  el.addEventListener('click', () => {
    trackEvent(el.dataset.analyticsEvent, el.dataset.analyticsLabel || null);
  });
});

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
      trackEvent('price_mode', btn.dataset.analyticsLabel || priceMode);
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

const vehicleSlider = document.getElementById('calcVehicles');
const vehiclesLabel = document.getElementById('calcVehiclesValue');
const planLabel = document.getElementById('calcPlanLabel');
const calcEstimateEl = document.getElementById('calcEstimate');
const calcSummaryEl = document.getElementById('calcSummary');
const frequencyButtons = document.querySelectorAll('[data-frequency]');

const frequencyMap = {
  monthly: { label: 'Monthly reset', visitsPerMonth: 1, rate: 119 },
  biweekly: { label: 'Bi-weekly ritual', visitsPerMonth: 2, rate: 105 },
  weekly: { label: 'Weekly collection care', visitsPerMonth: 4, rate: 95 },
};

let activeFrequency = 'biweekly';

const updateFrequencyButtons = () => {
  frequencyButtons.forEach((btn) => {
    const isActive = btn.dataset.frequency === activeFrequency;
    btn.classList.toggle('active', isActive);
  });
};

const updateCalculator = () => {
  if (!vehicleSlider) return;
  const meta = frequencyMap[activeFrequency];
  if (!meta) return;
  const vehicles = Number(vehicleSlider.value) || 1;
  const visitsPerMonth = vehicles * meta.visitsPerMonth;
  const monthlyInvestment = vehicles * meta.rate * meta.visitsPerMonth;
  if (vehiclesLabel) vehiclesLabel.textContent = vehicles === 1 ? '1 vehicle' : `${vehicles} vehicles`;
  if (planLabel) planLabel.textContent = meta.label;
  if (calcEstimateEl) calcEstimateEl.textContent = `$${monthlyInvestment.toLocaleString()}`;
  if (calcSummaryEl) calcSummaryEl.textContent = `${visitsPerMonth} visits / month · ${meta.label}`;
};

if (vehicleSlider && frequencyButtons.length) {
  vehicleSlider.addEventListener('input', () => {
    updateCalculator();
    trackEvent('calc_vehicle', vehicleSlider.value);
  });
  frequencyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFrequency = btn.dataset.frequency;
      updateFrequencyButtons();
      updateCalculator();
      trackEvent('calc_frequency', btn.dataset.frequency);
    });
  });
  updateFrequencyButtons();
  updateCalculator();
}
