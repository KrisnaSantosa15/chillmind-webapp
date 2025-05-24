/**
 * Service to fetch psychologist data from HIMPSI API
 */
import { Psychologist } from "@/app/dashboard/find-psychologist/types";

// Local proxy API endpoint to avoid CORS issues
const API_PROXY = "/api/psychologists";

// Interfaces for API responses
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface KotaData {
  id: number;
  ref_id: number | null;
  provinsi_id: number;
  name: string;
}

interface PsychologistData {
  user_id: number;
  no_anggota: number;
  tahun_terdaftar: number;
  nama: string;
  nama_gelar: string | null;
  jenis_kelamin: string;
  avatar_decode: string | null;
  permissions: string[];
  keanggotaan: {
    expired: number;
    is_show: number;
    keterangan: string;
    valid_until: string;
  };
  usia: number | null;
  no_hp_decode: string;
  penalty: number;
  is_eligible_for_sign: number;
  is_submit_sipp: number;
  competency_test: Array<Record<string, unknown>>;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  wilayah?: {
    wilayah?: {
      name: string;
      wa_link_decode?: string[];
      wa_group_link_decode?: string[];
      cs_skp_decode?: Array<{ no: string; name: string }>;
    };
  };
  provinsi: { id: number; name: string } | null;
  kota: {
    id: number;
    name: string;
  } | null;
  sipp: {
    university: string;
    valid_until: string;
  } | null;
  asosiasi?: Array<{
    asosiasi: {
      id: number;
      name: string;
      description?: string;
      logo?: string;
      wa_link_decode?: string[];
      wa_group_link_decode?: string[];
      harga?: {
        id: number;
        price: number;
        price_discount?: number | null;
        name?: string;
        description?: string;
        status?: number;
        model_data?: string;
        ref_id?: number;
        type?: string;
      };
    };
    status?: number;
    valid_until?: string;
  }>;
}

// Cache for geocoded locations
const geocodeCache: Record<string, [number, number]> = {};

/**
 * Search for a city ID by name with improved matching
 * Uses proxy API to avoid CORS issues
 */
