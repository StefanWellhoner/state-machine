import { FC } from "react";

type ConfirmationProps = {
  onBack: () => void;
  onSubmit: () => void;
}

const Confirmation: FC<ConfirmationProps> = ({ onSubmit, onBack }) => {
  return (
    <>
      <div className="form-input">
        <label htmlFor="first-name">Firstname</label>
        <input id="first-name" />
      </div>
      <div className="form-input">
        <label htmlFor="surname">Surname</label>
        <input id="surname" />
      </div>
      <div className="form-input">
        <label htmlFor="address">Address</label>
        <input id="address" />
      </div>
      <div className="form-input">
        <label htmlFor="city">City</label>
        <input id="city" />
      </div>
      <div className="form-actions">
        <button onClick={onBack}>Back</button>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </>
  )
}

export default Confirmation
