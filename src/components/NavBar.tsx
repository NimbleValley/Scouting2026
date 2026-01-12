import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div className="hidden md:block top-0 fixed w-[100vw]">
            <div className="backdrop-blur-sm list-none min-w-[90vw] pb-1 bg-white/50 hover:bg-white/77 transtion duration-300 shadow-lg/10 border-gray-500/50 border-b-2 border-x-2 flex-row mx-[5vw] rounded-b-xl flex flex-row align-center justify-between px-8
        [&_li]:text-xl [&_li]:text-light [&_li]:py-2 [&_li]:relative [&_li]:hover:-translate-y-[2px] [&_li]:transition duration-300 [&_li]:cursor-pointer [&_li]:after:absolute [&_li]:after:h-0.5 [&_li]:after:w-0 [&_li]:after:bottom-1 [&_li]:after:left-0 [&_li]:hover:after:w-full [&_li]:after:transition-all [&_li]:after:duration-300 [&_li]:after:bg-[#F17721]/50
        ">
                <div className="flex flex-row gap-10">
                    <li>
                        <Link to={`contacts/1`}>Tables</Link>
                    </li>
                    <li>
                        <Link to={`contacts/1`}>Ranks</Link>
                    </li>
                    <li>
                        <Link to={`contacts/1`}>Teams</Link>
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
            </div>
        </div>
    );
}