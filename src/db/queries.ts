'use server';

import { sql } from "drizzle-orm";
import { db } from ".";
import { properties } from "./schema";

interface SearchFilter {
  city?: string;
  state?: string;
  country?: string;
  propertyType?: string;
  beds?: string;
  petFriendly?: boolean;
  parking?: boolean;
  furnished?: boolean;
  utilitiesIncluded?: boolean;
}

export const searchPropertiesWithFilter = async (options: SearchFilter) => {
  const result = await db.select().from(properties).where(
    sql`
      ${options.city ? `city = ${options.city}` : 'true'}
      AND ${options.state ? `state = ${options.state}` : 'true'}
      AND ${options.country ? `country = ${options.country}` : 'true'}
      AND ${options.propertyType ? `property_type = ${options.propertyType}` : 'true'}
      AND ${options.beds ? `beds = ${options.beds}` : 'true'}
      AND ${options.petFriendly ? `pet_friendly is true` : 'true'}
      AND ${options.parking ? `parking is true` : 'true'}
      AND ${options.furnished ? `furnished is true` : 'true'}
      AND ${options.utilitiesIncluded ? `utilities_included is true` : 'true'}
    `
  );

  return result;
}


