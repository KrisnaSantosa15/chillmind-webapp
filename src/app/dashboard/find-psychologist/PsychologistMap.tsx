"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import "leaflet/dist/leaflet.css";

import { Psychologist } from "./types";

interface PsychologistMapProps {
  psychologists: Psychologist[];
  selectedPsychologist: Psychologist | null;
  onPsychologistSelect: (psychologist: Psychologist) => void;
  userLocation: [number, number] | null;
}

interface IconDefaultPrototype extends L.Icon.Default {
  _getIconUrl?: string;
}

const iconDefault = L.Icon.Default.prototype as IconDefaultPrototype;
delete iconDefault._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different marker types
const psychologistIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
  className: "psychologist-marker",
});

const psychologistAvailableIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
  className: "psychologist-marker psychologist-available",
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -20],
  className: "user-marker",
});

function MapUpdater({
  center,
  selectedPsychologist,
}: {
  center: [number, number];
  selectedPsychologist: Psychologist | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPsychologist) {
      map.setView(selectedPsychologist.coordinates, 15, { animate: true });
    } else {
      map.setView(center, 12, { animate: true });
    }
  }, [map, center, selectedPsychologist]);

  return null;
}

export default function PsychologistMap({
  psychologists,
  selectedPsychologist,
  onPsychologistSelect,
  userLocation,
}: PsychologistMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const defaultCenter: [number, number] = [-6.2088, 106.8456];
  const mapCenter = userLocation || defaultCenter;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="h-full w-full relative">
      {" "}
      <MapContainer
        center={mapCenter}
        zoom={12}
        className="h-full w-full rounded-lg"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />{" "}
        {/* Add zoom control with improved styling */}
        <div className="leaflet-top leaflet-right" style={{ zIndex: 1000 }}>
          <div className="leaflet-control-zoom leaflet-bar leaflet-control shadow-md rounded-md overflow-hidden">
            <a
              className="leaflet-control-zoom-in bg-white hover:bg-gray-100 text-lg font-medium flex items-center justify-center h-8 w-8"
              href="#"
              title="Zoom in"
              role="button"
              aria-label="Zoom in"
            >
              +
            </a>
            <a
              className="leaflet-control-zoom-out bg-white hover:bg-gray-100 text-lg font-medium flex items-center justify-center h-8 w-8 border-t border-gray-100"
              href="#"
              title="Zoom out"
              role="button"
              aria-label="Zoom out"
            >
              −
            </a>
          </div>
        </div>
        <MapUpdater
          center={mapCenter}
          selectedPsychologist={selectedPsychologist}
        />
        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}
        {/* Psychologist markers */}
        {psychologists.map((psychologist) => (
          <Marker
            key={psychologist.id}
            position={psychologist.coordinates}
            icon={
              psychologist.available
                ? psychologistAvailableIcon
                : psychologistIcon
            }
          >
            {" "}
            <Popup closeButton={false} className="custom-popup" maxWidth={320}>
              {" "}
              <div className="min-w-[280px] p-4 rounded-lg shadow-md border border-gray-50 group transition-all hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0 border-2 border-white shadow-sm">
                    <Image
                      src={psychologist.imageUrl}
                      alt={psychologist.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {psychologist.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {psychologist.title}
                    </p>
                    {typeof psychologist.rating === "number" && (
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(psychologist.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          ({psychologist.rating})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {psychologist.association &&
                    psychologist.association.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          association:
                        </p>
                        <p className="text-sm text-gray-600">
                          {psychologist.association.slice(0, 2).join(", ")}
                          {psychologist.association.length > 2 && "..."}
                        </p>
                      </div>
                    )}

                  {typeof psychologist.experience === "number" && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Experience:
                      </p>
                      <p className="text-sm text-gray-600">
                        {psychologist.experience} years
                      </p>
                    </div>
                  )}

                  {!psychologist.experience &&
                    psychologist.registrationYear && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Registered since:
                        </p>
                        <p className="text-sm text-gray-600">
                          {psychologist.registrationYear}
                        </p>
                      </div>
                    )}
                  {typeof psychologist.price === "number" && (
                    <div>
                      {" "}
                      <p className="text-sm font-medium text-gray-900">
                        Price:
                      </p>
                      <p className="text-sm text-gray-600">
                        Rp {psychologist.price.toLocaleString()}/session
                        {psychologist.isPriceEstimated && " (est.)"}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                        typeof psychologist.available === "boolean"
                          ? psychologist.available
                            ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                            : "bg-red-100 text-red-800 group-hover:bg-red-200"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          typeof psychologist.available === "boolean"
                            ? psychologist.available
                              ? "bg-green-500"
                              : "bg-red-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      {typeof psychologist.available === "boolean"
                        ? psychologist.available
                          ? "Available"
                          : "Busy"
                        : "Status Unknown"}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPsychologistSelect(psychologist);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000] border border-gray-100 animate-fadeIn">
        <h4 className="font-semibold text-sm mb-3 text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          Legend
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded transition-colors">
            <div className="w-5 h-5 relative flex items-center justify-center">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                alt="Psychologist"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <span className="text-xs text-gray-700">Psychologist</span>
          </div>
          <div className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded transition-colors">
            <div className="w-5 h-5 relative flex items-center justify-center">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                alt="Available Psychologist"
                width={18}
                height={18}
                className="object-contain psychologist-available"
              />
            </div>
            <span className="text-xs text-gray-700">
              Available Psychologist
            </span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded transition-colors">
              <div className="w-5 h-5 relative flex items-center justify-center">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt="Your location"
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-gray-700">Your Location</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
