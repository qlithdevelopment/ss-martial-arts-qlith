const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'client', 'src', 'pages', 'admin');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx') && f !== 'Contacts.jsx' && f !== 'Dashboard.jsx' && f !== 'StudentManagement.jsx' && f !== 'StudentView.jsx');

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add RefreshCw to lucide-react import
    if (!content.includes('RefreshCw')) {
        content = content.replace(/from 'lucide-react';/, ", RefreshCw } from 'lucide-react';").replace(/} , RefreshCw }/, ", RefreshCw }");
    }

    // Determine the fetch function name based on the file
    let fetchFn = 'fetch' + file.replace('.jsx', '');
    if (file === 'Galleries.jsx') fetchFn = 'fetchGalleries';
    // If the file uses a different fetch function, let's check
    const fetchMatch = content.match(/const (fetch[A-Za-z]+) = async/);
    if (fetchMatch) {
        fetchFn = fetchMatch[1];
    } else if (content.includes('const fetchData = async')) {
        fetchFn = 'fetchData';
    } else {
        fetchFn = 'fetch' + file.replace('.jsx', '');
    }

    // Add the refresh button
    const searchHeader = '<div className="flex w-full md:w-auto items-center gap-4">';
    if (content.includes(searchHeader) && !content.includes('title="Refresh"')) {
        const replaceStr = `<div className="flex w-full md:w-auto items-center gap-4">\n          <button onClick={${fetchFn}} className="p-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors" title="Refresh">\n            <RefreshCw size={20} />\n          </button>`;
        content = content.replace(searchHeader, replaceStr);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
