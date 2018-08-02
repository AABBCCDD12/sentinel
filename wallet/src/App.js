import React, { Component } from 'react';
import Home from './Components/Home';
import Create from './Components/Create';
import Dashboard from './Components/Dashboard';
import Authenticate from './Components/Authenticate';
import { checkKeystore } from './Actions/authentication.action';
import { defaultPageStyle } from './Assets/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLanguage, setComponent } from './Actions/authentication.action';
import TermsAndConditions from './Components/TermsAndConditions';
import { readFile } from './Utils/Keystore';
import { KEYSTORE_FILE } from './Actions/authentication.action';
const { ipcRenderer } = window.require('electron');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: 'en',
            component: null
        }
    }
    componentWillMount = () => {
        var that = this;
        document.getElementById('home').style.display = 'none';

        // Read keystore file
        readFile(KEYSTORE_FILE, function (err) {
            setTimeout(function () {
                if (err) that.props.setComponent('home');
                else that.props.setComponent('authenticate');
            }, 3000);
        })
    }

    componentDidMount = () => {
        ipcRenderer.on('lang', (event, arg) => {
            this.setState({ lang: arg }, () => {
                this.props.setLanguage(this.state.lang)
            })
        })
    }

    render() {
        let component = this.props.setComponentResponse;

        switch (component) {
            case 'create':
                {
                    return <Create />
                }
            case 'authenticate':
                {
                    return <Authenticate />
                }
            case 'dashboard':
                {
                    return <Dashboard />
                }
            case 'home':
                {
                    return <Home />
                }
            case 'terms':
                {
                    return <TermsAndConditions />
                }
            default:
                {
                    return <div style={defaultPageStyle.division}>
                        <img src='../src/Images/logo.jpeg' style={defaultPageStyle.image} />
                        <p style={defaultPageStyle.p}>Sentinel Security Group</p>
                        <img src='../src/Images/loading_home.gif' style={{}} />
                    </div>
                }
        }
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setLanguage: setLanguage,
        setComponent: setComponent
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        createAccountResponse: state.createAccount,
        setComponentResponse: state.setComponent
    }
}

export default connect(mapStateToProps, mapDispatchToActions)(App);