import React from 'react';
import LoadingGrid from '../components/LoadingGrid';
import ItemGrid from '../components/ItemGrid';
import { HomePageGrid } from '../styles/Grids';
import useLatestData from '../utils/useLatestData';

function CurrentlySlicing({ slicemasters }){
    return (
        <div>
            <h2 className="center">
                <span className="mark tilt">Slicemasters On</span>
            </h2>
            <p>Standing by, ready to box you up!</p>
            {!slicemasters && <LoadingGrid count={4} />}
            {slicemasters && !slicemasters?.length && (<p>No One is Working Right Now!</p>)}
            {slicemasters?.length && <ItemGrid items={slicemasters} />}
        </div>
    )
}
function HotSlices({ hotSlices }){
    return (
        <div>
            <h2 className="center">
                <span className="mark tilt">Hot Slices</span>
            </h2>
            <p>Available in our case right now</p>
            {!hotSlices && <LoadingGrid count={4} />}
            {hotSlices && !hotSlices?.length && (<p>Our Case Looks Empty!</p>)}
            {hotSlices?.length && <ItemGrid items={hotSlices} />}
        </div>
    )
}

export default function HomePage() {
    const {slicemasters, hotSlices} = useLatestData();
    return (
       <div className="center">
           <h1>The Best Pizza Downtown</h1>
           <p>Open 11am to 11pm Every Single Day</p>
           <HomePageGrid> 
               <CurrentlySlicing slicemasters={slicemasters}/>
               <HotSlices hotSlices={hotSlices} />
           </HomePageGrid>
       </div>
    );
}