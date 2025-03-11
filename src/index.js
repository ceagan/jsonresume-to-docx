// src/index.js
const { createReport } = require("docx-templates");
const fs = require("fs/promises");
const path = require("path");
const { validate } = require("@jsonresume/schema");

async function generateResumeDocx(inputJsonPath, templatePath, outputPath) {
  try {
    // Read JSON resume
    const jsonResumeString = await fs.readFile(inputJsonPath, "utf-8");
    const jsonResume = JSON.parse(jsonResumeString);

    // Validate against JSON Resume schema with Promise wrapper
    await new Promise((resolve, reject) => {
      validate(jsonResume, (error) => {
        if (error) {
          // If there’s an error, it means validation failed
          reject(new Error("Invalid JSON Resume format: " + error.message));
        } else {
          // If no error, validation succeeded
          resolve();
        }
      });
    });

    // Read template
    const template = await fs.readFile(templatePath);

    // Generate DOCX directly with resume data
    const buffer = await createReport({
      template,
      data: jsonResume,
      cmdDelimiter: ["{{", "}}"],
    });

    // Write output file
    const fullName = jsonResume.basics.name;
    const formattedName = reorderName(fullName);
    const yearMonth = getYearMonth();
    const outputFile = path.join(outputPath, `${formattedName} Resume v${yearMonth}.docx`)
    await fs.writeFile(outputFile, buffer);
    console.log(`Resume generated successfully at ${outputFile}`);
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
}

function reorderName(fullName) {
  // Split the name into an array of words
  const nameParts = fullName.trim().split(/\s+/);

  // If there's only one name, return it as is
  if (nameParts.length <= 1) {
    return fullName;
  }

  // Get the last name
  const lastName = nameParts.pop();

  // Join the remaining names with spaces and add the last name at the start
  return `${lastName}, ${nameParts.join(" ")}`;
}

function getYearMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-based
    return `${year}${month}`;
}

// Example usage
async function main() {
  const inputJsonPath = path.join(process.cwd(), "resume.json");
  const templatePath = path.join(process.cwd(), "template.docx");
  const outputPath = process.cwd();

  await generateResumeDocx(inputJsonPath, templatePath, outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}
