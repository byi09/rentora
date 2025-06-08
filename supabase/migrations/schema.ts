import { pgTable, uuid, varchar, json, text, numeric, integer, timestamp, unique, boolean, foreignKey, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accountStatus = pgEnum("account_status", ['active', 'suspended', 'deactivated'])
export const alertFrequency = pgEnum("alert_frequency", ['immediate', 'daily', 'weekly'])
export const applicationStatus = pgEnum("application_status", ['pending', 'approved', 'rejected', 'withdrawn'])
export const contactMethod = pgEnum("contact_method", ['email', 'phone', 'text'])
export const conversationType = pgEnum("conversation_type", ['direct', 'group', 'support'])
export const employmentStatus = pgEnum("employment_status", ['employed', 'self_employed', 'unemployed', 'student', 'retired'])
export const featureCategory = pgEnum("feature_category", ['interior', 'exterior', 'building_amenities', 'appliances', 'utilities'])
export const gender = pgEnum("gender", ['male', 'female', 'other', 'prefer_not_to_say'])
export const imageType = pgEnum("image_type", ['exterior', 'interior', 'aerial', 'floorplan'])
export const listingStatus = pgEnum("listing_status", ['active', 'pending', 'rented', 'expired'])
export const messageStatus = pgEnum("message_status", ['sent', 'delivered', 'read'])
export const messageType = pgEnum("message_type", ['text', 'image', 'file', 'system'])
export const moveInTimeline = pgEnum("move_in_timeline", ['immediately', '1_month', '2_months', '3_months', '6_months', 'flexible'])
export const participantRole = pgEnum("participant_role", ['member', 'admin', 'owner'])
export const propertyStatus = pgEnum("property_status", ['available', 'rented', 'maintenance', 'off_market'])
export const propertyType = pgEnum("property_type", ['apartment', 'house', 'condo', 'townhouse', 'studio', 'room', 'duplex'])
export const tourStatus = pgEnum("tour_status", ['scheduled', 'completed', 'cancelled', 'no_show'])
export const tourType = pgEnum("tour_type", ['in_person', 'virtual', 'self_guided'])
export const viewType = pgEnum("view_type", ['listing_view', 'photo_view', 'virtual_tour', 'contact_info'])


export const neighborhoods = pgTable("neighborhoods", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 100 }).notNull(),
	state: varchar({ length: 50 }).notNull(),
	zipCodes: json("zip_codes"),
	boundaryPolygon: text("boundary_polygon"),
	averageRent: numeric("average_rent", { precision: 8, scale:  2 }),
	medianRent: numeric("median_rent", { precision: 8, scale:  2 }),
	walkScore: integer("walk_score"),
	transitScore: integer("transit_score"),
	bikeScore: integer("bike_score"),
	crimeRating: numeric("crime_rating", { precision: 3, scale:  1 }),
	schoolRating: numeric("school_rating", { precision: 3, scale:  1 }),
	nightlifeRating: numeric("nightlife_rating", { precision: 3, scale:  1 }),
	diningRating: numeric("dining_rating", { precision: 3, scale:  1 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: boolean("email_verified").default(false),
	accountStatus: accountStatus("account_status").default('active'),
	stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	username: varchar({ length: 50 }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
]);

export const customers = pgTable("customers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 255 }),
	dateOfBirth: date("date_of_birth"),
	gender: gender(),
	profileImageS3Key: varchar("profile_image_s3_key", { length: 500 }),
	currentCity: varchar("current_city", { length: 100 }),
	currentState: varchar("current_state", { length: 50 }),
	currentZipCode: varchar("current_zip_code", { length: 10 }),
	preferredContactMethod: contactMethod("preferred_contact_method").default('email'),
	marketingOptIn: boolean("marketing_opt_in").default(false),
	notificationsEnabled: boolean("notifications_enabled").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "customers_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const renterSearchPreferences = pgTable("renter_search_preferences", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	renterId: uuid("renter_id").notNull(),
	minRent: numeric("min_rent", { precision: 8, scale:  2 }),
	maxRent: numeric("max_rent", { precision: 8, scale:  2 }),
	minBedrooms: integer("min_bedrooms"),
	maxBedrooms: integer("max_bedrooms"),
	minBathrooms: numeric("min_bathrooms", { precision: 3, scale:  1 }),
	maxBathrooms: numeric("max_bathrooms", { precision: 3, scale:  1 }),
	preferredCities: json("preferred_cities"),
	preferredNeighborhoods: json("preferred_neighborhoods"),
	preferredZipCodes: json("preferred_zip_codes"),
	maxCommuteDistance: integer("max_commute_distance"),
	commuteAddress: varchar("commute_address", { length: 500 }),
	propertyTypes: json("property_types"),
	mustHaveFeatures: json("must_have_features"),
	preferredFeatures: json("preferred_features"),
	alertsEnabled: boolean("alerts_enabled").default(true),
	alertFrequency: alertFrequency("alert_frequency").default('daily'),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.renterId],
			foreignColumns: [renters.id],
			name: "renter_search_preferences_renter_id_renters_id_fk"
		}),
]);

