'use client'

import { LocationSearchInput, Checkbox, SearchSelect } from "./ui/Form";
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
  { value: "-1", label: "Studio" },
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
    // Uncomment the following lines to test search functionality

    // // TODO: remove this console log in production
    // console.log("Form data:", data);

    // // TODO: use a more robust location parsing method
    // const location = data.location.split(",").map(part => part.trim());

    // const bedOptionInt = !data.beds || data.beds === "null" ? undefined : parseInt(data.beds, 10);
    // const numBeds = bedOptionInt === -1 ? 0 : bedOptionInt;

    // const query = {
    //   city: location[0] || "San Francisco",
    //   state: location[1] || "CA",
    //   country: location[2] || "United States",
    //   propertyType: data.propertyType !== "null" ? data.propertyType : undefined,
    //   beds: numBeds,
    //   petFriendly: data.petFriendly,
    //   parking: data.parking,
    //   furnished: data.furnished,
    //   utilitiesIncluded: data.utilitiesIncluded
    // };

    // console.log("Parsed search query:", query);

    // // TODO: parse location into city, state, country
    // // WARNING: currently, we'll assume the location is always "San Francisco, CA, USA"
    // const results = await searchPropertiesWithFilter(query);

    // // TODO: remove this console log in production
    // console.log("Results:", results);
  }, []);

  return (
    <form
      className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Location Input */}
        <div className="md:col-span-2">
          <LocationSearchInput {...register("location", { required: true })}>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1 absolute">
                {errors.location.message}
              </p>
            )}
          </LocationSearchInput>
        </div>

        {/* Property Type */}
        <SearchSelect {...register("propertyType")} options={propertyTypeOptions} />

        {/* Beds */}
        <SearchSelect {...register("beds")} options={bedOptions} />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <Checkbox {...register("petFriendly")} id="pet-friendly" field="Pet Friendly" />
          <Checkbox {...register("parking")} id="parking" field="Parking Available" />
          <Checkbox {...register("furnished")} id="furnished" field="Furnished" />
          <Checkbox {...register("utilitiesIncluded")} id="utilities-included" field="Utilities Included" />
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
