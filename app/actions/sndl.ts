"use server";
import { db } from "@/db";
import { getServerAuthSession } from "@/lib/auth";
import { sndlDemands } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";




export const requestSndlAccount = async (requestReason: string) => {
    const session = await getServerAuthSession();
    if (!session) throw new Error("User not authenticated");
  
    // Check if user already has a pending or approved SNDL request
    const existingRequest = await db.query.sndlDemands.findFirst({
      where: () => 
        and(
          eq(sndlDemands.userId, session.user.id),
          or(
            eq(sndlDemands.status, "PENDING"),
            eq(sndlDemands.status, "APPROVED")
          )
        )
    });
  
    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        throw new Error("You already have a pending SNDL account request");
      } else {
        throw new Error("You already have an approved SNDL account");
      }
    }
  
    // Create new SNDL demand
    await db.insert(sndlDemands).values({
      requestReason,
      userId: session.user.id,
    });
  
    return { success: true };
  };
  
  // Admin action to process an SNDL demand
  export const processSndlDemand = async (
    demandId: string, 
    approved: boolean, 
    adminNotes?: string,
    sndlEmail?: string,
    sndlPassword?: string
  ) => {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Not authenticated");
    
    // Check if user is a librarian/admin
    if (session.user.role !== "LIBRARIAN") {
      throw new Error("Not authorized to process SNDL demands");
    }
  
    if (approved && (!sndlEmail || !sndlPassword)) {
      throw new Error("SNDL email and password are required for approval");
    }
  
    await db.update(sndlDemands)
      .set({
        status: approved ? "APPROVED" : "REJECTED",
        adminNotes,
        sndlEmail: approved ? sndlEmail : undefined,
        sndlPassword: approved ? sndlPassword : undefined,
        processedAt: new Date(),
        processedBy: session.user.id
      })
      .where(eq(sndlDemands.id, demandId));
  
    // Note: Email sending logic would be implemented separately,
    // likely using a webhook or background job after this action completes
  
    return { success: true };
  };
  
  // Action to mark that email has been sent
  export const markSndlEmailSent = async (demandId: string) => {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Not authenticated");
    
    // Check if user is a librarian/admin
    if (session.user.role !== "LIBRARIAN") {
      throw new Error("Not authorized");
    }
  
    await db.update(sndlDemands)
      .set({
        emailSent: true,
        emailSentAt: new Date()
      })
      .where(eq(sndlDemands.id, demandId));
  
    return { success: true };
  };