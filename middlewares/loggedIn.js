import React from "react";
import Router from "next/router";
import Cookies from 'js-cookie';

export const loggedIn = (WrappedComponent) => {
    return class extends React.Component {
        // static async getInitialProps(ctx) {
        //     const wrappedComponentProps = WrappedComponent.getInitialProps
        //         ? await WrappedComponent.getInitialProps(ctx)
        //         : {};

        //     return { ...wrappedComponentProps };
        // }

        // componentDidMount() {
        //     const logged_in = Cookies.get('logged_in');
        //     const access_token = Cookies.get('accesToken');

        //     if (!logged_in || access_token === undefined) {
        //         sessionStorage.setItem('redirectUrl', Router.asPath);
        //         window.location.href = '/auth/login';
        //     } else if (sessionStorage.getItem('redirectUrl') === '/auth/login') {
        //         window.location.href = '/';
        //     }
        // }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};