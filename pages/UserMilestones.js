
import React, { useState,useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import DashBoard from './DashBoard';
import { useAccount } from 'wagmi';
import { contractABI, contractAddress } from "../components/abi/utils/constant";
import { ethers } from 'ethers';

const UserMilestones = () => {

  const { address,  isConnected } = useAccount()
  const rpcUrl = "https://polygon-mumbai.g.alchemy.com/v2/vn61eXIkpvUX5dPgfdirJyhHzm93wQNW";
 
  //   // Create a provider using the JsonRpcProvider class
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  //   // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

  // State to store the user's milestone IDs and milestones
  const [milestoneIds, setMilestoneIds] = useState([]);
  const [milestoneData, setMilestoneData] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatUnixTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };


  useEffect(() => {
    if (isConnected) {
      // Set loading to true before fetching data
      setLoading(true);
  
      // Function to get user's milestone IDs
      async function getUserMilestoneIds() {
        try {
          const userMilestoneIds = await contract.getUserMilestoneIds(address);
          const adjustedIds = userMilestoneIds.map(id => id.sub(1));
          setMilestoneIds(adjustedIds);
      
          // Call getMilestoneDataForIds after setting milestoneIds
          getMilestoneDataForIds(adjustedIds);
        } catch (error) {
          console.error("Error getting user milestone IDs: ", error);
        }
      }

      // Function to get milestone data for each ID
      async function getMilestoneDataForIds(ids) {
        try {
          const milestoneData = await Promise.all(ids.map(async (id) => {
            const milestone = await contract.milestones(id);
            return milestone;
          }));
          setMilestoneData(milestoneData.reverse());
          // Set loading to false after data has been fetched
          setLoading(false);
        } catch (error) {
          console.error("Error getting milestone data: ", error);
         
        }
      }
  
      // Call the function to get milestone IDs
      getUserMilestoneIds();
    }
  }, [isConnected, address]);
    
console.log("id:",milestoneIds);
console.log("idmilestones:",milestoneData);

  return (
    <DashBoard>
     <section class="text-gray-600 font-inter  font-bold overflow-hidden">
        <h1 class="font-bold text-2xl items-center text-center text-black justify-center py-12 mt-3"> Milestones Status</h1>
       <div class="container px-5 mx-auto">
       {loading ? ( // Render a loading message when data is loading
          <div class="flex justify-center items-center">Loading milestones data...</div>
        ): milestoneData.length === 0 ? (
          <div className="text-center text-gray-500">No milestones found</div>
        ) : (
          <div class="-my-8 divide-y-2 divide-gray-100">
          {milestoneData.slice().map((milestone, index) => (
             <div class="py-8 flex flex-wrap md:flex-nowrap" key={index}>
            <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                <span class="font-semibold title-font text-gray-950">Milestone {index + 1}</span>
                 <span class="mt-1 text-gray-650 text-sm">{formatUnixTimestamp(milestone?milestone[3]:0)} {/* Display the date from the data */}</span>
                </div>
            <div class="md:flex-grow">
               <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">{milestone?milestone[1]:0} {/* Display the description from the data */} ( {milestone?(milestone[2].toString()):0} USD)</h2>
                <div class="flex">
                  <div class={`mt-35 w-22 rounded-md ${ milestone && milestone[6] ? 'bg-teal-100' : 'bg-red-100'} px-2 py-1 text-sm font-medium text-teal-700 mr-2`}>
                    {milestone && milestone[6]? 'Funded' : 'Not Funded'}
                  </div>
                 <div class={`mt-35 w-22 rounded-md ${ milestone && milestone[7] ? 'bg-teal-100' : 'bg-red-100'} px-2 py-1 text-sm font-medium text-teal-700`}>
                     {milestone && milestone[7]? 'Approved' : 'In Progress'}
                 </div>
                 </div>
  
                  <Link href="https://www.tally.xyz/gov/Milala-DAO-3/proposal/create" class="text-teal-600 inline-flex items-center mt-4">
                 Request Funding
                 <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M5 12h14"></path>
                 <path d="M12 5l7 7-7 7"></path>
                 </svg>
               </Link>
  
               <Link href="#" class="m-2 inline-flex items-center ml-3 justify-center rounded-xl border bg-white px-5 py-3 font-medium text-teal-700 shadow hover:bg-blue-50">
                 Update Progress
                 </Link>
             </div>
           </div>
          ))}
        </div>)}
       </div>
    </section> 

   
     </DashBoard>


    
  );
};

export default dynamic(() => Promise.resolve(UserMilestones), { ssr: false });
