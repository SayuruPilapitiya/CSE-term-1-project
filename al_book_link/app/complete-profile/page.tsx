"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";

type TownRecord = {
  town_id: number;
  town_name: string;
  district_name: string;
};

const ChevronDownIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function CompleteProfilePage() {
  const { user } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTownId, setSelectedTownId] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [townQuery, setTownQuery] = useState("");
  const [isDistrictMenuOpen, setIsDistrictMenuOpen] = useState(false);
  const [isTownMenuOpen, setIsTownMenuOpen] = useState(false);
  const [towns, setTowns] = useState<TownRecord[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const districtOptions = useMemo(
    () => Array.from(new Set(towns.map((town) => town.district_name))),
    [towns]
  );

  const townOptions = useMemo(() => {
    if (!selectedDistrict) return [];
    return towns.filter((town) => town.district_name === selectedDistrict);
  }, [towns, selectedDistrict]);

  const filteredDistricts = useMemo(() => {
    if (!districtQuery.trim()) return districtOptions;
    const lowerQuery = districtQuery.toLowerCase();
    return districtOptions.filter((district) =>
      district.toLowerCase().includes(lowerQuery)
    );
  }, [districtOptions, districtQuery]);

  const filteredTowns = useMemo(() => {
    if (!townQuery.trim()) return townOptions;
    const lowerQuery = townQuery.toLowerCase();
    return townOptions.filter((town) =>
      town.town_name.toLowerCase().includes(lowerQuery)
    );
  }, [townOptions, townQuery]);

  useEffect(() => {
    async function loadLocations() {
      try {
        const res = await fetch("/api/locations");
        if (!res.ok) {
          throw new Error("Unable to load districts and towns");
        }
        const data = await res.json();
        setTowns(data.towns ?? []);
      } catch (error) {
        console.error(error);
        setFormError("Failed to load districts and towns.");
      } finally {
        setIsLoadingLocations(false);
      }
    }

    loadLocations();
  }, []);

  useEffect(() => {
    // Reset the selected town if the district changes
    setSelectedTownId("");
    setTownQuery("");
  }, [selectedDistrict]);

  const handleDistrictInputChange = (value: string) => {
    setDistrictQuery(value);
    setIsDistrictMenuOpen(true);
    setSelectedDistrict("");
    setSelectedTownId("");
    setTownQuery("");

    const matchingDistrict = districtOptions.find(
      (district) => district.toLowerCase() === value.trim().toLowerCase()
    );
    if (matchingDistrict) {
      setSelectedDistrict(matchingDistrict);
      setIsDistrictMenuOpen(false);
    }
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setDistrictQuery(district);
    setIsDistrictMenuOpen(false);
  };

  const handleTownInputChange = (value: string) => {
    setTownQuery(value);
    setIsTownMenuOpen(true);
    setSelectedTownId("");

    const matchingTown = townOptions.find(
      (town) => town.town_name.toLowerCase() === value.trim().toLowerCase()
    );
    if (matchingTown) {
      setSelectedTownId(String(matchingTown.town_id));
      setIsTownMenuOpen(false);
    }
  };

  const handleTownSelect = (town: TownRecord) => {
    setSelectedTownId(String(town.town_id));
    setTownQuery(town.town_name);
    setIsTownMenuOpen(false);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!user?.id) {
      setFormError("User not found. Please sign in again.");
      return;
    }

    if (!selectedDistrict || !selectedTownId) {
      setFormError("Please select both district and town.");
      return;
    }

    const townIdNumber = Number(selectedTownId);
    if (Number.isNaN(townIdNumber)) {
      setFormError("Invalid town selection.");
      return;
    }

    const selectedTown = townOptions.find(
      (town) => town.town_id === townIdNumber
    );

    try {
      const res = await fetch("/api/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          district: selectedDistrict,
          townName: selectedTown?.town_name,
          townId: townIdNumber,
          userId: user.id,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Failed to save profile");
      }

      setSuccessMessage("Profile saved!");
    } catch (error) {
      console.error(error);
      setFormError(
        error instanceof Error ? error.message : "Failed to save profile."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.25em]">
            Complete Your Profile
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">
            Tell us a little more about you
          </h1>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
            These details help us personalize listings in your district and make
            it easier for students to discover your books and tuition material.
          </p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl border border-slate-100/70 backdrop-blur">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col gap-2 pb-8 border-b border-slate-100">
              <h2 className="text-2xl font-semibold text-slate-900">
                Personal information
              </h2>
              <p className="text-sm text-slate-500">
                Your name and phone number are shown to buyers after you accept
                a request.
              </p>
            </div>

            <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  First name *
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
                    placeholder="e.g. Tharindu"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Last name
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
                    placeholder="e.g. Perera"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Phone number *
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
                    placeholder="+94 71 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  District *
                  <div className="relative">
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition disabled:opacity-60"
                      placeholder={
                        isLoadingLocations ? "Loading districts..." : "Type district name"
                      }
                      value={districtQuery}
                      onChange={(e) => handleDistrictInputChange(e.target.value)}
                      onFocus={() =>
                        !isLoadingLocations && setIsDistrictMenuOpen(true)
                      }
                      onBlur={() => setTimeout(() => setIsDistrictMenuOpen(false), 120)}
                      disabled={isLoadingLocations}
                      required
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      <ChevronDownIcon />
                    </span>
                    {isDistrictMenuOpen && (
                      <ul className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-slate-100">
                        {filteredDistricts.length > 0 ? (
                          filteredDistricts.map((district) => (
                            <li key={district}>
                              <button
                                type="button"
                                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleDistrictSelect(district);
                                }}
                              >
                                {district}
                                {selectedDistrict === district && (
                                  <span className="text-xs font-semibold text-blue-600">
                                    Selected
                                  </span>
                                )}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-sm text-slate-400">
                            No districts match your search.
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  <span className="text-xs font-normal text-slate-400">
                    Start typing to filter the list of Sri Lankan districts.
                  </span>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Town *
                  <div className="relative">
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition disabled:opacity-60"
                      placeholder={
                        !selectedDistrict
                          ? "Pick a district first"
                          : isLoadingLocations
                          ? "Loading towns..."
                          : "Type town name"
                      }
                      value={townQuery}
                      onChange={(e) => handleTownInputChange(e.target.value)}
                      onFocus={() =>
                        selectedDistrict &&
                        !isLoadingLocations &&
                        setIsTownMenuOpen(true)
                      }
                      onBlur={() => setTimeout(() => setIsTownMenuOpen(false), 120)}
                      disabled={!selectedDistrict || isLoadingLocations}
                      required
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      <ChevronDownIcon />
                    </span>
                    {isTownMenuOpen && (
                      <ul className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-slate-100">
                        {filteredTowns.length > 0 ? (
                          filteredTowns.map((town) => (
                            <li key={town.town_id}>
                              <button
                                type="button"
                                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleTownSelect(town);
                                }}
                              >
                                {town.town_name}
                                {String(town.town_id) === selectedTownId && (
                                  <span className="text-xs font-semibold text-blue-600">
                                    Selected
                                  </span>
                                )}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-sm text-slate-400">
                            No towns match your search.
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  <span className="text-xs font-normal text-slate-400">
                    Search by town name within the selected district.
                  </span>
                </label>
              </div>

              {(formError || successMessage) && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    formError
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                  role={formError ? "alert" : "status"}
                >
                  {formError ?? successMessage}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-500 disabled:opacity-50"
                  disabled={!user || isLoadingLocations}
                >
                  Save profile
                </button>
                <p className="text-xs text-slate-400 text-center">
                  Your information is used only within A/L BookLink. You can
                  update it anytime from your profile.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
