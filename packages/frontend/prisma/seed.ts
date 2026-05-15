import { prisma } from '@/lib/prisma';
import { regions, cities } from './seed-regions';

// =============================================================================
// Seed: Categories (13 groups + 97 categories)
// Idempotent — uses upsert by unique slug
// =============================================================================

interface GroupSeed {
  name: string;
  slug: string;
  sort_order: number;
}

interface CategorySeed {
  name: string;
  slug: string;
  parentSlug: string;
  metadata: Record<string, string>;
  sort_order: number;
}

// ---------- 13 groups (parent_id = null) ----------

const groups: GroupSeed[] = [
  { name: 'Строительные работы',    slug: 'stroitelnye-raboty',    sort_order: 1 },
  { name: 'Отделка стен',           slug: 'otdelka-sten',           sort_order: 2 },
  { name: 'Плиточные работы',       slug: 'plitochnye-raboty',      sort_order: 3 },
  { name: 'Полы',                   slug: 'poly',                   sort_order: 4 },
  { name: 'Потолки',                slug: 'potolki',                sort_order: 5 },
  { name: 'Электрика',              slug: 'elektrika',              sort_order: 6 },
  { name: 'Сантехника и отопление', slug: 'santehnika-i-otoplenie', sort_order: 7 },
  { name: 'Окна и двери',           slug: 'okna-i-dveri',           sort_order: 8 },
  { name: 'Фасад и кровля',         slug: 'fasad-i-krovlya',        sort_order: 9 },
  { name: 'Участок и ландшафт',     slug: 'uchastok-i-landshaft',   sort_order: 10 },
  { name: 'Проектирование',         slug: 'proektirovanie',         sort_order: 11 },
  { name: 'Комплексные работы',     slug: 'kompleksnye-raboty',     sort_order: 12 },
  { name: 'Дополнительные услуги',  slug: 'dopolnitelnye-uslugi',   sort_order: 13 },
];

// ---------- 97 categories (linked to groups via parentSlug) ----------

