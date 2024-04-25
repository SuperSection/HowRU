import axios from "axios";
import { Link } from "react-router-dom";
import { server } from "@/constants/config";
import Loader from "@/components/common/Loader";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaType } from "@/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/redux.hooks";
import { userExists } from "@/redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {

  const dispatch = useAppDispatch();
  // const profilePicture = useFileHandler("single");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin: SubmitHandler<LoginSchemaType> = async (values) => {
    console.log(values);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/login`,
        {
          username: values.username,
          password: values.password,
        },
        config,
      );

      dispatch(userExists(true));
      
      toast.success(data.message);

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong in the login process.",
      );
    }
  }


  return (
    <div className="flex flex-col items-center justify-center lg:w-[40vw] sm:w-[60vw] w-full">
      <div className="w-full p-6 rounded-lg shadow-xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-gray-300 text-center">
          Login to&nbsp;
          <span className="text-purple-400">HowRU</span>
        </h1>

        <form
          className="mt-2 grid gap-y-0.5"
          onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label className="label p-2 font-medium">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              {...register("username")}
              placeholder="Enter username"
              className="w-full input input-bordered h-10"
            />
            {errors.username && (
              <p className="text-sm text-red-400 ml-2">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="label p-2 font-medium">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter password"
              className="w-full input input-bordered h-10"
            />
            {errors.password && (
              <p className="text-sm text-red-400 ml-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <Link
            to="/register"
            className="hover:underline transition hover:text-pink-400 mt-4 ml-3 inline-block cursor-pointer">
            Don&apos;t have an account?
          </Link>

          <div className="px-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-block btn-sm mt-3 h-9 text-lg text-white bg-violet-700 hover:bg-violet-600">
              {isSubmitting ? <Loader /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default Login;