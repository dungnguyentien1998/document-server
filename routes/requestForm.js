const express = require('express');
const router = express.Router();

var fs = require('fs');
var path = require('path');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');

const errorHandler = require('../utils/documentGenerate.js');

router.post('/', function (req, res) {
    //Load the docx file as a binary
    var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');
    console.log('111');
    var zip = new PizZip(content);
    var doc;
    try {
        doc = new Docxtemplater(zip);
    } catch(error) {
        // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
        errorHandler(error);
    }
    console.log('222: ', req.body.diaDiem);
    //set the templateVariables
    doc.setData({
        diaDiem: "Nam Định",
        ngay: req.body.ngay,
        thang: req.body.thang,
        nam: req.body.nam,
        kinhGui: req.body.kinhGui,
        tenDuAn: req.body.tenDuAn,
        goiThauSo: req.body.goiThauSo,
        tenGoiThau: req.body.tenGoiThau,
        hangMuc: req.body.hangMuc,
        viTriMong: req.body.viTriMong,
        loaiMong: req.body.loaiMong,
        loaiTiepDia: req.body.loaiTiepDia,
        loaiBuLongNeo: req.body.loaiBuLongNeo,
        doiTuongNghiemThu: req.body.doiTuongNghiemThu,
        ketQuaNghiemThuNB: req.body.ketQuaNghiemThuNB,
        thoiGian: req.body.thoiGian,
        diaDiemNghiemThu: req.body.diaDiemNghiemThu,
        nguoiLienHe: req.body.nguoiLienHe,
        chucVu: req.body.chucVu,
        daiDien: req.body.daiDien
    });
    console.log('333');
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
    fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf)
    res.status(201).send({msg: 'OK'});
    console.log('555');
});

module.exports = router;