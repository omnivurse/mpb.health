import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Lead data validation schema
const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional().default('website'),
  notes: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = leadSchema.parse(body)
    
    // Log the lead data (in production, this would be sent to CRM/database)
    console.log('📧 New Lead Received:', {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      subject: validatedData.subject,
      source: validatedData.source,
      timestamp: new Date().toISOString()
    })
    
    // TODO: Integrate with CRM system (HubSpot, Salesforce, etc.)
    // TODO: Send confirmation email to lead
    // TODO: Send notification to sales team
    // TODO: Store in database (Supabase, MongoDB, etc.)
    
    // For now, return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead captured successfully',
        leadId: `lead_${Date.now()}`
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('❌ Lead API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.issues
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
