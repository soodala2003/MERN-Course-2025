import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { useState, createContext, useContext } from 'react';
import { Navbar, BigSidebar, SmallSidebar } from '../components';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return data;
    //return 'hello world';
  } catch (error) {
    return redirect('/');
    //to redirect the user back to the landing (or home) page.
    //if there is any issue with JWT, the user will have to repeat the login step.
  }
};

const DashboardContext = createContext();

/* const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('dark-theme') === 'true';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
}; */

/* ignore "queryClient" prop
const DashboardLayout = ({ isDarkThemeEnabled, queryClient }) => { */

const DashboardLayout = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  //const data = useLoaderData();
  //console.log(data);
  //And keep in mind we're logging this data in here because we have access to it in use loader data.

  // temp
  //const user = { name: 'john' };

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  //const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);
  //const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    //console.log('toggle dark theme');
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('dark-theme', newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success('Logging out... ');
    //console.log('logout user');
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet context={{ user }} />
              {/* when we created this dashboard context provider, technically if
              you just want to pass some value down to the pages and not only to
              the pages, but also components that are in the pages, you can
              simply use the outlet and pass in the value into the context. 
              This one is for all of the pages and components that are inside of those pages, 
              and we're just providing this user value because in some of the pages 
              we'll actually use some of those values from the user object. */}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
