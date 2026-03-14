import React, { useState, Component } from 'react'
import { supabase } from '../../supabase';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface PickList {
  order: number[],
  name: string,
  isLive: boolean
}

function Pick() {

  const channelA = supabase
    .channel('pick-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
      },
      (payload) => console.log(payload)
    )
    .subscribe();

  const [activePickList, setActivePickList] = useState<string>('Main');

  const [pickLists, setPickLists] = useState<PickList[]>([{
    isLive: false,
    name: 'Main',
    order: [3197, 930]
  }, {
    isLive: false,
    name: 'Defense',
    order: [3197, 930]
  }]);









  const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
      id: `item-${k + offset}`,
      content: `item ${k + offset}`
    }));

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
  });

  const [state, setState] = useState({
    items: getItems(10),
    selected: getItems(5, 10)
  });

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  var id2List = {
    droppable: 'items',
    droppable2: 'selected'
  };

  const getList = id => state[id2List[id]];

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      console.log(items)

      let newState = { items };

      if (source.droppableId === 'droppable2') {
        newState = { items: items };
      }

      //setState(state);
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setState({
        items: result.droppable,
        selected: result.droppable2
      });
    }
  };

  function getDragTest() {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}>
              {state.items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}>
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable2">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}>
              {state.selected.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}>
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <div className='flex-1 py-5 flex flex-col items-center bg-white gap-0 px-10 text-center rounded-b-lg'>
      <div className='flex flex-row justify-between w-full'>
        <div className='flex flex-row gap-5 items-end'>
          {
            pickLists.map((list) => {
              return <button onClick={() => setActivePickList(list.name)} className={`${activePickList == list.name && 'bg-orange-200'} text-xl cursor-pointer hover:underline px-3 rounded-t-lg h-full `}>{list.name}</button>
            })
          }
        </div>
        <h1 className='font-poppins text-4xl underline'>Pick List</h1>
      </div>
      <div className='grid grid-cols-2 w-full'>
        <div className='bg-orange-200 w-full min-h-10 rounded-b-lg'>
          {
            getDragTest()
          }
        </div>
      </div>
    </div>
  )
}

export default Pick;