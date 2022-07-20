import './ButtonAction.css';

export default function ButtonAction({label, color, onClick}) {

    return (
        <div style={{backgroundColor: color}} onClick={onClick} className='button-action'>
            <span>{label}</span>
        </div>
    )
}