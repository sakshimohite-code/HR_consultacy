var express = require('express');
var router = express.Router();
var exe = require('../conn');

// ================= SESSION BASED LOGIN =================

// Hardcoded admin credentials
const adminUser = { username: 'admin', password: 'admin' };

// Login page
router.get('/login', (req, res) => {
    res.render('admin/login.ejs', { error: null });
});

// Handle login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminUser.username && password === adminUser.password) {
        req.session.adminLoggedIn = true;
        res.redirect('/admin');
    } else {
        res.render('admin/login.ejs', { error: 'Invalid Username or Password' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

// ================= AUTH MIDDLEWARE =================
function checkAdminAuth(req, res, next) {
    if (req.session && req.session.adminLoggedIn) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

// ================= DASHBOARD =================
router.get('/', (req, res) => {
    if (req.session && req.session.adminLoggedIn) {
        res.render('admin/dashboard.ejs');
    } else {
        res.redirect('/admin/login');
    }
});

// ================= APPLY AUTH =================
router.use(checkAdminAuth);

// ================= WE SERVE INDUSTRY =================
router.get('/we_serve_industry', async (req, res) => {
    var data = await exe("SELECT * FROM we_serve_industry");
    res.render('admin/we_serve_industry.ejs', { we_serve_industry_data: data });
});

router.post('/save_we_serve_industry', async (req, res) => {
    var d = req.body;
    await exe(
        "INSERT INTO we_serve_industry (we_serve_industry_icon,we_serve_industry_title,we_serve_industry_description) VALUES (?,?,?)",
        [d.we_serve_industry_icon, d.we_serve_industry_title, d.we_serve_industry_description]
    );
    res.redirect('/admin/we_serve_industry');
});

router.get('/delete_we_serve_industry/:id', async (req, res) => {
    await exe("DELETE FROM we_serve_industry WHERE id=?", [req.params.id]);
    res.redirect('/admin/we_serve_industry');
});

router.get('/edit_we_serve_industry/:id', async (req, res) => {
    var data = await exe("SELECT * FROM we_serve_industry WHERE id=?", [req.params.id]);
    res.render('admin/edit_we_serve_industry.ejs', { we_serve_industry: data });
});

router.post('/update_we_serve_industry/:id', async (req, res) => {
    var d = req.body;
    await exe(
        "UPDATE we_serve_industry SET we_serve_industry_icon=?, we_serve_industry_title=?, we_serve_industry_description=? WHERE id=?",
        [d.we_serve_industry_icon, d.we_serve_industry_title, d.we_serve_industry_description, req.params.id]
    );
    res.redirect('/admin/we_serve_industry');
});

// ================= ADD SERVICES =================

// show add service page
router.get('/add_services', async (req, res) => {
    var services_data = await exe("SELECT * FROM services");
    res.render('admin/add_services.ejs', { services_data });
});

// save service
router.post('/save_service', async (req, res) => {
    var d = req.body;

    await exe(
        "INSERT INTO services (service_title, service_icon, service_description, service_points) VALUES (?,?,?,?)",
        [d.service_title, d.service_icon, d.service_description, d.service_points]
    );

    res.redirect('/admin/add_services');
});

// delete service
router.get('/delete_service/:id', async (req, res) => {
    await exe("DELETE FROM services WHERE service_id=?", [req.params.id]);
    res.redirect('/admin/add_services');
});

// edit service
router.get('/edit_service/:id', async (req, res) => {
    var service = await exe("SELECT * FROM services WHERE service_id=?", [req.params.id]);
    res.render('admin/edit_service.ejs', { service });
});

// update service
router.post('/update_service/:id', async (req, res) => {
    var d = req.body;
    await exe(
        "UPDATE services SET service_title=?, service_icon=?, service_description=?, service_points=? WHERE service_id=?",
        [d.service_title, d.service_icon, d.service_description, d.service_points, req.params.id]
    );
    res.redirect('/admin/add_services');
});

// ================= LATEST JOBS =================
router.get('/latest_jobs', async (req, res) => {
    var data = await exe("SELECT * FROM latest_jobs");
    res.render('admin/latest_jobs.ejs', { latest_jobs_data: data });
});

// ================= COMPANY LIST =================
router.get('/company_list', async (req, res) => {
    var data = await exe("SELECT * FROM company_list");
    res.render('admin/Company_list.ejs', { company_list_data: data });
});

// ================= ABOUT =================
router.get('/about', async (req, res) => {
    var about_data = await exe("SELECT * FROM about LIMIT 1");
    res.render('admin/about.ejs', { about_data });
});

// ================= CONTACT =================
router.get('/contact', async (req, res) => {
    var contact_data = await exe("SELECT * FROM contact");
    res.render('admin/contact.ejs', { contact_data });
});

// ================= JOB APPLY =================
router.get('/job_apply', async (req, res) => {
    var job_apply_data = await exe("SELECT * FROM job_apply");
    res.render('admin/job_apply.ejs', { job_apply_data });
});

module.exports = router;
