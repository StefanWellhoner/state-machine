import { FC } from "react";

type AddressDetailsProps = {
  onNext: () => void;
  onBack: () => void
}

const AddressDetails: FC<AddressDetailsProps> = ({ onNext, onBack }) => {
  return (
    <>
      <div className="form-input">
        <label htmlFor="street">Street Address</label>
        <input id="street" />
      </div>
      <div className="form-input">
        <label htmlFor="city">City</label>
        <input id="city" />
      </div>
      <div className="form-actions">
        <button onClick={onBack}>Back</button>
        <button onClick={onNext}>Next</button>
      </div>
    </>
  )
}

export default AddressDetails
