let cellCount; // Number of cells across the width and height
let cellSize;
let wallThicknessRatio; // Ratio of wall thickness to cell size
let grid;
let backgroundColor;
let mazeColor;
let canvasSize;
let canvas;
let canvasContainer;

// Array of background color options (hex codes and names)
const backgroundColors = [
  { hex: '#1E90FF', name: 'Dodger Blue' },
  { hex: '#20B2AA', name: 'Light Sea Green' },
  { hex: '#778899', name: 'Light Slate Gray' },
  { hex: '#B0C4DE', name: 'Light Steel Blue' },
  { hex: '#87CEFA', name: 'Light Sky Blue' },
  { hex: '#4682B4', name: 'Steel Blue' },
  { hex: '#5F9EA0', name: 'Cadet Blue' },
  { hex: '#6495ED', name: 'Cornflower Blue' },
  { hex: '#7B68EE', name: 'Medium Slate Blue' },
  { hex: '#6A5ACD', name: 'Slate Blue' },
  { hex: '#48D1CC', name: 'Medium Turquoise' },
  { hex: '#191970', name: 'Midnight Blue' },
  { hex: '#00CED1', name: 'Dark Turquoise' },
  { hex: '#8FBC8F', name: 'Dark Sea Green' },
  { hex: '#E6E6FA', name: 'Lavender' },
  { hex: '#F0E68C', name: 'Khaki' },
  { hex: '#FFDAB9', name: 'Peach Puff' },
  { hex: '#E0FFFF', name: 'Light Cyan' },
  { hex: '#F0FFF0', name: 'Honeydew' },
  { hex: '#F5F5DC', name: 'Beige' },
  // Bauhaus colors
  { hex: '#E53935', name: 'Bauhaus Red' },
  { hex: '#FDD835', name: 'Bauhaus Yellow' },
  { hex: '#1E88E5', name: 'Bauhaus Blue' },
  { hex: '#000000', name: 'Bauhaus Black' },
  { hex: '#FFFFFF', name: 'Bauhaus White' },
  { hex: '#4CAF50', name: 'Bauhaus Green' },
  { hex: '#FF9800', name: 'Bauhaus Orange' },
  { hex: '#9C27B0', name: 'Bauhaus Purple' },
  { hex: '#795548', name: 'Bauhaus Brown' },
  { hex: '#607D8B', name: 'Bauhaus Gray' }
];

const mazeColors = [
  { hex: '#FF6347', name: 'Tomato' },
  { hex: '#32CD32', name: 'Lime Green' },
  { hex: '#9370DB', name: 'Medium Purple' },
  { hex: '#FF69B4', name: 'Hot Pink' },
  { hex: '#8A2BE2', name: 'Blue Violet' },
  { hex: '#00FA9A', name: 'Medium Spring Green' },
  { hex: '#DC143C', name: 'Crimson' },
  { hex: '#2E8B57', name: 'Sea Green' },
  { hex: '#DAA520', name: 'Goldenrod' },
  { hex: '#FF4500', name: 'Orange Red' },
  { hex: '#9932CC', name: 'Dark Orchid' },
  { hex: '#4169E1', name: 'Royal Blue' },
  { hex: '#CD5C5C', name: 'Indian Red' },
  { hex: '#40E0D0', name: 'Turquoise' },
  { hex: '#228B22', name: 'Forest Green' },
  { hex: '#8B008B', name: 'Dark Magenta' },
  { hex: '#FF1493', name: 'Deep Pink' },
  { hex: '#00BFFF', name: 'Deep Sky Blue' },
  { hex: '#FF8C00', name: 'Dark Orange' },
  { hex: '#7CFC00', name: 'Lawn Green' },
  // Bauhaus Colors
  { hex: '#F44336', name: 'Bauhaus Vermilion' },
  { hex: '#2196F3', name: 'Bauhaus Cerulean' },
  { hex: '#FFEB3B', name: 'Bauhaus Lemon' },
  { hex: '#3F51B5', name: 'Bauhaus Indigo' },
  { hex: '#FF5722', name: 'Bauhaus Orange Red' },
  { hex: '#009688', name: 'Bauhaus Teal' },
  { hex: '#8BC34A', name: 'Bauhaus Lime' },
  { hex: '#673AB7', name: 'Bauhaus Deep Purple' },
  { hex: '#212121', name: 'Bauhaus Charcoal' },
  { hex: '#FF4081', name: 'Bauhaus Pink' }
];

function setup() {
  // Create a container div for the canvas
  canvasContainer = createDiv();
  canvasContainer.id('canvas-container');
  canvasContainer.style('display', 'flex');
  canvasContainer.style('justify-content', 'center');
  canvasContainer.style('align-items', 'center');
  canvasContainer.style('width', '100%');
  canvasContainer.style('height', '100vh');
  pixelDensity(10);
  // Set the canvas size to the smaller of window width or height
  canvasSize = min(windowWidth, windowHeight);
  canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent(canvasContainer);

  generateNewArtwork();
}

