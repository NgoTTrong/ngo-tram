# Ngô Trâm showcase — thiết kế lại "Cảnh theo màu" (scenes redesign)

Ngày: 11/11/2026 · Thay thế phần bố cục (§5 và phần chapter) của `2026-11-11-ngo-tram-showcase-design.md`. Mọi thứ khác của spec cũ (thương hiệu, song ngữ, đặt lịch, credit, ràng buộc watermark, SEO, 404) giữ nguyên trừ khi nói khác ở đây.

## 1. Mục đích & lý do

Bản đầu tiên (nhánh `feat/showcase`, commit `a2dc281`) cắt mỗi collage 3×3 thành từng ô rồi kéo ảnh full màn hình. Ô gốc chỉ ~670 px (4 bộ chất lượng thấp ~380 px), nên bị phóng to 2–3 lần → vỡ, nhoè. Người dùng: "Xấu quá, ảnh vỡ tùm lum" và "Tui thấy hình gốc của studio đã rất đẹp rồi".

Hướng mới, do người dùng chọn: **mỗi concept là một cảnh trọn màn hình, cả trang khoác màu và tông của chính bộ ảnh, có chuyển cảnh và hiệu ứng hợp chủ đề — "nâng tầm cái đẹp đó lên"**. Tấm collage gốc của studio là nhân vật chính, hiện nguyên vẹn, không bao giờ phóng to quá kích thước thật.

Người dùng đã xem bản chạy thử (spike) ở `scratchpad/spike/index.html` với 5 concept và trả lời "oke". Spike là tham chiếu cảm giác, không phải code để giữ.

## 2. Mục tiêu / Không làm / Chống-mục-tiêu

**Mục tiêu**
- Khách mở link từ IG/TikTok thấy ngay ảnh nét, màu đẹp, chuyển động mượt → ấn tượng tay nghề → bấm đặt lịch.
- Mỗi concept có "không khí" riêng: màu nền, màu chữ, hiệu ứng hạt.
- Ảnh luôn nét trên điện thoại DPR 3 và laptop.

**Không làm**
- Không chỉnh sửa ảnh (retouch), không AI upscale.
- Không thêm concept, không có giá.

**Chống-mục-tiêu (thất bại dù chạy được)**
- Bất kỳ ảnh nào hiện to hơn kích thước gốc của nó (tính theo pixel thiết bị) đến mức thấy vỡ.
- Hiệu ứng làm giật, nóng máy điện thoại, hoặc che mặt người mẫu.
- Chữ khó đọc trên nền màu (dưới WCAG AA).
- Trang trống/không thấy ảnh khi tắt JS hoặc JS chậm.

## 3. Đã quyết (người dùng chọn)

- Cả trang đổi màu theo tông ảnh của concept đang xem; màu chuyển dần khi cuộn sang concept khác.
- Collage gốc hiện nguyên tấm (có cả ô chữ ở giữa của studio).
- Có animation chuyển cảnh và hiệu ứng hợp chủ đề.
- Giữ: Great Vibes, logo, song ngữ vi/ko, đặt lịch Zalo/FB, socials, credit "Makeup: Ngô Trâm · Photo: TO Studio", Next.js.

## 4. Quyết định của Claude (người dùng chưa phản đối, có thể đổi)

1. **Kích thước ảnh — quy tắc đo** (quyết của Claude sau builder check):
   - **Collage**: kích thước hiện (CSS px) ≤ kích thước gốc ÷ 2, tức nét hoàn toàn ở DPR 2. Cụ thể: khung desktop cao `min(82svh, 800px)` (bản xuất cao 1600 px); 4 bộ chất lượng thấp (cao ~1480) → khung tối đa ~740 px cao. Collage xuất WebP 2 cỡ (cao 1600 và 800; bộ thấp giữ cỡ gốc + bản 800).
   - **Ô lẻ (gallery, lightbox)**: kích thước hiện (CSS px) ≤ kích thước gốc (không bao giờ phóng to theo CSS px). Trên điện thoại DPR 3, ô ~680 px hiện rộng ~390 CSS px là chấp nhận được (mật độ ~1,7, không còn vỡ như bản cũ phóng 2–3 lần theo CSS px). Lightbox mobile vì vậy vẫn hiện ô rộng gần hết màn hình.
   - Review Focus #4 mới kiểm: với mọi `<img>` collage trên trang, `clientHeight * 2 ≤ naturalHeight + 2`; với ô lẻ, `clientWidth ≤ naturalWidth`.
