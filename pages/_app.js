import App from 'next/app';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import baseUrl from '../utils/baseUrl';
import { redirectUser } from '../utils/authUser';
import Layout from '../components/Layout/Layout';
import 'semantic-ui-css/semantic.min.css';
import { Router } from 'next/router';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    //console.log(ctx);
    const { token } = parseCookies(ctx);

    let pageProps = {};

    const protectedRoutes =
      ctx.pathname === '/' ||
      ctx.pathname === '/complain' ||
      ctx.pathname === '/review' ||
      ctx.pathname === '/create-complain' ||
      ctx.pathname === '/resolved-complains' ||
      ctx.pathname === '/past-complain' ||
      ctx.pathname === '/registerAccount' ||
      ctx.pathname === '/user' ||
      ctx.pathname === '/complain-against';

    if (!token) {
      protectedRoutes && redirectUser(ctx, '/login');
    } else {
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      try {
        const res = await axios.get(`${baseUrl}/api/v1/user/me`, {
          headers: { Authorization: token },
        });

        const { user } = res.data;

        //if (user) !protectedRoutes && redirectUser(ctx, '/');

        pageProps.user = user;
      } catch (error) {
        destroyCookie(ctx, 'token');
        redirectUser(ctx, '/login');
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
