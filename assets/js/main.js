document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scroll Effect
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 2. Ripple Effect on Buttons
  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  const rippleButtons = document.querySelectorAll('.btn-primary-custom, .btn-outline-custom');
  rippleButtons.forEach(btn => btn.addEventListener('click', createRipple));

  // 3. Fade-in on Scroll Animation using IntersectionObserver
  const fadeElems = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElems.forEach(elem => observer.observe(elem));
  } else {
    // Fallback for older browsers
    fadeElems.forEach(elem => elem.classList.add('appear'));
  }

  // 4. Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Stat Counter Animation
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0 && 'IntersectionObserver' in window) {
    const startCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = 2000 / target; // Total duration 2 seconds

      const updateCount = () => {
        const increment = Math.ceil(target / 100);
        if (count < target) {
          count += increment;
          if (count > target) count = target;
          el.innerText = count + suffix;
          setTimeout(updateCount, speed * increment);
        } else {
          el.innerText = target + suffix;
        }
      };
      updateCount();
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
  } else {
    // Fallback if no observer
    stats.forEach(stat => {
      stat.innerText = stat.getAttribute('data-target') + (stat.getAttribute('data-suffix') || '');
    });
  }

  // 6. Order Tracking Logic
  const trackForm = document.getElementById('tracking-form');
  const trackResult = document.getElementById('tracking-result');
  const trackError = document.getElementById('tracking-error');

  if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderId = document.getElementById('orderIdInput').value.trim().toUpperCase();

      if (orderId === 'LDY10254') {
        trackError.classList.add('d-none');
        trackResult.classList.remove('d-none');
        trackResult.classList.add('fade-in', 'appear');
        
        // Reset and trigger timeline animations
        const timelineSteps = document.querySelectorAll('.timeline-step');
        timelineSteps.forEach((step, idx) => {
          step.style.opacity = '0';
          step.style.transform = 'translateY(10px)';
          setTimeout(() => {
            step.style.transition = 'all 0.5s ease-out';
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
          }, idx * 200);
        });
      } else {
        trackResult.classList.add('d-none');
        trackError.classList.remove('d-none');
        trackError.classList.add('fade-in', 'appear');
      }
    });
  }

  // 7. Booking Page Calculator and Dynamic Receipt modal
  const pickupForm = document.getElementById('pickup-form');
  const summaryService = document.getElementById('summary-service');
  const summaryPrice = document.getElementById('summary-price');
  const summaryTax = document.getElementById('summary-tax');
  const summaryTotal = document.getElementById('summary-total');
  
  if (pickupForm) {
    const serviceSelect = document.getElementById('pickup-service');
    const pricingMap = {
      'wash-fold': 99,
      'wash-iron': 149,
      'dry-cleaning': 299,
      'shoe-cleaning': 199,
      'curtain-cleaning': 399,
      'carpet-cleaning': 599,
      'blanket-cleaning': 249,
      'express-service': 299
    };

    const updateSummary = () => {
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      const serviceName = selectedOption.text;
      const basePrice = pricingMap[serviceSelect.value] || 0;
      const tax = Math.round(basePrice * 0.18); // 18% GST/Tax
      const total = basePrice + tax;

      if (summaryService) summaryService.textContent = serviceName;
      if (summaryPrice) summaryPrice.textContent = `₹${basePrice}`;
      if (summaryTax) summaryTax.textContent = `₹${tax}`;
      if (summaryTotal) summaryTotal.textContent = `₹${total}`;
    };

    serviceSelect.addEventListener('change', updateSummary);
    updateSummary(); // Initial run

    // Form Submission & Modal Details populating
    pickupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Populate confirmation modal fields
      document.getElementById('modal-name').textContent = document.getElementById('pickup-name').value;
      document.getElementById('modal-phone').textContent = document.getElementById('pickup-phone').value;
      document.getElementById('modal-date').textContent = document.getElementById('pickup-date').value;
      document.getElementById('modal-time').textContent = document.getElementById('pickup-time').value;
      document.getElementById('modal-service').textContent = serviceSelect.options[serviceSelect.selectedIndex].text;
      document.getElementById('modal-total').textContent = summaryTotal.textContent;

      // Show confirmation modal using Bootstrap API
      const confirmModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
      confirmModal.show();
      
      // Reset form on modal dismiss
      document.getElementById('confirmationModal').addEventListener('hidden.bs.modal', () => {
        pickupForm.reset();
        updateSummary();
      }, { once: true });
    });
  }

  // 8. Contact Form and Newsletter alert simulator
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const alertPlaceholder = document.getElementById('contact-alert-placeholder');
      const wrapper = document.createElement('div');
      wrapper.innerHTML = [
        '<div class="alert alert-success alert-dismissible" role="alert">',
        '   <div><strong>Thank you!</strong> Your message has been received. Our team will get back to you shortly.</div>',
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('');
      alertPlaceholder.append(wrapper);
      contactForm.reset();
    });
  }

  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing to our newsletter! A welcome promo code has been sent to your email.');
      form.reset();
    });
  });
});
