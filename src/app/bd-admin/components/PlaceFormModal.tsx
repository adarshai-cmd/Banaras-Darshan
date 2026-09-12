"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  Loader2,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  MapPin,
  Clock,
  Car,
  Utensils,
  Plus,
  Star,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

interface PlaceFormModalProps {
  place?: any;
  defaultCategory?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedPlace: any) => void;
  availableParkings?: any[];
  allPlaces?: any[];
}

export function PlaceFormModal({
  place,
  defaultCategory = "TEMPLE",
  isOpen,
  onClose,
  onSuccess,
  availableParkings = [],
  allPlaces = [],
}: PlaceFormModalProps) {
  const isEditing = Boolean(place?.id);

  const [activeTab, setActiveTab] = useState<"basic" | "location" | "details" | "photos" | "parking">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(place?.name || "");
  const [hindiName, setHindiName] = useState(place?.hindiName || "");
  const [category, setCategory] = useState(place?.category || defaultCategory);
  const [subCategory, setSubCategory] = useState(place?.subCategory || "");
  const [tagline, setTagline] = useState(place?.tagline || "");
  const [description, setDescription] = useState(place?.description || "");
  const [history, setHistory] = useState(place?.history || "");

  const [address, setAddress] = useState(place?.address || "");
  const [area, setArea] = useState(place?.area || "Varanasi");
  const [latitude, setLatitude] = useState(place?.latitude?.toString() || "25.3109");
  const [longitude, setLongitude] = useState(place?.longitude?.toString() || "83.0107");
  const [nearestHub, setNearestHub] = useState(place?.nearestHub || "");

  const [approxBudget, setApproxBudget] = useState(place?.approxBudget || "Free");
  const [budgetTier, setBudgetTier] = useState(place?.budgetTier || "BUDGET");
  const [bestTimeToVisit, setBestTimeToVisit] = useState(place?.bestTimeToVisit || "");
  const [openingHours, setOpeningHours] = useState(place?.openingHours || "");
  const [visitingTips, setVisitingTips] = useState(place?.visitingTips || "");
  const [safetyNotes, setSafetyNotes] = useState(place?.safetyNotes || "");
  const [tags, setTags] = useState(place?.tags || "Heritage,Varanasi");
  const [isVerified, setIsVerified] = useState(place?.isVerified ?? true);
  const [isFeatured, setIsFeatured] = useState(place?.isFeatured ?? false);
  const [isHiddenGem, setIsHiddenGem] = useState(place?.isHiddenGem ?? false);

  // Food / Stay specifics
  const [popularDishes, setPopularDishes] = useState(place?.popularDishes || "");
  const [isPureVeg, setIsPureVeg] = useState(place?.isPureVeg ?? false);
  const [amenities, setAmenities] = useState(place?.amenities || "");

  // Main Image & Gallery
  const [image, setImage] = useState(
    place?.image ||
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
  );
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; caption?: string }>>(() => {
    if (place?.galleryJson) {
      try {
        return JSON.parse(place.galleryJson);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Nearby Parking selection
  const [selectedParkingId, setSelectedParkingId] = useState(() => {
    if (place?.parkingInfo) {
      try {
        const parsed = JSON.parse(place.parkingInfo);
        return parsed.primary?.id || "";
      } catch {}
    }
    return "";
  });
  const [parkingCustomNote, setParkingCustomNote] = useState(() => {
    if (place?.parkingInfo) {
      try {
        const parsed = JSON.parse(place.parkingInfo);
        return parsed.pedestrianAdvice || parsed.primary?.note || "";
      } catch {}
    }
    return "";
  });

  if (!isOpen) return null;

  // Handle image upload from computer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    if (isGallery) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    } else {
      formData.append("file", files[0]);
    }

    try {
      const res = await fetch("/api/bd-admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (isGallery) {
          const newImgs = data.files.map((f: any) => ({ url: f.url, caption: f.originalName }));
          setGalleryImages((prev) => [...prev, ...newImgs]);
        } else {
          setImage(data.url);
        }
      } else {
        setErrorMessage(data.error || "Upload failed.");
      }
    } catch {
      setErrorMessage("Network error during image upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !tagline.trim() || !description.trim() || !address.trim() || !image.trim()) {
      setErrorMessage("Please complete all required fields (Name, Tagline, Description, Address, and Image).");
      return;
    }

    setIsSubmitting(true);

    // Build Parking JSON
    let parkingJsonPayload: string | null = null;
    if (selectedParkingId) {
      const pObj = availableParkings.find((p) => p.id === selectedParkingId);
      if (pObj) {
        parkingJsonPayload = JSON.stringify({
          primary: {
            id: pObj.id,
            name: pObj.name,
            distance: "100m – 300m walking",
            feeStatus: pObj.feeStatus,
            feeRate: pObj.feeRate,
            vehicleSupport: pObj.vehicleSupport,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              pObj.name + " " + pObj.address
            )}`,
            note: parkingCustomNote || pObj.directionsNote,
          },
          pedestrianAdvice: parkingCustomNote,
        });
      }
    } else if (parkingCustomNote.trim()) {
      parkingJsonPayload = JSON.stringify({
        primary: null,
        pedestrianAdvice: parkingCustomNote.trim(),
      });
    }

    const payload = {
      name: name.trim(),
      hindiName: hindiName.trim() || null,
      category,
      subCategory: subCategory.trim() || null,
      tagline: tagline.trim(),
      description: description.trim(),
      history: history.trim() || null,
      address: address.trim(),
      area: area.trim(),
      latitude: parseFloat(latitude) || 25.3109,
      longitude: parseFloat(longitude) || 83.0107,
      image: image.trim(),
      approxBudget: approxBudget.trim(),
      budgetTier,
      bestTimeToVisit: bestTimeToVisit.trim() || null,
      openingHours: openingHours.trim() || null,
      visitingTips: visitingTips.trim() || null,
      safetyNotes: safetyNotes.trim() || null,
      tags: tags.trim(),
      isVerified,
      isFeatured,
      isHiddenGem,
      popularDishes: popularDishes.trim() || null,
      isPureVeg,
      amenities: amenities.trim() || null,
      nearestHub: nearestHub.trim() || null,
      parkingInfo: parkingJsonPayload,
      galleryJson: galleryImages.length > 0 ? JSON.stringify(galleryImages) : null,
    };

    try {
      const url = isEditing ? `/api/bd-admin/places/${place.id}` : "/api/bd-admin/places";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess(data.place);
        onClose();
      } else {
        setErrorMessage(data.error || "Failed to save place.");
      }
    } catch {
      setErrorMessage("Network error saving place.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#1E293B] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150 text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-700/80 bg-[#162032] flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
              <span>{isEditing ? `Edit: ${place.name}` : `Create New ${category}`}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Updates save directly to the live database and instantly appear on public pages.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-2 bg-[#141B2D] border-b border-slate-700/60 overflow-x-auto text-xs scrollbar-none">
          {[
            { id: "basic", label: "1. Basic Info" },
            { id: "location", label: "2. Location & Map" },
            { id: "details", label: "3. Timings & Rules" },
            { id: "photos", label: "4. Photos & Gallery" },
            { id: "parking", label: "5. Parking & Transit" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="m-4 p-3 rounded-xl bg-rose-950/70 border border-rose-600/50 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Body Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Place Name (English) *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shri Kashi Vishwanath Temple"
                    required
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Name in Hindi (हिंदी नाम)</label>
                  <input
                    type="text"
                    value={hindiName}
                    onChange={(e) => setHindiName(e.target.value)}
                    placeholder="उदा. श्री काशी विश्वनाथ मंदिर"
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Primary Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="TEMPLE">Temple (मंदिर)</option>
                    <option value="GHAT">Ghat (घाट)</option>
                    <option value="FOOD">Food / Restaurant / Sweets (खान-पान)</option>
                    <option value="HOTEL">Stay / Hotel / Hostel (ठहरना)</option>
                    <option value="HIDDEN">Hidden Gem / Underground Well</option>
                    <option value="STREET">Heritage Street / Market Gali</option>
                    <option value="EXPERIENCE">Cultural Experience / Aarti</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Sub-Category / Badge</label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="e.g. Jyotirlinga, Dawn Aarti, Street Chaat, Boutique Haveli"
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Tagline / One-Liner Summary *</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. The supreme Jyotirlinga of Lord Shiva on the sacred Ganga."
                  required
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description for travelers..."
                  required
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Historical & Cultural Background</label>
                <textarea
                  rows={3}
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="Puranic mentions, architectural construction history, royalty associations..."
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  <span>✓ Verified in Heritage Index</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  <span>⭐ Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHiddenGem}
                    onChange={(e) => setIsHiddenGem(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  <span>💎 Hidden Gem</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION & MAP */}
          {activeTab === "location" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Physical Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Lahori Tola, Varanasi, Uttar Pradesh 221001"
                  required
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Area / Neighborhood *</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Assi, Dashashwamedh, Chowk, Lanka..."
                    required
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="25.3109"
                    required
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="83.0107"
                    required
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nearest Transit Hub Distance</label>
                <input
                  type="text"
                  value={nearestHub}
                  onChange={(e) => setNearestHub(e.target.value)}
                  placeholder="e.g. Cantt Railway Station: 4.5 km | Dashashwamedh Ghat: 250m"
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: TIMINGS & DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Estimated Cost / Budget *</label>
                  <input
                    type="text"
                    value={approxBudget}
                    onChange={(e) => setApproxBudget(e.target.value)}
                    placeholder="Free / ₹50 - ₹150 / ₹1,500 - ₹3,000"
                    required
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Budget Tier</label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="FREE">Free</option>
                    <option value="BUDGET">Budget (under ₹300)</option>
                    <option value="MID_RANGE">Mid-Range (₹300 – ₹2,000)</option>
                    <option value="LUXURY">Luxury / Heritage (₹2,000+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Best Time to Visit</label>
                  <input
                    type="text"
                    value={bestTimeToVisit}
                    onChange={(e) => setBestTimeToVisit(e.target.value)}
                    placeholder="e.g. 05:00 AM (Dawn Aarti) or 06:00 PM – 08:00 PM"
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Opening Hours</label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="e.g. 03:00 AM – 11:00 PM (Temple closes for Bhog 11:30 AM – 12:30 PM)"
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Local Traveler Advice / Visiting Tips</label>
                <textarea
                  rows={2}
                  value={visitingTips}
                  onChange={(e) => setVisitingTips(e.target.value)}
                  placeholder="Locker rules, avoiding touts, best ghat steps, camera restrictions..."
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Safety & Etiquette Notes</label>
                <textarea
                  rows={2}
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  placeholder="Dress code, crowd warning, cremation photography bans..."
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Temple, Shiva, Jyotirlinga, Aarti, Heritage"
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Food specific */}
              {category === "FOOD" && (
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-amber-400">Popular Signature Dishes</label>
                    <input
                      type="text"
                      value={popularDishes}
                      onChange={(e) => setPopularDishes(e.target.value)}
                      placeholder="Tamatar Chaat, Palak Patta Chaat, Malaiyo, Lassi..."
                      className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPureVeg}
                      onChange={(e) => setIsPureVeg(e.target.checked)}
                      className="rounded text-emerald-500 w-4 h-4 bg-slate-900 border-slate-700"
                    />
                    <span>🌱 100% Pure Vegetarian (No Onion/Garlic option)</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PHOTOS & GALLERY (POINT 5) */}
          {activeTab === "photos" && (
            <div className="space-y-5">
              {/* Primary Image */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-400 text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Main / Featured Photo *</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Displayed in cards & hero headers</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-32 h-24 rounded-xl overflow-hidden bg-black/40 border border-slate-700 shrink-0 relative">
                    <SafeImage src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Paste Image URL or upload below..."
                      required
                      className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                      {isUploading && (
                        <span className="text-[11px] text-amber-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading to server...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Photos */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-200 text-sm">
                      Additional Gallery Images ({galleryImages.length})
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Upload multiple photos for this place without editing source code.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Gallery Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>

                {galleryImages.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-slate-900/60 border border-dashed border-slate-700 text-slate-500">
                    No extra gallery photos yet. Click &quot;Add Gallery Photos&quot; to upload multiple images.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((gImg, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 h-28 flex flex-col justify-between p-1.5"
                      >
                        <SafeImage
                          src={gImg.url}
                          alt={`Gallery ${idx}`}
                          className="absolute inset-0 w-full h-full object-cover -z-0"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors -z-0" />

                        <button
                          type="button"
                          onClick={() => setImage(gImg.url)}
                          className="self-start text-[10px] px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/40 relative z-10 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="Set as Main Image"
                        >
                          Make Primary
                        </button>

                        <button
                          type="button"
                          onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="self-end p-1 rounded-md bg-rose-600/80 text-white relative z-10 hover:bg-rose-600 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PARKING & TRANSIT */}
          {activeTab === "parking" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>Link Verified Nearby Parking Stand</span>
                </label>
                <select
                  value={selectedParkingId}
                  onChange={(e) => setSelectedParkingId(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- No Direct Parking Linked / Old City Lane --</option>
                  {availableParkings.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.area} • {p.capacity || "Parking available"})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Select an official parking location to automatically generate navigation links and walking distance badges on the public detail page.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Walking & Vehicle Access Advice</label>
                <textarea
                  rows={3}
                  value={parkingCustomNote}
                  onChange={(e) => setParkingCustomNote(e.target.value)}
                  placeholder="e.g. Vehicles restricted beyond Godowlia after 4 PM. Park at Godowlia Multi-Level and take a 5-minute walk through Vishwanath Gali."
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditing ? "Save & Publish Changes" : "Create & Publish Place"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
