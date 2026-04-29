const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, '../src/pages'),
  path.join(__dirname, '../src/components')
];

let filesToUpdate = [];

function getFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      // Exclude Navbar.jsx, Home.jsx, MechanicCard.jsx, NotificationBell.jsx as they were done manually
      if (!['Navbar.jsx', 'Home.jsx', 'MechanicCard.jsx', 'NotificationBell.jsx'].includes(item)) {
         filesToUpdate.push(fullPath);
      }
    }
  }
}

directories.forEach(getFiles);

filesToUpdate.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Layout Colors
  content = content.replace(/bg-bg-dark/g, 'bg-gray-50');
  content = content.replace(/bg-zinc-900\/50/g, 'bg-blue-50');
  content = content.replace(/bg-zinc-950\/60/g, 'bg-gray-50');
  content = content.replace(/bg-zinc-900\/90/g, 'bg-white');
  content = content.replace(/bg-zinc-800\/20/g, 'bg-gray-50');
  content = content.replace(/bg-zinc-900/g, 'bg-white');
  content = content.replace(/bg-zinc-950/g, 'bg-white');
  content = content.replace(/bg-zinc-800/g, 'bg-gray-100');
  content = content.replace(/bg-zinc-700/g, 'bg-gray-200');
  
  // Text Colors
  content = content.replace(/text-white/g, 'text-gray-900');
  content = content.replace(/text-zinc-300/g, 'text-gray-700');
  content = content.replace(/text-zinc-400/g, 'text-gray-600');
  content = content.replace(/text-zinc-500/g, 'text-gray-500');
  content = content.replace(/text-zinc-600/g, 'text-gray-400');
  content = content.replace(/placeholder-zinc-600/g, 'placeholder-gray-400');
  content = content.replace(/placeholder-zinc-500/g, 'placeholder-gray-400');
  
  // Border Colors
  content = content.replace(/border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900/g, 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-50');
  content = content.replace(/border-zinc-800\/50/g, 'border-gray-200');
  content = content.replace(/border-zinc-800\/80/g, 'border-gray-200');
  content = content.replace(/border-zinc-800/g, 'border-gray-200');
  content = content.replace(/border-zinc-700/g, 'border-gray-300');
  
  // Brand Colors
  content = content.replace(/bg-brand-red-light/g, 'bg-blue-700');
  content = content.replace(/bg-brand-red\/10/g, 'bg-blue-50');
  content = content.replace(/bg-brand-red\/5/g, 'bg-blue-50');
  content = content.replace(/bg-brand-red/g, 'bg-blue-600');
  content = content.replace(/text-brand-red/g, 'text-blue-600');
  content = content.replace(/border-brand-red\/30/g, 'border-blue-200');
  content = content.replace(/border-brand-red\/20/g, 'border-blue-200');
  content = content.replace(/border-brand-red/g, 'border-blue-600');
  content = content.replace(/ring-brand-red/g, 'ring-blue-600');
  
  // Specific complex shadows/gradients
  content = content.replace(/shadow-\[0_0_15px_rgba\(234,0,41,0\.3\)\]/g, 'shadow-md');
  content = content.replace(/shadow-\[0_4px_14px_0_rgba\(234,0,41,0\.39\)\]/g, 'shadow-md');
  content = content.replace(/shadow-\[0_0_30px_rgba\(234,0,41,0\.1\)\]/g, 'shadow-lg');
  content = content.replace(/shadow-\[0_0_40px_rgba\(234,0,41,0\.15\)\]/g, 'shadow-md');
  content = content.replace(/shadow-\[0_0_50px_rgba\(234,0,41,0\.3\)\]/g, 'shadow-lg');
  content = content.replace(/shadow-\[0_20px_50px_rgba\(0,0,0,0\.5\)\]/g, 'shadow-2xl');
  content = content.replace(/shadow-\[0_6px_25px_rgba\(234,0,41,0\.5\)\]/g, 'shadow-lg');

  fs.writeFileSync(file, content);
  console.log(`Updated ${path.basename(file)}`);
});
