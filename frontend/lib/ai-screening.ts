import {GoogleGenAI} from '@google/genai'


const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});


export interface JobRequirements {
  position: string
  requiredSkills: string[]
  description?: string
  experienceLevel: string
  location?: string
  jobType?: string
}

export interface ApplicationData {
  experience: string
  about: string
  skills: string[]
  education?: string
  location?: string
}

export interface ScreeningResult {
  qualified: boolean
  score: number
  reasoning: string
  matchedSkills: string[]
  missingSkills: string[]
  recommendations?: string[]
}

export async function screenApplication(
  jobRequirements: JobRequirements,
  applicationData: ApplicationData,
): Promise<ScreeningResult> {
  try {
    const prompt = `
You are an AI recruiter screening job applications. Analyze the following application against the job requirements and provide a detailed assessment.

JOB REQUIREMENTS:
- Position: ${jobRequirements.position}
- Required Skills: ${jobRequirements.requiredSkills.join(", ")}
- Experience Level: ${jobRequirements.experienceLevel}
- Location: ${jobRequirements.location || "Not specified"}
- Job Type: ${jobRequirements.jobType || "Not specified"}

CANDIDATE APPLICATION:
- Experience: ${applicationData.experience}
- Skills: ${applicationData.skills.join(", ")}
- Education: ${applicationData.education || "Not provided"}
- Location: ${applicationData.location || "Not provided"}

Please analyze this application and respond with a JSON object containing:
{
  "qualified": boolean (true if candidate meets minimum requirements),
  "score": number (0-100 compatibility score),
  "reasoning": "detailed explanation of the decision",
  "matchedSkills": ["list of skills that match requirements"],
  "missingSkills": ["list of required skills the candidate lacks"],
}

Qualification criteria:
- Must have at least 70% of required skills
- Experience level should be appropriate (entry: 0-2 years, mid: 2-5 years, senior: 5+ years)
- Education requirements should be met if specified
- Overall compatibility score should be above 60

Be fair but thorough in your assessment. Focus on technical qualifications and relevant experience.
`




    const aiResponse = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    // Get the text from the AI response
    const text = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleanedText) as ScreeningResult;

    // Validate the result
    if (typeof result.qualified !== "boolean" || typeof result.score !== "number") {
      throw new Error("Invalid AI response format")
    }

    return result
  } catch (error) {
    console.error("AI screening error:", error)

    // Fallback: basic keyword matching if AI fails
    const matchedSkills = applicationData.skills.filter((skill) =>
      jobRequirements.requiredSkills.some(
        (req) => req.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(req.toLowerCase()),
      ),
    )

    const matchPercentage = (matchedSkills.length / jobRequirements.requiredSkills.length) * 100

    return {
      qualified: matchPercentage >= 50, // Lower threshold for fallback
      score: Math.min(matchPercentage, 100),
      reasoning: "AI screening temporarily unavailable. Basic keyword matching applied.",
      matchedSkills,
      missingSkills: jobRequirements.requiredSkills.filter(
        (skill) => !matchedSkills.some((matched) => matched.toLowerCase().includes(skill.toLowerCase())),
      ),
      recommendations: ["Please review manually due to AI screening unavailability"],
    }
  }
}

export function getExperienceYears(experienceText: string): number {
  const match = experienceText.match(/(\d+)\s*(?:years?|yrs?)/i)
  return match ? Number.parseInt(match[1]) : 0
}

export function categorizeExperienceLevel(years: number): string {
  if (years <= 2) return "junior"
  if (years <= 5) return "mid"
  return "senior"
}
