const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/ProductModel');

dotenv.config();
const sampleProducts = [
    // ========================================================
    // 📱 ĐIỆN THOẠI (SMARTPHONE) - 10 Sản phẩm
    // ========================================================

    {
        name: "iPhone 16 Pro Max 256GB Black Titanium",
        image: "https://res.cloudinary.com/dj8buonsf/image/upload/v1774276782/49989___i___n_tho___i_iphone_16_pro_max_256gb_titan___en_ch__nh_h__ng_vna_mk38wx.jpg",
        images: [
            "https://res.cloudinary.com/dj8buonsf/image/upload/v1774276782/49989___i___n_tho___i_iphone_16_pro_max_256gb_titan___en_ch__nh_h__ng_vna_mk38wx.jpg",
            "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=400",
            "https://images.unsplash.com/photo-1632633728024-e1fd4bef561a?w=400",
            "https://images.unsplash.com/photo-1678685888221-cda5f1f0bee6?w=400",
            "https://res.cloudinary.com/dj8buonsf/image/upload/v1774277606/s-l400_c3yjsh.jpg",
            "https://res.cloudinary.com/dj8buonsf/image/upload/v1774280947/QC-4_gxkltq.jpg"
        ],
        type: "Phone",
        price: 36990000,
        countInStock: 40,
        rating: 4.9,
        description: "Flagship mới nhất của Apple với chip A18 Bionic, camera Telephoto 6x, và Wi-Fi 7. Màn hình Super Retina XDR 6.7 inch ProMotion 120Hz.",
        discount: 0,
        selled: 150
    },
    {
        name: "iPhone 15 128GB Pink",
        image: "https://res.cloudinary.com/dj8buonsf/image/upload/v1774281097/refurb-iphone-15-pink-202412_aue3be.jpg",
        images: [
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
            "https://res.cloudinary.com/dj8buonsf/image/upload/v1774281260/Screenshot2023-09-13at1.31.03PM_wn7rn1.png",
            "https://res.cloudinary.com/dj8buonsf/image/upload/v1774281261/603001000000840_1_c3atnl.jpg",
            "https://res.cloudinary.com/dj8buonsf/image/upload/v1774281258/e87ade00-a80a-4f6f-89d9-796282e8bf7e.33a5a0c8fd31d9700238aacad98e18d5_u17jkg.jpg",
            "https://res.cloudinary.com/dj8buonsf/image/upload/v1774281262/iphone15_pink_2_1_zxtqbq.jpg",
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"
        ],
        type: "Phone",
        price: 21990000,
        countInStock: 80,
        rating: 4.7,
        description: "Dynamic Island, chip A16 Bionic, và camera chính 48MP nâng cấp. Màn hình Super Retina XDR 6.1 inch.",
        discount: 10,
        selled: 250
    },
    {
        name: "iPhone SE (2022) 64GB (Trắng)",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600",
        images: [
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400",
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
            "https://images.unsplash.com/photo-1592286927505-341827d5f62e?w=400",
            "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=400",
            "https://images.unsplash.com/photo-1632633728024-e1fd4bef561a?w=400",
            "https://images.unsplash.com/photo-1678652002419-c4c62e66b0c6?w=400"
        ],
        type: "Phone",
        price: 9990000,
        countInStock: 120,
        rating: 4.5,
        description: "Thiết kế cổ điển, chip A15 Bionic mạnh mẽ, kết nối 5G. Touch ID, màn hình Retina HD 4.7 inch.",
        discount: 5,
        selled: 300
    },
    {
        name: "Samsung Galaxy S24 Ultra 512GB (Titan Xám)",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
        images: [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
            "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400",
            "https://images.unsplash.com/photo-1678911820864-e5867d9f4d53?w=400",
            "https://images.unsplash.com/photo-1682686581660-3693f0c588d2?w=400",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400"
        ],
        type: "Phone",
        price: 35990000,
        countInStock: 30,
        rating: 4.8,
        description: "Tích hợp Galaxy AI toàn diện, camera 200MP, và bút S Pen. Màn hình Dynamic AMOLED 2X 6.8 inch 120Hz.",
        discount: 5,
        selled: 120
    },
    {
        name: "Samsung Galaxy Z Fold 5 512GB (Xanh)",
        image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600",
        images: [
            "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400",
            "https://images.unsplash.com/photo-1678911820864-e5867d9f4d53?w=400",
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
            "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            "https://images.unsplash.com/photo-1682686581660-3693f0c588d2?w=400"
        ],
        type: "Phone",
        price: 40990000,
        countInStock: 20,
        rating: 4.7,
        description: "Màn hình gập đa nhiệm lớn 7.6 inch, bản lề Flex bền bỉ hơn. Chip Snapdragon 8 Gen 2 for Galaxy.",
        discount: 8,
        selled: 60
    },
    {
        name: "Samsung Galaxy A55 5G 256GB (Tím)",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            "https://images.unsplash.com/photo-1682686581660-3693f0c588d2?w=400",
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
            "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400",
            "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400",
            "https://images.unsplash.com/photo-1678911820864-e5867d9f4d53?w=400"
        ],
        type: "Phone",
        price: 9990000,
        countInStock: 90,
        rating: 4.5,
        description: "Thiết kế khung kim loại cao cấp, camera 50MP chống rung OIS. Màn hình Super AMOLED 6.6 inch 120Hz.",
        discount: 10,
        selled: 180
    },
    {
        name: "Xiaomi 14 Ultra 512GB (Trắng)",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
        images: [
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
            "https://images.unsplash.com/photo-1678652002282-e46dd2d30abf?w=400",
            "https://images.unsplash.com/photo-1678685888221-cda5f1f0bee6?w=400",
            "https://images.unsplash.com/photo-1706965452989-69e62bd0af03?w=400",
            "https://images.unsplash.com/photo-1678652002420-9ff72002a758?w=400",
            "https://images.unsplash.com/photo-1686904423955-b7d67d01543f?w=400"
        ],
        type: "Phone",
        price: 27990000,
        countInStock: 35,
        rating: 4.7,
        description: "Chuyên gia nhiếp ảnh di động, cảm biến 1 inch, chip Snapdragon 8 Gen 3. Camera Leica 50MP chuyên nghiệp.",
        discount: 7,
        selled: 60
    },
    {
        name: "OPPO Reno11 Pro 5G (Xám)",
        image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600",
        images: [
            "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400",
            "https://images.unsplash.com/photo-1706349936037-75c52e515166?w=400",
            "https://images.unsplash.com/photo-1691598664852-33f8c4753a3f?w=400",
            "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400",
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400",
            "https://images.unsplash.com/photo-1678685888221-cda5f1f0bee6?w=400"
        ],
        type: "Phone",
        price: 16990000,
        countInStock: 60,
        rating: 4.6,
        description: "Camera Chân dung Tele 32MP, thiết kế tinh tế, sạc siêu nhanh 80W. Màn hình AMOLED 6.7 inch 120Hz.",
        discount: 12,
        selled: 110
    },
    {
        name: "OPPO A58 128GB (Đen)",
        image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600",
        images: [
            "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400",
            "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400",
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400",
            "https://images.unsplash.com/photo-1706349936037-75c52e515166?w=400",
            "https://images.unsplash.com/photo-1691598664852-33f8c4753a3f?w=400",
            "https://images.unsplash.com/photo-1678685888221-cda5f1f0bee6?w=400"
        ],
        type: "Phone",
        price: 4990000,
        countInStock: 150,
        rating: 4.4,
        description: "Pin 5000mAh bền bỉ, sạc nhanh 33W, loa kép âm thanh sống động. Màn hình 6.72 inch 90Hz.",
        discount: 15,
        selled: 400
    },
    {
        name: "Vivo V30 Pro 5G 256GB (Xanh)",
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600",
        images: [
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400",
            "https://images.unsplash.com/photo-1686904423955-b7d67d01543f?w=400",
            "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400",
            "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400",
            "https://images.unsplash.com/photo-1706349936037-75c52e515166?w=400",
            "https://images.unsplash.com/photo-1678685888221-cda5f1f0bee6?w=400"
        ],
        type: "Phone",
        price: 18990000,
        countInStock: 45,
        rating: 4.6,
        description: "Camera Zeiss chuyên nghiệp, Ánh sáng Vòng hỗ trợ chụp chân dung. Chip MediaTek Dimensity 8200.",
        discount: 10,
        selled: 70
    },


    // ========================================================
    // 💻 LAPTOP - 8 Sản phẩm
    // ========================================================

    {
        name: "MacBook Pro 16-inch M3 Max (36GB/1TB)",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400"
        ],
        type: "Laptop",
        price: 89990000,
        countInStock: 10,
        rating: 4.9,
        description: "Hiệu năng cực đỉnh cho đồ họa và lập trình chuyên nghiệp, pin lên đến 22 giờ. Chip M3 Max 16 nhân CPU, 40 nhân GPU.",
        discount: 0,
        selled: 15
    },
    {
        name: "MacBook Air M2 13-inch (8GB/256GB)",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600",
        images: [
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400"
        ],
        type: "Laptop",
        price: 24990000,
        countInStock: 60,
        rating: 4.8,
        description: "Thiết kế vuông vắn, chip M2 cân bằng giữa hiệu năng và tính di động. Màn hình Liquid Retina 13.6 inch.",
        discount: 8,
        selled: 200
    },
    {
        name: "Dell XPS 14 (i7/32GB/1TB) OLED",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
        images: [
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400"
        ],
        type: "Laptop",
        price: 49990000,
        countInStock: 18,
        rating: 4.7,
        description: "Màn hình OLED 3.2K tuyệt đẹp, thiết kế tối giản, hiệu năng cao cấp. Intel Core i7-13700H.",
        discount: 5,
        selled: 35
    },
    {
        name: "ASUS Zenbook S 13 Flip OLED (i5/16GB)",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600",
        images: [
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
            "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400"
        ],
        type: "Laptop",
        price: 29990000,
        countInStock: 25,
        rating: 4.6,
        description: "Mỏng nhẹ, xoay lật 360 độ, màn hình cảm ứng OLED. Hỗ trợ ASUS Pen và Intel Evo.",
        discount: 10,
        selled: 40
    },
    {
        name: "HP Envy x360 14 (i7/16GB/512GB)",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
        images: [
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400",
            "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400"
        ],
        type: "Laptop",
        price: 26990000,
        countInStock: 30,
        rating: 4.5,
        description: "Laptop 2-in-1 linh hoạt, vỏ nhôm cao cấp, phù hợp cho công việc sáng tạo. Màn hình 14 inch 2.2K.",
        discount: 7,
        selled: 55
    },
    {
        name: "ASUS ROG Strix Scar 17 (R9/RTX 4080)",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600",
        images: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
            "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
            "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400"
        ],
        type: "Laptop",
        price: 65990000,
        countInStock: 12,
        rating: 4.8,
        description: "Laptop Gaming mạnh nhất, màn hình 240Hz, dành cho game thủ chuyên nghiệp. AMD Ryzen 9 7945HX3D.",
        discount: 0,
        selled: 20
    },
    {
        name: "Dell G15 Gaming (i5/RTX 4050)",
        image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600",
        images: [
            "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
            "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400"
        ],
        type: "Laptop",
        price: 23990000,
        countInStock: 35,
        rating: 4.4,
        description: "Hiệu năng chơi game tầm trung, thiết kế bền bỉ, tản nhiệt tốt. Màn hình 15.6 inch 165Hz.",
        discount: 10,
        selled: 75
    },
    {
        name: "HP Pavilion Aero 13 (R7/16GB/512GB)",
        image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600",
        images: [
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400"
        ],
        type: "Laptop",
        price: 19990000,
        countInStock: 40,
        rating: 4.6,
        description: "Siêu nhẹ (dưới 1kg), vỏ Magie-Nhôm, màn hình 16:10 đẹp. AMD Ryzen 7 7840U.",
        discount: 12,
        selled: 80
    },
    // ========================================================
    // 🖥️ TABLET - 5 Sản phẩm
    // ========================================================

    {
        name: "iPad Air M2 11-inch (256GB)",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
        images: [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
            "https://images.unsplash.com/photo-1585790050230-5dd28404f149?w=400",
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400",
            "https://images.unsplash.com/photo-1632834407857-3316b61e1bab?w=400",
            "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400"
        ],
        type: "Tablet",
        price: 21990000,
        countInStock: 35,
        rating: 4.8,
        description: "Sức mạnh chip M2, hỗ trợ Apple Pencil Pro, màu sắc trẻ trung. Màn hình Liquid Retina 11 inch.",
        discount: 5,
        selled: 110
    },
    {
        name: "iPad 10th Gen 10.9-inch (64GB)",
        image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600",
        images: [
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
            "https://images.unsplash.com/photo-1585790050230-5dd28404f149?w=400",
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400",
            "https://images.unsplash.com/photo-1632834407857-3316b61e1bab?w=400",
            "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400"
        ],
        type: "Tablet",
        price: 11990000,
        countInStock: 70,
        rating: 4.6,
        description: "Thiết kế tràn viền, chip A14 Bionic, cổng USB-C. Hỗ trợ Apple Pencil gen 1.",
        discount: 10,
        selled: 150
    },
    {
        name: "Samsung Galaxy Tab S9 128GB (Wifi)",
        image: "https://images.unsplash.com/photo-1585790050230-5dd28404f149?w=600",
        images: [
            "https://images.unsplash.com/photo-1585790050230-5dd28404f149?w=400",
            "https://images.unsplash.com/photo-1632834407857-3316b61e1bab?w=400",
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
            "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400"
        ],
        type: "Tablet",
        price: 18990000,
        countInStock: 40,
        rating: 4.7,
        description: "Màn hình Dynamic AMOLED 2X, chống nước IP68, kèm S Pen. Chip Snapdragon 8 Gen 2.",
        discount: 12,
        selled: 60
    },
    {
        name: "Samsung Galaxy Tab A9+ 11-inch (64GB)",
        image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600",
        images: [
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400",
            "https://images.unsplash.com/photo-1632834407857-3316b61e1bab?w=400",
            "https://images.unsplash.com/photo-1585790050230-5dd28404f149?w=400",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
            "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400"
        ],
        type: "Tablet",
        price: 6990000,
        countInStock: 90,
        rating: 4.5,
        description: "Máy tính bảng giải trí giá tốt, màn hình lớn, loa Quad Speakers. Chip Snapdragon 695.",
        discount: 15,
        selled: 180
    },
    {
        name: "Xiaomi Pad 6 256GB",
        image: "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=600",
        images: [
            "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400",
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400",
            "https://images.unsplash.com/photo-1632834407857-3316b61e1bab?w=400",
            "https://images.unsplash.com/photo-1585790050230-5dd28404f149?w=400",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400"
        ],
        type: "Tablet",
        price: 8990000,
        countInStock: 50,
        rating: 4.6,
        description: "Hiệu năng Snapdragon 870 mạnh mẽ, màn hình 144Hz, pin lớn 8840mAh. Hỗ trợ stylus pen.",
        discount: 10,
        selled: 70
    },


    // ========================================================
    // ⌚ SMARTWATCH - 5 Sản phẩm
    // ========================================================

    {
        name: "Apple Watch Series 9 (45mm GPS)",
        image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600",
        images: [
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400",
            "https://images.unsplash.com/photo-1617625802912-cfe6c3ec8742?w=400"
        ],
        type: "Watch",
        price: 12990000,
        countInStock: 60,
        rating: 4.7,
        description: "Chip S9 mới, Màn hình sáng gấp đôi, cử chỉ Chạm hai lần. Màn hình Always-On Retina.",
        discount: 8,
        selled: 150
    },
    {
        name: "Apple Watch SE 2022 (40mm GPS)",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600",
        images: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400",
            "https://images.unsplash.com/photo-1617625802912-cfe6c3ec8742?w=400"
        ],
        type: "Watch",
        price: 7990000,
        countInStock: 80,
        rating: 4.6,
        description: "Giá cả phải chăng, các tính năng cốt lõi về sức khỏe và an toàn. Phát hiện va chạm và SOS.",
        discount: 10,
        selled: 200
    },
    {
        name: "Samsung Galaxy Watch 7 40mm (Vàng)",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
        images: [
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400",
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400",
            "https://images.unsplash.com/photo-1617625802912-cfe6c3ec8742?w=400"
        ],
        type: "Watch",
        price: 8990000,
        countInStock: 50,
        rating: 4.7,
        description: "Chip Exynos W1000, pin lâu hơn, phân tích giấc ngủ nâng cao. Màn hình Super AMOLED.",
        discount: 7,
        selled: 90
    },
    {
        name: "Garmin Fenix 7 Pro Sapphire Solar",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400",
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400",
            "https://images.unsplash.com/photo-1617625802912-cfe6c3ec8742?w=400"
        ],
        type: "Watch",
        price: 25990000,
        countInStock: 15,
        rating: 4.9,
        description: "Đồng hồ đa môn thể thao, sạc bằng năng lượng mặt trời, bản đồ địa hình. Pin 37 ngày.",
        discount: 5,
        selled: 30
    },
    {
        name: "Xiaomi Watch S3 (OS)",
        image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600",
        images: [
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400",
            "https://images.unsplash.com/photo-1617625802912-cfe6c3ec8742?w=400",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400",
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
        ],
        type: "Watch",
        price: 3490000,
        countInStock: 70,
        rating: 4.4,
        description: "Thiết kế vòng bezel có thể thay đổi, hệ điều hành Xiaomi HyperOS. Màn hình AMOLED 1.43 inch.",
        discount: 10,
        selled: 100
    },

    // ========================================================
    // 🎧 TAI NGHE & LOA - 4 Sản phẩm
    // ========================================================

    {
        name: "AirPods Max (Xanh Da Trời)",
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
        images: [
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
            "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
        ],
        type: "Headphone",
        price: 13990000,
        countInStock: 30,
        rating: 4.8,
        description: "Tai nghe over-ear cao cấp, âm thanh Hi-Fi, Khử tiếng ồn vượt trội. Chip H1, Spatial Audio.",
        discount: 5,
        selled: 45
    },
    {
        name: "Sony WF-1000XM5",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600",
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
            "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
        ],
        type: "Headphone",
        price: 6990000,
        countInStock: 80,
        rating: 4.7,
        description: "Tai nghe True Wireless Khử tiếng ồn tốt nhất, chất âm chi tiết. 8 micro AI, LDAC Hi-Res.",
        discount: 10,
        selled: 160
    },
    {
        name: "JBL Tune 230NC TWS",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
            "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
        ],
        type: "Headphone",
        price: 1990000,
        countInStock: 100,
        rating: 4.5,
        description: "Tai nghe không dây chống ồn, âm thanh JBL Pure Bass mạnh mẽ. Pin 40 giờ.",
        discount: 15,
        selled: 250
    },
    {
        name: "Loa Bluetooth Sony SRS-XB100",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
        images: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
            "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400"
        ],
        type: "Speaker",
        price: 1290000,
        countInStock: 150,
        rating: 4.6,
        description: "Loa di động nhỏ gọn, âm thanh sống động, chống nước IP67. Pin 16 giờ.",
        discount: 10,
        selled: 300
    },

    // ========================================================
    // 📺 SMART TV - 3 Sản phẩm
    // ========================================================

    {
        name: "Smart TV Samsung Crystal UHD 4K 55 inch CU8000",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
        images: [
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400",
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400",
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400"
        ],
        type: "TV",
        price: 13990000,
        countInStock: 20,
        rating: 4.6,
        description: "Công nghệ Dynamic Crystal Color, thiết kế AirSlim mỏng. Chip Crystal Processor 4K.",
        discount: 20,
        selled: 30
    },
    {
        name: "Smart TV LG QNED 4K 65 inch QNED86",
        image: "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=600",
        images: [
            "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400",
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400",
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400"
        ],
        type: "TV",
        price: 26990000,
        countInStock: 15,
        rating: 4.7,
        description: "Kết hợp Quantum Dot và NanoCell, màu sắc tuyệt đẹp và chuẩn xác. Chip α9 Gen6 AI.",
        discount: 15,
        selled: 25
    },
    {
        name: "Google TV Sony OLED 4K 55 inch A95L",
        image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600",
        images: [
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400",
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400"
        ],
        type: "TV",
        price: 45990000,
        countInStock: 8,
        rating: 4.9,
        description: "Công nghệ QD-OLED, chip XR Processor, âm thanh hình ảnh đồng bộ. Acoustic Surface Audio+.",
        discount: 10,
        selled: 10
    },

    // ----------------------------------------------------
    // ✅ 7. GIA DỤNG (ĐIỆN MÁY) - 5 Sản phẩm
    // ----------------------------------------------------

    {
        name: "Máy giặt sấy LG Inverter 10.5kg (FV1450H3B)",
        image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600",
        images: [
            "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400",
            "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
            "https://images.unsplash.com/photo-1631545835291-7f279e7f9719?w=400",
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
            "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
            "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400"
        ],
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
        image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600",
        images: [
            "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
            "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400",
            "https://images.unsplash.com/photo-1631545835291-7f279e7f9719?w=400",
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
            "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
            "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400"
        ],
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
        image: "https://images.unsplash.com/photo-1631545835291-7f279e7f9719?w=600",
        images: [
            "https://images.unsplash.com/photo-1631545835291-7f279e7f9719?w=400",
            "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
            "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400",
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
            "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
            "https://images.unsplash.com/photo-1631545835291-7f279e7f9719?w=400"
        ],
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
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
        images: [
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
            "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
            "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400",
            "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
            "https://images.unsplash.com/photo-1631545835291-7f279e7f9719?w=400",
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400"
        ],
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
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600",
        images: [
            "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
            "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400",
            "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
            "https://images.unsplash.com/photo-1631545835291-7f279e7f9719?w=400",
            "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400"
        ],
        type: "Appliance",
        price: 20990000,
        countInStock: 25,
        rating: 4.9,
        description: "Hệ thống lau dọn tự động hoàn toàn, lực hút 7000Pa, nhận dạng thảm thông minh.",
        discount: 8,
        selled: 30
    },
    {
    name: "iPhone 14 Pro 256GB (Tím Deep Purple)",
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 28990000,
    countInStock: 55,
    rating: 4.8,
    description: "Chip A16 Bionic, Dynamic Island, camera 48MP ProRAW, màn hình Always-On.",
    discount: 12,
    selled: 180
  },
  {
    name: "Samsung Galaxy S23 FE 256GB (Xanh Mint)",
    image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 14990000,
    countInStock: 70,
    rating: 4.6,
    description: "Chip Exynos 2200, camera OIS 50MP, sạc nhanh 25W, màn hình 120Hz.",
    discount: 15,
    selled: 210
  },
  {
    name: "Google Pixel 8 Pro 256GB (Xanh Bay)",
    image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 24990000,
    countInStock: 40,
    rating: 4.7,
    description: "Google Tensor G3, nhiếp ảnh AI đỉnh cao, màn hình LTPO 120Hz.",
    discount: 8,
    selled: 95
  },
  {
    name: "OnePlus 12 5G 512GB (Đen)",
    image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 22990000,
    countInStock: 35,
    rating: 4.7,
    description: "Snapdragon 8 Gen 3, sạc siêu nhanh 100W, màn hình AMOLED ProXDR.",
    discount: 10,
    selled: 75
  },
  {
    name: "Xiaomi 13T Pro 512GB (Xanh Alpine Blue)",
    image: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 15990000,
    countInStock: 60,
    rating: 4.6,
    description: "Camera Leica 50MP, sạc nhanh 120W, chip MediaTek Dimensity 9200+.",
    discount: 12,
    selled: 140
  },
  {
    name: "OPPO Find N3 Flip 256GB (Hồng)",
    image: "https://images.pexels.com/photos/163065/mobile-phone-android-apps-phone-163065.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 22990000,
    countInStock: 25,
    rating: 4.8,
    description: "Điện thoại gập vỏ sò, màn hình ngoài 3.26 inch, camera tele 32MP.",
    discount: 7,
    selled: 55
  },
  {
    name: "Realme GT 5 Pro 256GB (Trắng)",
    image: "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 13990000,
    countInStock: 50,
    rating: 4.5,
    description: "Snapdragon 8 Gen 3, màn hình cong AMOLED, sạc nhanh 100W.",
    discount: 15,
    selled: 120
  },
  {
    name: "Nothing Phone (2) 256GB (Đen)",
    image: "https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 14990000,
    countInStock: 45,
    rating: 4.6,
    description: "Thiết kế Glyph Interface độc đáo, chip Snapdragon 8+ Gen 1, sạc không dây.",
    discount: 10,
    selled: 85
  },
  {
    name: "Motorola Edge 40 Pro 256GB (Xanh)",
    image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 16990000,
    countInStock: 38,
    rating: 4.5,
    description: "Snapdragon 8 Gen 2, màn hình cong 165Hz, sạc nhanh 125W.",
    discount: 12,
    selled: 65
  },
  {
    name: "Asus ROG Phone 8 Pro 512GB (Đen)",
    image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Phone",
    price: 29990000,
    countInStock: 20,
    rating: 4.9,
    description: "Gaming phone hàng đầu, Snapdragon 8 Gen 3, AirTriggers, tản nhiệt GameCool.",
    discount: 5,
    selled: 45
  },

  // ================================================
  // 💻 LAPTOP - 10 sản phẩm
  // ================================================
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 11 (i7/16GB/512GB)",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 42990000,
    countInStock: 22,
    rating: 4.8,
    description: "Laptop doanh nhân cao cấp, nhẹ 1.12kg, bàn phím tốt nhất, pin 14 giờ.",
    discount: 8,
    selled: 48
  },
  {
    name: "MSI Prestige 14 Evo (i5/16GB/512GB)",
    image: "https://images.pexels.com/photos/238118/pexels-photo-238118.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 24990000,
    countInStock: 35,
    rating: 4.6,
    description: "Ultrabook mỏng nhẹ, Intel Evo Platform, màn hình 2.8K 90Hz.",
    discount: 10,
    selled: 70
  },
  {
    name: "Acer Swift X 14 (R7/RTX 4050)",
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 27990000,
    countInStock: 28,
    rating: 4.7,
    description: "Laptop sáng tạo nội dung, GPU rời mạnh mẽ, màn hình OLED 2.8K.",
    discount: 12,
    selled: 55
  },
  {
    name: "Razer Blade 15 Advanced (i7/RTX 4070)",
    image: "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 58990000,
    countInStock: 15,
    rating: 4.9,
    description: "Gaming laptop cao cấp, màn hình 240Hz QHD, thiết kế nhôm CNC.",
    discount: 5,
    selled: 32
  },
  {
    name: "Microsoft Surface Laptop Studio 2 (i7/32GB/1TB)",
    image: "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 62990000,
    countInStock: 12,
    rating: 4.8,
    description: "Laptop 2-in-1 độc đáo, màn hình cảm ứng 120Hz, RTX 4060, hỗ trợ Surface Pen.",
    discount: 7,
    selled: 28
  },
  {
    name: "LG Gram 17 (2024) (i7/16GB/512GB)",
    image: "https://images.pexels.com/photos/261679/pexels-photo-261679.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 39990000,
    countInStock: 20,
    rating: 4.7,
    description: "Màn hình 17 inch nhưng chỉ nặng 1.35kg, pin 20 giờ, chuẩn quân đội Mỹ.",
    discount: 10,
    selled: 42
  },
  {
    name: "Gigabyte Aero 16 OLED (i9/RTX 4060)",
    image: "https://images.pexels.com/photos/3987066/pexels-photo-3987066.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 52990000,
    countInStock: 18,
    rating: 4.8,
    description: "Laptop cho creator, màn hình OLED 4K 100% DCI-P3, X-Rite Pantone.",
    discount: 8,
    selled: 35
  },
  {
    name: "HP Omen 16 (2024) (i7/RTX 4060)",
    image: "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 34990000,
    countInStock: 30,
    rating: 4.6,
    description: "Gaming laptop tầm trung cao, màn hình 165Hz, tản nhiệt Omen Tempest.",
    discount: 12,
    selled: 65
  },
  {
    name: "Samsung Galaxy Book3 Ultra (i7/RTX 4050)",
    image: "https://images.pexels.com/photos/6830538/pexels-photo-6830538.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 44990000,
    countInStock: 25,
    rating: 4.7,
    description: "Laptop cao cấp Samsung, màn hình 3K AMOLED, liên kết Samsung Galaxy.",
    discount: 10,
    selled: 38
  },
  {
    name: "Framework Laptop 13 (i5/16GB/512GB)",
    image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Laptop",
    price: 29990000,
    countInStock: 15,
    rating: 4.8,
    description: "Laptop module hóa, có thể tự nâng cấp và sửa chữa, thân thiện môi trường.",
    discount: 5,
    selled: 25
  },

  // ================================================
  // 📟 TABLET - 5 sản phẩm
  // ================================================
  {
    name: "iPad Pro 12.9-inch M2 (512GB)",
    image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Tablet",
    price: 39990000,
    countInStock: 28,
    rating: 4.9,
    description: "Màn hình Liquid Retina XDR, chip M2 cực mạnh, hỗ trợ Apple Pencil hover.",
    discount: 5,
    selled: 85
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra 512GB (5G)",
    image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Tablet",
    price: 32990000,
    countInStock: 22,
    rating: 4.8,
    description: "Màn hình khổng lồ 14.6 inch AMOLED, chip Snapdragon 8 Gen 2, kèm S Pen.",
    discount: 8,
    selled: 52
  },
  {
    name: "Microsoft Surface Pro 9 (i7/16GB/256GB)",
    image: "https://images.pexels.com/photos/5310587/pexels-photo-5310587.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Tablet",
    price: 31990000,
    countInStock: 30,
    rating: 4.7,
    description: "Tablet Windows 2-in-1, chạy được phần mềm desktop, hỗ trợ Surface Pen.",
    discount: 10,
    selled: 68
  },
  {
    name: "Lenovo Tab P12 Pro 256GB",
    image: "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Tablet",
    price: 16990000,
    countInStock: 40,
    rating: 4.6,
    description: "Màn hình AMOLED 12.6 inch 120Hz, 4 loa JBL, hỗ trợ Lenovo Precision Pen 3.",
    discount: 12,
    selled: 95
  },
  {
    name: "Huawei MatePad Pro 13.2 256GB",
    image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Tablet",
    price: 24990000,
    countInStock: 20,
    rating: 4.7,
    description: "Màn hình OLED 13.2 inch siêu lớn, hiệu năng mạnh mẽ, hỗ trợ M-Pencil Gen 3.",
    discount: 8,
    selled: 45
  },

  // ================================================
  // ⌚ SMARTWATCH - 5 sản phẩm
  // ================================================
  {
    name: "Apple Watch Ultra 2 (49mm GPS + Cellular)",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Watch",
    price: 23990000,
    countInStock: 25,
    rating: 4.9,
    description: "Đồng hồ thể thao cực đại, vỏ Titanium, pin 36 giờ, nút Action độc đáo.",
    discount: 5,
    selled: 55
  },
  {
    name: "Samsung Galaxy Watch 6 Classic 47mm (LTE)",
    image: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Watch",
    price: 12990000,
    countInStock: 45,
    rating: 4.7,
    description: "Thiết kế viền xoay cổ điển, màn hình AMOLED sáng, theo dõi sức khỏe toàn diện.",
    discount: 10,
    selled: 120
  },
  {
    name: "Garmin Forerunner 965 (AMOLED)",
    image: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Watch",
    price: 18990000,
    countInStock: 30,
    rating: 4.8,
    description: "Đồng hồ chạy bộ chuyên nghiệp, màn hình AMOLED, bản đồ chi tiết, pin 23 ngày.",
    discount: 7,
    selled: 65
  },
  {
    name: "Huawei Watch GT 4 46mm",
    image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Watch",
    price: 6990000,
    countInStock: 60,
    rating: 4.6,
    description: "Thiết kế sang trọng, pin 14 ngày, theo dõi sức khỏe toàn diện, giá cả phải chăng.",
    discount: 12,
    selled: 140
  },
  {
    name: "Amazfit GTR 4 New Version",
    image: "https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Watch",
    price: 4490000,
    countInStock: 80,
    rating: 4.5,
    description: "Màn hình AMOLED 1.43 inch, GPS kép, pin 14 ngày, hơn 150 chế độ thể thao.",
    discount: 15,
    selled: 200
  },

  // ================================================
  // 🎧 TAI NGHE & LOA - 5 sản phẩm
  // ================================================
  {
    name: "AirPods Pro 2 (USB-C)",
    image: "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Headphone",
    price: 6490000,
    countInStock: 100,
    rating: 4.8,
    description: "Chip H2, khử tiếng ồn thích ứng, Spatial Audio, cổng USB-C.",
    discount: 8,
    selled: 250
  },
  {
    name: "Sony WH-1000XM5",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Headphone",
    price: 8990000,
    countInStock: 60,
    rating: 4.9,
    description: "Tai nghe over-ear khử ồn tốt nhất, 8 microphone, pin 30 giờ, chất âm Hi-Res.",
    discount: 10,
    selled: 180
  },
  {
    name: "Bose QuietComfort Ultra Earbuds",
    image: "https://images.pexels.com/photos/8000620/pexels-photo-8000620.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Headphone",
    price: 7490000,
    countInStock: 50,
    rating: 4.7,
    description: "Khử tiếng ồn đỉnh cao, Immersive Audio, vừa tai thoải mái, pin 6 giờ.",
    discount: 12,
    selled: 95
  },
  {
    name: "Samsung Galaxy Buds2 Pro",
    image: "https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Headphone",
    price: 4990000,
    countInStock: 80,
    rating: 4.6,
    description: "Khử ồn chủ động, 360 Audio, kết nối Galaxy liền mạch, chống nước IPX7.",
    discount: 15,
    selled: 150
  },
  {
    name: "JBL Charge 5 Portable Speaker",
    image: "https://images.pexels.com/photos/1279105/pexels-photo-1279105.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "Speaker",
    price: 4790000,
    countInStock: 70,
    rating: 4.7,
    description: "Loa Bluetooth mạnh mẽ, chống nước IP67, pin 20 giờ, có thể làm powerbank.",
    discount: 10,
    selled: 180
  },

  // ================================================
  // 📺 SMART TV - 5 sản phẩm
  // ================================================
  {
    name: "Sony BRAVIA XR A95L OLED 4K 65 inch",
    image: "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "TV",
    price: 75990000,
    countInStock: 5,
    rating: 4.9,
    description: "QD-OLED panel đỉnh cao, chip Cognitive XR, Acoustic Surface Audio+, Google TV.",
    discount: 8,
    selled: 12
  },
  {
    name: "LG OLED evo C3 4K 55 inch",
    image: "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "TV",
    price: 32990000,
    countInStock: 18,
    rating: 4.8,
    description: "OLED tự phát sáng, chip α9 Gen6 AI, 120Hz VRR cho gaming, webOS 23.",
    discount: 12,
    selled: 35
  },
  {
    name: "Samsung Neo QLED QN90C 4K 65 inch",
    image: "https://images.pexels.com/photos/2506947/pexels-photo-2506947.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "TV",
    price: 42990000,
    countInStock: 12,
    rating: 4.7,
    description: "Mini LED Quantum Matrix, Neural Quantum Processor 4K, Object Tracking Sound+.",
    discount: 15,
    selled: 28
  },
  {
    name: "TCL C845 Mini LED 4K 65 inch",
    image: "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "TV",
    price: 22990000,
    countInStock: 20,
    rating: 4.6,
    description: "Mini LED với 1344 vùng dimming, 144Hz VRR, Google TV, giá cả tốt.",
    discount: 18,
    selled: 45
  },
  {
    name: "Xiaomi TV Q2 QLED 4K 55 inch",
    image: "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500",
    type: "TV",
    price: 16990000,
    countInStock: 25,
    rating: 4.5,
    description: "QLED Quantum Dot, 120Hz, Dolby Vision & Atmos, Google TV, thiết kế kim loại.",
    discount: 15,
    selled: 60
  }
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
