class GameMap {
  constructor(walls, floors) {
    this.walls = walls;
    this.floors = floors;

    this.tiles = [
      [
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0]
      ],
      [
        [0, 1, 0, 1, 1],
        [0, 1, 0, 1, 1],
        [0, 1, 0, 0, 0],
        [0, 1, 1, 0, 1],
        [0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0]
      ],
      [
        [1, 1, 0, 1, 1],
        [1, 1, 0, 1, 1],
        [0, 0, 0, 0, 0],
        [1, 1, 0, 1, 1],
        [1, 1, 0, 1, 1]
      ],
      [
        [1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1],
        [0, 0, 1, 0, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1]
      ],
    ];


  }

  createMap(food) {
    this.#generateMap();
    this.#buildMap(food);
  }

  #generateMap() {
    let size = 5;

    this.map = Array.from(Array(size*5), () => new Array(size*5));
    this.foodMap = Array.from(Array(size*5), () => new Array(size*5));

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let tile = this.tiles[Math.floor(Math.random() * this.tiles.length)];
        for(let xt = 0; xt < 5; xt++) {
          for(let yt = 0; yt < 5; yt++) {
            this.map[y*5+yt][x*5+xt] = tile[yt][xt];
          }
        }
      }
    }

    for (let y = 0; y < size*5; y++) {
      for (let x = 0; x < size*5; x++) {
        if (x === 0 || y === 0 || x === size * 5 - 1 || y === size * 5 - 1) {
          this.map[y][x] = 1;
        }
      }
    }
  }


  #buildMap(food) {
    this.objects = [];
    let i = 0;
    for(let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === 0) {
          let tile = this.floors[0].copy();
          tile.translate([x * 0.2, 0, y * 0.2]);

          let foodCopy = food.copy();
          foodCopy.translate([x * 0.2, 0, y * 0.2]);
          this.foodMap[y][x] = foodCopy;

          this.objects.push(tile);
          this.objects.push(foodCopy);
        } else {
          let tile = this.walls[(x + y) % 2].copy();
          tile.translate([x * 0.2, 0, y * 0.2]);

          this.objects.push(tile);
        }
      }
    }
  }

  getPacmanSpawnPosition() {
    let x, y;
    do {
      x = Math.floor(Math.random() * (this.map.length - 1));
      y = Math.floor(Math.random() * (this.map.length - 1));
    }while(this.map[y][x] !== 0 || this.map[y][x+1] !== 0)

    return [x, y];
  }

  draw(camera) {
    this.objects.forEach(shape => {
      shape.draw(camera);
    });
  }
}