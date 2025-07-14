import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 10px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  min-width: 15rem;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 5px;
    border: 1px solid transparent;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 5px;
    background: transparent;
    padding: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.cardColor};
    border-radius: 5px; 
  }
`;

const BoardTitle = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    justify-content: space-between;
    h2 {
    text-align: center;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 18px;
    }
    // &:hover .boardFn {
    //     color: black;
    //     button {
    //         color: black;
    //     }
    //     // background:blue;
    // }
    button {
        border: none;
        background-color: transparent;
        color: black;
        &:hover {
            cursor: pointer;
        }
    }
`;


const Area = styled.div<IAreaProps>`
  background-color: transparent
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

export const Form = styled.form`
    display: flex;
    justify-content: center;
    width: 100%;
    input {
        width: 100%
    }
`;

interface IAreaProps {
    isDraggingFromThis: boolean;
    isDraggingOver: boolean;
}

interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
}

interface IForm {
    toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    const setToDos = useSetRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid = ({ toDo }: IForm) => {
        const newTodo = {
            id: Date.now(),
            text: toDo,
        };
        setToDos(allBoards => {
            return {
                ...allBoards,
                [boardId]: [...allBoards[boardId], newTodo],
            }
        });
        setValue("toDo", "");
    }
    const onDeleteBoard = () => {
        setToDos((allBoards) => {
            const copyBoards = { ...allBoards };
            delete copyBoards[boardId]
            return { ...copyBoards };
        })
    }
    return (
        <Wrapper>
            <BoardTitle>
                <h2>{boardId}</h2>
                {/* <div className="boardFn"><button  style={{border: "none", backgroundColor:"transparent", color: "transparent"}}>X</button></div> */}
                <button onClick={onDeleteBoard}>✕</button>
            </BoardTitle>
            <Form onSubmit={handleSubmit(onValid)}>
                <input
                    {...register("toDo", { required: true })}
                    type="text"
                    placeholder={`Add task on ${boardId}`}
                    style={{ width: "90%", border: "none", borderRadius: "5px", height: "5vh", padding: "10px" }}
                />
            </Form>
            <hr style={{ width: "90%", border: "2px solid #ccc", marginBlockEnd: "unset" }} />
            <Droppable droppableId={boardId}>
                {(magic, info) =>
                    <Area
                        isDraggingOver={info.isDraggingOver}
                        isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                        ref={magic.innerRef}//react코드를 이용해 html요소를 지정하고 가져올 수 있는 방법, 자바스크립트로부터 html요소를 가져오고 수정하는 방법
                        {...magic.droppableProps}
                    >
                        {/* key와 draggableId는 같아야함 */}
                        {toDos.map((toDo, idx) => (
                            <DragabbleCard
                                key={toDo.id} index={idx} toDoId={toDo.id} toDotext={toDo.text} boardId={boardId} />
                        )
                        )}
                        {magic.placeholder}
                    </Area>}
            </Droppable>
        </Wrapper>
    );
}

export default Board;