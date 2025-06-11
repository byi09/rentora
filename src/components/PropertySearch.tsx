"use client";

import { LocationSearchInput, Checkbox, SearchSelect } from "./ui/Form";
import { FieldErrors, Resolver, useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { useGeolocationContext } from "../contexts/GeolocationContext";
import { useRouter } from "next/navigation";
import { geocode } from "@/utils/geocoding";

// select options for property type and beds
const propertyTypeOptions = [
  { value: "null", label: "Property Type" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" }
];

const bedOptions = [
  { value: "null", label: "Beds" },
  { value: "-1", label: "Studio" },
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Beds" },
  { value: "3+", label: "3+ Beds" }
];

// form values
interface SearchFormValues {
  location: string;
  propertyType?: string;
  beds?: string;
  petFriendly?: boolean;
  parking?: boolean;
  furnished?: boolean;
  utilitiesIncluded?: boolean;
}

// error resolver for the form
const resolver: Resolver<SearchFormValues> = async (values) => {
  const errors: FieldErrors<SearchFormValues> = {};

  if (!values.location) {
    errors.location = {
      type: "required",
      message: "Location is required"
    };
  }

  const hasErrors = Object.keys(errors).length > 0;

  return {
    values: hasErrors ? {} : values,
    errors: hasErrors ? errors : {}
  };
};

// form component
export default function PropertySearch() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<SearchFormValues>({ resolver });
  const { location, isLoading } = useGeolocationContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const defaultLocation =
      location?.city && location?.state
        ? `${location.city.long_name}, ${location.state.short_name}`
        : "";
    setValue("location", defaultLocation);
  }, [isLoading, location, setValue]);

  const onSubmit = useCallback(
    async (data: SearchFormValues) => {
      // build search parameters for map filters
      const searchParams = new URLSearchParams();

      // if location is provided, geocode it to get center coordinates
      // for the map's initial view
      if (data.location) {
        searchParams.set("location", data.location);
        const geometry = await geocode(data.location);
        if (geometry?.location) {
          searchParams.set("lng", geometry.location.lng.toString());
          searchParams.set("lat", geometry.location.lat.toString());
        }
      }

      if (data.propertyType && data.propertyType !== "null")
        searchParams.set("propertyType", data.propertyType);

      if (data.beds && data.beds !== "null")
        searchParams.set("beds", data.beds);
      if (data.petFriendly) searchParams.set("petFriendly", "true");
      if (data.parking) searchParams.set("parking", "true");
      if (data.furnished) searchParams.set("furnished", "true");
      if (data.utilitiesIncluded) searchParams.set("utilitiesIncluded", "true");

      router.push(`/map?${searchParams.toString()}`);
    },
    [router]
  );

  return (
    <form
      className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Location Input */}
        <div className="md:col-span-2">
          {isLoading ? (
            <LocationSearchInput
              {...register("location", { required: true })}
              defaultValue={""}
              disabled
            />
          ) : (
            <LocationSearchInput
              {...register("location", { required: true })}
              defaultValue={
                location?.city && location?.state
                  ? `${location.city.long_name}, ${location.state.short_name}`
                  : ""
              }
            >
              {errors.location && (
                <p className="text-red-500 text-sm mt-1 absolute">
                  {errors.location.message}
                </p>
              )}
            </LocationSearchInput>
          )}
        </div>

        {/* Property Type */}
        <SearchSelect
          {...register("propertyType")}
          options={propertyTypeOptions}
        />

        {/* Beds */}
        <SearchSelect {...register("beds")} options={bedOptions} />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <Checkbox
            {...register("petFriendly")}
            id="pet-friendly"
            field="Pet Friendly"
          />
          <Checkbox
            {...register("parking")}
            id="parking"
            field="Parking Available"
          />
          <Checkbox
            {...register("furnished")}
            id="furnished"
            field="Furnished"
          />
          <Checkbox
            {...register("utilitiesIncluded")}
            id="utilities-included"
            field="Utilities Included"
          />
          <button
            className="text-blue-600 font-medium hover:text-blue-800"
            onClick={(e) => e.preventDefault()}
          >
            More Filters
          </button>
        </div>
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
