const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walk(dirPath, cb);
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        cb(dirPath);
      }
    }
  });
}

const colorReplacements = [
  // Primary Buttons (Indigo -> Blue refs)
  { regex: /bg-indigo-600/g, replacement: 'bg-[#2563EB]' },
  { regex: /hover:bg-indigo-700/g, replacement: 'hover:bg-[#1D4ED8]' },
  { regex: /bg-indigo-50/g, replacement: 'bg-[#EFF6FF]' },
  { regex: /text-indigo-700/g, replacement: 'text-[#1D4ED8]' },
  { regex: /text-indigo-600/g, replacement: 'text-[#2563EB]' },
  { regex: /border-indigo-600/g, replacement: 'border-[#2563EB]' },
  { regex: /ring-indigo-600/g, replacement: 'ring-[#2563EB]' },
  
  // Previous gray remnants just in case they survived the last update
  { regex: /bg-gray-900/g, replacement: 'bg-[#2563EB]' }, // generic dark buttons to primary blue
  { regex: /hover:bg-gray-800/g, replacement: 'hover:bg-[#1D4ED8]' },
  
  // Texts
  { regex: /text-gray-800/g, replacement: 'text-[#1F2937]' },
  { regex: /text-gray-900/g, replacement: 'text-[#1F2937]' }, // Some left overs
  { regex: /text-gray-500/g, replacement: 'text-[#6B7280]' },
  { regex: /text-gray-600/g, replacement: 'text-[#6B7280]' }, // Some left overs
  
  // Borders
  { regex: /border-gray-200/g, replacement: 'border-[#E5DED6]' },
  { regex: /border-gray-100/g, replacement: 'border-[#E5DED6]' },
  { regex: /border-gray-300/g, replacement: 'border-[#E5DED6]' },

  // Backgrounds Structure (The trickiest globals, handle generics, then we manual patch specifics)
  { regex: /bg-gray-50/g, replacement: 'bg-[#EFE9E1]' }, // Mapping common secondary backgrounds to the slightly darker beige
  { regex: /bg-gray-100/g, replacement: 'bg-[#EFE9E1]' } // Making buttons that were light gray slightly beige
];

walk('src', (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  colorReplacements.forEach(cr => {
    content = content.replace(cr.regex, cr.replacement);
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
  }
});
console.log('Script execution finished.');
