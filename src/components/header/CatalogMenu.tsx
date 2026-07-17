"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LayoutGrid, X } from "lucide-react";
import Link from "next/link";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { CatalogCategoryBlock } from "./CatalogCategoryBlock";
import {
	buildCatalogLayout,
	type CatalogMetrics,
	type CategoryWithSubcategories,
	COLUMN_COLUMN_GAP,
	COLUMN_ROW_GAP,
	columnsForWidth,
	readCategoryMetrics,
} from "./catalogLayout";
import { useViewport } from "./useViewport";

export type { CategoryWithSubcategories } from "./catalogLayout";

interface CatalogMenuProps {
	items: CategoryWithSubcategories[];
}

/** Отступ карточки меню от нижнего края экрана. */
const BOTTOM_MARGIN = 16;

interface Geometry {
	metrics: CatalogMetrics;
	availableHeight: number;
}

export function CatalogMenu({ items }: CatalogMenuProps) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLDivElement>(null);
	const [menuTop, setMenuTop] = useState(0);
	const [geometry, setGeometry] = useState<Geometry | null>(null);
	const viewport = useViewport();

	const close = useCallback(() => setOpen(false), []);

	const updatePosition = useCallback(() => {
		if (!triggerRef.current) return;
		const rect = triggerRef.current.getBoundingClientRect();
		setMenuTop(rect.bottom);
	}, []);

	// Обновление позиции
	useEffect(() => {
		if (!open) return;
		updatePosition();
		const observer = new ResizeObserver(updatePosition);
		if (triggerRef.current) observer.observe(triggerRef.current);
		window.addEventListener("resize", updatePosition);

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", updatePosition);
		};
	}, [open, updatePosition]);

	// Закрытие по клику вне
	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				close();
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open, close]);

	// Закрытие по Escape
	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
				triggerRef.current?.focus();
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [open, close]);

	const columnCount = Math.max(
		1,
		Math.min(columnsForWidth(viewport.width), items.length || 1),
	);

	// Замер: первый проход рендерит только скрытый слой замера, здесь с него
	// снимаются реальные высоты, и до отрисовки происходит второй проход — уже с
	// разложенными колонками. useLayoutEffect (а не useEffect) — чтобы
	// пользователь не увидел промежуточное состояние.
	//
	// items, columnCount и viewport.width в теле не читаются, но именно они
	// определяют, что и какой ширины отрисовано в слое замера. Эффект читает
	// результат из DOM, поэтому без этих зависимостей высоты остались бы от
	// прошлого набора данных или брейкпоинта.
	// biome-ignore lint/correctness/useExhaustiveDependencies: эффект читает из DOM то, что отрисовано по items/columnCount/viewport.width
	useLayoutEffect(() => {
		if (!open) {
			setGeometry(null);
			return;
		}
		const layer = measureRef.current;
		const card = cardRef.current;
		const scroller = scrollerRef.current;
		if (!layer || !card || !scroller) return;

		const metrics: CatalogMetrics = new Map();
		for (const block of layer.querySelectorAll<HTMLElement>(
			"[data-measure-category]",
		)) {
			const id = block.dataset.measureCategory;
			if (id) metrics.set(id, readCategoryMetrics(block));
		}

		// Обвязка вокруг скроллера (шапка, футер, рамки) не зависит от контента:
		// обе высоты включают скроллер целиком, и он сокращается.
		const chromeAroundScroller = card.offsetHeight - scroller.offsetHeight;
		const scrollerStyle = getComputedStyle(scroller);
		const scrollerPadding =
			Number.parseFloat(scrollerStyle.paddingTop) +
			Number.parseFloat(scrollerStyle.paddingBottom);
		const cardMaxHeight = viewport.height - menuTop - BOTTOM_MARGIN;

		setGeometry({
			metrics,
			availableHeight: Math.max(
				0,
				cardMaxHeight - chromeAroundScroller - scrollerPadding,
			),
		});
		// Перенос строк зависит от ширины колонки, поэтому замер повторяется при
		// смене ширины экрана и числа колонок.
	}, [open, items, columnCount, viewport.width, viewport.height, menuTop]);

	const layout = useMemo(
		() =>
			geometry
				? buildCatalogLayout(items, {
						columnCount,
						availableHeight: geometry.availableHeight,
						metrics: geometry.metrics,
					})
				: null,
		[items, columnCount, geometry],
	);

	return (
		<div ref={containerRef} className="relative z-[100]">
			{/* Trigger Button */}
			<button
				type="button"
				ref={triggerRef}
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-haspopup="dialog"
				aria-label="Открыть каталог"
				className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
          transition-all duration-200 select-none focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40
          ${
						open
							? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
							: "bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white hover:shadow-md hover:shadow-[var(--primary)]/20"
					}
        `}
			>
				<LayoutGrid size={18} strokeWidth={2.2} />
				<span>Каталог</span>
				<motion.span
					animate={{ rotate: open ? 90 : 0 }}
					transition={{ duration: 0.2 }}
					className="opacity-70"
				>
					<ChevronRight size={16} strokeWidth={2.5} />
				</motion.span>
			</button>

			{/* Mega Menu Dropdown */}
			<AnimatePresence>
				{open && (
					<>
						{/* Mobile Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-[90] lg:hidden"
							onClick={close}
						/>

						{/* Outer container */}
						<div
							className="fixed z-[100]"
							style={{
								top: menuTop,
								left: "50%",
								transform: "translateX(-50%)",
								width: "95vw",
								maxWidth: "1280px",
							}}
						>
							<motion.div
								ref={cardRef}
								initial={{ opacity: 0, y: -20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -20, scale: 0.95 }}
								transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
								className="
                  bg-white
                  rounded-3xl
                  border border-[var(--border)]
                  shadow-2xl shadow-black/10
                  overflow-hidden
                  flex flex-col
                "
								style={{
									transformOrigin: "top center",
									// Жёсткая страховка на всех брейкпоинтах: раскладка ужимает
									// контент, но пользователь ещё может раскрыть «Ещё N».
									maxHeight: `calc(100dvh - ${menuTop}px - ${BOTTOM_MARGIN}px)`,
								}}
							>
								{/* Mobile Header */}
								<div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--border-light)]">
									<div className="font-semibold text-lg">Каталог</div>
									<button type="button" onClick={close} className="p-2 -mr-2">
										<X size={22} />
									</button>
								</div>

								{/* Main Scrollable Content */}
								<div
									ref={scrollerRef}
									className="flex-1 overflow-y-auto overscroll-contain p-6 lg:p-10 touch-pan-y"
								>
									<div className="relative">
										{/* Колонки — независимые стеки: высота одной категории
										    больше не влияет на соседние, как это было в CSS grid. */}
										<div
											className="flex items-start"
											style={{ columnGap: COLUMN_COLUMN_GAP }}
										>
											{layout?.columns.map((column) => (
												<div
													key={column[0]?.item.category.id ?? "empty"}
													className="flex-1 min-w-0 flex flex-col"
													style={{ rowGap: COLUMN_ROW_GAP }}
												>
													{column.map((entry) => (
														<CatalogCategoryBlock
															key={entry.item.category.id}
															entry={entry}
															onNavigate={close}
														/>
													))}
												</div>
											))}
										</div>

										{/* Слой замера: те же блоки, в той же ширине колонки, но
										    скрытые. visibility: hidden сохраняет вёрстку (в отличие
										    от display: none) и убирает содержимое из таб-порядка.
										    h-0 + overflow-hidden обязательны: абсолютный элемент всё
										    равно расширяет scrollHeight скроллера, и без клипа слой
										    замера порождал бы фантомную полосу прокрутки. */}
										<div
											aria-hidden
											className="absolute top-0 left-0 w-full h-0 overflow-hidden invisible pointer-events-none"
										>
											<div
												ref={measureRef}
												style={{
													width: `calc((100% - ${(columnCount - 1) * COLUMN_COLUMN_GAP}px) / ${columnCount})`,
												}}
											>
												{items.map((item) => (
													<div
														key={item.category.id}
														data-measure-category={String(item.category.id)}
													>
														<CatalogCategoryBlock
															entry={{
																item,
																// Полный список + принудительная кнопка «Ещё»:
																// один проход даёт высоты для любого cap.
																visibleSubcategories: item.subcategories,
																hiddenCount: 1,
															}}
															onNavigate={close}
														/>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>

								{/* Footer Bar */}
								<div className="border-t border-[var(--border-light)] bg-[var(--surface)] px-6 py-4 flex justify-center">
									<Link
										href="/catalog"
										onClick={close}
										className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] font-medium text-sm transition-all"
									>
										<LayoutGrid size={17} />
										Посмотреть весь каталог
									</Link>
								</div>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
