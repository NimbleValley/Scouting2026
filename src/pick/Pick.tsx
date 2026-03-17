import React, { useState, Component, useEffect } from 'react'
import { supabase } from '../../supabase';
import { DragDropContext, Droppable, Draggable, type DragUpdate, type DraggableStyle } from '@hello-pangea/dnd';
import { useRawDataStore } from '../data-store';
import { Menu, Plus, Trash } from 'lucide-react';

export interface PickList {
  order: number[],
  name: string,
  isLive: boolean
}

interface PickListMenu {
  list: PickList | null,
  visible: boolean
}

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

function Pick() {

  const rawData = useRawDataStore();

  const [activePickListName, setActivePickListName] = useState<string>('Main');
  const [activePickListData, setActivePickListData] = useState<PickList | null>(null);

  const [pickLists, setPickLists] = useState<PickList[]>([]);
  const [pickListMenu, setPickListMenu] = useState<PickListMenu>({ list: null, visible: false })

  useEffect(() => {
    console.log(rawData.pickListStates)
    setPickLists(rawData.pickListStates);

    if (rawData.pickListStates.length > 0 && !rawData.pickListStates.find((i) => i.name == activePickListName)) {
      setActivePickListName(rawData.pickListStates[0].name);
      setActivePickListData(rawData.pickListStates[0]);
      setPickListMenu({ list: rawData.pickListStates[0], visible: false });
    } else {
      setActivePickListData(rawData.pickListStates.find((i) => i.name == activePickListName) ?? null);
      setPickListMenu({ list: rawData.pickListStates.find((i) => i.name == activePickListName) ?? null, visible: false });
    }

    channelA.send({
      type: 'broadcast',
      event: 'test'
    })
  }, [rawData.pickListStates]);

  useEffect(() => {
    setActivePickListData(rawData.pickListStates.find((i) => i.name == activePickListName) ?? null);
  }, [activePickListName]);



  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const getItemStyle = (isDragging: boolean, draggableStyle: DraggableStyle | undefined) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 5,
    margin: `0 0 ${8}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 8,
    width: 250
  });

  const onDragEnd = (result: DragUpdate) => {
    const { source, destination, draggableId } = result;

    if (!destination || !activePickListData) return;

    // Convert draggableId to Number to match your Interface
    const draggedItemId = Number(draggableId);

    // 1. REORDERING within the same list
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'order') {
        const newOrder = reorder(
          activePickListData.order,
          source.index,
          destination.index
        );

        setActivePickListData({
          ...activePickListData,
          order: newOrder,
        });
      }
      return;
    }

    // 2. MOVING between lists
    let newOrder = [...activePickListData.order];

    // Available -> Order
    if (source.droppableId === 'available' && destination.droppableId === 'order') {
      if (!newOrder.includes(draggedItemId)) {
        newOrder.splice(destination.index, 0, draggedItemId);
      }
    }
    // Order -> Available
    else if (source.droppableId === 'order' && destination.droppableId === 'available') {
      newOrder.splice(source.index, 1);
    }

    let allPickListData = pickLists;
    allPickListData = allPickListData.filter((p) => p.name != activePickListData.name);
    allPickListData.push({
      ...activePickListData,
      order: newOrder,
    });
    rawData.setPickListStore(allPickListData);
  };

  function getDragTest() {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='grid grid-cols-2 w-full'>
          <div className='pt-5 bg-orange-200 w-full min-h-10 rounded-b-lg flex flex-col items-center'>
            <h2>List Order</h2>
            <Droppable droppableId="order">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  {activePickListData?.order.map((item, i) => (
                    <Draggable
                      key={String(item)} // Changed from 'i' to 'String(item)'
                      draggableId={String(item)}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}>
                          {item}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className='pt-5 w-full flex flex-col items-center'>
            <h2>Available Teams</h2>
            <Droppable droppableId="available">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  {Object.keys(rawData.rawDataCombined.team_rows)
                    .filter((t) => !activePickListData?.order.includes(Number(t))) // Convert 't' to Number
                    .map((item, i) => (
                      <Draggable key={String(item)} draggableId={String(item)} index={i}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}>
                            {item}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    );
  }

  const deleteList = (list: PickList) => {
    if (list.isLive) {
      alert('You cannot delete the live list, sorry :/');
      return;
    }

    if (!confirm('Are you sure you want to delete list ' + list.name + '?'))
      return;

    let allPickListData = pickLists;
    allPickListData = allPickListData.filter((p) => p.name != list.name);
    rawData.setPickListStore(allPickListData);
    console.log(allPickListData);
    setPickListMenu({ list: null, visible: false });
  }

  const createList = () => {
    let name = prompt('What should the list be named?');

    if (!name || name.length < 3) {
      //alert('Blank or short name detected, cancelling creation.');
      return;
    }

    let allPickListData = pickLists;
    allPickListData.push({ isLive: false, name, order: [] });
    setActivePickListData({ isLive: false, name, order: [] });
    setActivePickListName(name);
    rawData.setPickListStore(allPickListData);
  }

  return (
    <div className='flex-1 py-5 flex flex-col items-center bg-white gap-0 px-10 text-center rounded-b-lg'>
      <div className='flex flex-row justify-between w-full'>
        <div className='flex flex-row gap-3 items-center'>
          {
            pickLists.map((list, i) => {
              return <div key={i} className={`${activePickListName == list.name && 'bg-orange-200'} flex flex-row items-center gap-4 text-xl px-3 rounded-t-lg h-full `}>
                <button className='hover:scale-105 cursor-pointer'>
                  <Menu onClick={() => setPickListMenu({ list, visible: true })} />
                </button>
                <h2 className='hover:underline cursor-pointer' onClick={() => setActivePickListName(list.name)}>
                  {list.name}
                </h2>
              </div>
            })
          }
          <button onClick={createList} className='hover:scale-110 cursor-pointer hover:ring-2 rounded-md transition'>
            <Plus size={28} />
          </button>
        </div>
        <h1 className='font-poppins text-4xl underline'>Pick List</h1>
      </div>
      {activePickListData ?
        getDragTest()
        : <h1 className='my-5 text-2xl'>No pick lists found, make a new one by clicking plus!</h1>
      }
      {(pickListMenu && pickListMenu.list && pickListMenu.visible) && <div className='fixed w-screen h-screen left-0 top-0 z-1000 bg-black/50 flex flex-col items-center justify-center'>
        <div className='bg-white items-center justify-center py-5 px-8 rounded-md gap-3 flex flex-col'>
          <h1 className='text-2xl underline'>'{pickListMenu.list?.name}' Options</h1>
          <button>Download List</button>
          <button>Copy List</button>
          <button onClick={() => { if (pickListMenu.list) deleteList(pickListMenu.list) }}>Delete List</button>
          <button className='mt-5' onClick={() => setPickListMenu((prev) => { return { ...prev, visible: false } })}>Close</button>
        </div>
      </div>}
    </div>
  )
}

export default Pick;