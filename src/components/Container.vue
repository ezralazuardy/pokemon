<template>
  <div style="display: inline-block; position: relative">
    <div
      id="overlappingDiv"
      style="
        background-color: black;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        z-index: 10;
      "
    ></div>
    <canvas></canvas>
    <div id="userInterface" style="display: none">
      <!-- Represents health bar of enemy -->
      <div
        style="
          background-color: white;
          width: 250px;
          position: absolute;
          top: 110px;
          left: 380px;
          border: 4px black solid;
          padding: 12px;
        "
      >
        <h1 style="font-size: 16px">Draggle</h1>
        <div style="position: relative">
          <div
            style="height: 5px; background-color: #ccc; margin-top: 10px"
          ></div>
          <div
            id="enemyHealthBar"
            style="
              height: 5px;
              background-color: green;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
            "
          ></div>
        </div>
      </div>
      <!-- Represents health bar of player -->
      <div
        style="
          background-color: white;
          width: 250px;
          position: absolute;
          top: 360px;
          right: 380px;
          border: 4px black solid;
          padding: 12px;
        "
      >
        <h1 style="font-size: 16px">Emby</h1>
        <div style="position: relative">
          <div
            style="height: 5px; background-color: #ccc; margin-top: 10px"
          ></div>
          <div
            id="playerHealthBar"
            style="
              height: 5px;
              background-color: green;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
            "
          ></div>
        </div>
      </div>
      <div
        style="
          background-color: white;
          height: 140px;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-top: 4px black solid;
          display: flex;
        "
      >
        <div
          id="dialogueBox"
          style="
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: white;
            padding: 12px;
            display: none;
            cursor: pointer;
          "
        ></div>
        <div
          id="attacksBox"
          style="
            width: 66.66%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          "
        ></div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 33.33%;
            border-left: 4px black solid;
          "
        >
          <h1 id="attackType" style="font-size: 16px">Attack Type</h1>
        </div>
      </div>
    </div>
  </div>
</template>
