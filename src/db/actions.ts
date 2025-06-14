"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from ".";
import { customers, users } from "./schema";
import { eq } from "drizzle-orm";
import { createAdminClient } from "@/utils/supabase/admin";

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

/**
 * Sends confirmation emails to the user's old and new email addresses
 *  to verify the change.
 *
 * Note: user must be authenticated.
 */
export const changeEmail = async (email: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      email
    });

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error changing email:", error);
    return {
      success: false,
      error: "Failed to change email"
    };
  }
};

/**
 * Updates the user's password.
 * Note: user must be authenticated.
 */
export const changePassword = async (newPassword: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error: "Failed to change password"
    };
  }
};

/**
 * Starts enrollment for two-factor authentication (2FA).
 * Note: user must be authenticated.
 */
export const enrollTwoFactor = async () => {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    // if user already has a factorId, unenroll it first
    const user = await db.query.users.findFirst({
      where: eq(users.id, userData.user.id),
      columns: { factorId: true }
    });
    if (user && user.factorId) {
      await supabase.auth.mfa.unenroll({ factorId: user.factorId });
    }

    // enroll new TOTP factor
    const { data: mfaData, error: mfaError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Rentora"
    });
    if (mfaError) {
      return {
        success: false,
        error: mfaError.message
      };
    }

    // store factorId in the database
    await db
      .update(users)
      .set({ factorId: mfaData.id })
      .where(eq(users.id, userData.user.id));

    return {
      success: true,
      factorId: mfaData.id,
      totp: mfaData.totp
    };
  } catch (error) {
    console.error("Error enrolling two-factor authentication:", error);
    return {
      success: false,
      error: "Failed to enroll two-factor authentication"
    };
  }
};

export const verifyTwoFactor = async (code: string) => {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    // get factorId
    const user = await db.query.users.findFirst({
      where: eq(users.id, userData.user.id),
      columns: { factorId: true }
    });
    if (!user || !user.factorId) {
      return {
        success: false,
        error: "Two-factor authentication not enrolled"
      };
    }

    // verify the TOTP code
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: user.factorId,
      code
    });

    if (verifyError) {
      return {
        success: false,
        error: verifyError.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error verifying two-factor authentication:", error);
    return {
      success: false,
      error: "Failed to verify two-factor authentication"
    };
  }
};

/**
 * Disables two-factor authentication for the user.
 * Note: user must be authenticated.
 */
export const unenrollTwoFactor = async () => {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    // get factorId
    const user = await db.query.users.findFirst({
      where: eq(users.id, userData.user.id),
      columns: { factorId: true }
    });
    if (!user || !user.factorId) {
      return {
        success: false,
        error: "Two-factor authentication not enrolled"
      };
    }

    const { error: mfaError } = await supabase.auth.mfa.unenroll({
      factorId: user.factorId
    });
    if (mfaError) {
      return {
        success: false,
        error: mfaError.message
      };
    }

    // remove factorId from the database
    await db
      .update(users)
      .set({ factorId: null })
      .where(eq(users.id, userData.user.id));

    return {
      success: true
    };
  } catch (error) {
    console.error("Error disabling two-factor authentication:", error);
    return {
      success: false,
      error: "Failed to disable two-factor authentication"
    };
  }
};

/**
 * Returns whether the user has two-factor authentication enabled.
 * Note: user must be authenticated.
 */
export const getMFAStatus = async () => {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    const { data, error } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    const hasMFA = data.nextLevel === "aal2";

    return {
      success: true,
      hasMFA
    };
  } catch (error) {
    console.error("Error getting MFA status:", error);
    return {
      success: false,
      error: "Failed to get MFA status"
    };
  }
};

/**
 * Deletes the user's account and all associated data.
 * Note: user must be authenticated.
 */
export const deleteAccount = async () => {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    // delete user from Supabase auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      data.user.id
    );
    if (deleteError) {
      return {
        success: false,
        error: deleteError.message
      };
    }

    // delete user data from the database
    await db.delete(users).where(eq(users.id, data.user.id));
    await db.delete(customers).where(eq(customers.userId, data.user.id));

    return {
      success: true
    };
  } catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      error: "Failed to delete account"
    };
  }
};
