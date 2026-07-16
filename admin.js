// ============================================================ //
// RESIKU - ADMIN DASHBOARD (SUPABASE VERSION)                 //
// ============================================================ //

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://wolrdosummupkzihfhdt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbHJkb3N1bW11cGt6aWhmaGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMDc2MTcsImV4cCI6MjA5OTY4MzYxN30.lt0S-eZKTBDvdHkw_pEVWymw5SHAknSHze7zxrQYT9Y';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================ //
// 0. CHECK LOGIN                                               //
// ============================================================ //
if (localStorage.getItem('resiku_admin_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

// ============================================================ //
// 1. TOAST NOTIFICATION                                        //
// ============================================================ //
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ============================================================ //
// 2. SIDEBAR NAVIGATION                                        //
// ============================================================ //
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section-content');
const pageTitle = document.getElementById('pageTitle');

const titleMap = {
    dashboard: 'Dashboard',
    hero: 'Edit Hero Section',
    pricing: 'Edit Harga & Paket',
    testimonials: 'Edit Testimoni',
    faq: 'Edit FAQ',
    stats: 'Edit Statistik',
    features: 'Edit Fitur',
    risk: 'Edit Garansi',
    settings: 'Pengaturan Situs',
    valueprops: 'Edit Value Proposition',
    howitworks: 'Edit Cara Kerja',
    badges: 'Edit Trust Badges'
};

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(n => n.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        item.classList.add('active');

        const section = item.dataset.section;
        const targetSection = document.getElementById(`section-${section}`);
        if (targetSection) targetSection.classList.add('active');
        pageTitle.textContent = titleMap[section] || section;

        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar && window.innerWidth <= 768) sidebar.classList.remove('open');
    });
});

// ============================================================ //
// 3. DASHBOARD STATS                                           //
// ============================================================ //
async function updateDashboardStats() {
    const { data } = await supabase.from('stats').select('*').eq('id', 1).single();
    if (!data) return;
    document.getElementById('dashUsers').textContent = data.users.toLocaleString('id-ID');
    document.getElementById('dashComplex').textContent = data.complex.toLocaleString('id-ID');
    document.getElementById('dashTransactions').textContent = data.transactions.toLocaleString('id-ID');
    document.getElementById('dashRating').textContent = data.satisfaction + '%';
}

// ============================================================ //
// 4. HERO EDITOR                                                //
// ============================================================ //
async function populateHeroEditor() {
    const { data } = await supabase.from('hero_content').select('*').eq('id', 1).single();
    if (!data) return;
    document.getElementById('heroHeadline').value = data.headline || '';
    document.getElementById('heroSubheadline').value = data.subheadline || '';
    document.getElementById('heroCtaText').value = data.cta_text || '';
    document.getElementById('heroCtaLink').value = data.cta_link || '';
}

