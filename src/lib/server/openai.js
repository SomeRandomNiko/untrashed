import { OPENAI_API_KEY } from "$env/static/private";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
export async function classifyTrash(image) {
  const chatResult = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      { role: "system", content: CLASSIFY_TRASH_PROPMT },
      {
        role: "user",
        content: [
          { text: "Classify this image", type: "text" },
          {
            type: "image_url",
            image_url: {
              url: image,
            },
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: CLASSIFY_TRASH_SCHEMA,
    },
  });

  return chatResult.choices[0].message.content;
}

const CLASSIFY_TRASH_PROPMT = `
Classify the image of trash and extract the associated information in JSON format following the provided schema. If the image is not of trash, set "isTrash" to false and "data" to null; otherwise, set "isTrash" to true and include the necessary properties.

# Steps
- Examine the image to determine if it contains trash.
  - If it does not contain trash, set "isTrash" to false in the JSON output and set "data" to null.
  - If it does contain trash, set "isTrash" to true in the JSON.
- If the image contains trash:
  - Identify the specific type of trash (e.g., glass bottle, plastic wrapper).
  - Generate a concise description of the trash.
  - Classify the trash into one of the recognized categories: organic, paper, glass, metal, household, or electronics.
  - Assess the environmental impact and classify it as "low," "medium," or "high":
    - "Low" for small discarded items like paper or paper waste.
    - "Medium" for plastic items such as bottles or packaging.
    - "High" for electronics like TVs, washing machines, or anything containing harmful materials.
  - Determine the size of the trash item as "small," "medium," or "large."

# Output Format

Provide the output in JSON format with the following structure:

{
  "isTrash": "boolean indicating if the image contains trash",
  "data": {
    "name": "string representing the type of trash",
    "description": "concise description of the trash",
    "category": "one of: organic, paper, glass, metal, household, electronics",
    "impact": "classification of environmental impact as low, medium, or high",
    "size": "classification of the size as small, medium, or large"
  } or null if isTrash is false
}

# Examples

**Input:** [Image of crumpled paper on the side of the road.]  
**Output:** 
{
  "isTrash": true,
  "data": {
    "name": "crumpled paper",
    "description": "Crumpled paper lying on the roadside",
    "category": "paper",
    "impact": "low",
    "size": "small"
  }
}

**Input:** [Image of a plastic bottle lying in the grass.]  
**Output:**
{
  "isTrash": true,
  "data": {
    "name": "plastic bottle",
    "description": "discarded plastic bottle in the grass",
    "category": "household",
    "impact": "medium",
    "size": "medium"
  }
}

**Input:** [Image of an empty road with no trash.]  
**Output:** 
{
  "isTrash": false,
  "data": null
}

**Input:** [Image of old washing machine on the roadside.]  
**Output:** 
{
  "isTrash": true,
  "data": {
    "name": "washing machine",
    "description": "broken washing machine left on the roadside",
    "category": "electronics",
    "impact": "high",
    "size": "large"
  }
}


# Notes
- Only describe a single item of trash per output.
- If multiple items of different types are present, focus on the item with the highest environmental impact.
- Respond only with the JSON, following the schema entirely — no additional commentary or formatting outside of the JSON schema provided.
`;

const CLASSIFY_TRASH_SCHEMA = {
  name: "classify_trash",
  strict: true,
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      isTrash: {
        type: "boolean",
      },
      data: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          category: {
            type: "string",
            enum: ["organic", "paper", "glass", "metal", "household", "electronics"],
          },
          impact: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
          size: {
            type: "string",
            enum: ["small", "medium", "large"],
          },
        },
        required: ["name", "description", "category", "impact", "size"],
        additionalProperties: false,
      },
    },
    required: ["isTrash", "data"],
    additionalProperties: false,
  },
};
