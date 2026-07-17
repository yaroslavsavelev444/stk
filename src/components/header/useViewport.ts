"use client";

import { useSyncExternalStore } from "react";

export interface Viewport {
	width: number;
	height: number;
}

const SERVER_VIEWPORT: Viewport = { width: 1280, height: 900 };

let snapshot: Viewport = SERVER_VIEWPORT;

function subscribe(onChange: () => void) {
	window.addEventListener("resize", onChange);
	window.addEventListener("orientationchange", onChange);
	return () => {
		window.removeEventListener("resize", onChange);
		window.removeEventListener("orientationchange", onChange);
	};
}

function getSnapshot(): Viewport {
	// В фоновой вкладке innerWidth/innerHeight равны 0 — раскладка схлопнулась бы
	// в одну колонку. Держим последние осмысленные размеры до события resize,
	// которое браузер пришлёт, когда вкладка снова станет видимой.
	const width = window.innerWidth || snapshot.width;
	const height = window.innerHeight || snapshot.height;

	// useSyncExternalStore сравнивает снапшоты по ссылке: новый объект на каждый
	// вызов увёл бы React в бесконечный рендер. Пересоздаём только при изменении.
	if (snapshot.width !== width || snapshot.height !== height) {
		snapshot = { width, height };
	}
	return snapshot;
}

const getServerSnapshot = () => SERVER_VIEWPORT;

export function useViewport(): Viewport {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