async function saveHero() {
    const payload = {
        id: 1,
        headline: document.getElementById('heroHeadline').value,
        subheadline: document.getElementById('heroSubheadline').value,
        cta_text: document.getElementById('heroCtaText').value,
        cta_link: document.getElementById('heroCtaLink').value,
        updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('hero_content').upsert(payload);
    if (error) console.error('Gagal simpan hero:', error.message);
}

// ============================================================ //
// 5. STATS EDITOR                                               //
// ============================================================ //
async function populateStatsEditor() {
    const { data } = await supabase.from('stats').select('*').eq('id', 1).single();
    if (!data) return;
    document.getElementById('statsUsers').value = data.users;
    document.getElementById('statsComplex').value = data.complex;
    document.getElementById('statsTransactions').value = data.transactions;
    document.getElementById('statsSatisfaction').value = data.satisfaction;
}

async function saveStats() {
    const payload = {
        id: 1,
        users: parseInt(document.getElementById('statsUsers').value) || 0,
        complex: parseInt(document.getElementById('statsComplex').value) || 0,
        transactions: parseInt(document.getElementById('statsTransactions').value) || 0,
        satisfaction: parseInt(document.getElementById('statsSatisfaction').value) || 0,
        updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('stats').upsert(payload);
    if (error) console.error('Gagal simpan statistik:', error.message);
    await updateDashboardStats();
}

// ============================================================ //
// 6. SITE SETTINGS EDITOR                                      //
// ============================================================ //
async function populateSettingsEditor() {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (!data) return;
    document.getElementById('settingsWA').value = data.whatsapp_number || '';
    document.getElementById('settingsEmail').value = data.contact_email || '';
    document.getElementById('settingsPhone').value = data.contact_phone || '';
    document.getElementById('settingsAddress').value = data.address || '';
    document.getElementById('settingsIG').value = data.instagram_url || '';
    document.getElementById('settingsTwitter').value = data.twitter_url || '';
    document.getElementById('settingsLinkedIn').value = data.linkedin_url || '';
}

async function saveSettings() {
    const payload = {
        id: 1,
        whatsapp_number: document.getElementById('settingsWA').value,
        contact_email: document.getElementById('settingsEmail').value,
        contact_phone: document.getElementById('settingsPhone').value,
        address: document.getElementById('settingsAddress').value,
        instagram_url: document.getElementById('settingsIG').value,
        twitter_url: document.getElementById('settingsTwitter').value,
        linkedin_url: document.getElementById('settingsLinkedIn').value,
        updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('site_settings').upsert(payload);
    if (error) console.error('Gagal simpan pengaturan:', error.message);
}

// ============================================================ //
// 7. VALUE PROPS                                                //
// ============================================================ //
async function renderValuePropsEditor() {
    const container = document.getElementById('valuePropsEditor');
    const { data } = await supabase.from('value_props').select('*').order('sort_order');
    container.innerHTML = (data || []).map((v, index) => `
        <div class="feature-editor" data-id="${v.id}" data-index="${index}">
            <div class="feature-header">
                <h4>Value Prop #${index + 1}</h4>
                <button class="btn-delete" data-delete-valueprop="${v.id}">🗑️ Hapus</button>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Ikon</label><input type="text" class="vp-icon" value="${v.icon || ''}" /></div>
                <div class="form-group"><label>Judul</label><input type="text" class="vp-title" value="${v.title || ''}" /></div>
            </div>
            <div class="form-group"><label>Deskripsi</label><textarea class="vp-desc" rows="2">${v.description || ''}</textarea></div>
        </div>
    `).join('');

    container.querySelectorAll('[data-delete-valueprop]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const { error } = await supabase.from('value_props').delete().eq('id', btn.dataset.deleteValueprop);
            if (error) return showToast('Gagal hapus: ' + error.message, 'error');
            showToast('Value prop dihapus', 'success');
            renderValuePropsEditor();
        });
    });
}

async function saveValueProps() {
    const container = document.getElementById('valuePropsEditor');
    const editors = container.querySelectorAll('.feature-editor');
    const rows = Array.from(editors).map((el, index) => ({
        id: el.dataset.id,
        icon: el.querySelector('.vp-icon').value,
        title: el.querySelector('.vp-title').value,
        description: el.querySelector('.vp-desc').value,
        sort_order: index
    }));
    if (rows.length === 0) return;
    const { error } = await supabase.from('value_props').upsert(rows);
    if (error) console.error('Gagal simpan value props:', error.message);
}

async function addValueProp() {
    const { error } = await supabase.from('value_props').insert({
        icon: '⭐', title: 'Judul Baru', description: 'Deskripsi...', sort_order: 999
    });
    if (error) return showToast('Gagal tambah: ' + error.message, 'error');
    showToast('Value prop ditambahkan', 'success');
    renderValuePropsEditor();
}

// ============================================================ //
// 8. HOW IT WORKS                                               //
// ============================================================ //
async function renderHowItWorksEditor() {
    const container = document.getElementById('howItWorksEditor');
    const { data } = await supabase.from('how_it_works_steps').select('*').order('sort_order');
    container.innerHTML = (data || []).map((s, index) => `
        <div class="feature-editor" data-id="${s.id}">
            <div class="feature-header">
                <h4>Langkah #${index + 1}</h4>
                <button class="btn-delete" data-delete-step="${s.id}">🗑️ Hapus</button>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Ikon</label><input type="text" class="step-icon" value="${s.icon || ''}" /></div>
                <div class="form-group"><label>Judul</label><input type="text" class="step-title" value="${s.title || ''}" /></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Estimasi Waktu</label><input type="text" class="step-time" value="${s.time_estimate || ''}" /></div>
            </div>
            <div class="form-group"><label>Deskripsi</label><textarea class="step-desc" rows="2">${s.description || ''}</textarea></div>
        </div>
    `).join('');

    container.querySelectorAll('[data-delete-step]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const { error } = await supabase.from('how_it_works_steps').delete().eq('id', btn.dataset.deleteStep);
            if (error) return showToast('Gagal hapus: ' + error.message, 'error');
            showToast('Langkah dihapus', 'success');
            renderHowItWorksEditor();
        });
    });
}