function calculateDimensions() {
  cellSize = canvasSize / cellCount;
}

function generateMaze(x, y) {
  grid[x][y].visited = true;

  let neighbors = getUnvisitedNeighbors(x, y);
  while (neighbors.length > 0) {
    let next = hl.randomElement(neighbors);
    let [nextX, nextY] = next;

    if (nextX === x) {
      if (nextY > y) {
        grid[x][y].walls[2] = false;
        grid[nextX][nextY].walls[0] = false;
      } else {
        grid[x][y].walls[0] = false;
        grid[nextX][nextY].walls[2] = false;
      }
    } else {
      if (nextX > x) {
        grid[x][y].walls[1] = false;
        grid[nextX][nextY].walls[3] = false;
      } else {
        grid[x][y].walls[3] = false;
        grid[nextX][nextY].walls[1] = false;
      }
    }

    generateMaze(nextX, nextY);
    neighbors = getUnvisitedNeighbors(x, y);
  }
}

function getUnvisitedNeighbors(x, y) {
  let neighbors = [];
  let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (let [dx, dy] of directions) {
    let newX = x + dx;
    let newY = y + dy;
    if (newX >= 0 && newX < cellCount &&
        newY >= 0 && newY < cellCount &&
        !grid[newX][newY].visited) {
      neighbors.push([newX, newY]);
    }
  }

  return neighbors;
}

function drawMaze() {
  for (let x = 0; x < cellCount; x++) {
    for (let y = 0; y < cellCount; y++) {
      let cell = grid[x][y];
      let xPos = x * cellSize;
      let yPos = y * cellSize;

      stroke(mazeColor.hex);
      strokeWeight(cellSize * wallThicknessRatio);

      // Draw walls
      if (cell.walls[0]) line(xPos, yPos, xPos + cellSize, yPos);
      if (cell.walls[1]) line(xPos + cellSize, yPos, xPos + cellSize, yPos + cellSize);
      if (cell.walls[2]) line(xPos, yPos + cellSize, xPos + cellSize, yPos + cellSize);
      if (cell.walls[3]) line(xPos, yPos, xPos, yPos + cellSize);
    }
  }
  
  // Draw outer walls to ensure coverage
  stroke(mazeColor.hex);
  strokeWeight(cellSize * wallThicknessRatio);
  line(0, 0, width, 0);
  line(width, 0, width, height);
  line(0, height, width, height);
  line(0, 0, 0, height);
}

function draw() {
  // This function is intentionally left empty as we don't need continuous drawing
}

function generateNewArtwork() {
  // Generate a random cell count between 2 and 50

 cellCount = hl.randomElement([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 46, 47, 48, 49, 50]);
  calculateDimensions();

  // Generate a single random wall thickness ratio for the entire maze
  wallThicknessRatio = hl.random(0.1, 1);

  // Select a random background color
  backgroundColor = hl.randomElement(backgroundColors) || backgroundColors[0];
  mazeColor = hl.randomElement(mazeColors) || mazeColors[0];

  // Reset the grid
  grid = [];
  for (let x = 0; x < cellCount; x++) {
    grid[x] = [];
    for (let y = 0; y < cellCount; y++) {
      grid[x][y] = {
        walls: [true, true, true, true],
        visited: false
      };
    }
  }

  // Generate new maze
  generateMaze(0, 0);

  // Draw the maze
  redrawMaze();

  // Set traits
  hl.token.setTraits({
    'Cell Count': cellCount >= 2 && cellCount <= 5 ? 'Easy' :
                  cellCount >= 6 && cellCount <= 25 ? 'Medium' : 'Difficult',
    'Wall Thickness': wallThicknessRatio >= 0.1 && wallThicknessRatio <= 0.3 ? 'Thin' :
                      wallThicknessRatio > 0.3 && wallThicknessRatio <= 0.5 ? 'Medium' : 'Thick',
    'Background Color': backgroundColor.name,
    'Maze Color': mazeColor.name
  });
}

function redrawMaze() {
  // Set background color
  background(backgroundColor.hex);

  // Draw the maze
  drawMaze();
}

function windowResized() {
  // Update canvas size
  canvasSize = min(windowWidth, windowHeight);
  resizeCanvas(canvasSize, canvasSize);

  // Update canvas container size
  canvasContainer.style('width', '100%');
  canvasContainer.style('height', '100vh');

  calculateDimensions();
  redrawMaze();
}

hl.token.setName(`Glif #${hl.tx.tokenId}`);
hl.token.setDescription(
  `Glif
  Minted by ${hl.tx.walletAddress}.`
);