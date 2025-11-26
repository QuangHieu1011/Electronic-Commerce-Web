# 🚀 HƯỚNG DẪN TÍCH HỢP PAYPAL ĐẦY ĐỦ

## 📋 BƯỚC 1: TẠO TÀI KHOẢN PAYPAL DEVELOPER

### 1.1. Đăng ký tài khoản PayPal Developer
1. **Truy cập:** https://developer.paypal.com/
2. **Đăng nhập** bằng tài khoản PayPal cá nhân (hoặc tạo mới)
3. **Chấp nhận** điều khoản Developer

### 1.2. Tạo Application
1. **Vào Dashboard:** https://developer.paypal.com/developer/applications/
2. **Bấm "Create App"**
3. **Điền thông tin:**
   - App Name: `Electronic Commerce Web`
   - Merchant: Chọn tài khoản business (hoặc personal)
   - Features: **☑️ Accept payments**
   - Advanced Options → Intent: **Capture**

### 1.3. Lấy Client ID và Secret
1. **Sau khi tạo app** → Vào app detail
2. **Copy thông tin:**
   - **Sandbox Client ID:** `AYj_Uj2xFzV-8HFRjIQe6n4R8FJ8yUz6TmvEO_G4K3D2s8T4bhN3OvdHqJ9PAi6mjqJ8A3jhKUG-G5-9` (Fake - thay bằng ID thực)
   - **Sandbox Secret:** `[Your Secret Key]`

---

## 🔧 BƯỚC 2: CẤU HÌNH ỨNG DỤNG

### 2.1. Cập nhật PayPal Client ID
**File:** `frontend/src/components/PaymentModal/PayPalPaymentModal.jsx`
```javascript
// Line 12-16: Thay đổi Client ID
const paypalOptions = {
    "client-id": "YOUR_SANDBOX_CLIENT_ID_HERE", // ⚠️ THAY BẰNG CLIENT ID THỰC
    currency: "USD",
    intent: "capture"
}
```

### 2.2. Cấu hình API URL
**File:** `frontend/.env`
```bash
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 🧪 BƯỚC 3: TEST PAYPAL SANDBOX

### 3.1. Tài khoản Test Sandbox
**PayPal tự động tạo tài khoản test:**
1. **Vào:** https://developer.paypal.com/developer/accounts/
2. **Xem thông tin:**
   - **Business Account:** seller@example.com
   - **Personal Account:** buyer@example.com
   - **Password:** Thường là 12345678

### 3.2. Thẻ Test Credit Card
**Không cần tài khoản PayPal:**
```
Card Number: 4032035728043124
Expiry: 01/2028
CVV: 123
Name: Test User
```

### 3.3. Flow Test
1. **Khởi động:** Backend (port 3001) + Frontend (port 3000)
2. **Vào checkout** → Chọn **"Thanh toán PayPal"**
3. **Bấm PayPal button** → Popup PayPal Sandbox
4. **Đăng nhập** với tài khoản test: `buyer@example.com`
5. **Hoặc dùng thẻ test** ở trên
6. **Confirm payment** → Redirect về website với success

---

## 🎯 BƯỚC 4: KIỂM TRA KẾT QUỢ

### 4.1. Console Logs
```javascript
// Thành công sẽ thấy:
PayPal payment successful: {
  id: "PAYID-XXXXX",
  status: "COMPLETED",
  purchase_units: [...]
}
```

### 4.2. Database Check
```javascript
// Order sẽ được tạo với:
{
  paymentMethod: "paypal",
  paymentStatus: "paid", 
  transactionId: "PAYID-XXXXX"
}
```

---

## ⚠️ TROUBLESHOOTING

### Lỗi thường gặp:
1. **"Invalid Client ID"** → Kiểm tra Client ID trong code
2. **"Currency not supported"** → Dùng USD cho sandbox
3. **"CORS Error"** → Kiểm tra domain whitelist trên PayPal
4. **"Order not found"** → Kiểm tra backend API endpoint

### Debug Steps:
1. **F12 Console** → Xem error logs
2. **Network tab** → Kiểm tra API calls
3. **PayPal Developer Dashboard** → Xem transaction history

---

## 📱 BƯỚC 5: PRODUCTION SETUP

### 5.1. Chuyển sang Live
1. **Tạo Live App** trên PayPal Developer
2. **Thay Client ID** từ Sandbox → Live
3. **Cập nhật currency** nếu cần (USD → VND)
4. **Test với thẻ thật** (số tiền nhỏ)

### 5.2. Webhook Setup (Optional)
1. **Vào App Settings** → Webhooks
2. **Add endpoint:** `https://yourdomain.com/api/paypal/webhook`
3. **Subscribe events:** Payment completed, Failed, Refunded

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Tạo PayPal Developer account
- [ ] Tạo Sandbox App và lấy Client ID
- [ ] Cập nhật Client ID trong code
- [ ] Khởi động Backend + Frontend
- [ ] Test checkout với PayPal
- [ ] Verify order được tạo trong database
- [ ] Test với tài khoản sandbox
- [ ] Test với thẻ credit card test

---

## 🎉 KẾT QUẢ MONG ĐỢI

**Sau khi hoàn thành:**
✅ Checkout có 2 options: COD + PayPal  
✅ PayPal button hiển thị popup sandbox  
✅ Thanh toán thành công tạo order với `paymentMethod: "paypal"`  
✅ Redirect về `/order-tracking` với thông báo thành công  

**Demo URL:** http://localhost:3000/checkout