async function saveHowItWorks() {
    const container = document.getElementById('howItWorksEditor');
    const editors = container.querySelectorAll('.feature-editor');
    const rows = Array.from(editors).map((el, index) => ({
        id: el.dataset.id,
        icon: el.querySelector('.step-icon').value,
        title: el.querySelector('.step-title').value,
        time_estimate: el.querySelector('.step-time').value,
        description: el.querySelector('.step-desc').value,
        sort_order: index
    }));
    if (rows.length === 0) return;
    const { error } = await supabase.from('how_it_works_steps').upsert(rows);
    if (error) console.error('Gagal simpan how it works:', error.message);
}

async function addStep() {
    const { error } = await supabase.from('how_it_works_steps').insert({
        icon: '📝', title: 'Langkah Baru', description: 'Deskripsi...', time_estimate: '5 menit', sort_order: 999
    });
    if (error) return showToast('Gagal tambah: ' + error.message, 'error');
    showToast('Langkah ditambahkan', 'success');
    renderHowItWorksEditor();
}

// ============================================================ //
// 9. FEATURES                                                   //
// ============================================================ //
async function renderFeaturesEditor() {
    const container = document.getElementById('featuresEditor');
    const { data } = await supabase.from('features').select('*').order('sort_order');
    container.innerHTML = (data || []).map((f, index) => `
        <div class="feature-editor" data-id="${f.id}">
            <div class="feature-header">
                <h4>Fitur #${index + 1}</h4>
                <button class="btn-delete" data-delete-feature="${f.id}">🗑️ Hapus</button>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Ikon</label><input type="text" class="feat-icon" value="${f.icon || ''}" /></div>
                <div class="form-group"><label>Judul</label><input type="text" class="feat-title" value="${f.title || ''}" /></div>
            </div>
            <div class="form-group"><label>Deskripsi</label><textarea class="feat-desc" rows="2">${f.description || ''}</textarea></div>
        </div>
    `).join('');

    container.querySelectorAll('[data-delete-feature]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const { error } = await supabase.from('features').delete().eq('id', btn.dataset.deleteFeature);
            if (error) return showToast('Gagal hapus: ' + error.message, 'error');
            showToast('Fitur dihapus', 'success');
            renderFeaturesEditor();
        });
    });
}

async function saveFeatures() {
    const container = document.getElementById('featuresEditor');
    const editors = container.querySelectorAll('.feature-editor');
    const rows = Array.from(editors).map((el, index) => ({
        id: el.dataset.id,
        icon: el.querySelector('.feat-icon').value,
        title: el.querySelector('.feat-title').value,
        description: el.querySelector('.feat-desc').value,
        sort_order: index
    }));
    if (rows.length === 0) return;
    const { error } = await supabase.from('features').upsert(rows);
    if (error) console.error('Gagal simpan fitur:', error.message);
}

async function addFeatureGlobal() {
    const { error } = await supabase.from('features').insert({
        icon: '⭐', title: 'Fitur Baru', description: 'Deskripsi fitur baru...', sort_order: 999
    });
    if (error) return showToast('Gagal tambah: ' + error.message, 'error');
    showToast('Fitur ditambahkan', 'success');
    renderFeaturesEditor();
}

// ============================================================ //
// 10. RISK / GARANSI                                            //
// ============================================================ //
async function renderRiskEditor() {
    const container = document.getElementById('riskEditor');
    const { data } = await supabase.from('risk_items').select('*').order('sort_order');
    container.innerHTML = (data || []).map((r, index) => `
        <div class="risk-editor" data-id="${r.id}">
            <div class="risk-header">
                <h4>Garansi #${index + 1}</h4>
                <button class="btn-delete" data-delete-risk="${r.id}">🗑️ Hapus</button>
            </div>
            <div class="form-group"><label>Ikon</label><input type="text" class="risk-icon" value="${r.icon || ''}" /></div>
            <div class="form-group"><label>Judul</label><input type="text" class="risk-title" value="${r.title || ''}" /></div>
            <div class="form-group"><label>Deskripsi</label><textarea class="risk-desc" rows="2">${r.description || ''}</textarea></div>
        </div>
    `).join('');

    container.querySelectorAll('[data-delete-risk]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const { error } = await supabase.from('risk_items').delete().eq('id', btn.dataset.deleteRisk);
            if (error) return showToast('Gagal hapus: ' + error.message, 'error');
            showToast('Item garansi dihapus', 'success');
            renderRiskEditor();
        });
    });
}

