import { toasts } from 'svelte-toasts';

export function getTimeFromOrToNow(date: Date, future: boolean) {
	let currentDate = new Date();

	let timeDiff = future ? date.getTime() - currentDate.getTime() : currentDate.getTime() - date.getTime();

	let years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
	let months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30.327) /*avg no of days in month*/);
	let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
	return { years, months, days, hours, minutes, seconds };
}

export function infoToast(title: string, description: string = '') {
	toasts.info({
		title,
		description
	});
}

export function successToast(title: string, description: string = '') {
	toasts.success({
		title,
		description
	});
}

export const vw2px = (vw: number, windowWidth: number) => vw * 0.01 * windowWidth;
export const rem2px = (rem: number) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
export const vw2rem = (vw: number, windowWidth: number) => (vw * (windowWidth * 0.01)) / rem2px(1);
export const px2rem = (px: number) => px / parseFloat(getComputedStyle(document.documentElement).fontSize);
export const rem2vw = (rem: number, windowWidth: number) => rem * (rem2px(1) / (windowWidth * 0.01));
