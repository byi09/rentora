'use client'

import { HiLocationMarker } from "react-icons/hi";
import { SearchCheckbox, SearchSelect } from "./ui/SearchForm";
import { FieldErrors, Resolver, useForm } from "react-hook-form";
import { useCallback } from "react";
import { searchPropertiesWithFilter } from "../db/queries";

// select options for property type and beds
const propertyTypeOptions = [
  { value: "null", label: "Property Type" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" }
]

const bedOptions = [
  { value: "null", label: "Beds" },
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Beds" },
  { value: "3+", label: "3+ Beds" }
]

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
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return {
    values: hasErrors ? {} : values,
    errors: hasErrors ? errors : {}
  };
}

// form component
export default function PropertySearch() {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormValues>({ resolver });

  const onSubmit = useCallback(async (data: SearchFormValues) => {
    // TODO: remove this console log in production
    console.log(data);

    // TODO: parse location into city, state, country
    // WARNING: currently, we'll assume the location is always "Berkeley, CA, USA"
    const results = await searchPropertiesWithFilter({
      city: "Berkeley",
      state: "CA",
      country: "USA",
      propertyType: data.propertyType !== "null" ? data.propertyType : undefined,
      beds: data.beds !== "null" ? data.beds : undefined,
      petFriendly: data.petFriendly,
      parking: data.parking,
      furnished: data.furnished,
      utilitiesIncluded: data.utilitiesIncluded
    })

    // TODO: remove this console log in production
    console.log(results);
  }, []);

  return (
    <form
      className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Location Input */}
        <div className="md:col-span-2">
          <div className="relative">
            <HiLocationMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter city, neighborhood, or address"
              defaultValue="Berkeley, CA"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              {...register("location", { required: true })}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1 absolute">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        {/* Property Type */}
        <SearchSelect {...register("propertyType")} options={propertyTypeOptions} />

        {/* Beds */}
        <SearchSelect {...register("beds")} options={bedOptions} />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <SearchCheckbox {...register("petFriendly")} id="pet-friendly" field="Pet Friendly" />
          <SearchCheckbox {...register("parking")} id="parking" field="Parking Available" />
          <SearchCheckbox {...register("furnished")} id="furnished" field="Furnished" />
          <SearchCheckbox {...register("utilitiesIncluded")} id="utilities-included" field="Utilities Included" />
          <button
            className="text-blue-600 font-medium hover:text-blue-800"
            onClick={e => e.preventDefault()}
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
  )
}
