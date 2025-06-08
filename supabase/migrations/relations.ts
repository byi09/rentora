import { relations } from "drizzle-orm/relations";
import { users, customers, renters, renterSearchPreferences, renterSearches, properties, savedProperties, conversations, messages, rentalApplications, conversationParticipants, groupInvitations, landlords, propertyTours, propertyViews, propertyListings, propertyFeatures, propertyImages } from "./schema";

export const customersRelations = relations(customers, ({one, many}) => ({
	user: one(users, {
		fields: [customers.userId],
		references: [users.id]
	}),
	landlords: many(landlords),
	renters: many(renters),
}));

export const usersRelations = relations(users, ({many}) => ({
	customers: many(customers),
	messages: many(messages),
	conversationParticipants: many(conversationParticipants),
	groupInvitations: many(groupInvitations),
}));

export const renterSearchPreferencesRelations = relations(renterSearchPreferences, ({one}) => ({
	renter: one(renters, {
		fields: [renterSearchPreferences.renterId],
		references: [renters.id]
	}),
}));

export const rentersRelations = relations(renters, ({one, many}) => ({
	renterSearchPreferences: many(renterSearchPreferences),
	renterSearches: many(renterSearches),
	savedProperties: many(savedProperties),
	customer: one(customers, {
		fields: [renters.customerId],
		references: [customers.id]
	}),
	propertyTours: many(propertyTours),
	propertyViews: many(propertyViews),
	rentalApplications: many(rentalApplications),
}));

export const renterSearchesRelations = relations(renterSearches, ({one}) => ({
	renter: one(renters, {
		fields: [renterSearches.renterId],
		references: [renters.id]
	}),
}));

export const savedPropertiesRelations = relations(savedProperties, ({one}) => ({
	property: one(properties, {
		fields: [savedProperties.propertyId],
		references: [properties.id]
	}),
	renter: one(renters, {
		fields: [savedProperties.renterId],
		references: [renters.id]
	}),
}));

export const propertiesRelations = relations(properties, ({one, many}) => ({
	savedProperties: many(savedProperties),
	conversations: many(conversations),
	landlord: one(landlords, {
		fields: [properties.landlordId],
		references: [landlords.id]
	}),
	propertyTours: many(propertyTours),
	propertyViews: many(propertyViews),
	rentalApplications: many(rentalApplications),
	propertyFeatures: many(propertyFeatures),
	propertyImages: many(propertyImages),
	propertyListings: many(propertyListings),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id]
	}),
	user: one(users, {
		fields: [messages.senderId],
		references: [users.id]
	}),
}));

export const conversationsRelations = relations(conversations, ({one, many}) => ({
	messages: many(messages),
	property: one(properties, {
		fields: [conversations.propertyId],
		references: [properties.id]
	}),
	rentalApplication: one(rentalApplications, {
		fields: [conversations.rentalApplicationId],
		references: [rentalApplications.id]
	}),
	conversationParticipants: many(conversationParticipants),
	groupInvitations: many(groupInvitations),
}));

export const rentalApplicationsRelations = relations(rentalApplications, ({one, many}) => ({
	conversations: many(conversations),
	landlord: one(landlords, {
		fields: [rentalApplications.landlordId],
		references: [landlords.id]
	}),
	propertyListing: one(propertyListings, {
		fields: [rentalApplications.listingId],
		references: [propertyListings.id]
	}),
	property: one(properties, {
		fields: [rentalApplications.propertyId],
		references: [properties.id]
	}),
	renter: one(renters, {
		fields: [rentalApplications.renterId],
		references: [renters.id]
	}),
}));

export const conversationParticipantsRelations = relations(conversationParticipants, ({one}) => ({
	conversation: one(conversations, {
		fields: [conversationParticipants.conversationId],
		references: [conversations.id]
	}),
	user: one(users, {
		fields: [conversationParticipants.userId],
		references: [users.id]
	}),
}));

export const groupInvitationsRelations = relations(groupInvitations, ({one}) => ({
	conversation: one(conversations, {
		fields: [groupInvitations.conversationId],
		references: [conversations.id]
	}),
	user: one(users, {
		fields: [groupInvitations.invitedBy],
		references: [users.id]
	}),
}));

export const landlordsRelations = relations(landlords, ({one, many}) => ({
	customer: one(customers, {
		fields: [landlords.customerId],
		references: [customers.id]
	}),
	properties: many(properties),
	propertyTours: many(propertyTours),
	rentalApplications: many(rentalApplications),
}));

export const propertyToursRelations = relations(propertyTours, ({one}) => ({
	landlord: one(landlords, {
		fields: [propertyTours.landlordId],
		references: [landlords.id]
	}),
	property: one(properties, {
		fields: [propertyTours.propertyId],
		references: [properties.id]
	}),
	renter: one(renters, {
		fields: [propertyTours.renterId],
		references: [renters.id]
	}),
}));

export const propertyViewsRelations = relations(propertyViews, ({one}) => ({
	property: one(properties, {
		fields: [propertyViews.propertyId],
		references: [properties.id]
	}),
	renter: one(renters, {
		fields: [propertyViews.renterId],
		references: [renters.id]
	}),
}));

export const propertyListingsRelations = relations(propertyListings, ({one, many}) => ({
	rentalApplications: many(rentalApplications),
	property: one(properties, {
		fields: [propertyListings.propertyId],
		references: [properties.id]
	}),
}));

export const propertyFeaturesRelations = relations(propertyFeatures, ({one}) => ({
	property: one(properties, {
		fields: [propertyFeatures.propertyId],
		references: [properties.id]
	}),
}));

export const propertyImagesRelations = relations(propertyImages, ({one}) => ({
	property: one(properties, {
		fields: [propertyImages.propertyId],
		references: [properties.id]
	}),
}));