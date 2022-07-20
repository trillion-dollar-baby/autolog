import './ButtonAction.css';

export default function ButtonAction({label, color, buttonWidth, onClick}) {

    return (
        <div style={{backgroundColor: color, width: buttonWidth, textDecoration: 'none'}} onClick={onClick} className='button-action'>
            <span>{label}</span>
        </div>
    )
}