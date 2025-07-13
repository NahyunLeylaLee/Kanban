import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  padding: 10px 0px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
        props.isDraggingOver ? "#dfe6e9" : props.isDraggingFromThis ? "#b2bec3" : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
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
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Form onSubmit={handleSubmit(onValid)}>
                <input
                    {...register("toDo", { required: true })}
                    type="text"
                    placeholder={`Add task on ${boardId}`}
                />
            </Form>
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
                                key={toDo.id} index={idx} toDoId={toDo.id} toDotext={toDo.text} />
                        )
                        )}
                        {magic.placeholder}
                    </Area>}
            </Droppable>
        </Wrapper>
    );
}

export default Board;