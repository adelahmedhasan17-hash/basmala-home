// ===== الصور الحقيقية من Unsplash =====
const IMG = {
  blender:       'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
  kettle:        'https://images.unsplash.com/photo-1517914309068-9cd8f3a2b1c4?w=600&q=80',
  microwave:     'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80',
  foodProcessor: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
  chinaSet:      'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=600&q=80',
  cups:          'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
  teaSet:        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
  pots:          'https://images.unsplash.com/photo-1584990347449-39b4a1aee9a3?w=600&q=80',
  pans:          'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80',
  woodenSpoons:  'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&q=80',
  cutlery:       'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=600&q=80',
  knives:        'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80',
  bathSet:       'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
  soapDispenser: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&q=80',
  laundryBasket: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&q=80',
  wallArt:       'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
  candleHolder:  'https://images.unsplash.com/photo-1602874801006-e26c8d5a6a0e?w=600&q=80',
  vase:          'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80'
};

// ===== المنتجات =====
const PRODUCTS = [
  {
    id: 1, image: IMG.blender, icon: '🔌',
    cat: 'أدوات كهربائية', title: 'خلاط كهربائي 500 وات',
    price: 850, old: 1200, colors: ['أسود', 'فضي', 'أحمر'],
    rating: 4.5, reviewsCount: 128,
    shortDesc: 'خلاط قوي لجميع الاستخدامات',
    fullDesc: 'خلاط كهربائي بقوة 500 وات، مزود بـ 3 سرعات وشفرات ستانلس ستيل عالية الجودة.',
    inStock: true, badge: 'خصم'
  },
  {
    id: 2, image: IMG.chinaSet, icon: '🍽️',
    cat: 'أطقم صيني', title: 'طقم صيني 24 قطعة',
    price: 1500, old: 2000, colors: ['أبيض', 'ذهبي'],
    rating: 4.8, reviewsCount: 89,
    shortDesc: 'طقم صيني فاخر 24 قطعة',
    fullDesc: 'طقم صيني فاخر مكون من 24 قطعة، تصميم أنيق يناسب المناسبات.',
    inStock: true, badge: 'الأكثر مبيعاً'
  },
  {
    id: 3, image: IMG.pots, icon: '🥄',
    cat: 'أدوات مطبخ', title: 'طقم حلل ستانلس 5 قطع',
    price: 2200, old: 2800, colors: ['فضي'],
    rating: 4.7, reviewsCount: 156,
    shortDesc: 'حلل ستانلس ستيل عالية الجودة',
    fullDesc: 'طقم حلل ستانلس ستيل 5 قطع، مناسب لجميع أنواع المواقد.',
    inStock: true, badge: 'خصم'
  },
  {
    id: 4, image: IMG.cutlery, icon: '🍴',
    cat: 'أطقم سفرة', title: 'طقم ملاعق 24 قطعة',
    price: 450, old: 600, colors: ['فضي', 'ذهبي'],
    rating: 4.6, reviewsCount: 67,
    shortDesc: 'طقم ملاعق فاخر',
    fullDesc: 'طقم ملاعق 24 قطعة ستانلس ستيل، تصميم عصري.',
    inStock: true, badge: 'جديد'
  },
  {
    id: 5, image: IMG.bathSet, icon: '🚿',
    cat: 'مستلزمات الحمام', title: 'طقم حمام 4 قطع',
    price: 380, old: 500, colors: ['أبيض', 'أزرق', 'وردي'],
    rating: 4.4, reviewsCount: 45,
    shortDesc: 'طقم حمام أنيق',
    fullDesc: 'طقم حمام 4 قطع: موزع صابون، حامل فرش، كوب، صحن صابون.',
    inStock: true, badge: null
  },
  {
    id: 6, image: IMG.wallArt, icon: '🖼️',
    cat: 'ديكور المنزل', title: 'لوحة فنية مودرن',
    price: 320, old: 450, colors: ['ذهبي', 'أسود'],
    rating: 4.9, reviewsCount: 78,
    shortDesc: 'لوحة ديكور عصرية',
    fullDesc: 'لوحة فنية مودرن بتصميم هندسي، مناسبة لغرف المعيشة.',
    inStock: true, badge: 'الأكثر مبيعاً'
  },
  {
    id: 7, image: IMG.kettle, icon: '🔌',
    cat: 'أدوات كهربائية', title: 'غلاية كهربائية 1.7 لتر',
    price: 420, old: 550, colors: ['فضي', 'أسود'],
    rating: 4.5, reviewsCount: 210,
    shortDesc: 'غلاية سريعة',
    fullDesc: 'غلاية كهربائية 1.7 لتر، تسخين سريع وإيقاف تلقائي.',
    inStock: true, badge: 'خصم'
  },
  {
    id: 8, image: IMG.woodenSpoons, icon: '🥄',
    cat: 'أدوات مطبخ', title: 'طقم ملاعق خشب 6 قطع',
    price: 180, old: 250, colors: ['بني'],
    rating: 4.3, reviewsCount: 34,
    shortDesc: 'ملاعق خشب طبيعية',
    fullDesc: 'طقم ملاعق خشب 6 قطع، آمنة على الأواني غير اللاصقة.',
    inStock: true, badge: 'جديد'
  },
  {
    id: 9, image: IMG.cups, icon: '🍽️',
    cat: 'أطقم صيني', title: 'طقم أكواب شاي 12 قطعة',
    price: 290, old: 400, colors: ['أبيض', 'ذهبي'],
    rating: 4.7, reviewsCount: 92,
    shortDesc: 'أكواب شاي أنيقة',
    fullDesc: 'طقم أكواب شاي 12 قطعة، تصميم كلاسيكي راقي.',
    inStock: true, badge: null
  },
  {
    id: 10, image: IMG.laundryBasket, icon: '🚿',
    cat: 'مستلزمات الحمام', title: 'سلة غسيل قماش',
    price: 150, old: 220, colors: ['رمادي', 'بيج'],
    rating: 4.2, reviewsCount: 28,
    shortDesc: 'سلة غسيل عملية',
    fullDesc: 'سلة غسيل قماش قابلة للطي، تصميم عصري.',
    inStock: false, badge: null
  },
  {
    id: 11, image: IMG.candleHolder, icon: '🖼️',
    cat: 'ديكور المنزل', title: 'حامل شموع ذهبي',
    price: 240, old: 320, colors: ['ذهبي'],
    rating: 4.6, reviewsCount: 51,
    shortDesc: 'حامل شموع فاخر',
    fullDesc: 'حامل شموع ذهبي بتصميم أنيق، مناسب للديكور.',
    inStock: true, badge: 'جديد'
  },
  {
    id: 12, image: IMG.knives, icon: '🍴',
    cat: 'أطقم سفرة', title: 'طقم سكاكين 6 قطع',
    price: 380, old: 520, colors: ['فضي', 'أسود'],
    rating: 4.5, reviewsCount: 63,
    shortDesc: 'سكاكين حادة',
    fullDesc: 'طقم سكاكين 6 قطع ستانلس ستيل، حادة ومتينة.',
    inStock: true, badge: null
  }
];
