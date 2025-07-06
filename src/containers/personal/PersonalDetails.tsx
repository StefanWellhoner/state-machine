import { FC } from "react";

type PersonalDetailsProps = {
  onNext: () => void;
};

const PersonalDetails: FC<PersonalDetailsProps> = ({ onNext }) => {
  return (
    <>
      <div className="form-input">
        <label htmlFor="first-name">Firstname</label>
        <input id="first-name" />
      </div>
      <div className="form-input">
        <label htmlFor="family">Surname</label>
        <input id="family" />
      </div>
      <div className="form-actions">
        <button onClick={onNext} className="primary">
          Next
        </button>
      </div>
    </>
  );
};

export default PersonalDetails;
