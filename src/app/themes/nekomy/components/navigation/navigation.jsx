import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import { ADMIN_LEVEL } from '../../../../core/constants/constants';
import Search from '../search/search';
import Icon from '../../../../core/common/lib/icon/icon';
import Trophy from '../../../../../../static/svg/trophy.svg';
import Calendar from '../../../../../../static/svg/calendar.svg';
import SearchIcon from '../../../../../../static/svg/search.svg';
import Close from '../../../../../../static/svg/x.svg';
import Forward from '../../../../../../static/svg/forward.svg';
import Course from '../../../../../../static/svg/course.svg';
import Admin from '../../../../../../static/svg/cog.svg';
import Dashboard from '../../../../../../static/svg/dashboard.svg';
import Team from '../../../../../../static/svg/team.svg';
import Account from '../../../../../../static/svg/account.svg';

const defaultProps = {
  nav_items: [
    {
      id: 0,
      title: 'Dashboard',
      icon: Dashboard,
      link: '/dashboard'
    }, {
      id: 12,
      title: 'Account',
      icon: Account,
      link: '/account'
    }, {
      id: 1,
      title: 'Courses',
      icon: Course,
      link: '/courses'
    }, {
      id: 6,
      title: 'About',
      icon: Team,
      children: [
        {
          id: 7,
          title: 'About',
          link: '/about'
        }, {
          id: 10,
          title: 'Contact',
          link: '/about/contact'
        }
      ]
    }, {
      id: 11,
      title: 'Admin',
      icon: Admin,
      link: '/admin',
      level: ADMIN_LEVEL
    }
  ]
};

const propTypes = {
  nav_items: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  toggleNav: PropTypes.func.isRequired,
  toggleSearch: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired
};

class Navigation extends Component {

  static clickItem(event) {
    const el = event.currentTarget.closest('.nav-item');
    el.classList.toggle('opened');
  }

  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(item, i) {
    // let itemActive = (this.props.location.pathname === item.link)
    //    ? 'active'
    //    : '',
    const hasChildren = (item.children)
        ? 'has-children'
        : '';

    return (!item.level || (item.level && this.props.userData && this.props.userData.info && item.level <= this.props.userData.info.level))
      ? <li key={i} className={`nav-item ${hasChildren}`}>
        {(item.icon)
          ? <Icon glyph={item.icon} className="icon item-icon" />
          : ''}
        {(item.children)
          ? <button className="title" onClick={Navigation.clickItem}>
            {item.title}<Icon glyph={Forward} className="icon arrow" />
          </button>
          : <Link to={item.link} className="title" onClick={this.props.toggleNav}>{item.title}</Link>}
        {(item.children)
          ? <ul className="nav-children">
            {item.children.map(child => <li key={child.id} className="nav-child">
              <Link to={child.link} onClick={this.props.toggleNav}>{child.title}</Link>
            </li>)}
          </ul>
          : ''}
      </li>
      : '';
  }

  render() {
    return (
      <nav className="navigation">
        <Breadcrumbs location={this.props.location} setItem={this.setItem} resetNav={this.resetNav} />
        <div className="sidenav js-sidenav flyout">
          <button
            className="mobile-close" onClick={() => {
              this.props.toggleNav();
            }}
          >
            <Icon glyph={Close} className="icon close" />
          </button>
          <table className="mobile-nav-items">
            <tbody>
              <tr>
                <td>
                  <button
                    className="mobile-nav-item" onClick={() => {
                      this.props.toggleSearch();
                    }}
                  >
                    <Icon glyph={SearchIcon} className="icon search" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="nav-scroll">
            <ul className="nav-items">
              {this.props.nav_items
                ? this.props.nav_items.map((item, i) => this.renderItem(item, i))
                : ''}
            </ul>
          </div>
        </div>
        <Search closeSearch={this.props.closeSearch} />
      </nav>
    );
  }
}

Navigation.propTypes = propTypes;
Navigation.defaultProps = defaultProps;

const mapStateToProps = ({
  mainReducer: {
    user,
    userData
  }
}) => ({ user, userData });

const enhance = compose(
  connect(mapStateToProps),
  firebaseConnect(props => ([`users/${props.user ? props.user.uid : null}`])),
  connect(({ firebase }, props) => ({
    userData: props.userData,
    userID: props.user ? props.user.uid : null
  }))
);

export default enhance(Navigation);

