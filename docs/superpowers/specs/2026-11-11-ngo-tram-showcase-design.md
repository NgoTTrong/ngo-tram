# Makeup Ngô Trâm — Showcase Site · Design

Ngày: 11/11/2026 · Trạng thái: chờ duyệt

## 1. Mục đích & lý do

Makeup Ngô Trâm (IG `@tram_ngohuynh`) là thợ makeup tại **nội thành Nha Trang**, bán gói **makeup + chụp snap** cho tiệc, kỷ yếu/tốt nghiệp, sự kiện, concept beauty. Khách gồm **người Việt và khách du lịch Hàn Quốc** (bio IG hiện viết tiếng Hàn).

Trang này là **showcase**: khách (chủ yếu từ IG/TikTok/Threads, trên điện thoại) lướt qua các bộ concept thật → ấn tượng tay nghề → bấm **Đặt lịch** → nhắn **Zalo**.

UI/UX là ưu tiên số 1 — trang chính là "portfolio" của shop.

## 2. Mục tiêu / Không làm / Chống-mục-tiêu

**Mục tiêu**
- Gây "wow" ngay màn đầu, bằng ảnh thật của shop.
- Cho thấy độ rộng tay nghề: 18 concept rất khác nhau (cưới, áo dài, biển, sinh nhật, couple, Giáng sinh, beauty close-up).
- Đặt lịch luôn trong tầm 1 chạm, trên mọi màn.
- Song ngữ **VI / 한국어**.

**Không làm (lần này)**
- Không bảng giá (hỏi giá qua Zalo). *(suy ra — người dùng không đề cập giá khi được hỏi)*
- Không form đặt lịch, không backend, không CMS, không thanh toán.
- Không blog.

**Chống-mục-tiêu (làm vậy là hỏng dù chạy được)**
- Trông như template/theme có sẵn.
- Ảnh tải chậm hoặc vỡ nét trên điện thoại.
- Chữ Great Vibes dùng cho đoạn văn dài → khó đọc.
- Lỗi dấu tiếng Việt hoặc ô vuông thay chữ Hàn.
- Hiển thị watermark/thẻ chữ của studio khác như thể là của shop.

## 3. Đã quyết (do người dùng chọn)

| Hạng mục | Quyết định |
|---|---|
| Hướng trải nghiệm | **B · Lookbook từng chương**: mỗi concept = 1 "chương" toàn màn hình, cuộn tới đâu đổi không khí tới đó |
| Font điểm nhấn | **Great Vibes** (Google Fonts, có subset vietnamese) — cho tên concept & tiêu đề lớn |
| Màu | Theo màu shop: kem `#EDE7D9` / giấy `#F5F1E8`, xanh rêu `#2F3B2C` (phụ `#5B6650`). Trên ảnh: chữ trắng + lớp gradient tối |
| Ngôn ngữ | Việt + Hàn |
| CTA đặt lịch | **2 kênh chính: Zalo và Facebook.** Bấm "Đặt lịch" → chọn Zalo (`https://zalo.me/84368588723`) hoặc Facebook (`https://www.facebook.com/share/1A8s2dohNm/`) |
| Mạng xã hội | Instagram `https://www.instagram.com/tram_ngohuynh` · TikTok `https://www.tiktok.com/@tieuutienn` · Threads `https://www.threads.com/@tram_ngohuynh` · Facebook `https://www.facebook.com/share/1A8s2dohNm/` |
| Công nghệ | **Next.js** |

## 4. Quyết định của Claude (người dùng chưa phản đối, có thể đổi)

- **Font phụ:** Quicksand (nội dung, nav, nút — hỗ trợ tiếng Việt); Gowun Batang cho tiếng Hàn. Great Vibes chỉ dùng cho tên/tiêu đề ngắn.
- **Mobile-first.** Mobile: mỗi chương 1 màn dọc full ảnh, vuốt lên sang chương. Desktop: chương dạng bộ 3 ảnh ngang (triptych) phủ màn — vì ảnh rời độ phân giải vừa phải (xem §6), 1 ảnh phóng full desktop sẽ mờ.
- **Thẻ giữa của mỗi ảnh ghép bị bỏ** (chứa logo "TO STUDIO" + mô tả). Chỉ dùng 8 ảnh xung quanh. Mô tả trong thẻ được **chép lại thành chữ** trên trang. **Người dùng xác nhận:** Trâm makeup, TO Studio chụp, được phép dùng thoải mái làm portfolio. Ghi công nhỏ ở mỗi chương và trang concept: "Makeup: Ngô Trâm · Photo: TO Studio". Phần "snap" trong gói dịch vụ do đối tác TO Studio chụp — copy dịch vụ viết "makeup + chụp snap cùng studio đối tác", không ngụ ý Trâm tự chụp.
- **Logo:** tách nền file `assets/logo.png` thành SVG/PNG trong suốt, 2 biến thể: xanh rêu (trên nền kem) và trắng (trên ảnh).
- **Hiệu ứng:** GSAP + ScrollTrigger (chuyển chương, parallax nhẹ, chữ hiện dần), Lenis cho cuộn mượt. Tôn trọng `prefers-reduced-motion`.
- **Đăng:** Vercel; gắn tên miền riêng sau.
- **Watermark trong ảnh:** ít nhất 1 ảnh (`pirate.jpg`, ô 1) có ký hiệu nhỏ của studio trên cột gỗ. Builder soi từng ảnh rời ở kích thước gốc; ảnh có dấu → cắt bớt khung hoặc loại bỏ, không retouch xoá logo người khác.
- **Đặt lịch theo concept:** concept là ví dụ tay nghề, không phải gói cố định. Nút trên trang concept ghi kiểu "Thích concept này? Nhắn Trâm qua Zalo" — không hứa trang phục/đạo cụ/địa điểm. A Private Escape chụp tại resort (ngoài nội thành) — giữ làm showcase, không ghi địa điểm.
- **Khách Hàn cũng đặt qua Zalo hoặc Facebook** (người dùng chọn sau khi được gợi ý KakaoTalk). Bản tiếng Hàn kèm 1 dòng hướng dẫn ngắn; Instagram DM làm kênh phụ ở footer.
- **Nút đặt lịch:** bấm mở bảng chọn nhỏ 2 lựa chọn Zalo / Facebook. Không có JS → nút là link tới mục liên hệ ở cuối trang có sẵn 2 link.
- **Tiếng Hàn:** Claude dịch nháp, **phải có người biết tiếng Hàn duyệt trước khi công khai**.

