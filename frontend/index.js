// Configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:8080',
    DEFAULT_CENTER: [39.2904, -76.6122], // Glen Burnie, Maryland (user's location)
    DEFAULT_ZOOM: 4,
    POPUP_MAX_WIDTH: 300
};

// Global variables
let map;
let markers = [];
let allMarkers = [];
let markerLayer;

// US Cities data for autocomplete (simplified subset)
const US_CITIES = [
    { name: 'Baltimore', state: 'MD', lat: 39.2904, lng: -76.6122, id: 'baltimore_md' },
    { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060, id: 'newyork_ny' },
    { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, id: 'losangeles_ca' },
    { name: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298, id: 'chicago_il' },
    { name: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698, id: 'houston_tx' },
    { name: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740, id: 'phoenix_az' },
    { name: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652, id: 'philadelphia_pa' },
    { name: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936, id: 'sanantonio_tx' },
    { name: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611, id: 'sandiego_ca' },
    { name: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970, id: 'dallas_tx' },
    { name: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431, id: 'austin_tx' },
    { name: 'San Jose', state: 'CA', lat: 37.3382, lng: -121.8863, id: 'sanjose_ca' },
    { name: 'Fort Worth', state: 'TX', lat: 32.7555, lng: -97.3308, id: 'fortworth_tx' },
    { name: 'Columbus', state: 'OH', lat: 39.9612, lng: -82.9988, id: 'columbus_oh' },
    { name: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431, id: 'charlotte_nc' },
    { name: 'Indianapolis', state: 'IN', lat: 39.7684, lng: -86.1581, id: 'indianapolis_in' },
    { name: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194, id: 'sanfrancisco_ca' },
    { name: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321, id: 'seattle_wa' },
    { name: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903, id: 'denver_co' },
    { name: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589, id: 'boston_ma' },
    { name: 'Detroit', state: 'MI', lat: 42.3314, lng: -83.0458, id: 'detroit_mi' },
    { name: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816, id: 'nashville_tn' },
    { name: 'Memphis', state: 'TN', lat: 35.1495, lng: -90.0490, id: 'memphis_tn' },
    { name: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784, id: 'portland_or' },
    { name: 'Las Vegas', state: 'NV', lat: 36.1699, lng: -115.1398, id: 'lasvegas_nv' },
    { name: 'Louisville', state: 'KY', lat: 38.2527, lng: -85.7585, id: 'louisville_ky' },
    { name: 'Milwaukee', state: 'WI', lat: 43.0389, lng: -87.9065, id: 'milwaukee_wi' },
    { name: 'Albuquerque', state: 'NM', lat: 35.0844, lng: -106.6504, id: 'albuquerque_nm' },
    { name: 'Tucson', state: 'AZ', lat: 32.2226, lng: -110.9747, id: 'tucson_az' },
    { name: 'Fresno', state: 'CA', lat: 36.7378, lng: -119.7871, id: 'fresno_ca' },
    { name: 'Sacramento', state: 'CA', lat: 38.5816, lng: -121.4944, id: 'sacramento_ca' },
    { name: 'Mesa', state: 'AZ', lat: 33.4152, lng: -111.8315, id: 'mesa_az' },
    { name: 'Kansas City', state: 'MO', lat: 39.0997, lng: -94.5786, id: 'kansascity_mo' },
    { name: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880, id: 'atlanta_ga' },
    { name: 'Colorado Springs', state: 'CO', lat: 38.8339, lng: -104.8214, id: 'coloradosprings_co' },
    { name: 'Raleigh', state: 'NC', lat: 35.7796, lng: -78.6382, id: 'raleigh_nc' },
    { name: 'Omaha', state: 'NE', lat: 41.2565, lng: -95.9345, id: 'omaha_ne' },
    { name: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918, id: 'miami_fl' },
    { name: 'Virginia Beach', state: 'VA', lat: 36.8529, lng: -75.9780, id: 'virginiabeach_va' },
    { name: 'Oakland', state: 'CA', lat: 37.8044, lng: -122.2712, id: 'oakland_ca' },
    { name: 'Minneapolis', state: 'MN', lat: 44.9778, lng: -93.2650, id: 'minneapolis_mn' },
    { name: 'Tulsa', state: 'OK', lat: 36.1540, lng: -95.9928, id: 'tulsa_ok' },
    { name: 'Arlington', state: 'TX', lat: 32.7357, lng: -97.1081, id: 'arlington_tx' },
    { name: 'New Orleans', state: 'LA', lat: 29.9511, lng: -90.0715, id: 'neworleans_la' },
    { name: 'Wichita', state: 'KS', lat: 37.6872, lng: -97.3301, id: 'wichita_ks' },
    { name: 'Cleveland', state: 'OH', lat: 41.4993, lng: -81.6944, id: 'cleveland_oh' },
    { name: 'Tampa', state: 'FL', lat: 27.9506, lng: -82.4572, id: 'tampa_fl' },
    { name: 'Bakersfield', state: 'CA', lat: 35.3733, lng: -119.0187, id: 'bakersfield_ca' },
    { name: 'Aurora', state: 'CO', lat: 39.7294, lng: -104.8319, id: 'aurora_co' },
    { name: 'Honolulu', state: 'HI', lat: 21.3099, lng: -157.8581, id: 'honolulu_hi' },
    { name: 'Anaheim', state: 'CA', lat: 33.8366, lng: -117.9143, id: 'anaheim_ca' },
    { name: 'Santa Ana', state: 'CA', lat: 33.7455, lng: -117.8677, id: 'santaana_ca' },
    { name: 'Corpus Christi', state: 'TX', lat: 27.8006, lng: -97.3964, id: 'corpuschristi_tx' },
    { name: 'Riverside', state: 'CA', lat: 33.9533, lng: -117.3962, id: 'riverside_ca' },
    { name: 'Lexington', state: 'KY', lat: 38.0406, lng: -84.5037, id: 'lexington_ky' },
    { name: 'St. Louis', state: 'MO', lat: 38.6270, lng: -90.1994, id: 'stlouis_mo' },
    { name: 'Stockton', state: 'CA', lat: 37.9577, lng: -121.2908, id: 'stockton_ca' },
    { name: 'St. Paul', state: 'MN', lat: 44.9537, lng: -93.0900, id: 'stpaul_mn' },
    { name: 'Cincinnati', state: 'OH', lat: 39.1031, lng: -84.5120, id: 'cincinnati_oh' },
    { name: 'Anchorage', state: 'AK', lat: 61.2181, lng: -149.9003, id: 'anchorage_ak' },
    { name: 'Henderson', state: 'NV', lat: 36.0397, lng: -114.9817, id: 'henderson_nv' },
    { name: 'Greensboro', state: 'NC', lat: 36.0726, lng: -79.7920, id: 'greensboro_nc' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    setupCityAutocomplete();
    loadAllMarkers();
});

