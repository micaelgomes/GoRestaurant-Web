import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { setLocale } from 'yup';

import Routes from './routes';

import GlobalStyle from './styles/global';

setLocale({
  mixed: {
    default: 'Não é válido',
    required: 'Campo obrigatório',
  },
});

const App: React.FC = () => (
  <>
    <GlobalStyle />
    <Router>
      <Routes />
    </Router>
  </>
);

export default App;
