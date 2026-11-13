# Makeup Ngô Trâm — "Bức tường gương mặt" · Design

Ngày: 13/11/2026 · Trạng thái: hướng B đã chọn qua spike, chờ duyệt tài liệu
Thay thế phần trang chủ + trang concept của `2026-11-11-ngo-tram-scenes-redesign-design.md`.

## 1. Vì sao

Chủ brand muốn trang giống **bố cục và cách trang biến đổi khi cuộn** của trang Kim Ngân (`E:\Personal\kim-ngan`): một hành trình liền mạch, mọi chuyển động là hàm liên tục của vị trí cuộn. Chủ **không muốn dùng ảnh concept của TO Studio** (đó là sản phẩm của studio) mà dùng ảnh gương mặt khách chính Trâm trang điểm. Muốn "cách điệu và ấn tượng hơn".

Thành công = khách mở trang trên điện thoại, thấy ngay rất nhiều gương mặt thật Trâm đã làm, cuộn thấy "ồ", rồi nhắn đặt lịch.

## 2. Đã quyết

| Hạng mục | Quyết định | Ai quyết |
|---|---|---|
| Hướng | Spike **B · Bức tường gương mặt** (`.superpowers/brainstorm/9356-1794539113/content/spike-b.html`) | Người dùng |
| Màu, chữ | Giữ của Ngô Trâm: kem `#EDE7D9`, giấy `#F5F1E8`, rêu `#2F3B2C`; Great Vibes + Quicksand (+ Gowun Batang ko, Nunito ru). **Không** dùng màu tối/vàng của Kim Ngân | Người dùng |
| Logo | Logo NT thật (`public/brand/*`) — mark trên thanh đầu, logo đầy đủ giữa bức tường mở đầu | Người dùng |
| Ảnh | Ảnh từ Drive của chủ (89 file, tải về `assets/drive/`, **gitignored**); bỏ toàn bộ ảnh concept/TO Studio | Người dùng |
| Trang concept | Bỏ 18 trang `/[locale]/concepts/[slug]`; URL cũ chuyển hướng 308 về `/[locale]` | Người dùng ("ok") |
| Xem ảnh to | Bấm ảnh → mở to tại chỗ (lightbox), không có trang riêng | Người dùng ("ok") |
| Ảnh sự kiện/cuộc thi | Đưa vào chương Hậu trường, **không ghi tên sự kiện**, không nói "makeup cho hoa hậu" | Mình (chủ chưa rõ sự kiện) |
| Credit | Bỏ dòng `Photo: TO Studio` (không còn ảnh studio) | Mình |
| Ảnh tràn màn hình | `object-fit: cover` như spike; mỗi ảnh có tiêu điểm (`focus`, % x/y) để giữ mặt trong khung khi cắt ngang trên desktop | Mình |
| Mục "Về Trâm" | Giữ nội dung (giới thiệu, dịch vụ, khu vực `AREA`) nhưng chuyển vào chương Hậu trường, dưới câu "Sau tấm gương" | Mình |
| Footer | Bức tường nền footer dùng ảnh gương mặt cỡ `sm` (≈12 ảnh, lazy) thay ảnh concept | Mình |
| Chữ cũ nói về concept | Viết lại `step1`, `siteDescription`, `messageTemplate`… ở cả vi/ko/ru, giọng khiêm tốn (ko/ru vẫn là nháp) | Mình |

## 3. Trang chủ `/[locale]` — 5 chương

Thanh đầu cố định (mix-blend difference): mark NT trái · menu ngôn ngữ · nút Đặt lịch.

