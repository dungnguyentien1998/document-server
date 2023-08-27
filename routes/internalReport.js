const express = require('express');
const router = express.Router();

const errorHandler = require('../utils/documentGenerate.js');
var fs = require('fs');
var path = require('path');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
const { log } = require('console');

router.post('/', function (req, res) {
    //Load the docx file as a binary
    var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

    var zip = new PizZip(content);
    var doc;
    try {
        doc = new Docxtemplater(zip);
    } catch(error) {
        // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
        errorHandler(error);
    }
    // console.log("test: ", req.body);

    //set the templateVariables
    doc.setData({
        diaDiem: req.body.report.diaDiem,
        ngay: req.body.report.ngay,
        thang: req.body.report.thang,
        nam: req.body.report.nam,
        loaiBienBan: req.body.report.loaiBienBan,
        tenBienBan: req.body.report.tenBienBan,
        goiThauSo: req.body.report.goiThauSo,
        tenGoiThau: req.body.report.tenGoiThau,
        tenDuAn: req.body.report.tenDuAn,
        viTriMong: req.body.report.viTriMong,
        tenLoaiMong: req.body.report.tenLoaiMong,
        tenKhoangNeo: req.body.report.tenKhoangNeo,
        batDau: req.body.report.batDau,
        ketThuc: req.body.report.ketThuc,
        daiDienNhaThau: req.body.report.daiDienNhaThau,
        danhGia: req.body.report.danhGia,
        ketLuan: req.body.report.ketLuan,
        doiTruongThiCong: req.body.report.doiTruongThiCong,
        tuvanGiamSat: req.body.report.tuVanGiamSat,
        quanLyVanHanh: req.body.report.quanLyVanHanh,
        chiHuyTruong: req.body.report.chiHuyTruong,
        kyThuatB: req.body.report.kyThuatB,
        giamSatThiCong: req.body.report.giamSatThiCong,
        hoSoTaiLieu: req.body.report.hoSoTaiLieu
    });

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    }
    catch (error) {
        // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
        errorHandler(error);
    }
     
    var buf = doc.getZip().generate({type: 'nodebuffer'});
    console.log('444'); 
    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    console.log("dir: ", __dirname);
    
    fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf)
    // res.status(201).send({msg: 'OK'});
    res.download(__dirname + '/output.docx', 'output.docx', (err) => {
        if (err) {
            res.status(500).send({
              message: "Could not download the file. " + err,
            });
          }
    });

    // var hash = '$2y$10$pT8NdsBGXivddGS4yLw7ru4JGdNLN8ZBlruLuU.ooipxKrq69RleK';
    // var bcrypt = require('bcrypt');
    // hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
    // bcrypt.compare("admin", hash, function(err, res) {
    //     console.log(res);
    // });
    // res.status(201).send({msg: 'OK'});

});

module.exports = router;