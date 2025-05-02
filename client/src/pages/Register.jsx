import { Form, Link, redirect, useNavigation } from 'react-router-dom';
import { Logo, FormRow, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

// to set up all your actions essentially in the app
// or where you have all of the routes.
// component here and a function which will take care of the form submission.
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  /* An object form entry is just turns array of arrays into an object. */
  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration successful');
    return redirect('/login');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    //console.log(error);
    return error;
  }
  //console.log(data);
  //return null;
};

const Register = () => {
  //const navigation = useNavigation();
  //console.log(navigation);
  //const isSubmitting = navigation.state === 'submitting';

  return (
    <Wrapper>
      <Form method="post" className="form">
        {/* to replace the form element with a 'Form' component. 
      <form className="form"> 
      </form> */}
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" />
        <FormRow type="text" name="lastName" labelText="last name" />
        <FormRow type="text" name="location" />
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        {/* <div className="form-row">
          <label htmlFor="name" className="form-label">
            name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            defaultValue="john"
            required
          />
        </div> */}
        <SubmitBtn formBtn />
        {/* ? or <SubmitBtn /> */}
        {/* <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'submitting...' : 'submit'}
        </button> */}
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );

  <div>
    <h1>Register Page</h1>
    <Link to="/login">Login Page</Link>
  </div>;
};
export default Register;
