// Initilaze map

//Set the Turkey that middle of the map
const map = L.map('map').setView([39.9334, 32.8597], 6); 

//(OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);



// Global Variables
let graphData = null;
let startMarker = null;
let endMarker = null;
let startNode = null;
let endNode = null;
let pathPolyline = null;

// --- Auxiliary Functions ---

// Function to find the nearest node
function findNearestNode(latlng, nodes) {
    let nearestNode = null;
    let minDistance = Infinity;

    for (const node in nodes) {
        const nodeLatLng = L.latLng(nodes[node][0], nodes[node][1]);
        const distance = latlng.distanceTo(nodeLatLng);

        if (distance < minDistance) {
            minDistance = distance;
            nearestNode = node;
        }
    }
    return nearestNode;
}

// Path drawing function
function drawPath(pathNodes) {
    if (pathPolyline) {
        map.removeLayer(pathPolyline); // Remove previous path
    }
    if (!graphData || !pathNodes || pathNodes.length < 2) {
        return; // Do not draw if no data or invalid path
    }

    const latlngs = pathNodes.map(nodeId => {
        const coords = graphData.coordinates[nodeId];
        return L.latLng(coords[0], coords[1]);
    });

    pathPolyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
    map.fitBounds(pathPolyline.getBounds());
}

// --- Main Logic ---

// Upload the Graph data
fetch('graph-data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
     })
    .then(data => {
        graphData = data;
        console.log("Graph data loaded:", graphData);

        // Show nodes on map
        if (graphData && graphData.coordinates) {
            for (const node in graphData.coordinates) {
                const coord = graphData.coordinates[node];
                L.circleMarker(coord, { radius: 5, color: 'red' })
                    .addTo(map)
                    .bindPopup(`Node: ${node}`);
            }
        }
    })
    .catch(error => {
        console.error('Error occured while graph data is loading', error);
        alert("Failed to load graph data. Please check the console.");
    });


map.on('click', function(e) {
    if (!graphData) {
        alert("Graph data has not been loaded yet.");
        return;
    }

    const clickedLatLng = e.latlng;
    const nearest = findNearestNode(clickedLatLng, graphData.coordinates);

    if (!nearest) {
        alert("No node found nearby.");
        return;
    }

    console.log("Shortest Node:", nearest, "Coordinates:", graphData.coordinates[nearest]);

    // Set Start and End Points
    if (!startNode) {
        startNode = nearest;
        if (startMarker) map.removeLayer(startMarker); 
        startMarker = L.marker(graphData.coordinates[startNode], {title: "Starting Point"}).addTo(map);
        document.getElementById('start-node').textContent = startNode;
        document.getElementById('end-node').textContent = 'Not selected yet';
        document.getElementById('distance').textContent = '--';
        document.getElementById('path-sequence').textContent = '--'; 
        if (pathPolyline) map.removeLayer(pathPolyline);
    } else if (!endNode) {
        if (nearest === startNode) {
            alert("The start and end points cannot be the same.");
            return;
        }
        endNode = nearest;
        if (endMarker) map.removeLayer(endMarker);
        endMarker = L.marker(graphData.coordinates[endNode], {title: "End Point"}).addTo(map);
        document.getElementById('end-node').textContent = endNode;

        // Run Dijkstra and Draw the Path
        console.log(`Calculating route: ${startNode} -> ${endNode}`);
        const result = dijkstra(graphData, startNode, endNode);

        if (result && result.distance !== Infinity) {
            document.getElementById('distance').textContent = result.distance.toFixed(2);
            
            // Calculate travel time (distance / 100)
            const travelTime = result.distance / 100;
            document.getElementById('travel-time').textContent = travelTime.toFixed(2);
            
            document.getElementById('path-sequence').textContent = result.path.join(' -> ');
            drawPath(result.path);
        } else {
            alert("No path could be found between these two points.");
            document.getElementById('distance').textContent = 'unreachable';
            document.getElementById('travel-time').textContent = '--'; 
            document.getElementById('path-sequence').textContent = 'Path not found';
            if (pathPolyline) map.removeLayer(pathPolyline);
        }
    } else {
        // If two points are already selected, reset and start over
        if (startMarker) map.removeLayer(startMarker);
        if (endMarker) map.removeLayer(endMarker);
        if (pathPolyline) map.removeLayer(pathPolyline);
        startMarker = null;
        endMarker = null;
        startNode = null;
        endNode = null;
        document.getElementById('start-node').textContent = 'Not selected yet';
        document.getElementById('end-node').textContent = 'Not selected yet';
        document.getElementById('distance').textContent = '--';
        document.getElementById('path-sequence').textContent = '--'; 
        document.getElementById('travel-time').textContent = '--';

        // Set first click as fresh start
        startNode = nearest;
        startMarker = L.marker(graphData.coordinates[startNode], {title: "Starting Point"}).addTo(map);
        document.getElementById('start-node').textContent = startNode;
    }
});

