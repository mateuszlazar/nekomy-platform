import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { setUser, setPanel, setNotification } from '../../../../core/actions/actions';
import Navigation from '../navigation/navigation';
import Signup from '../signup/signup';
import Signin from '../signin/signin';
import { animateCss, hideElem, showElem } from '../../../../core/common/helpers';
import Icon from '../../../../core/common/lib/icon/icon';
import Update from '../../../../../../static/svg/update.svg';
import Calendar from '../../../../../../static/svg/calendar.svg';
import Search from '../../../../../../static/svg/search.svg';
import Close from '../../../../../../static/svg/x.svg';
import PowerOff from '../../../../../../static/svg/power-off.svg';

class TopNav extends Component {

  static toggleView(e) {
    if (e.currentTarget.checked) {
      document.querySelector('.js-page').classList.add('list-view');
    } else {
      document.querySelector('.js-page').classList.remove('list-view');
    }
  }

  static showForm(event) {
    const elemForm = document.querySelector('.user-form');
    const elemOverlay = document.querySelector('.js-overlay');
    if (elemForm) {
      elemForm.classList.remove('active');
    }
    event.target.nextElementSibling.classList.add('active');
    animateCss(showElem(elemOverlay), 'fade-in');
  }

  static closeForm() {
    const elForm = document.querySelector('.user-form');
    const elOverlay = document.querySelector('.js-overlay');
    if (elForm) {
      elForm.classList.remove('active');
    }
    animateCss(elOverlay, 'fade-out', () => { hideElem(elOverlay); });
  }

  constructor(props) {
    super(props);

    this.state = {
      avatar: '',
      searching: false,
      navigating: false,
      signUpView: false
    };

    this.toggleNav = this.toggleNav.bind(this);
    this.openNav = this.openNav.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
  }

  componentDidUpdate() {
    if (this.props.isDesktop === true) {
      document.querySelector('#mode').prop('checked', false);
      document.querySelector('.js-page').classList.remove('list-view');
    } else if (this.props.isDesktop === false) {
      document.querySelector('#mode').prop('checked', true);
      document.querySelector('.js-page').classList.add('list-view');
    }
  }

  toggleNav() {
    const el = document.querySelector('.js-sidenav');
    if (!el.classList.contains('opened')) {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  openNav() {
    const el = document.querySelector('.js-sidenav');
    if (!el.classList.contains('opened')) {
      document.querySelector('.flyout').classList.remove('opened');
      const elOverlay = document.querySelector('.js-overlay');
      animateCss(showElem(elOverlay), 'fade-in');
      el.classList.add('opened');
      el.classList.remove('closed');
      document.querySelector('.js-nav-icon').classList.add('opened');
      document.querySelector('.js-dropdown-panel').classList.remove('open');
      this.setState({ searching: false, navigating: true });
    }
  }

  closeNav() {
    const el = document.querySelector('.js-sidenav');
    if (el.classList.contains('opened')) {
      el.classList.remove('opened');
      el.classList.add('closed');
      document.querySelector('.js-overlay').click();
      document.querySelector('.js-nav-icon').classList.remove('opened');
      this.setState({ searching: false, navigating: false });
    }
  }

  toggleSearch() {
    const el = document.querySelector('.js-search-panel');
    if (!el.classList.contains('opened')) {
      this.openSearch();
    } else {
      this.closeSearch();
    }
  }

  openSearch() {
    const el = document.querySelector('.js-search-panel');
    if (!el.classList.contains('opened')) {
      document.querySelector('.flyout').classList.remove('opened');
      el.classList.add('opened');
      el.classList.remove('closed');
      document.querySelector('.js-nav-icon').classList.remove('opened');
      animateCss(showElem('.js-overlay'), 'fade-in');
      document.querySelector('.search-input').focus();
      document.querySelector('.js-dropdown-panel').classList.remove('open');
      this.setState({ searching: true, navigating: false });
    }
  }

  closeSearch() {
    const el = document.querySelector('.js-search-panel');
    if (el.classList.contains('opened')) {
      el.classList.remove('opened');
      el.classList.add('closed');
      document.querySelector('.js-overlay').click();
      this.setState({ searching: false, navigating: false });
    }
  }

  changePanel(panel) {
    this.closeNav();
    this.closeSearch();

    if (this.props.panel === panel) {
      this.props.setPanel('');
    } else {
      this.props.setPanel(panel);
    }
  }

  render() {
    return (
      <section className="top-nav js-top-nav">
        <div className="top-nav-bar">
          <button
            className="top-nav-item nav-icon js-nav-icon" onClick={() => {
              this.toggleNav();
            }}
          >
            <span />
            <span />
            <span />
            <span />
          </button>
          <button
            className="top-nav-item" onClick={() => {
              this.toggleSearch();
            }}
          >
            {this.state.searching
              ? <Icon glyph={Close} className="icon close-search" />
              : <Icon glyph={Search} className="icon search" />}
          </button>

          {(this.props.user)
            ? <button
              className="top-nav-item" onClick={() => {
                this.changePanel('calendar');
              }}
            >
              {this.props.panel === 'calendar'
                ? <Icon glyph={Close} />
                : <Icon glyph={Calendar} className="icon calendar" />}
            </button>
            : ''}

          {(this.props.user)
            ? <button
              className="top-nav-item" onClick={() => {
                this.changePanel('grades');
              }}
            >
              {this.props.panel === 'grades'
                ? <Icon glyph={Close} />
                : <Icon glyph={Update} className="icon trophy" />}
            </button>
            : ''}

          <Link to={`${this.props.user ? '/dashboard' : '/'}`} className="logo">
            iLearn
          </Link>

          {(!this.props.user || (this.props.user && !this.props.user.emailVerified))
            ? <div className="user-controls">
              <div className="user-controls-cta sign-in-cta">
                <button onClick={TopNav.showForm}>Sign in</button>
                { this.state.signUpView ?
                  <Signup switchToLogin={() => this.setState({ signUpView: false })} />
                :
                  <Signin switchToRegister={() => this.setState({ signUpView: true })} /> }
              </div>
            </div>
          : <div className="user-controls">

            <div className="user-controls-cta account-cta">
              <button
                onClick={() => {
                  this.props.firebase.auth().signOut();
                  this.props.setUser(null);
                }}
              >
                <Icon glyph={PowerOff} className="icon sign-out" />
              </button>
            </div>
          </div>
        }
        </div>
        <Navigation
          location={this.props.location}
          toggleNav={this.toggleNav}
          openNav={this.openNav}
          closeNav={this.closeNav}
          toggleSearch={this.toggleSearch}
          openSearch={this.openSearch}
          closeSearch={this.closeSearch}
          searching={this.state.searching}
          navigating={this.state.navigating}
        />
        <button
          className="overlay js-overlay" onClick={() => {
            this.closeNav();
            this.closeSearch();
            TopNav.closeForm();
          }}
        />
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    user,
    panel
  }
}) => ({ user, panel });

const mapDispatchToProps = {
  setUser,
  setPanel,
  setNotification
};

export default compose(
  firebaseConnect([
    'auth',
    'userData'
  ]),
  connect(state => ({
    user: state.firebase.data.auth,
    userData: state.firebase.data.userData
  })),
  connect(mapStateToProps, mapDispatchToProps)
)(TopNav);
