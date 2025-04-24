// Place the file `Règlement intérieur de la bibliothèque ESTIN.pdf` inside your project's `public` folder

import { NextPage } from 'next';
import Head from 'next/head';

const Reglement: NextPage = () => {
  return (
    <>
      <Head>
        <title>Règlement intérieur de la bibliothèque ESTIN</title>
      </Head>
      <div style={{ width: '100%', height: '100vh' }}>
        <iframe
          src="/library-regulations.pdf"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </div>
    </>
  );
};

export default Reglement;
