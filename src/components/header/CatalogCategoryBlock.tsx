"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CatalogColumnEntry } from "./catalogLayout";

interface CatalogCategoryBlockProps {
	entry: CatalogColumnEntry;
	onNavigate: () => void;
}

/**
 * `relative` — обязательное: делает блок offsetParent для своих потомков, чтобы
 * замер раскладки читал offsetTop относительно блока (см. readCategoryMetrics).
 */
export function CatalogCategoryBlock({
	entry,
	onNavigate,
}: CatalogCategoryBlockProps) {
	const { item, visibleSubcategories, hiddenCount } = entry;
	const [expanded, setExpanded] = useState(false);

	// При ресайзе раскладка может сама раскрыть все подкатегории (hiddenCount
	// станет 0) — тогда обе ветки дают один и тот же список, и сбрасывать
	// осознанно раскрытую пользователем категорию не нужно.
	const subcategories = expanded ? item.subcategories : visibleSubcategories;
	const hasSubcategories = item.subcategories.length > 0;

	return (
		<div className="relative flex flex-col" data-catalog-part="block">
			<div className="mb-4">
				<Link
					href={`/catalog/${item.category.slug}`}
					onClick={onNavigate}
					className="font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors text-lg tracking-tight block"
				>
					{item.category.name}
				</Link>
				{item.category.description && (
					<p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
						{item.category.description}
					</p>
				)}
			</div>

			{hasSubcategories ? (
				<ul className="space-y-1 text-sm">
					{subcategories.map((subcategory) => (
						<li key={subcategory.id} data-catalog-part="subcategory">
							<Link
								href={`/catalog/${item.category.slug}?sub=${encodeURIComponent(subcategory.id)}`}
								onClick={onNavigate}
								className="block py-1.5 px-2 -mx-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] transition-all"
							>
								{subcategory.name}
							</Link>
						</li>
					))}

					{hiddenCount > 0 && (
						<li data-catalog-part="more">
							<button
								type="button"
								onClick={() => setExpanded((v) => !v)}
								aria-expanded={expanded}
								className="flex items-center gap-1.5 w-full py-1.5 px-2 -mx-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] transition-all text-left"
							>
								<ChevronDown
									size={14}
									className={`transition-transform ${expanded ? "rotate-180" : ""}`}
								/>
								{expanded ? "Свернуть" : `Ещё ${hiddenCount}`}
							</button>
						</li>
					)}

					<li className="pt-2" data-catalog-part="all-products">
						<Link
							href={`/catalog/${item.category.slug}`}
							onClick={onNavigate}
							className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
						>
							Все товары категории
							<ChevronRight size={13} />
						</Link>
					</li>
				</ul>
			) : (
				<Link
					href={`/catalog/${item.category.slug}`}
					onClick={onNavigate}
					className="text-[var(--primary)] font-medium inline-flex items-center gap-2 mt-2 group"
				>
					Перейти в раздел
					<ChevronRight
						size={16}
						className="group-hover:translate-x-0.5 transition"
					/>
				</Link>
			)}
		</div>
	);
}
