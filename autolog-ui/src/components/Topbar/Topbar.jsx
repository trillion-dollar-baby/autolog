import { NavLink, Link } from 'react-router-dom'
import ButtonAction from '../Button/ButtonAction';
import './Topbar.css'

import _ from 'lodash';

/**
 * Navigation bar for subsections inside the application
 * 
 * @param {Array} routes Array of objects that contain <name> and link <to> 
 * @param {String} buttonName The name of the button to render 
 */
export default function Topbar({ routes, buttonName, buttonPath }) {
  return (
    <nav className="topbar">
      {routes.map((item, idx) => {
        return (
          <NavLink key={idx} className={({isActive}) => `topbar-item ${isActive ? 'focused' : ''}`}
            to={item.to}>
              <span className="topbar-item-text">{_.capitalize(item.name)}</span>
          </NavLink>
        )
      })}
      <div className='button-space' >
        {buttonName ? <NavLink className='topbar-button' to={buttonPath} > <ButtonAction label={buttonName} color={"#2EAF79"} buttonWidth={"150px"}/> </NavLink> : null}
      </div>
    </nav>
  )
}