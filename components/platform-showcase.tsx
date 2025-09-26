import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const platforms = [
  {
    name: 'Google Calendar',
    icon: '/assets/platforms/google-calendar.svg',
    color: '#4285F4'
  },
  {
    name: 'Microsoft Teams',
    icon: '/assets/platforms/teams.svg',
    color: '#6264A7'
  },
  {
    name: 'Zoom',
    icon: '/assets/platforms/zoom.svg',
    color: '#2D8CFF'
  },
  {
    name: 'Slack',
    icon: '/assets/platforms/slack.svg',
    color: '#4A154B'
  },
  {
    name: 'Discord',
    icon: '/assets/platforms/discord.svg',
    color: '#5865F2'
  },
  {
    name: 'Webex',
    icon: '/assets/platforms/webex.svg',
    color: '#00AB50'
  },
  {
    name: 'Google Meet',
    icon: '/assets/platforms/google-meet.svg',
    color: '#00897B'
  },
  {
    name: 'Skype',
    icon: '/assets/platforms/skype.svg',
    color: '#00AFF0'
  }
];

export function PlatformShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scroll = () => {
      container.scrollTo({
        left: container.scrollLeft + 1,
        behavior: 'smooth'
      });

      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollTo({ left: 0 });
      }
    };

    const interval = setInterval(scroll, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Works with Your Favorite Platforms as an extension
        </h2>
        <div 
          ref={containerRef}
          className="flex overflow-x-hidden gap-8 py-4 px-2"
        >
          {[...platforms, ...platforms].map((platform, i) => (
            <motion.div
              key={`${platform.name}-${i}`}
              className="flex-shrink-0 flex flex-col items-center justify-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg transform hover:scale-105 transition-transform duration-200"
              style={{
                minWidth: '200px'
              }}
              whileHover={{ y: -5 }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <Image
                  src={platform.icon}
                  alt={platform.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {platform.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
