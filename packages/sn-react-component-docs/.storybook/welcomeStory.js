import React from 'react'
import { storiesOf } from '@storybook/react'

import imageFile from '../assets/img/sensenet-logo.png';

const image = {
    src: imageFile,
    alt: 'sensenet',
};

storiesOf('sensenet', module).add('Introduction', () => (
    <div style={styles.container}>
        <div style={styles.logoContainer}>
            <img width="300" src={image.src} alt={image.alt} />
        </div>
        <div style={styles.paragraphContainer}>
            <h1>Introduction</h1>
            <span>This is the guide for using sensenet, a flexible open-source development platform to deliver web based business applications.</span>
        </div>
        <div style={styles.paragraphContainer}>
            <h2>What is sensenet</h2>
            <span>sensenet is a <strong>central repository</strong> with an <strong>extendable API</strong> ready for integration. Enterprise grade <strong>security</strong> and <strong>permission system</strong> makes it a perfect core of any <strong>content management</strong> solution. The platform is highly <strong>modularized</strong> and ready to build your custom business solution and it also provides the possibility creating <strong>one page apps</strong> using your favourite JavaScript framework without a steep learning curve. You can find more about sensenet in general [here](/guide/introduction/what-is-sensenet).</span>
        </div>
    </div>
))

const styles = {
    container: {
        fontFamily: '-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue","Lucida Grande","Arial",sans-serif',
        padding: 20,
    },
    logoContainer: {
        width: 200,
        margin: '30px auto 50px'
    },
    paragraphContainer: {}
};
styles.firstCellContainer = { ...styles.cellContainer, marginRight: 20 };
