import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/common/Loader";
import axios from "axios";
import { server } from "@/constants/config";
import { useAppDispatch } from "@/hooks/redux.hooks";
import { userExists } from "@/redux/reducers/auth";
import toast from "react-hot-toast";


export default function Register() {
  
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(RegisterSchema),
  });


  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      // setValue("profilePicture", file);
    }
  };
  

  const registerUser: SubmitHandler<RegisterSchemaType> = async (values) => {
    console.log(values);

    const formData = new FormData();
    formData.append("profilePicture", values.profilePicture[0]);
    formData.append("name", values.name);
    formData.append("username", values.username);
    formData.append("password", values.password);

    console.log(formData);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }

    try {
      const { data } = await axios.post(
        `${server}/register`, formData, config
      );

      dispatch(userExists(true));
      toast.success(data.message);
      
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong in the registration process.",
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center 2xl:w-[30vw] lg:w-[40vw] sm:w-[60vw]">
      <div className="w-full p-6 rounded-lg shadow-xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-gray-300 text-center">
          Register to&nbsp;
          <span className="text-purple-400">HowRU</span>
        </h1>

        <form
          className="mt-2 grid gap-y-1"
          onSubmit={handleSubmit(registerUser)}>
          {/* Upload Profile Picture */}
          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <div className="relative inline-block">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Picture Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <img
                  src="https://t3.ftcdn.net/jpg/05/79/55/26/360_F_579552668_sZD51Sjmi89GhGqyF27pZcrqyi7cEYBH.jpg"
                  alt="no profile pic"
                  className="opacity-50 w-20 h-20 rounded-full object-cover border-2 border-white cursor-pointer"
                />
              )}

              <button
                type="button"
                className="absolute bottom-0 right-0 btn btn-circle btn-xs cursor-pointer">
                <div className="relative h-full w-full">
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    {...register("profilePicture")}
                    className="absolute inset-0 opacity-0 overflow-hidden border-0 p-2"
                    onChange={handleImageChange}
                  />
                  <FaCamera size={14} className="m-1" />
                </div>
              </button>
            </div>
            {errors.profilePicture && (
              <p className="text-sm text-red-500 ml-2">
                {typeof errors.profilePicture.message === "string"
                  ? errors.profilePicture.message
                  : "An error occurred with profile picture validation."}
              </p>
            )}

            {previewImage && (
              <button
                className="btn btn-sm btn-ghost w-20"
                onClick={() => {
                  setPreviewImage(null);
                  resetField("profilePicture");
                }}>
                Remove
              </button>
            )}
          </div>

          {/* Full Name of the User */}
          <div>
            <label className="label p-2 font-medium">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="John Doe"
              className="w-full input input-bordered h-10"
            />
            {errors.name && (
              <p className="text-sm text-red-400 ml-2">{errors.name.message}</p>
            )}
          </div>

          {/* Username to register with */}
          <div>
            <label className="label p-2 font-medium">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              {...register("username")}
              placeholder="johndoe123"
              className="w-full input input-bordered h-10"
            />
            {errors.username && (
              <p className="text-sm text-red-400 ml-2">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Bio of the User */}
          <div>
            <label className="label p-2 font-medium">
              <span className="text-base label-text">Bio</span>
            </label>
            <input
              type="text"
              {...register("bio")}
              placeholder="Tell about yourself"
              className="w-full input input-bordered h-10"
            />
            {errors.bio && (
              <p className="text-sm text-red-400 ml-2">{errors.bio.message}</p>
            )}
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label className="label p-2 font-medium">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm password"
              className="w-full input input-bordered h-10"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400 ml-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Link
            to="/login"
            className="w-fit hover:underline transition hover:text-pink-400 mt-6 ml-3 inline-block cursor-pointer">
            Already have an account?
          </Link>
          <div className="px-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-block btn-sm mt-3 h-9 text-lg text-white bg-violet-700 hover:bg-violet-600">
              {isSubmitting ? <Loader /> : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
