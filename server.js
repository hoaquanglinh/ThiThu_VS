const express = require('express')
const app = express();
const port = 3000
const mongoose = require('mongoose');
const upload = require('./upload')
const path = require('path');

const xemayModel = require('./xemayModel')

app.listen(port, () => {
    console.log(`Server đang chạy ở cổng ${port}`)
})

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const uri = 'mongodb+srv://slide3:123@sanpham.9silvsv.mongodb.net/ThiThu'

try {
    mongoose.connect(uri)
    console.log('Ket noi thanh cong');
} catch (error) {
    console.log('Loi: ', error);
}

app.get('/list', async (req, res) => {
    let xemay = await xemayModel.find();

    res.send(xemay)
})

app.post('/add', upload.single('anh_ph43159'), async (req, res) => {
    try {
        const data = req.body;
        const file = req.file ? req.file : ''
        const imageUrl = file != '' ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}` : ''

        const newxe = new xemayModel({
            ten_ph43159: data.ten_ph43159,
            mau_ph43159: data.mau_ph43159,
            gia_ph43159: data.gia_ph43159,
            mota_ph43159: data.mota_ph43159,
            anh_ph43159: imageUrl
        });

        const result = await newxe.save();

        if (result) {
            res.json({
                "status": 200,
                "message": "Thêm thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Thêm không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm dữ liệu');
    }
});

app.get('/list-by-id/:id', async (req, res) => {
    try {
        const id = req.params.id
        let result = await xemayModel.findById(id);
        res.json(result)
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await xemayModel.findByIdAndDelete(id)

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, xóa không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
})

app.put('/update/:id', upload.single('anh_ph43159'), async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const { file } = req
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

        const result = await xemayModel.findByIdAndUpdate(id, {
            ten_ph43159: data.ten_ph43159,
            mau_ph43159: data.mau_ph43159,
            gia_ph43159: data.gia_ph43159,
            mota_ph43159: data.mota_ph43159,
            anh_ph43159: imageUrl,
        })  

        if (result) {
            res.json({
                "status": 200,
                "message": "Cập nhật thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Không tìm thấy trái cây",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm dữ liệu');
    }
});

app.put('/update-no-image/:id', upload.single('anh_ph43159'), async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const result = await xemayModel.findByIdAndUpdate(id, {
            ten_ph43159: data.ten_ph43159,
            mau_ph43159: data.mau_ph43159,
            gia_ph43159: data.gia_ph43159,
            mota_ph43159: data.mota_ph43159
        })  

        if (result) {
            res.json({
                "status": 200,
                "message": "Cập nhật thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Không tìm thấy trái cây",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm dữ liệu');
    }
});

app.get('/search', async (req, res) => {
    try {
        const tuKhoa = req.query.key; 
       
        const ketQuaTimKiem = await xemayModel.find({ ten_ph43159: { $regex: new RegExp(tuKhoa, "i") } });

        if (ketQuaTimKiem.length > 0) {
            res.json(ketQuaTimKiem);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});

// const ketQuaTimKiem = await xemayModel.find({
//     $or: [
//       { ten_ph43159: { $regex: new RegExp(tuKhoa, "i") } },
//       { mo_ta: { $regex: new RegExp(tuKhoa, "i") } }
//     ]
//   });
  