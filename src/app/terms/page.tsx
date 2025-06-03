"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {FileText, Scale, Users, AlertTriangle, CheckCircle, XCircle, RefreshCw, ChevronDown } from 'lucide-react';

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'overview', title: 'Overview', icon: FileText },
    { id: 'acceptance', title: 'Acceptance', icon: CheckCircle },
    { id: 'services', title: 'Our Services', icon: Users },
    { id: 'responsibilities', title: 'Your Responsibilities', icon: Scale },
    { id: 'prohibited', title: 'Prohibited Uses', icon: XCircle },
    { id: 'modifications', title: 'Modifications', icon: RefreshCw },
    { id: 'termination', title: 'Termination', icon: AlertTriangle }
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
            >              <Scale className="h-16 w-16 text-indigo-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Terms of <span className="text-indigo-600">Service</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Clear, fair terms that protect both you and ChillMind while ensuring the best possible mental health support.
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
                      const IconComponent = currentSection?.icon || FileText;
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
            ><div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                  Welcome to ChillMind
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    These Terms of Service (&apos;Terms&apos;) govern your use of ChillMind, a mental health monitoring platform designed specifically for students. By using our services, you agree to these terms.
                  </p>
                  <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-lg p-6">
                    <h3 className="font-semibold text-indigo-600 mb-3">Important Notice</h3>
                    <p className="text-sm">
                      ChillMind provides mental health monitoring tools and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Acceptance */}
            <motion.section
              id="acceptance"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                  Acceptance of Terms
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">By Using ChillMind, You Agree To:</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-muted-foreground">Comply with all applicable laws and regulations</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-muted-foreground">Provide accurate and complete information</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-muted-foreground">Use the platform responsibly and ethically</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-muted-foreground">Respect other users privacy and wellbeing</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Age and Eligibility</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        You must be at least 13 years old to use ChillMind. If you&apos;re under 13, you need parental consent.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Our services are primarily designed for students in educational institutions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Our Services */}
            <motion.section
              id="services"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Users className="h-6 w-6 text-indigo-600 mr-3" />
                  Our Services
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border border-muted rounded-lg p-6">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-indigo-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Mood Tracking</h3>
                    <p className="text-sm text-muted-foreground">Daily mood logging and pattern analysis to help you understand your mental health trends.</p>
                  </div>
                  <div className="border border-muted rounded-lg p-6">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Personalized Insights</h3>
                    <p className="text-sm text-muted-foreground">AI-powered recommendations and insights based on your unique patterns and preferences.</p>
                  </div>
                  <div className="border border-muted rounded-lg p-6">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Community Support</h3>
                    <p className="text-sm text-muted-foreground">Anonymous peer support and wellness challenges within our student community.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Your Responsibilities */}
            <motion.section
              id="responsibilities"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Scale className="h-6 w-6 text-indigo-600 mr-3" />
                  Your Responsibilities
                </h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Account Security</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Keep your login credentials secure and confidential</li>
                        <li>• Use strong, unique passwords</li>
                        <li>• Report suspicious activity immediately</li>
                        <li>• Log out from shared devices</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Data Accuracy</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Provide honest and accurate information</li>
                        <li>• Update your profile when circumstances change</li>
                        <li>• Report technical issues that affect data quality</li>
                        <li>• Use the platform consistently for best results</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                    <h3 className="font-semibold text-orange-600 mb-3">Crisis Situations</h3>
                    <p className="text-sm text-muted-foreground">
                      If you&apos;re experiencing a mental health crisis, please contact emergency services, a crisis hotline, or seek immediate professional help. ChillMind cannot provide emergency assistance.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Prohibited Uses */}
            <motion.section
              id="prohibited"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <XCircle className="h-6 w-6 text-red-600 mr-3" />
                  Prohibited Uses
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">You May Not:</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Share your account with others</span>
                      </div>
                      <div className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Reverse engineer or copy our technology</span>
                      </div>
                      <div className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Submit false or misleading information</span>
                      </div>
                      <div className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Attempt to access other users data</span>
                      </div>
                      <div className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Use the platform for commercial purposes</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Community Guidelines</h3>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        ChillMind is a supportive community. We strictly prohibit:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Harassment or bullying</li>
                        <li>• Sharing harmful content</li>
                        <li>• Promoting self-harm</li>
                        <li>• Spam or solicitation</li>
                        <li>• Hate speech of any kind</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Modifications */}
            <motion.section
              id="modifications"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <RefreshCw className="h-6 w-6 text-indigo-600 mr-3" />
                  Terms Modifications
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    We may update these Terms of Service from time to time to reflect changes in our services, legal requirements, or industry best practices.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-muted rounded-lg p-6">
                      <h3 className="font-semibold text-foreground mb-3">How We Notify You</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Email notification to your registered address</li>
                        <li>• In-app notification when you next login</li>
                        <li>• Updated &apos;Last modified&apos; date on this page</li>
                        <li>• 30-day advance notice for major changes</li>
                      </ul>
                    </div>
                    <div className="border border-muted rounded-lg p-6">
                      <h3 className="font-semibold text-foreground mb-3">Your Options</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Review changes before they take effect</li>
                        <li>• Contact us with questions or concerns</li>
                        <li>• Delete your account if you disagree</li>
                        <li>• Continued use means acceptance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Termination */}
            <motion.section
              id="termination"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-indigo-600 mr-3" />
                  Account Termination
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">You Can:</h3>
                    <div className="space-y-4">
                      <div className="border border-muted rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">Delete Your Account</h4>
                        <p className="text-sm text-muted-foreground">At any time, for any reason, with immediate effect.</p>
                      </div>
                      <div className="border border-muted rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">Export Your Data</h4>
                        <p className="text-sm text-muted-foreground">Download all your personal data before account deletion.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">We May Terminate If:</h3>
                    <div className="space-y-4">
                      <div className="border bg-red-500/10 border-red-500/20 rounded-lg p-4">
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• You violate these Terms of Service</li>
                          <li>• You engage in harmful behavior</li>
                          <li>• Your account remains inactive for 2+ years</li>
                          <li>• Legal requirements demand it</li>
                        </ul>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        We&apos;ll provide 30 days notice when possible, except for serious violations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}              className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
              <p className="text-muted-foreground mb-6">
                Our Legal Team is here to help clarify any aspect of our Terms of Service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="mailto:legal@chillmind.app"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Contact Legal Team
                </Link>
                <Link
                  href="/privacy"
                  className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-600/10 transition-colors"
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
