import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Image, Input, Icon } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { UploadDiary } from './components/UploadDiary'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Diaries } from './components/Diaries'
import { EditDiary } from './components/EditDiary'
require('./App.css')

export interface AppProps { }

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState { }

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}
                  <div style={{ margin: '5em 0em' }}>
                    {this.generateCurrentPage()}
                  </div>
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu fixed="top" inverted>
        <Menu.Item>
          <Link to="/">
            <Image size="mini" src="https://react.semantic-ui.com/logo.png" ></Image>
          </Link>
        </Menu.Item>
        <Menu.Menu position="right">
          {this.logInLogOutButton()}
        </Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Diaries {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/diary/:diaryId/upload"
          exact
          render={props => {
            return <UploadDiary {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/diary/:diaryId/edit"
          exact
          render={props => {
            return <EditDiary {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
