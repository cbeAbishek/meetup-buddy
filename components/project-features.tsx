import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  CheckSquare, 
  FileDown, 
  ClipboardList,
  Code,
  Timer,
  Users
} from 'lucide-react';
import { Badge } from './ui/badge';

const projectFeatures = [
  {
    icon: Calendar,
    title: 'Smart Slot Finder',
    description: 'Eliminate cross-time-zone scheduling chaos with intelligent slot matching.',
    details: [
      'Automatic time slot comparison across timezones',
      'Visual calendar grid for easy slot picking',
      'Real-time availability updates',
      'Rule-based slot matching algorithm'
    ],
    tech: ['Calendar API', 'Time Zone Handling', 'JSON Data'],
    availability: {
      website: true,
      extension: false
    }
  },
  {
    icon: FileText,
    title: 'Auto Agenda Generator',
    description: 'Never start a meeting unprepared with AI-powered agenda generation.',
    details: [
      'Merge previous meeting outcomes',
      'Include sales updates and open issues',
      'AI enhancement for polished agenda bullets',
      'Editable agenda items'
    ],
    tech: ['AI/ML', 'Past Meetings Data', 'Sales Data'],
    availability: {
      website: true,
      extension: true
    }
  },
  {
    icon: CheckSquare,
    title: 'Follow-Up Tracker',
    description: 'Keep track of action items and ensure accountability.',
    details: [
      'Task assignment and ownership',
      'Deadline tracking',
      'Status toggling',
      'Kanban board view'
    ],
    tech: ['Task Management', 'CSV Processing', 'Real-time Updates'],
    availability: {
      website: true,
      extension: true
    }
  },
  {
    icon: ClipboardList,
    title: 'Summary View',
    description: 'Clear meeting outcomes with AI-enhanced summaries.',
    details: [
      'Extract key decisions and pending items',
      'AI-generated executive summaries',
      'Expandable detail views',
      'Immediate post-meeting recap'
    ],
    tech: ['Natural Language Processing', 'Meeting Data', 'AI Summarization'],
    availability: {
      website: true,
      extension: true
    }
  },
  {
    icon: FileDown,
    title: 'Document Sharing',
    description: 'Centralized document management for all meeting materials.',
    details: [
      'Easy file uploads',
      'Organized document listing',
      'Quick access to shared files',
      'Secure document storage'
    ],
    tech: ['File Storage', 'Supabase Integration', 'Access Control'],
    availability: {
      website: true,
      extension: true
    }
  }
];

export function ProjectFeatures() {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900 py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Powerful Features for Better Meetings
        </h2>
        <p className="text-lg text-center mb-16 text-gray-600 dark:text-gray-300">
          Transform your meeting experience with our comprehensive suite of tools
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="relative bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="cursor-pointer"
                onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
              >
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg mr-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <div className="flex gap-2">
                        {feature.availability.website && (
                          <Badge variant="secondary" className="text-xs">
                            Dashboard
                          </Badge>
                        )}
                        {feature.availability.extension && (
                          <Badge variant="outline" className="text-xs">
                            Extension
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {feature.tech.map((tech, i) => (
                    <Badge key={i} variant="default" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {expandedFeature === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-4 space-y-2 border-t pt-4 dark:border-gray-700">
                      {feature.details.map((detail, i) => (
                        <li 
                          key={i}
                          className="flex items-center text-gray-600 dark:text-gray-300"
                        >
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
