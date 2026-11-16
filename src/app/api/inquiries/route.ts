import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const generalInquirySchema = z.object({
  type: z.literal("general").default("general"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(200),
  phone: z.string().trim().min(8, "Phone number is required").max(25),
  city: z.string().trim().min(2, "City is required").max(100),
  interest: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
});

const franchiseInquirySchema = z.object({
  type: z.literal("franchise"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(200),
  phone: z.string().trim().min(8, "Phone number is required").max(25),
  state: z.string().trim().min(2, "State is required").max(100),
  city: z.string().trim().min(2, "City is required").max(100),
  investment: z.string().trim().max(100).optional(),
  message: z.string().trim().max(3000).optional(),
});

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let rawData: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      rawData = await request.json();
    } else {
      const formData = await request.formData();
      rawData = Object.fromEntries(formData.entries());
    }

    const isFranchise = rawData.type === "franchise" || rawData.state !== undefined || rawData.interest === "Franchise partnership";

    if (isFranchise) {
      const parsed = franchiseInquirySchema.safeParse({
        ...rawData,
        type: "franchise",
      });

      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((i) => i.message).join(", ");
        return NextResponse.json(
          { error: errorMessages || "Please fill in all mandatory fields including State." },
          { status: 400 }
        );
      }

      const { name, email, phone, state, city, investment, message } = parsed.data;

      await prisma.franchiseInquiry.create({
        data: {
          name,
          email,
          phone,
          state,
          city,
          investment: investment || "Not specified",
          message: message || "Franchise inquiry submitted via website form.",
          status: "new",
        },
      });

      if (contentType.includes("application/json")) {
        return NextResponse.json({ success: true, message: "Franchise inquiry submitted successfully." });
      }
      return NextResponse.redirect(new URL("/thanks", request.url), 303);
    }

    const parsed = generalInquirySchema.safeParse({
      ...rawData,
      type: "general",
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json(
        { error: errorMessages || "Please check your details and try again." },
        { status: 400 }
      );
    }

    const { name, email, phone, city, interest, message } = parsed.data;

    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        city,
        interest: interest || null,
        subject: `Enquiry: ${interest || "Session booking"} - ${city}`,
        message: `City: ${city}\nInterest: ${interest || "General"}\nNotes: ${message || "N/A"}`,
      },
    });

    if (contentType.includes("application/json")) {
      return NextResponse.json({ success: true, message: "Enquiry submitted successfully." });
    }
    return NextResponse.redirect(new URL("/thanks", request.url), 303);
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
