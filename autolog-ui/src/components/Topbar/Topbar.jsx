import { NavLink } from 'react-router-dom'
import './Topbar.css'

import _ from 'lodash';

/**
 * Navigation bar for subsections inside the application
 * 
 * @param {Array} routes Array of objects that contain <name> and link <to>  
 */
export default function Topbar({ routes }) {
  return (
    <nav className="topbar">
      {routes.map((item, idx) => {
        return (
          <NavLink className={({isActive}) => `topbar-item ${isActive ? 'focused' : ''}`}
            to={item.to}>
              <span className="topbar-item-text">{_.capitalize(item.name)}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}