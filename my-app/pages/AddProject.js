import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Label } from 'flowbite-react';
import { Textarea } from 'flowbite-react';
import { TextInput } from 'flowbite-react';
import { Flowbite } from 'flowbite-react';
import { HiMail } from 'react-icons/hi';
import { Select } from 'flowbite-react';
import { Radio } from 'flowbite-react';
import { FileInput } from 'flowbite-react';
import { Button } from 'flowbite-react';
import DashBoard from './DashBoard';
import { useAccount } from 'wagmi';
import axios from 'axios';

// Your existing components like Label, TextInput, Select, Radio, FileInput, Textarea, etc.

// Define your functional component
 const MyProjects = () => {
  // State variables to store form data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('');
  const [stage, setStage] = useState('');
  const [logo, setLogo] = useState(null);
  const [description, setDescription] = useState('');
  const [fileSizeError, setFileSizeError] = useState(false); // New state for file size error
  const { address, isConnected } = useAccount();
 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Check if a file is selected
    if (selectedFile) {
      // Check if the file size exceeds the maximum allowed size (64 KB)
      const maxFileSize = 64 * 1024; // 64 KB in bytes

      if (selectedFile.size > maxFileSize) {
        setFileSizeError(true);
        // Clear the file input to prevent submitting the oversized file
        e.target.value = null;
      } else {
        setFileSizeError(false);
        // File size is within the allowed limit, update the logo state
        setLogo(selectedFile);
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Create a data object with the form values
  //   const formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('email', email);
  //   formData.append('sector', sector);
  //   formData.append('stage', stage);
  //   formData.append('description', description);
  //   formData.append('address', address);

  //   // Convert the logo file to a blob and append it to the form data
  //   if (logo) {
  //     const logoBlob = new Blob([logo], { type: logo.type });
  //     formData.append('logo', logoBlob);
  //   }

  //   try {
  //     // Send a POST request to your server with the form data
  //     const response = await axios.post('http://localhost:3001/projects', formData);

  //     // Handle the response as needed (e.g., show a success message)
  //     console.log(response.data);
  //   } catch (error) {
  //     // Handle errors (e.g., show an error message)
  //     console.error('Error submitting form:', error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a data object with the form values
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('sector', sector);
    formData.append('stage', stage);
    formData.append('description', description);
    formData.append('address', address);
  
    // Convert the logo file to a blob and append it to the form data
    if (logo) {
      const logoBlob = new Blob([logo], { type: logo.type });
      formData.append('logo', logoBlob);
    }
  
    try {
      // Send a POST request to your server with the form data
      const response = await axios.post('http://localhost:3001/projects', formData);
  
      // Handle the response as needed (e.g., show a success message)
      console.log(response.data);
  
      // Clear the form by resetting state variables
      setName('');
      setEmail('');
      setSector('');
      setStage('');
      setLogo(null);
      setDescription('');
      setFileSizeError(false); // Reset file size error state
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error('Error submitting form:', error);
    }
  };
  
 
  // JSX for the form
  return (
  
           <>
           <DashBoard class="flex">
           {!isConnected ? (
            <div class="ml-20 mr-20 py-16 justify-center">
              <div className="text-center text-gray-500"> (Not connected...)</div>
            </div>
        ) :
           (<div class="ml-20 mr-20 py-12 justify-center">
 <h1 class="py-1 font-bold text-black text-2xl text-center">Fill In the Details for your Startup</h1>
           <form onSubmit={handleSubmit}>
      <div className="mb-2 block">
        {/* Replace with your Label and TextInput components */}
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="username3"
          placeholder="Bonnie Green"
          required={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-2 mt-3 block">
        {/* Replace with your Label and TextInput components */}
        <label htmlFor="email4">Your Email</label>
        <input
          type="email"
          id="email4"
          placeholder="name@gmail.com"
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Add the Select component for 'sector' */}
      <div className="mb-2 mt-4 block">
        <label htmlFor="countries">Select your Startup's Sector</label>
        <Select
          id="countries"
          required={true}
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option>Art and Craft</option>
          <option>Agriculture</option>
          <option>Health and Sanitation</option>
          <option>Education</option>
        </Select>
      </div>

      {/* Add the Radio component for 'stage' */}
      <fieldset className="flex flex-col mt-4 gap-4">
        <legend>Choose your Startup Stage</legend>
        <div className="flex items-center mt-2 gap-2">
          <Radio
            id="prototype"
            name="stage"
            value="Prototype Stage"
            checked={stage === "Prototype Stage"}
            onChange={() => setStage("Prototype Stage")}
          />
          <label htmlFor="prototype">Prototype Stage</label>
        </div>
        <div className="flex items-center mt-2 gap-2">
          <Radio
            id="growth"
            name="stage"
            value="Growth Stage"
            checked={stage === "Growth Stage"}
            onChange={() => setStage("Growth Stage")}
          />
          <label htmlFor="growth">Growth Stage</label>
        </div>
      </fieldset>

      {/* Add the FileInput component for 'logo' */}
      <div className="mb-2 mt-4 block">
  <label htmlFor="file">Upload Your Startup's Logo</label>
  <FileInput
  id="file"
  helperText="Provide Your startup's Logo for Quick Identification"
  accept="image/*" // Restrict to image files only
  // onChange={(e) => setLogo(e.target.files.length > 0 ? e.target.files[0] : null)}
  onChange={handleFileChange}
/>
{fileSizeError && (
            <p className="text-red-500 mt-1">File size exceeds the maximum allowed size (64 KB).</p>
          )}
</div>

      {/* Add the Textarea component for 'description' */}
      <div className="mb-2 block">
        <label htmlFor="comment">Your Startup's Description</label>
        <Textarea
          id="comment"
          placeholder="Provide a Brief description of your Startup..."
          required={true}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Add the rest of your form components here (e.g., Submit button) */}

      <div className="my-5 flex mr-10 ml-10 items-center justify-center">
        <button
          type="submit"
          className="mt-2 rounded-lg border-2 border-[#009A9A] bg-[#009A9A] px-6 py-2 font-medium text-white justify-center items-center transition hover:translate-y-1"
        >
          Submit
        </button>
      </div>
    </form>
    </div>)}
      </DashBoard>
   </>

  );
};

  export default dynamic(() => Promise.resolve(MyProjects), { ssr: false });
