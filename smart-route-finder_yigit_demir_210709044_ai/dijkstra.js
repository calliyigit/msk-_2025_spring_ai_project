function dijkstra(graph, startNode, endNode) {
    console.log("Running Dijkstra:", startNode, "->", endNode);
    console.log("Graph Data:", graph);

    // Constant values ​​to keep track of distances, previous nodes, and visited nodes
    const distances = {}; // The shortest distance from the starting node to other nodes
    const parents = {}; // Previous node on the shortest path
    const visited = new Set(); // Set of visited nodes

    // Make the starting distance of all nodes infinite, make the starting node 0
    for (const node in graph.edges) {
        distances[node] = Infinity;
        parents[node] = null;
    }
    distances[startNode] = 0;

    let currentNode = startNode;

    while (currentNode !== null && currentNode !== undefined) {
        // Get distance and neighbors of current node
        let distance = distances[currentNode];
        let neighbors = graph.edges[currentNode] || []; // Empty array for nodes without edge list

        // Update distance for each neighbor
        for (const neighborData of neighbors) {
            const neighborNode = neighborData.node;
            const weight = neighborData.weight;
            const newDist = distance + weight;

            // Update if a shorter path is found
            if (newDist < distances[neighborNode]) {
                distances[neighborNode] = newDist;
                parents[neighborNode] = currentNode;
            }
        }

        // Mark current node as visited
        visited.add(currentNode);

        // Find the next node to process (lowest distance unvisited node)
        let nextNode = null;
        let shortestDist = Infinity;
        for (const node in distances) {
            if (!visited.has(node) && distances[node] < shortestDist) {
                shortestDist = distances[node];
                nextNode = node;
            }
        }
        currentNode = nextNode; // Move to next node
    }

    // If the end node is not reached
    if (distances[endNode] === Infinity) {
        console.log("End node could not be reached.");
        return { path: [], distance: Infinity };
    }

    // Create shortest path (in reverse order)
    const path = [];
    let current = endNode;
    while (current !== null) {
        path.unshift(current); // Add to front
        current = parents[current];
    }

    console.log("Calculated Path:", path);
    console.log("Total Distance:", distances[endNode]);

    // Return path and total distance
    return { path: path, distance: distances[endNode], time: distances[endNode] / 100 };
}