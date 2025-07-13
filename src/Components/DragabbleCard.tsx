import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{isDragging: boolean}>`
      margin-bottom: 5px;
      border-radius: 5px;
      padding: 10px 10px;
      background-color: ${(props) => props.isDragging ? "#74b9ff" : props.theme.cardColor};
      box-shadow:${(props) => props.isDragging ? "0px 2px 5px rbga(0,0,0,0.05)": "none"};
`;

interface IDraggableCardProps {
    toDoId: number;
    toDotext: string;
    index: number;
}

function DragabbleCard({toDoId, toDotext, index}: IDraggableCardProps) {
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
                </Card>
            )}
        </Draggable>
    );
}

export default React.memo(DragabbleCard);