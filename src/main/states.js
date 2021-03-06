import App from '../main/App';
import Welcome from '../main/Welcome';
import Login from '../main/Login';
import Home from '../main/Home';

/**
 * This is the parent state for the entire application.
 *
 * This state's primary purposes are:
 * 1) Shows the outermost chrome (including the navigation and logout for authenticated users)
 * 2) Provide a viewport (ui-view) for a substate to plug into
 */
const appState = {
  name: 'app',
  redirectTo: 'welcome',
  component: App
};

/**
 * This is the 'welcome' state.  It is the default state (as defined by app.js) if no other state
 * can be matched to the URL.
 */
const welcomeState = {
  parent: 'app',
  name: 'welcome',
  url: '/welcome',
  component: Welcome
};

/**
 * This is a home screen for authenticated users.
 *
 * It shows giant buttons which activate their respective submodules: Messages, Contacts, Preferences
 */
const homeState = {
  parent: 'app',
  name: 'home',
  url: '/home',
  component: Home
};


/**
 * This is the login state.  It is activated when the user navigates to /login, or if a unauthenticated
 * user attempts to access a protected state (or substate) which requires authentication. (see routerhooks/requiresAuth.js)
 *
 * It shows a fake login dialog and prompts the user to authenticate.  Once the user authenticates, it then
 * reactivates the state that the user originally came from.
 */
const loginState = {
  parent: 'app',
  name: 'login',
  url: '/login',
  component: Login,
  resolve: [
    {
      token: 'returnTo',
      deps: [ '$transition$' ],
      resolveFn: returnTo,
    },
  ]
};

/**
 * A resolve function for 'login' state which figures out what state to return to, after a successful login.
 *
 * If the user was initially redirected to login state (due to the requiresAuth redirect), then return the toState/params
 * they were redirected from.  Otherwise, if they transitioned directly, return the fromState/params.  Otherwise
 * return the main "app" state.
 */
function returnTo ($transition$) {
  if ($transition$.redirectedFrom()) {
    // The user was redirected to the login state (e.g., via the requiresAuth hook when trying to activate contacts)
    // Return to the original attempted target state (e.g., contacts)
    return $transition$.redirectedFrom().targetState();
  }

  let $state = $transition$.router.stateService;

  // The user was not redirected to the login state; they directly activated the login state somehow.
  // Return them to the state they came from.
  if ($transition$.from().name !== '') {
    return $state.target($transition$.from(), $transition$.params("from"));
  }

  // If the fromState's name is empty, then this was the initial transition. Just return them to the home state
  return $state.target('home');
}

// Future State (Placeholder) for the contacts module
export const contactsFutureState = {
  parent: 'app',
  name: 'contacts.**',
  url: '/contacts',
  lazyLoad: () => import('../contacts/states'),
};

// Future State (Placeholder) for the prefs module
export const prefsFutureState = {
  parent: 'app',
  name: 'prefs.**',
  url: '/prefs',
  lazyLoad: () => import('../prefs/states'),
};

// Future State (Placeholder) for the mymessages module
export const mymessagesFutureState = {
  parent: 'app',
  name: 'mymessages.**',
  url: '/mymessages',
  lazyLoad: () => import('../mymessages/states'),
};


export default [appState, welcomeState, homeState, loginState, contactsFutureState, prefsFutureState, mymessagesFutureState];
