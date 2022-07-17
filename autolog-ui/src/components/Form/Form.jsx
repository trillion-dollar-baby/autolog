import FormInput from '../FormInput/FormInput'
import './Form.css'

export default function Form({ formState, setFormState, formArray, onSubmit }) {
  const onChange = (event) => {
    console.log(formState);
    setFormState((prevForm) => ({
      ...prevForm,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <div className="form-gray">
      {formArray.map((item, idx) => {
        return (
          <FormInput
            key={idx}
            data={item}
            onChange={onChange}
            inputValue={formState[item.name] || undefined}
          />
        )
      })}
    </div>
  )

}