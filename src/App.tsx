import React, {useCallback}from 'react';
import Test from './components/Test/index';
import styles from './App.less';
const App: React.FC = () => {
    const onChildHandler = useCallback(() => {
        console.log('onChild')
    }, []);
    return (
        <>
            <div className={styles.app}>
                <div className={styles.title}>app</div>
                <div className={styles.imgBox}>
                    <img src={require('@/assets/img/img.jpeg')} alt="" />
                </div>
            </div>
            <Test a={1} onChildHandler={onChildHandler} />
        </>
    )
}

export default App;
