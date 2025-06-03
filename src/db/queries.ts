"use server";

import { asc, desc, eq, gte, inArray, or, SQL, sql } from "drizzle-orm";
import { db } from ".";
import { properties, propertyFeatures, propertyListings } from "./schema";
import type { FilterOptions, SortOption } from "@/lib/types";

export const searchPropertiesWithFilter = async (
  options: FilterOptions,
  sortOption: SortOption
) => {
  // ---------------------
  // |   Parse options   |
  // ---------------------
  const propertyTypes: SQL[] = [];
  for (const [type, isActive] of Object.entries(options.propertyTypes))
    if (isActive) propertyTypes.push(sql`${type.toLowerCase()}`);

  // ---------------------------
  // |   Prep-work for query   |
  // ---------------------------

  // build subqueries
  const featuresSubquery = db.$with("features_subquery").as(
    db
      .select({
        propertyId: propertyFeatures.propertyId,
        features: sql`ARRAY_AGG(${propertyFeatures.featureName})`.as("features")
      })
      .from(propertyFeatures)
      .groupBy(propertyFeatures.propertyId)
  );

  // append subqueries
  const qWith = db.with(featuresSubquery);
  const qSelect = qWith.select().from(properties);

  // append joins
  const qJoinListings = qSelect.innerJoin(
    propertyListings,
    eq(properties.id, propertyListings.propertyId)
  );

  const qJoinFeatures = qJoinListings.leftJoin(
    featuresSubquery,
    eq(properties.id, featuresSubquery.propertyId)
  );

  const qFinal = qJoinFeatures;

  // ---------------------------
  // |   Build WHERE clauses   |
  // ---------------------------

  const filters: SQL[] = [];

  // filter by location
  if (
    options.neBounds?.lat &&
    options.swBounds?.lat &&
    options.neBounds?.lng &&
    options.swBounds?.lng
  ) {
    filters.push(
      sql`${properties.latitude} BETWEEN ${options.swBounds.lat} AND ${options.neBounds.lat}`,
      sql`${properties.longitude} BETWEEN ${options.swBounds.lng} AND ${options.neBounds.lng}`
    );
  }

  // filter by price
  if (options.priceRange.min > 0 || options.priceRange.max > 0) {
    const minPrice = options.priceRange.min > 0 ? options.priceRange.min : 0;
    const maxPrice =
      options.priceRange.max > 0 ? options.priceRange.max : Infinity;

    filters.push(
      gte(propertyListings.monthlyRent, sql`${minPrice}`),
      gte(sql`${maxPrice}`, propertyListings.monthlyRent)
    );
  }

  // filter by property type
  if (propertyTypes.length > 0)
    filters.push(inArray(properties.propertyType, sql`${propertyTypes}`));

  // filter by number of bedrooms
  if (options.bedrooms > 0)
    filters.push(gte(properties.bedrooms, options.bedrooms));

  // filter by parking
  if (options.parking)
    filters.push(
      or(gte(properties.parkingSpaces, 1), gte(properties.garageSpaces, 1))!
    );

  // filter by pet friendly
  if (options.petsAllowed)
    filters.push(
      eq(sql`'Pet Friendly'`, sql`ANY(${featuresSubquery.features})`)
    );

  // filter by AC
  if (options.ac)
    filters.push(
      eq(sql`'Central AC/Heat'`, sql`ANY(${featuresSubquery.features})`)
    );

  // filter by in-unit laundry
  if (options.inUnitLaundry)
    filters.push(
      eq(sql`'In-Unit Laundry'`, sql`ANY(${featuresSubquery.features})`)
    );

  // TODO: filter by furnished

  // append filters
  const qData =
    filters.length > 0
      ? qFinal.where(sql.join(filters, sql.raw(" AND ")))
      : qFinal;

  // ------------------------------
  // |   Build ORDER BY clauses   |
  // ------------------------------

  const orderBy: SQL[] = [];

  switch (sortOption) {
    case "priceAsc":
      orderBy.push(asc(propertyListings.monthlyRent));
      break;
    case "priceDesc":
      orderBy.push(desc(propertyListings.monthlyRent));
      break;
    case "newest":
      orderBy.push(desc(propertyListings.createdAt));
      break;
    case "oldest":
      orderBy.push(asc(propertyListings.createdAt));
      break;
    case "bedrooms":
      orderBy.push(desc(properties.bedrooms));
      break;
    case "bathrooms":
      orderBy.push(desc(properties.bathrooms));
      break;
    default:
      throw new Error(`Unknown sort option: ${sortOption}`);
  }

  const q = qData.orderBy(sql.join(orderBy, sql.raw(", ")));

  // uncomment to debug generated SQL
  // console.log(q.toSQL().sql);

  return await q;
};