// Initialize the Leaflet map
function initializeMap() {
    map = L.map('map').setView(CONFIG.DEFAULT_CENTER, CONFIG.DEFAULT_ZOOM);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Create a layer group for markers
    markerLayer = L.layerGroup().addTo(map);
}

// Setup event listeners
function setupEventListeners() {
    // Add marker form
    document.getElementById('add-marker-form').addEventListener('submit', handleAddMarker);
    
    // Filter controls
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    
    // Real-time city filter
    document.getElementById('filter-city').addEventListener('input', applyFilters);
    
    // Date validation
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
    });
    
    endDateInput.addEventListener('change', function() {
        if (this.value < startDateInput.value) {
            startDateInput.value = this.value;
        }
    });
}

// Setup city autocomplete
function setupCityAutocomplete() {
    const cityInput = document.getElementById('city-input');
    const suggestionsDiv = document.getElementById('city-suggestions');
    
    cityInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            suggestionsDiv.classList.add('hidden');
            return;
        }
        
        const matches = US_CITIES.filter(city => 
            city.name.toLowerCase().includes(query) || 
            city.state.toLowerCase().includes(query)
        ).slice(0, 10);
        
        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(city => 
                `<div class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0" 
                      data-city="${city.name}" data-state="${city.state}" data-id="${city.id}" data-lat="${city.lat}" data-lng="${city.lng}">
                    <div class="font-medium">${city.name}</div>
                    <div class="text-sm text-gray-500">${city.state}</div>
                 </div>`
            ).join('');
            suggestionsDiv.classList.remove('hidden');
            
            // Add click handlers
            suggestionsDiv.querySelectorAll('[data-city]').forEach(item => {
                item.addEventListener('click', function() {
                    cityInput.value = `${this.dataset.city}, ${this.dataset.state}`;
                    cityInput.dataset.cityId = this.dataset.id;
                    cityInput.dataset.lat = this.dataset.lat;
                    cityInput.dataset.lng = this.dataset.lng;
                    suggestionsDiv.classList.add('hidden');
                });
            });
        } else {
            suggestionsDiv.classList.add('hidden');
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!cityInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.add('hidden');
        }
    });
}

