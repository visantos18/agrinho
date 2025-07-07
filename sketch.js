let sunColor;
let sunX, sunY;
let sunDirection = 1; // 1 = subindo, -1 = descendo
let time = 0;

let birds = [];
let cars = [];
let fruits = [];

function setup() {
  createCanvas(800, 400);
  sunX = width * 0.1;
  sunY = height * 0.8;
  sunColor = color(255, 204, 0);

  // Criar pássaros na floresta
  for (let i = 0; i < 5; i++) {
    birds.push(new Bird(random(50, 350), random(50, 200)));
  }

  // Criar carros na cidade
  for (let i = 0; i < 3; i++) {
    cars.push(new Car(random(width / 2, width), height - 60));
  }

  // Frutos nas árvores
  for (let i = 0; i < 10; i++) {
    fruits.push({x: random(50, 350), y: random(180, 270), size: 8});
  }
}

function draw() {
  // Atualizar tempo
  time += 0.01;

  // --- CÉU (gradiente que muda do dia para noite) ---
  setGradient(0, 0, width, height, color(135, 206, 235), color(25, 25, 112));

  // --- SOL / LUA ---
  updateSunMoon();

  // --- NUVENS ---
  drawClouds();

  // --- FLORESTA (lado esquerdo) ---
  drawForest();

  // --- CIDADE (lado direito) ---
  drawCity();

  // --- PÁSSAROS voando ---
  birds.forEach(bird => {
    bird.move();
    bird.display();
  });

  // --- CARROS na rua ---
  cars.forEach(car => {
    car.move();
    car.display();
  });

  // --- ESTRELAS (aparecem de noite) ---
  if (time > 1.5) {
    drawStars();
  }
}

// --- FUNÇÕES AUXILIARES ---

function setGradient(x, y, w, h, c1, c2) {
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, constrain((time < 1.5 ? 0 : inter), 0, 1));
    stroke(c);
    line(x, i, x + w, i);
  }
}

function updateSunMoon() {
  // Sol sobe e desce com mudança de cor
  sunX += 0.5 * sunDirection;
  if (sunX > width * 0.9 || sunX < width * 0.1) {
    sunDirection *= -1;
  }

  // Cor do sol muda para tons mais frios ao anoitecer
  let c = lerpColor(color(255, 204, 0), color(100, 100, 150), map(abs(sunX - width * 0.5), 0, width * 0.4, 0, 1));
  fill(c);
  noStroke();
  ellipse(sunX, sunY - 100 * sin(map(sunX, 0, width, 0, PI)), 60, 60);

  // Se estiver noite (sol abaixo do horizonte), desenhar lua
  if (sunDirection === -1 && sunX < width * 0.4) {
    fill(230, 230, 255);
    ellipse(width * 0.8, 100, 50, 50);
    fill(100, 100, 150);
    ellipse(width * 0.83, 90, 40, 40); // sombra da lua (lua minguante)
  }
}

function drawClouds() {
  fill(255, 255, 255, 200);
  noStroke();
  ellipse(150 + 50 * sin(time), 80, 60, 40);
  ellipse(200 + 50 * cos(time * 1.3), 60, 70, 45);
  ellipse(250 + 40 * sin(time * 1.7), 90, 60, 40);
}

// --- FLORESTA ---

function drawForest() {
  // Grama
  fill(34, 139, 34);
  rect(0, height / 2, width / 2, height / 2);

  // Árvores
  for (let i = 30; i < width / 2; i += 60) {
    drawTree(i, height / 2 + 50, 50);
  }

  // Frutos nas árvores
  fill(255, 100, 100);
  fruits.forEach(f => ellipse(f.x, f.y, f.size));
}

function drawTree(x, y, size) {
  // Tronco
  fill(101, 67, 33);
  rect(x - size / 10, y, size / 5, size);
  // Folhas
  fill(0, 100, 0);
  ellipse(x, y, size, size);
  ellipse(x - size / 3, y + 10, size / 1.5, size / 1.5);
  ellipse(x + size / 3, y + 10, size / 1.5, size / 1.5);
}

// --- CIDADE ---

function drawCity() {
  // Rua
  fill(50);
  rect(width / 2, height - 80, width / 2, 80);

  // Calçada
  fill(180);
  rect(width / 2, height - 100, width / 2, 20);

  // Casas e prédios
  for (let i = width / 2 + 20; i < width - 20; i += 80) {
    drawBuilding(i, height - 150, 60, 70);
  }
}

function drawBuilding(x, y, w, h) {
  fill(200, 100, 100);
  rect(x, y, w, h);

  // Janelas
  fill(255, 255, 150);
  for (let i = y + 10; i < y + h - 10; i += 20) {
    for (let j = x + 10; j < x + w - 10; j += 20) {
      rect(j, i, 10, 10);
    }
  }
}

// --- PÁSSAROS ---

class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(1, 2);
  }
  move() {
    this.x += this.speed;
    if (this.x > width / 2) {
      this.x = random(50, 100);
      this.y = random(50, 200);
    }
  }
  display() {
    fill(255, 255, 255);
    noStroke();
    // asas simples
    triangle(this.x, this.y, this.x + 10, this.y - 5, this.x + 15, this.y);
    triangle(this.x + 15, this.y, this.x + 25, this.y - 5, this.x + 30, this.y);
  }
}

// --- CARROS ---

class Car {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(2, 4);
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }
  move() {
    this.x -= this.speed;
    if (this.x < width / 2) {
      this.x = width;
    }
  }
  display() {
    fill(this.color);
    rect(this.x, this.y - 20, 50, 20, 5);
    fill(0);
    ellipse(this.x + 10, this.y, 15, 15);
    ellipse(this.x + 40, this.y, 15, 15);
  }
}

// --- ESTRELAS ---

function drawStars() {
  fill(255, 255, 255, 200);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height / 2);
    ellipse(x, y, 2, 2);
  }
}
