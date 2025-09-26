const fs = require('fs');
const path = require('path');

// Base dashboard path
const basePath = 'C:/Users/Admin/Desktop/projects/meetup-buddy/app/dashboard';

// List of subdirectories to update (excluding agenda and data-library which we already updated)
const subdirectories = [
  'file',
  'settings',
  'scheduling',
  'reminders',
  'follow-ups',
  'calendar'
];

// Function to update a page file
function updatePageFile(filePath) {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has RightPanel import
  if (!content.includes("import { RightPanel } from \"@/components/ui/right-panel\"")) {
    // Add the import
    content = content.replace(
      /(import.+badge['"].*?\n)/i, 
      "$1import { RightPanel } from \"@/components/ui/right-panel\"\n"
    );
  }
  
  // Update the main element structure
  content = content.replace(
    /(<SidebarInset[^>]*>\s*<Navbar\s*\/>\s*<SiteHeader\s*\/>\s*)<main([^>]*)>/s,
    "$1<div className=\"flex-1 overflow-auto\">\n          <div className=\"flex\">\n            <main$2>"
  );
  
  // Update the closing tags
  content = content.replace(
    /<\/main>\s*<\/SidebarInset>\s*<\/SidebarProvider>/s,
    "</main>\n            <RightPanel />\n          </div>\n        </div>\n      </SidebarInset>\n    </SidebarProvider>"
  );
  
  // Write the file back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

// Process each subdirectory
for (const subdir of subdirectories) {
  const pagePath = path.join(basePath, subdir, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    updatePageFile(pagePath);
  } else {
    console.log(`File not found: ${pagePath}`);
  }
}

console.log('All dashboard pages updated!');