// Handle adding a new marker
async function handleAddMarker(e) {
    e.preventDefault();
    
    const cityInput = document.getElementById('city-input');
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!cityInput.dataset.cityId) {
        showToast('Please select a city from the suggestions', 'error');
        return;
    }
    
    const markerData = {
        simpleMapsCityId: cityInput.dataset.cityId,
        cityName: cityInput.value,
        startDate: new Date(startDate + 'T00:00:00').toISOString(),
        endDate: new Date(endDate + 'T23:59:59').toISOString()
    };
    
    try {
        showLoading(true);
        const response = await fetch(`${CONFIG.API_BASE_URL}/mapMarker`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(markerData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newMarker = await response.json();
        showToast(`Marker added successfully! Your anonymous name: ${newMarker.anonymizedCreatorName}`, 'success');
        
        // Clear form
        document.getElementById('add-marker-form').reset();
        cityInput.removeAttribute('data-city-id');
        cityInput.removeAttribute('data-lat');
        cityInput.removeAttribute('data-lng');
        
        // Reload markers
        await loadAllMarkers();
        
    } catch (error) {
        console.error('Error adding marker:', error);
        showToast('Failed to add marker. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Load all markers from the API
async function loadAllMarkers() {
    try {
        showLoading(true);
        const response = await fetch(`${CONFIG.API_BASE_URL}/mapMarker/all`);
        
		console.debug(response, "resp")
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allMarkers = await response.json() || [];
		console.log(allMarkers)
        displayMarkers(allMarkers);
        updateStats();
        
    } catch (error) {
        console.error('Error loading markers:', error);
        showToast('Failed to load markers. Please refresh the page.', 'error');
    } finally {
        showLoading(false);
    }
}

// Display markers on the map
function displayMarkers(markersToShow) {
    // Clear existing markers
    markerLayer.clearLayers();
    markers = [];
    
    markersToShow.forEach(markerData => {
        // Find city coordinates
        const cityInfo = US_CITIES.find(city => 
            city.id === markerData.simpleMapsCityId || 
            city.name.toLowerCase() === markerData.cityName.split(',')[0].toLowerCase()
        );
        
        if (!cityInfo) {
            console.warn(`Could not find coordinates for city: ${markerData.cityName}`);
            return;
        }
        
        // Create marker
        const marker = L.marker([cityInfo.lat, cityInfo.lng])
            .bindPopup(createPopupContent(markerData), {
                maxWidth: CONFIG.POPUP_MAX_WIDTH
            });
        
        markerLayer.addLayer(marker);
        markers.push({ marker, data: markerData });
    });
    
    // Update visible markers count
    document.getElementById('visible-markers').textContent = markersToShow.length;
}

// Create popup content for markers
function createPopupContent(markerData) {
    const startDate = new Date(markerData.startDate).toLocaleDateString();
    const endDate = new Date(markerData.endDate).toLocaleDateString();
    const isActive = new Date() >= new Date(markerData.startDate) && new Date() <= new Date(markerData.endDate);
    
    return `
        <div class="p-2">
            <div class="flex items-center mb-2">
                <h3 class="font-bold text-lg text-gray-800">${markerData.cityName}</h3>
                ${isActive ? '<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>' : ''}
            </div>
            
            <div class="space-y-2 text-sm">
                <div class="flex items-center">
                    <span class="font-medium text-gray-600">👤 Traveler:</span>
                    <span class="ml-2 font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        ${markerData.anonymizedCreatorName}
                    </span>
                </div>
                
                <div class="flex items-center">
                    <span class="font-medium text-gray-600">📅 Dates:</span>
                    <span class="ml-2">${startDate} - ${endDate}</span>
                </div>
                
                <div class="flex items-center">
                    <span class="font-medium text-gray-600">⏱️ Duration:</span>
                    <span class="ml-2">${calculateDuration(markerData.startDate, markerData.endDate)}</span>
                </div>
            </div>
            
            <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-500 mb-2">
                    💡 Connect via your dance community's Facebook group
                </p>
                <button onclick="deleteMarker('${markerData.id}')" 
                        class="text-red-600 hover:text-red-800 text-xs underline">
                    Remove this marker
                </button>
            </div>
        </div>
    `;
}

// Calculate duration between dates
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''}`;
}

// Delete marker
async function deleteMarker(markerId) {
    if (!confirm('Are you sure you want to remove this marker?')) {
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`${CONFIG.API_BASE_URL}/mapMarker?markerId=${markerId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showToast('Marker removed successfully', 'success');
        await loadAllMarkers();
        
    } catch (error) {
		console.error('Error deleting marker:', error);
       showToast('Failed to remove marker. Please try again.', 'error');
   } finally {
       showLoading(false);
   }
}

// Apply filters to markers
function applyFilters() {
   const filterStartDate = document.getElementById('filter-start-date').value;
   const filterEndDate = document.getElementById('filter-end-date').value;
   const filterCity = document.getElementById('filter-city').value.toLowerCase().trim();
   
   let filteredMarkers = allMarkers;
   
   // Filter by date range
   if (filterStartDate || filterEndDate) {
       filteredMarkers = filteredMarkers.filter(marker => {
           const markerStart = new Date(marker.startDate);
           const markerEnd = new Date(marker.endDate);
           
           if (filterStartDate && filterEndDate) {
               const filterStart = new Date(filterStartDate);
               const filterEnd = new Date(filterEndDate);
               // Check if marker dates overlap with filter range
               return markerStart <= filterEnd && markerEnd >= filterStart;
           } else if (filterStartDate) {
               const filterStart = new Date(filterStartDate);
               return markerEnd >= filterStart;
           } else if (filterEndDate) {
               const filterEnd = new Date(filterEndDate);
               return markerStart <= filterEnd;
           }
           
           return true;
       });
   }
   
   // Filter by city
   if (filterCity) {
       filteredMarkers = filteredMarkers.filter(marker => 
           marker.cityName.toLowerCase().includes(filterCity) ||
           marker.anonymizedCreatorName.toLowerCase().includes(filterCity)
       );
   }
   
   displayMarkers(filteredMarkers);
   
   // Update filter indicator
   const hasFilters = filterStartDate || filterEndDate || filterCity;
   const applyButton = document.getElementById('apply-filters');
   if (hasFilters) {
       applyButton.classList.add('bg-orange-600', 'hover:bg-orange-700');
       applyButton.classList.remove('bg-green-600', 'hover:bg-green-700');
       applyButton.textContent = 'Filters Active';
   } else {
       applyButton.classList.remove('bg-orange-600', 'hover:bg-orange-700');
       applyButton.classList.add('bg-green-600', 'hover:bg-green-700');
       applyButton.textContent = 'Apply Filters';
   }
}

// Clear all filters
function clearFilters() {
   document.getElementById('filter-start-date').value = '';
   document.getElementById('filter-end-date').value = '';
   document.getElementById('filter-city').value = '';
   
   displayMarkers(allMarkers);
   
   // Reset filter button
   const applyButton = document.getElementById('apply-filters');
   applyButton.classList.remove('bg-orange-600', 'hover:bg-orange-700');
   applyButton.classList.add('bg-green-600', 'hover:bg-green-700');
   applyButton.textContent = 'Apply Filters';
}

// Update statistics
function updateStats() {
   document.getElementById('total-markers').textContent = allMarkers.length;
   document.getElementById('visible-markers').textContent = markers.length;
}

// Show/hide loading overlay
function showLoading(show) {
   const overlay = document.getElementById('loading-overlay');
   if (show) {
       overlay.classList.remove('hidden');
   } else {
       overlay.classList.add('hidden');
   }
}

// Show toast notification
function showToast(message, type = 'info') {
   const container = document.getElementById('toast-container');
   const toast = document.createElement('div');
   
   const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 'bg-blue-500';
   
   toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-x-full`;
   toast.innerHTML = `
       <div class="flex items-center space-x-2">
           <span>${getToastIcon(type)}</span>
           <span class="text-sm font-medium">${message}</span>
       </div>
   `;
   
   container.appendChild(toast);
   
   // Animate in
   setTimeout(() => {
       toast.classList.remove('translate-x-full');
   }, 100);
   
   // Auto remove after 5 seconds
   setTimeout(() => {
       toast.classList.add('translate-x-full');
       setTimeout(() => {
           if (container.contains(toast)) {
               container.removeChild(toast);
           }
       }, 300);
   }, 5000);
   
   // Allow manual dismissal
   toast.addEventListener('click', () => {
       toast.classList.add('translate-x-full');
       setTimeout(() => {
           if (container.contains(toast)) {
               container.removeChild(toast);
           }
       }, 300);
   });
}

// Get toast icon based on type
function getToastIcon(type) {
   switch (type) {
       case 'success': return '✅';
       case 'error': return '❌';
       default: return 'ℹ️';
   }
}

// Utility function to format dates
function formatDate(dateString) {
   return new Date(dateString).toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric'
   });
}

// Auto-refresh markers every 5 minutes
setInterval(() => {
   loadAllMarkers();
}, 300000);

// Set default dates to today and next week
document.addEventListener('DOMContentLoaded', function() {
   const today = new Date();
   const nextWeek = new Date(today);
   nextWeek.setDate(today.getDate() + 7);
   
   document.getElementById('start-date').value = today.toISOString().split('T')[0];
   document.getElementById('end-date').value = nextWeek.toISOString().split('T')[0];
});

// Enhanced mobile experience
if (window.innerWidth <= 768) {
   // Adjust map view for mobile
   CONFIG.DEFAULT_ZOOM = 3;
   
   // Add touch gestures for better mobile interaction
   document.addEventListener('touchstart', function(e) {
       if (e.touches.length > 1) {
           e.preventDefault(); // Prevent zoom on double-tap
       }
   }, { passive: false });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
   // Ctrl/Cmd + K to focus city search
   if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
       e.preventDefault();
       document.getElementById('city-input').focus();
   }
   
   // Escape to clear city suggestions
   if (e.key === 'Escape') {
       document.getElementById('city-suggestions').classList.add('hidden');
   }
});

// Add geolocation feature
function getCurrentLocation() {
   if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
           function(position) {
               const lat = position.coords.latitude;
               const lng = position.coords.longitude;
               map.setView([lat, lng], 10);
               
               // Add a temporary marker for current location
               const locationMarker = L.marker([lat, lng])
                   .addTo(map)
                   .bindPopup('📍 Your current location')
                   .openPopup();
               
               // Remove after 5 seconds
               setTimeout(() => {
                   map.removeLayer(locationMarker);
               }, 5000);
           },
           function(error) {
               console.warn('Geolocation error:', error);
               showToast('Could not get your location', 'error');
           }
       );
   } else {
       showToast('Geolocation is not supported by this browser', 'error');
   }
}

// Add location button to the map
const locationButton = L.control({ position: 'topright' });
locationButton.onAdd = function(map) {
   const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
   div.style.backgroundColor = 'white';
   div.style.width = '30px';
   div.style.height = '30px';
   div.style.cursor = 'pointer';
   div.style.display = 'flex';
   div.style.alignItems = 'center';
   div.style.justifyContent = 'center';
   div.innerHTML = '📍';
   div.title = 'Show my location';
   
   div.onclick = function() {
       getCurrentLocation();
   };
   
   return div;
};
locationButton.addTo(map);

// Error handling for network issues
window.addEventListener('online', function() {
   showToast('Connection restored', 'success');
   loadAllMarkers();
});

window.addEventListener('offline', function() {
   showToast('You are offline. Some features may not work.', 'error');
});

// Performance optimization: Debounce filter input
function debounce(func, wait) {
   let timeout;
   return function executedFunction(...args) {
       const later = () => {
           clearTimeout(timeout);
           func(...args);
       };
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
   };
}

// Apply debounced filtering for city input
const debouncedApplyFilters = debounce(applyFilters, 300);
document.getElementById('filter-city').addEventListener('input', debouncedApplyFilters);

// Add marker clustering for better performance with many markers
// Note: You might want to add leaflet.markercluster plugin for this in a production app

// Export data functionality (optional)
function exportData() {
   const dataStr = JSON.stringify(allMarkers, null, 2);
   const dataBlob = new Blob([dataStr], { type: 'application/json' });
   const url = URL.createObjectURL(dataBlob);
   const link = document.createElement('a');
   link.href = url;
   link.download = 'nomadic-dancers-data.json';
   link.click();
   URL.revokeObjectURL(url);
}

// Make deleteMarker function globally available for popup buttons
window.deleteMarker = deleteMarker;
window.exportData = exportData;
window.getCurrentLocation = getCurrentLocation;

console.log('🕺 Nomadic Dancer Map initialized successfully!');