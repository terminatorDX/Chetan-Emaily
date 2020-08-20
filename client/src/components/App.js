import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import { connect } from "react-redux";
import * as actions from "../actions";
import Landing from "./Landing";
import "materialize-css/dist/css/materialize.min.css";
import Dashboard from "./Dashboard";
import SurveyNew from "./Surveys/SurveyNew";

class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        return (
            <div className="container">
                <Router>
                    <Header />
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/surveys" component={Dashboard} />
                    <Route exact path="/surveys/new" component={SurveyNew} />
                </Router>
            </div>
        );
    }
}

export default connect(null, actions)(App);
