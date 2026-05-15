// =============================================================================
// Seed: Regions + Cities (7 regions, ~135 cities/districts)
// Idempotent — uses upsert by unique slug
// =============================================================================

export interface RegionSeed {
  name: string;
  slug: string;
  sort_order: number;
}

export interface CitySeed {
  name: string;
  slug: string;
  regionSlug: string;
  sort_order: number;
}

// ---------- 7 regions ----------

export const regions: RegionSeed[] = [
  { name: 'Брестская область',    slug: 'brestskaya-oblast',     sort_order: 1 },
  { name: 'Витебская область',    slug: 'vitebskaya-oblast',     sort_order: 2 },
  { name: 'Гомельская область',   slug: 'gomelskaya-oblast',     sort_order: 3 },
  { name: 'Гродненская область',  slug: 'grodnenskaya-oblast',   sort_order: 4 },
  { name: 'Минская область',      slug: 'minskaya-oblast',       sort_order: 5 },
  { name: 'Могилёвская область',  slug: 'mogilyovskaya-oblast',  sort_order: 6 },
  { name: 'г. Минск',             slug: 'g-minsk',               sort_order: 7 },
];

// ---------- Cities by region ----------

export const cities: CitySeed[] = [
  // Брестская область (20)
  { name: 'Брест',              slug: 'brest',                 regionSlug: 'brestskaya-oblast',    sort_order: 1 },
  { name: 'Барановичи',         slug: 'baranovichi',           regionSlug: 'brestskaya-oblast',    sort_order: 2 },
  { name: 'Пинск',              slug: 'pinsk',                 regionSlug: 'brestskaya-oblast',    sort_order: 3 },
  { name: 'Кобрин',             slug: 'kobrin',                regionSlug: 'brestskaya-oblast',    sort_order: 4 },
  { name: 'Берёза',             slug: 'beryoza',               regionSlug: 'brestskaya-oblast',    sort_order: 5 },
  { name: 'Лунинец',            slug: 'luninets',              regionSlug: 'brestskaya-oblast',    sort_order: 6 },
  { name: 'Ивацевичи',          slug: 'ivatsevichi',           regionSlug: 'brestskaya-oblast',    sort_order: 7 },
  { name: 'Пружаны',            slug: 'pruzhany',              regionSlug: 'brestskaya-oblast',    sort_order: 8 },
  { name: 'Столин',             slug: 'stolin',                regionSlug: 'brestskaya-oblast',    sort_order: 9 },
  { name: 'Дрогичин',           slug: 'drogichin',             regionSlug: 'brestskaya-oblast',    sort_order: 10 },
  { name: 'Жабинка',            slug: 'zhabinka',              regionSlug: 'brestskaya-oblast',    sort_order: 11 },
  { name: 'Малорита',           slug: 'malorita',              regionSlug: 'brestskaya-oblast',    sort_order: 12 },
  { name: 'Ганцевичи',          slug: 'gantsevichi',           regionSlug: 'brestskaya-oblast',    sort_order: 13 },
  { name: 'Ляховичи',           slug: 'lyakhovichi',           regionSlug: 'brestskaya-oblast',    sort_order: 14 },
  { name: 'Иваново',            slug: 'ivanovo',               regionSlug: 'brestskaya-oblast',    sort_order: 15 },
  { name: 'Каменец',            slug: 'kamenets',              regionSlug: 'brestskaya-oblast',    sort_order: 16 },
  { name: 'Микашевичи',         slug: 'mikashevichi',          regionSlug: 'brestskaya-oblast',    sort_order: 17 },
  { name: 'Белоозёрск',         slug: 'beloozersk',            regionSlug: 'brestskaya-oblast',    sort_order: 18 },
  { name: 'Домачево',           slug: 'domachevo',             regionSlug: 'brestskaya-oblast',    sort_order: 19 },
  { name: 'Высокое',            slug: 'vysokoe',               regionSlug: 'brestskaya-oblast',    sort_order: 20 },

  // Витебская область (22)
  { name: 'Витебск',            slug: 'vitebsk',               regionSlug: 'vitebskaya-oblast',    sort_order: 1 },
  { name: 'Орша',               slug: 'orsha',                 regionSlug: 'vitebskaya-oblast',    sort_order: 2 },
  { name: 'Новополоцк',         slug: 'novopolotsk',           regionSlug: 'vitebskaya-oblast',    sort_order: 3 },
  { name: 'Полоцк',             slug: 'polotsk',               regionSlug: 'vitebskaya-oblast',    sort_order: 4 },
  { name: 'Поставы',            slug: 'postavy',               regionSlug: 'vitebskaya-oblast',    sort_order: 5 },
  { name: 'Глубокое',           slug: 'glubokoe',              regionSlug: 'vitebskaya-oblast',    sort_order: 6 },
  { name: 'Лепель',             slug: 'lepel',                 regionSlug: 'vitebskaya-oblast',    sort_order: 7 },
  { name: 'Верхнедвинск',       slug: 'verhnedvinsk',          regionSlug: 'vitebskaya-oblast',    sort_order: 8 },
  { name: 'Браслав',            slug: 'braslav',               regionSlug: 'vitebskaya-oblast',    sort_order: 9 },
  { name: 'Миоры',              slug: 'miory',                 regionSlug: 'vitebskaya-oblast',    sort_order: 10 },
  { name: 'Докшицы',            slug: 'dokshitsy',             regionSlug: 'vitebskaya-oblast',    sort_order: 11 },
  { name: 'Шарковщина',         slug: 'sharkovshchina',        regionSlug: 'vitebskaya-oblast',    sort_order: 12 },
  { name: 'Сенно',              slug: 'senno',                 regionSlug: 'vitebskaya-oblast',    sort_order: 13 },
  { name: 'Городок',            slug: 'gorodok',               regionSlug: 'vitebskaya-oblast',    sort_order: 14 },
  { name: 'Бешенковичи',        slug: 'beshenkovichi',         regionSlug: 'vitebskaya-oblast',    sort_order: 15 },
  { name: 'Дубровно',           slug: 'dubrovno',              regionSlug: 'vitebskaya-oblast',    sort_order: 16 },
  { name: 'Чашники',            slug: 'chashniki',             regionSlug: 'vitebskaya-oblast',    sort_order: 17 },
  { name: 'Ушачи',              slug: 'ushachi',               regionSlug: 'vitebskaya-oblast',    sort_order: 18 },
  { name: 'Толочин',            slug: 'tolochin',              regionSlug: 'vitebskaya-oblast',    sort_order: 19 },
  { name: 'Россоны',            slug: 'rossony',               regionSlug: 'vitebskaya-oblast',    sort_order: 20 },
  { name: 'Шумилино',           slug: 'shumilino',             regionSlug: 'vitebskaya-oblast',    sort_order: 21 },
  { name: 'Лиозно',             slug: 'liozno',                regionSlug: 'vitebskaya-oblast',    sort_order: 22 },

  // Гомельская область (21)
  { name: 'Гомель',             slug: 'gomel',                 regionSlug: 'gomelskaya-oblast',    sort_order: 1 },
  { name: 'Мозырь',             slug: 'mozyr',                 regionSlug: 'gomelskaya-oblast',    sort_order: 2 },
  { name: 'Жлобин',             slug: 'zhlobin',               regionSlug: 'gomelskaya-oblast',    sort_order: 3 },
  { name: 'Речица',             slug: 'rechitsa',              regionSlug: 'gomelskaya-oblast',    sort_order: 4 },
  { name: 'Светлогорск',        slug: 'svetlogorsk',           regionSlug: 'gomelskaya-oblast',    sort_order: 5 },
  { name: 'Калинковичи',        slug: 'kalinkovichi',          regionSlug: 'gomelskaya-oblast',    sort_order: 6 },
  { name: 'Рогачёв',            slug: 'rogachyov',             regionSlug: 'gomelskaya-oblast',    sort_order: 7 },
  { name: 'Добруш',             slug: 'dobrush',               regionSlug: 'gomelskaya-oblast',    sort_order: 8 },
  { name: 'Лельчицы',           slug: 'lelchitsy',             regionSlug: 'gomelskaya-oblast',    sort_order: 9 },
  { name: 'Петриков',           slug: 'petrikov',              regionSlug: 'gomelskaya-oblast',    sort_order: 10 },
  { name: 'Житковичи',          slug: 'zhitkovichi',           regionSlug: 'gomelskaya-oblast',    sort_order: 11 },
  { name: 'Хойники',            slug: 'hoyniki',               regionSlug: 'gomelskaya-oblast',    sort_order: 12 },
  { name: 'Ельск',              slug: 'yelsk',                 regionSlug: 'gomelskaya-oblast',    sort_order: 13 },
  { name: 'Наровля',            slug: 'narovlya',              regionSlug: 'gomelskaya-oblast',    sort_order: 14 },
  { name: 'Чечерск',            slug: 'chechersk',             regionSlug: 'gomelskaya-oblast',    sort_order: 15 },
  { name: 'Ветка',              slug: 'vetka',                 regionSlug: 'gomelskaya-oblast',    sort_order: 16 },
  { name: 'Буда-Кошелёво',      slug: 'buda-koshelyovo',       regionSlug: 'gomelskaya-oblast',    sort_order: 17 },
  { name: 'Лоев',               slug: 'loev',                  regionSlug: 'gomelskaya-oblast',    sort_order: 18 },
  { name: 'Октябрьский',        slug: 'oktyabrskiy',           regionSlug: 'gomelskaya-oblast',    sort_order: 19 },
  { name: 'Брагин',             slug: 'bragin',                regionSlug: 'gomelskaya-oblast',    sort_order: 20 },
  { name: 'Корма',              slug: 'korma',                 regionSlug: 'gomelskaya-oblast',    sort_order: 21 },

  // Гродненская область (17)
  { name: 'Гродно',             slug: 'grodno',                regionSlug: 'grodnenskaya-oblast',  sort_order: 1 },
  { name: 'Лида',               slug: 'lida',                  regionSlug: 'grodnenskaya-oblast',  sort_order: 2 },
  { name: 'Слоним',             slug: 'slonim',                regionSlug: 'grodnenskaya-oblast',  sort_order: 3 },
  { name: 'Волковыск',          slug: 'volkovysk',             regionSlug: 'grodnenskaya-oblast',  sort_order: 4 },
  { name: 'Сморгонь',           slug: 'smorgon',               regionSlug: 'grodnenskaya-oblast',  sort_order: 5 },
  { name: 'Новогрудок',         slug: 'novogrudok',            regionSlug: 'grodnenskaya-oblast',  sort_order: 6 },
  { name: 'Мосты',              slug: 'mosty',                 regionSlug: 'grodnenskaya-oblast',  sort_order: 7 },
  { name: 'Щучин',              slug: 'shchuchin',             regionSlug: 'grodnenskaya-oblast',  sort_order: 8 },
  { name: 'Ошмяны',             slug: 'oshmyany',              regionSlug: 'grodnenskaya-oblast',  sort_order: 9 },
  { name: 'Островец',           slug: 'ostrovets',             regionSlug: 'grodnenskaya-oblast',  sort_order: 10 },
  { name: 'Ивье',               slug: 'ivye',                  regionSlug: 'grodnenskaya-oblast',  sort_order: 11 },
  { name: 'Свислочь',           slug: 'svisloch',              regionSlug: 'grodnenskaya-oblast',  sort_order: 12 },
  { name: 'Дятлово',            slug: 'dyatlovo',              regionSlug: 'grodnenskaya-oblast',  sort_order: 13 },
  { name: 'Кореличи',           slug: 'korelichi',             regionSlug: 'grodnenskaya-oblast',  sort_order: 14 },
  { name: 'Зельва',             slug: 'zelva',                 regionSlug: 'grodnenskaya-oblast',  sort_order: 15 },
  { name: 'Вороново',           slug: 'voronovo',              regionSlug: 'grodnenskaya-oblast',  sort_order: 16 },
  { name: 'Берестовица',        slug: 'berestovitsa',          regionSlug: 'grodnenskaya-oblast',  sort_order: 17 },

  // Минская область (24)
  { name: 'Борисов',            slug: 'borisov',               regionSlug: 'minskaya-oblast',      sort_order: 1 },
  { name: 'Солигорск',          slug: 'soligorsk',             regionSlug: 'minskaya-oblast',      sort_order: 2 },
  { name: 'Молодечно',          slug: 'molodechno',            regionSlug: 'minskaya-oblast',      sort_order: 3 },
  { name: 'Жодино',             slug: 'zhodino',               regionSlug: 'minskaya-oblast',      sort_order: 4 },
  { name: 'Слуцк',              slug: 'sluck',                 regionSlug: 'minskaya-oblast',      sort_order: 5 },
  { name: 'Дзержинск',          slug: 'dzerzhinsk',            regionSlug: 'minskaya-oblast',      sort_order: 6 },
  { name: 'Вилейка',            slug: 'vileyka',               regionSlug: 'minskaya-oblast',      sort_order: 7 },
  { name: 'Столбцы',            slug: 'stolbtsy',              regionSlug: 'minskaya-oblast',      sort_order: 8 },
  { name: 'Логойск',            slug: 'logoysk',               regionSlug: 'minskaya-oblast',      sort_order: 9 },
  { name: 'Березино',           slug: 'berezino',              regionSlug: 'minskaya-oblast',      sort_order: 10 },
  { name: 'Крупки',             slug: 'krupki',                regionSlug: 'minskaya-oblast',      sort_order: 11 },
  { name: 'Узда',               slug: 'uzda',                  regionSlug: 'minskaya-oblast',      sort_order: 12 },
  { name: 'Несвиж',             slug: 'nesvizh',               regionSlug: 'minskaya-oblast',      sort_order: 13 },
  { name: 'Клецк',              slug: 'kletsk',                regionSlug: 'minskaya-oblast',      sort_order: 14 },
  { name: 'Старые Дороги',      slug: 'starye-dorogi',         regionSlug: 'minskaya-oblast',      sort_order: 15 },
  { name: 'Воложин',            slug: 'volozhin',              regionSlug: 'minskaya-oblast',      sort_order: 16 },
  { name: 'Любань',             slug: 'lyuban',                regionSlug: 'minskaya-oblast',      sort_order: 17 },
  { name: 'Мядель',             slug: 'myadel',                regionSlug: 'minskaya-oblast',      sort_order: 18 },
  { name: 'Копыль',             slug: 'kopyl',                 regionSlug: 'minskaya-oblast',      sort_order: 19 },
  { name: 'Червень',            slug: 'cherven',               regionSlug: 'minskaya-oblast',      sort_order: 20 },
  { name: 'Марьина Горка',      slug: 'marina-gorka',          regionSlug: 'minskaya-oblast',      sort_order: 21 },
  { name: 'Заславль',           slug: 'zaslavl',               regionSlug: 'minskaya-oblast',      sort_order: 22 },
  { name: 'Фаниполь',           slug: 'fanipol',               regionSlug: 'minskaya-oblast',      sort_order: 23 },
  { name: 'Смолевичи',          slug: 'smolevichi',            regionSlug: 'minskaya-oblast',      sort_order: 24 },

  // Могилёвская область (21)
  { name: 'Могилёв',            slug: 'mogilyov',              regionSlug: 'mogilyovskaya-oblast', sort_order: 1 },
  { name: 'Бобруйск',           slug: 'bobruysk',              regionSlug: 'mogilyovskaya-oblast', sort_order: 2 },
  { name: 'Горки',              slug: 'gorki',                 regionSlug: 'mogilyovskaya-oblast', sort_order: 3 },
  { name: 'Осиповичи',          slug: 'osipovichi',            regionSlug: 'mogilyovskaya-oblast', sort_order: 4 },
  { name: 'Кричев',             slug: 'krichev',               regionSlug: 'mogilyovskaya-oblast', sort_order: 5 },
  { name: 'Климовичи',          slug: 'klimovichi',            regionSlug: 'mogilyovskaya-oblast', sort_order: 6 },
  { name: 'Шклов',              slug: 'shklov',                regionSlug: 'mogilyovskaya-oblast', sort_order: 7 },
  { name: 'Быхов',              slug: 'byhov',                 regionSlug: 'mogilyovskaya-oblast', sort_order: 8 },
  { name: 'Костюковичи',        slug: 'kostyukovichi',         regionSlug: 'mogilyovskaya-oblast', sort_order: 9 },
  { name: 'Мстиславль',         slug: 'mstislavl',             regionSlug: 'mogilyovskaya-oblast', sort_order: 10 },
  { name: 'Чаусы',              slug: 'chausy',                regionSlug: 'mogilyovskaya-oblast', sort_order: 11 },
  { name: 'Чериков',            slug: 'cherikov',              regionSlug: 'mogilyovskaya-oblast', sort_order: 12 },
  { name: 'Славгород',          slug: 'slavgorod',             regionSlug: 'mogilyovskaya-oblast', sort_order: 13 },
  { name: 'Кличев',             slug: 'klichev',               regionSlug: 'mogilyovskaya-oblast', sort_order: 14 },
  { name: 'Кировск',            slug: 'kirovsk',               regionSlug: 'mogilyovskaya-oblast', sort_order: 15 },
  { name: 'Круглое',            slug: 'krugloe',               regionSlug: 'mogilyovskaya-oblast', sort_order: 16 },
  { name: 'Хотимск',            slug: 'hotimsk',               regionSlug: 'mogilyovskaya-oblast', sort_order: 17 },
  { name: 'Белыничи',           slug: 'belynichy',             regionSlug: 'mogilyovskaya-oblast', sort_order: 18 },
  { name: 'Глуск',              slug: 'glusk',                 regionSlug: 'mogilyovskaya-oblast', sort_order: 19 },
  { name: 'Дрибин',             slug: 'dribin',                regionSlug: 'mogilyovskaya-oblast', sort_order: 20 },
  { name: 'Краснополье',        slug: 'krasnopolye',           regionSlug: 'mogilyovskaya-oblast', sort_order: 21 },

  // г. Минск (10: город + 9 районов)
  { name: 'Минск',              slug: 'minsk',                 regionSlug: 'g-minsk',              sort_order: 1 },
  { name: 'Заводской район',    slug: 'zavodskoy-rayon',       regionSlug: 'g-minsk',              sort_order: 2 },
  { name: 'Ленинский район',    slug: 'leninskiy-rayon',       regionSlug: 'g-minsk',              sort_order: 3 },
  { name: 'Московский район',   slug: 'moskovskiy-rayon',      regionSlug: 'g-minsk',              sort_order: 4 },
  { name: 'Октябрьский район',  slug: 'oktyabrskiy-rayon',     regionSlug: 'g-minsk',              sort_order: 5 },
  { name: 'Партизанский район', slug: 'partizanskiy-rayon',    regionSlug: 'g-minsk',              sort_order: 6 },
  { name: 'Первомайский район', slug: 'pervomayskiy-rayon',    regionSlug: 'g-minsk',              sort_order: 7 },
  { name: 'Советский район',    slug: 'sovetskiy-rayon',       regionSlug: 'g-minsk',              sort_order: 8 },
  { name: 'Фрунзенский район',  slug: 'frunzenskiy-rayon',     regionSlug: 'g-minsk',              sort_order: 9 },
  { name: 'Центральный район',  slug: 'tsentralniy-rayon',     regionSlug: 'g-minsk',              sort_order: 10 },
];
