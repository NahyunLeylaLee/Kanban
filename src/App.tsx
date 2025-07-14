import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from "styled-components";
import { toDoState } from './atoms';
import Board from './Components/Board';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 0 5vh;

`;

const Boards = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  max-height: 45rem;
  border-radius: 10px;
`;

const Nav = styled.nav`
  width: 100vw;
  display: flex;
  justify-content: space-between;
  font-size: 25px;
  align-items: center;
  padding: 3vh;
  color: #DADFE9;
  font-weight: 600;
  button {
    border: none;
    color: transparent;
  }
  svg {
    width: 40px;
    height: 40px;
    &: hover {
      cursor: pointer;
    }
  }
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];//toDo object
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy
        };
      });
    }
    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard
        };
      });
    }
  };
  const onAddBoard = () => {
    const newBoard = prompt("Please enter new Board name:") as string;
    if (Object.keys(toDos).find((board) => board === newBoard)) {
      alert("This board is already exist!");
      return;
    } else if (newBoard === null || newBoard === '') {
      return;
    } else {
      setToDos(allBoards => {
        return {
          ...allBoards,
          [newBoard]: [],
        }
      });
    }
  }
  console.log(toDos)
  return (
    <>
      <Nav>
        <h1>To Do List</h1>
        <p title='Add Board'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={onAddBoard}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </p>
      </Nav>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (<Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;
