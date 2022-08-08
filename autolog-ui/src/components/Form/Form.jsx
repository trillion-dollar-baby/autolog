import FormInput from '../FormInput/FormInput'
import './Form.css'

/**
 * Reusable Component for creating forms throughout the application
 * 
 * @param {useState} formState useState value
 * @param {useState} setFormState useState setter
 * @param {Array} formArray array of objects in each containing: label, name, type, and placeholder for the component to render
 */
export default function Form({ formState, setFormState, formArray }) {
  const onChange = (event) => {
    setFormState((prevForm) => ({
      ...prevForm,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <div className="form-gray">
      {/* add all items */}
      {formArray.map((item, idx) => {
        return (
          <div key={idx} className="user-form-input">
          <FormInput
            key={idx}
            data={item}
            onChange={onChange || undefined}
            inputValue={formState[item.name] || ''}
          />
          </div>
        )
      })}
    </div>
  )

}

// Example of what formArray should look like
Form.defaultProps = {
  formArray: [
    {
      label:'Label',
      name: 'name',
      type: 'text',
      placeholder: 'This is a placeholder'
    }
  ]
}