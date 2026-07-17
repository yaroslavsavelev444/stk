// src/components/header/catalogLayout.ts
//
// Раскладка мега-меню каталога.
//
// Категории и подкатегории приходят из CMS, поэтому раскладка не может опираться
// ни на их порядок, ни на количество, ни на длину названий.
//
// Почему не CSS grid: в grid высота строки равна высоте самой высокой ячейки —
// категория с 50 подкатегориями растягивает всю свою строку, а короткие соседи
// оставляют под собой пустоту. Здесь категории раскладываются по независимым
// колонкам (bin packing), и высота одной категории ни на кого не влияет.
//
// Почему замер, а не формула: высота блока зависит от переноса строк (длинное
// название категории занимает две строки, длинное название подкатегории — тоже),
// то есть от шрифта, ширины колонки и самого текста. Считать это в уме нельзя —
// браузер уже всё посчитал, поэтому реальные высоты снимаются со скрытого слоя
// замера (см. CatalogMenu), а тут используются как есть.

import type { Category, Subcategory } from "@/payload-types";

export interface CategoryWithSubcategories {
	category: Category;
	subcategories: Subcategory[];
}

/** Реальные высоты одного блока категории, снятые с DOM. */
export interface CategoryMetrics {
	/**
	 * `subcategoryBottoms[i]` — высота блока, если оборвать его сразу после
	 * (i+1)-й подкатегории. Смещения от верха блока, поэтому все внутренние
	 * отступы и переносы строк уже учтены.
	 */
	subcategoryBottoms: number[];
	/** Прирост высоты от кнопки «Ещё N». */
	moreToggleExtra: number;
	/** Прирост высоты от ссылки «Все товары категории». */
	allProductsExtra: number;
	/** Высота блока целиком — для категорий без подкатегорий. */
	bareHeight: number;
}

export type CatalogMetrics = Map<string, CategoryMetrics>;

export interface CatalogColumnEntry {
	item: CategoryWithSubcategories;
	/** Подкатегории, показанные сразу. Остальные скрыты под кнопкой «Ещё N». */
	visibleSubcategories: Subcategory[];
	hiddenCount: number;
}

export interface CatalogLayout {
	/** Каждая колонка — независимый вертикальный стек категорий. */
	columns: CatalogColumnEntry[][];
	/** Сколько подкатегорий показано у каждой категории до кнопки «Ещё». */
	subcategoryCap: number;
	/** true — не влезает даже при минимальном cap, спасает внутренний скролл. */
	overflows: boolean;
	/** Высота самой высокой колонки, px. */
	height: number;
}

/**
 * Вертикальный зазор между категориями внутри колонки и горизонтальный между
 * колонками. Задаются инлайновым стилем в CatalogMenu, поэтому значение здесь —
 * единственный источник правды и разъехаться с разметкой не может.
 */
export const COLUMN_ROW_GAP = 40;
export const COLUMN_COLUMN_GAP = 32;

/** Ниже этого показывать подкатегории бессмысленно — меню теряет смысл. */
const MIN_VISIBLE_SUBCATEGORIES = 4;

/** Совпадает с брейкпоинтом lg в разметке CatalogMenu. */
const DESKTOP_MIN_WIDTH = 1024;

/** Ширина viewport → сколько колонок помещается по горизонтали. */
export function columnsForWidth(width: number): number {
	if (width >= DESKTOP_MIN_WIDTH) return 4;
	if (width >= 768) return 3;
	if (width >= 640) return 2;
	return 1;
}

/**
 * Снимает высоты одного блока категории. Работает по offsetTop/offsetHeight, а
 * не по getBoundingClientRect: во время анимации открытия на меню висит
 * transform: scale(), и rect вернул бы масштабированные значения.
 */
export function readCategoryMetrics(block: HTMLElement): CategoryMetrics {
	const subs = block.querySelectorAll<HTMLElement>(
		'[data-catalog-part="subcategory"]',
	);
	if (subs.length === 0) {
		return {
			subcategoryBottoms: [],
			moreToggleExtra: 0,
			allProductsExtra: 0,
			bareHeight: block.offsetHeight,
		};
	}

	const bottom = (el: HTMLElement) => el.offsetTop + el.offsetHeight;
	const subcategoryBottoms = Array.from(subs, bottom);
	const lastSubBottom = subcategoryBottoms[subcategoryBottoms.length - 1];

	const moreEl = block.querySelector<HTMLElement>('[data-catalog-part="more"]');
	const allEl = block.querySelector<HTMLElement>(
		'[data-catalog-part="all-products"]',
	);

	// В слое замера порядок всегда: подкатегории → «Ещё» → «Все товары».
	const moreBottom = moreEl ? bottom(moreEl) : lastSubBottom;
	return {
		subcategoryBottoms,
		moreToggleExtra: moreBottom - lastSubBottom,
		allProductsExtra: allEl ? bottom(allEl) - moreBottom : 0,
		bareHeight: block.offsetHeight,
	};
}

