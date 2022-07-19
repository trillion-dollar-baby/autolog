import * as React from 'react';
import './Dashboard.css'
import emptyCheckbox from '../../assets/empty-checkbox.png'

export default function Dashboard() {
    return (
        <div className="dashboard">
            <div className="head">
                <div className="hello">
                    <h2 className="hey"> Welcome Back, </h2>
                </div>
                <div className="invite-bttn">
                    <button className="invite"> Invite </button>
                </div>
            </div>
            <div className="display">
                <div className="announcements">
                    <label className="title"> Announcements </label>
                    <input className="announcement-form" name="label" placeholder="Make an announcement here..."/>
                </div>
                <div className="checklist">
                    <label className="title"> Checklist </label>
                    <div className="check-items">
                        <div className="checkbox">
                            <img className="img" src={emptyCheckbox}></img>
                            <input className="list-form" name="checklist" placeholder="Enter a new list item..."/>
                        </div>
                        <div className="checkbox">
                            <img className="img" src={emptyCheckbox}></img>
                            <input className="list-form" name="checklist" placeholder="Enter a new list item..."/>
                        </div>
                        <div className="checkbox">
                            <img className="img" src={emptyCheckbox}></img>
                            <input className="list-form" name="checklist" placeholder="Enter a new list item..."/>
                        </div>
                        <button className="more-items">+</button>
                    </div>
                </div>
                </div> 
                <div className="logs">
                    <label className="title2">Latest Editions</label>
                </div>
                <div className="column-name"> 
                <table>
                    <thead>
                        <tr className='column-label'>
                            <th className='num1'>ID</th>
                            <th className='num1'>Date</th>
                            <th className='num1'>User</th>
                            <th className='num2'>Item ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="rows">
                            <td>12345</td>
                            <td>01-23-45</td>
                            <td>MoeElias</td>
                            <td>145678</td>      
                        </tr>
                    </tbody>
                </table>
                </div>

              
        </div>
    )
}

//checklist
//announcemnts
//log table