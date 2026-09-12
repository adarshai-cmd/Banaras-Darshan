"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface PromotionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  promotion?: any | null;
}

export function PromotionFormModal({
  isOpen,
  onClose,
  onSuccess,
  promotion,
}: PromotionFormModalProps) {
  const isEditing = Boolean(promotion?.id);

  const [title, setTitle] = useState(promotion?.title || "");
  const [shortTitle, setShortTitle] = useState(promotion?.shortTitle || "");
  const [category, setCategory] = useState(promotion?.category || "EVENT");
  const [badgeText, setBadgeText] = useState(promotion?.badgeText || "SPECIAL");
  const [description, setDescription] = useState(promotion?.description || "");
  const [imageUrl, setImageUrl] = useState(
    promotion?.imageUrl ||
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"
  );
  const [ctaText, setCtaText] = useState(promotion?.ctaText || "View Details");
  const [destinationUrl, setDestinationUrl] = useState(promotion?.destinationUrl || "");
  const [bookingUrl, setBookingUrl] = useState(promotion?.bookingUrl || "");
  const [location, setLocation] = useState(promotion?.location || "");
  const [address, setAddress] = useState(promotion?.address || "");
  const [contactPhone, setContactPhone] = useState(promotion?.contactPhone || "");
  const [contactEmail, setContactEmail] = useState(promotion?.contactEmail || "");

  const [startDate, setStartDate] = useState(
    promotion?.startDate ? new Date(promotion.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    promotion?.endDate ? new Date(promotion.endDate).toISOString().split("T")[0] : ""
  );
  const [startTime, setStartTime] = useState(promotion?.startTime || "");
  const [endTime, setEndTime] = useState(promotion?.endTime || "");

  const [placement, setPlacement] = useState(promotion?.placement || "BOTH");
  const [priority, setPriority] = useState(promotion?.priority?.toString() || "5");
  const [displayOrder, setDisplayOrder] = useState(promotion?.displayOrder?.toString() || "0");
  const [isActive, setIsActive] = useState(promotion?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(promotion?.isFeatured ?? false);
  const [autoRotationDuration, setAutoRotationDuration] = useState(
    promotion?.autoRotationDuration?.toString() || "4500"
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "promotions");

      const res = await fetch("/api/bd-admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setImageUrl(data.url);
      } else {
        setErrorMsg(data.error || "File upload failed.");
      }
    } catch {
      setErrorMsg("Network error during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Title and description are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      title: title.trim(),
      shortTitle: shortTitle.trim() || null,
      category,
      badgeText: badgeText.trim() || null,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      ctaText: ctaText.trim() || "View Details",
      destinationUrl: destinationUrl.trim() || null,
      bookingUrl: bookingUrl.trim() || null,
      location: location.trim() || null,
      address: address.trim() || null,
      contactPhone: contactPhone.trim() || null,
      contactEmail: contactEmail.trim() || null,
      startDate: startDate || null,
      endDate: endDate || null,
      startTime: startTime.trim() || null,
      endTime: endTime.trim() || null,
      placement,
      priority: parseInt(priority, 10) || 5,
      displayOrder: parseInt(displayOrder, 10) || 0,
      isActive,
      isFeatured,
      autoRotationDuration: parseInt(autoRotationDuration, 10) || 4500,
    };

    try {
      const url = isEditing
        ? `/api/bd-admin/promotions/${promotion.id}`
        : `/api/bd-admin/promotions`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
      } else {
        setErrorMsg(data.error || "Failed to save promotion.");
      }
    } catch {
      setErrorMsg("Network error saving promotion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-3xl rounded-3xl bg-[#161E2E] border border-slate-700 shadow-2xl p-6 space-y-5 my-8 max-h-[92vh] flex flex-col text-xs text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                {isEditing ? `Edit Promotion: ${promotion.title}` : "Create New Promotion / Ad"}
              </h3>
              <p className="text-[11px] text-slate-400">
                Dynamic promotional card displayed on the Banaras Darshan homepage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form id="promoForm" onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
          {/* Row 1: Title & Short Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">
                Full Promotion Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grand Ganga Maha Aarti Tonight at Dashashwamedh"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Short Display Title
              </label>
              <input
                type="text"
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
                placeholder="e.g. Ganga Aarti Tonight"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Row 2: Category, Badge Text & Placement */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value="EVENT">Event</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="FOOD_OFFER">Food Offer</option>
                <option value="DISCOUNT">Discount</option>
                <option value="FESTIVAL">Festival</option>
                <option value="TEMPLE_EVENT">Temple Event</option>
                <option value="CULTURAL_EVENT">Cultural Event</option>
                <option value="TRAVEL_OFFER">Travel Offer</option>
                <option value="LOCAL_BUSINESS">Local Business</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Badge Text (e.g. 20% OFF, TONIGHT)
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="TONIGHT • 6:30 PM"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Placement Slot *
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
              >
                <option value="BOTH">Both Slots (Left, Right & Mobile)</option>
                <option value="LEFT">Left Desktop Slot Only</option>
                <option value="RIGHT">Right Desktop Slot Only</option>
              </select>
            </div>
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Short Description / Narrative *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide engaging context for travelers in 2-3 sentences..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
            />
          </div>

          {/* Row 4: Promotional Image & Direct File Upload */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Promotional Image</span>
              </span>
              {isUploading && (
                <span className="text-amber-400 animate-pulse text-[11px]">
                  Uploading to server...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div className="sm:col-span-3 space-y-2">
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or /uploads/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-[11px]"
                />
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer inline-flex items-center gap-1 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo to Server</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Saves directly to public/uploads/
                  </span>
                </div>
              </div>

              {/* Thumbnail Preview */}
              <div className="sm:col-span-1">
                {imageUrl && (
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
                    <Image
                      src={imageUrl}
                      alt="Promo preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 5: CTA & Destination Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="View Details / Get Offer"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Destination Link (Internal/External)
              </label>
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="/ghats or /food or https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Booking URL (Optional)
              </label>
              <input
                type="text"
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Row 6: Location & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Location Name / Landmark
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dashashwamedh Ghat"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Full Address (for Google Maps Navigation)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Dashashwamedh Ghat Riverfront, Varanasi"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Row 7: Scheduling (Start Date, End Date, Start Time, End Time) */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Automated Scheduling & Expiration</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  End Date (Auto-Expires)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Start Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="06:30 PM"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">End Time</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="08:00 PM"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 8: Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Contact Phone (Optional)
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 94500 12345"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@banarasdarshan.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Row 9: Priority, Display Order, Rotation Duration & Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Priority (1–10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Order Index
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Rotation Interval
              </label>
              <select
                value={autoRotationDuration}
                onChange={(e) => setAutoRotationDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value="3500">3.5 seconds</option>
                <option value="4500">4.5 seconds (Standard)</option>
                <option value="6000">6.0 seconds</option>
                <option value="8000">8.0 seconds</option>
              </select>
            </div>
            <div className="flex flex-col justify-center space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-amber-500 w-4 h-4"
                />
                <span className="text-white font-bold text-xs">Active on Public Site</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-amber-500 w-4 h-4"
                />
                <span className="text-slate-400 text-[11px]">Featured Highlight</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="promoForm"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Promotion"
              : "Create Promotion"}
          </button>
        </div>
      </div>
    </div>
  );
}
