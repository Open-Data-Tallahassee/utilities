import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Map from '../components/isolatedMap'

const Home: NextPage = () => {
  return (
    <div className="p-1 flex flex-col min-h-screen">
    
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Test: Isolated Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* middle section */}
      <div className=" mt-5 text-xl text-center sm: text-lg">
      <div id="title">How many power shutoffs happened where you live?</div>
        <div className="grid-cols-2 sm: grid-cols-2">
            <div className="mr-5"><Map/></div>
        </div>
      </div>

    </div>
    </div>
  )
}

export default Home