/** Высота блока категории, если показать не больше `cap` подкатегорий. */
function measureCategory(
	item: CategoryWithSubcategories,
	cap: number,
	metrics: CatalogMetrics,
): number {
	const m = metrics.get(String(item.category.id));
	if (!m) return 0;

	const total = item.subcategories.length;
	if (total === 0 || m.subcategoryBottoms.length === 0) return m.bareHeight;

	const visible = Math.min(total, cap, m.subcategoryBottoms.length);
	return (
		m.subcategoryBottoms[visible - 1] +
		(total > visible ? m.moreToggleExtra : 0) +
		m.allProductsExtra
	);
}

/**
 * LPT (longest-processing-time): раскладываем категории от самой «тяжёлой» к
 * самой лёгкой, каждую — в самую низкую на текущий момент колонку.
 *
 * Даёт два нужных свойства сразу: колонки выравниваются по высоте (жадный LPT
 * гарантирует не хуже 4/3 от оптимума), а самые тяжёлые категории попадают
 * наверх колонок, то есть в первую видимую строку меню.
 */
function pack(
	items: CategoryWithSubcategories[],
	columnCount: number,
	cap: number,
	metrics: CatalogMetrics,
): { columns: CatalogColumnEntry[][]; height: number } {
	const weighted = items.map((item, index) => ({
		item,
		index,
		weight: measureCategory(item, cap, metrics),
	}));

	// index — вторичный ключ: при равных весах сохраняется порядок из CMS,
	// и раскладка остаётся детерминированной между рендерами.
	weighted.sort((a, b) => b.weight - a.weight || a.index - b.index);

	const columns: CatalogColumnEntry[][] = Array.from(
		{ length: columnCount },
		() => [],
	);
	const heights = new Array<number>(columnCount).fill(0);

	for (const { item, weight } of weighted) {
		let target = 0;
		for (let i = 1; i < columnCount; i++) {
			if (heights[i] < heights[target]) target = i;
		}

		const total = item.subcategories.length;
		const visible = Math.min(total, cap);
		columns[target].push({
			item,
			visibleSubcategories: item.subcategories.slice(0, visible),
			hiddenCount: total - visible,
		});
		heights[target] +=
			weight + (columns[target].length > 1 ? COLUMN_ROW_GAP : 0);
	}

	return { columns, height: Math.max(0, ...heights) };
}

/**
 * Подбирает раскладку под доступную высоту: ищет самый большой cap подкатегорий,
 * при котором самая высокая колонка ещё влезает в экран. Если не влезает даже
 * минимальный cap — отдаём минимальный и сообщаем `overflows`, дальше спасает
 * внутренний скролл.
 */
export function buildCatalogLayout(
	items: CategoryWithSubcategories[],
	{
		columnCount,
		availableHeight,
		metrics,
	}: {
		columnCount: number;
		availableHeight: number;
		metrics: CatalogMetrics;
	},
): CatalogLayout {
	// Не растягиваем 2 категории на 4 колонки.
	const columns = Math.max(1, Math.min(columnCount, items.length));
	if (items.length === 0) {
		return { columns: [], subcategoryCap: 0, overflows: false, height: 0 };
	}

	const maxSubcategories = items.reduce(
		(max, item) => Math.max(max, item.subcategories.length),
		0,
	);
	// Верхняя граница поиска — не ниже минимума, иначе при каталоге из одних
	// мелких категорий цикл не выполнился бы ни разу.
	const maxCap = Math.max(maxSubcategories, MIN_VISIBLE_SUBCATEGORIES);

	// Вес категории монотонно растёт по cap, поэтому первый сверху подошедший
	// cap — максимальный из подходящих.
	for (let cap = maxCap; cap > MIN_VISIBLE_SUBCATEGORIES; cap--) {
		const packed = pack(items, columns, cap, metrics);
		if (packed.height <= availableHeight) {
			return { ...packed, subcategoryCap: cap, overflows: false };
		}
	}

	const packed = pack(items, columns, MIN_VISIBLE_SUBCATEGORIES, metrics);
	return {
		...packed,
		subcategoryCap: MIN_VISIBLE_SUBCATEGORIES,
		overflows: packed.height > availableHeight,
	};
}
