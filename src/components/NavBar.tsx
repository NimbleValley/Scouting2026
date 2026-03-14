import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRawDataStore } from "../data-store";

export default function NavBar() {

    const [search, setSearch] = useState('');
    const rawData = useRawDataStore();

    const[showRest, setShowRest] = useState(false);

    return (
        <div className=" sm:block top-0 fixed z-10000 w-[100vw]">
            <div className={`z-20 backdrop-blur-sm list-none w-full pt-2 pb-2 h-fit lg:h-14 bg-[#363432] transtion duration-300 flex flex-col lg:flex-row align-center justify-between px-8
        text-white [&_li]:text-[18px] [&_li]:hover:ring-2 [&_li]:ring-0 [&_li]:hover:ring-gray-400 [&_li]:py-2 [&_li]:px-3 [&_li]:h-full [&_li]:hover:bg-[#0d0907]/67 [&_li]:relative [&_li]:rounded-lg [&_li]:transition duration-300 [&_li]:cursor-pointer  `}>
                <div className="flex flex-row items-center gap-3 font-rubik" >
                    <img className="w-18 h-10 object-contain bg-orange-300/40 rounded-lg" src='.\logo.png'></img>
                    <Link to={`/`} className="text-xl text-orange-300 font-medium hover:underline cursor-pointer font-poppins">Scouting 2026</Link>
                    <Menu className="lg:hidden flex-1" onClick={() => setShowRest((prev) => !prev)}/>
                </div>
                <div className={` flex-row gap-5 font-rubik font-light ${showRest ? 'flex' : 'hidden'} lg:flex `}>
                    <Link to={`/tables`}>
                        <li>
                            Tables
                        </li>
                    </Link>
                    <Link to={'/teams'}>
                        <li>
                            Teams
                        </li>
                    </Link>
                    <Link to={'/compare'}>
                        <li>
                            Compare
                        </li>
                    </Link>
                    {/*
                    <Link to={'/compare'}>
                        <li>
                            Compare
                        </li>
                    </Link>
                    <Link to={'/graphs'}>
                        <li>
                            Graphs
                        </li>
                    </Link>
                    <Link to={'/match'}>
                        <li>
                            Match
                        </li>
                    </Link>
                    */}
                </div>
                <div className={`bg-white text-black text-center min-w-50 my-0.5 pr-3 rounded-lg flex-row items-center justify-center relative focus-within:ring-2 ring-orange-600 ${showRest ? 'flex' : 'hidden'} lg:flex`}>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search for teams..." className="text-center outline-0 h-full">
                    </input>
                    <Search className="z-10 absolute right-2" color="#161515ff" strokeWidth={2.5} size={20} />
                    {
                        search.length > 0 &&
                        <div className="bg-white rounded-b-md flex flex-col items-center absolute w-[90%] left-[5%] top-9 pt-1 gap-1 border-b-1 border-x-1 border-gray-800">
                            {Object.keys(rawData.rawDataCombined.team_rows).filter((item) => item.includes(search)).map((item) => {
                                return <Link onClick={() => setSearch('')} className="w-full rounded-md" to={'/team/' + item} key={item}>
                                    <h1 className="text-lg font-rubik rounded-md crsor-pointer font-light w-full hover:bg-gray-100 w-full">{item} - {rawData.rawDataCombined.fetched_team_data.find((t) => String(t.team) == item)?.team_name}</h1>
                                </Link>
                            })}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}