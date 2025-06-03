"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Lock, Eye, UserX, Database, Zap, Heart, Award, ChevronDown } from 'lucide-react';

export default function DataCommitment() {
  const [activeSection, setActiveSection] = useState('promise');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'promise', title: 'Our Promise', icon: Heart },
    { id: 'principles', title: 'Core Principles', icon: Award },
    { id: 'protection', title: 'Data Protection', icon: Shield },
    { id: 'minimization', title: 'Data Minimization', icon: Eye },
    { id: 'transparency', title: 'Transparency', icon: Database },
    { id: 'control', title: 'Your Control', icon: UserX }
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
        {/* Hero Section */}        <section className="relative py-20 px-6 md:px-12 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center mb-6"
            >
              <Heart className="h-16 w-16 text-indigo-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Data <span className="text-indigo-600">Commitment</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Our solemn promise to protect, respect, and empower you through ethical data practices in mental health care.
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
                      const IconComponent = currentSection?.icon || Heart;
                      return (
                        <>
                          <IconComponent className="h-4 w-4 mr-2 text-indigo-600" />
                          {currentSection?.title || 'Our Promise'}
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
          <div className="max-w-4xl mx-auto">            {/* Our Promise */}
            <motion.section
              id="promise"
              initial={{ opacity: 1, x: 0 }}
              className="mb-16"
            ><div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10  rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Heart className="h-6 w-6 text-indigo-600 mr-3" />
                  Our Sacred Promise to You
                </h2>
                <div className="space-y-6">
                  <div className="text-lg text-muted-foreground leading-relaxed">
                    <p className="mb-4">
                      At ChillMind, we understand that mental health data is among the most sensitive and personal information you can share. We don&apos;t take this responsibility lightly.
                    </p>
                    <p>
                      This Data Commitment goes beyond legal compliance—it&apos;s our ethical pledge to treat your mental health journey with the respect, protection, and care it deserves.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Protected</h3>
                      <p className="text-sm text-muted-foreground">Military-grade encryption and zero-knowledge architecture</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Transparent</h3>
                      <p className="text-sm text-muted-foreground">Clear, honest communication about data use</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserX className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Empowering</h3>
                      <p className="text-sm text-muted-foreground">Complete control over your data and privacy</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Core Principles */}
            <motion.section
              id="principles"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Award className="h-6 w-6 text-indigo-600 mr-3" />
                  Core Data Principles
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="border-l-4 border-indigo-500 pl-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Purpose Limitation</h3>
                      <p className="text-muted-foreground">We only collect and use data for mental health monitoring and improvement—never for advertising, profiling, or commercial exploitation.</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Data Minimization</h3>
                      <p className="text-muted-foreground">We collect only the minimum data necessary to provide personalized mental health insights and support.</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Consent First</h3>
                      <p className="text-muted-foreground">Every piece of data collection requires your explicit, informed consent. You can withdraw consent at any time.</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="border-l-4 border-pink-500 pl-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">User Empowerment</h3>
                      <p className="text-muted-foreground">You own your data. You can view, export, correct, or delete it at any time without losing access to our services.</p>
                    </div>
                    <div className="border-l-4 border-indigo-400 pl-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Ethical AI</h3>
                      <p className="text-muted-foreground">Our AI models are trained ethically, with bias detection and human oversight to ensure fair and beneficial outcomes.</p>
                    </div>
                    <div className="border-l-4 border-purple-400 pl-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Selling, Ever</h3>
                      <p className="text-muted-foreground">We will never sell, rent, or trade your personal data. Your mental health information is not a commodity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Data Protection */}
            <motion.section
              id="protection"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Shield className="h-6 w-6 text-indigo-600 mr-3" />
                  Advanced Data Protection
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Technical Safeguards</h3>
                    <div className="space-y-4">                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center mr-3 mt-1">
                          <Lock className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">End-to-End Encryption</h4>
                          <p className="text-sm text-muted-foreground">AES-256 encryption from your device to our servers</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mr-3 mt-1">
                          <Database className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Zero-Knowledge Architecture</h4>
                          <p className="text-sm text-muted-foreground">We can&apos;t access your raw emotional data</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mr-3 mt-1">
                          <Zap className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Secure Infrastructure</h4>
                          <p className="text-sm text-muted-foreground">ISO 27001 certified data centers with 24/7 monitoring</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Operational Security</h3>                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                          Regular security audits by third-party experts
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                          Employee background checks and confidentiality agreements
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                          Principle of least privilege access controls
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                          Incident response team available 24/7
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Automated threat detection and response
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Data Minimization */}
            <motion.section
              id="minimization"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Eye className="h-6 w-6 text-teal-600 mr-3" />
                  Smart Data Minimization
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    We believe the best data protection is not collecting unnecessary data in the first place. Our platform is designed to provide maximum benefit with minimum data.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-muted rounded-lg p-6">
                      <h3 className="font-semibold mb-3 text-green-600">What We Collect</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Mood ratings and emotional states</li>
                        <li>• Activity and sleep patterns</li>
                        <li>• Stress level indicators</li>
                        <li>• Anonymous usage analytics</li>
                      </ul>
                    </div>
                    <div className="border border-muted rounded-lg p-6">
                      <h3 className="font-semibold mb-3 text-red-600">What We Don&apos;t Collect</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Detailed personal conversations</li>
                        <li>• Financial information</li>
                        <li>• Location tracking</li>
                        <li>• Contact lists or social graphs</li>
                      </ul>
                    </div>
                    <div className="border border-muted rounded-lg p-6">
                      <h3 className="font-semibold mb-3 text-blue-600">How We Protect</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Automatic data anonymization</li>
                        <li>• Regular data purging</li>
                        <li>• Aggregated insights only</li>
                        <li>• No cross-platform tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Transparency */}
            <motion.section
              id="transparency"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Database className="h-6 w-6 text-indigo-600 mr-3" />
                  Radical Transparency
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Open Communication</h3>
                    <div className="space-y-4">
                      <div className="bg-indigo-500/10 rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">Real-Time Privacy Dashboard</h4>
                        <p className="text-sm text-muted-foreground">Monitor exactly what data we have and how it&apos;s being used in real-time.</p>
                      </div>
                      <div className="bg-purple-500/10 rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">Monthly Transparency Reports</h4>
                        <p className="text-sm text-muted-foreground">Regular updates on our data practices, security incidents, and policy changes.</p>
                      </div>
                      <div className="bg-blue-500/10 rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">Open Source Commitment</h4>
                        <p className="text-sm text-muted-foreground">Key privacy and security components of our code are open for public audit.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Data Journey Visualization</h3>
                    <div className="space-y-4">                      <div className="flex items-center p-3 bg-muted rounded-lg">
                        <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-bold text-indigo-600">1</span>
                        </div>
                        <span className="text-sm text-muted-foreground">You log your mood</span>
                      </div>
                      <div className="flex items-center p-3 bg-muted rounded-lg">
                        <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-bold text-indigo-600">2</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Data is encrypted locally</span>
                      </div>
                      <div className="flex items-center p-3 bg-muted rounded-lg">
                        <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-bold text-indigo-600">3</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Anonymized for analysis</span>
                      </div>
                      <div className="flex items-center p-3 bg-muted rounded-lg">
                        <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-bold text-indigo-600">4</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Insights delivered to you</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Your Control */}
            <motion.section
              id="control"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <UserX className="h-6 w-6 text-indigo-600 mr-3" />
                  Your Data, Your Control
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Granular Controls</h3>
                    <div className="space-y-3">                      <div className="flex items-center justify-between p-3 border border-muted rounded-lg">
                        <span className="text-sm font-medium text-foreground">Mood Analysis</span>
                        <div className="w-10 h-6 bg-indigo-500 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-muted rounded-lg">
                        <span className="text-sm font-medium text-foreground">Pattern Recognition</span>
                        <div className="w-10 h-6 bg-indigo-500 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-muted rounded-lg">
                        <span className="text-sm font-medium text-foreground">Personalized Recommendations</span>
                        <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-muted rounded-lg">
                        <span className="text-sm font-medium text-foreground">Anonymous Research</span>
                        <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Powerful Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="border border-muted rounded-lg p-4 text-left hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-foreground text-sm">Export Data</h4>
                        <p className="text-xs text-muted-foreground mt-1">Download everything</p>
                      </button>
                      <button className="border border-muted rounded-lg p-4 text-left hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-foreground text-sm">Pause Processing</h4>
                        <p className="text-xs text-muted-foreground mt-1">Temporary stop</p>
                      </button>
                      <button className="border border-muted rounded-lg p-4 text-left hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-foreground text-sm">Selective Delete</h4>
                        <p className="text-xs text-muted-foreground mt-1">Remove specific data</p>
                      </button>
                      <button className="border border-red-500/10 bg-red-500/10 rounded-lg p-4 text-left hover:bg-red-500/20 transition-colors">
                        <h4 className="font-medium text-red-600 text-sm">Delete Everything</h4>
                        <p className="text-xs text-red-500 mt-1">Complete removal</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Contact Section */}            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Data, Your Voice</h2>
              <p className="text-muted-foreground mb-6">
                Have questions about our data practices? Want to exercise your rights? We&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="mailto:data@chillmind.app"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Contact Data Team
                </Link>
                <Link
                  href="/privacy"
                  className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-500/10 transition-colors"
                >
                  View Privacy Policy
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
