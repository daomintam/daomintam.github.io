# Cài analytics cho TΛMVERSE bằng Supabase

## 1. Tạo project

1. Mở https://supabase.com/dashboard và chọn **New project**.
2. Chọn region gần người xem chính, đặt database password và chờ project khởi tạo.
3. Vào **SQL Editor → New query**, dán toàn bộ file `supabase/analytics.sql`, rồi chọn **Run**.

## 2. Đăng nhập Supabase CLI

```powershell
npx supabase@latest login
npx supabase@latest link --project-ref YOUR_PROJECT_REF
```

`YOUR_PROJECT_REF` nằm trong URL dashboard: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`.

## 3. Lấy hai API key

Mở **Project Settings → API Keys**:

- Copy **Publishable key**. Key này được phép xuất hiện trên website.
- Copy **Secret key**. Tuyệt đối không đưa key này lên GitHub hoặc frontend.

## 4. Cấu hình và deploy Edge Function

Tại thư mục repository, chạy:

```powershell
npx supabase@latest secrets set ANALYTICS_SECRET_KEY="YOUR_SECRET_KEY" ANALYTICS_PUBLISHABLE_KEY="YOUR_PUBLISHABLE_KEY"
npx supabase@latest functions deploy analytics --no-verify-jwt --use-api
```

Function dùng IP tạm thời để hỏi `api.country.is` tên quốc gia nhưng **không lưu IP**. Cờ `--no-verify-jwt` cần thiết vì function tự kiểm tra publishable key trong header.

## 5. Kết nối website

Mở `source/public/analytics-config.js` và điền:

```js
window.TAMVERSE_ANALYTICS = {
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  publishableKey: "YOUR_PUBLISHABLE_KEY"
}
```

Sau đó yêu cầu Codex build và push, hoặc chạy `npm run build` trong thư mục `source`, copy nội dung build ra root, commit và push.

## 6. Gắn link có nguồn

Link trên profile X:

```text
https://daomintam.github.io/?utm_source=x&utm_medium=social&utm_campaign=profile
```

Link cho bài đăng cụ thể hoặc chủ đề crypto:

```text
https://daomintam.github.io/?utm_source=x&utm_medium=social&utm_campaign=crypto&utm_content=bitcoin
```

Đổi `x`, `profile`, `crypto`, `bitcoin` để phân biệt từng nơi đặt link. Nếu không có UTM, hệ thống dùng domain giới thiệu; truy cập trực tiếp được ghi là `direct`.

## 7. Kiểm tra

1. Mở link UTM bằng cửa sổ ẩn danh.
2. Trong Supabase vào **Table Editor → analytics_visits** và xác nhận có một dòng mới.
3. Trên website, bấm icon biểu đồ cạnh dòng “An imagination…” để xem tổng lượt, hôm nay, 7 ngày, quốc gia, nguồn và nền tảng.

Mỗi tab trình duyệt chỉ ghi một lượt trong một ngày. RLS chặn truy cập trực tiếp từ browser; chỉ Edge Function có secret key mới được đọc/ghi bảng.