const categories: CategorySeed[] = [
  // ── 1. Строительные работы ──
  { name: 'Возведение стен (кирпич)',       slug: 'vozvedenie-sten-kirpich',       parentSlug: 'stroitelnye-raboty', metadata: { unit: 'm2', material: 'brick' },                    sort_order: 1 },
  { name: 'Возведение стен (блоки)',        slug: 'vozvedenie-sten-bloki',         parentSlug: 'stroitelnye-raboty', metadata: { unit: 'm2', material: 'blocks' },                   sort_order: 2 },
  { name: 'Возведение стен (каркас)',       slug: 'vozvedenie-sten-karkas',        parentSlug: 'stroitelnye-raboty', metadata: { unit: 'm2', material: 'frame' },                    sort_order: 3 },
  { name: 'Кладка перегородок',             slug: 'kladka-peregorodok',            parentSlug: 'stroitelnye-raboty', metadata: { unit: 'm2' },                                       sort_order: 4 },
  { name: 'Демонтаж стен и перегородок',    slug: 'demontazh-sten-i-peregorodok',  parentSlug: 'stroitelnye-raboty', metadata: { unit: 'm2' },                                       sort_order: 5 },
  { name: 'Устройство проёмов',             slug: 'ustroystvo-proyomov',           parentSlug: 'stroitelnye-raboty', metadata: { unit: 'pcs' },                                      sort_order: 6 },
  { name: 'Штробление стен',                slug: 'shtroblenie-sten',              parentSlug: 'stroitelnye-raboty', metadata: { unit: 'lm' },                                       sort_order: 7 },

  // ── 2. Отделка стен ──
  { name: 'Штукатурка стен',                slug: 'shtukaturka-sten',               parentSlug: 'otdelka-sten', metadata: { unit: 'm2' }, sort_order: 1 },
  { name: 'Шпаклёвка стен',                 slug: 'shpaklyovka-sten',               parentSlug: 'otdelka-sten', metadata: { unit: 'm2' }, sort_order: 2 },
  { name: 'Покраска стен',                  slug: 'pokraska-sten',                  parentSlug: 'otdelka-sten', metadata: { unit: 'm2' }, sort_order: 3 },
  { name: 'Поклейка обоев',                 slug: 'pokleyka-oboev',                 parentSlug: 'otdelka-sten', metadata: { unit: 'm2' }, sort_order: 4 },
  { name: 'Декоративная штукатурка',        slug: 'dekorativnaya-shtukaturka',      parentSlug: 'otdelka-sten', metadata: { unit: 'm2' }, sort_order: 5 },
  { name: 'Гипсокартонные конструкции',     slug: 'gipsokartonnye-konstruktsii',    parentSlug: 'otdelka-sten', metadata: { unit: 'm2' }, sort_order: 6 },
  { name: 'Монтаж стеновых панелей',        slug: 'montazh-stenovykh-paneley',      parentSlug: 'otdelka-sten', metadata: { unit: 'm2' }, sort_order: 7 },
  { name: 'Отделка откосов',                slug: 'otdelka-otkosov',                parentSlug: 'otdelka-sten', metadata: { unit: 'lm' }, sort_order: 8 },

  // ── 3. Плиточные работы ──
  { name: 'Укладка плитки на стены',        slug: 'ukladka-plitki-na-steny',        parentSlug: 'plitochnye-raboty', metadata: { unit: 'm2', surface: 'wall' },      sort_order: 1 },
  { name: 'Укладка плитки на пол',          slug: 'ukladka-plitki-na-pol',          parentSlug: 'plitochnye-raboty', metadata: { unit: 'm2', surface: 'floor' },     sort_order: 2 },
  { name: 'Мозаика',                        slug: 'mozaika',                        parentSlug: 'plitochnye-raboty', metadata: { unit: 'm2' },                       sort_order: 3 },
  { name: 'Затирка швов',                   slug: 'zatirka-shvov',                   parentSlug: 'plitochnye-raboty', metadata: { unit: 'm2' },                       sort_order: 4 },
  { name: 'Гидроизоляция',                  slug: 'gidroizolyatsiya',               parentSlug: 'plitochnye-raboty', metadata: { unit: 'm2' },                       sort_order: 5 },
  { name: 'Керамогранит',                   slug: 'keramogranit',                   parentSlug: 'plitochnye-raboty', metadata: { unit: 'm2', material: 'porcelain' }, sort_order: 6 },

  // ── 4. Полы ──
  { name: 'Заливка стяжки',                 slug: 'zalivka-styazhki',               parentSlug: 'poly', metadata: { unit: 'm2' }, sort_order: 1 },
  { name: 'Наливной пол',                   slug: 'nalivnoy-pol',                   parentSlug: 'poly', metadata: { unit: 'm2' }, sort_order: 2 },
  { name: 'Укладка ламината',               slug: 'ukladka-laminata',               parentSlug: 'poly', metadata: { unit: 'm2', material: 'laminate' }, sort_order: 3 },
  { name: 'Укладка паркета',                slug: 'ukladka-parketa',                parentSlug: 'poly', metadata: { unit: 'm2', material: 'parquet' }, sort_order: 4 },
  { name: 'Укладка линолеума',              slug: 'ukladka-linoleuma',              parentSlug: 'poly', metadata: { unit: 'm2', material: 'linoleum' }, sort_order: 5 },
  { name: 'Укладка ковролина',              slug: 'ukladka-kovrolina',              parentSlug: 'poly', metadata: { unit: 'm2', material: 'carpet' }, sort_order: 6 },
  { name: 'Тёплый пол (водяной)',           slug: 'tyoplyy-pol-vodyanoy',           parentSlug: 'poly', metadata: { unit: 'm2', type: 'water' },    sort_order: 7 },
  { name: 'Тёплый пол (электрический)',     slug: 'tyoplyy-pol-elektricheskiy',     parentSlug: 'poly', metadata: { unit: 'm2', type: 'electric' }, sort_order: 8 },
  { name: 'Выравнивание пола',              slug: 'vyravnivanie-pola',              parentSlug: 'poly', metadata: { unit: 'm2' }, sort_order: 9 },
  { name: 'Наливной 3D пол',                slug: 'nalivnoy-3d-pol',                parentSlug: 'poly', metadata: { unit: 'm2' }, sort_order: 10 },

  // ── 5. Потолки ──
  { name: 'Натяжные потолки',               slug: 'natyazhnye-potolki',             parentSlug: 'potolki', metadata: { unit: 'm2', type: 'stretch' },    sort_order: 1 },
  { name: 'Подвесные потолки (гипсокартон)', slug: 'podvesnye-potolki-gipsokarton',  parentSlug: 'potolki', metadata: { unit: 'm2', material: 'drywall' }, sort_order: 2 },
  { name: 'Покраска потолка',               slug: 'pokraska-potolka',               parentSlug: 'potolki', metadata: { unit: 'm2' }, sort_order: 3 },
  { name: 'Реечные потолки',                slug: 'reechnye-potolki',               parentSlug: 'potolki', metadata: { unit: 'm2' }, sort_order: 4 },
  { name: 'Потолочные плиты',               slug: 'potolochnye-plity',              parentSlug: 'potolki', metadata: { unit: 'm2' }, sort_order: 5 },

  // ── 6. Электрика ──
  { name: 'Разводка электропроводки',              slug: 'razvodka-elektroprovodki',             parentSlug: 'elektrika', metadata: { unit: 'project' }, sort_order: 1 },
  { name: 'Установка розеток и выключателей',      slug: 'ustanovka-rozetok-i-vyklyuchateley',   parentSlug: 'elektrika', metadata: { unit: 'pcs' },     sort_order: 2 },
  { name: 'Сборка электрощита',                     slug: 'sborka-elektroshchita',                parentSlug: 'elektrika', metadata: { unit: 'pcs' },     sort_order: 3 },
  { name: 'Монтаж освещения',                       slug: 'montazh-osveshcheniya',                parentSlug: 'elektrika', metadata: { unit: 'pcs' },     sort_order: 4 },
  { name: 'Слаботочные системы (интернет, ТВ)',     slug: 'slabotochnye-sistemy',                 parentSlug: 'elektrika', metadata: { unit: 'project' }, sort_order: 5 },
  { name: 'Сигнализация и видеонаблюдение',         slug: 'signalizatsiya-i-videonablyudenie',    parentSlug: 'elektrika', metadata: { unit: 'project' }, sort_order: 6 },
  { name: 'Умный дом',                              slug: 'umnyy-dom',                            parentSlug: 'elektrika', metadata: { unit: 'project' }, sort_order: 7 },
  { name: 'Замена проводки',                        slug: 'zamena-provodki',                      parentSlug: 'elektrika', metadata: { unit: 'project' }, sort_order: 8 },

  // ── 7. Сантехника и отопление ──
  { name: 'Разводка водопровода',                  slug: 'razvodka-vodoprovoda',                  parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'project' },  sort_order: 1 },
  { name: 'Разводка канализации',                   slug: 'razvodka-kanalizatsii',                 parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'project' },  sort_order: 2 },
  { name: 'Установка сантехники (унитаз, ванна, раковина)', slug: 'ustanovka-santehniki',          parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'pcs' },      sort_order: 3 },
  { name: 'Установка смесителей',                   slug: 'ustanovka-smesiteley',                  parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'pcs' },      sort_order: 4 },
  { name: 'Установка душевой кабины',               slug: 'ustanovka-dushevoy-kabiny',             parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'pcs' },      sort_order: 5 },
  { name: 'Установка бойлера',                      slug: 'ustanovka-boylera',                    parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'pcs' },      sort_order: 6 },
  { name: 'Фильтрация воды',                        slug: 'filtratsiya-vody',                     parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'project' },  sort_order: 7 },
  { name: 'Монтаж отопления (радиаторы)',           slug: 'montazh-otopleniya-radiatory',          parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'pcs' },      sort_order: 8 },
  { name: 'Монтаж котла отопления',                 slug: 'montazh-kotla-otopleniya',              parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'pcs' },      sort_order: 9 },
  { name: 'Тёплый пол (водяной — монтаж)',          slug: 'tyoplyy-pol-vodyanoy-montazh',          parentSlug: 'santehnika-i-otoplenie', metadata: { unit: 'm2' },       sort_order: 10 },

  // ── 8. Окна и двери ──
  { name: 'Установка окон ПВХ',              slug: 'ustanovka-okon-pvkh',              parentSlug: 'okna-i-dveri', metadata: { unit: 'pcs', material: 'pvc' },  sort_order: 1 },
  { name: 'Установка окон деревянных',       slug: 'ustanovka-okon-derevyannykh',      parentSlug: 'okna-i-dveri', metadata: { unit: 'pcs', material: 'wood' }, sort_order: 2 },
  { name: 'Установка межкомнатных дверей',   slug: 'ustanovka-mezhkomnatnykh-dverey',  parentSlug: 'okna-i-dveri', metadata: { unit: 'pcs' },                    sort_order: 3 },
  { name: 'Установка входных дверей',        slug: 'ustanovka-vkhodnykh-dverey',       parentSlug: 'okna-i-dveri', metadata: { unit: 'pcs' },                    sort_order: 4 },
  { name: 'Откосы оконные',                  slug: 'otkosy-okonnye',                   parentSlug: 'okna-i-dveri', metadata: { unit: 'pcs' },                    sort_order: 5 },
  { name: 'Москитные сетки',                 slug: 'moskitnye-setki',                  parentSlug: 'okna-i-dveri', metadata: { unit: 'pcs' },                    sort_order: 6 },
  { name: 'Замена стеклопакетов',            slug: 'zamena-steklopaketov',             parentSlug: 'okna-i-dveri', metadata: { unit: 'pcs' },                    sort_order: 7 },
  { name: 'Балконное остекление',            slug: 'balkonnoe-osteklenie',             parentSlug: 'okna-i-dveri', metadata: { unit: 'project' },                 sort_order: 8 },

  // ── 9. Фасад и кровля ──
  { name: 'Утепление фасада',                     slug: 'uteplenie-fasada',                      parentSlug: 'fasad-i-krovlya', metadata: { unit: 'm2' },                     sort_order: 1 },
  { name: 'Отделка фасада (штукатурка)',           slug: 'otdelka-fasada-shtukaturka',            parentSlug: 'fasad-i-krovlya', metadata: { unit: 'm2' },                     sort_order: 2 },
  { name: 'Отделка фасада (сайдинг)',              slug: 'otdelka-fasada-sayding',                parentSlug: 'fasad-i-krovlya', metadata: { unit: 'm2', material: 'siding' }, sort_order: 3 },
  { name: 'Монтаж кровли (металлочерепица)',       slug: 'montazh-krovli-metallocherepitsa',      parentSlug: 'fasad-i-krovlya', metadata: { unit: 'm2', material: 'metal' },  sort_order: 4 },
  { name: 'Монтаж кровли (мягкая)',                slug: 'montazh-krovli-myagkaya',               parentSlug: 'fasad-i-krovlya', metadata: { unit: 'm2', material: 'soft' },   sort_order: 5 },
  { name: 'Водосточная система',                   slug: 'vodostochnaya-sistema',                 parentSlug: 'fasad-i-krovlya', metadata: { unit: 'lm' },                     sort_order: 6 },
  { name: 'Ремонт кровли',                         slug: 'remont-krovli',                         parentSlug: 'fasad-i-krovlya', metadata: { unit: 'm2' },                     sort_order: 7 },

  // ── 10. Участок и ландшафт ──
  { name: 'Ландшафтный дизайн',               slug: 'landshaftnyy-dizayn',              parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'project' },  sort_order: 1 },
  { name: 'Укладка тротуарной плитки',         slug: 'ukladka-trotuarnoy-plitki',        parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'm2' },       sort_order: 2 },
  { name: 'Бетонные дорожки и площадки',       slug: 'betonnye-dorozhki-i-ploshchadki',  parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'm2' },       sort_order: 3 },
  { name: 'Дренажная система',                 slug: 'drenazhnaya-sistema',              parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'project' },  sort_order: 4 },
  { name: 'Установка септика',                 slug: 'ustanovka-septika',                parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'pcs' },      sort_order: 5 },
  { name: 'Бурение скважин',                   slug: 'burenie-skvazhin',                 parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'pcs' },      sort_order: 6 },
  { name: 'Строительство беседок',             slug: 'stroitelstvo-besedok',             parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'project' },  sort_order: 7 },
  { name: 'Строительство террас',              slug: 'stroitelstvo-terras',              parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'm2' },       sort_order: 8 },
  { name: 'Строительство бассейнов',           slug: 'stroitelstvo-basseynov',           parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'project' },  sort_order: 9 },
  { name: 'Монтаж забора',                     slug: 'montazh-zabora',                   parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'lm' },       sort_order: 10 },
  { name: 'Монтаж ворот и автоматики',         slug: 'montazh-vorot-i-avtomatiki',       parentSlug: 'uchastok-i-landshaft', metadata: { unit: 'pcs' },      sort_order: 11 },

  // ── 11. Проектирование ──
  { name: 'Дизайн-проект интерьера',          slug: 'dizayn-proekt-interyera',          parentSlug: 'proektirovanie', metadata: { unit: 'project' },  sort_order: 1 },
  { name: 'Архитектурное проектирование',     slug: 'arkhitekturnoe-proektirovanie',    parentSlug: 'proektirovanie', metadata: { unit: 'project' },  sort_order: 2 },
  { name: 'Составление сметы',                slug: 'sostavlenie-smety',                parentSlug: 'proektirovanie', metadata: { unit: 'project' },  sort_order: 3 },
  { name: 'Авторский надзор',                 slug: 'avtorskiy-nadzor',                 parentSlug: 'proektirovanie', metadata: { unit: 'project' },  sort_order: 4 },
  { name: 'Технический надзор',               slug: 'tekhnicheskiy-nadzor',             parentSlug: 'proektirovanie', metadata: { unit: 'project' },  sort_order: 5 },
  { name: '3D-визуализация',                  slug: '3d-vizualizatsiya',                 parentSlug: 'proektirovanie', metadata: { unit: 'project' },  sort_order: 6 },

  // ── 12. Комплексные работы ──
  { name: 'Строительство дома «под ключ»',     slug: 'stroitelstvo-doma-pod-klyuch',     parentSlug: 'kompleksnye-raboty', metadata: { unit: 'project', scope: 'full' },  sort_order: 1 },
  { name: 'Ремонт квартиры «под ключ»',        slug: 'remont-kvartiry-pod-klyuch',       parentSlug: 'kompleksnye-raboty', metadata: { unit: 'project', scope: 'full' },  sort_order: 2 },
  { name: 'Ремонт ванной комнаты',             slug: 'remont-vannoy-komnaty',            parentSlug: 'kompleksnye-raboty', metadata: { unit: 'project', scope: 'room' },  sort_order: 3 },
  { name: 'Ремонт кухни',                      slug: 'remont-kukhni',                    parentSlug: 'kompleksnye-raboty', metadata: { unit: 'project', scope: 'room' },  sort_order: 4 },
  { name: 'Черновая отделка',                  slug: 'chernovaya-otdelka',               parentSlug: 'kompleksnye-raboty', metadata: { unit: 'project' },                 sort_order: 5 },
  { name: 'Чистовая отделка',                  slug: 'chistovaya-otdelka',               parentSlug: 'kompleksnye-raboty', metadata: { unit: 'project' },                 sort_order: 6 },

  // ── 13. Дополнительные услуги ──
  { name: 'Вывоз строительного мусора',       slug: 'vyvoz-stroitelnogo-musora',        parentSlug: 'dopolnitelnye-uslugi', metadata: { unit: 'project' },  sort_order: 1 },
  { name: 'Уборка после ремонта',             slug: 'uborka-posle-remonta',             parentSlug: 'dopolnitelnye-uslugi', metadata: { unit: 'project' },  sort_order: 2 },
  { name: 'Сборка мебели',                    slug: 'sborka-mebeli',                    parentSlug: 'dopolnitelnye-uslugi', metadata: { unit: 'pcs' },      sort_order: 3 },
  { name: 'Установка кондиционеров',          slug: 'ustanovka-konditsionerov',         parentSlug: 'dopolnitelnye-uslugi', metadata: { unit: 'pcs' },      sort_order: 4 },
  { name: 'Пожарная сигнализация',            slug: 'pozharnaya-signalizatsiya',        parentSlug: 'dopolnitelnye-uslugi', metadata: { unit: 'project' },  sort_order: 5 },
];

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<void> {
  console.log('🌱 Seeding categories...\n');

  // ----- 1. Upsert groups (parent_id = null) -----
  const groupIds = new Map<string, number>();

  for (const g of groups) {
    const row = await prisma.category.upsert({
      where: { slug: g.slug },
      update: { name: g.name, parent_id: null, metadata: {}, sort_order: g.sort_order },
      create: {
        name: g.name,
        slug: g.slug,
        parent_id: null,
        metadata: {},
        sort_order: g.sort_order,
      },
    });
    groupIds.set(g.slug, row.id);
    console.log(`  [group]  ${g.name}  (id=${row.id})`);
  }

  console.log(`\n  ✅ ${groups.length} groups upserted.\n`);

  // ----- 2. Upsert categories (linked to groups) -----
  for (const c of categories) {
    const parentId = groupIds.get(c.parentSlug);
    if (parentId === undefined) {
      console.warn(`  ⚠️  Parent slug "${c.parentSlug}" not found — skipping "${c.name}"`);
      continue;
    }

    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, parent_id: parentId, metadata: c.metadata, sort_order: c.sort_order },
      create: {
        name: c.name,
        slug: c.slug,
        parent_id: parentId,
        metadata: c.metadata,
        sort_order: c.sort_order,
      },
    });
    console.log(`  [cat]   ${c.name}`);
  }

  console.log(`\n  ✅ ${categories.length} categories upserted.\n`);
  console.log('🎉 Categories seeding complete!\n');

  // ----- 3. Upsert regions -----
  console.log('🌱 Seeding regions...\n');

  const regionIds = new Map<string, number>();

  for (const r of regions) {
    const row = await prisma.region.upsert({
      where: { slug: r.slug },
      update: { name: r.name, sort_order: r.sort_order },
      create: {
        name: r.name,
        slug: r.slug,
        sort_order: r.sort_order,
      },
    });
    regionIds.set(r.slug, row.id);
    console.log(`  [region] ${r.name}  (id=${row.id})`);
  }

  console.log(`\n  ✅ ${regions.length} regions upserted.\n`);

  // ----- 4. Upsert cities -----
  console.log('🌱 Seeding cities...\n');

  for (const c of cities) {
    const regionId = regionIds.get(c.regionSlug);
    if (regionId === undefined) {
      console.warn(`  ⚠️  Region slug "${c.regionSlug}" not found — skipping "${c.name}"`);
      continue;
    }

    await prisma.city.upsert({
      where: { slug: c.slug },
      update: { name: c.name, region_id: regionId, sort_order: c.sort_order },
      create: {
        name: c.name,
        slug: c.slug,
        region_id: regionId,
        sort_order: c.sort_order,
      },
    });
    console.log(`  [city]  ${c.name}`);
  }

  console.log(`\n  ✅ ${cities.length} cities upserted.\n`);
  console.log('🎉 Regions & cities seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
