import type { Locale } from '@/i18n/config'

export type Concept = {
  slug: string
  /** Source collage: assets/<file>.jpg */
  file: string
  /** Display name, always Latin, as printed on the collage. */
  name: string
  /** Chapter number on the home page, 1..18. */
  order: number
  tagline: Record<Locale, string>
  description: Record<Locale, string[]>
  /** Tile indices shown in the gallery, in display order. Never 4 (the studio's centre card). */
  photos: number[]
  /** Representative tile: share image and the About strip. */
  cover: number
  /** Source collage is small (~390px tiles): never upscale beyond the source. */
  lowRes: boolean
}

const ALL = [0, 1, 2, 3, 5, 6, 7, 8]

// KO-DRAFT — every `ko` string below is a draft translation and needs review by a native Korean speaker before launch.
const data: Omit<Concept, 'order'>[] = [
  {
    slug: 'the-white-lotus',
    file: 'lotus',
    name: 'The White Lotus',
    tagline: { vi: 'Nét thơ của tà Việt phục trắng', ko: '하얀 베트남 전통 의상의 시' },
    description: {
      vi: [
        'Lấy cảm hứng từ vẻ đẹp truyền thống Việt Nam, Bạch Liên là hình ảnh người con gái dịu dàng trong tà Việt phục trắng tinh khôi, giữa không gian cổ kính và sắc xanh thiên nhiên.',
        'Từng ánh nhìn, dáng đứng và chuyển động đều thanh tao, nền nã — như một nàng thơ bước ra từ trang sử cũ.',
        'Không cần sắc màu rực rỡ hay phụ kiện cầu kỳ, gam trắng thuần khiết và vẻ đẹp cổ điển làm nên sức hút riêng cho bộ ảnh.',
      ],
      ko: [
        '베트남 전통미에서 영감을 받은 콘셉트로, 순백의 전통 의상을 입은 단아한 여인을 고풍스러운 공간과 푸른 자연 속에 담았습니다.',
        '시선 하나, 서 있는 자세 하나까지 우아하고 차분하게 — 옛 이야기 속에서 걸어 나온 뮤즈처럼.',
        '화려한 색이나 장식 없이, 맑은 흰색과 고전적인 아름다움만으로 완성한 화보입니다.',
      ],
    },
    photos: ALL,
    cover: 3,
    lowRes: false,
  },
  {
    slug: 'la-vie-en-rose',
    file: 'lavie',
    name: 'La Vie En Rose',
    tagline: { vi: 'Dịu dàng như một đoá hồng Pháp', ko: '프랑스 장미처럼 부드럽게' },
    description: {
      vi: [
        'La Vie en Rose — cụm từ kinh điển của nước Pháp, gợi sự lãng mạn, nữ tính và đầy chất thơ.',
        'Concept tái hiện hình ảnh thiếu nữ dịu dàng trong gam hồng phấn và chất liệu ren vintage, theo phong cách French Vintage tinh tế.',
        'Mỗi khung hình giữ sự thanh lịch, tinh khôi và nét đẹp không theo thời gian.',
      ],
      ko: [
        '라 비 앙 로즈 — 낭만과 여성스러움, 시적인 감성을 담은 프랑스의 고전적인 표현입니다.',
        '파우더 핑크 톤과 빈티지 레이스로 부드러운 소녀의 모습을 그려낸 프렌치 빈티지 콘셉트입니다.',
        '모든 컷에 단정함과 청순함, 시간이 지나도 변치 않는 아름다움을 담았습니다.',
      ],
    },
    photos: ALL,
    cover: 0,
    lowRes: false,
  },
  {
    slug: 'ocean-kissed',
    file: 'ocean',
    name: 'Ocean Kissed',
    tagline: { vi: 'Hoàng hôn, sóng biển và sắc màu mùa hè', ko: '노을과 파도, 여름의 색' },
    description: {
      vi: [
        'Giữa ánh hoàng hôn và những con sóng dịu êm, cô gái như mang theo cả sắc màu của mùa hè.',
        'Ngọt ngào, tự do và đầy sức sống — bộ ảnh là sự hoà quyện giữa vẻ đẹp nữ tính và hơi thở trong trẻo của biển cả.',
        'Dành cho những cô gái yêu biển, yêu mùa hè và muốn lưu giữ khoảnh khắc đẹp theo cách tự nhiên.',
      ],
      ko: [
        '노을빛과 잔잔한 파도 사이, 여름의 색을 그대로 품은 소녀.',
        '달콤하고 자유롭고 생기 넘치는 — 여성스러운 아름다움과 맑은 바다의 숨결이 어우러진 화보입니다.',
        '바다와 여름을 사랑하고, 자연스러운 순간을 남기고 싶은 분께 추천해요.',
      ],
    },
    photos: ALL,
    cover: 0,
    lowRes: false,
  },
  {
    slug: 'velvet-silence',
    file: 'velvet',
    name: 'Velvet Silence',
    tagline: { vi: 'Tinh tế, tối giản và đầy thần thái', ko: '섬세하고 미니멀한 분위기' },
    description: {
      vi: [
        'Bộ ảnh tôn vinh vẻ đẹp tinh tế và tối giản, nơi cảm xúc hiện lên qua ánh nhìn, thần thái và những chuyển động tự nhiên.',
        'Tông nâu trầm ấm, chất liệu lông mềm và chiếc váy đen thanh lịch tạo nên tổng thể hiện đại, sang trọng mà vẫn nữ tính.',
        'Mỗi góc máy là một cách kể về sự tự tin và nét đẹp riêng của mỗi người.',
      ],
      ko: [
        '시선과 분위기, 자연스러운 움직임으로 감정을 표현한 섬세하고 미니멀한 화보입니다.',
        '따뜻한 브라운 톤, 부드러운 퍼 소재와 우아한 블랙 드레스가 모던하면서도 여성스러운 무드를 완성합니다.',
        '모든 앵글이 각자의 자신감과 고유한 아름다움을 이야기합니다.',
      ],
    },
    photos: ALL,
    cover: 6,
    lowRes: true,
  },
  {
    slug: 'pink-dream-21',
    file: 'pink',
    name: 'Pink Dream 21',
    tagline: { vi: 'Tuổi 21 ngọt ngào như kẹo bông', ko: '솜사탕처럼 달콤한 스물하나' },
    description: {
      vi: [
        'Pink Dream 21 là giấc mơ màu hồng dành cho những cô gái bước sang tuổi 21 — ngọt ngào, trong trẻo nhưng vẫn có chút tinh nghịch rất riêng.',
        'Sắc hồng pastel làm chủ đạo, cùng bánh kem, bóng số, hoa và phụ kiện đáng yêu, tái hiện một buổi tiệc sinh nhật như bước ra từ cổ tích hiện đại.',
        'Không cần quá cầu kỳ — một chiếc váy xinh, một chiếc bánh kem và thật nhiều niềm vui để lưu lại phiên bản tuổi 21 rạng rỡ của mình.',
      ],
      ko: [
        '스물한 살을 맞이하는 소녀를 위한 핑크빛 꿈 — 달콤하고 맑지만 장난기도 살짝 담았어요.',
        '파스텔 핑크를 중심으로 케이크, 숫자 풍선, 꽃과 귀여운 소품으로 현대판 동화 같은 생일 파티를 연출했습니다.',
        '예쁜 드레스 한 벌, 케이크 하나, 그리고 많은 웃음으로 빛나는 스물한 살을 남겨 보세요.',
      ],
    },
    photos: ALL,
    cover: 7,
    lowRes: false,
  },
  {
    slug: 'a-love-anchored',
    file: 'anchor',
    name: 'A Love Anchored',
    tagline: { vi: 'Bình yên giữa nắng chiều và kiến trúc cổ', ko: '오후 햇살과 고풍스러운 건축 속 평온함' },
    description: {
      vi: [
        'Khoảnh khắc bình yên của hai người giữa ánh nắng chiều và kiến trúc cổ kính.',
        'Đồng phục hải quân kết hợp váy trắng tạo nên vẻ đẹp vừa trang trọng vừa lãng mạn; mỗi khung hình giữ sự chân thành, dịu dàng và cảm xúc tự nhiên.',
        'Phù hợp cho couple, ảnh kỷ niệm, pre-wedding hoặc những cặp đôi yêu phong cách tối giản.',
      ],
      ko: [
        '오후 햇살과 고풍스러운 건축물 사이, 두 사람의 평온한 순간.',
        '해군 제복과 화이트 드레스의 조합이 격식 있으면서도 로맨틱한 분위기를 만들고, 모든 컷에 진심과 다정함을 담았습니다.',
        '커플 촬영, 기념 사진, 프리웨딩, 미니멀한 스타일을 좋아하는 커플에게 어울려요.',
      ],
    },
    photos: ALL,
    cover: 2,
    lowRes: false,
  },
  {
    slug: 'ethereal-shore',
    file: 'ethereal',
    name: 'Ethereal Shore',
    tagline: { vi: 'Bản tình ca giữa sóng nước và hoàng hôn', ko: '파도와 노을 사이의 세레나데' },
    description: {
      vi: [
        'Dưới ánh hoàng hôn dần buông và mặt nước lấp lánh, nàng thơ hiện lên với vẻ đẹp mong manh nhưng cuốn hút.',
        'Chất liệu mềm mại, đường nét uyển chuyển và khung cảnh biển đêm tạo nên những khung hình vừa nghệ thuật, vừa mang hơi thở tự do của thiên nhiên.',
      ],
      ko: [
        '저물어 가는 노을과 반짝이는 물결 아래, 연약하지만 매혹적인 뮤즈.',
        '부드러운 소재, 유려한 라인, 밤바다의 풍경이 예술적이면서도 자연의 자유로움을 담은 장면을 만들어 냅니다.',
      ],
    },
    photos: ALL,
    cover: 6,
    lowRes: true,
  },
  {
    slug: 'lotus-fairy',
    file: 'fairy',
    name: 'Lotus Fairy',
    tagline: { vi: 'Sen hồng, tà ren và nét thơ thiếu nữ', ko: '분홍 연꽃과 레이스, 소녀의 시' },
    description: {
      vi: [
        'Sắc hồng dịu dàng, tà ren mềm mại cùng những đoá sen hồng đang độ khoe sắc, tạo nên bộ ảnh nữ tính và đậm chất thơ.',
        'Trang phục ren và hoa sen mang đến cảm giác vừa trong trẻo vừa đằm thắm, gợi nhớ vẻ đẹp dịu dàng của người con gái Việt.',
        'Dành cho những nàng yêu hoa sen, yêu nét đẹp nền nã và muốn lưu giữ thanh xuân theo cách thơ mộng.',
      ],
      ko: [
        '은은한 핑크, 부드러운 레이스, 활짝 핀 분홍 연꽃이 어우러진 여성스럽고 시적인 화보입니다.',
        '레이스 의상과 연꽃이 맑으면서도 차분한 느낌을 주며, 베트남 여성의 단아한 아름다움을 떠올리게 합니다.',
        '연꽃을 좋아하고 청춘을 낭만적으로 남기고 싶은 분께 추천해요.',
      ],
    },
    photos: ALL,
    cover: 7,
    lowRes: false,
  },
  {
    slug: 'sweethearts-day',
    file: 'sweet',
    name: "Sweetheart's Day",
    tagline: { vi: 'Hẹn hò ngọt ngào trong sắc đỏ và trắng', ko: '레드와 화이트의 달콤한 데이트' },
    description: {
      vi: [
        'Concept lấy cảm hứng từ một buổi hẹn hò ngọt ngào với sắc đỏ và trắng.',
        'Bánh kem, gấu bông và những chi tiết nhỏ tạo cảm giác ấm áp; tập trung ghi lại những khoảnh khắc tự nhiên và đầy cảm xúc.',
        'Phù hợp với những ai yêu thích phong cách đáng yêu, dịu dàng.',
      ],
      ko: [
        '레드와 화이트로 꾸민 달콤한 데이트에서 영감을 받은 콘셉트입니다.',
        '케이크와 곰인형, 작은 소품들이 따뜻한 분위기를 더하고, 자연스럽고 감성적인 순간을 담는 데 집중했어요.',
        '사랑스럽고 부드러운 스타일을 좋아하는 분께 어울립니다.',
      ],
    },
    photos: ALL,
    cover: 5,
    lowRes: false,
  },
  {
    slug: 'in-your-eyes',
    file: 'inyoureyes',
    name: 'In Your Eyes',
    tagline: { vi: 'Có những cảm xúc chỉ cần nhìn vào mắt nhau', ko: '눈빛만으로 전해지는 마음' },
    description: {
      vi: [
        'Có những cảm xúc chẳng cần nói thành lời, chỉ cần nhìn vào mắt nhau.',
        'Bộ ảnh khai thác sự kết nối qua ánh nhìn và những cử chỉ nhẹ nhàng; tone màu trung tính giúp mọi cảm xúc trở nên nổi bật.',
        'Dành cho những cặp đôi yêu thích sự tối giản nhưng vẫn đầy chiều sâu.',
      ],
      ko: [
        '말하지 않아도 눈빛만으로 전해지는 감정이 있습니다.',
        '시선과 작은 몸짓으로 이어지는 교감을 담았고, 뉴트럴 톤이 감정을 더욱 돋보이게 합니다.',
        '미니멀하지만 깊이 있는 분위기를 좋아하는 커플을 위한 콘셉트예요.',
      ],
    },
    photos: ALL,
    cover: 5,
    lowRes: false,
  },
  {
    slug: 'summer-crush',
    file: 'summer',
    name: 'Summer Crush',
    tagline: { vi: 'Nắng, gió biển và nụ cười Nha Trang', ko: '나트랑의 햇살과 미소' },
    description: {
      vi: [
        'Lấy cảm hứng từ những ngày hè rực rỡ bên biển xanh, Summer Crush ghi lại vẻ đẹp tươi trẻ, trong veo và tràn đầy sức sống dưới ánh nắng vàng.',
        'Gam màu nhiệt đới, làn sóng dịu êm và ánh hoàng hôn tạo nên những khung hình vừa ngọt ngào vừa phóng khoáng.',
        'Dành cho những cô gái yêu biển, yêu ánh nắng và muốn lưu giữ phiên bản rạng rỡ của chính mình.',
      ],
      ko: [
        '푸른 바다의 눈부신 여름날에서 영감을 받아, 햇살 아래 싱그럽고 생기 넘치는 모습을 담았습니다.',
        '트로피컬 컬러, 잔잔한 파도, 노을이 달콤하면서도 자유로운 장면을 만들어요.',
        '바다와 햇살을 사랑하고 가장 빛나는 나를 남기고 싶은 분께 추천합니다.',
      ],
    },
    photos: ALL,
    cover: 1,
    lowRes: true,
  },
  {
    slug: 'petals-and-grace',
    file: 'petal',
    name: 'Petals & Grace',
    tagline: { vi: 'Mong manh như cánh hoa đầu xuân', ko: '봄 꽃잎처럼 섬세하게' },
    description: {
      vi: [
        'Concept lấy cảm hứng từ vẻ đẹp nữ tính, dịu dàng giữa những nhành hoa nhỏ, mang đến cảm giác trong trẻo và thơ mộng.',
        'Nhiều dáng chụp mềm mại cùng hoa và chuyển động tay giúp bộ ảnh đa dạng nhưng vẫn đồng nhất về cảm xúc.',
        'Phù hợp với phong cách nàng thơ, nữ tính, thanh lịch — cho những ai yêu hình ảnh nhẹ nhàng, tự nhiên và có chút lãng mạn.',
      ],
      ko: [
        '작은 꽃가지 사이의 여성스럽고 부드러운 아름다움에서 영감을 받아, 맑고 몽환적인 느낌을 담았습니다.',
        '꽃과 손동작을 활용한 다양한 포즈로 변화를 주면서도 감정의 결은 하나로 이어집니다.',
        '자연스럽고 은은하며 살짝 로맨틱한 분위기를 좋아하는 분께 어울려요.',
      ],
    },
    photos: ALL,
    cover: 2,
    lowRes: false,
  },
  {
    slug: 'fancy-nancy',
    file: 'fancy',
    name: 'Fancy Nancy',
    tagline: { vi: 'Bữa tiệc sinh nhật bước ra từ giấc mơ', ko: '꿈에서 나온 듯한 생일 파티' },
    description: {
      vi: [
        'Một chút ngọt ngào của sắc hồng, một chút rực rỡ của những dải màu và ánh mắt lấp lánh của cô gái trong ngày đặc biệt.',
        'Bánh kem, vương miện và những gam màu rực rỡ cùng tạo nên khung hình đầy sức sống.',
        'Bộ ảnh tinh nghịch, đáng yêu nhưng vẫn giữ được vẻ nữ tính và cuốn hút của nàng.',
      ],
      ko: [
        '달콤한 핑크, 알록달록한 가랜드, 특별한 날 반짝이는 소녀의 눈빛.',
        '케이크와 왕관, 화사한 컬러가 생기 넘치는 장면을 완성합니다.',
        '장난스럽고 사랑스럽지만 여성스러운 매력도 놓치지 않은 화보예요.',
      ],
    },
    photos: ALL,
    cover: 5,
    lowRes: false,
  },
  {
    slug: 'vietnamese-grace',
    file: 'vietnam',
    name: 'Vietnamese Grace',
    tagline: { vi: 'Duyên dáng trong tà Việt phục hồng pastel', ko: '파스텔 핑크 전통 의상의 우아함' },
    description: {
      vi: [
        'Bộ ảnh tôn vinh vẻ đẹp dịu dàng, thanh lịch và nữ tính của người phụ nữ Việt Nam qua tà Việt phục màu hồng pastel.',
        'Từng dáng ngồi, ánh mắt và nụ cười đều nhẹ nhàng, tự nhiên, làm nổi bật vẻ duyên dáng của người phụ nữ Việt.',
        'Lời ca ngợi vẻ đẹp mộc mạc, tinh tế và nét duyên thầm trong mỗi người con gái Việt Nam.',
      ],
      ko: [
        '파스텔 핑크 전통 의상으로 베트남 여성의 부드럽고 우아한 아름다움을 담았습니다.',
        '앉은 자세, 눈빛, 미소 하나하나가 자연스럽고 차분하게 단아함을 드러냅니다.',
        '소박하고 섬세한, 베트남 여성 특유의 은은한 매력에 바치는 화보예요.',
      ],
    },
    photos: ALL,
    cover: 3,
    lowRes: false,
  },
  {
    slug: 'a-private-escape',
    file: 'pirate',
    name: 'A Private Escape',
    tagline: { vi: 'Chậm lại giữa biển, nắng và hoàng hôn', ko: '바다와 햇살, 노을 속 느린 하루' },
    description: {
      vi: [
        'Một hành trình hình ảnh trong không gian nghỉ dưỡng yên tĩnh — từ những khoảnh khắc thanh lịch trong villa, buổi chiều bên biển đến hoàng hôn trên ghềnh đá.',
        'Mỗi khung hình là vẻ đẹp của việc chậm lại, sống trọn hiện tại và lưu giữ kỷ niệm ở một nơi đáng nhớ.',
      ],
      ko: [
        '조용한 휴양지에서의 시각적 여행 — 빌라에서의 우아한 순간, 바닷가의 오후, 바위 위의 노을까지.',
        '천천히 머물며 지금을 온전히 즐기고, 특별한 곳에서의 추억을 남기는 아름다움을 담았습니다.',
      ],
    },
    photos: [0, 2, 3, 5, 6, 7, 8],
    cover: 0,
    lowRes: false,
  },
  {
    slug: 'blooming-grace',
    file: 'blowing',
    name: 'Blooming Grace',
    tagline: { vi: 'Nở rộ trong những điều giản đơn', ko: '소박함 속에 피어나다' },
    description: {
      vi: [
        'Khi vẻ đẹp nở rộ trong những điều giản đơn: một bó hoa tươi, chiếc bánh kem nhỏ và ánh nắng dịu nhẹ đã đủ tạo nên bộ ảnh ngập tràn cảm xúc.',
        'Phong cách thanh lịch, nữ tính với tông màu ấm áp, lưu giữ những khoảnh khắc tự nhiên và tinh tế theo cách riêng của bạn.',
      ],
      ko: [
        '싱그러운 꽃다발, 작은 케이크, 은은한 햇살 — 소박한 것들 속에서 피어나는 아름다움을 담았습니다.',
        '따뜻한 톤의 우아하고 여성스러운 스타일로, 자연스럽고 섬세한 순간을 나만의 방식으로 남겨요.',
      ],
    },
    photos: ALL,
    cover: 0,
    lowRes: true,
  },
  {
    slug: 'winter-cherie',
    file: 'winter',
    name: 'Winter Cherie',
    tagline: { vi: 'Áo len đỏ và phép màu mùa lễ hội', ko: '빨간 니트와 축제의 마법' },
    description: {
      vi: [
        'Trong chiếc áo len đỏ giữa không gian Noel rực rỡ, nàng thơ hiện lên đáng yêu, dịu dàng nhưng không kém phần tinh nghịch.',
        'Từ ánh nhìn mơ màng bên cây thông đến những khoảnh khắc vui đùa cùng tuyết trắng và món quà nhỏ, mỗi khung hình ấm áp như bước ra từ một câu chuyện mùa đông.',
        'Một chút phép màu mùa lễ hội — một phiên bản thật xinh dành riêng cho nàng.',
      ],
      ko: [
        '화려한 크리스마스 공간 속 빨간 니트를 입은 뮤즈 — 사랑스럽고 부드럽지만 장난기도 가득해요.',
        '트리 옆의 몽환적인 눈빛부터 하얀 눈과 작은 선물과 함께한 순간까지, 겨울 동화 같은 따뜻한 장면을 담았습니다.',
        '축제 시즌의 작은 마법, 당신만을 위한 가장 예쁜 모습.',
      ],
    },
    photos: ALL,
    cover: 2,
    lowRes: false,
  },
  {
    slug: 'wishful-moment',
    file: 'wishful',
    name: 'Wishful Moment',
    tagline: { vi: 'Ánh nến nhỏ và một điều ước bình yên', ko: '작은 촛불과 조용한 소원' },
    description: {
      vi: [
        'Concept lấy cảm hứng từ những buổi sinh nhật nhỏ, ánh nến và sự bình yên.',
        'Gam màu trung tính kết hợp ánh sáng mềm mang lại cảm giác điện ảnh, nhẹ nhàng và sang trọng; mỗi khung hình ghi lại vẻ đẹp tự nhiên cùng những cảm xúc chân thật.',
      ],
      ko: [
        '작은 생일, 촛불, 그리고 평온함에서 영감을 받은 콘셉트입니다.',
        '뉴트럴 톤과 부드러운 빛이 영화 같은 분위기를 만들고, 자연스러운 아름다움과 진솔한 감정을 담았습니다.',
      ],
    },
    photos: ALL,
    cover: 8,
    lowRes: false,
  },
]

export const concepts: Concept[] = data.map((c, i) => ({ ...c, order: i + 1 }))

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug)
}

export function neighbors(slug: string): { prev: Concept; next: Concept } {
  const i = concepts.findIndex((c) => c.slug === slug)
  const n = concepts.length
  return { prev: concepts[(i - 1 + n) % n], next: concepts[(i + 1) % n] }
}
