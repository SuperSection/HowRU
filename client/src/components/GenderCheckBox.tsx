import { ChangeEvent, useState } from "react";

export default function GenderCheckBox() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };
  console.log(selectedOption);

  const options = ["male", "female", "other"];

  return (
    <div className="flex gap-x-5 group-checked">
      <div className="form-control">
        <label className={`label gap-2 cursor-pointer`}>
          <span className="label-text">Male</span>
          <input
            type="checkbox"
            name="gender"
            onChange={(e) => handleChange(e)}
            checked={options.every((element) => element === selectedOption)}
            className="checkbox checkbox-secondary border-slate-400"
          />
        </label>
      </div>
      <div className="form-control">
        <label className={`label gap-2 cursor-pointer`}>
          <span className="label-text">Female</span>
          <input
            type="checkbox"
            name="gender"
            onChange={(e) => handleChange(e)}
            checked={options.every((element) => element === selectedOption)}
            className="checkbox checkbox-secondary border-slate-400"
          />
        </label>
      </div>
      <div className="form-control">
        <label className={`label gap-2 cursor-pointer`}>
          <span className="label-text">Other</span>
          <input
            type="checkbox"
            name="gender"
            onChange={(e) => handleChange(e)}
            checked={options.every((element) => element === selectedOption)}
            className="checkbox checkbox-secondary border-slate-400"
          />
        </label>
      </div>
    </div>
  );
}
