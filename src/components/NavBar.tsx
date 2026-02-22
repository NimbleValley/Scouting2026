import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div className="hidden sm:block top-0 fixed z-10000 w-[100vw]">
            <div className="z-20 backdrop-blur-sm list-none w-full pt-2 pb-2 h-14 bg-[#363432] transtion duration-300 flex-row flex flex-row align-center justify-between px-8
        text-white [&_li]:text-[18px] [&_li]:py-2 [&_li]:px-3 [&_li]:hover:bg-[#0d0907]/67 [&_li]:relative [&_li]:rounded-lg [&_li]:transition duration-300 [&_li]:cursor-pointer  ">
                <div className="flex flex-row items-center gap-3 font-rubik" >
                    <img className="w-18 h-10 object-contain bg-orange-300/40 rounded-lg" src='src\assets\logo.png'></img>
                    <Link to={`/`} className="text-xl text-orange-300 font-medium hover:underline cursor-pointer font-poppins">Scouting 2026</Link>
                </div>
                <div className="flex flex-row gap-5 font-rubik font-light">
                    <li>
                        <Link to={`/tables`}>Tables</Link>
                    </li>
                    <li>
                        <Link to={`contacts/1`}>Ranks</Link>
                    </li>
                    <li>
                        <Link to={`team/1`}>Teams</Link>
                    </li>
                    <li>
                        <Link to={`contacts/1`}>Compare</Link>
                    </li>
                    <li>
                        <Link to={`contacts/1`}>Graphs</Link>
                    </li>
                    <li>
                        <Link to={`contacts/1`}>Match</Link>
                    </li>
                    <li>
                        <Link to={`contacts/1`}>Pick</Link>
                    </li>
                </div>
                <div className="bg-white text-black text-center min-w-50 my-0.5 pr-3 rounded-lg flex flex-row items-center justify-center relative">
                    <input type="text" placeholder="Search for teams..." className="text-center outline-0 h-full">
                    </input>
                    <Search className="z-10 absolute right-2" color="#161515ff" strokeWidth={2.5} size={20} />
                </div>
            </div>
        </div>
    );
}