import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase';
import { useRawDataStore } from '../data-store';
import { TEAM_DATA_ORDER } from '../table/Table';
import type { TeamValuesWithFetched } from '../../types';
import type { Database } from '../../database.types';
import { Check, X } from 'lucide-react';

function Compare() {

  const store = useRawDataStore();
  const teams = Object.keys(store.rawDataCombined.team_rows);

  const [team1, setTeam1] = useState(parseInt(localStorage.getItem('compare-1') ?? '-1'));
  const [team2, setTeam2] = useState(parseInt(localStorage.getItem('compare-2') ?? '-1'));

  const [team1Data, setTeam1Data] = useState<null | TeamValuesWithFetched>(null);
  const [team2Data, setTeam2Data] = useState<null | TeamValuesWithFetched>(null);

  const [team1Pit, setTeam1Pit] = useState<null | Database['public']['Tables']['Pit Scouting']['Row']>(null);
  const [team2Pit, setTeam2Pit] = useState<null | Database['public']['Tables']['Pit Scouting']['Row']>(null);

  function setData() {
    setTeam1Data(store.rawDataCombined?.team_rows_with_fetched[team1]);
    setTeam2Data(store.rawDataCombined?.team_rows_with_fetched[team2]);

    if (store.rawDataCombined?.pit_scout_data) {
      setTeam1Pit(store.rawDataCombined?.pit_scout_data?.find((p) => p.team_number == team1));
      setTeam2Pit(store.rawDataCombined?.pit_scout_data?.find((p) => p.team_number == team2));
    }
  }

  useEffect(() => {
    setData();
  }, [store.rawDataCombined])

  useEffect(() => {
    setData();
  }, [team1, team2])

  return (
    <div className='flex-1 py-5 flex flex-col items-start lg:items-center bg-white gap-5 px-10 text-center rounded-b-lg'>

      <div className='flex flex-col lg:flex-row gap-5 w-full items-start lg:justify-center'>
        <h1 className='font-poppins text-4xl underline mr-10'>Compare:</h1>

        <div>
          <label htmlFor='team-1-select'>Team 1:</label>
          <select onChange={(e) => { setTeam1(parseInt(e.target.value)); localStorage.setItem('compare-1', e.target.value); }} value={team1} id='team-1-select' className="ml-4 bg-gray-50 px-3 min-w-25 py-1 rounded-md border-1 border-gray-500 hover:border-gray-800 transition cursor-pointer active:ring-2">
            {teams.map((t) => {
              return <option key={t} value={t}>{t}</option>
            })}
          </select>
        </div>

        <div>
          <label htmlFor='team-2-select'>Team 2:</label>
          <select onChange={(e) => { setTeam2(parseInt(e.target.value)); localStorage.setItem('compare-2', e.target.value); }} value={team2} id='team-2-select' className="ml-4 bg-gray-50 px-3 min-w-25 py-1 rounded-md border-1 border-gray-500 hover:border-gray-800 transition cursor-pointer active:ring-2">
            {teams.map((t) => {
              return <option key={t} value={t}>{t}</option>
            })}
          </select>
        </div>
      </div>

      {/* Actual data comparison */}
      {
        (team1 > 0 && team2 > 0) && <div className='flex flex-col items-start gap-2 w-[100%] max-w-100'>

          <div className='text-xl mb-5 flex flex-row justify-center w-full'><span className='underline text-[#6198f0ff]'>{store.rawDataCombined?.fetched_team_data?.find((t) => t.team == team1)?.team_name}</span> <h1 className='flex-1'>vs</h1> <span className='underline text-[#f03a58]'>{store.rawDataCombined?.fetched_team_data?.find((t) => t.team == team2)?.team_name}</span></div>

          {(team1Pit != null && team2Pit != null) &&
            <div className='flex flex-col w-full justify-between items-center relative z-10 py-1'>

              <div className='flex flex-row gap-10 w-full justify-between items-center relative z-10 py-1'>
                <h1 className='text-2xl font-poppins font-regular flex-1'>{team1Pit.climb_type}</h1>
                <h1 className='text-2xl font-light bg-white flex-1' >Climb</h1>
                <h1 className='text-2xl font-poppins font-regular flex-1'>{team2Pit.climb_type}</h1>
              </div>

              <div className='flex flex-row gap-10 w-full justify-between items-center relative z-10 py-1'>
                {team1Pit.trench ? <Check color='green' size={46} /> : <X color='red' size={46} />}
                <h1 className='text-2xl font-light bg-white' >Trench</h1>
                {team2Pit.trench ? <Check color='green' size={46} /> : <X color='red' size={46} />}
              </div>

              <div className='flex flex-row gap-10 w-full justify-between items-center relative z-10 py-1'>
                {team1Pit.bump ? <Check color='green' size={46} /> : <X color='red' size={46} />}
                <h1 className='text-2xl font-light bg-white' >Bump</h1>
                {team2Pit.bump ? <Check color='green' size={46} /> : <X color='red' size={46} />}
              </div>

              <div className='flex flex-row gap-10 w-full justify-between items-center relative z-10 py-1'>
                <h1 className='text-2xl font-poppins font-regular'>{team1Pit.hopper_size}</h1>
                <h1 className='text-xl font-light bg-white' >Hopper Capacity</h1>
                <h1 className='text-2xl font-poppins font-regular'>{team2Pit.hopper_size}</h1>
                <div style={getStyles(team1Pit.hopper_size, team2Pit.hopper_size)} className='absolute h-[100%] -z-5'></div>
              </div>
            </div>
          }

          {(team1Data != null && team2Data != null) &&
            TEAM_DATA_ORDER.filter((t) => t.key != 'team_number').map((key, i) => <div key={key.key} className='flex flex-row gap-10 w-full justify-between items-center relative z-10 py-1'>
              <h1 className='text-2xl font-poppins font-regular' key={i + '3'}>{typeof team1Data[key.key] == 'number' ? Math.round(team1Data[key.key] * 10) / 10 : Math.round(team1Data[key.key]['q3'] * 10) / 10}</h1>
              <h1 className='text-xl font-light bg-white' key={i + '2'}>{key.label}</h1>
              <h1 className='text-2xl font-poppins font-regular' key={i + '6'}>{typeof team2Data[key.key] == 'number' ? Math.round(team2Data[key.key] * 10) / 10 : Math.round(team2Data[key.key]['q3'] * 10) / 10}</h1>
              <div style={getStyles(typeof team1Data[key.key] == 'number' ? Math.round(team1Data[key.key] * 10) / 10 : Math.round(team1Data[key.key]['q3'] * 10) / 10, typeof team2Data[key.key] == 'number' ? Math.round(team2Data[key.key] * 10) / 10 : Math.round(team2Data[key.key]['q3'] * 10) / 10)} className='absolute h-[100%] -z-5' key={i + '20'}></div>
            </div>)
          }

        </div>
      }

    </div>
  )
}

function getStyles(val1: number, val2: number) {
  if (val1 == 0) {
    val1 = 0.01;
  }
  if (val2 == 0) {
    val2 = 0.01;
  }
  let ratio = val1 > val2 ? ((val1 - val2) / val1) : ((val2 - val1) / val2);

  return { 'backgroundColor': val1 > val2 ? '#6198f0ff' : '#f03a58', width: ratio * 100 + '%', left: val2 > val1 ? '50%' : '', right: val2 < val1 ? '50%' : '', }
}

export default Compare;