export const Player = (paddleRef) => {
    this.score = 0;
    this.paddleRef = paddleRef;
};

Player.prototype.incrementScore = () => {
    this.score += 1;
}

Player.prototype.getScore = () => {
    return this.score;
}

Player.prototype.resetScore = () => {
    this.score = 0;
}