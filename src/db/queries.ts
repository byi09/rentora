'use server';

import { eq, gte, or, SQL, sql } from "drizzle-orm";
import { db } from ".";
import { properties, propertyFeatures, propertyListings } from "./schema";

interface SearchFilter {
  city?: string;
  state?: string;
  country?: string;
  propertyType?: string;
  beds?: number;
  petFriendly?: boolean;
  parking?: boolean;
  furnished?: boolean;
  utilitiesIncluded?: boolean;
}

export const searchPropertiesWithFilter = async (options: SearchFilter) => {
  // decision tree
  const shouldJoinListings = options.utilitiesIncluded;
  const shouldJoinFeatures = options.petFriendly;

  // build subqueries
  const featuresSubquery = db.$with('features_subquery')
    .as(
      db.select({
        propertyId: propertyFeatures.propertyId,
        features: sql`ARRAY_AGG(${propertyFeatures.featureName})`.as('features')
      })
        .from(propertyFeatures)
        .groupBy(propertyFeatures.propertyId)
    );

  // append subqueries
  const qWith = shouldJoinFeatures ? db.with(featuresSubquery) : db;
  const qSelect = qWith.select().from(properties);
  
  // append joins
  const qJoinListings = shouldJoinListings ?
    qSelect.leftJoin(propertyListings, eq(properties.id, propertyListings.propertyId)) :
    qSelect;
  
  const qJoinFeatures = shouldJoinFeatures ?
    qJoinListings.leftJoin(featuresSubquery, eq(properties.id, featuresSubquery.propertyId)) :
    qJoinListings;
  
  const qFinal = qJoinFeatures;

  // build where clauses
  const filters: SQL[] = [];

  // filter by location
  if (options.country)
    filters.push(eq(properties.country, options.country));
  if (options.state)
    filters.push(eq(properties.state, options.state));
  if (options.city)
    filters.push(eq(properties.city, options.city));

  // filter by property type
  if (options.propertyType && options.propertyType !== 'null')
    filters.push(eq(properties.propertyType, sql`${options.propertyType.toLowerCase()}`));

  // filter by number of bedrooms
  if (typeof options.beds !== 'undefined') {
    if (options.beds >= 3) {
      filters.push(gte(properties.bedrooms, 3));
    } else {
      filters.push(eq(properties.bedrooms, options.beds));
    }
  }

  // filter by parking
  if (options.parking)
    filters.push(
      or(
        gte(properties.parkingSpaces, 1),
        gte(properties.garageSpaces, 1)
      )!
    );
  
  // filter by pet friendly
  if (options.petFriendly)
    filters.push(eq(sql`'Pet Friendly'`, sql`ANY(${featuresSubquery.features})`));

  // apply filters
  const q = qFinal.where(sql.join(filters, sql.raw(' AND ')));

  // uncomment to debug generated SQL
  // console.log(q.toSQL().sql);

  return await q;
}