export async function searchCityId(cityName: string): Promise<number | null> {
  try {
    // Normalize input by removing common prefixes and converting to uppercase for consistency
    let searchName = cityName
      .replace(/^(KABUPATEN|KAB|KOTA|KOTA ADM)\s+/i, "")
      .trim()
      .toUpperCase();

    // Remove diacritics from names if any
    searchName = searchName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Construct query parameters
    const queryParams = `sort=name&filter[name]=${encodeURIComponent(
      searchName
    )}&page[size]=150`;

    // Use our proxy API
    const url = `${API_PROXY}?endpoint=kota&params=${encodeURIComponent(
      queryParams
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch city data: ${response.status}`);
    }

    const data: ApiResponse<PaginatedResponse<KotaData>> =
      await response.json();

    // If we got exact matches
    if (data.status === "success" && data.data.data.length > 0) {
      return data.data.data[0].id;
    }

    // If no exact match, try to find partial matches
    if (data.status === "success" && data.data.data.length === 0) {
      // Try with just the first word of the city name
      const firstWord = searchName.split(" ")[0];
      if (firstWord && firstWord.length > 3) {
        // Avoid too short search terms
        const partialQueryParams = `sort=name&filter[name]=${encodeURIComponent(
          firstWord
        )}&page[size]=150`;
        const partialUrl = `${API_PROXY}?endpoint=kota&params=${encodeURIComponent(
          partialQueryParams
        )}`;

        const partialResponse = await fetch(partialUrl);

        if (partialResponse.ok) {
          const partialData: ApiResponse<PaginatedResponse<KotaData>> =
            await partialResponse.json();

          if (
            partialData.status === "success" &&
            partialData.data.data.length > 0
          ) {
            // Find the best match based on similarity
            const cityMatches = partialData.data.data.filter(
              (city) =>
                city.name.includes(firstWord) ||
                firstWord.includes(city.name.split(" ")[0])
            );

            if (cityMatches.length > 0) {
              return cityMatches[0].id;
            }

            // If no good match, just return the first result
            return partialData.data.data[0].id;
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error searching for city:", error);
    return null;
  }
}

/**
 * Fetch psychologists by city ID
 * Uses proxy API to avoid CORS issues
 */
export async function fetchPsychologistsByCity(
  cityId: number
): Promise<PsychologistData[]> {
  try {
    // Construct query parameters
    const queryParams = `filter[nama]=&page[size]=50&page[number]=1&include=wilayah,asosiasi,provinsi,kota,sipp&filter[asosiasi]=&filter[wilayah]=&filter[kota_id]=${cityId}&filter[status]=1&filter[permission]=35&sort=-member_valid_until`;

    // Use our proxy API
    const url = `${API_PROXY}?endpoint=anggota/public&params=${encodeURIComponent(
      queryParams
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch psychologists data: ${response.status}`);
    }

    const data: ApiResponse<PaginatedResponse<PsychologistData>> =
      await response.json();

    if (data.status === "success") {
      return data.data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching psychologists:", error);
    return [];
  }
}

/**
 * Geocode an address to coordinates using our proxy API
 * With improved handling for Indonesian locations
 */
export async function geocodeAddress(
  address: string
): Promise<[number, number] | null> {
  // First check if we have this location in cache
  if (geocodeCache[address]) {
    return geocodeCache[address];
  }

  // Handle common formatting in Indonesian addresses
  // Remove "KABUPATEN" or "KOTA" prefix if present
  const normalizedAddress = address
    .replace(/^KABUPATEN\s+/i, "")
    .replace(/^KOTA\s+/i, "");

  try {
    // Use our proxy API to avoid CORS issues with Nominatim
    const url = `/api/geocode?address=${encodeURIComponent(normalizedAddress)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.lat && data.lon) {
      const coordinates: [number, number] = [data.lat, data.lon];
      geocodeCache[address] = coordinates; // Cache the result
      return coordinates;
    }

    // Fallback: try with just the first word of the address (city name)
    const firstWord = normalizedAddress.split(" ")[0];
    if (firstWord && firstWord.length > 3) {
      // Avoid too short words
      const fallbackUrl = `/api/geocode?address=${encodeURIComponent(
        firstWord
      )}`;

      const fallbackResponse = await fetch(fallbackUrl);

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.lat && fallbackData.lon) {
          const fallbackCoordinates: [number, number] = [
            fallbackData.lat,
            fallbackData.lon,
          ];
          geocodeCache[address] = fallbackCoordinates;
          return fallbackCoordinates;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
}

/**
 * Map API data to our Psychologist interface using only the actual data
 * For UI compatibility, we're including some presentation fields
 */
export async function mapApiToPsychologist(
  psychologist: PsychologistData,
  selectedCity?: string
): Promise<Psychologist | null> {
  try {
    // Extract location info from API data, prioritizing the selected city if provided
    let locationName = "Unknown";
    if (selectedCity) {
      // If a specific city was selected, use that for consistent display
      locationName = selectedCity;
    } else if (psychologist.kota && psychologist.kota.name) {
      locationName = psychologist.kota.name;
    } else if (
      psychologist.wilayah &&
      psychologist.wilayah.wilayah &&
      psychologist.wilayah.wilayah.name
    ) {
      locationName = psychologist.wilayah.wilayah.name;
    }

    // Format name with proper handling of null values
    const formattedName = psychologist.nama_gelar || psychologist.nama;

    // Determine availability based on membership status
    let available = true; // Default to available
    if (psychologist.keanggotaan) {
      available = psychologist.keanggotaan.expired === 0;
    }

    // Extract education info if available
    let education: string | undefined = undefined;
    if (psychologist.sipp && psychologist.sipp.university) {
      education = psychologist.sipp.university;
    }

    // Calculate experience based on registration year (current year - registration year)
    let experience = 0;
    if (psychologist.tahun_terdaftar) {
      experience = new Date().getFullYear() - psychologist.tahun_terdaftar;
      if (experience < 0) experience = 0;
    }

    // Choose appropriate image based on gender data from API
    const genderLower = (psychologist.jenis_kelamin || "").toLowerCase();
    // Use a local placeholder image. Assuming 'profile-placeholder.png' (or a similar extension)
    // is in the 'public' folder. Adjust the path and filename if needed.
    let imageUrl = "/profile-placeholder.png"; // Default placeholder

    if (
      genderLower.includes("laki") ||
      genderLower === "l" ||
      genderLower === "pria"
    ) {
      // If you have a specific placeholder for males, e.g., "/profile-placeholder-male.png",
      // you can set it here. Otherwise, it uses the same placeholder.
      imageUrl = "/profile-placeholder.png"; // Male placeholder (or same generic one)
    }

    // Check for avatar and use it if available
    if (psychologist.avatar_decode) {
      imageUrl = psychologist.avatar_decode;
    }

    // Extract WhatsApp contact link from wilayah or asosiasi
    let whatsappContact = "";

    // First check wilayah for WhatsApp link
    if (
      psychologist.wilayah?.wilayah?.wa_link_decode &&
      Array.isArray(psychologist.wilayah.wilayah.wa_link_decode) &&
      psychologist.wilayah.wilayah.wa_link_decode.length > 0 &&
      psychologist.wilayah.wilayah.wa_link_decode[0]
    ) {
      whatsappContact = psychologist.wilayah.wilayah.wa_link_decode[0];
    }
    // If no wilayah WhatsApp, check asosiasi
    else if (
      psychologist.asosiasi &&
      Array.isArray(psychologist.asosiasi) &&
      psychologist.asosiasi.length > 0 &&
      psychologist.asosiasi[0].asosiasi?.wa_link_decode &&
      Array.isArray(psychologist.asosiasi[0].asosiasi.wa_link_decode) &&
      psychologist.asosiasi[0].asosiasi.wa_link_decode.length > 0
    ) {
      whatsappContact = psychologist.asosiasi[0].asosiasi.wa_link_decode[0];
    }
    // Last resort: fallback to no_hp_decode if available
    else if (
      psychologist.no_hp_decode &&
      psychologist.no_hp_decode.trim() !== ""
    ) {
      whatsappContact = `https://wa.me/${psychologist.no_hp_decode.replace(
        /\D/g,
        ""
      )}`;
    }

    // Extract association from associations
    let associations: string[] = ["Psikologi"];
    if (
      psychologist.asosiasi &&
      Array.isArray(psychologist.asosiasi) &&
      psychologist.asosiasi.length > 0
    ) {
      associations = psychologist.asosiasi
        .filter((asosiasi) => asosiasi.asosiasi && asosiasi.asosiasi.name)
        .map((asosiasi) => asosiasi.asosiasi.name);

      // If no valid associations, keep default
      if (associations.length === 0) {
        associations = ["Psikologi"];
      }
    }

    // Create a description using only available real data
    let description = "";
    if (education && education.length > 0) {
      description = `Professional psychologist graduated from ${education}.`;
    } else if (experience > 0) {
      description = `Professional psychologist with ${experience} years of experience.`;
    } else {
      description = `Professional psychologist registered with HIMPSI.`;
    }

    // Add registration info if available
    if (psychologist.tahun_terdaftar) {
      description += ` Registered since ${psychologist.tahun_terdaftar}.`;
    }

    // Add membership status if available
    if (psychologist.keanggotaan && psychologist.keanggotaan.keterangan) {
      description += ` Status: ${psychologist.keanggotaan.keterangan}.`;
    }

    // Extract price from the API response if available
    let price: number = 0;
    let isPriceEstimated: boolean = false;

    // Check if the psychologist has any associated association with price information
    if (
      psychologist.asosiasi &&
      Array.isArray(psychologist.asosiasi) &&
      psychologist.asosiasi.length > 0
    ) {
      // Find the first active association with price information
      const activeAsosiasi = psychologist.asosiasi.find(
        (assoc) => assoc.status === 1 && assoc.asosiasi?.harga?.price
      );

      if (
        activeAsosiasi &&
        activeAsosiasi.asosiasi &&
        activeAsosiasi.asosiasi.harga
      ) {
        // Use the actual price from the API
        price = activeAsosiasi.asosiasi.harga.price;
        isPriceEstimated = false;
      } else {
        // If no active price is found, estimate based on experience level
        isPriceEstimated = true;
        if (experience > 10) {
          price = 350000;
        } else if (experience > 5) {
          price = 300000;
        } else if (experience > 2) {
          price = 200000;
        } else {
          price = 150000;
        }
      }
    } else {
      // If no associations with price, estimate based on experience level
      isPriceEstimated = true;
      if (experience > 10) {
        price = 350000;
      } else if (experience > 5) {
        price = 300000;
      } else if (experience > 2) {
        price = 200000;
      } else {
        price = 150000;
      }
    }

    return {
      // Core data fields directly from API
      id: psychologist.user_id,
      name: formattedName,
      location: locationName,
      contactNumber: whatsappContact, // Use the WhatsApp link instead of just the phone number
      registrationId: psychologist.no_anggota,
      registrationYear: psychologist.tahun_terdaftar,
      available: available,
      education: education, // UI presentation fields with sensible defaults
      title: "Psikolog",
      association: associations,
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0 for variety
      experience: experience,
      coordinates: [-6.2088, 106.8456], // Default to Jakarta
      price: price,
      isPriceEstimated: isPriceEstimated,
      imageUrl: imageUrl,
      description: description,
      languages: ["Bahasa Indonesia"],
      sessionTypes: ["Online Consultation", "In-Person Consultation"],
    };
  } catch (error) {
    console.error("Error mapping psychologist data:", error);
    return null;
  }
}

/**
 * Fetch psychologists optimized with initial limit or by city
 * This implementation is optimized for quick initial load
 * and supports pagination for better performance
 */
export async function fetchAllPsychologists(
  cities: string[] = [],
  page = 1,
  pageSize = 10
): Promise<{
  psychologists: Psychologist[];
  pagination?: PaginationInfo;
  city?: string;
}> {
  const result: Psychologist[] = [];

  // Add a small delay between API requests to be kind to the server
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Configure retry behavior
  const maxRetries = 1; // Reduced retry count for faster response
  const retryDelay = 1000; // ms

  // Function to handle retries with exponential backoff
  async function fetchWithRetry<T>(
    fetchFn: () => Promise<T>,
    retryCount = 0
  ): Promise<T | null> {
    try {
      return await fetchFn();
    } catch (error) {
      if (retryCount < maxRetries) {
        const delayTime = retryDelay * Math.pow(2, retryCount);
        console.log(`Retrying after ${delayTime}ms...`);
        await delay(delayTime);
        return fetchWithRetry(fetchFn, retryCount + 1);
      } else {
        console.error("Max retries reached:", error);
        return null;
      }
    }
  }

  try {
    // If no specific cities are provided or multiple cities, just get initial data
    if (cities.length === 0 || cities.length > 1) {
      //   console.log("Fetching initial psychologists data");

      // Fetch initial limited data (10 records)
      const initialData =
        (await fetchWithRetry(() => fetchInitialPsychologists())) || [];

      // Map the data to our format
      const batchSize = 5;
      for (let i = 0; i < initialData.length; i += batchSize) {
        const batch = initialData.slice(i, i + batchSize);

        // Process batch in parallel
        const promises = batch.map(async (psyData) => {
          try {
            return await mapApiToPsychologist(psyData);
          } catch (error) {
            console.error("Error mapping psychologist:", error);
            return null;
          }
        });

        // Wait for all promises in this batch to complete
        const mappedPsychologists = await Promise.all(promises);

        // Add valid results to our list
        result.push(...(mappedPsychologists.filter(Boolean) as Psychologist[]));
      }

      return {
        psychologists: result,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: result.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    // If a specific city is selected, get data with pagination
    const city = cities[0]; // Get the first city in the array
    // console.log(
    //   `Fetching psychologists for city: ${city} (page: ${page}, pageSize: ${pageSize})`
    // );

    // Search for city ID with retry logic
    const cityId = await fetchWithRetry(() => searchCityId(city));

    if (cityId) {
      // Fetch psychologists for this city with pagination
      const paginatedResult = await fetchWithRetry(() =>
        fetchPsychologistsByCityPaginated(cityId, page, pageSize)
      );

      if (paginatedResult && paginatedResult.psychologists.length > 0) {
        const apiPsychologists = paginatedResult.psychologists;
        // console.log(
        //   `Found ${apiPsychologists.length} psychologists in ${city} (page ${page} of ${paginatedResult.pagination.totalPages})`
        // ); // Map the data to our format with the selected city
        const promises = apiPsychologists.map(async (psyData) => {
          try {
            // Pass the selected city to ensure consistent display
            return await mapApiToPsychologist(psyData, city);
          } catch (error) {
            console.error("Error mapping psychologist:", error);
            return null;
          }
        });

        // Wait for all promises to complete
        const mappedPsychologists = await Promise.all(promises);

        // Add valid results to our list
        result.push(...(mappedPsychologists.filter(Boolean) as Psychologist[]));

        return {
          psychologists: result,
          pagination: paginatedResult.pagination,
          city,
        };
      } else {
        console.warn(`No psychologists found for city: ${city}`);

        // Return empty result set with pagination structure
        return {
          psychologists: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: page > 1,
          },
          city,
        };
      }
    } else {
      console.warn(`Could not find city ID for: ${city}`);

      // Return a structured empty result
      return {
        psychologists: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: page > 1,
        },
        city,
      };
    }
  } catch (error) {
    console.error(`Error fetching psychologists:`, error);

    // If we have a specific city, return empty result with that context
    if (cities.length === 1) {
      return {
        psychologists: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: page > 1,
        },
        city: cities[0],
      };
    }
  }

  // If we didn't find any psychologists or encountered errors, return mock data as a fallback
  if (result.length === 0) {
    const mockData = getMockPsychologists();
    return {
      psychologists: mockData,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: mockData.length,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  return {
    psychologists: result,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: result.length,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

/**
 * Get a list of major Indonesian cities for psychologist search
 */
export function getPopularIndonesianCities(): string[] {
  return [
    "Jakarta Pusat",
    "Jakarta Selatan",
    "Jakarta Barat",
    "Jakarta Timur",
    "Jakarta Utara",
    "Bandung",
    "Surabaya",
    "Medan",
    "Semarang",
    "Yogyakarta",
    "Makassar",
    "Denpasar",
    "Palembang",
    "Malang",
    "Bekasi",
    "Tangerang",
    "Depok",
    "Bogor",
    "Bandar Lampung",
  ];
}

/**
 * Fetch psychologists from popular cities for initial display
 */
export async function fetchPopularCityPsychologists(): Promise<Psychologist[]> {
  const cities = getPopularIndonesianCities();
  // Get 5 random cities for variety
  const randomCities = cities.sort(() => 0.5 - Math.random()).slice(0, 5);
  const result = await fetchAllPsychologists(randomCities);
  return result.psychologists;
}

/**
 * Fallback function to get mock psychologists when API fails
 * These mock objects follow the same structure as what we'd get from the API mapping
 */
export function getMockPsychologists(): Psychologist[] {
  // Calculate current year for accurate experience
  const currentYear = new Date().getFullYear();

  return [
    {
      id: 1,
      name: "Dr. Sari Wulandari, M.Psi",
      location: "Jakarta Pusat",
      contactNumber: "https://wa.me/6281234567890",
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
      contactNumber: "https://wa.me/6281234567891",
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
      contactNumber: "https://wa.me/6281234567892",
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
}

/**
 * Fetch initial psychologists data with limited size
 */
export async function fetchInitialPsychologists(): Promise<PsychologistData[]> {
  try {
    // Construct query parameters to get just 10 records
    const queryParams = `page[size]=10&page[number]=1&include=wilayah,asosiasi,provinsi,kota,sipp&filter[status]=1&filter[permission]=35&sort=-member_valid_until`;

    // Use our proxy API
    const url = `${API_PROXY}?endpoint=anggota/public&params=${encodeURIComponent(
      queryParams
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch initial psychologists data: ${response.status}`
      );
    }

    const data: ApiResponse<PaginatedResponse<PsychologistData>> =
      await response.json();

    if (data.status === "success") {
      return data.data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching initial psychologists:", error);
    return [];
  }
}

// Pagination information interface
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Fetch psychologists by city ID with pagination
 */
export async function fetchPsychologistsByCityPaginated(
  cityId: number,
  page = 1,
  pageSize = 10
): Promise<{
  psychologists: PsychologistData[];
  pagination: PaginationInfo;
}> {
  try {
    // Construct query parameters with pagination
    const queryParams = `filter[nama]=&page[size]=${pageSize}&page[number]=${page}&include=wilayah,asosiasi,provinsi,kota,sipp&filter[asosiasi]=&filter[wilayah]=&filter[kota_id]=${cityId}&filter[status]=1&filter[permission]=35&sort=-member_valid_until`;

    // Use our proxy API
    const url = `${API_PROXY}?endpoint=anggota/public&params=${encodeURIComponent(
      queryParams
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch psychologists data: ${response.status}`);
    }

    const data: ApiResponse<PaginatedResponse<PsychologistData>> =
      await response.json();

    if (data.status === "success") {
      // Extract pagination information
      const paginationInfo: PaginationInfo = {
        currentPage: data.data.current_page,
        totalPages: data.data.last_page,
        totalItems: data.data.total,
        hasNextPage: !!data.data.next_page_url,
        hasPrevPage: !!data.data.prev_page_url,
      };

      return {
        psychologists: data.data.data,
        pagination: paginationInfo,
      };
    }

    return {
      psychologists: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  } catch (error) {
    console.error("Error fetching paginated psychologists:", error);
    return {
      psychologists: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}
