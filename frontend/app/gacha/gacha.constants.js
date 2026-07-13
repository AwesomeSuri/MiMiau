"use strict";

angular.module("mimiau.gacha").constant("GachaAnimation", {
  BOX_SHEET_PATH: "assets/spritesheets/carton-box-sheet.png",
  BOX_SHEET_COLUMNS: 6,
  BOX_SHEET_ROWS: 3,
  BOX_ANIMATION_FRAMES: [
    { col: 0, row: 0, duration: 100 },
    { col: 1, row: 0, duration: 100 },
    { col: 2, row: 0, duration: 100 },
    { col: 0, row: 0, duration: 500 },
    { col: 0, row: 1, duration: 100 },
    { col: 1, row: 1, duration: 100 },
    { col: 2, row: 1, duration: 100 },
    { col: 3, row: 1, duration: 100 },
    { col: 4, row: 1, duration: 100 },
    { col: 5, row: 1, duration: 100 },
  ],
});
