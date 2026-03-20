const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import User model
const User = require('./models/UserModel');

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        console.log('🔄 Đang kết nối tới MongoDB...');
        await mongoose.connect(process.env.MONGO_DB);
        console.log('✅ Kết nối MongoDB thành công!');

        // Admin account details
        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('⚠️  Tài khoản admin đã tồn tại!');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👤 Tên:', existingAdmin.name);
            console.log('🔐 Quyền admin:', existingAdmin.isAdmin ? 'Có' : 'Không');
            
            // Nếu user tồn tại nhưng không phải admin, update thành admin
            if (!existingAdmin.isAdmin) {
                existingAdmin.isAdmin = true;
                await existingAdmin.save();
                console.log('✅ Đã cập nhật quyền admin cho tài khoản này!');
            }
            
            await mongoose.connection.close();
            console.log('🔌 Đã đóng kết nối MongoDB');
            process.exit(0);
        }

        // Hash password
        console.log('🔐 Đang mã hóa mật khẩu...');
        const hashedPassword = bcrypt.hashSync(adminPassword, 10);

        // Create admin account
        console.log('👤 Đang tạo tài khoản admin...');
        const admin = await User.create({
            name: 'Administrator',
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
            phone: '0123456789',
            address: 'Hồ Chí Minh, Việt Nam',
            orderCount: 0,
            loyaltyDiscountEligible: false
        });

        console.log('\n🎉 TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!');
        console.log('================================');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        console.log('🆔 ID:', admin._id);
        console.log('👤 Tên:', admin.name);
        console.log('🔐 Quyền admin: Có');
        console.log('================================');
        console.log('\n💡 Bạn có thể đăng nhập với thông tin trên!');
        
        // Close connection
        await mongoose.connection.close();
        console.log('🔌 Đã đóng kết nối MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        console.error(error);
        process.exit(1);
    }
};

// Run seed function
seedAdmin();
