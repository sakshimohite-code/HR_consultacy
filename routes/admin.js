var express = require('express');
var router = express.Router();
var exe = require('../conn');

// ---------------- SESSION BASED LOGIN ----------------

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
        res.redirect('/admin'); // login नंतर dashboard ला redirect
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

// ---------------- AUTH MIDDLEWARE ----------------
function checkAdminAuth(req, res, next) {
    if (req.session && req.session.adminLoggedIn) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

// ---------------- DASHBOARD ----------------
// /admin वर first access
router.get('/', (req, res) => {
    if (req.session && req.session.adminLoggedIn) {
        res.render('admin/dashboard.ejs'); // login झालेल्यास dashboard
    } else {
        res.redirect('/admin/login'); // नाही तर login page
    }
});

// ---------------- APPLY AUTH MIDDLEWARE ----------------
// login झाल्यानंतरचे सर्व CRUD routes
router.use(checkAdminAuth);

// ---------------- WE SERVE INDUSTRY ----------------
router.get('/we_serve_industry', async (req, res) => {
    var data = await exe("select * from we_serve_industry");
    res.render('admin/we_serve_industry.ejs', { we_serve_industry_data: data });
});

router.post('/save_we_serve_industry', async (req, res) => {
    var d = req.body;
    await exe(
        "insert into we_serve_industry(we_serve_industry_icon,we_serve_industry_title,we_serve_industry_description) values(?,?,?)",
        [d.we_serve_industry_icon, d.we_serve_industry_title, d.we_serve_industry_description]
    );
    res.redirect('/admin/we_serve_industry');
});

router.get('/delete_we_serve_industry/:id', async (req, res) => {
    await exe("delete from we_serve_industry where id=?", [req.params.id]);
    res.redirect('/admin/we_serve_industry');
});

router.get('/edit_we_serve_industry/:id', async (req, res) => {
    var data = await exe("select * from we_serve_industry where id=?", [req.params.id]);
    res.render('admin/edit_we_serve_industry.ejs', { we_serve_industry: data });
});

router.post('/update_we_serve_industry/:id', async (req, res) => {
    var d = req.body;
    await exe(
        "update we_serve_industry set we_serve_industry_icon=?, we_serve_industry_title=?, we_serve_industry_description=? where id=?",
        [d.we_serve_industry_icon, d.we_serve_industry_title, d.we_serve_industry_description, req.params.id]
    );
    res.redirect('/admin/we_serve_industry');
});

// ---------------- LATEST JOBS ----------------
router.get('/latest_jobs', async (req, res) => {
    var data = await exe("select * from latest_jobs");
    res.render('admin/latest_jobs.ejs', { latest_jobs_data: data });
});

router.post('/save_latest_jobs', async (req, res) => {
    var d = req.body;
    await exe(
        "insert into latest_jobs(job_role,company_name,company_location,emp_exp,job_desc,emp_lang,job_package) values(?,?,?,?,?,?,?)",
        [d.job_role, d.company_name, d.company_location, d.emp_exp, d.job_desc, d.emp_lang, d.job_package]
    );
    res.redirect('/admin/latest_jobs');
});

router.get('/delete_latest_jobs/:id', async (req, res) => {
    await exe("delete from latest_jobs where latest_jobs_id=?", [req.params.id]);
    res.redirect('/admin/latest_jobs');
});

router.get('/edit_latest_jobs/:id', async (req, res) => {
    var job = await exe("select * from latest_jobs where latest_jobs_id=?", [req.params.id]);
    res.render('admin/edit_latest_jobs.ejs', { job });
});

router.post('/update_latest_job/:id', async (req, res) => {
    var d = req.body;
    await exe(
        "update latest_jobs set job_role=?, company_name=?, company_location=?, emp_exp=?, job_desc=?, emp_lang=?, job_package=? where latest_jobs_id=?",
        [d.job_role, d.company_name, d.company_location, d.emp_exp, d.job_desc, d.emp_lang, d.job_package, req.params.id]
    );
    res.redirect('/admin/latest_jobs');
});

// ---------------- COMPANY LIST ----------------
router.get('/company_list', async (req, res) => {
    var data = await exe("select * from company_list");
    res.render('admin/Company_list.ejs', { company_list_data: data });
});

router.post('/save_company', async (req, res) => {
    var filename = "";
    if (req.files && req.files.company_logo) {
        filename = Date.now() + "_" + req.files.company_logo.name;
        req.files.company_logo.mv("uploads/images/" + filename);
    }
    await exe("insert into company_list(company_logo) values(?)", [filename]);
    res.redirect('/admin/company_list');
});

// ---------------- ABOUT ----------------
router.get('/about', async (req, res) => {
    var about_data = await exe("select * from about limit 1");
    res.render('admin/about.ejs', { about_data });
});

// ---------------- CONTACT ----------------
router.get('/contact', async (req, res) => {
    var contact_data = await exe("select * from contact");
    res.render('admin/contact.ejs', { contact_data });
});

// ---------------- JOB APPLY ----------------
router.get('/job_apply', async (req, res) => {
    var job_apply_data = await exe("select * from job_apply");
    res.render('admin/job_apply.ejs', { job_apply_data });
});

module.exports = router;
