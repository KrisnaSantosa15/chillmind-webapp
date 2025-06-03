"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Accessibility, 
  Eye, 
  Ear, 
  MousePointer, 
  Keyboard, 
  Smartphone, 
  Monitor, 
  Volume2, 
  Type, 
  Palette,
  Settings,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  ChevronDown
} from 'lucide-react';

export default function AccessibilityPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sections = [
    { id: 'overview', title: 'Overview', icon: Accessibility },
    { id: 'visual', title: 'Visual', icon: Eye },
    { id: 'auditory', title: 'Audio', icon: Ear },
    { id: 'motor', title: 'Motor', icon: MousePointer },
    { id: 'cognitive', title: 'Cognitive', icon: Settings },
    { id: 'assistive', title: 'Assistive Tech', icon: Smartphone },
    { id: 'feedback', title: 'Feedback', icon: MessageSquare }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-6 md:px-12 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center mb-6"
            >
              <Accessibility className="h-16 w-16 text-indigo-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                <span className="text-indigo-600">Accessibility</span> Statement
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              ChillMind is committed to ensuring mental health support is accessible to everyone, regardless of ability or disability.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center mt-6 text-sm text-muted-foreground"
            >
              <span>Last updated: June 3, 2025</span>
            </motion.div>
          </div>
        </section>        {/* Navigation Tabs */}
        <section className="sticky top-20 bg-background/95 backdrop-blur-sm border-b border-muted z-10">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            {/* Mobile Dropdown Navigation */}
            <div className="md:hidden">
              <div className="relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground bg-background border border-muted rounded-lg"
                >
                  <div className="flex items-center">
                    {(() => {
                      const currentSection = sections.find(s => s.id === activeSection);
                      const IconComponent = currentSection?.icon || Accessibility;
                      return (
                        <>
                          <IconComponent className="h-4 w-4 mr-2 text-indigo-600" />
                          {currentSection?.title || 'Overview'}
                        </>
                      );
                    })()}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileMenuOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-muted rounded-lg shadow-lg z-20">
                    {sections.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            scrollToSection(section.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                            activeSection === section.id
                              ? 'text-indigo-600 bg-indigo-50'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {section.title}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Horizontal Navigation */}
            <nav className="hidden md:flex justify-center overflow-x-auto scrollbar-hide">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeSection === section.id
                        ? 'text-indigo-600 border-indigo-600'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </section>

        {/* Content */}
        <div className="flex-1 py-12 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">            {/* Overview */}
            <motion.section
              id="overview"
              initial={{ opacity: 1, x: 0 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Accessibility className="h-6 w-6 text-indigo-600 mr-3" />
                  Our Accessibility Commitment
                </h2>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Mental health support should be accessible to everyone. We&apos;re committed to creating an inclusive platform that works for users with diverse abilities and needs.
                  </p>
                    <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Our Current Focus</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span className="text-muted-foreground">Responsive design for all devices</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span className="text-muted-foreground">Keyboard navigation support</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span className="text-muted-foreground">High contrast color schemes</span>
                        </div>
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-blue-500 mr-3" />
                          <span className="text-muted-foreground">Working toward WCAG compliance</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Our Approach</h3>
                      <div className="bg-indigo-500/10 rounded-lg p-4">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Continuous improvement based on user feedback</li>
                          <li>• Regular testing with assistive technologies</li>
                          <li>• Collaboration with accessibility experts</li>
                          <li>• Iterative design improvements</li>
                          <li>• Community-driven accessibility enhancements</li>                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Visual Accessibility */}
            <motion.section
              id="visual"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Eye className="h-6 w-6 text-blue-600 mr-3" />
                  Visual Accessibility Features
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Color and Contrast</h3>
                    <div className="space-y-4">
                      <div className="border border-muted rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Palette className="h-5 w-5 text-blue-500 mr-2" />
                          <h4 className="font-medium text-foreground">High Contrast Mode</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Enhanced color contrast ratios exceeding WCAG AA standards.</p>
                      </div>
                      <div className="border border-muted rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Eye className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-foreground">Color Independence</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Information is never conveyed through color alone.</p>
                      </div>
                      <div className="border border-muted rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Settings className="h-5 w-5 text-purple-500 mr-2" />
                          <h4 className="font-medium text-foreground">Customizable Themes</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Dark mode, light mode, and custom color schemes.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Text and Typography</h3>
                    <div className="space-y-4">
                      <div className="border border-muted rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Type className="h-5 w-5 text-indigo-500 mr-2" />
                          <h4 className="font-medium text-foreground">Scalable Text</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Text can be magnified up to 200% without loss of functionality.</p>
                      </div>
                      <div className="border border-muted rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Monitor className="h-5 w-5 text-teal-500 mr-2" />
                          <h4 className="font-medium text-foreground">Screen Reader Support</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Semantic HTML and ARIA labels for screen readers.</p>
                      </div>
                      <div className="border border-muted rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-foreground">Clear Language</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Plain language and clear instructions throughout.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Auditory Support */}
            <motion.section
              id="auditory"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Ear className="h-6 w-6 text-green-600 mr-3" />
                  Auditory Accessibility
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    We ensure that audio content is accessible to users who are deaf or hard of hearing, and provide alternatives for audio-based interactions.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-muted rounded-lg p-6">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Volume2 className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Visual Alerts</h3>
                      <p className="text-sm text-muted-foreground">All audio alerts have visual equivalents with clear iconography.</p>
                    </div>
                    <div className="border border-muted rounded-lg p-6">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Type className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Text Alternatives</h3>
                      <p className="text-sm text-muted-foreground">All audio content has text transcripts or descriptions.</p>
                    </div>
                    <div className="border border-muted rounded-lg p-6">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Settings className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Sound Controls</h3>
                      <p className="text-sm text-muted-foreground">Full control over sound settings and volume levels.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Motor Accessibility */}
            <motion.section
              id="motor"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <MousePointer className="h-6 w-6 text-orange-600 mr-3" />
                  Motor and Mobility Support
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Navigation Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Keyboard className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                        <div>
                          <h4 className="font-medium text-foreground">Full Keyboard Navigation</h4>
                          <p className="text-sm text-muted-foreground">Complete functionality without mouse or pointer device.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MousePointer className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                        <div>
                          <h4 className="font-medium text-foreground">Large Click Targets</h4>
                          <p className="text-sm text-muted-foreground">Minimum 44px touch targets for easy interaction.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Settings className="h-5 w-5 text-green-500 mr-3 mt-1" />
                        <div>
                          <h4 className="font-medium text-foreground">Customizable Interface</h4>
                          <p className="text-sm text-muted-foreground">Adjustable layouts and control preferences.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Interaction Features</h3>
                    <div className="bg-orange-500/10 rounded-lg p-6">
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          No time-sensitive actions required
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Skip links for faster navigation
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Voice control compatibility
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Switch navigation support
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Gesture alternatives available
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Cognitive Support */}
            <motion.section
              id="cognitive"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Settings className="h-6 w-6 text-purple-600 mr-3" />
                  Cognitive Accessibility
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    We design with cognitive accessibility in mind, reducing mental load and providing clear, consistent interactions.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Clear Communication</h3>
                      <div className="space-y-4">
                        <div className="border border-muted rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Simple Language</h4>
                          <p className="text-sm text-muted-foreground">Clear, jargon-free instructions and explanations.</p>
                        </div>
                        <div className="border border-muted rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Consistent Design</h4>
                          <p className="text-sm text-muted-foreground">Predictable layouts and interaction patterns.</p>
                        </div>
                        <div className="border border-muted rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Error Prevention</h4>
                          <p className="text-sm text-muted-foreground">Clear validation and helpful error messages.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Memory Support</h3>
                      <div className="space-y-4">
                        <div className="border border-muted rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Progress Indicators</h4>
                          <p className="text-sm text-muted-foreground">Clear steps and progress tracking.</p>
                        </div>
                        <div className="border border-muted rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Saved States</h4>
                          <p className="text-sm text-muted-foreground">Automatic saving prevents data loss.</p>
                        </div>
                        <div className="border border-muted rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Context Cues</h4>
                          <p className="text-sm text-muted-foreground">Visual and textual reminders for context.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Assistive Technology */}
            <motion.section
              id="assistive"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Smartphone className="h-6 w-6 text-teal-600 mr-3" />
                  Assistive Technology Compatibility
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    ChillMind is designed to work seamlessly with a wide range of assistive technologies and adaptive tools.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Screen Readers</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>NVDA</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>JAWS</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>VoiceOver</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>TalkBack</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Orca</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Voice Control</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Dragon Naturally Speaking</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Windows Speech Recognition</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Voice Control (macOS)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Voice Access (Android)</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Alternative Input</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Switch navigation</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Eye tracking</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Head pointer</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Single switch scanning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Feedback Section */}
            <motion.section
              id="feedback"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
                  Accessibility Feedback & Support
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    We&apos;re committed to continuous improvement of our accessibility features. Your feedback helps us create a more inclusive platform.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Report Accessibility Issues</h3>
                      <div className="space-y-4">
                        <div className="border border-muted rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">How to Report</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Email: accessibility@chillmind.app</li>
                            <li>• Phone: +1 (555) 123-4567</li>
                            <li>• In-app feedback form</li>
                            <li>• User support chat</li>
                          </ul>
                        </div>
                        <div className="border border-muted rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">What to Include</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Detailed description of the issue</li>
                            <li>• Your assistive technology setup</li>
                            <li>• Browser and device information</li>
                            <li>• Steps to reproduce the problem</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Our Response Commitment</h3>
                      <div className="bg-blue-500/10 rounded-lg p-6">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-blue-500 mr-3" />
                            <span className="text-sm text-muted-foreground">Response within 24 hours</span>
                          </div>
                          <div className="flex items-center">
                            <Settings className="h-5 w-5 text-green-500 mr-3" />
                            <span className="text-sm text-muted-foreground">Fix priority based on severity</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-5 w-5 text-purple-500 mr-3" />
                            <span className="text-sm text-muted-foreground">Regular updates on progress</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-teal-500 mr-3" />
                            <span className="text-sm text-muted-foreground">Testing with affected users</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">Need Accessibility Support?</h2>
              <p className="text-muted-foreground mb-6">
                Our accessibility team is here to help you get the most out of ChillMind, regardless of your abilities or the tools you use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="mailto:accessibility@chillmind.app"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Contact Accessibility Team
                </Link>
                <Link
                  href="/crisis-resources"
                  className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-600/10 transition-colors"
                >
                  Crisis Resources
                </Link>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