## 5. Cấu trúc trang

Một trang chính (cuộn dài) + trang chi tiết từng concept.

1. **Màn mở đầu (Intro)** — logo, câu tagline ngắn, gợi ý "cuộn xuống". Có thể là chương 0 với triptych ảnh đẹp nhất.
2. **18 chương concept** — mỗi chương: số chương (`CHƯƠNG 07 / 18`), tên concept (Great Vibes), 1 dòng tagline VI/KO, ảnh nền. Thanh tiến độ/chỉ mục chương (dots hoặc số) để biết đang ở đâu và nhảy nhanh.
3. **Bấm vào chương → trang concept** `/concepts/[slug]`: gallery 8 ảnh (lightbox, vuốt trên mobile), đoạn mô tả, nút Đặt lịch, link sang concept trước/sau.
4. **Về Trâm** — ảnh Trâm đang làm việc (avatar IG — cần xin file gốc), vài dòng giới thiệu, khu vực phục vụ (nội thành Nha Trang), dịch vụ: makeup + snap · tiệc · kỷ yếu · sự kiện · concept beauty.
5. **Footer / Liên hệ** — Zalo, Instagram, TikTok, Threads; ghi công ảnh.

**Luôn hiển thị:** nút **Đặt lịch qua Zalo** (nổi trên mobile), nút chuyển **VI / 한국어**.

Thứ tự 18 chương: builder đề xuất (gợi ý: xen kẽ tông sáng/tối, rực/dịu để mỗi lần cuộn là 1 bất ngờ; mở bằng concept mạnh nhất).

## 6. Tài nguyên hiện có

`assets/` có `logo.png` (nền kem, chưa tách) và 18 ảnh ghép. **Mỗi ảnh ghép là lưới 3×3 liền nhau, không có khe**: 8 ảnh + ô giữa (index 4, hàng 2 cột 2) là thẻ tên/mô tả. Cắt theo 1/3 chiều rộng/cao (bỏ ~4px viền mỗi cạnh) là sạch — đã thử.

| File | Concept |
|---|---|
| anchor.jpg | A Love Anchored |
| blowing.jpg* | Blooming Grace |
| ethereal.jpg* | Ethereal Shore |
| fairy.jpg | Lotus Fairy |
| fancy.jpg | Fancy Nancy |
| inyoureyes.jpg | In Your Eyes |
| lavie.jpg | La Vie En Rose |
| lotus.jpg | The White Lotus |
| ocean.jpg | Ocean Kissed |
| petal.jpg | Petals & Grace |
| pink.jpg | Pink Dream 21 |
| pirate.jpg | A Private Escape |
| summer.jpg* | Summer Crush |
| sweet.jpg | Sweetheart's Day |
| velvet.jpg* | Velvet Silence |
| vietnam.jpg | Vietnamese Grace |
| winter.jpg | Winter Cherie |
| wishful.jpg | Wishful Moment |

Ảnh ghép 2048×2560 → mỗi ảnh rời ~680×850. Các file có dấu `*` chỉ ~1180×1490 → ảnh rời ~390×495 (thấp; tránh dùng làm nền lớn, ưu tiên ở gallery/triptych). Nếu shop có ảnh gốc, thay vào sau.

Mô tả concept: tiếng Việt trong thẻ giữa (riêng A Private Escape bằng tiếng Anh). Builder đọc/chép lại, rút gọn thành 1 tagline + 1 đoạn ngắn.

## 7. Ràng buộc

- Hiển thị đúng dấu tiếng Việt và chữ Hàn ở mọi font dùng.
- Ảnh tối ưu (next/image hoặc tiền xử lý sang WebP/AVIF, nhiều kích cỡ, lazy-load ngoài chương đầu). Màn đầu tải nhanh trên 4G.
- Chạy tốt Safari iOS và Chrome Android (in-app browser của Instagram/TikTok).
- Meta/OG image đẹp để link chia sẻ trên Zalo/IG/Kakao trông chuyên nghiệp.
- Không đưa dữ liệu cá nhân ngoài thông tin liên hệ công khai shop đã đăng.

## 8. Để builder tự quyết

Cấu trúc thư mục, router (App Router khuyến nghị), cách làm i18n (route `/vi` `/ko` hay toggle client — miễn có URL chia sẻ được theo ngôn ngữ), script cắt ảnh, chi tiết animation, thứ tự chương, nội dung tagline nháp, favicon.

## 9. Việc mở (không chặn build)

- Người duyệt bản tiếng Hàn.
- Ảnh chân dung Trâm cho mục "Về Trâm" + đoạn giới thiệu.
- Tên miền.
