import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { setNotification } from '../../../../core/actions/actions';
import { hideElem, showElem } from '../../../../core/common/helpers';
import { USER_CONFIRM_EMAIL, PASSWORD_MATCH_ERROR } from '../../../../core/constants/constants';

class Signup extends Component {

  handleSignup(e) {
    e.preventDefault();

    const { password, password2, firstname, lastname } = this.refs;

    if (password.value === password2.value) {
      hideElem('.js-btn-signup');
      hideElem('.js-link-signin');
      showElem('.js-signup-loader');

      const email = String(this.refs.email.value);

      firebase.auth().createUserWithEmailAndPassword(email, password.value).then((user) => {
        this.saveUser(user, firstname.value, lastname.value, email);
      }).catch((error) => {
        showElem('.js-btn-signup');
        showElem('.js-link-signin');
        hideElem('.js-signup-loader');
        this.props.setNotification({ message: String(error), type: 'error' });
      });
    } else {
      this.props.setNotification({ message: PASSWORD_MATCH_ERROR, type: 'error' });
    }
  }

  saveUser(user, firstname, lastname, email) {
    return firebase.database().ref(`users/${user.uid}/info`).set({
      firstName: firstname,
      lastName1: lastname,
      email,
      displayName: `${firstname} ${lastname}`
    }).then(() => {
      user.sendEmailVerification();
      showElem('.js-btn-signup');
      showElem('.js-link-signin');
      hideElem('.js-signup-loader');
      document.querySelector('.js-overlay').click();
      this.props.setNotification({ message: USER_CONFIRM_EMAIL, type: 'success' });
    })
    .catch((error) => {
      showElem('.js-btn-signup');
      showElem('.js-link-signin');
      hideElem('.js-signup-loader');
      this.props.setNotification({ message: String(error), type: 'error' });
    });
  }

  render() {
    return (
      <form className={`user-form sign-up ${this.props.showClass}`} onSubmit={e => this.handleSignup(e)}>
        <input type="text" className="input-field" placeholder="First name" ref="firstname" />
        <input type="text" className="input-field" placeholder="Last name" ref="lastname" />
        <input type="email" className="input-field" placeholder="Email" ref="email" />
        <input type="password" className="input-field" placeholder="Password" ref="password" />
        <input type="password" className="input-field" placeholder="Repeat password" ref="password2" />
        <button type="submit" className="btn btn-primary js-btn-signup">Sign up</button>
        <a className="js-link-signin" onClick={this.props.switchToLogin}>I already have account</a>
        <div className="loader-small js-signup-loader" />
      </form>
    );
  }
}

const mapStateToProps = null;

const mapDispatchToProps = {
  setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
