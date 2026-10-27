const fs = require('fs');
const path = require('path');

// Read java.ts
const tsContent = fs.readFileSync(path.join(__dirname, '../src/data/library/java.ts'), 'utf8');

// We can extract the items array JSON by finding the start and end of items
const itemsMatch = tsContent.match(/items:\s*(\[\s*\{[\s\S]*\}\s*\])\s*\n\};/);
if (!itemsMatch) {
  console.error("Could not parse items from java.ts");
  process.exit(1);
}

const items = JSON.parse(itemsMatch[1]);
console.log(`Parsed ${items.length} items from java.ts`);

const exportDir = path.join(__dirname, '../JAVA_EXPORT');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Remove old swapped files if present
const oldFile1 = path.join(exportDir, 'Exp_7.1_Static_Website_Student_Profile.txt');
const oldFile2 = path.join(exportDir, 'Exp_7.2_MyWebsite.txt');
if (fs.existsSync(oldFile1)) fs.unlinkSync(oldFile1);
if (fs.existsSync(oldFile2)) fs.unlinkSync(oldFile2);

// File name mapping
const fileNameMap = {
  "1.1": "Exp_1.1_Count_Numbers.txt",
  "1.2": "Exp_1.2_Prime_Number.txt",
  "1.3": "Exp_1.3_Student_Encapsulation.txt",
  "2.1": "Exp_2.1_Method_Overloading.txt",
  "2.2": "Exp_2.2_Constructor_Overloading.txt",
  "3": "Exp_3_Abstract_Class_Shapes.txt",
  "4.1": "Exp_4.1_Method_Overriding_Bank.txt",
  "4.2": "Exp_4.2_Method_Overriding_Person.txt",
  "4.3": "Exp_4.3_Method_Overriding_Animal.txt",
  "5.1": "Exp_5.1_Types_Of_Inheritance.txt",
  "5.2": "Exp_5.2_Exception_Handling.txt",
  "6": "Exp_6_Generic_And_HTTP_Servlet.txt",
  "7.1": "Exp_7.1_MyWebsite.txt",
  "7.2": "Exp_7.2_Static_Website_Student_Profile.txt",
  "8": "Exp_8_Email_Validation.txt",
  "9": "Exp_9_DOM_Background_Color.txt",
  "10": "Exp_10_Stopwatch.txt",
  "11": "Exp_11_React_Hooks_Color_Buttons.txt"
};

for (const item of items) {
  const fileName = fileNameMap[item.expNo];
  if (!fileName) {
    console.warn(`No filename mapped for expNo ${item.expNo}`);
    continue;
  }

  let content = `Experiment ${item.expNo}: ${item.title}\n`;

  if (item.files.length === 1) {
    // Single file
    let code = item.files[0].code.replace(/\t/g, '    ');
    content += code.trimEnd() + '\n\n';
  } else {
    // Multiple files
    for (const f of item.files) {
      let code = f.code.replace(/\t/g, '    ');
      content += `FILE: ${f.name}\n${code.trimEnd()}\n\n`;
    }
  }

  content += `OUTPUT:\n${item.savedOutput.trimEnd()}\n`;

  const filePath = path.join(exportDir, fileName);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Wrote: ${fileName}`);
}

console.log('Export complete.');
