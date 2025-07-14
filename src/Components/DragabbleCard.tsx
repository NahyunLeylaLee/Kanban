import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Card = styled.div<{isDragging: boolean}>`
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      border-radius: 5px;
      padding: 10px 10px;
      background-color: ${(props) => props.isDragging ? "#74b9ff" : props.theme.cardColor};
      box-shadow:${(props) => props.isDragging ? "0px 2px 5px rbga(0,0,0,0.05)": "none"};
`;

const Button = styled.button`
    color: transparent;
    border: none;
    background-color: transparent;
    &:hover {
        cursor: pointer;
        color: black;
    }

`;

interface IDraggableCardProps {
    toDoId: number;
    toDotext: string;
    index: number;
    boardId: string;
}

function DragabbleCard({toDoId, toDotext, index, boardId}: IDraggableCardProps) {
    const [toDos, setToDos] = useRecoilState(toDoState);
    const onClickDelete = () => {
        const newToDoList = toDos[boardId].filter((toDo) => toDo.id !== Number(toDoId) );
        setToDos(allBoards => {
            return {
                ...allBoards,
                [boardId]: [...newToDoList],
            }
        });
    }
    return (
        <Draggable draggableId={toDoId+""} index={index}>
            {(magic, snapshot) => (
                <Card
                    isDragging={snapshot.isDragging}
                    ref={magic.innerRef}
                    {...magic.draggableProps}
                    {...magic.dragHandleProps}
                >
                    {toDotext}
                    <Button onClick={onClickDelete}>✕</Button>
                </Card>
            )}
        </Draggable>
    );
}

export default React.memo(DragabbleCard);