var express = require('express');
var exe = require('../conn');
var router = express.Router();
var path = require('path');

//home page
router.get('/', async   function(req, res) {

    var sql = "select * from we_serve_industry";
      var we_serve_industry_data = await exe(sql);

 var sql1 = "SELECT * FROM latest_jobs LIMIT 2";
var latest_jobs_data = await exe(sql1);



      var sql2= "select * from company_list";
      var company_list = await exe(sql2);


  var packet = { we_serve_industry_data, latest_jobs_data, company_list };
    res.render('user/index.ejs', packet);
});
// about page

router.get('/about', async  function(req, res) {
    var sql = "select * from about";
    var about_data = await exe(sql);

    res.render('user/about.ejs', { about_data });
});

// services page
router.get('/services', async function(req, res) {

    var sql = "SELECT * FROM services";
    var services_data = await exe(sql);

    res.render('user/services.ejs', { services_data });
});


// jobs page
router.get('/jobs', async function(req, res) {
      var sql1 = "select * from latest_jobs";
      var latest_jobs_data = await exe(sql1);
    res.render('user/jobs.ejs', { latest_jobs_data });
});


// contact page
router.get('/contact', function(req, res) {
    res.render('user/contact.ejs');
});


router.post('/save_contact', async function(req, res) {
    var d = req.body;
    var sql = "insert into contact (fullname, email, phone, subject, message) values (?, ?, ?, ?, ?)";
    var result = await exe(sql, [d.fullname, d.email, d.phone, d.subject, d.message]);
    res.redirect('/contact');
});


// apply page
router.get('/apply', function(req, res) {

    
    res.render('user/apply.ejs');
});



router.post('/save_apply',   async function(req, res) {
    var data = req.body;
    var resume = req.files.resume;
    var fileName = Date.now() + "_" + resume.name;
    var uploadPath = path.join(__dirname, "../uploads/", fileName);
    resume.mv(uploadPath);
    var sql = `
        INSERT INTO job_apply
        (first_name, last_name, email, phone, address, jobposition,
         experience, skills, resume)
        VALUES
        ('${data.first_name}', '${data.last_name}', '${data.email}',
         '${data.phone}', '${data.address}', '${data.jobposition}',
         '${data.experience}', '${data.skills}',
         '${fileName}')
    `;

    var result = await exe(sql);
    res.redirect('/jobs');
    });



module.exports = router;




module.exports = router;