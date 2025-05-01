# Smart Route Finder

This project is a simple web application that visualizes the connections between predefined cities on a map and finds the shortest route between two selected cities using the Dijkstra algorithm.

## Features

* Loads graph data (cities, connections, distances) from a defined JSON file.
* Displays the loaded cities on a map.
* Allows the user to select start and end cities by clicking on the map (finds the nearest node).
* Calculates the shortest route between the selected start and end cities using the Dijkstra algorithm.
* Displays the calculated shortest distance and the followed route in the user interface and on the map.

## Technologies Used

* **HTML:** For the structural skeleton of the application.
* **CSS:** To define the visual style of the application.
* **JavaScript:** For the interactive parts of the application, data loading, map interaction, and running the algorithm.
* **Leaflet.js:** An open-source JavaScript library used to provide the interactive map component.
* **Dijkstra Algorithm:** A classic graph algorithm adapted for JavaScript to find the shortest path calculation.

## Setup and Running

This project is a purely client-side web application that does not require any special server-side setup. To run it, you just need to serve the files using a web server.

1.  Place the files (`index.html`, `style.css`, `script.js`, `dijkstra.js`, `graph-data.json`) in the same folder.
2.  Run this folder using a web server. You can use Python's built-in HTTP server:
    * Open a terminal in the folder.
    * Run the following command:
        ```bash
        python -m http.server 8000
        ```
    * Open your browser and go to `http://localhost:8000`.
    * (Alternatively, you can use extensions like Live Server(as i used) in IDEs such as VS Code.)

## Usage

1.  Open the application in your browser.
2.  When the map loads, you will see the cities defined in the graph (by default, as red dots).
3.  Your first click will select your starting city. The name of the selected city will appear in the "Başlangıç Noktası" (Start Point) field.
4.  Your second click will select your destination city. The name of the selected city will appear in the "Bitiş Noktası" (End Point) field (it must be a different city from the start).
5.  Once two points are selected, the application will automatically calculate the shortest route and update the "En Kısa Mesafe" (Shortest Distance) and "İzlenen Rota" (Followed Route) information. The shortest path will be shown on the map with a blue line.
6.  If you click on the map a third time to calculate a new route, the selections will be reset, and the newly clicked point will become the new starting point.

## File Structure

* `index.html`: The main HTML file of the application. It includes the Leaflet map and information display areas.
* `style.css`: Styles the appearance of the HTML elements (map size, fonts, etc.).
* `script.js`: Manages map interactions, loads the `graph-data.json` file, finds the nearest node, and calls the Dijkstra function.
* `dijkstra.js`: Contains the JavaScript implementation of the Dijkstra algorithm to find the shortest path.
* `graph-data.json`: The data file containing the cities (`nodes`), connections (`edges`) between them and their weights (`weight`), as well as the geographical coordinates (`coordinates`) of the cities in the graph.

## Data Format (`graph-data.json`)

The file is a JSON object containing the following key-value pairs:

* `nodes`: A list of all node names (city names) in the graph.
* `edges`: An object defining the edges originating from each node (city). The keys are city names, and the values are lists containing objects that specify the connected nodes and the weight (distance, time, etc.) of the edge.
* `coordinates`: An object containing the geographical coordinates (latitude, longitude) of each node (city). The keys are city names, and the values are lists in the format `[latitude, longitude]`.
<!--
```json
{
    "nodes": ["CityA", "CityB", ...],
    "edges": {
      "CityA": [
          {"node": "CityB", "weight": 100},
          ...
      ],
      ...
    },
    "coordinates": {
      "CityA": [latitude, longitude],
      ...
    }
}
-->