async function saveRisk() {
    const container = document.getElementById('riskEditor');
    const editors = container.querySelectorAll('.risk-editor');
    const rows = Array.from(editors).map((el, index) => ({
        id: el.dataset.id,
        icon: el.querySelector('.risk-icon').value,
        title: el.querySelector('.risk-title').value,
        description: el.querySelector('.risk-desc').value,
        sort_order: index
    }));
    if (rows.length === 0) return;
    const { error } = await supabase.from('risk_items').upsert(rows);
    if (error) console.error('Gagal simpan garansi:', error.message);
}

async function addRiskItem() {
    const { error } = await supabase.from('risk_items').insert({
        icon: '⭐', title: 'Judul Garansi Baru', description: 'Deskripsi garansi baru...', sort_order: 999
    });
    if (error) return showToast('Gagal tambah: ' + error.message, 'error');
    showToast('Item garansi ditambahkan', 'success');
    renderRiskEditor();
}

// ============================================================ //
// 11. TRUST BADGES                                              //
// ============================================================ //
async function renderBadgesEditor() {
    const container = document.getElementById('badgesEditor');
    const { data } = await supabase.from('trust_badges').select('*').order('sort_order');
    container.innerHTML = (data || []).map((b, index) => `
        <div class="feature-editor" data-id="${b.id}">
            <div class="feature-header">
                <h4>Badge #${index + 1}</h4>
                <button class="btn-delete" data-delete-badge="${b.id}">🗑️ Hapus</button>
            </div>
            <div class="form-group"><label>Teks Badge</label><input type="text" class="badge-label" value="${b.label || ''}" /></div>
        </div>
    `).join('');

    container.querySelectorAll('[data-delete-badge]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const { error } = await supabase.from('trust_badges').delete().eq('id', btn.dataset.deleteBadge);
            if (error) return showToast('Gagal hapus: ' + error.message, 'error');
            showToast('Badge dihapus', 'success');
            renderBadgesEditor();
        });
    });
}

async function saveBadges() {
    const container = document.getElementById('badgesEditor');
    const editors = container.querySelectorAll('.feature-editor');
    const rows = Array.from(editors).map((el, index) => ({
        id: el.dataset.id,
        label: el.querySelector('.badge-label').value,
        sort_order: index
    }));
    if (rows.length === 0) return;
    const { error } = await supabase.from('trust_badges').upsert(rows);
    if (error) console.error('Gagal simpan badges:', error.message);
}

async function addBadge() {
    const { error } = await supabase.from('trust_badges').insert({ label: '🏆 Badge Baru', sort_order: 999 });
    if (error) return showToast('Gagal tambah: ' + error.message, 'error');
    showToast('Badge ditambahkan', 'success');
    renderBadgesEditor();
}

// ============================================================ //
// 12. FAQ                                                        //
// ============================================================ //
async function renderFaqEditor() {
    const container = document.getElementById('faqEditor');
    const { data } = await supabase.from('faqs').select('*').order('sort_order');
    container.innerHTML = (data || []).map((item, index) => `
        <div class="faq-editor" data-id="${item.id}">
            <div class="faq-header">
                <h4>FAQ #${index + 1}</h4>
                <button class="btn-delete" data-delete-faq="${item.id}">🗑️ Hapus</button>
            </div>
            <div class="form-group"><label>Pertanyaan</label><input type="text" class="faq-q" value="${item.question || ''}" /></div>
            <div class="form-group"><label>Jawaban</label><textarea class="faq-a" rows="3">${item.answer || ''}</textarea></div>
        </div>
    `).join('');

    container.querySelectorAll('[data-delete-faq]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const { error } = await supabase.from('faqs').delete().eq('id', btn.dataset.deleteFaq);
            if (error) return showToast('Gagal hapus: ' + error.message, 'error');
            showToast('FAQ dihapus', 'success');
            renderFaqEditor();
        });
    });
}

