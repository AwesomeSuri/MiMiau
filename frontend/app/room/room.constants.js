"use strict";

angular.module("mimiau.room").constant("RoomGrid", {
  CELL_SIZE: 32,
  COLUMNS: 10,
  ROWS: 5,
});

angular.module("mimiau.room").constant("CartonBoxSprite", {
  SHEET_PATH: "assets/spritesheets/carton-box-sheet.png",
  SHEET_COLUMNS: 6,
  SHEET_ROWS: 3,
  ANIMATION_FRAMES: [
    { col: 0, row: 0, duration: 1000 },
    { col: 1, row: 0, duration: 200 },
    { col: 2, row: 0, duration: 200 },
  ],
});
