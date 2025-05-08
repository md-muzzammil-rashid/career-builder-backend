// export function parseCourseFromString(courseString) {
//     try {
//       if (!courseString.startsWith("```json") || !courseString.endsWith("```")) {
//         throw new Error("Invalid format: Missing or incorrect ```json``` block");
//       }
  
//       const plainJsonString = courseString
//         .replace(/^```json\n/, "")
//         .replace(/\n```$/, "")
//         .trim();
  
//       return JSON.parse(plainJsonString);
//     } catch (error) {
//       throw new Error(`Failed to parse course JSON: ${error.message}`);
//     }
//   }

export function parseCourseFromString(courseString) {
  try {
    const match = courseString.match(/```json\s*([\s\S]*?)\s*```/);

    if (!match || match.length < 2) {
      throw new Error("Invalid format: Missing or incorrect ```json``` block");
    }

    const plainJsonString = match[1].trim();
    return JSON.parse(plainJsonString);
  } catch (error) {
    throw new Error(`Failed to parse course JSON: ${error.message}`);
  }
}