async function saveFaq() {
    const container = document.getElementById('faqEditor');
    const editors = container.querySelectorAll('.faq-editor');
    const rows = Array.from(editors).map((el, index) => ({
        id: el.dataset.id,
        question: el.querySelector('.faq-q').value,
        answer: el.querySelector('.faq-a').value,
        sort_order: index
    }));
    if (rows.length === 0) return;
    const { error } = await supabase.from('faqs').upsert(rows);
    if (error) console.error('Gagal simpan FAQ:', error.message);
}

async function addFaq() {
    const { error } = await supabase.from('faqs').insert({
        question: 'Pertanyaan baru?', answer: 'Jawaban untuk pertanyaan baru...', sort_order: 999
    });
    if (error) return showToast('Gagal tambah: ' + error.message, 'error');
    showToast('FAQ ditambahkan', 'success');
    renderFaqEditor();
}

// ============================================================ //
// 13. TESTIMONIALS                                              //
// ============================================================ //
async function renderTestimonialsEditor() {
    const container = document.getElementById('testimonialsEditor');
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    container.innerHTML = (data || []).map((t, index) => `
        <div class="testimonial-editor" data-id="${t.id}">
            <div class="testimonial-header">
                <h4>Testimoni #${index + 1}</h4>
                <button class="btn-delete" data-delete-testimonial="${t.id}">🗑️ Hapus</button>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Nama</label><input type="text" class="t-name" value="${t.name || ''}" /></div>
                <div class="form-group"><label>Role/Jabatan</label><input type="text" class="t-role" value="${t.role || ''}" /></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Avatar (emoji)</label><input type="text" class="t-avatar" value="${t.avatar || ''}" /></div>
                <div class="form-group"><label>Rating (1-5)</label><input type="number" class="t-rating" value="${t.rating || 5}" min="1" max="5" /></div>
            </div>
            <div class="form-group"><label>Isi Testimoni</label><textarea class="t-content" rows="3">${t.content || ''}</textarea></div>
        </div>
    `).join('');

    container.querySelectorAll('[data-delete-testimonial]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const { error } = await supabase.from('testimonials').delete().eq('id', btn.dataset.deleteTestimonial);
            if (error) return showToast('Gagal hapus: ' + error.message, 'error');
            showToast('Testimoni dihapus', 'success');
            renderTestimonialsEditor();
        });
    });
}

async function saveTestimonials() {
    const container = document.getElementById('testimonialsEditor');
    const editors = container.querySelectorAll('.testimonial-editor');
    const rows = Array.from(editors).map((el, index) => ({
        id: el.dataset.id,
        name: el.querySelector('.t-name').value,
        role: el.querySelector('.t-role').value,
        avatar: el.querySelector('.t-avatar').value,
        rating: parseInt(el.querySelector('.t-rating').value) || 5,
        content: el.querySelector('.t-content').value,
        sort_order: index
    }));
    if (rows.length === 0) return;
    const { error } = await supabase.from('testimonials').upsert(rows);
    if (error) console.error('Gagal simpan testimoni:', error.message);
}

async function addTestimonial() {
    const { error } = await supabase.from('testimonials').insert({
        name: 'Nama Baru', role: 'Role Baru', avatar: '👤', rating: 5, content: 'Isi testimoni di sini...', sort_order: 999
    });
    if (error) return showToast('Gagal tambah: ' + error.message, 'error');
    showToast('Testimoni ditambahkan', 'success');
    renderTestimonialsEditor();
}

