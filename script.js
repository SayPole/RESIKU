// ============================================================ //
// RESIKU - LANDING PAGE (SUPABASE VERSION)                    //
// ============================================================ //

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://wolrdosummupkzihfhdt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbHJkb3N1bW11cGt6aWhmaGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMDc2MTcsImV4cCI6MjA5OTY4MzYxN30.lt0S-eZKTBDvdHkw_pEVWymw5SHAknSHze7zxrQYT9Y';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. NAVBAR SCROLL + PROGRESS
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
    navbar.classList.toggle('scrolled', scrollY > 50);
    scrollProgress.style.width = progress + '%';
});

// 2. HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// 3. SCROLL-TRIGGERED ANIMATIONS
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

function observeAnimatables(root = document) {
    root.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// 4. COUNTER ANIMATION
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const el = entry.target;
        if (!entry.isIntersecting || el.dataset.counted === 'true') return;
        el.dataset.counted = 'true';

        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString('id-ID') + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString('id-ID') + suffix;
        }
        requestAnimationFrame(update);
    });
}, { threshold: 0.5 });

function observeCounters(root = document) {
    root.querySelectorAll('.js-counter[data-target]').forEach(el => counterObserver.observe(el));
}

function setCounterTarget(el, value) {
    if (!el) return;
    el.setAttribute('data-target', value);
    el.dataset.counted = 'false';
    el.textContent = '0';
}

// 5. RENDER: HERO
async function renderHero() {
    const { data, error } = await supabase.from('hero_content').select('*').eq('id', 1).single();
    if (error || !data) return console.error('Gagal load hero:', error);

    const title = document.getElementById('heroTitle');
    const desc = document.getElementById('heroDesc');
    const ctaBtn = document.getElementById('heroCtaBtn');
    if (title && data.headline) title.innerHTML = data.headline;
    if (desc && data.subheadline) desc.innerHTML = data.subheadline;
    if (ctaBtn && data.cta_text) ctaBtn.textContent = data.cta_text;
    if (ctaBtn && data.cta_link) ctaBtn.setAttribute('href', data.cta_link);
}

// 6. RENDER: STATS
async function renderStats() {
    const { data, error } = await supabase.from('stats').select('*').eq('id', 1).single();
    if (error || !data) return console.error('Gagal load stats:', error);

    setCounterTarget(document.getElementById('statUsers'), data.users);
    setCounterTarget(document.getElementById('statTransactions'), data.transactions);
    setCounterTarget(document.getElementById('statSatisfaction'), data.satisfaction);
    setCounterTarget(document.getElementById('statComplex'), data.complex);

    // hero mini-stats (urutan sesuai markup: users, complex, satisfaction)
    const heroCounters = document.querySelectorAll('.hero-stats .js-counter');
    if (heroCounters[0]) setCounterTarget(heroCounters[0], data.users);
    if (heroCounters[1]) setCounterTarget(heroCounters[1], data.complex);
    if (heroCounters[2]) setCounterTarget(heroCounters[2], data.satisfaction);

    // CTA akhir pakai angka users & complex juga
    const ctaSub = document.querySelector('.cta-wrapper p');
    if (ctaSub) {
        ctaSub.textContent = `Bergabung dengan ${data.users.toLocaleString('id-ID')}+ pengurus komplek & ${data.complex.toLocaleString('id-ID')}+ komplek yang sudah pakai ResiKu.`;
    }
}

// 7. RENDER: VALUE PROPS
async function renderValueProps() {
    const grid = document.querySelector('.props-grid');
    if (!grid) return;
    const { data, error } = await supabase.from('value_props').select('*').order('sort_order');
    if (error) return console.error('Gagal load value props:', error);

    grid.innerHTML = (data || []).map((v, i) => `
        <div class="prop-card animate-on-scroll" style="animation-delay:${i * 0.08}s">
            <div class="prop-icon">${v.icon}</div>
            <h3>${v.title}</h3>
            <p>${v.description}</p>
        </div>
    `).join('');
    observeAnimatables(grid);
}

