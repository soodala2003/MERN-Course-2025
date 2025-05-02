import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';

const AllJobsContext = createContext();

//export const loader = async () => {
//console.log('hello');
export const loader = async ({ request }) => {
  //console.log(request.url);
  //http://localhost:5173/dashboard/all-jobs
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  //console.log(params);
  // at the moment our params is this object.
  try {
    /* const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);
    return { data }; */
    const { data } = await customFetch.get('/jobs', {
      params,
    });
    //const { data } = await customFetch.get('/jobs');
    return { data, searchValues: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();
  console.log(data);
  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

//to set up the hook
export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