export const renterSearches = pgTable("renter_searches", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	renterId: uuid("renter_id"),
	searchFilters: json("search_filters"),
	resultsCount: integer("results_count"),
	clickedProperties: json("clicked_properties"),
	sessionId: varchar("session_id", { length: 255 }),
	searchedAt: timestamp("searched_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.renterId],
			foreignColumns: [renters.id],
			name: "renter_searches_renter_id_renters_id_fk"
		}),
]);

export const savedProperties = pgTable("saved_properties", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	renterId: uuid("renter_id").notNull(),
	propertyId: uuid("property_id").notNull(),
	notes: text(),
	tags: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "saved_properties_property_id_properties_id_fk"
		}),
	foreignKey({
			columns: [table.renterId],
			foreignColumns: [renters.id],
			name: "saved_properties_renter_id_renters_id_fk"
		}),
]);

export const messages = pgTable("messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	conversationId: uuid("conversation_id").notNull(),
	senderId: uuid("sender_id").notNull(),
	content: text().notNull(),
	messageType: messageType("message_type").default('text'),
	editedAt: timestamp("edited_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	replyToId: uuid("reply_to_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	attachmentS3Key: varchar("attachment_s3_key", { length: 500 }),
	attachmentFileName: varchar("attachment_file_name", { length: 255 }),
	attachmentFileSize: integer("attachment_file_size"),
	attachmentMimeType: varchar("attachment_mime_type", { length: 100 }),
	threadId: uuid("thread_id"),
	isEdited: boolean("is_edited").default(false),
	isDeleted: boolean("is_deleted").default(false),
	metadata: json(),
}, (table) => [
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversations.id],
			name: "messages_conversation_id_conversations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [users.id],
			name: "messages_sender_id_users_id_fk"
		}),
]);

export const conversations = pgTable("conversations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }),
	description: text(),
	lastMessageAt: timestamp("last_message_at", { mode: 'string' }),
	lastMessageId: uuid("last_message_id"),
	isArchived: boolean("is_archived").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	conversationType: conversationType("conversation_type").default('direct'),
	avatarS3Key: varchar("avatar_s3_key", { length: 500 }),
	isLocked: boolean("is_locked").default(false),
	propertyId: uuid("property_id"),
	rentalApplicationId: uuid("rental_application_id"),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "conversations_property_id_properties_id_fk"
		}),
	foreignKey({
			columns: [table.rentalApplicationId],
			foreignColumns: [rentalApplications.id],
			name: "conversations_rental_application_id_rental_applications_id_fk"
		}),
]);

export const conversationParticipants = pgTable("conversation_participants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	conversationId: uuid("conversation_id").notNull(),
	userId: uuid("user_id").notNull(),
	role: participantRole().default('member'),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow(),
	leftAt: timestamp("left_at", { mode: 'string' }),
	notificationsEnabled: boolean("notifications_enabled").default(true),
	isMuted: boolean("is_muted").default(false),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	canAddMembers: boolean("can_add_members").default(false),
	canRemoveMembers: boolean("can_remove_members").default(false),
	mutedUntil: timestamp("muted_until", { mode: 'string' }),
	isActive: boolean("is_active").default(true),
}, (table) => [
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversations.id],
			name: "conversation_participants_conversation_id_conversations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "conversation_participants_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const groupInvitations = pgTable("group_invitations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	conversationId: uuid("conversation_id").notNull(),
	invitedUsername: varchar("invited_username", { length: 50 }).notNull(),
	invitedBy: uuid("invited_by").notNull(),
	status: varchar({ length: 20 }).default('pending'),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	respondedAt: timestamp("responded_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversations.id],
			name: "group_invitations_conversation_id_conversations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.invitedBy],
			foreignColumns: [users.id],
			name: "group_invitations_invited_by_users_id_fk"
		}),
]);

