import React, {Component} from 'react';
import './NavBar.css'

class NavBar extends Component {
    render() {
        return (
            <div>
                <div className="topnav">
                    <a href="/">Home</a>
                    <a className={this.props.amministratore} href="/amministratore">Amministratore</a>
                    <a className={this.props.utente} href={"/utente/" + this.props.username}>Utente</a>
                    <a hidden={!this.props.flag} className={this.props.prenotazioni}
                       href={"/utente/" + this.props.username + "/prenotazioni"}>Prenotazioni</a>
                </div>
            </div>
        );
    }
}

export default NavBar;
