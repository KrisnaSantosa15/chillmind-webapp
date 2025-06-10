"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Phone,
  MessageSquare,
  Globe,
  Heart,
  Clock,
  Users,
  MapPin,
  Star,
  ChevronDown,
} from "lucide-react";

export default function CrisisResources() {
  const [activeRegion, setActiveRegion] = useState("indonesia");
  const [activeCategory, setActiveCategory] = useState("emergency");
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const regions = [
    { id: "global", name: "Global", flag: "🌍" },
    { id: "us", name: "United States", flag: "🇺🇸" },
    { id: "uk", name: "United Kingdom", flag: "🇬🇧" },
    { id: "indonesia", name: "Indonesia", flag: "🇮🇩" },
    { id: "other", name: "Other Countries", flag: "🌐" },
  ];

  const categories = [
    { id: "emergency", name: "Emergency Crisis", icon: Phone, color: "red" },
    { id: "suicide", name: "Suicide Prevention", icon: Heart, color: "purple" },
    { id: "chat", name: "Text & Chat", icon: MessageSquare, color: "blue" },
    {
      id: "specialty",
      name: "Specialized Support",
      icon: Users,
      color: "green",
    },
  ];

  const emergencyResources: Record<
    string,
    Array<{
      name: string;
      number: string;
      description: string;
      available: string;
      type: string;
      website?: string;
    }>
  > = {
    global: [
      {
        name: "Emergency Services",
        number: "911 / 112 / 999",
        description:
          "Immediate emergency response for life-threatening situations",
        available: "24/7",
        type: "emergency",
      },
    ],
    us: [
      {
        name: "National Suicide Prevention Lifeline",
        number: "988",
        description:
          "Free, confidential crisis support for people in distress and prevention resources",
        available: "24/7",
        type: "suicide",
        website: "https://suicidepreventionlifeline.org",
      },
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "Free, 24/7 support for people in crisis via text message",
        available: "24/7",
        type: "chat",
        website: "https://crisistextline.org",
      },
      {
        name: "SAMHSA National Helpline",
        number: "1-800-662-4357",
        description:
          "Treatment referral and information service for mental health and substance abuse",
        available: "24/7",
        type: "specialty",
      },
    ],
    uk: [
      {
        name: "Samaritans",
        number: "116 123",
        description:
          "Free emotional support for anyone in emotional distress or struggling to cope",
        available: "24/7",
        type: "suicide",
        website: "https://samaritans.org",
      },
      {
        name: "NHS 111",
        number: "111",
        description:
          "Free medical help and advice when it's not a 999 emergency",
        available: "24/7",
        type: "emergency",
      },
      {
        name: "Shout Crisis Text Line",
        number: "Text SHOUT to 85258",
        description:
          "Free, confidential, 24/7 text support service for anyone in crisis",
        available: "24/7",
        type: "chat",
        website: "https://giveusashout.org",
      },
    ],
    indonesia: [
      {
        name: "Ibunda.id",
        number: "Chat via Website",
        description:
          "Platform konseling online dengan psikolog profesional untuk ibu dan keluarga",
        available: "24/7",
        type: "specialty",
        website: "https://ibunda.id",
      },
      {
        name: "Bicarakan.id",
        number: "Chat via Website",
        description: "Platform konseling online dan dukungan kesehatan mental",
        available: "24/7",
        type: "chat",
        website: "https://bicarakan.id",
      },
      {
        name: "Yayasan Pulih",
        number: "021-788-42580",
        description: "Layanan konseling trauma dan kesehatan mental",
        available: "Senin-Jumat 09:00-17:00",
        type: "specialty",
        website: "https://yayasanpulih.org",
      },
      {
        name: "Pijar Psikologi",
        number: "Chat via WhatsApp",
        description: "Konseling psikologi online melalui chat dan video call",
        available: "24/7",
        type: "chat",
        website: "https://pijarpsikologi.org",
      },
      {
        name: "Rumah Sakit Jiwa Dr. Soeharto Heerdjan",
        number: "021-5682841",
        description: "Layanan darurat kesehatan jiwa dan psikiatri",
        available: "24/7",
        type: "emergency",
      },
      {
        name: "IPK Indonesia",
        number: "Contact via Website",
        description:
          "Ikatan Psikolog Klinis Indonesia - direktori psikolog dan layanan konseling",
        available: "Jam kerja",
        type: "suicide",
        website: "https://www.ipkindonesia.or.id/",
      },
    ],
  };

  const filteredResources =
    emergencyResources[activeRegion]?.filter((resource) =>
      activeCategory === "emergency" ? true : resource.type === activeCategory
    ) || [];

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen pt-20">
        {/* Hero Section */}{" "}
        <section className="relative py-20 px-6 md:px-12 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10">
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
                Crisis <span className="text-indigo-600">Resources</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Immediate help is available. You are not alone, and your life has
              value. Reach out for support when you need it most.
            </motion.p>
            {/* Emergency Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-indigo-600 text-white rounded-xl p-6 mt-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center mb-3">
                <Phone className="h-6 w-6 mr-2" />
                <span className="font-bold text-lg">In Immediate Danger?</span>
              </div>
              <p className="text-indigo-100 mb-4">
                If you are in immediate danger or thinking of harming yourself,
                please call emergency services right away.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:112"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors"
                >
                  Call 112 (International Emergency)
                </a>
                <a
                  href="tel:119"
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-400 transition-colors"
                >
                  Call 119 (Indonesia Mental Health)
                </a>
              </div>
            </motion.div>
          </div>
        </section>{" "}
        {/* Region Selector */}
        <section className="sticky top-20 bg-background/95 backdrop-blur-sm border-b border-muted z-10">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                Select Your Region:
              </h2>

              {/* Mobile Region Dropdown */}
              <div className="sm:hidden w-full">
                <div className="relative">
                  <button
                    onClick={() => setRegionMenuOpen(!regionMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground bg-background border border-muted rounded-lg"
                  >
                    <div className="flex items-center">
                      {(() => {
                        const currentRegion = regions.find(
                          (r) => r.id === activeRegion
                        );
                        return (
                          <>
                            <span className="mr-2">{currentRegion?.flag}</span>
                            {currentRegion?.name || "Indonesia"}
                          </>
                        );
                      })()}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        regionMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {regionMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-muted rounded-lg shadow-lg z-20">
                      {regions.map((region) => (
                        <button
                          key={region.id}
                          onClick={() => {
                            setActiveRegion(region.id);
                            setRegionMenuOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                            activeRegion === region.id
                              ? "bg-indigo-600 text-white"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <span className="mr-2">{region.flag}</span>
                          {region.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Region Navigation */}
              <nav className="hidden sm:flex overflow-x-auto scrollbar-hide">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setActiveRegion(region.id)}
                    className={`flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-lg mx-1 ${
                      activeRegion === region.id
                        ? "bg-indigo-600 text-white"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="mr-2">{region.flag}</span>
                    {region.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </section>{" "}
        {/* Category Filters */}
        <section className="py-6 px-6 md:px-12 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Category Dropdown */}
            <div className="md:hidden">
              <div className="relative">
                <button
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground bg-background border border-muted rounded-lg"
                >
                  <div className="flex items-center">
                    {(() => {
                      const currentCategory = categories.find(
                        (c) => c.id === activeCategory
                      );
                      const IconComponent = currentCategory?.icon || Phone;
                      return (
                        <>
                          <IconComponent className="h-4 w-4 mr-2" />
                          {currentCategory?.name || "Emergency Crisis"}
                        </>
                      );
                    })()}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      categoryMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {categoryMenuOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-muted rounded-lg shadow-lg z-20">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setActiveCategory(category.id);
                            setCategoryMenuOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                            activeCategory === category.id
                              ? `text-${category.color}-600 bg-${category.color}-50`
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Category Grid */}
            <div className="hidden md:grid grid-cols-4 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                      activeCategory === category.id
                        ? `bg-${category.color}-500 text-white shadow-lg`
                        : "bg-background border border-muted hover:shadow-md"
                    }`}
                  >
                    <IconComponent className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium text-center">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        {/* Resources Grid */}
        <div className="flex-1 py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            {filteredResources.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-background border border-muted rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-foreground flex-1">
                        {resource.name}
                      </h3>
                      {resource.type === "emergency" && (
                        <Phone className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                      )}
                      {resource.type === "suicide" && (
                        <Heart className="h-5 w-5 text-purple-500 flex-shrink-0 ml-2" />
                      )}
                      {resource.type === "chat" && (
                        <MessageSquare className="h-5 w-5 text-blue-500 flex-shrink-0 ml-2" />
                      )}
                      {resource.type === "specialty" && (
                        <Users className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="font-mono text-lg text-foreground">
                          {resource.number}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>

                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">
                          {resource.available}
                        </span>
                      </div>

                      {resource.website && (
                        <div className="pt-3 border-t border-muted">
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:text-primary/80"
                          >
                            <Globe className="h-4 w-4 mr-1" />
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Resources Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  We&apos;re working to add more resources for this region and
                  category.
                </p>
              </div>
            )}

            {/* General Support Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Additional Support & Self-Care
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-800/10 rounded-xl p-6">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Breathing Exercises
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try the 4-7-8 technique: breathe in for 4, hold for 7,
                    exhale for 8.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-800/10 rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Reach Out
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Contact a trusted friend, family member, or counselor.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-blue-800/10 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Grounding Technique
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Name 5 things you see, 4 you can touch, 3 you hear, 2 you
                    smell, 1 you taste.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-pink-500/10 to-pink-800/10 rounded-xl p-6">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    This Too Shall Pass
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Remember that intense feelings are temporary and will
                    subside.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Important Notice */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-16 bg-gradient-to-r from-indigo-500/10 to-purple-800/10 rounded-xl p-8 border border-indigo-800"
            >
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Star className="h-6 w-6 text-indigo-600 mr-3" />
                Important Information
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong>
                    ChillMind is not a crisis intervention service.
                  </strong>{" "}
                  While we provide mental health monitoring tools, we cannot
                  provide emergency assistance or immediate intervention.
                </p>
                <p>
                  If you are in immediate danger or experiencing thoughts of
                  self-harm, please contact local emergency services or a crisis
                  hotline immediately.
                </p>
                <p>
                  The resources listed here are provided for informational
                  purposes. Please verify current contact information and
                  availability as these may change.
                </p>
              </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Need to Add a Resource?
              </h2>
              <p className="text-muted-foreground mb-6">
                Help us improve this page by suggesting additional crisis
                resources for your region.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="mailto:support@chillmind.app"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Suggest a Resource
                </Link>
                <Link
                  href="/accessibility"
                  className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-600/10 transition-colors"
                >
                  Accessibility Support
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
