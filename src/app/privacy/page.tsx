"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ChevronRight,
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  FileText,
  ChevronDown,
} from "lucide-react";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: "overview", title: "Overview", icon: Eye },
    { id: "collection", title: "Data Collection", icon: Database },
    { id: "usage", title: "How We Use Data", icon: FileText },
    { id: "sharing", title: "Data Sharing", icon: Users },
    { id: "rights", title: "Your Rights", icon: Shield },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
              <Shield className="h-16 w-16 text-indigo-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Privacy <span className="text-indigo-600">Policy</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Your mental health data deserves the highest level of protection.
              Learn how we safeguard your privacy.
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
                      const IconComponent = currentSection?.icon || Eye;
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
                        ? "text-indigo-600 border-indigo-600"
                        : "text-muted-foreground border-transparent hover:text-foreground"
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
          <div className="max-w-4xl mx-auto">
            {" "}
            {/* Overview */}
            <motion.section
              id="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Eye className="h-6 w-6 text-indigo-600 mr-3" />
                  Privacy Overview
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground mb-4">
                    At ChillMind, we understand that your mental health
                    information is deeply personal. This Privacy Policy explains
                    how we collect, use, and protect your data when you use our
                    platform.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-lg">
                      <Shield className="h-8 w-8 text-indigo-600 mb-3" />
                      <h3 className="font-semibold text-indigo-600 mb-2">
                        End-to-End Encryption
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        All your journal entries and assessment data are
                        encrypted both in transit and at rest.
                      </p>
                    </div>
                    <div className="bg-purple-500/10 p-6 rounded-lg border border-purple-500/20">
                      <Lock className="h-8 w-8 text-purple-600 mb-3" />
                      <h3 className="font-semibold text-purple-600 mb-2">
                        Zero-Knowledge
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We cannot read your personal journal entries - only you
                        have access to your private thoughts.
                      </p>
                    </div>
                    <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-500/20">
                      <Users className="h-8 w-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-blue-600 mb-2">
                        No Selling
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We never sell your data to third parties. Your mental
                        health is not a commodity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
            {/* Data Collection */}
            <motion.section
              id="collection"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                {" "}
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Database className="h-6 w-6 text-indigo-600 mr-3" />
                  What Data We Collect
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-indigo-600 pl-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Account Information
                    </h3>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Email address (for authentication)</li>
                      <li>• Name (optional, for personalization)</li>
                      <li>• Profile picture (optional)</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Mental Health Data
                    </h3>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Assessment responses (PHQ-9, GAD-7, PSS)</li>
                      <li>• Journal entries and mood tracking</li>
                      <li>• Progress metrics and trends</li>
                      <li>• AI interaction logs (anonymized)</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Technical Data
                    </h3>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Device type and browser information</li>
                      <li>• Usage patterns (for improving UX)</li>
                      <li>• Error logs (for debugging)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>
            {/* How We Use Data */}
            <motion.section
              id="usage"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                {" "}
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                  How We Use Your Data
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Primary Uses
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Generate personalized insights and recommendations
                        </span>
                      </div>
                      <div className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Track your mental health progress over time
                        </span>
                      </div>
                      <div className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Provide AI-powered emotional support
                        </span>
                      </div>
                      <div className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Improve platform features and user experience
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Data Processing
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        All data processing happens on secure, encrypted
                        servers. Machine learning models analyze patterns in
                        anonymized, aggregated data to improve mental health
                        insights while preserving individual privacy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
            {/* Data Sharing */}
            <motion.section
              id="sharing"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                {" "}
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Users className="h-6 w-6 text-indigo-600 mr-3" />
                  Data Sharing Policy
                </h2>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                    We Never Sell Your Data
                  </h3>
                  <p className="text-muted-foreground">
                    Your mental health information is never sold, rented, or
                    shared with advertisers or marketing companies.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Limited Sharing Scenarios
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-foreground">
                          Emergency Situations:
                        </span>
                        <span className="text-muted-foreground ml-2">
                          If we believe there&apos;s an imminent risk of harm,
                          we may contact emergency services.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-foreground">
                          Legal Requirements:
                        </span>
                        <span className="text-muted-foreground ml-2">
                          Only when legally compelled by court order or
                          subpoena.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-foreground">
                          Service Providers:
                        </span>
                        <span className="text-muted-foreground ml-2">
                          Encrypted data with vetted partners (hosting,
                          analytics) under strict agreements.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
            {/* Your Rights */}
            <motion.section
              id="rights"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-background border border-muted rounded-xl p-8">
                {" "}
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Shield className="h-6 w-6 text-indigo-600 mr-3" />
                  Your Privacy Rights
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border border-muted rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Access & Export
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Download all your data in a readable format at any time.
                      </p>
                    </div>
                    <div className="border border-muted rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Correction
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Update or correct any inaccurate personal information.
                      </p>
                    </div>
                    <div className="border border-muted rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Deletion
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Request complete deletion of your account and all
                        associated data.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-muted rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Portability
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Transfer your data to another service in a structured
                        format.
                      </p>
                    </div>
                    <div className="border border-muted rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Opt-out
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Disable data processing for personalization while
                        keeping your account.
                      </p>
                    </div>
                    <div className="border border-muted rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Transparency
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Request detailed information about how your data is
                        processed.
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
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our Privacy Team is here to help you understand and exercise
                your rights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {" "}
                <Link
                  href="mailto:privacy@chillmind.app"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Contact Privacy Team
                </Link>
                <Link
                  href="/data-commitment"
                  className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-500/10 transition-colors"
                >
                  View Data Commitment
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
