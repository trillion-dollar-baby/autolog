import './ButtonAction.css';

import {motion} from 'framer-motion';

export default function ButtonAction({label, color, buttonWidth, onClick}) {

    return (
        <motion.div whileHover={{scale: 1.01}} whileTap={{scale:0.98}} style={{backgroundColor: color, width: buttonWidth, textDecoration: 'none'}} onClick={onClick} className='button-action'>
            <span>{label}</span>
        </motion.div>
    )
}