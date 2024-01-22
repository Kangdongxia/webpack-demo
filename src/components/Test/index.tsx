import React from 'react';
import { Button } from 'antd'
import styles from './index.less';
const Test =  function (props: any) {
    return (
        <div className={styles.root}>
            <div className={styles.content}>123</div>
            <Button type="primary">Primary Button</Button>
        </div>
    )
}

export default React.memo(Test);