// 8. RENDER: HOW IT WORKS
async function renderHowItWorks() {
    const wrapper = document.querySelector('.steps');
    if (!wrapper) return;
    const { data, error } = await supabase.from('how_it_works_steps').select('*').order('sort_order');
    if (error) return console.error('Gagal load how it works:', error);

    const items = data || [];
    wrapper.innerHTML = items.map((s, i) => `
        <div class="step animate-on-scroll" style="animation-delay:${i * 0.12}s">
            <span class="step-num">No. ${String(i + 1).padStart(2, '0')}</span>
            <div class="step-icon">${s.icon}</div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <span class="step-time">⏱ ${s.time_estimate || ''}</span>
        </div>
        ${i < items.length - 1 ? '<div class="step-connector" aria-hidden="true"></div>' : ''}
    `).join('');
    observeAnimatables(wrapper);
}

// 9. RENDER: FEATURES
async function renderFeatures() {
    const grid = document.getElementById('featuresGrid');
    if (!grid) return;
    const { data, error } = await supabase.from('features').select('*').order('sort_order');
    if (error) return console.error('Gagal load features:', error);

    grid.innerHTML = (data || []).map((f, i) => `
        <div class="feature-card animate-on-scroll" style="animation-delay:${i * 0.06}s">
            <div class="feature-icon">${f.icon}</div>
            <h3>${f.title}</h3>
            <p>${f.description}</p>
        </div>
    `).join('');
    observeAnimatables(grid);
}

// 10. RENDER: RISK REVERSAL
async function renderRiskReversal() {
    const wrapper = document.getElementById('riskWrapper');
    if (!wrapper) return;
    const { data, error } = await supabase.from('risk_items').select('*').order('sort_order');
    if (error) return console.error('Gagal load risk items:', error);

    const items = data || [];
    wrapper.innerHTML = items.map((item, i) => `
        <div class="risk-item animate-on-scroll" style="animation-delay:${i * 0.08}s">
            <span class="risk-icon">${item.icon}</span>
            <div><h4>${item.title}</h4><p>${item.description}</p></div>
        </div>
        ${i < items.length - 1 ? '<div class="risk-divider"></div>' : ''}
    `).join('');
    observeAnimatables(wrapper);
}

// 11. RENDER: PRICING
async function renderPricing() {
    const grid = document.getElementById('pricingGrid');
    if (!grid) return;

    const { data: plans, error: e1 } = await supabase.from('pricing_plans').select('*').order('sort_order');
    if (e1) return console.error('Gagal load pricing plans:', e1);

    const { data: features, error: e2 } = await supabase.from('pricing_features').select('*').order('sort_order');
    if (e2) return console.error('Gagal load pricing features:', e2);

    grid.innerHTML = (plans || []).map(plan => {
        const planFeatures = (features || []).filter(f => f.plan_id === plan.id);
        return `
        <div class="pricing-card ${plan.is_popular ? 'popular' : ''}">
            ${plan.is_popular ? '<div class="pricing-badge">Paling Diminati</div>' : ''}
            <div class="pricing-name">${plan.name}</div>
            <div class="pricing-price">Rp ${Number(plan.price).toLocaleString('id-ID')} <span>${plan.period}</span></div>
            <div class="pricing-period">Tagihan bulanan, berhenti kapan saja</div>
            <div class="pricing-perforation" aria-hidden="true"></div>
            <ul class="pricing-features">
                ${planFeatures.map(f => `
                    <li class="${f.active ? '' : 'inactive'}">
                        <span class="${f.active ? 'check' : 'dash'}">${f.active ? '✓' : '–'}</span>
                        ${f.text}
                    </li>
                `).join('')}
            </ul>
            <a href="#demo" class="pricing-btn ${plan.is_popular ? '' : 'outline'}">${plan.cta_text}</a>
        </div>`;
    }).join('');
}

// 12. RENDER: TESTIMONIALS
async function renderTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order');
    if (error) return console.error('Gagal load testimonials:', error);

    grid.innerHTML = (data || []).map(t => `
        <div class="testimonial-card animate-on-scroll">
            <div class="testimonial-avatar">${t.avatar}</div>
            <div class="testimonial-rating">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
            <p class="testimonial-content">"${t.content}"</p>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-role">${t.role}</div>
        </div>
    `).join('');
    observeAnimatables(grid);
}

// 13. RENDER: TRUST BADGES
async function renderTrustBadges() {
    const wrapper = document.querySelector('.badges-wrapper');
    if (!wrapper) return;
    const { data, error } = await supabase.from('trust_badges').select('*').order('sort_order');
    if (error) return console.error('Gagal load trust badges:', error);

    wrapper.innerHTML = (data || []).map(b => `<div class="badge-item">${b.label}</div>`).join('');
}

