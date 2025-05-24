'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Star, Phone, MessageCircle, ChevronDown, List, Map, Users, Award, Calendar, Loader } from 'lucide-react';
import Image from 'next/image';
import { Psychologist } from './types';
import { 
  fetchAllPsychologists, 
  getPopularIndonesianCities,
  getMockPsychologists,
  PaginationInfo
} from '@/lib/psychologistApi';
import MapComingSoon from './MapComingSoon';

// Fallback data in case API fails completely
const currentYear = new Date().getFullYear();
const fallbackPsychologists: Psychologist[] = [
  {
      id: 1,
      name: "Dr. Sari Wulandari, M.Psi",
      location: "Jakarta Pusat",
      contactNumber: "+6281234567890",
      registrationId: 12345,
      registrationYear: 2015,
      available: true,
      education: "Universitas Indonesia",
      title: "Psikolog",
      association: ["Psikologi"],
      rating: 5.0,
      experience: currentYear - 2015, // Calculate from registration year
      coordinates: [-6.1944, 106.8229],
      price: 350000,
      isPriceEstimated: false,
      imageUrl:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      description:
        "Psikolog profesional lulusan Universitas Indonesia. Terdaftar sejak tahun 2015.",
      languages: ["Bahasa Indonesia"],
      sessionTypes: ["Konsultasi"],
    },
    {
      id: 2,
      name: "Dr. Ahmad Rizky, M.Psi",
      location: "Jakarta Selatan",
      contactNumber: "+6281234567891",
      registrationId: 12346,
      registrationYear: 2018,
      available: true,
      education: "Universitas Gadjah Mada",
      title: "Psikolog",
      association: ["Psikologi"],
      rating: 5.0,
      experience: currentYear - 2018, // Calculate from registration year
      coordinates: [-6.2615, 106.8106],
      price: 350000,
      isPriceEstimated: true,
      imageUrl:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
      description:
        "Psikolog profesional lulusan Universitas Gadjah Mada. Terdaftar sejak tahun 2018.",
      languages: ["Bahasa Indonesia"],
      sessionTypes: ["Konsultasi"],
    },
    {
      id: 3,
      name: "Dr. Maya Indira, M.Psi",
      location: "Bandung",
      contactNumber: "+6281234567892",
      registrationId: 12347,
      registrationYear: 2010,
      available: false,
      education: "Universitas Padjadjaran",
      title: "Psikolog",
      association: ["Psikologi"],
      rating: 5.0,
      experience: currentYear - 2010, // Calculate from registration year
      coordinates: [-6.9147, 107.6098],
      price: 350000,
      isPriceEstimated: true,
      imageUrl:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      description:
        "Psikolog profesional lulusan Universitas Padjadjaran. Terdaftar sejak tahun 2010.",
      languages: ["Bahasa Indonesia"],
      sessionTypes: ["Konsultasi"],
    },
];

