"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft, ChevronRight, X, Camera, Calendar,
  LayoutGrid, Video, Globe, Phone, Mail,
} from "lucide-react";
import type { PropertyImage } from "@/types";

interface PropertyGalleryProps {
  images: PropertyImage[];
  address: string;
  inspectionTime?: string;
  agentPhone?: string;
  enquireHref?: string;
}

export function PropertyGallery({
  images,
  address,
  inspectionTime,
  agentPhone,
  enquireHref = "#enquire",
}: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: 0 });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Sync index with carousel
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setLightboxIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Jump to correct slide when opening
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    // Scroll after carousel mounts
    setTimeout(() => emblaApi?.scrollTo(index, true), 0);
  };

  // Close on Escape
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, scrollPrev, scrollNext]);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[16/7] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero image ──────────────────────────────────────────── */}
      <div
        className="relative w-full aspect-[16/7] sm:aspect-[16/6] cursor-pointer overflow-hidden bg-gray-900"
        onClick={() => openLightbox(0)}
      >
        <Image
          src={images[0].url}
          alt={images[0].alt || address}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* Inspect badge — top left */}
        {inspectionTime && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Inspect {inspectionTime}
          </div>
        )}

        {/* Photos pill — bottom left */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
            className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            Photos {images.length}
          </button>
        </div>
      </div>

      {/* ── Lightbox ────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media type tabs */}
            <div className="flex items-center gap-1">
              <MediaTab icon={<LayoutGrid className="w-3.5 h-3.5" />} label="Floorplan" disabled />
              <MediaTab icon={<Video className="w-3.5 h-3.5" />} label="Video" disabled />
              <MediaTab icon={<Globe className="w-3.5 h-3.5" />} label="Virtual Tour" disabled />
              <MediaTab icon={<Camera className="w-3.5 h-3.5" />} label="Photos" active />
            </div>

            {/* Call + Enquire */}
            <div className="flex items-center gap-2">
              {agentPhone && (
                <a
                  href={`tel:${agentPhone}`}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-white/40 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              )}
              <a
                href={enquireHref}
                onClick={() => setLightboxOpen(false)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-white/40 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Enquire
              </a>
            </div>
          </div>

          {/* Main carousel */}
          <div className="flex-1 flex items-center relative min-h-0">
            <div ref={emblaRef} className="overflow-hidden w-full h-full">
              <div className="flex h-full">
                {images.map((img, i) => (
                  <div key={i} className="flex-[0_0_100%] min-w-0 relative">
                    <Image
                      src={img.url}
                      alt={img.alt || `${address} - Photo ${i + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>
            </div>
            {images.length > 1 && (
              <>
                <button
                  onClick={scrollPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip + counter */}
          <div className="flex-shrink-0 pb-5 pt-3">
            <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { emblaApi?.scrollTo(i); setLightboxIndex(i); }}
                  className={`relative w-16 h-12 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                    lightboxIndex === i ? "border-white scale-105" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={img.url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
            <p className="text-center text-white/70 text-sm mt-1">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function MediaTab({
  icon,
  label,
  active,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        disabled
          ? "text-white/30 cursor-default"
          : active
          ? "bg-white text-gray-900"
          : "text-white hover:bg-white/10 cursor-pointer"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
