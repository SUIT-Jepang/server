const connectedUser = {};
const users = {};
const choices = {};
const moves = {
    'rock': 'scissor',
    'paper': 'rock',
    'scissor': 'paper'
}

const initializeChoice = (roomId) => {
    choices[roomId] = ['', '']
}

const userConnected = (userId) => {
    connectedUser[userId] = true; 
}

const makeMove = (roomId, player, choice) => {
    if(choices[roomId]){
        choices[roomId][player - 1] = choice
    }
}

module.exports = {connectedUser, initializeChoice, userConnected, makeMove, moves, choices}