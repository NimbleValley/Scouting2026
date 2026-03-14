import React from 'react'
import { supabase } from '../../supabase';

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

  return (
    <div className='flex-1 py-5 flex flex-col items-center bg-white gap-5 px-25 text-center rounded-b-lg'>
      <h1 className='font-poppins text-4xl underline'>Pick List</h1>
      <h2 className='text-xl font-rubik font-light'>On this page, users can view our pick list, make edits, and turn on pick mode to change the entire app's behavior.</h2>
    </div>
  )
}

export default Pick;