import { useEffect, useRef } from 'react';
import Image from 'next/image';

const platforms = [
	{ name: 'Google Calendar', icon: 'https://img.icons8.com/color/96/google-calendar--v2.png' },
	{ name: 'Microsoft Teams', icon: 'https://img.icons8.com/color/96/microsoft-teams.png' },
	{ name: 'Zoom', icon: 'https://img.icons8.com/color/96/zoom.png' },
	{ name: 'Slack', icon: 'https://img.icons8.com/color/96/slack-new.png' },
	{ name: 'Discord', icon: 'https://cdn.iconscout.com/icon/free/png-512/discord-3-569463.png' },
	{ name: 'Webex', icon: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cisco_Webex_logo_-_Brandlogos.net.svg' },
	{ name: 'Google Meet', icon: 'https://img.icons8.com/color/96/google-meet.png' },
	{ name: 'Skype', icon: 'https://img.icons8.com/color/96/skype.png' }
];

export function PlatformShowcase() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const rafRef = useRef<number | null>(null);
	// continuous scroll speed in px per second
	const speedRef = useRef<number>(80);
	const lastTimeRef = useRef<number | null>(null);
	const interactionRef = useRef(false);
	const itemAdvanceRef = useRef<number>(0);

	// duplicate list so we can reset scroll without visual jump
	const items = [...platforms, ...platforms];

	// update transforms for each child based on distance from center
	const updateTransforms = () => {
		const container = containerRef.current;
		if (!container) return;

		const center = container.scrollLeft + container.clientWidth / 2;
		const children = Array.from(container.children) as HTMLElement[];
		const maxDist = container.clientWidth / 2 + 200; // influence radius

		children.forEach((child) => {
			const childCenter = child.offsetLeft + child.offsetWidth / 2;
			const dist = Math.abs(childCenter - center);
			const t = Math.max(0, 1 - dist / maxDist); // 0..1
			const scale = 0.8 + 0.6 * t; // 0.8 -> 1.4
			const translateY = -12 * t; // lift up to 12px
			const opacity = 0.5 + 0.5 * t; // 0.5 -> 1

			child.style.transform = `translateY(${translateY}px) scale(${scale})`;
			child.style.opacity = String(opacity);
			(child.style as any).willChange = 'transform, opacity';
		});

		// Infinite loop reset: when scrolled past the first copy, jump back by half width
		if (children.length && container.scrollWidth) {
			const half = container.scrollWidth / 2;
			if (container.scrollLeft >= half) {
				// subtract half to loop seamlessly
				container.scrollLeft = container.scrollLeft - half;
			}
		}
	};

	// requestAnimationFrame loop for smooth updates on scroll
	const onScroll = () => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = requestAnimationFrame(updateTransforms);
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// initial transforms after children mount
		setTimeout(() => {
			updateTransforms();
		}, 50);

		let running = true;
		// continuous linear auto-scroll using rAF
		const animate = (time: number) => {
			if (!running) return;
			if (!lastTimeRef.current) lastTimeRef.current = time;
			const delta = (time - lastTimeRef.current) / 1000; // seconds
			lastTimeRef.current = time;

			// linear increment of scrollLeft
			container.scrollLeft += speedRef.current * delta;

			// Infinite loop reset: when scrolled past the first copy, jump back by half width
			if (container.scrollWidth) {
				const half = container.scrollWidth / 2;
				if (container.scrollLeft >= half) {
					container.scrollLeft = container.scrollLeft - half;
					// avoid a large delta on the next frame that can cause visible jump
					lastTimeRef.current = time;
				}
			}

			updateTransforms();
			rafRef.current = requestAnimationFrame(animate);
		};

		rafRef.current = requestAnimationFrame(animate);

		// keep updating on resize
		window.addEventListener('resize', updateTransforms);

		return () => {
			running = false;
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			window.removeEventListener('resize', updateTransforms);
		};
	}, []);

	return (
		<div className="w-full overflow-hidden py-16">
			<div className="container mx-auto px-4">
				

				<div
					ref={containerRef}
					className="flex overflow-x-auto gap-8 py-4 px-2"
					style={{ scrollbarWidth: 'none' }}
					aria-label="Platform carousel"
				>
					{items.map((platform, i) => (
						<div
							key={`${platform.name}-${i}`}
							className="flex-shrink-0 flex flex-col items-center justify-center"
							style={{ minWidth: 180, transition: 'transform 200ms ease, opacity 350ms ease' }}
						>
							<div className="w-16 h-16 flex items-center justify-center mb-2">
                <br />
                <br />
								<Image
									src={platform.icon}
									alt={platform.name}
									width={56}
									height={56}
									className="object-contain"
									loading="lazy"
								/>
							</div>
							<div className="text-sm text-center">{platform.name}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
