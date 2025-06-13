"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from ".";
import { customers, users } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Issues a request to change the user's name in the database.
 * Note: user must be authenticated.
 */
export const changeName = async (firstName: string, lastName: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    await db
      .update(customers)
      .set({
        firstName,
        lastName
      })
      .where(eq(customers.userId, data.user.id));

    return {
      success: true
    };
  } catch (error) {
    console.error("Error changing name:", error);
    return {
      success: false,
      error: "Failed to change name"
    };
  }
};

/**
 * Issues a request to change the user's username in the database.
 * Note: user must be authenticated.
 */
export const changeUsername = async (username: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    await db
      .update(users)
      .set({
        username
      })
      .where(eq(users.id, data.user.id));

    return {
      success: true
    };
  } catch (error) {
    console.error("Error changing username:", error);
    return {
      success: false,
      error: "Failed to change username"
    };
  }
};