export const landlords = pgTable("landlords", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	customerId: uuid("customer_id").notNull(),
	businessName: varchar("business_name", { length: 255 }),
	businessLicense: varchar("business_license", { length: 100 }),
	taxId: varchar("tax_id", { length: 50 }),
	acceptsPets: boolean("accepts_pets").default(false),
	allowsSmoking: boolean("allows_smoking").default(false),
	minimumCreditScore: integer("minimum_credit_score"),
	minimumIncomeMultiplier: numeric("minimum_income_multiplier", { precision: 3, scale:  1 }),
	businessPhone: varchar("business_phone", { length: 255 }),
	businessEmail: varchar("business_email", { length: 255 }),
	identityVerified: boolean("identity_verified").default(false),
	backgroundCheckCompleted: boolean("background_check_completed").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "landlords_customer_id_customers_id_fk"
		}).onDelete("cascade"),
]);

export const renters = pgTable("renters", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	customerId: uuid("customer_id").notNull(),
	monthlyBudget: numeric("monthly_budget", { precision: 8, scale:  2 }),
	moveInTimeline: moveInTimeline("move_in_timeline"),
	currentLeaseExpiresAt: date("current_lease_expires_at"),
	currentRent: numeric("current_rent", { precision: 8, scale:  2 }),
	reasonForMoving: varchar("reason_for_moving", { length: 255 }),
	petsCount: integer("pets_count").default(0),
	petTypes: varchar("pet_types", { length: 255 }),
	smokingAllowed: boolean("smoking_allowed").default(false),
	employmentStatus: employmentStatus("employment_status"),
	monthlyIncome: numeric("monthly_income", { precision: 10, scale:  2 }),
	employer: varchar({ length: 255 }),
	hasRentalHistory: boolean("has_rental_history").default(false),
	previousLandlordContact: varchar("previous_landlord_contact", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "renters_customer_id_customers_id_fk"
		}).onDelete("cascade"),
]);

export const properties = pgTable("properties", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	landlordId: uuid("landlord_id").notNull(),
	addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
	addressLine2: varchar("address_line_2", { length: 255 }),
	city: varchar({ length: 100 }).notNull(),
	state: varchar({ length: 50 }).notNull(),
	zipCode: varchar("zip_code", { length: 10 }).notNull(),
	country: varchar({ length: 100 }).default('United States'),
	latitude: numeric({ precision: 10, scale:  8 }),
	longitude: numeric({ precision: 11, scale:  8 }),
	propertyType: propertyType("property_type").notNull(),
	yearBuilt: integer("year_built"),
	squareFootage: integer("square_footage"),
	lotSize: numeric("lot_size", { precision: 10, scale:  2 }),
	bedrooms: integer().notNull(),
	bathrooms: numeric({ precision: 3, scale:  1 }).notNull(),
	halfBathrooms: integer("half_bathrooms").default(0),
	parkingSpaces: integer("parking_spaces").default(0),
	garageSpaces: integer("garage_spaces").default(0),
	hasBasement: boolean("has_basement").default(false),
	hasAttic: boolean("has_attic").default(false),
	propertyStatus: propertyStatus("property_status").default('available'),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.landlordId],
			foreignColumns: [landlords.id],
			name: "properties_landlord_id_landlords_id_fk"
		}),
]);

export const propertyTours = pgTable("property_tours", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	renterId: uuid("renter_id").notNull(),
	propertyId: uuid("property_id").notNull(),
	landlordId: uuid("landlord_id").notNull(),
	tourType: tourType("tour_type").notNull(),
	scheduledAt: timestamp("scheduled_at", { mode: 'string' }),
	status: tourStatus().default('scheduled'),
	duration: integer(),
	contactPhone: varchar("contact_phone", { length: 255 }),
	specialInstructions: text("special_instructions"),
	renterRating: integer("renter_rating"),
	landlordRating: integer("landlord_rating"),
	renterNotes: text("renter_notes"),
	landlordNotes: text("landlord_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.landlordId],
			foreignColumns: [landlords.id],
			name: "property_tours_landlord_id_landlords_id_fk"
		}),
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_tours_property_id_properties_id_fk"
		}),
	foreignKey({
			columns: [table.renterId],
			foreignColumns: [renters.id],
			name: "property_tours_renter_id_renters_id_fk"
		}),
]);

