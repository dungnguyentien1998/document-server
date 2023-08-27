const express = require('express');
const router = express.Router();

const errorHandler = require('../utils/documentGenerate.js');
var fs = require('fs');
var path = require('path');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');


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

    //set the templateVariables
    doc.setData({
        diaDiem: req.diaDiem,
        ngay: req.ngay,
        thang: req.thang,
        nam: req.nam,
        tenNhatKy: req.tenNhatKy,
        goiThauSo: req.goiThauSo,
        tenGoiThau: req.tenGoiThau,
        tenDuAn: req.tenDuAn,
        viTriMong: req.viTriMong,
        loaiMong: req.tenLoaiMong,
        khoangNeo: req.tenKhoangNeo,
        banVeSo: req.banVeSo,
        batDau: req.batDau,
        ketThuc: req.ketThuc,
        danhGia: req.danhGia,
        tuVanGiamSat: req.tuVanGiamSat,
        kyThuatB: req.kyThuatB,      
        diaHinh: req.diaHinh,
        chenhLechCaoDo: req.chenhLechCaoDo,
        dacDiemDiaChat: req.DacDiemDiaChat,
        ketLuan: req.ketLuan,
        viTriLapDat: req.viTriLapDat
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
     
    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf).then(
        () => {res.status(201).send( {msg: 'OK'});}
    );

    
});

module.exports = router;