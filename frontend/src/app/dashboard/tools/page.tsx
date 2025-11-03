'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Workflow,
  MapPin,
  MessageSquare,
  Mail,
  ExternalLink,
  Eye,
  Search,
} from 'lucide-react';
import {
  EmptyState,
  FormModal,
  ViewField,
} from '@/components/dashboard';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  type: 'web' | 'download' | 'workflow';
  link?: string;
  downloads?: {
    platform: string;
    file: string;
    label: string;
  }[];
  features: string[];
  category: string;
}

export default function ToolsPage() {
  const [tools] = useState<Tool[]>([
    {
      id: 'google-maps-scraper',
      title: 'Google Maps Scraper',
      description: 'Search with keywords and export business data to Excel from Google Maps',
      icon: MapPin,
      color: 'blue',
      type: 'web',
      link: 'http://165.22.164.180:8000/',
      category: 'Data Collection',
      features: [
        'Search by keyword',
        'Export to Excel',
        'Business details extraction',
        'Location data'
      ]
    },
    {
      id: 'whatsapp-bulk-messenger',
      title: 'WhatsApp Bulk Messenger',
      description: 'Desktop application for sending bulk WhatsApp messages',
      icon: MessageSquare,
      color: 'green',
      type: 'download',
      category: 'Communication',
      downloads: [
        {
          platform: 'macOS',
          file: 'https://drive.google.com/file/d/1Y662cSX9gZDwAu_LelT1GPoFXF8boDFZ/view?usp=sharing',
          label: 'Download for macOS'
        },
        {
          platform: 'Windows',
          file: 'https://drive.google.com/file/d/1fVB8p_Z8NH84HnWHYvQTlLArSsUDDqZ0/view?usp=sharing',
          label: 'Download for Windows'
        }
      ],
      features: [
        'Bulk message sending',
        'Contact management',
        'Message templates',
        'Cross-platform support'
      ]
    },
    {
      id: 'email-automation',
      title: 'Email Automation (n8n)',
      description: 'Automated email summarization, reply generation, and Google Sheets integration',
      icon: Mail,
      color: 'purple',
      type: 'workflow',
      category: 'Automation',
      downloads: [
        {
          platform: 'n8n Workflow',
          file: 'https://drive.google.com/file/d/1XwkYtvDbNroa8ZzoQZ8GuxCIgUGxiPSJ/view?usp=sharing',
          label: 'Download Workflow JSON'
        }
      ],
      features: [
        'Email summarization with AI',
        'Automatic reply generation',
        'Google Sheets integration',
        'Gmail automation'
      ]
    }
  ]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const openViewModal = (tool: Tool) => {
    setSelectedTool(tool);
    setShowViewModal(true);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          border: 'border-blue-200'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700',
          border: 'border-green-200'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          icon: 'text-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700',
          border: 'border-purple-200'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-100',
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          border: 'border-yellow-200'
        };
      case 'red':
        return {
          bg: 'bg-red-100',
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700',
          border: 'border-red-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700',
          border: 'border-gray-200'
        };
    }
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="font-bold text-gray-900 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-primary" />
          Company Tools
        </h1>
        <p className="text-gray-600 text-xs mt-0.5">
          Essential tools and applications for business operations
        </p>
      </div>

      {/* Tools Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const colors = getColorClasses(tool.color);

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Card Header */}
              <div className={`${colors.bg} p-4 border-b border-gray-200`}>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white rounded-lg shadow-sm">
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-800 truncate">{tool.title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{tool.category}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {tool.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Features:</h4>
                  <ul className="space-y-1.5">
                    {tool.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`}></span>
                        {feature}
                      </li>
                    ))}
                    {tool.features.length > 3 && (
                      <li className="text-xs text-gray-500 italic">
                        +{tool.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {tool.type === 'web' && tool.link && (
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full px-3 py-2 ${colors.button} text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Tool
                    </a>
                  )}

                  {(tool.type === 'download' || tool.type === 'workflow') && tool.downloads && (
                    <>
                      {tool.downloads.map((download, idx) => (
                        <a
                          key={idx}
                          href={download.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full px-3 py-2 ${colors.button} text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          {download.label}
                        </a>
                      ))}
                    </>
                  )}

                  <button
                    onClick={() => openViewModal(tool)}
                    className="w-full px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {tools.length === 0 && (
        <EmptyState
          icon={Search}
          title="No tools found"
          description="Try adjusting your search or filters"
        />
      )}

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-blue-600" />
          About These Tools
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          These tools are designed to streamline your business operations. The Google Maps Scraper helps you gather business data for lead generation.
          WhatsApp Bulk Messenger enables efficient customer communication at scale. The Email Automation workflow uses AI to summarize incoming emails,
          generate responses, and automatically update your Google Sheets for seamless workflow management.
        </p>
      </motion.div>

      {/* View Modal */}
      <FormModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        mode="view"
        title="Tool Details"
        icon={Eye}
        maxWidth="md"
      >
        {selectedTool && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 ${getColorClasses(selectedTool.color).bg} rounded-lg`}>
                {(() => {
                  const Icon = selectedTool.icon;
                  return <Icon className={`w-8 h-8 ${getColorClasses(selectedTool.color).icon}`} />;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedTool.title}</h3>
                <p className="text-sm text-gray-600">{selectedTool.category}</p>
              </div>
            </div>

            <ViewField label="Description" value={selectedTool.description} />

            <ViewField
              label="Type"
              value={
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
                  {selectedTool.type === 'web' ? 'Web Application' : selectedTool.type === 'download' ? 'Desktop Application' : 'Workflow'}
                </span>
              }
            />

            <ViewField
              label="Features"
              value={
                <ul className="space-y-2 mt-2">
                  {selectedTool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className={`w-2 h-2 rounded-full ${getColorClasses(selectedTool.color).bg}`}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              }
            />

            {selectedTool.type === 'web' && selectedTool.link && (
              <div className="mt-4">
                <a
                  href={selectedTool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full px-4 py-2 ${getColorClasses(selectedTool.color).button} text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Tool
                </a>
              </div>
            )}

            {(selectedTool.type === 'download' || selectedTool.type === 'workflow') && selectedTool.downloads && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Downloads:</h4>
                {selectedTool.downloads.map((download, idx) => (
                  <a
                    key={idx}
                    href={download.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full px-4 py-2 ${getColorClasses(selectedTool.color).button} text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {download.label}
                  </a>
                ))}
              </div>
            )}

            {selectedTool.type === 'workflow' && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-900">
                  <span className="font-semibold">Setup Instructions:</span> Download the JSON file and import it into your n8n instance to set up the email automation workflow.
                </p>
              </div>
            )}
          </>
        )}
      </FormModal>
    </div>
  );
}