1. **Bức tường** (ghim ~3,4 màn hình). Lưới 5×5 gương mặt nghiêng nhẹ (−6°), logo trắng + "Nha Trang" ở giữa. Cuộn: lưới xoay thẳng → máy quay lao vào ô giữa (ảnh #43) tới khi ô đó phủ kín màn hình; ô khác mờ và giạt ra xa; logo phóng to rồi tan.
2. **Look lớn** (ghim ~5 màn hình). 6 ảnh tràn màn hình; ảnh sau mở ra từ vòng tròn (clip-path circle) trên ảnh trước, ảnh bên trong thu từ 1,3→1. Chú thích góc dưới trái: dòng nhỏ "01 — Loại" + tên viết tay; bộ đếm "01 / 06" góc phải. Ảnh đầu = ảnh cuối của chương 1 (liền mạch).
3. **Thêm nhiều gương mặt.** Tiêu đề viết tay + 2 dải ảnh chạy ngược chiều theo cuộn. Bấm ảnh → lightbox.
4. **Hậu trường** (nền rêu). Chia đôi: chữ ghim bên trái ("Sau tấm gương" + 1–2 câu), cột ảnh bên phải phóng/nghiêng nhẹ theo vị trí. Mobile: xếp dọc.
5. **Hẹn gặp** — giữ nguyên footer finale hiện có (`Footer`, `FinaleActions`: câu mẫu, chép, kênh theo ngôn ngữ, Kakao ở `ko`). Câu mẫu không còn `{concept}` → dùng câu chung có chỗ trống ngày.

Spike B là tham chiếu chuyển động; bản thật được tinh chỉnh (nhịp, easing) nhưng không đổi cấu trúc.

### Ảnh dùng (từ `assets/drive/NN.jpg`)

- Chương 1 (25): 72 87 02 85 30 / 82 34 57 12 75 / 62 09 **43** 36 86 / 88 84 01 44 78 / 58 63 49 31 54
- Chương 2 (6): 43 Tóc cài hoa · 17 Cô dâu · 70 Áo dài · 30 Ngoại cảnh · 12 Hoa ly · 1 ảnh nữa do người dựng chọn. **Điều kiện: ảnh rộng ≥ 1700 px** (vì phủ kín màn hình desktop). 89 và 85 (≈900 px) chuyển sang chương 3.
- Chương 3: mọi gương mặt không trùng (được lặp ảnh chương 1, vì chương 1 chỉ lướt qua) — 03 04 05 09 10 12 16 26 32 35 36 37 42 52 56 57 58 60 61 62 64 65 73 74 75 78 80 81 82 83 84 86 87 88 (người dựng chọn lại nếu thấy ảnh yếu)
- Chương 4: 13 11 18 29 08 25 + sự kiện 46 68
- **Không dùng**: trùng (19 20 21 22 24 50 14 15 27 33 59 76 77 79), ảnh nhóm/ê-kíp không rõ ai (23 38 39 40 41 55), sự kiện còn lại (45 47 48 66 67 69), 06 07 (ghép), 71 (trùng bộ với 70)

Ảnh trùng = gần như cùng khung với ảnh khác (cặp do mình xác định bằng mắt).

## 4. Ảnh & hiệu năng

- Script `scripts/export-faces.mjs` (sharp): đọc `assets/drive/`, xuất `public/faces/<id>-{sm,md,lg}.webp` (≈400/900/1600 px cạnh dài), tự xoay EXIF, bỏ metadata (EXIF/GPS). Danh sách ảnh và chú thích nằm trong `src/content/faces.ts` (id, loại, chương, chú thích theo locale, kích thước). Ảnh đã xuất **được commit** (Vercel cần); ảnh gốc thì không.
- **Kiểm watermark từng ảnh** trước khi đưa vào danh sách; ảnh có watermark/logo nơi khác → loại.
- Ảnh tràn màn hình dùng `lg`, ô lưới/dải dùng `sm`/`md` qua `srcset`/`sizes`. Chương 1 ưu tiên tải ô giữa; còn lại lazy.
- Ảnh tràn màn hình: phóng tối đa ~1,15× ở desktop 1920 px (lý do của điều kiện ≥ 1700 px). Ô lưới/dải: bề rộng hiện × DPR ≤ bề rộng gốc. Ảnh nhỏ nhất 513×769 chỉ dùng ở dải ảnh.

## 5. Chuyển động

- Một vòng `requestAnimationFrame` đọc vị trí cuộn đã làm mượt (Lenis đã có trong dự án), mỗi chương tính tiến độ 0→1 rồi đặt transform/clip-path/opacity. Không nhảy nấc.
- `prefers-reduced-motion`: không ghim, không zoom/clip; chương 1 hiện lưới tĩnh + logo, chương 2 thành danh sách ảnh dọc.
- **Không JS**: mọi ảnh và chữ hiện (lưới tĩnh, ảnh lớn xếp dọc, dải ảnh cuộn ngang được); lightbox thì không có — ảnh là link tới file `lg`.
- Không dùng màu hoặc hạt bụi vàng của Kim Ngân.

## 6. Giữ nguyên / bỏ

- **Giữ**: i18n vi/ko/ru + menu ngôn ngữ, proxy chọn ngôn ngữ, favicon/icon, footer finale, BookButton nổi (ẩn khi tới finale), sitemap/robots (sitemap còn 3 URL), test tương phản & chồng chữ (áp vào chữ mới).
- **Bỏ**: `concepts.ts`, `themes.ts`, Scene/SceneObserver/Gallery/ChapterIndex/Intro/Credit và ảnh/script liên quan tới concept (`collages`, `crop-collages`, `export-collages`, `public/concepts/*`), test của chúng. `make-og.mjs` tạo ảnh OG mới từ ảnh gương mặt + logo.
- Chuỗi ko/ru mới vẫn đánh dấu `KO-DRAFT` / `RU-DRAFT`.

## 7. Ràng buộc

- Không dữ liệu cá nhân khách: không tên khách, chú thích chỉ là loại look. Ảnh khách do chủ cung cấp để đăng.
- Không tự khen ("số 1", "tốt nhất"), không bịa đánh giá, không nhắc tên sự kiện/thí sinh.
- Hỏi trước khi push/deploy.
- Next.js 16.4.6 — đọc `node_modules/next/dist/docs/` khi dùng API lạ (AGENTS.md).

## 8. Để người dựng tự quyết

Nhịp ghim chính xác, easing, khoảng cách lưới trên mobile, chữ chú thích (khiêm tốn, cụ thể), chọn lại ảnh chương 3 nếu ảnh mờ/xấu, cách làm lightbox (`<dialog>` gợi ý).

## 9. Việc mở (không chặn)

Chủ xác nhận ảnh sự kiện là sự kiện gì · người bản ngữ duyệt ko/ru · thử trên iPhone thật trong webview Facebook/Zalo.