2. **Bảng màu mỗi concept** = `{ bg, bg2, ink, accent, fx }`, lưu trong `concepts.ts`. Script lấy màu chủ đạo (k-means) làm bản nháp, sau đó chỉnh tay theo ảnh thật (ví dụ Ocean Kissed thực tế là tím hồng, không phải xanh biển). Unit test bắt buộc `ink` trên `bg` đạt ≥ 4,5:1.
3. **Hiệu ứng hạt** (canvas, một lớp cố định): `leaves`, `petals`, `bubbles`, `dust`, `snow`, `sparkle`, `hearts`, `none`. Gán từng concept theo nội dung ảnh — builder xem ảnh và quyết; gợi ý: White Lotus=leaves, La Vie en Rose=petals, Ocean Kissed=bubbles, Velvet Silence=dust, Winter Chérie=snow, Sweethearts' Day=hearts.
4. **Chuyển cảnh** (như spike): nền + chữ + logo + nút tween sang màu mới (~1,4 s); collage mở ra từ khung bo tròn, ảnh từ mờ sang nét; tên concept hiện như viết tay (clip-path); tên lớn mờ chìm phía sau trượt ngang theo cuộn; cảnh cũ mờ và lùi nhẹ khi rời. Không phóng to ảnh quá 1.0 khi đã hiện xong.
5. **A Private Escape**: collage này chứa ô có watermark studio khác (ô 1, hàng trên giữa). Hiện **bản cắt 3×2 (hai hàng dưới)** — là cắt, không chỉnh sửa; khung hiện tỉ lệ 3:2 cho riêng bộ này.
6. **Không JS**: mỗi section tự có nền và màu chữ của nó (CSS biến inline), nên vẫn đúng màu và hiện đủ ảnh; JS chỉ thêm lớp nền cố định chuyển màu mượt + hiệu ứng.
7. **Giảm chuyển động** (`prefers-reduced-motion`): không hạt, không reveal, không Lenis; màu đổi tức thì.
8. **Trang concept** (`/[locale]/concepts/[slug]`) khoác cùng bảng màu: đầu trang là collage nguyên tấm + tên + câu chuyện + nút đặt lịch; dưới là gallery các ô lẻ (lưới 2 cột mobile / 3–4 cột desktop, ô ≤ kích thước gốc), lightbox giới hạn ở cỡ gốc; pager trước/sau.
9. **Header**: logo dùng CSS mask tô bằng `--ink` (bỏ hệ `data-surface`/`HeaderTone` cũ); nút "Đặt lịch" nền `--ink`, chữ `--bg`.
10. **Thanh chỉ mục chương** (desktop ≥1024px): chấm theo `--ink`, giữ hành vi cũ.
11. **About + Footer**: giữ nội dung; About dùng tông kem gốc của thương hiệu như cảnh mở đầu, Footer nền rêu.
12. **Hiệu năng**: chỉ collage của cảnh đầu (intro không có collage → concept 1) dùng `fetchPriority`; còn lại lazy. Canvas: tối đa ~60 hạt desktop, ~30 mobile, dừng khi tab ẩn, DPR canvas ≤ 2. GSAP/Lenis import động như hiện tại.

## 5. Cấu trúc trang

**Trang chủ `/[locale]`**
1. Intro (tông kem thương hiệu): logo lớn, tagline Great Vibes, dòng "Makeup & chụp snap · Nội thành Nha Trang", gợi ý cuộn.
2. 18 cảnh concept theo thứ tự hiện có. Mỗi cảnh: collage + số chương "Chương 01 / 18" + tên (Great Vibes) + tagline + "Xem bộ ảnh →" + credit. Desktop: hai cột, collage xen kẽ trái/phải, cả cảnh vừa một màn hình. Mobile (quyết của Claude): cảnh `min-height: 100svh` và **được phép cao hơn một màn hình**; collage rộng tối đa 88vw nhưng cao tối đa 62svh để collage + tên concept luôn cùng nằm trong màn hình đầu của cảnh; tagline/nút/credit có thể nằm dưới nếp gấp. Test svh cũ đổi thành: trên mobile 390×664 và 390×844, đáy tên concept nằm trong `100svh` tính từ đỉnh cảnh.
3. About.
4. Footer/#contact.

**Trang concept** như §4.8.

## 6. Tài nguyên

- Collage gốc: `assets/*.jpg` (14 bộ 2048×2560; blowing/ethereal/summer/velvet ~1180×1480). Map tên file → slug: `scripts/collages.mjs`.
- Ô lẻ đã cắt: `public/concepts/<slug>/<i>.webp` (+ `-sm`), giữ cho gallery; ô 1 của a-private-escape đã xoá và bị bỏ qua trong script.
- Spike tham chiếu: bảng màu tay ban đầu cho lotus/lavie/ocean/velvet/winter nằm trong `THEMES` của spike.

## 7. Ràng buộc

- Mọi ràng buộc của spec cũ: không watermark studio khác, credit, không giá, không dữ liệu cá nhân khách, tiếng Hàn là bản nháp cần người bản ngữ duyệt, hỏi trước khi deploy Vercel.
- Next.js 16.4.6 — đọc `node_modules/next/dist/docs/` trước khi viết code (AGENTS.md).
- Tests e2e hiện có (svh, no-JS, reduced motion, deep link/404, booking, gallery, i18n) phải được cập nhật cho bố cục mới và vẫn xanh; Review Focus #4 đổi thành "chỉ collage concept 1 eager, ảnh không hiện to hơn kích thước gốc".
- Lighthouse mobile mục tiêu: a11y ≥ 95 (đang 100), perf ≥ 80.

## 7b. Điểm dừng xem sớm (quyết của Claude)

Ngay sau khi có bảng màu 18 concept (trước khi làm chuyển cảnh, trang concept, test), dựng một trang xem nhanh cả 18 cảnh với màu + hiệu ứng thật và đưa người dùng xem. Chỉnh màu theo góp ý rồi mới làm tiếp.

## 8. Để builder tự quyết

- Gán hiệu ứng cho 13 concept chưa có gợi ý; hình dạng chi tiết của từng loại hạt.
- Thông số easing/thời lượng, miễn gần cảm giác spike.
- Có dùng `<picture>`/`next/image` hay `<img srcset>` cho collage, miễn đúng giới hạn kích thước.
- Cách tổ chức component (Scene, Atmosphere/ParticleField…).

## 9. Việc mở (không chặn build)

- Ảnh chân dung cho About; domain + `NEXT_PUBLIC_SITE_URL`; kiểm tra trên iPhone thật trong webview IG/TikTok/Zalo; người bản ngữ duyệt tiếng Hàn.
