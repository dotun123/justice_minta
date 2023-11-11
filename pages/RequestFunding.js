
import React, { useState,useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import DashBoard from './DashBoard';
import { useContractRead,useAccount,useContractWrite, usePrepareContractWrite,useWaitForTransaction } from 'wagmi';
import { contractABI,  contractAddress,editor,editor2 } from "../components/abi/utils/constant";
import {ethers} from "ethers";
import Loading from "@/components/global/Loading";

const MyProjects = () => {


  const [numberOfMilestone, setNumberOfMilestone] = useState([]);
  const [milestoneData1, setMilestoneData] = useState([])
  const { address,  isConnected } = useAccount()
  const [numberError, setNumberError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(-1);


const rpcUrl = "https://polygon-mumbai.g.alchemy.com/v2/vn61eXIkpvUX5dPgfdirJyhHzm93wQNW";
const numberOfMilestonesFunctionName = "getNumberOfMilestones";
const milestonesFunctionName = "milestones";
//   // Create a provider using the JsonRpcProvider class
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  
//   // Create a contract instance
  const contract1 = new ethers.Contract(contractAddress, contractABI, provider);

 

  const formatUnixTimestamp = (timestamp) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString();
      };
  
  async function getNumberOfMilestones() {
    try {
      const numberOfMilestones = await contract1.functions[numberOfMilestonesFunctionName]();
      console.log(numberOfMilestones.toString())
      return numberOfMilestones.toString();
    } catch (error) {
      setNumberError(true);
      console.error("Error fetching the number of milestones:", error);
      return 0;
    }
  }

  async function getMilestoneData(index) {
    try {
      const milestoneData = await contract1.functions[milestonesFunctionName](index);
      console.log(milestoneData)
      return milestoneData;
      
    } catch (error) {
      console.error("Error fetching milestone data at index", index, ":", error);
      return null;
    }
  }


   
 




  async function updateMilestonesData() {
    try {
      const numberOfMilestones = await getNumberOfMilestones();
      const milestones = [];

      for (let i = 0; i < numberOfMilestones; i++) {
        const milestoneData = await getMilestoneData(i);
        milestones.push(milestoneData);
      }

      setMilestoneData(milestones.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error updating milestones data:", error);
    }
  }

  useEffect(() => {
    updateMilestonesData();
    // Call the update function periodically or set up an event listener to update when the number of milestones changes
    const intervalId = setInterval(updateMilestonesData, 60000); // Update every 60 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);



    // Filter out milestones with empty indices
    const filteredMilestones = milestoneData1.filter((milestone) => {
      // Check if any of the indices are empty
      for (let i = 0; i < milestone.length; i++) {
        if (milestone[i] === undefined || milestone[i] === null || milestone[i] === '') {
          return false; // Exclude this milestone
        }
      }
      return true; // Include this milestone
    });

  const { data:hasRoleData } =  useContractRead({
    address: contractAddress,
     abi: contractABI,
     functionName: 'hasRole',
   args:[editor,address],
   watch: true,
   })
 console.log("has:",hasRoleData)




const rejectMilestone = useContractWrite({
  address: contractAddress,
        abi: contractABI,
         functionName: 'rejectMilestone', // The name of the function in your ABI
});

const { isLoading:rejectLoading, isSuccess:rejectSuccess } = useWaitForTransaction({
  confirmations:1,
  hash: rejectMilestone.data?.hash,
})

console.log("hash:",rejectSuccess ,rejectLoading,rejectMilestone.isLoading)


const handleRejectMilestone = (index) => {
  if (index >= 0 && index < filteredMilestones.length) {
    const selectedMilestone = filteredMilestones[index];
    const originalIndex = milestoneData1.findIndex(milestone =>
      milestone[1] === selectedMilestone[1] &&
      milestone[2] === selectedMilestone[2] &&
      milestone[3] === selectedMilestone[3]
    );

    if (originalIndex >= 0) {
      const originalIndexBeforeReverse = milestoneData1.length - 1 - originalIndex;
      rejectMilestone.write({
        args: [originalIndexBeforeReverse],
      });
    }
  }
};


const approveMilestone = useContractWrite({
  address: contractAddress,
        abi: contractABI,
         functionName: 'approveMilestone', // The name of the function in your ABI
});


const { isLoading:approveLoading, isSuccess:approveSuccess } = useWaitForTransaction({
  confirmations:1,
  hash:  approveMilestone.data?.hash,
})

console.log("hash2:",approveSuccess ,approveLoading,approveMilestone.isLoading)

useEffect(() => {
  if (approveSuccess || rejectSuccess) {
    updateMilestonesData();
  }
}, [approveSuccess, rejectSuccess]);


const handleApproveMilestone = (index) => {
  if (index >= 0 && index < filteredMilestones.length) {
    const selectedMilestone = filteredMilestones[index];
    const originalIndex = milestoneData1.findIndex(milestone =>
      milestone[1] === selectedMilestone[1] &&
      milestone[2] === selectedMilestone[2] &&
      milestone[3] === selectedMilestone[3]
    );

    if (originalIndex >= 0) {
      const originalIndexBeforeReverse = milestoneData1.length - 1 - originalIndex;
      approveMilestone.write({
        args: [originalIndexBeforeReverse],
      });
    }
  }
};








  return (
    <DashBoard class="h-screen">
      {hasRoleData === true ? ( <section class="text-gray-600 font-inter  font-bold overflow-hidden">
        <h1 class="font-bold text-2xl items-center text-center text-black justify-center py-12 mt-3"> Milestones Status</h1>
       <div class="container px-5 mx-auto">
       {loading ? ( // Render a loading message when data is loading
          <div class="flex justify-center items-center">Loading milestones data...</div>
        ) : (
          <div class="-my-8 divide-y-2 divide-gray-100">
         

          {filteredMilestones.slice().map((milestone, index) => (
  <div class="py-8 flex flex-wrap md:flex-nowrap" key={index}>
    <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
      <span class="font-semibold title-font text-gray-950">Milestone {index + 1}</span>
      <span class="mt-1 text-gray-650 text-sm">{formatUnixTimestamp(milestone ? milestone[3] : 0)}</span>
    </div>
    <div class="md:flex-grow">
      <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">
        {milestone ? milestone[1] : 0} ( {milestone ? milestone[2].toString() : 0} USD)
      </h2>
      <div class="flex">
        <div class={`mt-35 w-22 rounded-md ${milestone && milestone[6] ? 'bg-teal-100' : 'bg-red-100'} px-2 py-1 text-sm font-medium text-teal-700 mr-2`}>
          {milestone && milestone[6] ? 'Funded' : 'Not Funded'}
        </div>
        <div class={`mt-35 w-22 rounded-md ${milestone && milestone[7] ? 'bg-teal-100' : 'bg-red-100'} px-2 py-1 text-sm font-medium text-teal-700`}>
          {milestone && milestone[7] ? 'Approved' : 'In Progress'}
        </div>
      </div>

      {/* Conditionally render the buttons based on milestone[7] */}
      {milestone && !milestone[7] && (
        <div class="flex">
          {/* Approve Button */}
          {(selectedMilestoneIndex === index && (approveMilestone.isLoading || approveLoading)) ? (
            <div class="m-2 inline-flex items-center ml-3 justify-center ">
              <Loading />
            </div>
          ) : (
            <button
              onClick={() => {
                setSelectedMilestoneIndex(index);
                handleApproveMilestone(index);
              }}
              class="m-2 inline-flex items-center ml-3 justify-center rounded-xl border bg-white px-5 py-3 font-medium text-teal-700 shadow hover-bg-red-50"
              disabled={rejectMilestone.isLoading || rejectLoading || approveMilestone.isLoading || approveLoading}
            >
              Approve Milestone
            </button>
          )}

          {/* Reject Button */}
          {(selectedMilestoneIndex === index && (rejectMilestone.isLoading || rejectLoading)) ? (
            <div class="m-2 inline-flex items-center ml-3 justify-center ">
              <Loading />
            </div>
          ) : (
            <button
              onClick={() => {
                setSelectedMilestoneIndex(index);
                handleRejectMilestone(index);
              }}
              class="m-2 inline-flex items-center ml-3 justify-center rounded-xl border bg-white px-5 py-3 font-medium text-teal-700 shadow hover-bg-red-50"
              disabled={rejectMilestone.isLoading || rejectLoading || approveMilestone.isLoading || approveLoading}
            >
              Reject Milestone
            </button>
          )}
        </div>
      )}
    </div>
  </div>
))}
        </div>)}
       </div>
    </section>):null}
  </DashBoard>
  );
};

export default dynamic(() => Promise.resolve(MyProjects), { ssr: false });

