import "./App.css";
import styled from "styled-components";
import {useEffect, useState} from "react";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

function App() {
    const [birdPosition, setBirdPosition] = useState(250);
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [obstacleHeight, setObstacleHeight] = useState(200);
    const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
    const [score, setScore] = useState(0);

    const bottomObstacleHeight = GAME_HEIGHT - obstacleHeight - OBSTACLE_GAP;

    useEffect(() => {
        let timeId;
        if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
            timeId = setInterval(() => {
                setBirdPosition((birdPosition) => birdPosition + GRAVITY);
            }, 24);
        }

        return () => {
            clearInterval(timeId);
        };
    }, [birdPosition, gameHasStarted]);

    useEffect(() => {
        let obstacleId;
        if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
            obstacleId = setInterval(() => {
                setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
            }, 24);


            return () => {
                clearInterval(obstacleId);
            };
        } else {
            setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
            setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
            setScore(score => score + 1);
        }
    }, [gameHasStarted, obstacleLeft]);

    useEffect(() => {
       const hasCollidedWithTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight;
       const hasCollidedWithBottomObstacle = birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;

       if (obstacleLeft >= 0 &&
           obstacleLeft <= OBSTACLE_WIDTH &&
           (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)
       ) {
           setGameHasStarted(false);
       }
    }, [birdPosition, obstacleLeft, obstacleHeight, bottomObstacleHeight]);

    const handleClick = () => {
        let newBirdPosition = birdPosition - JUMP_HEIGHT;
        if (!gameHasStarted) {
            setGameHasStarted(true);
        } else if (newBirdPosition < 0) {
            setBirdPosition(0);
        } else {
            setBirdPosition(newBirdPosition);
        }
    }

    return (
        <Div onClick={handleClick}>
            <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
                <Obstacle top={0}
                          height={obstacleHeight}
                          left={obstacleLeft}
                          width={OBSTACLE_WIDTH}/>
                <Obstacle top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
                          height={bottomObstacleHeight}
                          left={obstacleLeft}
                          width={OBSTACLE_WIDTH}/>
                <Bird size={BIRD_SIZE} top={birdPosition}/>
            </GameBox>
            <span> {score} </span>
        </Div>
    );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  background-color: green;
  top: ${(props) => props.top}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;
