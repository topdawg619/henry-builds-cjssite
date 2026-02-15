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

// price estimator
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

const updateEstimate = () => {
  if (!estimateEl || !sizeSelect || !packageSelect) return;
  const size = sizeSelect.value;
  const pkg = packageSelect.value;
  const price = priceMatrix[size]?.[pkg] ?? 0;
  estimateEl.textContent = price ? `$${price.toLocaleString()}` : 'Custom quote';
};

if (sizeSelect && packageSelect) {
  sizeSelect.addEventListener('change', updateEstimate);
  packageSelect.addEventListener('change', updateEstimate);
  updateEstimate();
}
