import GenderCheckBox from "../components/GenderCheckBox";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-w-[460px] mx-auto">
      <div className="w-full p-6 rounded-lg shadow-xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-gray-300 text-center">
          Register to&nbsp;
          <span className="text-purple-400">HowRU</span>
        </h1>

        <form className="mt-2 grid gap-y-0.5">
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered h-10"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="johndoe123"
              className="w-full input input-bordered h-10"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="text"
              placeholder="Enter password"
              className="w-full input input-bordered h-10"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="text"
              placeholder="Confirm password"
              className="w-full input input-bordered h-10"
            />
          </div>

          <div className="mt-2">
            <GenderCheckBox />
          </div>

          <a className="text-sm hover:underline transition hover:text-sky-400 mt-3 ml-3 inline-block cursor-pointer">
            Already have an account?
          </a>

          <div className="px-2">
            <button className="btn btn-block btn-sm mt-3 h-9 text-base text-white bg-violet-700 hover:bg-violet-600">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default Register;