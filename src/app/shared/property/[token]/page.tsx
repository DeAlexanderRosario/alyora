"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Bath,
  Bed,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  FileText,
  Layers,
  Lock,
  MapPin,
  Maximize2,
  Menu,
  Phone,
  Play,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface MediaAsset {
  id?: string;
  _id?: string;
  secure_url: string;
  public_id?: string;
  visibility?: string;
  type?: "photo" | "video" | "floorplan";
  caption?: string;
}

interface PropertyDocument {
  id?: string;
  _id?: string;
  name: string;
  url: string;
  file_type: string;
  visibility?: string;
  verificationStatus?: string;
  version?: string;
  notes?: string;
}

interface PropertyData {
  _id: string;
  name: string;
  location: string;
  price?: string;
  image_url?: string;
  image?: MediaAsset;
  media: MediaAsset[];
  documents: PropertyDocument[];
  tag?: string;
  tag_color?: string;
  beds?: string;
  baths?: string;
  area?: string;
  plot?: string;
  propertyType?: string;
  description?: string;
  featured?: boolean;
  amenities?: string[];
  specifications?: { key: string; value: string }[];
  exactAddress?: string;
  gpsCoordinates?: {
    lat?: number;
    lng?: number;
  };
  ownerDetails?: {
    name?: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  brokerDetails?: {
    name?: string;
    phone?: string;
    email?: string;
    agency?: string;
  };
}

/* =========================================================
   HELPERS
========================================================= */

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_ALYORA_WHATSAPP_NUMBER || "919947616989";

function buildWhatsAppUrl(propertyName: string) {
  const message = `Hello ALYORA, I am interested in "${propertyName}". I would like more information about this property.`;

  const encodedMessage = encodeURIComponent(message);

  if (WHATSAPP_NUMBER) {
    return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodedMessage}`;
  }

  return `https://wa.me/?text=${encodedMessage}`;
}

/* =========================================================
   PAGE
========================================================= */

export default function SharedPropertyPage() {
  const params = useParams();

  const token = params?.token as string;

  /* -------------------------
     Main state
  ------------------------- */

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [requiresPasscode, setRequiresPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [property, setProperty] = useState<PropertyData | null>(null);

  const [leadName, setLeadName] = useState("");
  const [salespersonId, setSalespersonId] = useState("");
  const [permissions, setPermissions] = useState<any>({});

  /* -------------------------
     Gallery
  ------------------------- */

  const [activeMediaTab, setActiveMediaTab] = useState<
    "photos" | "videos" | "floorplans"
  >("photos");

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );

  /* -------------------------
     Documents
  ------------------------- */

  const [selectedDoc, setSelectedDoc] =
    useState<PropertyDocument | null>(null);

  /* -------------------------
     Inquiry
  ------------------------- */

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  /* -------------------------
     Mobile nav
  ------------------------- */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =========================================================
     FETCH PROPERTY
  ========================================================= */

  const fetchPropertyData = async (codeToTry?: string) => {
    setLoading(true);
    setError(null);
    setPasscodeError("");

    try {
      let url = `/api/shared/${token}`;

      if (codeToTry) {
        url += `?passcode=${encodeURIComponent(codeToTry)}`;
      }

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (res.status === 401 && data.requiresPasscode) {
        setRequiresPasscode(true);
        setLoading(false);

        if (codeToTry) {
          setPasscodeError("Incorrect passcode. Please try again.");
        }

        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to load property");
        setLoading(false);
        return;
      }

      setRequiresPasscode(false);
      setProperty(data.property);
      console.log('[SharedPage] API response:', JSON.stringify(data, null, 2));

      setLeadName(data.leadName || "");
      setSalespersonId(data.salespersonId || "");
      // Default all permissions to true if not specified by the sharelink
      setPermissions({
        showBasicDetails: true,
        showFullDescription: true,
        showAdditionalPhotos: true,
        showVideos: true,
        showFloorPlans: true,
        showPublicDocuments: true,
        showPrice: true,
        showExactLocation: true,
        showAmenities: true,
        showSpecifications: true,
        showOwnerDetails: true,
        ...(data.permissions || {}),
      });

      if (data.leadName) {
        setInquiryName(data.leadName);
      }

      if (data.leadPhone) {
        setInquiryPhone(data.leadPhone);
      }

      if (data.leadEmail) {
        setInquiryEmail(data.leadEmail);
      }
    } catch (err) {
      console.error("Error loading shared property:", err);
      setError("An error occurred while connecting to ALYORA.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPropertyData();
    }
  }, [token]);

  /* =========================================================
     PASSCODE
  ========================================================= */

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passcode.trim()) {
      setPasscodeError("Please enter the access code.");
      return;
    }

