const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/ProductModel');

dotenv.config();
const sampleProducts = [
    // ----------------------------------------------------
    // ✅ 1. ĐIỆN THOẠI (SMARTPHONE) - 10 Sản phẩm
    // ----------------------------------------------------

    // --- IPHONE (APPLE) ---
    {
        name: "iPhone 16 Pro Max 256GB (Titan Đen)",
        image: "https://images.unsplash.com/photo-1592286927505-341827d5f62e?w=400&h=400&fit=crop",
        type: "Phone",
        price: 36990000,
        countInStock: 40,
        rating: 4.9,
        description: "Flagship mới nhất của Apple với chip A18 Bionic, camera Telephoto 6x, và Wi-Fi 7.",
        discount: 0,
        selled: 150
    },
    {
        name: "iPhone 15 128GB (Màu Hồng)",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
        type: "Phone",
        price: 21990000,
        countInStock: 80,
        rating: 4.7,
        description: "Dynamic Island, chip A16 Bionic, và camera chính 48MP nâng cấp.",
        discount: 10,
        selled: 250
    },
    {
        name: "iPhone SE (2022) 64GB (Trắng)",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop",
        type: "Phone",
        price: 9990000,
        countInStock: 120,
        rating: 4.5,
        description: "Thiết kế cổ điển, chip A15 Bionic mạnh mẽ, kết nối 5G.",
        discount: 5,
        selled: 300
    },
    
    // --- SAMSUNG ---
    {
        name: "Samsung Galaxy S24 Ultra 512GB (Titan Xám)",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
        type: "Phone",
        price: 35990000,
        countInStock: 30,
        rating: 4.8,
        description: "Tích hợp Galaxy AI toàn diện, camera 200MP, và bút S Pen.",
        discount: 5,
        selled: 120
    },
    {
        name: "Samsung Galaxy Z Fold 5 512GB (Xanh)",
        image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop",
        type: "Phone",
        price: 40990000,
        countInStock: 20,
        rating: 4.7,
        description: "Màn hình gập đa nhiệm lớn 7.6 inch, bản lề Flex bền bỉ hơn.",
        discount: 8,
        selled: 60
    },
    {
        name: "Samsung Galaxy A55 5G 256GB (Tím)",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        type: "Phone",
        price: 9990000,
        countInStock: 90,
        rating: 4.5,
        description: "Thiết kế khung kim loại cao cấp, camera 50MP chống rung OIS.",
        discount: 10,
        selled: 180
    },

    // --- XIAOMI & OPPO ---
    {
        name: "Xiaomi 14 Ultra 512GB (Trắng)",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
        type: "Phone",
        price: 27990000,
        countInStock: 35,
        rating: 4.7,
        description: "Chuyên gia nhiếp ảnh di động, cảm biến 1 inch, chip Snapdragon 8 Gen 3.",
        discount: 7,
        selled: 60
    },
    {
        name: "OPPO Reno11 Pro 5G (Xám)",
        image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop",
        type: "Phone",
        price: 16990000,
        countInStock: 60,
        rating: 4.6,
        description: "Camera Chân dung Tele 32MP, thiết kế tinh tế, sạc siêu nhanh 80W.",
        discount: 12,
        selled: 110
    },
    {
        name: "OPPO A58 128GB (Đen)",
        image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop",
        type: "Phone",
        price: 4990000,
        countInStock: 150,
        rating: 4.4,
        description: "Pin 5000mAh bền bỉ, sạc nhanh 33W, loa kép âm thanh sống động.",
        discount: 15,
        selled: 400
    },
    {
        name: "Vivo V30 Pro 5G 256GB (Xanh)",
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop",
        type: "Phone",
        price: 18990000,
        countInStock: 45,
        rating: 4.6,
        description: "Camera Zeiss chuyên nghiệp, Ánh sáng Vòng hỗ trợ chụp chân dung.",
        discount: 10,
        selled: 70
    },


    // ----------------------------------------------------
    // ✅ 2. LAPTOP - 8 Sản phẩm
    // ----------------------------------------------------

    // --- MACBOOK (APPLE) ---
    {
        name: "MacBook Pro 16-inch M3 Max (36GB/1TB)",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
        type: "Laptop",
        price: 89990000,
        countInStock: 10,
        rating: 4.9,
        description: "Hiệu năng cực đỉnh cho đồ họa và lập trình chuyên nghiệp, pin lên đến 22 giờ.",
        discount: 0,
        selled: 15
    },
    {
        name: "MacBook Air M2 13-inch (8GB/256GB)",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
        type: "Laptop",
        price: 24990000,
        countInStock: 60,
        rating: 4.8,
        description: "Thiết kế vuông vắn, chip M2 cân bằng giữa hiệu năng và tính di động.",
        discount: 8,
        selled: 200
    },
    
    // --- WINDOWS ULTRABOOKS & GAMING ---
    {
        name: "Dell XPS 14 (i7/32GB/1TB) OLED",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
        type: "Laptop",
        price: 49990000,
        countInStock: 18,
        rating: 4.7,
        description: "Màn hình OLED 3.2K tuyệt đẹp, thiết kế tối giản, hiệu năng cao cấp.",
        discount: 5,
        selled: 35
    },
    {
        name: "ASUS Zenbook S 13 Flip OLED (i5/16GB)",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
        type: "Laptop",
        price: 29990000,
        countInStock: 25,
        rating: 4.6,
        description: "Mỏng nhẹ, xoay lật 360 độ, màn hình cảm ứng OLED.",
        discount: 10,
        selled: 40
    },
    {
        name: "HP Envy x360 14 (i7/16GB/512GB)",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
        type: "Laptop",
        price: 26990000,
        countInStock: 30,
        rating: 4.5,
        description: "Laptop 2-in-1 linh hoạt, vỏ nhôm cao cấp, phù hợp cho công việc sáng tạo.",
        discount: 7,
        selled: 55
    },
    {
        name: "ASUS ROG Strix Scar 17 (R9/RTX 4080)",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
        type: "Laptop",
        price: 65990000,
        countInStock: 12,
        rating: 4.8,
        description: "Laptop Gaming mạnh nhất, màn hình 240Hz, dành cho game thủ chuyên nghiệp.",
        discount: 0,
        selled: 20
    },
    {
        name: "Dell G15 Gaming (i5/RTX 4050)",
        image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
        type: "Laptop",
        price: 23990000,
        countInStock: 35,
        rating: 4.4,
        description: "Hiệu năng chơi game tầm trung, thiết kế bền bỉ, tản nhiệt tốt.",
        discount: 10,
        selled: 75
    },
    {
        name: "HP Pavilion Aero 13 (R7/16GB/512GB)",
        image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop",
        type: "Laptop",
        price: 19990000,
        countInStock: 40,
        rating: 4.6,
        description: "Siêu nhẹ (dưới 1kg), vỏ Magie-Nhôm, màn hình 16:10 đẹp.",
        discount: 12,
        selled: 80
    },


    // ----------------------------------------------------
    // ✅ 3. TABLET - 5 Sản phẩm
    // ----------------------------------------------------

    {
        name: "iPad Air M2 11-inch (256GB)",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
        type: "Tablet",
        price: 21990000,
        countInStock: 35,
        rating: 4.8,
        description: "Sức mạnh chip M2, hỗ trợ Apple Pencil Pro, màu sắc trẻ trung.",
        discount: 5,
        selled: 110
    },
    {
        name: "iPad 10th Gen 10.9-inch (64GB)",
        image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop",
        type: "Tablet",
        price: 11990000,
        countInStock: 70,
        rating: 4.6,
        description: "Thiết kế tràn viền, chip A14 Bionic, cổng USB-C.",
        discount: 10,
        selled: 150
    },
    {
        name: "Samsung Galaxy Tab S9 128GB (Wifi)",
        image: "https://images.unsplash.com/photo-1585790050230-5dd28404f149?w=400&h=400&fit=crop",
        type: "Tablet",
        price: 18990000,
        countInStock: 40,
        rating: 4.7,
        description: "Màn hình Dynamic AMOLED 2X, chống nước IP68, kèm S Pen.",
        discount: 12,
        selled: 60
    },
    {
        name: "Samsung Galaxy Tab A9+ 11-inch (64GB)",
        image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&h=400&fit=crop",
        type: "Tablet",
        price: 6990000,
        countInStock: 90,
        rating: 4.5,
        description: "Máy tính bảng giải trí giá tốt, màn hình lớn, loa Quad Speakers.",
        discount: 15,
        selled: 180
    },
    {
        name: "Xiaomi Pad 6 256GB",
        image: "https://images.unsplash.com/photo-1592286927505-341827d5f62e?w=400&h=400&fit=crop",
        type: "Tablet",
        price: 8990000,
        countInStock: 50,
        rating: 4.6,
        description: "Hiệu năng Snapdragon 870 mạnh mẽ, màn hình 144Hz, pin lớn 8840mAh.",
        discount: 10,
        selled: 70
    },


    // ----------------------------------------------------
    // ✅ 4. SMARTWATCH - 5 Sản phẩm
    // ----------------------------------------------------

    {
        name: "Apple Watch Series 9 (45mm GPS)",
        image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop",
        type: "Watch",
        price: 12990000,
        countInStock: 60,
        rating: 4.7,
        description: "Chip S9 mới, Màn hình sáng gấp đôi, cử chỉ Chạm hai lần.",
        discount: 8,
        selled: 150
    },
    {
        name: "Apple Watch SE 2022 (40mm GPS)",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
        type: "Watch",
        price: 7990000,
        countInStock: 80,
        rating: 4.6,
        description: "Giá cả phải chăng, các tính năng cốt lõi về sức khỏe và an toàn.",
        discount: 10,
        selled: 200
    },
    {
        name: "Samsung Galaxy Watch 7 40mm (Vàng)",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop",
        type: "Watch",
        price: 8990000,
        countInStock: 50,
        rating: 4.7,
        description: "Chip Exynos W1000, pin lâu hơn, phân tích giấc ngủ nâng cao.",
        discount: 7,
        selled: 90
    },
    {
        name: "Garmin Fenix 7 Pro Sapphire Solar",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        type: "Watch",
        price: 25990000,
        countInStock: 15,
        rating: 4.9,
        description: "Đồng hồ đa môn thể thao, sạc bằng năng lượng mặt trời, bản đồ địa hình.",
        discount: 5,
        selled: 30
    },
    {
        name: "Xiaomi Watch S3 (OS)",
        image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400&h=400&fit=crop",
        type: "Watch",
        price: 3490000,
        countInStock: 70,
        rating: 4.4,
        description: "Thiết kế vòng bezel có thể thay đổi, hệ điều hành Xiaomi HyperOS.",
        discount: 10,
        selled: 100
    },

    // ----------------------------------------------------
    // ✅ 5. TAI NGHE – ÂM THANH - 4 Sản phẩm
    // ----------------------------------------------------

    {
        name: "AirPods Max (Xanh Da Trời)",
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
        type: "Headphone",
        price: 13990000,
        countInStock: 30,
        rating: 4.8,
        description: "Tai nghe over-ear cao cấp, âm thanh Hi-Fi, Khử tiếng ồn vượt trội.",
        discount: 5,
        selled: 45
    },
    {
        name: "Sony WF-1000XM5",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
        type: "Headphone",
        price: 6990000,
        countInStock: 80,
        rating: 4.7,
        description: "Tai nghe True Wireless Khử tiếng ồn tốt nhất, chất âm chi tiết.",
        discount: 10,
        selled: 160
    },
    {
        name: "JBL Tune 230NC TWS",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        type: "Headphone",
        price: 1990000,
        countInStock: 100,
        rating: 4.5,
        description: "Tai nghe không dây chống ồn, âm thanh JBL Pure Bass mạnh mẽ.",
        discount: 15,
        selled: 250
    },
    {
        name: "Loa Bluetooth Sony SRS-XB100",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
        type: "Speaker",
        price: 1290000,
        countInStock: 150,
        rating: 4.6,
        description: "Loa di động nhỏ gọn, âm thanh sống động, chống nước IP67.",
        discount: 10,
        selled: 300
    },

    // ----------------------------------------------------
    // ✅ 6. TV - 3 Sản phẩm
    // ----------------------------------------------------

    {
        name: "Smart TV Samsung Crystal UHD 4K 55 inch CU8000",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
        type: "TV",
        price: 13990000,
        countInStock: 20,
        rating: 4.6,
        description: "Công nghệ Dynamic Crystal Color, thiết kế AirSlim mỏng.",
        discount: 20,
        selled: 30
    },
    {
        name: "Smart TV LG QNED 4K 65 inch QNED86",
        image: "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400&h=400&fit=crop",
        type: "TV",
        price: 26990000,
        countInStock: 15,
        rating: 4.7,
        description: "Kết hợp Quantum Dot và NanoCell, màu sắc tuyệt đẹp và chuẩn xác.",
        discount: 15,
        selled: 25
    },
    {
        name: "Google TV Sony OLED 4K 55 inch A95L",
        image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop",
        type: "TV",
        price: 45990000,
        countInStock: 8,
        rating: 4.9,
        description: "Công nghệ QD-OLED, chip XR Processor, âm thanh hình ảnh đồng bộ.",
        discount: 10,
        selled: 10
    },

    // ----------------------------------------------------
    // ✅ 7. GIA DỤNG (ĐIỆN MÁY) - 5 Sản phẩm
    // ----------------------------------------------------

    {
        name: "Máy giặt sấy LG Inverter 10.5kg (FV1450H3B)",
        image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop",
        type: "Appliance",
        price: 18990000,
        countInStock: 20,
        rating: 4.7,
        description: "Tích hợp giặt và sấy, công nghệ AI DD, giảm nhăn và bảo vệ vải.",
        discount: 10,
        selled: 40
    },
    {
        name: "Tủ lạnh Samsung 4 cánh Inverter 655L (RF56T8995B1)",
        image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
        type: "Appliance",
        price: 35990000,
        countInStock: 15,
        rating: 4.8,
        description: "Thiết kế Bespoke cao cấp, dung tích lớn, công nghệ làm lạnh ba dàn độc lập.",
        discount: 12,
        selled: 25
    },
    {
        name: "Điều hòa Daikin Inverter 1.5 HP (FTKF35XVMV)",
        image: "https://images.unsplash.com/photo-1631545835291-7f279e7f9719?w=400&h=400&fit=crop",
        type: "Appliance",
        price: 11990000,
        countInStock: 30,
        rating: 4.6,
        description: "Làm lạnh nhanh, tiết kiệm điện, tích hợp công nghệ chống ẩm mốc.",
        discount: 15,
        selled: 55
    },
    {
        name: "Máy lọc không khí Sharp Plasmacluster FP-J80EV-H",
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop",
        type: "Appliance",
        price: 6990000,
        countInStock: 40,
        rating: 4.5,
        description: "Công nghệ Plasmacluster Ion, lọc không khí cho phòng lớn (đến 62m²).",
        discount: 10,
        selled: 50
    },
    {
        name: "Robot hút bụi Dreame L20 Ultra",
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
        type: "Appliance",
        price: 20990000,
        countInStock: 25,
        rating: 4.9,
        description: "Hệ thống lau dọn tự động hoàn toàn, lực hút 7000Pa, nhận dạng thảm thông minh.",
        discount: 8,
        selled: 30
    },
];

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_DB);
        console.log('✓ Connected to MongoDB');

        // Check existing products
        const existingCount = await Product.countDocuments();
        console.log(`Current products in database: ${existingCount}`);

        if (existingCount > 0) {
            console.log('\n⚠️  Found existing products. Deleting all old data...');
            await Product.deleteMany({});
            console.log(`✓ Deleted ${existingCount} old products`);
        }

        // Insert sample products
        console.log('\nInserting new products...');
        const result = await Product.insertMany(sampleProducts);
        console.log(`✓ Successfully inserted ${result.length} products!\n`);

        // Display summary
        console.log('Products added:');
        result.forEach((product, index) => {
            console.log(`  ${index + 1}. ${product.name} - ${product.price.toLocaleString('vi-VN')} VND`);
        });

        console.log('\n✓ Database seeding completed successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        if (error.code === 11000) {
            console.error('Duplicate key error: Some products already exist with the same name.');
        }
        mongoose.connection.close();
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