export default function FindPsychologistPage() {  const [psychologists, setPsychologists] = useState<Psychologist[]>(fallbackPsychologists);
  const [filteredPsychologists, setFilteredPsychologists] = useState<Psychologist[]>(fallbackPsychologists);  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssociation, setSelectedAssociation] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [pagination, setPagination] = useState<PaginationInfo | undefined>({
    currentPage: 1,
    totalPages: 1,
    totalItems: fallbackPsychologists.length,
    hasNextPage: false,
    hasPrevPage: false
  });
  // Fetch psychologists data when component mounts or when page/cities change
  useEffect(() => {
    async function fetchPsychologists() {
      setIsLoading(true);
      setErrorMessage(null); // Clear previous errors
      
      try {
        // Use popular cities if no specific cities are selected
        const popularCities = getPopularIndonesianCities();
        const cities = selectedCities.length > 0 ? selectedCities : popularCities.slice(0, 5);
        
        // console.log('Fetching psychologists for cities:', cities, 'page:', currentPage);
        const result = await fetchAllPsychologists(cities, currentPage, pageSize);
        
        // If we got data from the API, use it
        if (result && result.psychologists && result.psychologists.length > 0) {
        //   console.log(`Loaded ${result.psychologists.length} psychologists from API`);
          setPsychologists(result.psychologists);
          setFilteredPsychologists(result.psychologists);
          
          // Update pagination info
          if (result.pagination) {
            setPagination(result.pagination);
          }
        } else {
          // If no data, fall back to mock data
          // console.log('No psychologists found from API, using fallback data');
          const mockData = getMockPsychologists();
          setPsychologists(mockData);
          setFilteredPsychologists(mockData);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: mockData.length,
            hasNextPage: false,
            hasPrevPage: false
          });
          
          if (selectedCities.length > 0) {
            setErrorMessage("Could not find psychologists in the selected location. Showing sample data instead.");
          }
        }
      } catch (error) {
        console.error('Error fetching psychologists:', error);
        // Use fallback data in case of error
        const mockData = getMockPsychologists();
        setPsychologists(mockData);
        setFilteredPsychologists(mockData);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: mockData.length,
          hasNextPage: false,
          hasPrevPage: false
        });
        setErrorMessage("There was an issue connecting to the psychologist database. Showing sample data for now.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPsychologists();
  }, [selectedCities, currentPage, pageSize]); // Re-fetch when selected cities or pagination changes
    // User location will be implemented when map feature is available
  // For now, we're just setting up the state variable
  useEffect(() => {
    setUserLocation([-6.2088, 106.8456]); // Default to Jakarta center
  }, []);  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);
  
  // Filter psychologists based on search criteria
  useEffect(() => {
    const filtered = psychologists.filter(psychologist => {
      const matchesSearch = psychologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           psychologist.association.some(spec => 
                             spec.toLowerCase().includes(searchTerm.toLowerCase())
                           ) ||
                           psychologist.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAssociation = !selectedAssociation || 
                                   psychologist.association.includes(selectedAssociation);
      
      const matchesPriceRange = !selectedPriceRange || checkPriceRange(psychologist.price, selectedPriceRange);
      
      const matchesAvailability = !showAvailableOnly || psychologist.available;
      
      return matchesSearch && matchesAssociation && matchesPriceRange && matchesAvailability;
    });
    
    setFilteredPsychologists(filtered);
  }, [searchTerm, selectedAssociation, selectedPriceRange, showAvailableOnly, psychologists]);
  const checkPriceRange = (price: number, range: string): boolean => {
    switch (range) {
      case 'under-300k': return price < 300000;
      case '300k-400k': return price >= 300000 && price <= 400000;
      case 'above-400k': return price > 400000;
      default: return true;
    }
  };
  const getAllAssociations = () => {
    const associations = new Set<string>();
    psychologists.forEach(p => p.association.forEach(s => associations.add(s)));
    return Array.from(associations);
  };
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30 dark:text-muted-foreground/20'}`} 
      />
    ));
  };

  const handlePsychologistSelect = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist);
    setShowModal(true);
  };  const PsychologistCard = ({ psychologist }: { psychologist: Psychologist }) => (    <div className="bg-background p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-muted">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start mb-2 sm:mb-0">
          <Image
            src={psychologist.imageUrl || "/default-avatar.png"}
            alt={psychologist.name}
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
            onError={(e) => {
              // Fallback image if the provided URL fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face";
            }}
          />
        </div>
        <div className="flex-1 w-full">          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-xl font-semibold text-foreground break-words">{psychologist.name}</h3>
                <span className={`sm:hidden self-start px-3 py-1 rounded-full text-sm font-medium ${
                  psychologist.available 
                    ? 'bg-green-300 dark:bg-green-900/30 text-green-700' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}>
                  {psychologist.available ? 'Available' : 'Busy'}
                </span>
              </div>              <p className="text-muted-foreground mt-1 break-words">{psychologist.title}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
                <div className="flex items-center">
                  {renderStars(psychologist.rating)}
                </div>
                <span className="text-sm text-muted-foreground">({psychologist.rating.toFixed(1)})</span>
                {psychologist.experience > 0 && (
                  <span className="text-sm text-muted-foreground">• {psychologist.experience} years experience</span>
                )}
                {psychologist.registrationId && (
                  <span className="text-sm text-muted-foreground">• No. {psychologist.registrationId}</span>
                )}
              </div>
            </div>            <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-sm font-medium shrink-0 ${
              psychologist.available 
                ? 'bg-green-300 dark:bg-green-900/30 text-green-700' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}>
              {psychologist.available ? 'Available' : 'Busy'}
            </span>
          </div>
            <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Show only 1 association in mobile, but 3 in desktop */}
              {psychologist.association.slice(0, 1).map((spec, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
              {/* Additional associations visible only on desktop */}
              {psychologist.association.slice(1, 3).map((spec, index) => (
                <span 
                  key={index + 1}
                  className="hidden sm:inline-flex px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
              {/* Show +more for mobile if more than 1 association */}
              {psychologist.association.length > 1 && (
                <span className="sm:hidden px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  +{psychologist.association.length - 1} more
                </span>
              )}
              {/* Show +more for desktop if more than 3 associations */}
              {psychologist.association.length > 3 && (
                <span className="hidden sm:inline-flex px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  +{psychologist.association.length - 3} more
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{psychologist.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  Rp {psychologist.price.toLocaleString()}/session
                  {psychologist.isPriceEstimated && " (est.)"}
                </span>
              </div>
            </div>
            
            <p className="text-foreground text-sm mb-4 line-clamp-2">{psychologist.description}</p>
              <div className="flex gap-3">
              <button 
                onClick={() => handlePsychologistSelect(psychologist)}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Details
              </button>              {psychologist.contactNumber && (
                <a
                  href={`${psychologist.contactNumber}?text=Hello%20${encodeURIComponent(psychologist.name)},%20I%20found%20your%20profile%20on%20ChillMind%20and%20would%20like%20to%20inquire%20about%20your%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-muted rounded-lg hover:bg-muted transition-colors flex items-center justify-center" 
                  title="Message via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              <a 
                href={psychologist.contactNumber || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-muted rounded-lg hover:bg-muted transition-colors flex items-center justify-center" 
                title="Call via WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (    <div className="min-h-screen bg-background bg-gradient-to-br from-background via-background/70 to-background">
      {/* Header */}      <div className="bg-background shadow-sm border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">          <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Find a Psychologist</h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2">Connect with HIMPSI registered psychologists near you</p>
            </div>
            <div className="flex items-center gap-3 mt-3 sm:mt-0">              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-background text-primary shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List View
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-background text-primary shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Map View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">        <div className="bg-background rounded-xl shadow-lg border border-muted/50 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Search */}            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />              <input
                type="text"
                placeholder="Search by name, association, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-muted bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>              {/* Association Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <select
                value={selectedAssociation}
                onChange={(e) => setSelectedAssociation(e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-muted bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >                <option value="">All Associations</option>
                {getAllAssociations().map((assoc) => (
                  <option key={assoc} value={assoc}>{assoc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
            </div>              {/* City Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <select
                value={selectedCities[0] || ""}
                onChange={(e) => {
                  const city = e.target.value;
                  if (city) {
                    setSelectedCities([city]);
                  } else {
                    setSelectedCities([]);
                  }
                }}
                className="w-full pl-10 pr-8 py-3 border border-muted bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >                <option value="">All Cities</option>
                {getPopularIndonesianCities().map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
            </div>
            
            {/* Price Range Filter */}
            <div className="relative">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-muted bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >                <option value="">All Prices</option>
                <option value="under-300k">Under Rp 300K</option>
                <option value="300k-400k">Rp 300K - 400K</option>
                <option value="above-400k">Above Rp 400K</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
            </div>
            
            {/* Availability Filter */}            <div className="flex items-center">
              <input
                type="checkbox"
                id="available-only"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-4 h-4 text-primary border-muted rounded focus:ring-primary/50"
              />
              <label htmlFor="available-only" className="ml-2 text-sm text-foreground">
                Available only
              </label>
            </div>
          </div>
            {/* Results count and error message */}          <div className="mt-4 pt-4 border-t border-muted">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Found {filteredPsychologists.length} psychologist{filteredPsychologists.length !== 1 ? 's' : ''}
                  {selectedCities.length === 1 && pagination && pagination.totalItems > 0 && (
                    <> of {pagination.totalItems} in {selectedCities[0]}</>
                  )}
                  {selectedCities.length === 1 && pagination && pagination.totalPages > 1 && (
                    <> • Page {pagination.currentPage} of {pagination.totalPages}</>
                  )}
                </p>
                
                {selectedCities.length === 1 && (
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                    onClick={() => setSelectedCities([])}
                    title="Clear city filter"
                  >
                    {selectedCities[0]}
                    <svg className="ml-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </span>
                )}
              </div>
              
              {errorMessage && (
                <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>        {/* Results */}        {isLoading ? (          <div className="bg-background rounded-xl shadow-lg p-12 text-center">
            <Loader className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Loading psychologists...</h3>
            <p className="text-muted-foreground">Fetching data from HIMPSI API</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-6">
            {filteredPsychologists.length > 0 ? (
              <>
                {filteredPsychologists.map(psychologist => (
                  <PsychologistCard key={psychologist.id} psychologist={psychologist} />
                ))}
                
                {/* Pagination UI - Only show when a specific city is selected */}
                {selectedCities.length === 1 && pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center justify-center gap-2">                      <button
                        onClick={() => setCurrentPage(curr => Math.max(1, curr - 1))}
                        disabled={!pagination.hasPrevPage}
                        className={`px-4 py-2 rounded-md border ${
                          pagination.hasPrevPage
                            ? "border-muted hover:bg-muted/80"
                            : "border-muted/50 text-muted-foreground/50 cursor-not-allowed"
                        }`}
                        aria-label="Previous page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m15 18-6-6 6-6"/>
                        </svg>
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          // Show pagination numbers based on current page position
                          let pageNum;
                          
                          if (pagination.totalPages <= 5) {
                            // If 5 or fewer pages, show all
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            // If near the start, show 1,2,3,4,5
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.totalPages - 2) {
                            // If near the end, show last 5 pages
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            // Otherwise center around current page
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (                            <button
                              key={i}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                                currentPage === pageNum
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                        <button
                        onClick={() => setCurrentPage(curr => Math.min(pagination.totalPages, curr + 1))}
                        disabled={!pagination.hasNextPage}
                        className={`px-4 py-2 rounded-md border ${
                          pagination.hasNextPage
                            ? "border-muted hover:bg-muted/80"
                            : "border-muted/50 text-muted-foreground/50 cursor-not-allowed"
                        }`}
                        aria-label="Next page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (              <div className="bg-background rounded-xl shadow-lg p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No psychologists found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>        ) : (
          <div className="bg-background rounded-xl shadow-lg overflow-hidden animate-fadeIn transition-all" style={{ height: '600px' }}>
            <MapComingSoon onSwitchView={() => setViewMode('list')} />
          </div>
        )}
      </div>      {/* Detailed Modal */}{showModal && selectedPsychologist && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-[9999] transition-all duration-300 animate-fadeIn">
          <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-scaleIn">
            <div className="p-6">
              {/* Close button in top-right corner */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {/* Mobile-friendly layout with centered image at top */}
              <div className="flex flex-col items-center mb-6 pt-4">
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden relative mb-4 shadow-md">
                  <Image
                    src={selectedPsychologist.imageUrl || "/default-avatar.png"}
                    alt={selectedPsychologist.name}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image if the provided URL fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face";
                    }}
                  />
                </div>
                <div className="text-center w-full">
                  <h2 className="text-2xl font-bold text-foreground break-words">{selectedPsychologist.name}</h2>
                  <p className="text-muted-foreground mt-1">{selectedPsychologist.title}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="flex items-center">
                      {renderStars(selectedPsychologist.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">({selectedPsychologist.rating.toFixed(1)})</span>
                  </div>
                  
                  {/* Registration details */}
                  {selectedPsychologist.registrationId && (
                    <div className="mt-2 text-sm text-muted-foreground flex flex-wrap justify-center gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                        HIMPSI #{selectedPsychologist.registrationId}
                      </span>
                      {selectedPsychologist.registrationYear && (
                        <span className="px-2 py-1">
                          Terdaftar sejak {selectedPsychologist.registrationYear}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>              <div className="space-y-6 mt-4">
                <div className="border-t border-border pt-4">                  
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    About Psychologist
                  </h3>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">{selectedPsychologist.description}</p>
                </div>                {selectedPsychologist.education && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                      </svg>
                      Education
                    </h3>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">{selectedPsychologist.education}</p>
                  </div>
                )}                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>                      <path d="m9 14 2 2 4-4"></path>
                    </svg>
                    Associations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Show only 1 association in mobile */}
                    {selectedPsychologist.association.slice(0, 1).map((spec, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm shadow-sm hover:bg-primary/20 transition-colors"
                      >
                        {spec}
                      </span>
                    ))}
                    
                    {/* Additional associations visible only on desktop */}
                    {selectedPsychologist.association.slice(1, 3).map((spec, index) => (
                      <span 
                        key={index + 1}
                        className="hidden sm:inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm shadow-sm hover:bg-primary/20 transition-colors"
                      >
                        {spec}
                      </span>
                    ))}
                    
                    {/* Show +more indicator on mobile if more than 1 association */}
                    {selectedPsychologist.association.length > 1 && (
                      <span className="sm:hidden px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm">
                        +{selectedPsychologist.association.length - 1} more
                      </span>
                    )}
                    
                    {/* Show +more indicator on desktop if more than 3 associations */}
                    {selectedPsychologist.association.length > 3 && (
                      <span className="hidden sm:inline-block px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm">
                        +{selectedPsychologist.association.length - 3} more
                      </span>
                    )}
                  </div>
                </div><div>
                  <h3 className="font-semibold text-foreground mb-2">Languages</h3>
                  <p className="text-muted-foreground">{selectedPsychologist.languages.join(', ')}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Session Types</h3>
                  <p className="text-muted-foreground">{selectedPsychologist.sessionTypes.join(', ')}</p>
                </div>
                
                {selectedPsychologist.contactNumber && (
                  <div>                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Contact
                    </h3>
                    <p className="text-muted-foreground">{selectedPsychologist.contactNumber}</p>
                  </div>
                )}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 mt-5 border-t border-muted gap-4">
                  <div className="bg-muted/50 px-4 py-3 rounded-lg w-full sm:w-auto">
                    <p className="text-lg font-semibold text-foreground flex items-end gap-1 justify-center sm:justify-start">
                      Rp {selectedPsychologist.price.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground">
                        /session{selectedPsychologist.isPriceEstimated ? " (estimated)" : ""}
                      </span>
                    </p>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground justify-center sm:justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-primary">
                        <path d="M12 2v4"></path><path d="M12 18v4"></path><path d="m4.93 4.93 2.83 2.83"></path>
                        <path d="m16.24 16.24 2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path>
                        <path d="m4.93 19.07 2.83-2.83"></path><path d="m16.24 7.76 2.83-2.83"></path>
                      </svg>
                      <span>{selectedPsychologist.experience} years experience</span>
                    </div>
                  </div>                  <div className="flex gap-3 w-full sm:w-auto">                    <a 
                      href={selectedPsychologist.contactNumber || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial min-w-[130px] px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Session
                    </a>
                    <a 
                      href={`${selectedPsychologist.contactNumber || "#"}?text=Hello%20${encodeURIComponent(selectedPsychologist.name)},%20I%20found%20your%20profile%20on%20ChillMind%20and%20would%20like%20to%20inquire%20about%20your%20services.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial min-w-[130px] px-6 py-2.5 border border-muted text-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}