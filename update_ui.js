const fs = require('fs');

function processFile(file, replacements) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    replacements.forEach(r => {
        // Handle global or specific replacements
        if (typeof r.search === 'string') {
            newContent = newContent.split(r.search).join(r.replace);
        } else {
            newContent = newContent.replace(r.search, r.replace);
        }
    });
    if (newContent !== content) {
        fs.writeFileSync(file, newContent);
        console.log(`Updated ${file}`);
    }
}

// 1. Home.tsx AND Navbar.tsx Re-apply
const homeNavbarFixes = [
    { search: /bg-gray-900/g, replace: 'bg-indigo-600' },
    { search: /hover:bg-gray-800/g, replace: 'hover:bg-indigo-700' },
    { search: /text-gray-900/g, replace: 'text-gray-800' },
    { search: /text-gray-600/g, replace: 'text-gray-500' },
    { search: /bg-gray-100 text-gray-900/g, replace: 'bg-indigo-50 text-indigo-700' },
];
processFile('src/pages/Home.tsx', homeNavbarFixes);
processFile('src/components/Navbar.tsx', homeNavbarFixes);
processFile('src/components/Footer.tsx', homeNavbarFixes);
processFile('src/components/PricingCard.tsx', homeNavbarFixes);
processFile('src/components/TestimonialCard.tsx', homeNavbarFixes);
processFile('src/components/FeatureCard.tsx', homeNavbarFixes);

// 2. Sidebar Active State
const sidebarFixes = [
    { search: "bg-white text-gray-800 shadow-sm", replace: "bg-indigo-50 text-indigo-700 font-semibold" },
    { search: "hover:bg-white hover:text-gray-800", replace: "hover:bg-gray-100 hover:text-gray-900" }
];
processFile('src/components/Sidebar.tsx', sidebarFixes);

// 3. Task Badges in Tasks.tsx
const tasksFixes = [
    { search: "task.priority === 'High' ? 'bg-red-100 text-red-800' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'", replace: "task.priority === 'High' ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' : task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20' : 'bg-green-50 text-green-700 ring-1 ring-green-600/20'" },
    { search: "'pending': 'bg-gray-100 text-gray-800'", replace: "'pending': 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'" },
    { search: "'in-progress': 'bg-blue-100 text-blue-800'", replace: "'in-progress': 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'" },
    { search: "'completed': 'bg-green-100 text-green-800'", replace: "'completed': 'bg-green-50 text-green-700 ring-1 ring-green-600/20'" }
];
processFile('src/pages/Tasks.tsx', tasksFixes);

// 4. Badges in Dashboard.tsx
const dashboardFixes = [
    { search: "task.priority === 'High'\n                            ? 'bg-red-100 text-red-700'\n                            : task.priority === 'Medium'\n                            ? 'bg-yellow-100 text-yellow-700'\n                            : 'bg-gray-100 text-gray-700'", replace: "task.priority === 'High'\n                            ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20'\n                            : task.priority === 'Medium'\n                            ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'\n                            : 'bg-green-50 text-green-700 ring-1 ring-green-600/20'" },
    { search: "doc.status === 'Published'\n                            ? 'bg-green-100 text-green-700'\n                            : 'bg-gray-100 text-gray-700'", replace: "doc.status === 'Published'\n                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'\n                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'" }
];
processFile('src/pages/Dashboard.tsx', dashboardFixes);

console.log('UI script update complete.');
