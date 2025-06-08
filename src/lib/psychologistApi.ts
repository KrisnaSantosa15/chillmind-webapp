import { Psychologist } from "@/app/dashboard/find-psychologist/types";

const API_PROXY = "/api/psychologists";

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

const geocodeCache: Record<string, [number, number]> = {};

export async function searchCityId(cityName: string): Promise<number | null> {
  try {
    let searchName = cityName
      .replace(/^(KABUPATEN|KAB|KOTA|KOTA ADM)\s+/i, "")
      .trim()
      .toUpperCase();

    searchName = searchName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const queryParams = `sort=name&filter[name]=${encodeURIComponent(
      searchName
    )}&page[size]=150`;

    const url = `${API_PROXY}?endpoint=kota&params=${encodeURIComponent(
      queryParams
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch city data: ${response.status}`);
    }

    const data: ApiResponse<PaginatedResponse<KotaData>> =
      await response.json();

    if (data.status === "success" && data.data.data.length > 0) {
      return data.data.data[0].id;
    }

    if (data.status === "success" && data.data.data.length === 0) {
      const firstWord = searchName.split(" ")[0];
      if (firstWord && firstWord.length > 3) {
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
            const cityMatches = partialData.data.data.filter(
              (city) =>
                city.name.includes(firstWord) ||
                firstWord.includes(city.name.split(" ")[0])
            );

            if (cityMatches.length > 0) {
              return cityMatches[0].id;
            }

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

export async function fetchPsychologistsByCity(
  cityId: number
): Promise<PsychologistData[]> {
  try {
    const queryParams = `filter[nama]=&page[size]=50&page[number]=1&include=wilayah,asosiasi,provinsi,kota,sipp&filter[asosiasi]=&filter[wilayah]=&filter[kota_id]=${cityId}&filter[status]=1&filter[permission]=35&sort=-member_valid_until`;

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

export async function geocodeAddress(
  address: string
): Promise<[number, number] | null> {
  if (geocodeCache[address]) {
    return geocodeCache[address];
  }

  const normalizedAddress = address
    .replace(/^KABUPATEN\s+/i, "")
    .replace(/^KOTA\s+/i, "");

  try {
    const url = `/api/geocode?address=${encodeURIComponent(normalizedAddress)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.lat && data.lon) {
      const coordinates: [number, number] = [data.lat, data.lon];
      geocodeCache[address] = coordinates;
      return coordinates;
    }

    const firstWord = normalizedAddress.split(" ")[0];
    if (firstWord && firstWord.length > 3) {
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

export async function mapApiToPsychologist(
  psychologist: PsychologistData,
  selectedCity?: string
): Promise<Psychologist | null> {
  try {
    let locationName = "Unknown";
    if (selectedCity) {
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

    const formattedName = psychologist.nama_gelar || psychologist.nama;

    let available = true;
    if (psychologist.keanggotaan) {
      available = psychologist.keanggotaan.expired === 0;
    }

    let education: string | undefined = undefined;
    if (psychologist.sipp && psychologist.sipp.university) {
      education = psychologist.sipp.university;
    }

    let experience = 0;
    if (psychologist.tahun_terdaftar) {
      experience = new Date().getFullYear() - psychologist.tahun_terdaftar;
      if (experience < 0) experience = 0;
    }

    const genderLower = (psychologist.jenis_kelamin || "").toLowerCase();
    let imageUrl = "/profile-placeholder.png";

    if (
      genderLower.includes("laki") ||
      genderLower === "l" ||
      genderLower === "pria"
    ) {
      imageUrl = "/profile-placeholder.png";
    }

    if (psychologist.avatar_decode) {
      imageUrl = psychologist.avatar_decode;
    }

    let whatsappContact = "";

    if (
      psychologist.wilayah?.wilayah?.wa_link_decode &&
      Array.isArray(psychologist.wilayah.wilayah.wa_link_decode) &&
      psychologist.wilayah.wilayah.wa_link_decode.length > 0 &&
      psychologist.wilayah.wilayah.wa_link_decode[0]
    ) {
      whatsappContact = psychologist.wilayah.wilayah.wa_link_decode[0];
    } else if (
      psychologist.asosiasi &&
      Array.isArray(psychologist.asosiasi) &&
      psychologist.asosiasi.length > 0 &&
      psychologist.asosiasi[0].asosiasi?.wa_link_decode &&
      Array.isArray(psychologist.asosiasi[0].asosiasi.wa_link_decode) &&
      psychologist.asosiasi[0].asosiasi.wa_link_decode.length > 0
    ) {
      whatsappContact = psychologist.asosiasi[0].asosiasi.wa_link_decode[0];
    } else if (
      psychologist.no_hp_decode &&
      psychologist.no_hp_decode.trim() !== ""
    ) {
      whatsappContact = `https://wa.me/${psychologist.no_hp_decode.replace(
        /\D/g,
        ""
      )}`;
    }

    let associations: string[] = ["Psikologi"];
    if (
      psychologist.asosiasi &&
      Array.isArray(psychologist.asosiasi) &&
      psychologist.asosiasi.length > 0
    ) {
      associations = psychologist.asosiasi
        .filter((asosiasi) => asosiasi.asosiasi && asosiasi.asosiasi.name)
        .map((asosiasi) => asosiasi.asosiasi.name);

      if (associations.length === 0) {
        associations = ["Psikologi"];
      }
    }

    let description = "";
    if (education && education.length > 0) {
      description = `Professional psychologist graduated from ${education}.`;
    } else if (experience > 0) {
      description = `Professional psychologist with ${experience} years of experience.`;
    } else {
      description = `Professional psychologist registered with HIMPSI.`;
    }

    if (psychologist.tahun_terdaftar) {
      description += ` Registered since ${psychologist.tahun_terdaftar}.`;
    }

    if (psychologist.keanggotaan && psychologist.keanggotaan.keterangan) {
      description += ` Status: ${psychologist.keanggotaan.keterangan}.`;
    }

    let price: number = 0;
    let isPriceEstimated: boolean = false;

    if (
      psychologist.asosiasi &&
      Array.isArray(psychologist.asosiasi) &&
      psychologist.asosiasi.length > 0
    ) {
      const activeAsosiasi = psychologist.asosiasi.find(
        (assoc) => assoc.status === 1 && assoc.asosiasi?.harga?.price
      );

      if (
        activeAsosiasi &&
        activeAsosiasi.asosiasi &&
        activeAsosiasi.asosiasi.harga
      ) {
        price = activeAsosiasi.asosiasi.harga.price;
        isPriceEstimated = false;
      } else {
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
      id: psychologist.user_id,
      name: formattedName,
      location: locationName,
      contactNumber: whatsappContact,
      registrationId: psychologist.no_anggota,
      registrationYear: psychologist.tahun_terdaftar,
      available: available,
      education: education,
      title: "Psikolog",
      association: associations,
      rating: 4.5 + Math.random() * 0.5,
      experience: experience,
      coordinates: [-6.2088, 106.8456],
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

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const maxRetries = 1;
  const retryDelay = 1000;

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
    if (cities.length === 0 || cities.length > 1) {
      const initialData =
        (await fetchWithRetry(() => fetchInitialPsychologists())) || [];

      const batchSize = 5;
      for (let i = 0; i < initialData.length; i += batchSize) {
        const batch = initialData.slice(i, i + batchSize);

        const promises = batch.map(async (psyData) => {
          try {
            return await mapApiToPsychologist(psyData);
          } catch (error) {
            console.error("Error mapping psychologist:", error);
            return null;
          }
        });

        const mappedPsychologists = await Promise.all(promises);

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

    const city = cities[0];
    // console.log(
    //   `Fetching psychologists for city: ${city} (page: ${page}, pageSize: ${pageSize})`
    // );

    const cityId = await fetchWithRetry(() => searchCityId(city));

    if (cityId) {
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
            return await mapApiToPsychologist(psyData, city);
          } catch (error) {
            console.error("Error mapping psychologist:", error);
            return null;
          }
        });

        const mappedPsychologists = await Promise.all(promises);

        result.push(...(mappedPsychologists.filter(Boolean) as Psychologist[]));

        return {
          psychologists: result,
          pagination: paginatedResult.pagination,
          city,
        };
      } else {
        console.warn(`No psychologists found for city: ${city}`);

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

export async function fetchPopularCityPsychologists(): Promise<Psychologist[]> {
  const cities = getPopularIndonesianCities();
  const randomCities = cities.sort(() => 0.5 - Math.random()).slice(0, 5);
  const result = await fetchAllPsychologists(randomCities);
  return result.psychologists;
}

export function getMockPsychologists(): Psychologist[] {
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
      experience: currentYear - 2015,
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
      experience: currentYear - 2018,
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
      experience: currentYear - 2010,
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

export async function fetchInitialPsychologists(): Promise<PsychologistData[]> {
  try {
    const queryParams = `page[size]=10&page[number]=1&include=wilayah,asosiasi,provinsi,kota,sipp&filter[status]=1&filter[permission]=35&sort=-member_valid_until`;

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

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function fetchPsychologistsByCityPaginated(
  cityId: number,
  page = 1,
  pageSize = 10
): Promise<{
  psychologists: PsychologistData[];
  pagination: PaginationInfo;
}> {
  try {
    const queryParams = `filter[nama]=&page[size]=${pageSize}&page[number]=${page}&include=wilayah,asosiasi,provinsi,kota,sipp&filter[asosiasi]=&filter[wilayah]=&filter[kota_id]=${cityId}&filter[status]=1&filter[permission]=35&sort=-member_valid_until`;

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
