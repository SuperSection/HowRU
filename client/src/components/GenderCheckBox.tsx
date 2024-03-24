
export default function GenderCheckBox() {

  return (
    <div className="flex gap-x-5 group-checked">
      <div className="form-control">
        <label className={`label gap-2 cursor-pointer`}>
          <span className="label-text">Male</span>
          <input
            type="checkbox"
            name="gender"
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
            className="checkbox checkbox-secondary border-slate-400"
          />
        </label>
      </div>
    </div>
  );
}