    fetchPropertyData(passcode);
  };

  /* =========================================================
     DOCUMENT AUDIT
  ========================================================= */

  const handleLogDocAudit = async (
    docName: string,
    action: "DOCUMENT_VIEWED" | "DOCUMENT_DOWNLOADED"
  ) => {
    try {
      await fetch(`/api/shared/${token}/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          documentName: docName,
        }),
      });
    } catch (err) {
      console.error("Audit log error:", err);
    }
  };

  const handleViewDoc = (doc: PropertyDocument) => {
    setSelectedDoc(doc);
    handleLogDocAudit(doc.name, "DOCUMENT_VIEWED");
  };

  const handleDownloadDoc = (doc: PropertyDocument) => {
    handleLogDocAudit(doc.name, "DOCUMENT_DOWNLOADED");

    window.open(doc.url, "_blank", "noopener,noreferrer");
  };

  /* =========================================================
     INQUIRY
  ========================================================= */

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property) return;

    setInquirySubmitting(true);
    setInquirySuccess(false);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property._id,
          propertyName: property.name,
          name: inquiryName,
          phone: inquiryPhone,
          email: inquiryEmail,
          message:
            inquiryMessage ||
            `Inquiry from shared property link for property: ${property.name}`,
          source: `SHARE_LINK_${token}`,
          salespersonId: salespersonId || undefined,
        }),
      });

      if (res.ok) {
        setInquirySuccess(true);
        setInquiryMessage("");
      } else {
        alert("Failed to send inquiry. Please try again.");
      }
    } catch (err) {
      console.error("Inquiry error:", err);
      alert("Network error. Please try again.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  /* =========================================================
     MEDIA
  ========================================================= */

  const photos = useMemo(() => {
    return (
      property?.media?.filter(
        (media) => media.type === "photo" || !media.type
      ) || []
    );
  }, [property]);

  const videos = useMemo(() => {
    return (
      property?.media?.filter((media) => media.type === "video") || []
    );
  }, [property]);

  const floorplans = useMemo(() => {
    return (
      property?.media?.filter((media) => media.type === "floorplan") || []
    );
  }, [property]);

  /* =========================================================
     GALLERY NAVIGATION
  ========================================================= */

  const openPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePhoto = () => {
    setSelectedPhotoIndex(null);
  };

  const previousPhoto = () => {
    if (selectedPhotoIndex === null || photos.length === 0) return;

    setSelectedPhotoIndex(
      selectedPhotoIndex === 0
        ? photos.length - 1
        : selectedPhotoIndex - 1
    );
  };

  const nextPhoto = () => {
    if (selectedPhotoIndex === null || photos.length === 0) return;

    setSelectedPhotoIndex(
      selectedPhotoIndex === photos.length - 1
        ? 0
        : selectedPhotoIndex + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;

      if (event.key === "Escape") {
        closePhoto();
      }

      if (event.key === "ArrowLeft") {
        previousPhoto();
      }

      if (event.key === "ArrowRight") {
        nextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhotoIndex, photos.length]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");

          :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f7f9f9;
            --brand-navy: #153545;
            --brand-gold: #cbbf9d;
            --text-muted: #657176;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: "Outfit", sans-serif;
          }

          .serif {
            font-family: "Playfair Display", Georgia, serif;
          }
        `}</style>

        <div className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border border-[#cbbf9d] flex items-center justify-center mx-auto mb-5">
              <span className="serif text-xl text-[#153545]">A</span>
            </div>

            <div className="w-5 h-5 border-2 border-[#153545]/20 border-t-[#153545] rounded-full animate-spin mx-auto mb-4" />

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#657176]">
              Preparing property
            </p>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     PASSCODE SCREEN
  ========================================================= */

  if (requiresPasscode) {
    return (
      <div className="min-h-screen bg-[#f7f9f9] text-[#153545] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white rounded-[24px] border border-[#e8edee] shadow-[0_20px_60px_rgba(21,53,69,0.08)] p-8 sm:p-10">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border border-[#cbbf9d] flex items-center justify-center mx-auto mb-6">
              <Lock className="w-5 h-5 text-[#153545]" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a8a68] mb-3">
              Private Property
            </p>

            <h1 className="serif text-3xl text-[#153545]">
              Private access
            </h1>

            <p className="text-sm text-[#657176] leading-relaxed mt-4">
              This property presentation is protected. Enter the access code
              provided by ALYORA to continue.
            </p>
          </div>

          <form
            onSubmit={handlePasscodeSubmit}
            className="mt-8 space-y-4"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] font-medium text-[#657176] mb-2">
                Access code
              </label>

              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter access code"
                autoFocus
                className="w-full h-12 rounded-xl border border-[#dfe5e5] bg-white px-4 text-center tracking-[0.25em] text-[#153545] outline-none focus:border-[#9a8a68] transition"
              />

              {passcodeError && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#153545] text-white text-sm font-medium hover:bg-[#1e4559] transition flex items-center justify-center gap-2"
            >
              Unlock presentation
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="border-t border-[#e8edee] mt-8 pt-5 text-center">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#9ab4be]">
              ALYORA
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR SCREEN
  ========================================================= */

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#f7f9f9] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white rounded-[24px] border border-[#e8edee] p-8 text-center shadow-[0_20px_60px_rgba(21,53,69,0.08)]">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a8a68] mb-2">
            ALYORA
          </p>

          <h1 className="serif text-3xl text-[#153545]">
            Access unavailable
          </h1>

          <p className="text-sm text-[#657176] leading-relaxed mt-4">
            {error || "This property presentation could not be loaded."}
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-full bg-[#153545] text-white text-sm font-medium hover:bg-[#1e4559] transition"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE - MINIMAL LUXURY ONE-PAGE PRESENTATION
  ========================================================= */

  const coverImageUrl =
    property.image?.secure_url ||
    property.image_url ||
    photos[0]?.secure_url ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="min-h-screen bg-white text-[#0F2D3A] flex flex-col font-sans selection:bg-[#cbbf9d] selection:text-[#0F2D3A]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");

        body {
          margin: 0;
          font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
          background: #ffffff;
          color: #0F2D3A;
          -webkit-font-smoothing: antialiased;
        }

        .serif {
          font-family: "Playfair Display", Georgia, serif;
        }
      `}</style>

      {/* =====================================================
          TOP NAVIGATION (LOGO · VERIFIED · WHATSAPP CTA)
      ===================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e8edee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full border border-[#cbbf9d] flex items-center justify-center bg-[#0F2D3A] text-white">
              <span className="serif text-sm font-semibold">A</span>
            </div>
            <div className="flex flex-col">
              <span className="serif text-base tracking-[0.18em] font-bold text-[#0F2D3A]">ALYORA</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#657176]">Private Selection</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f4f5] text-[11px] font-semibold text-[#0F2D3A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Verified Listing</span>
            </div>

            <a
              href={buildWhatsAppUrl(property.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0F2D3A] hover:bg-[#153e50] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#cbbf9d]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN DASHBOARD CONTAINER (COMPACT, ONE-PAGE DESIGN)
      ===================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col gap-6">

        {/* 1. HERO SECTION WITH PROPERTY IMAGE & OVERLAY */}
        <div className="relative w-full h-[38vh] sm:h-[42vh] min-h-[260px] max-h-[440px] rounded-3xl overflow-hidden shadow-xl group border border-[#e8edee]">
          <img
            src={coverImageUrl}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D3A]/90 via-[#0F2D3A]/30 to-transparent" />

          {/* Top badges on hero */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase tracking-wider font-bold text-[#0F2D3A] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {property.tag || "Exclusive"}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-medium">
              <Eye className="w-3 h-3 text-[#cbbf9d]" />
              Single Private Unit
            </span>
          </div>

          {/* Hero Bottom Overlay: Title + Price + Location */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#cbbf9d]" />
                <span>{property.location}</span>
              </div>
              <h1 className="serif text-2xl sm:text-4xl font-bold tracking-tight text-white capitalize leading-tight">
                {property.name}
              </h1>
            </div>

            {permissions.showPrice !== false && property.price && (
              <div className="text-left sm:text-right shrink-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <div className="text-[10px] uppercase tracking-wider text-white/70">Asking Price</div>
                <div className="serif text-xl sm:text-2xl font-bold text-white">{property.price}</div>
              </div>
            )}
          </div>
        </div>

        {/* 2. MAIN 2-COLUMN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT 2 COLUMNS: INFO GRID + HIGHLIGHTS + GALLERY */}
          <div className="lg:col-span-2 space-y-6">

            {/* 3-COLUMN INFORMATION GRID */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-[#f8fafb] p-4 rounded-2xl border border-[#e8edee]">
              <div className="bg-white p-3.5 rounded-xl border border-[#e8edee] shadow-2xs">
                <p className="text-[9px] uppercase tracking-wider font-bold text-[#657176] mb-1">Property Type</p>
                <p className="font-semibold text-sm text-[#0F2D3A] truncate">{property.propertyType || "Commercial / Shop"}</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#e8edee] shadow-2xs">
                <p className="text-[9px] uppercase tracking-wider font-bold text-[#657176] mb-1">Category / Size</p>
                <p className="font-semibold text-sm text-[#0F2D3A] truncate">
                  {property.area ? `${property.area} sqft` : property.plot ? `${property.plot} Plot` : property.beds ? `${property.beds} Bed / ${property.baths || 0} Bath` : property.tag || "Standard"}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#e8edee] shadow-2xs">
                <p className="text-[9px] uppercase tracking-wider font-bold text-[#657176] mb-1">Location</p>
                <p className="font-semibold text-sm text-[#0F2D3A] truncate">{property.location?.split(',')[0] || "Prime Area"}</p>
              </div>
            </div>

            {/* DESCRIPTION & KEY HIGHLIGHTS */}
            {permissions.showFullDescription !== false && property.description && (
              <div className="bg-white p-5 rounded-2xl border border-[#e8edee] space-y-3">
                <div className="flex items-center justify-between border-b border-[#e8edee] pb-2.5">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#0F2D3A] flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#cbbf9d]" /> Property Overview
                  </h3>
                  <span className="text-[10px] text-[#657176] font-medium">Curated by ALYORA</span>
                </div>
                <p className="text-xs sm:text-sm text-[#4a575d] leading-relaxed italic">
                  "{property.description.replace(/^"/, '').replace(/"$/, '')}"
                </p>
              </div>
            )}

            {/* AMENITIES & SPECIFICATIONS (COMPACT BADGES) */}
            {((permissions.showAmenities !== false && property.amenities && property.amenities.length > 0) ||
              (permissions.showSpecifications !== false && property.specifications && property.specifications.length > 0)) && (
                <div className="bg-[#f8fafb] p-5 rounded-2xl border border-[#e8edee] space-y-4">
                  {permissions.showAmenities !== false && property.amenities && property.amenities.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[#657176] mb-2.5">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e8edee] text-xs font-medium text-[#0F2D3A] shadow-2xs">
                            <CheckCircle className="w-3 h-3 text-[#2E7D32]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {permissions.showSpecifications !== false && property.specifications && property.specifications.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[#657176] mb-2.5">Specifications</p>
                      <div className="grid grid-cols-2 gap-2">
                        {property.specifications.map((spec, i) => (
                          <div key={i} className="bg-white p-2.5 rounded-xl border border-[#e8edee] flex justify-between items-center text-xs">
                            <span className="text-[#657176] font-medium">{spec.key}</span>
                            <span className="font-semibold text-[#0F2D3A]">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* PHOTO GALLERY THUMBNAIL PREVIEWS */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#0F2D3A] flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5 text-[#cbbf9d]" /> Media Gallery ({photos.length} photos)
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {photos.slice(0, 3).map((photo, index) => (
                    <div
                      key={index}
                      onClick={() => openPhoto(index)}
                      className="relative h-24 sm:h-28 rounded-2xl overflow-hidden border border-[#e8edee] cursor-pointer group shadow-2xs"
                    >
                      <img
                        src={photo.secure_url}
                        alt={photo.caption || `Photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONFIDENTIAL OWNER & BROKER DETAILS (IF PERMITTED) */}
            {permissions.showOwnerDetails && (property.ownerDetails?.name || property.ownerDetails?.phone || property.brokerDetails?.name) && (
              <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs uppercase tracking-wider font-bold text-[#0F2D3A]">Confidential Contacts</h3>
                  </div>
                  <span className="text-[9px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded">PRIVATE</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  {property.ownerDetails && (property.ownerDetails.name || property.ownerDetails.phone) && (
                    <div className="bg-white p-3.5 rounded-xl border border-amber-500/20 space-y-1.5">
                      <p className="text-[10px] uppercase font-bold text-gray-500">Owner Details</p>
                      {property.ownerDetails.name && <p className="font-semibold text-[#0F2D3A]">{property.ownerDetails.name}</p>}
                      {property.ownerDetails.phone && (
                        <p><a href={`tel:${property.ownerDetails.phone}`} className="font-semibold text-blue-600 hover:underline">{property.ownerDetails.phone}</a></p>
                      )}
                      {property.ownerDetails.notes && <p className="text-gray-500 text-[11px]">{property.ownerDetails.notes}</p>}
                    </div>
                  )}

                  {property.brokerDetails && (property.brokerDetails.name || property.brokerDetails.phone) && (
                    <div className="bg-white p-3.5 rounded-xl border border-amber-500/20 space-y-1.5">
                      <p className="text-[10px] uppercase font-bold text-gray-500">Broker / Agency</p>
                      {property.brokerDetails.name && <p className="font-semibold text-[#0F2D3A]">{property.brokerDetails.name}</p>}
                      {property.brokerDetails.agency && <p className="text-gray-500">{property.brokerDetails.agency}</p>}
                      {property.brokerDetails.phone && (
                        <p><a href={`tel:${property.brokerDetails.phone}`} className="font-semibold text-blue-600 hover:underline">{property.brokerDetails.phone}</a></p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ATTACHED DOCUMENTS PREVIEW (IF ANY) */}
            {permissions.showPublicDocuments !== false && property.documents && property.documents.length > 0 && (
              <div className="bg-[#f8fafb] p-4 rounded-2xl border border-[#e8edee] space-y-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#657176]">Property Documents</p>
                <div className="space-y-2">
                  {property.documents.map((doc, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-[#e8edee] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-[#0F2D3A] shrink-0" />
                        <span className="font-medium text-[#0F2D3A] truncate">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleViewDoc(doc)} className="px-3 py-1 rounded-lg bg-[#0F2D3A] text-white text-[11px] font-medium">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDE: PRIMARY CTA CARD WITH BOOK VIEWING BUTTON */}
          <div className="lg:col-span-1 sticky top-20">
            <div className="bg-[#0F2D3A] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-[#0F2D3A] space-y-6">

              {/* CARD HEADER */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#cbbf9d] text-[10px] uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Presentation
                </div>
                <h3 className="serif text-2xl font-bold text-white">Interested in this property?</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Book a private viewing or connect directly with our dedicated ALYORA advisor.
                </p>
              </div>

              {/* PRIMARY ACTION BUTTON */}
              <a
                href={buildWhatsAppUrl(property.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#cbbf9d] hover:bg-[#b8ab87] text-[#0F2D3A] font-bold py-3.5 px-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm text-center"
              >
                <Phone className="w-4 h-4" />
                <span>Schedule Private Viewing</span>
              </a>

              {/* SUBTLE URGENCY */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2.5 text-xs text-white/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Only one private unit available for this key location.</span>
              </div>

              {/* INQUIRY QUICK FORM */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Request Callback</p>

                {inquirySuccess ? (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-center text-xs text-emerald-300">
                    ✓ Request sent! Our team will contact you shortly.
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#cbbf9d]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#cbbf9d]"
                    />
                    <button
                      type="submit"
                      disabled={inquirySubmitting}
                      className="w-full bg-white/15 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                    >
                      {inquirySubmitting ? "Sending..." : "Request Call"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* =====================================================
          FOOTER (MINIMAL, SINGLE LINE)
      ===================================================== */}
      <footer className="border-t border-[#e8edee] py-4 mt-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#657176] gap-2">
          <div className="flex items-center gap-2">
            <span className="serif font-bold text-[#0F2D3A]">ALYORA</span>
            <span>· Property Presentation</span>
          </div>
          <p className="text-[11px]">© {new Date().getFullYear()} ALYORA Real Estate. All rights reserved.</p>
        </div>
      </footer>

      {/* =====================================================
          PHOTO LIGHTBOX MODAL
      ===================================================== */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div className="fixed inset-0 z-[100] bg-[#0F2D3A]/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closePhoto}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={previousPhoto}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={photos[selectedPhotoIndex].secure_url}
              alt={photos[selectedPhotoIndex].caption || property.name}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white/80 text-xs mt-3">
              {selectedPhotoIndex + 1} / {photos.length}
            </p>
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* =====================================================
          PDF DOCUMENT PREVIEW MODAL
      ===================================================== */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[90] bg-[#0F2D3A]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[88vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="h-14 px-5 border-b border-[#e8edee] flex items-center justify-between">
              <span className="font-semibold text-xs text-[#0F2D3A]">{selectedDoc.name}</span>
              <button onClick={() => setSelectedDoc(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-[#0F2D3A]" />
              </button>
            </div>
            <div className="flex-1 p-2 bg-[#f8fafb]">
              <iframe src={selectedDoc.url} className="w-full h-full rounded-2xl border border-[#e8edee]" title={selectedDoc.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}