import {  NextResponse } from "next/server"
import { db } from "@/db"
import { sndlDemands } from "@/db/schema"
import { eq } from "drizzle-orm"

type Context = {
    params: Promise<{
      sndlid: string | string[] | undefined
    }>
  }

export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const { sndlid } = await context.params
    
    if (!sndlid || Array.isArray(sndlid)) {
      return new NextResponse("Invalid Demand ID", { status: 400 })
    }

    // Check if the demand exists before deleting
    const existingDemand = await db
      .select({ id: sndlDemands.id })
      .from(sndlDemands)
      .where(eq(sndlDemands.id, sndlid))
      .limit(1)

    if (existingDemand.length === 0) {
      return new NextResponse("SNDL demand not found", { status: 404 })
    }

    // Delete the demand
    await db
      .delete(sndlDemands)
      .where(eq(sndlDemands.id, sndlid))

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[SNDL_DEMAND_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}