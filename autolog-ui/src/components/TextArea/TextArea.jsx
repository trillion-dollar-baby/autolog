import './TextArea.css'

/**
 * Based on data, TextArea will 
 * create a textarea tag that will handle a form key
 * along with a label that will need to be containerized to shape it
 */
export default function TextArea({ data, onChange, inputValue }) {
  return (
    <div className="form-input-gray">
      <label htmlFor={data.name}>
        {data.label || null}
      </label>

      <textarea
        name={data.name}
        type={data.type}
        placeholder={data.placeholder || null}
        value={inputValue}
        onChange={onChange}
      />

    </div>
  )

}