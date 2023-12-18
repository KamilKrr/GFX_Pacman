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
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0]
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
      [
        [0, 1, 0, 1, 1],
        [0, 1, 0, 1, 1],
        [0, 1, 0, 0, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [1, 1, 0, 1, 0],
        [1, 1, 0, 1, 0]
      ],
    ];
  }

  createMap(size, food, powerFood) {
    do {
      this.#generateMap(size);
    }while(!this.#validateMap());

    this.#buildMap(food, powerFood);
  }

  #validateMap() {
    let copyArray = this.map.map(function(arr) {
      return arr.slice();
    });

    let start = this.getPacmanSpawnPosition();
    this.#floodFill(copyArray, start[0], start[1]);

    for(let y = 0; y < copyArray.length; y++) {
      for (let x = 0; x < copyArray[y].length; x++) {
        if(copyArray[y][x] !== 1) return false;
      }
    }
    return true;
  }

  #floodFill(arr, x, y) {
    if(x < 0 || y < 0 || x >= arr.length || y >= arr.length) return;
    if(arr[y][x] === 1) return;
    arr[y][x] = 1;
    this.#floodFill(arr, x+1, y);
    this.#floodFill(arr, x-1, y);
    this.#floodFill(arr, x, y+1);
    this.#floodFill(arr, x, y-1);
  }

  #generateMap(size) {
    this.map = Array.from(Array(size*5), () => new Array(size*5));
    this.foodMap = Array.from(Array(size*5), () => new Array(size*5));
    this.powerFoodMap = Array.from(Array(size*5), () => new Array(size*5));

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


  #buildMap(food, powerFood) {
    this.objects = [];
    let i = 0;
    for(let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === 0) {
          let tile = this.floors[0].copy();
          tile.translate([x * 0.2, 0, y * 0.2]);

          let foodCopy = null;
          if(Math.random() < 0.02) {
            foodCopy = powerFood.copy();
            this.powerFoodMap[y][x] = 1;
          }else {
            foodCopy = food.copy();
          }

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