// 14. RENDER: FAQ (accessible accordion)
async function renderFaq() {
    const list = document.getElementById('faqList');
    if (!list) return;
    const { data, error } = await supabase.from('faqs').select('*').order('sort_order');
    if (error) return console.error('Gagal load faq:', error);

    const items = data || [];
    list.innerHTML = items.map((item, i) => `
        <div class="faq-item ${i === 0 ? 'active' : ''}">
            <button class="faq-question" type="button" aria-expanded="${i === 0}">
                <span>${item.question}</span>
                <span class="faq-toggle" aria-hidden="true">▼</span>
            </button>
            <div class="faq-answer"><p>${item.answer}</p></div>
        </div>
    `).join('');

    const faqItems = list.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const willOpen = !item.classList.contains('active');
            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (willOpen) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// 15. RENDER: SITE SETTINGS (WA number, footer, social)
async function renderSiteSettings() {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (error || !data) return console.error('Gagal load site settings:', error);

    // Floating WA button
    const supportBtn = document.getElementById('supportBtn');
    if (supportBtn) {
        supportBtn.dataset.phone = data.whatsapp_number;
    }

    // Footer
    const emailLink = document.querySelector('.footer-links a[href^="mailto:"]');
    if (emailLink && data.contact_email) {
        emailLink.href = `mailto:${data.contact_email}`;
        emailLink.textContent = `📧 ${data.contact_email}`;
    }
    const phoneLink = document.querySelector('.footer-links a[href^="tel:"]');
    if (phoneLink && data.contact_phone) {
        phoneLink.href = `tel:${data.contact_phone.replace(/[^0-9+]/g, '')}`;
        phoneLink.textContent = `📞 ${data.contact_phone}`;
    }
    const addressLinks = document.querySelectorAll('.footer-links a');
    addressLinks.forEach(a => {
        if (a.textContent.includes('📍') && data.address) {
            a.textContent = `📍 ${data.address}`;
        }
    });

    const socialLinks = document.querySelectorAll('.footer-social .social-link');
    if (socialLinks[0] && data.instagram_url) socialLinks[0].href = data.instagram_url;
    if (socialLinks[1] && data.twitter_url) socialLinks[1].href = data.twitter_url;
    if (socialLinks[3] && data.linkedin_url) socialLinks[3].href = data.linkedin_url;
}

// 16. DEMO FORM → SIMPAN KE SUPABASE
const demoForm = document.getElementById('demoForm');
const demoFormMsg = document.getElementById('demoFormMsg');

function showFormMessage(text, type) {
    demoFormMsg.textContent = text;
    demoFormMsg.className = `demo-form-msg ${type}`;
    demoFormMsg.hidden = false;
}

demoForm?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('demoName').value.trim();
    const email = document.getElementById('demoEmail').value.trim();
    const phone = document.getElementById('demoPhone').value.trim();
    const complexName = document.getElementById('demoComplex').value.trim();
    const message = document.getElementById('demoMessage').value.trim();

    if (!name || !email || !phone) {
        showFormMessage('Mohon isi Nama, Email, dan Nomor WhatsApp.', 'error');
        return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    const { error } = await supabase.from('demo_requests').insert({
        name, email, phone,
        complex_name: complexName,
        message
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Minta Demo Sekarang';

    if (error) {
        console.error('Gagal kirim demo request:', error);
        showFormMessage('Gagal mengirim. Silakan coba lagi.', 'error');
        return;
    }

    showFormMessage('Terima kasih! Tim kami akan menghubungi Anda dalam 1x24 jam.', 'success');
    this.reset();
});

// 17. SMOOTH SCROLL FOR ANCHOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// 18. FLOATING SUPPORT BUTTON (WA number dari site_settings)
document.getElementById('supportBtn')?.addEventListener('click', function () {
    const phone = (this.dataset.phone || '6281234567890').replace(/[^0-9]/g, '');
    const message = 'Halo ResiKu, saya ingin bertanya tentang...';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
});

// 19. LOGO CLICK - SCROLL TO TOP
document.querySelector('.logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 20. LAZY LOAD IMAGES
document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
});

// 21. INITIALIZE
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        renderHero(),
        renderStats(),
        renderValueProps(),
        renderHowItWorks(),
        renderFeatures(),
        renderRiskReversal(),
        renderPricing(),
        renderTestimonials(),
        renderTrustBadges(),
        renderFaq(),
        renderSiteSettings()
    ]);

    observeAnimatables();
    observeCounters();

    console.log('🧾 ResiKu Landing Page loaded (Supabase)!');
});