export const propertyViews = pgTable("property_views", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	renterId: uuid("renter_id"),
	propertyId: uuid("property_id").notNull(),
	viewType: viewType("view_type"),
	sessionId: varchar("session_id", { length: 255 }),
	userAgent: varchar("user_agent", { length: 500 }),
	ipAddress: varchar("ip_address", { length: 45 }),
	viewedAt: timestamp("viewed_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_views_property_id_properties_id_fk"
		}),
	foreignKey({
			columns: [table.renterId],
			foreignColumns: [renters.id],
			name: "property_views_renter_id_renters_id_fk"
		}),
]);

export const rentalApplications = pgTable("rental_applications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	renterId: uuid("renter_id").notNull(),
	propertyId: uuid("property_id").notNull(),
	landlordId: uuid("landlord_id").notNull(),
	listingId: uuid("listing_id"),
	proposedMoveInDate: date("proposed_move_in_date"),
	proposedRent: numeric("proposed_rent", { precision: 8, scale:  2 }),
	leaseDuration: integer("lease_duration"),
	applicationStatus: applicationStatus("application_status").default('pending'),
	appliedAt: timestamp("applied_at", { mode: 'string' }).defaultNow(),
	respondedAt: timestamp("responded_at", { mode: 'string' }),
	coverLetter: text("cover_letter"),
	referencesProvided: boolean("references_provided").default(false),
	creditCheckConsent: boolean("credit_check_consent").default(false),
	backgroundCheckConsent: boolean("background_check_consent").default(false),
	landlordNotes: text("landlord_notes"),
	rejectionReason: varchar("rejection_reason", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.landlordId],
			foreignColumns: [landlords.id],
			name: "rental_applications_landlord_id_landlords_id_fk"
		}),
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [propertyListings.id],
			name: "rental_applications_listing_id_property_listings_id_fk"
		}),
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "rental_applications_property_id_properties_id_fk"
		}),
	foreignKey({
			columns: [table.renterId],
			foreignColumns: [renters.id],
			name: "rental_applications_renter_id_renters_id_fk"
		}),
]);

export const propertyFeatures = pgTable("property_features", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	propertyId: uuid("property_id").notNull(),
	featureName: varchar("feature_name", { length: 255 }).notNull(),
	featureCategory: featureCategory("feature_category").notNull(),
	featureValue: varchar("feature_value", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_features_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const propertyImages = pgTable("property_images", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	propertyId: uuid("property_id").notNull(),
	s3Key: varchar("s3_key", { length: 500 }).notNull(),
	imageOrder: integer("image_order").default(0),
	altText: varchar("alt_text", { length: 255 }),
	isPrimary: boolean("is_primary").default(false),
	imageType: imageType("image_type"),
	roomType: varchar("room_type", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_images_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const propertyListings = pgTable("property_listings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	propertyId: uuid("property_id").notNull(),
	monthlyRent: numeric("monthly_rent", { precision: 8, scale:  2 }).notNull(),
	securityDeposit: numeric("security_deposit", { precision: 8, scale:  2 }),
	petDeposit: numeric("pet_deposit", { precision: 8, scale:  2 }),
	applicationFee: numeric("application_fee", { precision: 6, scale:  2 }),
	minimumLeaseTerm: integer("minimum_lease_term"),
	maximumLeaseTerm: integer("maximum_lease_term"),
	availableDate: date("available_date"),
	utilitiesIncluded: json("utilities_included"),
	parkingCost: numeric("parking_cost", { precision: 6, scale:  2 }),
	listingStatus: listingStatus("listing_status").default('active'),
	listDate: date("list_date").defaultNow(),
	expirationDate: date("expiration_date"),
	viewCount: integer("view_count").default(0),
	listingTitle: varchar("listing_title", { length: 255 }),
	listingDescription: text("listing_description"),
	virtualTourUrl: varchar("virtual_tour_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_listings_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);
