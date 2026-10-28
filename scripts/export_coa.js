const fs = require('fs');
const path = require('path');

const exportDir = path.join(__dirname, '../COA_EXPORT');
if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
}

// Read items from coa.ts
const tsContent = fs.readFileSync(path.join(__dirname, '../src/data/library/coa.ts'), 'utf8');
const itemsMatch = tsContent.match(/items:\s*(\[\s*\{[\s\S]*\}\s*\])\s*\n\};/);
if (!itemsMatch) {
    console.error("Could not parse items from coa.ts");
    process.exit(1);
}

const items = eval('(' + itemsMatch[1] + ')');
console.log(`Parsed ${items.length} items from coa.ts`);

const idNameMap = {
    "c1": "EXP_Password_Detection_Application.txt",
    "c2": "EXP_Logic_Gates.txt",
    "c3": "EXP_Bubble_Sort.txt",
    "c4": "EXP_Booth_Multiplication.txt"
};

// Clean up old numbered files if present
const oldNumbered = [
    "Exp_1_Password_Detection_Application.txt",
    "Exp_2_Logic_Gates.txt",
    "Exp_3_Bubble_Sort.txt",
    "Exp_4_Booth_Multiplication.txt"
];
oldNumbered.forEach(f => {
    const p = path.join(exportDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
});

for (const item of items) {
    const fileName = idNameMap[item.id];
    let content = `EXP — ${item.title}\n`;
    content += item.files[0].code.trimEnd() + '\n\n';
    content += `OUTPUT:\n${item.savedOutput.trimEnd()}\n`;

    const filePath = path.join(exportDir, fileName);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Wrote: ${fileName}`);
}

console.log('COA Export complete.');
