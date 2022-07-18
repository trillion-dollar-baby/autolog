import * as React from 'react';
import './Dashboard.css'
import emptyCheckbox from '../../assets/empty-checkbox.png'

export default function Dashboard() {
    return (
        <div className="dashboard">
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
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>User</th>
                            <th>Item ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12345</td>
                            <td>01-23-45</td>
                            <td>MoeElias</td>      
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