// ============================================================ //
// 14. PRICING (plans + nested features)                        //
// ============================================================ //
async function renderPricingEditor() {
    const container = document.getElementById('pricingEditor');
    const { data: plans } = await supabase.from('pricing_plans').select('*').order('sort_order');
    const { data: features } = await supabase.from('pricing_features').select('*').order('sort_order');

    container.innerHTML = (plans || []).map((plan, index) => {
        const planFeatures = (features || []).filter(f => f.plan_id === plan.id);
        return `
        <div class="pricing-plan-editor ${plan.is_popular ? 'popular-editor' : ''}" data-id="${plan.id}" data-index="${index}">
            <div class="plan-header">
                <h4>📦 ${plan.name}</h4>
                <div class="plan-actions">
                    <button class="btn-make-popular" data-popular="${plan.id}">${plan.is_popular ? '⭐ Popular' : '☆ Set Popular'}</button>
                    <button class="btn-delete-plan" data-delete-plan="${plan.id}">🗑️ Hapus</button>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Nama Paket</label><input type="text" class="plan-name" value="${plan.name}" /></div>
                <div class="form-group"><label>Text Tombol CTA</label><input type="text" class="plan-cta" value="${plan.cta_text}" /></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Harga (Rp)</label><input type="number" class="plan-price" value="${plan.price}" /></div>
                <div class="form-group"><label>Periode</label><input type="text" class="plan-period" value="${plan.period}" /></div>
            </div>
            <div class="form-group">
                <label>Fitur</label>
                <div class="features-list-editor" data-features-for="${plan.id}">
                    ${planFeatures.map(f => `
                        <div class="feature-item-editor" data-feature-id="${f.id}">
                            <input type="text" class="pf-text" value="${f.text}" />
                            <div class="feature-status"><label><input type="checkbox" class="pf-active" ${f.active ? 'checked' : ''} /> Aktif</label></div>
                            <button class="btn-remove-feature" data-remove-pf="${f.id}">✕</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-add-feature" data-add-pf="${plan.id}">+ Tambah Fitur</button>
            </div>
        </div>`;
    }).join('');

    container.querySelectorAll('[data-popular]').forEach(btn => {
        btn.addEventListener('click', () => togglePopular(btn.dataset.popular));
    });
    container.querySelectorAll('[data-delete-plan]').forEach(btn => {
        btn.addEventListener('click', () => deletePlan(btn.dataset.deletePlan));
    });
    container.querySelectorAll('[data-remove-pf]').forEach(btn => {
        btn.addEventListener('click', () => removeFeatureRow(btn));
    });
    container.querySelectorAll('[data-add-pf]').forEach(btn => {
        btn.addEventListener('click', () => addFeatureRow(btn.dataset.addPf));
    });
}

function addFeatureRow(planId) {
    const list = document.querySelector(`[data-features-for="${planId}"]`);
    const div = document.createElement('div');
    div.className = 'feature-item-editor';
    div.dataset.featureId = '';
    div.innerHTML = `
        <input type="text" class="pf-text" value="Fitur baru" />
        <div class="feature-status"><label><input type="checkbox" class="pf-active" checked /> Aktif</label></div>
        <button class="btn-remove-feature">✕</button>
    `;
    div.querySelector('.btn-remove-feature').addEventListener('click', () => div.remove());
    list.appendChild(div);
}

async function removeFeatureRow(btn) {
    const featureId = btn.dataset.removePf;
    const row = btn.closest('.feature-item-editor');
    if (featureId) {
        const { error } = await supabase.from('pricing_features').delete().eq('id', featureId);
        if (error) return showToast('Gagal hapus fitur: ' + error.message, 'error');
    }
    row.remove();
    showToast('Fitur dihapus', 'success');
}

async function togglePopular(planId) {
    const { data: plans } = await supabase.from('pricing_plans').select('id');
    if (!plans) return;

    // set semua plan jadi is_popular = false dulu
    const { error: resetError } = await supabase
        .from('pricing_plans')
        .update({ is_popular: false })
        .in('id', plans.map(p => p.id));

    if (resetError) return showToast('Gagal update: ' + resetError.message, 'error');

    // baru set plan yang dipilih jadi true
    const { error } = await supabase
        .from('pricing_plans')
        .update({ is_popular: true })
        .eq('id', planId);

    if (error) return showToast('Gagal update: ' + error.message, 'error');
    showToast('Paket popular diupdate', 'success');
    renderPricingEditor();
}

async function deletePlan(planId) {
    const { error } = await supabase.from('pricing_plans').delete().eq('id', planId);
    if (error) return showToast('Gagal hapus: ' + error.message, 'error');
    showToast('Paket dihapus', 'success');
    renderPricingEditor();
}

async function addPlan() {
    const { error } = await supabase.from('pricing_plans').insert({
        name: 'Paket Baru', price: 75000, period: '/bulan', is_popular: false, cta_text: 'Pilih Paket', sort_order: 999
    });
    if (error) return showToast('Gagal tambah: ' + error.message, 'error');
    showToast('Paket ditambahkan', 'success');
    renderPricingEditor();
}

async function savePricing() {
    const container = document.getElementById('pricingEditor');
    const planEditors = container.querySelectorAll('.pricing-plan-editor');

    for (const [index, el] of Array.from(planEditors).entries()) {
        const planId = el.dataset.id;

        await supabase.from('pricing_plans').update({
            name: el.querySelector('.plan-name').value,
            price: parseInt(el.querySelector('.plan-price').value) || 0,
            period: el.querySelector('.plan-period').value,
            cta_text: el.querySelector('.plan-cta').value,
            sort_order: index
        }).eq('id', planId);

        const featureRows = el.querySelectorAll('.feature-item-editor');
        for (const [fIndex, fEl] of Array.from(featureRows).entries()) {
            const featureId = fEl.dataset.featureId;
            const text = fEl.querySelector('.pf-text').value;
            const active = fEl.querySelector('.pf-active').checked;

            if (featureId) {
                await supabase.from('pricing_features').update({ text, active, sort_order: fIndex }).eq('id', featureId);
            } else {
                await supabase.from('pricing_features').insert({ plan_id: planId, text, active, sort_order: fIndex });
            }
        }
    }
    renderPricingEditor();
}

// ============================================================ //
// 15. SAVE ALL BUTTON (satu-satunya cara simpan)                //
// ============================================================ //
document.getElementById('saveAllBtn')?.addEventListener('click', async () => {
    const btn = document.getElementById('saveAllBtn');
    btn.disabled = true;
    btn.textContent = '💾 Menyimpan...';

    try {
        await saveHero();
        await saveStats();
        await saveSettings();
        await saveValueProps();
        await saveHowItWorks();
        await savePricing();
        await saveTestimonials();
        await saveFaq();
        await saveFeatures();
        await saveRisk();
        await saveBadges();
        await updateDashboardStats();
        showToast('💾 Semua perubahan berhasil disimpan!', 'success');
    } catch (err) {
        console.error(err);
        showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Save All Changes';
    }
});

// ============================================================ //
// 16. LOGOUT                                                    //
// ============================================================ //
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem('resiku_admin_logged_in');
        localStorage.removeItem('resiku_admin_username');
        window.location.href = 'login.html';
    }
});

// ============================================================ //
// 17. MOBILE SIDEBAR TOGGLE                                     //
// ============================================================ //
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '☰';
menuToggle.style.cssText = `display:none;position:fixed;top:16px;left:16px;z-index:200;padding:10px 14px;background:white;border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:20px;box-shadow:0 2px 12px rgba(0,0,0,0.08);`;
document.body.appendChild(menuToggle);

if (window.innerWidth <= 768) menuToggle.style.display = 'block';

window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        menuToggle.style.display = 'block';
    } else {
        menuToggle.style.display = 'none';
        document.querySelector('.admin-sidebar')?.classList.remove('open');
    }
});

menuToggle.addEventListener('click', () => {
    document.querySelector('.admin-sidebar').classList.toggle('open');
});

document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.admin-sidebar');
    if (window.innerWidth <= 768 && sidebar && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// ============================================================ //
// 18. ADD BUTTONS                                                //
// ============================================================ //
document.getElementById('addPlanBtn')?.addEventListener('click', addPlan);
document.getElementById('addTestimonialBtn')?.addEventListener('click', addTestimonial);
document.getElementById('addFaqBtn')?.addEventListener('click', addFaq);
document.getElementById('addFeatureBtn')?.addEventListener('click', addFeatureGlobal);
document.getElementById('addRiskBtn')?.addEventListener('click', addRiskItem);
document.getElementById('addValuePropBtn')?.addEventListener('click', addValueProp);
document.getElementById('addStepBtn')?.addEventListener('click', addStep);
document.getElementById('addBadgeBtn')?.addEventListener('click', addBadge);

// ============================================================ //
// 19. INITIALIZE                                                //
// ============================================================ //
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        populateHeroEditor(),
        renderPricingEditor(),
        renderTestimonialsEditor(),
        renderFaqEditor(),
        populateStatsEditor(),
        renderFeaturesEditor(),
        renderRiskEditor(),
        populateSettingsEditor(),
        renderValuePropsEditor(),
        renderHowItWorksEditor(),
        renderBadgesEditor(),
        updateDashboardStats()
    ]);
    console.log('🚀 ResiKu Admin Dashboard loaded (Supabase)!');
});

// ============================================================ //
// 20. KEYBOARD SHORTCUTS                                        //
// ============================================================ //
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        document.getElementById('saveAllBtn')?.click();
    }
    if (e.key === 'Escape') {
        document.querySelector('.admin-sidebar')?.classList.remove('open');
    }
});