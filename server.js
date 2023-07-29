const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
// require path for utilities for working with files and directories path.
const path = require('path');
const Rollbar = require('rollbar');
const cors = require('cors');

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
// setting up server to serve static files; Ready for deployment
app.use(express.static(`public`))
app.use(cors())
// endpoint to serve the files from the public folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    Rollbar.log('retrived all bots')
    res.status(200).send(bots);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    Rollbar.error(error)
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    Rollbar.info('Returned user choices and computer choices', shuffled)
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    Rollbar.critical('Error getting shuffles bots')
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      Rollbar.warning('You lost!')
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      Rollbar.info('You won!')
      res.status(200).send("You won!");
    }
  } catch (error) {
    Rollbar.error(error)
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    Rollbar.log(playerRecord)
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    Rollbar.warning('Error getting player stats');
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
