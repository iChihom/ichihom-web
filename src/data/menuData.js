export const menuCategories = [
  {
    id: 'main',
    name: '主食',
    icon: '🍚',
    description: '营养美味的主食选择'
  },
  {
    id: 'soup',
    name: '汤品',
    icon: '🍲',
    description: '暖心暖胃的汤品'
  },
  {
    id: 'drink',
    name: '饮品',
    icon: '🥤',
    description: '清爽解渴的饮品'
  },
  {
    id: 'snack',
    name: '小食',
    icon: '🍟',
    description: '精致可口的小食'
  },
  {
    id: 'dessert',
    name: '甜点',
    icon: '🍰',
    description: '甜蜜诱人的甜点'
  }
]

export const menuItems = [
  {
    id: 1,
    categoryId: 'main',
    name: '宫保鸡丁',
    price: 28,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop',
    description: '经典川菜，鸡肉嫩滑，花生香脆',
    spicy: 2,
    popular: true,
    ingredients: [
      { name: '鸡胸肉', amount: '300g', unit: '克' },
      { name: '花生米', amount: '100g', unit: '克' },
      { name: '干辣椒', amount: '10', unit: '个' },
      { name: '花椒', amount: '5g', unit: '克' },
      { name: '葱', amount: '2', unit: '根' },
      { name: '姜', amount: '1', unit: '块' },
      { name: '蒜', amount: '3', unit: '瓣' },
      { name: '生抽', amount: '2', unit: '勺' },
      { name: '老抽', amount: '1', unit: '勺' },
      { name: '料酒', amount: '1', unit: '勺' },
      { name: '盐', amount: '适量', unit: '' },
      { name: '糖', amount: '1', unit: '勺' },
      { name: '淀粉', amount: '1', unit: '勺' }
    ],
    tutorial: [
      '鸡胸肉切丁，用料酒、盐、淀粉腌制15分钟',
      '花生米炸至金黄备用',
      '干辣椒切段，葱姜蒜切末',
      '热锅下油，爆香花椒和干辣椒',
      '下鸡丁炒至变色',
      '加入葱姜蒜炒香',
      '调生抽、老抽、糖炒匀',
      '最后加入花生米炒匀即可'
    ]
  },
  {
    id: 2,
    categoryId: 'main',
    name: '红烧肉',
    price: 38,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    description: '肥而不腻，入口即化',
    spicy: 0,
    popular: true,
    ingredients: [
      { name: '五花肉', amount: '500g', unit: '克' },
      { name: '冰糖', amount: '30g', unit: '克' },
      { name: '生抽', amount: '3', unit: '勺' },
      { name: '老抽', amount: '2', unit: '勺' },
      { name: '料酒', amount: '2', unit: '勺' },
      { name: '八角', amount: '2', unit: '个' },
      { name: '桂皮', amount: '1', unit: '块' },
      { name: '香叶', amount: '2', unit: '片' },
      { name: '葱', amount: '2', unit: '根' },
      { name: '姜', amount: '3', unit: '片' },
      { name: '盐', amount: '适量', unit: '' }
    ],
    tutorial: [
      '五花肉切块，冷水下锅焯水去腥',
      '起锅烧油，下冰糖炒糖色',
      '下五花肉翻炒上色',
      '加入葱姜、八角、桂皮、香叶炒香',
      '加生抽、老抽、料酒炒匀',
      '加开水没过肉块',
      '大火烧开转小火炖40分钟',
      '大火收汁即可'
    ]
  },
  {
    id: 3,
    categoryId: 'main',
    name: '麻婆豆腐',
    price: 18,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop',
    description: '麻辣鲜香，下饭神器',
    spicy: 3,
    popular: true,
    ingredients: [
      { name: '嫩豆腐', amount: '400g', unit: '克' },
      { name: '猪肉末', amount: '100g', unit: '克' },
      { name: '郫县豆瓣酱', amount: '2', unit: '勺' },
      { name: '花椒粉', amount: '1', unit: '勺' },
      { name: '辣椒粉', amount: '1', unit: '勺' },
      { name: '蒜', amount: '3', unit: '瓣' },
      { name: '姜', amount: '1', unit: '块' },
      { name: '葱', amount: '2', unit: '根' },
      { name: '生抽', amount: '1', unit: '勺' },
      { name: '淀粉', amount: '1', unit: '勺' },
      { name: '盐', amount: '适量', unit: '' },
      { name: '油', amount: '适量', unit: '' }
    ],
    tutorial: [
      '豆腐切块，用盐水焯一下',
      '热锅下油，炒香肉末',
      '加豆瓣酱炒出红油',
      '加姜蒜末炒香',
      '加适量水烧开',
      '下豆腐块煮3分钟',
      '用水淀粉勾芡',
      '撒花椒粉和葱花即可'
    ]
  },
  {
    id: 4,
    categoryId: 'soup',
    name: '番茄鸡蛋汤',
    price: 12,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop',
    description: '酸甜开胃，简单易做',
    spicy: 0,
    popular: false,
    ingredients: [
      { name: '番茄', amount: '2', unit: '个' },
      { name: '鸡蛋', amount: '2', unit: '个' },
      { name: '葱', amount: '1', unit: '根' },
      { name: '盐', amount: '适量', unit: '' },
      { name: '香油', amount: '几滴', unit: '' },
      { name: '淀粉', amount: '1', unit: '勺' }
    ],
    tutorial: [
      '番茄切块，鸡蛋打散',
      '热锅下油，炒番茄出汁',
      '加适量水烧开',
      '用水淀粉勾芡',
      '慢慢倒入蛋液，边倒边搅',
      '加盐调味',
      '撒葱花和香油即可'
    ]
  },
  {
    id: 5,
    categoryId: 'soup',
    name: '冬瓜排骨汤',
    price: 32,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop',
    description: '清热解暑，营养丰富',
    spicy: 0,
    popular: true,
    ingredients: [
      { name: '排骨', amount: '500g', unit: '克' },
      { name: '冬瓜', amount: '300g', unit: '克' },
      { name: '姜', amount: '3', unit: '片' },
      { name: '葱', amount: '2', unit: '根' },
      { name: '料酒', amount: '1', unit: '勺' },
      { name: '盐', amount: '适量', unit: '' }
    ],
    tutorial: [
      '排骨冷水下锅焯水去腥',
      '冬瓜去皮切块',
      '砂锅中加水、排骨、姜片、料酒',
      '大火烧开转小火炖30分钟',
      '加入冬瓜块继续炖15分钟',
      '加盐调味',
      '撒葱花即可'
    ]
  },
  {
    id: 6,
    categoryId: 'drink',
    name: '柠檬蜂蜜茶',
    price: 15,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop',
    description: '酸甜解渴，美白养颜',
    spicy: 0,
    popular: true,
    ingredients: [
      { name: '柠檬', amount: '1', unit: '个' },
      { name: '蜂蜜', amount: '2', unit: '勺' },
      { name: '温水', amount: '300', unit: 'ml' },
      { name: '冰块', amount: '适量', unit: '' }
    ],
    tutorial: [
      '柠檬洗净切片',
      '杯中放入柠檬片',
      '加入蜂蜜',
      '倒入温水搅拌',
      '加入冰块即可'
    ]
  },
  {
    id: 7,
    categoryId: 'drink',
    name: '珍珠奶茶',
    price: 18,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop',
    description: '经典奶茶，Q弹珍珠',
    spicy: 0,
    popular: true,
    ingredients: [
      { name: '红茶包', amount: '2', unit: '个' },
      { name: '牛奶', amount: '200', unit: 'ml' },
      { name: '珍珠', amount: '50g', unit: '克' },
      { name: '糖', amount: '2', unit: '勺' },
      { name: '冰块', amount: '适量', unit: '' }
    ],
    tutorial: [
      '珍珠煮15分钟，焖10分钟',
      '红茶包用热水泡5分钟',
      '加入糖搅拌融化',
      '加入牛奶',
      '加入珍珠',
      '加冰块即可'
    ]
  },
  {
    id: 8,
    categoryId: 'snack',
    name: '炸鸡翅',
    price: 22,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop',
    description: '外酥里嫩，香脆可口',
    spicy: 1,
    popular: true,
    ingredients: [
      { name: '鸡翅中', amount: '6', unit: '个' },
      { name: '生抽', amount: '2', unit: '勺' },
      { name: '料酒', amount: '1', unit: '勺' },
      { name: '盐', amount: '适量', unit: '' },
      { name: '胡椒粉', amount: '适量', unit: '' },
      { name: '淀粉', amount: '3', unit: '勺' },
      { name: '面包糠', amount: '50g', unit: '克' },
      { name: '油', amount: '适量', unit: '' }
    ],
    tutorial: [
      '鸡翅洗净，用刀划几刀',
      '用生抽、料酒、盐、胡椒粉腌制30分钟',
      '裹上淀粉',
      '裹上蛋液',
      '裹上面包糠',
      '油温六成热下锅炸',
      '炸至金黄捞出即可'
    ]
  },
  {
    id: 9,
    categoryId: 'snack',
    name: '薯条',
    price: 12,
    image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd75c9?w=400&h=400&fit=crop',
    description: '金黄酥脆，经典小食',
    spicy: 0,
    popular: false,
    ingredients: [
      { name: '土豆', amount: '2', unit: '个' },
      { name: '盐', amount: '适量', unit: '' },
      { name: '番茄酱', amount: '适量', unit: '' },
      { name: '油', amount: '适量', unit: '' }
    ],
    tutorial: [
      '土豆去皮切条',
      '用清水冲洗去除淀粉',
      '沥干水分',
      '油温六成热下锅炸',
      '炸至金黄捞出',
      '撒上盐即可'
    ]
  },
  {
    id: 10,
    categoryId: 'dessert',
    name: '芒果布丁',
    price: 16,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
    description: '香甜滑嫩，果香浓郁',
    spicy: 0,
    popular: true,
    ingredients: [
      { name: '芒果', amount: '2', unit: '个' },
      { name: '牛奶', amount: '200', unit: 'ml' },
      { name: '淡奶油', amount: '100', unit: 'ml' },
      { name: '糖', amount: '30g', unit: '克' },
      { name: '吉利丁片', amount: '2', unit: '片' }
    ],
    tutorial: [
      '吉利丁片用冷水泡软',
      '芒果去皮切块，打成泥',
      '牛奶加糖加热至糖融化',
      '加入吉利丁片搅拌融化',
      '加入淡奶油和芒果泥',
      '倒入模具冷藏4小时',
      '脱模即可'
    ]
  },
  {
    id: 11,
    categoryId: 'dessert',
    name: '提拉米苏',
    price: 28,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
    description: '意式经典，口感丰富',
    spicy: 0,
    popular: true,
    ingredients: [
      { name: '马斯卡彭芝士', amount: '250g', unit: '克' },
      { name: '手指饼干', amount: '1', unit: '包' },
      { name: '鸡蛋', amount: '3', unit: '个' },
      { name: '糖', amount: '60g', unit: '克' },
      { name: '咖啡', amount: '200', unit: 'ml' },
      { name: '可可粉', amount: '适量', unit: '' }
    ],
    tutorial: [
      '蛋黄加糖打发至发白',
      '加入马斯卡彭芝士拌匀',
      '蛋白打发至硬性发泡',
      '分次加入芝士糊拌匀',
      '手指饼干蘸咖啡铺底',
      '铺一层芝士糊',
      '重复铺层',
      '冷藏4小时，撒可可粉即可'
    ]
  },
  {
    id: 12,
    categoryId: 'main',
    name: '糖醋里脊',
    price: 32,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop',
    description: '酸甜可口，外酥里嫩',
    spicy: 0,
    popular: true,
    ingredients: [
      { name: '猪里脊肉', amount: '300g', unit: '克' },
      { name: '番茄酱', amount: '3', unit: '勺' },
      { name: '白糖', amount: '2', unit: '勺' },
      { name: '白醋', amount: '2', unit: '勺' },
      { name: '淀粉', amount: '3', unit: '勺' },
      { name: '鸡蛋', amount: '1', unit: '个' },
      { name: '盐', amount: '适量', unit: '' },
      { name: '油', amount: '适量', unit: '' }
    ],
    tutorial: [
      '里脊肉切条，用盐腌制',
      '裹上淀粉和蛋液',
      '油温六成热下锅炸至金黄',
      '锅留底油，加番茄酱、糖、醋炒匀',
      '加少量水煮开',
      '勾芡',
      '倒入里脊肉炒匀即可'
    ]
  }
]

export const getItemsByCategory = (categoryId) => {
  return menuItems.filter(item => item.categoryId === categoryId)
}

export const getItemById = (id) => {
  return menuItems.find(item => item.id === id)
}

export const getPopularItems = () => {
  return menuItems.filter(item => item.popular).slice(0, 6)
}
