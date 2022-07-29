import './FormInput.css'

export default function FormInput({ data, onChange, inputValue, onkeypress}) {
  return (
    <div className="form-input-gray">
      <label htmlFor={data.name}>
        {data.label || null}
      </label>

      <input
        name={data.name}
        type={data.type}
        placeholder={data.placeholder || null}
        value={inputValue}
        onChange={onChange}
        onKeyPress ={onkeypress}
      />

    </div>
  )

}